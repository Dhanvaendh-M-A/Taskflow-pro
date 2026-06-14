import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Task, TaskAssignment, Project, TeamMember, ActivityLog } from "@/lib/models";
import { z } from "zod";
import mongoose from "mongoose";

const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string(),
  parentId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().optional().nullable(),
  assigneeIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Get tasks where user is creator or assigned
    const assignedTaskIds = await TaskAssignment.find({ userId }).distinct("taskId");
    const userProjectIds = await TeamMember.find({ userId }).distinct("projectId");

    const authFilters = [
      { creatorId: userId },
      { _id: { $in: assignedTaskIds } },
      { projectId: { $in: userProjectIds } },
    ];

    const query: any = {
      ...(projectId ? { projectId: new mongoose.Types.ObjectId(projectId) } : {}),
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      $or: authFilters,
    };

    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
        { $or: authFilters },
      ];
      delete query.$or;
    }

    const tasks = await Task.find(query)
      .populate("projectId", "name color")
      .populate("creatorId", "name image")
      .sort({ priority: -1, createdAt: -1 })
      .lean() as any[];

    // Get assignments for each task
    const taskIds = tasks.map((t: any) => t._id);
    const assignments = await TaskAssignment.find({ taskId: { $in: taskIds } })
      .populate("userId", "name image")
      .lean() as any[];

    const tasksWithAssignments = tasks.map((task: any) => ({
      ...task,
      id: (task._id as mongoose.Types.ObjectId).toString(),
      project: task.projectId,
      creator: task.creatorId,
      projectId: task.projectId?._id?.toString() || task.projectId,
      creatorId: task.creatorId?._id?.toString() || task.creatorId,
      assignments: assignments
        .filter((a: any) => a.taskId.toString() === (task._id as mongoose.Types.ObjectId).toString())
        .map((a: any) => ({ user: { ...a.userId, id: (a.userId._id as mongoose.Types.ObjectId).toString() } })),
      _count: { subtasks: 0, comments: 0 },
    }));

    return NextResponse.json(tasksWithAssignments);
  } catch (error) {
    console.error("GET tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const validated = taskSchema.parse(body);

    const task = await Task.create({
      title: validated.title,
      description: validated.description,
      status: validated.status || "TODO",
      priority: validated.priority || "MEDIUM",
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      projectId: new mongoose.Types.ObjectId(validated.projectId),
      parentId: validated.parentId ? new mongoose.Types.ObjectId(validated.parentId) : null,
      tags: validated.tags || [],
      estimatedHours: validated.estimatedHours,
      creatorId: new mongoose.Types.ObjectId(session.user.id),
    });

    // Create assignments if provided
    if (validated.assigneeIds?.length) {
      await TaskAssignment.insertMany(
        validated.assigneeIds.map((id) => ({
          taskId: task._id,
          userId: new mongoose.Types.ObjectId(id),
        }))
      );
    }

    // Create activity log
    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      taskId: task._id,
      projectId: task.projectId,
      action: "TASK_CREATED",
      description: `Created task "${task.title}"`,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "name color")
      .populate("creatorId", "name image")
      .lean() as any;

    if (!populatedTask) {
      return NextResponse.json({ error: "Task not found after creation" }, { status: 500 });
    }

    return NextResponse.json(
      {
        ...populatedTask,
        id: (populatedTask._id as mongoose.Types.ObjectId).toString(),
        project: populatedTask.projectId,
        creator: populatedTask.creatorId,
        assignments: [],
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("POST task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
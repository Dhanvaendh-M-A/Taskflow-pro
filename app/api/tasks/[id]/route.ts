import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Task, TaskAssignment, Comment, ActivityLog } from "@/lib/models";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const task = await Task.findById(id)
      .populate("projectId", "id name color")
      .populate("creatorId", "id name image")
      .lean();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const assignments = await TaskAssignment.find({ taskId: task._id })
      .populate("userId", "id name image")
      .lean();

    const subtasks = await Task.find({ parentId: task._id })
      .populate("assignments.userId", "name image")
      .lean();

    const comments = await Comment.find({ taskId: task._id })
      .populate("userId", "id name image")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ...task,
      id: task._id.toString(),
      project: task.projectId,
      creator: task.creatorId,
      assignments: assignments.map((a) => ({ user: { ...a.userId, id: a.userId._id.toString() } })),
      subtasks: subtasks.map((st) => ({ ...st, id: st._id.toString() })),
      comments: comments.map((c) => ({ ...c, id: c._id.toString(), user: { ...c.userId, id: c.userId._id.toString() } })),
      _count: {
        subtasks: subtasks.length,
        comments: comments.length,
      },
    });
  } catch (error) {
    console.error("GET task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "DONE") updateData.completedAt = new Date();
    }
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.estimatedHours !== undefined) updateData.estimatedHours = body.estimatedHours;
    if (body.actualHours !== undefined) updateData.actualHours = body.actualHours;

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
      .populate("projectId", "name color")
      .populate("creatorId", "name image")
      .lean();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      taskId: task._id,
      projectId: task.projectId?._id || task.projectId,
      action: "TASK_UPDATED",
      description: `Updated task "${task.title}"`,
      metadata: JSON.stringify(body),
    });

    return NextResponse.json({
      ...task,
      id: task._id.toString(),
      project: task.projectId,
      creator: task.creatorId,
    });
  } catch (error) {
    console.error("PATCH task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const task = await Task.findByIdAndDelete(id).lean();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Clean up related data
    await TaskAssignment.deleteMany({ taskId: task._id });
    await Comment.deleteMany({ taskId: task._id });
    await Task.deleteMany({ parentId: task._id });

    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      projectId: task.projectId,
      action: "TASK_DELETED",
      description: `Deleted task "${task.title}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

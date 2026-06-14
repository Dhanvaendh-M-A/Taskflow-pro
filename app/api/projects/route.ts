import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Project, TeamMember, Task, ActivityLog, type IProject } from "@/lib/models";
import { z } from "zod";
import mongoose from "mongoose";

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const teamProjectIds = await TeamMember.find({ userId }).distinct("projectId");

    const projects = await Project.find({
      $or: [
        { ownerId: userId },
        { _id: { $in: teamProjectIds } },
      ],
      status: "ACTIVE",
    })
      .populate("ownerId", "name image")
      .sort({ updatedAt: -1 })
      .lean() as unknown as Array<{
        _id: mongoose.Types.ObjectId;
        name: string;
        description?: string;
        color: string;
        status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
        ownerId: { _id: mongoose.Types.ObjectId; name?: string; image?: string };
        createdAt: Date;
        updatedAt: Date;
      }>;

    // Get counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ projectId: project._id });
        const memberCount = await TeamMember.countDocuments({ projectId: project._id });
        const owner = project.ownerId;
        return {
          ...project,
          id: project._id.toString(),
          owner: { ...owner, id: owner._id.toString() },
          ownerId: owner._id.toString(),
          _count: { tasks: taskCount, teamMembers: memberCount },
        };
      })
    );

    return NextResponse.json(projectsWithCounts);
  } catch (error) {
    console.error("GET projects error:", error);
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
    const validated = projectSchema.parse(body);

    const project = await Project.create({
      name: validated.name,
      description: validated.description,
      color: validated.color || "#6366f1",
      ownerId: new mongoose.Types.ObjectId(session.user.id),
    });

    // Add creator as owner in team members
    await TeamMember.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      projectId: project._id,
      role: "OWNER",
    });

    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      projectId: project._id,
      action: "PROJECT_CREATED",
      description: `Created project "${project.name}"`,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("ownerId", "name image")
      .lean() as unknown as ({
        _id: mongoose.Types.ObjectId;
        name: string;
        description?: string;
        color: string;
        status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
        ownerId: { _id: mongoose.Types.ObjectId; name?: string; image?: string };
        createdAt: Date;
        updatedAt: Date;
      } | null);

    if (!populatedProject) {
      return NextResponse.json({ error: "Project not found after creation" }, { status: 500 });
    }

    const owner = populatedProject.ownerId;

    return NextResponse.json(
      {
        ...populatedProject,
        id: populatedProject._id.toString(),
        owner: { ...owner, id: owner._id.toString() },
        _count: { tasks: 0, teamMembers: 1 },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("POST project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

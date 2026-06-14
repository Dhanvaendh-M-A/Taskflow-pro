import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Task, TaskAssignment, TeamMember, ActivityLog, type IActivityLog } from "@/lib/models";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const assignedTaskIds = await TaskAssignment.find({ userId }).distinct("taskId");
    const teamProjectIds = await TeamMember.find({ userId }).distinct("projectId");

    const taskQuery = {
      $or: [
        { creatorId: userId },
        { _id: { $in: assignedTaskIds } },
        { projectId: { $in: teamProjectIds } },
      ],
    };

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
      weeklyTasks,
      recentActivity,
    ] = await Promise.all([
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: "DONE" }),
      Task.countDocuments({ ...taskQuery, status: "IN_PROGRESS" }),
      Task.countDocuments({ ...taskQuery, status: { $ne: "DONE" }, dueDate: { $lt: now } }),
      Task.aggregate([
        { $match: taskQuery },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: taskQuery },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      Task.find({
        ...taskQuery,
        createdAt: { $gte: weekAgo },
      })
        .select("status createdAt completedAt")
        .lean(),
      ActivityLog.find({ userId })
        .populate("userId", "name image")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean() as unknown as Array<{
          _id: mongoose.Types.ObjectId;
          userId: { _id: mongoose.Types.ObjectId; name?: string; image?: string };
          action: string;
          description: string;
          metadata?: string;
          createdAt: Date;
        }>,
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Process weekly progress
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = days.map((day, index) => {
      const dayDate = new Date(weekAgo);
      dayDate.setDate(dayDate.getDate() + index);
      const dayStr = dayDate.toISOString().split("T")[0];

      const completed = weeklyTasks.filter(
        (t: any) => t.completedAt && t.completedAt.toISOString().split("T")[0] === dayStr
      ).length;
      const created = weeklyTasks.filter(
        (t: any) => t.createdAt.toISOString().split("T")[0] === dayStr
      ).length;

      return { day, completed, created };
    });

    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      tasksByStatus: tasksByStatus.map((t: any) => ({ status: t._id, count: t.count })),
      tasksByPriority: tasksByPriority.map((t: any) => ({ priority: t._id, count: t.count })),
      weeklyProgress: weeklyData,
      recentActivity: recentActivity.map((a: any) => ({
        ...a,
        id: (a._id as mongoose.Types.ObjectId).toString(),
        user: { ...a.userId, id: (a.userId._id as mongoose.Types.ObjectId).toString() },
      })),
    });
  } catch (error) {
    console.error("GET dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

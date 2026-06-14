import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/lib/models";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const query: any = { userId };
    if (unreadOnly) query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    return NextResponse.json({
      notifications: notifications.map((n: any) => ({ ...n, id: (n._id as mongoose.Types.ObjectId).toString() })),
      unreadCount,
    });
  } catch (error) {
    console.error("GET notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id, readAll } = await request.json();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    if (readAll) {
      await Notification.updateMany({ userId, read: false }, { read: true });
      return NextResponse.json({ success: true });
    }

    if (id) {
      await Notification.findOneAndUpdate({ _id: id, userId }, { read: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("PATCH notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

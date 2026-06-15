import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (err) {
    console.error("Health check DB error:", err);
    return NextResponse.json({ status: "error", message: "db connection failed" }, { status: 500 });
  }
}

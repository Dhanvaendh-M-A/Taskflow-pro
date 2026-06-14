import connectDB from "../lib/mongodb";
import mongoose from "mongoose";

async function createIndexes() {
  await connectDB();

  console.log("Creating indexes...");

  // Task indexes
  await mongoose.connection.collection("tasks").createIndex({ projectId: 1 });
  await mongoose.connection.collection("tasks").createIndex({ status: 1 });
  await mongoose.connection.collection("tasks").createIndex({ priority: 1 });
  await mongoose.connection.collection("tasks").createIndex({ dueDate: 1 });
  await mongoose.connection.collection("tasks").createIndex({ creatorId: 1 });
  await mongoose.connection.collection("tasks").createIndex({ title: "text", description: "text" });

  // User indexes
  await mongoose.connection.collection("users").createIndex({ email: 1 }, { unique: true });

  // TeamMember indexes
  await mongoose.connection.collection("teammembers").createIndex({ userId: 1, projectId: 1 }, { unique: true });

  // TaskAssignment indexes
  await mongoose.connection.collection("taskassignments").createIndex({ taskId: 1, userId: 1 }, { unique: true });

  // Notification indexes
  await mongoose.connection.collection("notifications").createIndex({ userId: 1, read: 1 });

  // ActivityLog indexes
  await mongoose.connection.collection("activitylogs").createIndex({ userId: 1, createdAt: -1 });

  console.log("✅ All indexes created successfully!");
  process.exit(0);
}

createIndexes().catch((err) => {
  console.error("❌ Error creating indexes:", err);
  process.exit(1);
});

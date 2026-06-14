import connectDB from "../lib/mongodb";
import {
  User,
  Project,
  TeamMember,
  Task,
  TaskAssignment,
  ActivityLog,
  Notification,
} from "../lib/models";
import mongoose from "mongoose";

async function seed() {
  await connectDB();
  console.log("🌱 Seeding database...");

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    TeamMember.deleteMany({}),
    Task.deleteMany({}),
    TaskAssignment.deleteMany({}),
    ActivityLog.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // Create demo user
  const demoUser = await User.create({
    name: "Demo User",
    email: "demo@taskflow.pro",
    password: "demo123456",
    role: "ADMIN",
  });

  const secondUser = await User.create({
    name: "Sarah Chen",
    email: "sarah@example.com",
    password: "password123",
    role: "USER",
  });

  const thirdUser = await User.create({
    name: "Mike Ross",
    email: "mike@example.com",
    password: "password123",
    role: "USER",
  });

  console.log("✅ Users created");

  // Create projects
  const projects = await Project.insertMany([
    {
      name: "Website Redesign",
      description: "Complete overhaul of the company website with modern design",
      color: "#6366f1",
      status: "ACTIVE",
      ownerId: demoUser._id,
    },
    {
      name: "Mobile App",
      description: "Cross-platform mobile application for iOS and Android",
      color: "#ec4899",
      status: "ACTIVE",
      ownerId: demoUser._id,
    },
    {
      name: "API Development",
      description: "RESTful API development for third-party integrations",
      color: "#10b981",
      status: "ACTIVE",
      ownerId: secondUser._id,
    },
  ]);

  console.log("✅ Projects created");

  // Create team members
  await TeamMember.insertMany([
    { userId: demoUser._id, projectId: projects[0]._id, role: "OWNER" },
    { userId: secondUser._id, projectId: projects[0]._id, role: "MEMBER" },
    { userId: thirdUser._id, projectId: projects[0]._id, role: "MEMBER" },
    { userId: demoUser._id, projectId: projects[1]._id, role: "OWNER" },
    { userId: secondUser._id, projectId: projects[1]._id, role: "ADMIN" },
    { userId: secondUser._id, projectId: projects[2]._id, role: "OWNER" },
  ]);

  console.log("✅ Team members created");

  // Create tasks
  const tasks = await Task.insertMany([
    {
      title: "Design homepage mockups",
      description: "Create Figma mockups for the new homepage design",
      status: "DONE",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      projectId: projects[0]._id,
      creatorId: demoUser._id,
      tags: ["design", "figma"],
      estimatedHours: 8,
      completedAt: new Date(),
    },
    {
      title: "Implement authentication flow",
      description: "Set up NextAuth with credentials and OAuth providers",
      status: "IN_PROGRESS",
      priority: "URGENT",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      projectId: projects[0]._id,
      creatorId: demoUser._id,
      tags: ["auth", "nextauth"],
      estimatedHours: 12,
    },
    {
      title: "Build responsive navigation",
      description: "Create mobile-first responsive navigation component",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      projectId: projects[0]._id,
      creatorId: secondUser._id,
      tags: ["ui", "responsive"],
      estimatedHours: 6,
    },
    {
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment",
      status: "IN_REVIEW",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      projectId: projects[1]._id,
      creatorId: demoUser._id,
      tags: ["devops", "github-actions"],
      estimatedHours: 4,
    },
    {
      title: "Implement push notifications",
      description: "Add Firebase Cloud Messaging for push notifications",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: projects[1]._id,
      creatorId: secondUser._id,
      tags: ["mobile", "firebase"],
      estimatedHours: 10,
    },
    {
      title: "Design database schema",
      description: "Create MongoDB schema design for the application",
      status: "DONE",
      priority: "HIGH",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      projectId: projects[2]._id,
      creatorId: secondUser._id,
      tags: ["database", "mongodb"],
      estimatedHours: 6,
      completedAt: new Date(),
    },
    {
      title: "Write API documentation",
      description: "Document all API endpoints with Swagger/OpenAPI",
      status: "IN_PROGRESS",
      priority: "LOW",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      projectId: projects[2]._id,
      creatorId: thirdUser._id,
      tags: ["documentation", "api"],
      estimatedHours: 8,
    },
    {
      title: "Performance optimization",
      description: "Optimize database queries and implement caching",
      status: "TODO",
      priority: "URGENT",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      projectId: projects[2]._id,
      creatorId: demoUser._id,
      tags: ["performance", "optimization"],
      estimatedHours: 16,
    },
  ]);

  console.log("✅ Tasks created");

  // Create task assignments
  await TaskAssignment.insertMany([
    { taskId: tasks[0]._id, userId: secondUser._id },
    { taskId: tasks[1]._id, userId: demoUser._id },
    { taskId: tasks[2]._id, userId: thirdUser._id },
    { taskId: tasks[3]._id, userId: secondUser._id },
    { taskId: tasks[4]._id, userId: thirdUser._id },
    { taskId: tasks[5]._id, userId: secondUser._id },
    { taskId: tasks[6]._id, userId: thirdUser._id },
    { taskId: tasks[7]._id, userId: demoUser._id },
  ]);

  console.log("✅ Task assignments created");

  // Create activity logs
  await ActivityLog.insertMany([
    {
      userId: demoUser._id,
      taskId: tasks[0]._id,
      projectId: projects[0]._id,
      action: "TASK_CREATED",
      description: "Created task "Design homepage mockups"",
    },
    {
      userId: demoUser._id,
      taskId: tasks[1]._id,
      projectId: projects[0]._id,
      action: "TASK_CREATED",
      description: "Created task "Implement authentication flow"",
    },
    {
      userId: secondUser._id,
      projectId: projects[0]._id,
      action: "PROJECT_CREATED",
      description: "Created project "Website Redesign"",
    },
    {
      userId: demoUser._id,
      taskId: tasks[3]._id,
      projectId: projects[1]._id,
      action: "TASK_UPDATED",
      description: "Updated task "Setup CI/CD pipeline"",
    },
    {
      userId: thirdUser._id,
      taskId: tasks[6]._id,
      projectId: projects[2]._id,
      action: "TASK_CREATED",
      description: "Created task "Write API documentation"",
    },
  ]);

  console.log("✅ Activity logs created");

  // Create notifications
  await Notification.insertMany([
    {
      userId: secondUser._id,
      type: "TASK_ASSIGNED",
      title: "New task assigned",
      message: "You have been assigned to "Design homepage mockups"",
      read: false,
    },
    {
      userId: thirdUser._id,
      type: "TASK_ASSIGNED",
      title: "New task assigned",
      message: "You have been assigned to "Build responsive navigation"",
      read: true,
    },
    {
      userId: demoUser._id,
      type: "TASK_DUE_SOON",
      title: "Task due soon",
      message: ""Implement authentication flow" is due in 2 days",
      read: false,
    },
  ]);

  console.log("✅ Notifications created");

  console.log("
🎉 Database seeded successfully!");
  console.log("
Demo credentials:");
  console.log("  Email: demo@taskflow.pro");
  console.log("  Password: demo123456");
  console.log("
You can now log in and explore the app!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});

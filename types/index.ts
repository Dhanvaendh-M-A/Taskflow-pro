export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  _count?: { tasks: number; teamMembers: number };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  projectId: string;
  creatorId: string;
  parentId: string | null;
  position: number;
  tags: string[];
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  project: Project;
  creator: User;
  assignments: { user: User }[];
  subtasks: Task[];
  comments: Comment[];
  _count?: { subtasks: number; comments: number };
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  taskId: string | null;
  projectId: string | null;
  action: string;
  description: string;
  metadata: string | null;
  createdAt: string;
  user: User;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  tasksByStatus: { status: string; count: number }[];
  tasksByPriority: { priority: string; count: number }[];
  weeklyProgress: { day: string; completed: number; created: number }[];
  recentActivity: ActivityLog[];
}

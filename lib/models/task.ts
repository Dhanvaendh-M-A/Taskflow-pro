import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date;
  projectId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  position: number;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String },
    status: { type: String, enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "CANCELLED"], default: "TODO" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
    dueDate: { type: Date },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Task" },
    position: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    estimatedHours: { type: Number },
    actualHours: { type: Number },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ creatorId: 1 });

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  action: string;
  description: string;
  metadata?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    action: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: String },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

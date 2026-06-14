import mongoose, { Schema, Document } from "mongoose";

export interface ITaskAssignment extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const TaskAssignmentSchema = new Schema<ITaskAssignment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

TaskAssignmentSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export const TaskAssignment = mongoose.models.TaskAssignment || mongoose.model<ITaskAssignment>("TaskAssignment", TaskAssignmentSchema);

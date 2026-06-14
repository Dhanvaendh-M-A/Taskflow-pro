import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

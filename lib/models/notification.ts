import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "TASK_ASSIGNED" | "TASK_COMPLETED" | "TASK_DUE_SOON" | "COMMENT_ADDED" | "PROJECT_INVITE" | "MENTION";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["TASK_ASSIGNED", "TASK_COMPLETED", "TASK_DUE_SOON", "COMMENT_ADDED", "PROJECT_INVITE", "MENTION"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

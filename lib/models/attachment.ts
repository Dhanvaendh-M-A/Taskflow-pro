import mongoose, { Schema, Document } from "mongoose";

export interface IAttachment extends Document {
  name: string;
  url: string;
  type: string;
  size: number;
  taskId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export const Attachment = mongoose.models.Attachment || mongoose.model<IAttachment>("Attachment", AttachmentSchema);

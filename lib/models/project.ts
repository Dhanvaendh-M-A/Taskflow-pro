import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  color: string;
  status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String, default: "#6366f1" },
    status: { type: String, enum: ["ACTIVE", "ARCHIVED", "COMPLETED"], default: "ACTIVE" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

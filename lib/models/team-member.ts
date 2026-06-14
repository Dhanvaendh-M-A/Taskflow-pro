import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  joinedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    role: { type: String, enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"], default: "MEMBER" },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

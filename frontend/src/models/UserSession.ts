import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSession extends Document {
  sessionId: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: Date;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSessionSchema = new Schema<IUserSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    deviceInfo: { type: String, default: "Unknown Browser / Device" },
    ipAddress: { type: String, default: "127.0.0.1" },
    lastActive: { type: Date, default: Date.now },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserSession: Model<IUserSession> =
  mongoose.models.UserSession ||
  mongoose.model<IUserSession>("UserSession", userSessionSchema);

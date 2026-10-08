import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSessionLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isp?: string;
}

export interface IUserSession extends Document {
  sessionId: string;
  userId: string;
  email?: string;
  ipAddress: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
  location: IUserSessionLocation;
  loginAt: Date;
  lastActive: Date;
  revoked: boolean;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSessionSchema = new Schema<IUserSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    ipAddress: { type: String, default: "127.0.0.1" },
    deviceType: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Desktop",
    },
    deviceBrand: { type: String, default: "Generic" },
    deviceModel: { type: String, default: "Unknown Device" },
    os: { type: String, default: "Unknown OS" },
    browser: { type: String, default: "Unknown Browser" },
    location: {
      city: { type: String, default: "Unknown City" },
      region: { type: String, default: "" },
      country: { type: String, default: "Unknown Country" },
      countryCode: { type: String, default: "" },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      timezone: { type: String, default: "" },
      isp: { type: String, default: "" },
    },
    loginAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    revoked: { type: Boolean, default: false },
    userAgent: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret.sessionId || ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  }
);

export const UserSession: Model<IUserSession> =
  mongoose.models.UserSession ||
  mongoose.model<IUserSession>("UserSession", userSessionSchema);

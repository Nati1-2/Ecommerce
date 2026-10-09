import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  latitude?: number;
  longitude?: number;
}

export interface IVisitorSource {
  type: string;
  name: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface IVisitorLog extends Document {
  sessionId: string;
  ip: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Bot" | "Unknown";
  deviceModel: string;
  deviceBrand?: string;
  os: string;
  browser: string;
  location: IVisitorLocation;
  source: IVisitorSource;
  path: string;
  status: "online" | "idle" | "exited";
  durationSeconds: number;
  visitedAt: Date;
  screenResolution?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitorLogSchema = new Schema<IVisitorLog>(
  {
    sessionId: { type: String, required: true, index: true },
    ip: { type: String, required: true, index: true },
    deviceType: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Bot", "Unknown"],
      default: "Desktop",
      index: true,
    },
    deviceModel: { type: String, default: "Standard Device" },
    deviceBrand: { type: String, default: "Generic" },
    os: { type: String, default: "Unknown OS", index: true },
    browser: { type: String, default: "Web Browser" },
    location: {
      city: { type: String, default: "Unknown City" },
      region: { type: String, default: "" },
      country: { type: String, default: "United States", index: true },
      countryCode: { type: String, default: "US" },
      flag: { type: String, default: "🌐" },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    source: {
      type: {
        type: String,
        enum: [
          "Social Media",
          "Search Engine",
          "Direct",
          "Referral",
          "Campaign / Ad",
          "Email",
          "Other",
        ],
        default: "Direct",
        index: true,
      },
      name: { type: String, default: "Direct Access" },
      referrer: { type: String, default: "" },
      utmSource: { type: String, default: "" },
      utmMedium: { type: String, default: "" },
      utmCampaign: { type: String, default: "" },
    },
    path: { type: String, default: "/", index: true },
    status: {
      type: String,
      enum: ["online", "idle", "exited"],
      default: "online",
      index: true,
    },
    durationSeconds: { type: Number, default: 30 },
    visitedAt: { type: Date, default: Date.now, index: true },
    screenResolution: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.sessionId;
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  }
);

// Optimize queries for recent visitors and analytics aggregation
visitorLogSchema.index({ visitedAt: -1 });
visitorLogSchema.index({ "source.type": 1, visitedAt: -1 });

export const VisitorLog: Model<IVisitorLog> =
  mongoose.models.VisitorLog ||
  mongoose.model<IVisitorLog>("VisitorLog", visitorLogSchema);

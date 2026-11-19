import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonation extends Document {
  referenceId: string;
  donorEmail: string;
  donorName: string;
  payoneerEmail: string;
  amount: number;
  currency: string;
  message?: string;
  status: "COMPLETED" | "PENDING";
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
    donorEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    donorName: { type: String, default: "Generous Supporter", trim: true },
    payoneerEmail: { type: String, required: true, trim: true, lowercase: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "USD", uppercase: true },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["COMPLETED", "PENDING"],
      default: "COMPLETED",
      index: true,
    },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id ? ret._id.toString() : ret.referenceId;
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  }
);

export const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", donationSchema);

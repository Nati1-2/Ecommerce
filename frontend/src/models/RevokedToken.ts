import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRevokedToken extends Document {
  tokenHash: string;
  revokedAt: Date;
  expiresAt: Date;
}

const revokedTokenSchema = new Schema<IRevokedToken>(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    revokedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export const RevokedToken: Model<IRevokedToken> =
  mongoose.models.RevokedToken ||
  mongoose.model<IRevokedToken>("RevokedToken", revokedTokenSchema);

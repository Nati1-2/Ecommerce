import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "CUSTOMER" | "ADMIN" | "VENDOR";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: UserRole;
  name?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "VENDOR"],
      default: "CUSTOMER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

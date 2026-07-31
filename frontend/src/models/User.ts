import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "CUSTOMER" | "ADMIN" | "VENDOR";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  membership?: string;
  points?: number;
  stripeCustomerId?: string;
  addresses?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }>;
  paymentMethods?: Array<{
    id: string;
    cardBrand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  }>;
  wishlist?: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
    rating?: number;
    inStock?: boolean;
  }>;
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
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    stripeCustomerId: {
      type: String,
      default: "",
    },
    addresses: {
      type: Array,
      default: [],
    },
    paymentMethods: {
      type: Array,
      default: [],
    },
    wishlist: {
      type: Array,
      default: [],
    },
    membership: {
      type: String,
      default: "Standard Member",
    },
    points: {
      type: Number,
      default: 100,
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
        delete (ret as any)._id;
        delete (ret as any).__v;
        delete (ret as any).password;
      },
    },
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

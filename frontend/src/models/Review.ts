import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  reply?: {
    text: string;
    repliedAt: string;
  };
  status: "Published" | "Hidden" | "Pending";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, default: "" },
    productImage: { type: String, default: "" },
    vendorId: { type: String, required: true, index: true },
    customerId: { type: String, required: true },
    customerName: { type: String, default: "Anonymous" },
    customerAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    reply: {
      text: { type: String },
      repliedAt: { type: String },
    },
    status: {
      type: String,
      enum: ["Published", "Hidden", "Pending"],
      default: "Published",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  }
);

reviewSchema.index({ vendorId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

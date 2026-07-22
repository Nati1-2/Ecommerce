import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  subcategory?: string;
  images: string[];
  sellerId: string;
  rating: number;
  ratingsCount: number;
  stock: number;
  isActive: boolean;
  tags: string[];
  brand: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, default: "" },
    images: [{ type: String }],
    sellerId: { type: String, required: true, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String }],
    brand: { type: String, default: "", trim: true },
    sku: { type: String, sparse: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

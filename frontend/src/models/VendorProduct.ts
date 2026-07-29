import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendorProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  taxRate: number;
  stock: number;
  warehouseLocation: string;
  lowStockThreshold: number;
  status: "Active" | "Draft" | "Paused" | "Pending";
  approvalMessage?: string;
  images: string[];
  variants: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
  }[];
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  deliveryTimeDays: string;
  seoTitle?: string;
  metaDescription?: string;
  salesCount: number;
  revenueGenerated: number;
  vendorId: string; // linked to User._id
  createdAt: Date;
  updatedAt: Date;
}

const vendorProductSchema = new Schema<IVendorProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    brand: { type: String, default: "" },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number },
    currency: { type: String, default: "USD" },
    taxRate: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    warehouseLocation: { type: String, default: "" },
    lowStockThreshold: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["Active", "Draft", "Paused", "Pending"],
      default: "Draft",
    },
    approvalMessage: { type: String },
    images: [{ type: String }],
    variants: [
      {
        id: String,
        name: String,
        sku: String,
        price: Number,
        stock: Number,
        attributes: { type: Map, of: String },
      },
    ],
    weightKg: { type: Number, default: 1 },
    dimensionsCm: {
      length: { type: Number, default: 10 },
      width: { type: Number, default: 10 },
      height: { type: Number, default: 10 },
    },
    deliveryTimeDays: { type: String, default: "2-4 Business Days" },
    seoTitle: { type: String },
    metaDescription: { type: String },
    salesCount: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    vendorId: { type: String, required: true, index: true },
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

vendorProductSchema.index({ vendorId: 1, status: 1 });
vendorProductSchema.index({ sku: 1, vendorId: 1 }, { unique: true });

export const VendorProduct: Model<IVendorProduct> =
  mongoose.models.VendorProduct ||
  mongoose.model<IVendorProduct>("VendorProduct", vendorProductSchema);

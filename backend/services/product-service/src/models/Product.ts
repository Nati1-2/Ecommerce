import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  vendorId: string;
  categoryId: string;
  images: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  variants: Array<{
    sku: string;
    attributes: Record<string, string>;
    price: number;
    stockQuantity: number;
  }>;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  ratingAverage: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    vendorId: { type: String, required: true, index: true },
    categoryId: { type: String, required: true, index: true },
    images: [{ url: String, alt: String, isPrimary: Boolean }],
    variants: [
      {
        sku: { type: String, required: true },
        attributes: { type: Map, of: String },
        price: { type: Number, required: true },
        stockQuantity: { type: Number, default: 0 }
      }
    ],
    status: { type: String, enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'], default: 'ACTIVE', index: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

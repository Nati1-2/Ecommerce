import mongoose, { Schema, Document } from 'mongoose';
import { IVariant } from './Variant.js';

export interface IProductImage {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

export interface IProduct extends Document {
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  images: IProductImage[];
  categoryId: Schema.Types.ObjectId;
  price: number;
  discountPrice?: number;
  variants: IVariant[];
  brand?: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'OUT_OF_STOCK';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    vendorId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    variants: [
      {
        color: { type: String },
        size: { type: String },
        sku: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 }
      }
    ],
    brand: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'OUT_OF_STOCK'],
      default: 'PENDING_APPROVAL',
      index: true
    }
  },
  { timestamps: true }
);

// Name text index for full-text search fallback
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

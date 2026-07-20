import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
  name: string;
  options: string[];
  priceModifier: number;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  subcategory: string;
  images: string[];
  variants: IVariant[];
  sellerId: string;
  rating: number;
  ratingsCount: number;
  stock: number;
  isActive: boolean;
  tags: string[];
  brand: string;
  sku: string;
  weight: number | null;
  dimensions: IDimensions | null;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true },
    options: [{ type: String }],
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const dimensionsSchema = new Schema<IDimensions>(
  {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      default: '',
    },
    images: [{ type: String }],
    variants: [variantSchema],
    sellerId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: [{ type: String }],
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    weight: {
      type: Number,
      default: null,
    },
    dimensions: {
      type: dimensionsSchema,
      default: null,
    },
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

// Compound indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);

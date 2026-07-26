import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  vendorId: string;
  storeName: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  rating: number;
  totalProducts: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    vendorId: { type: String, required: true, index: true },
    storeName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    logo: { type: String },
    banner: { type: String },
    address: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalProducts: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

export const Store = mongoose.model<IStore>('Store', StoreSchema);

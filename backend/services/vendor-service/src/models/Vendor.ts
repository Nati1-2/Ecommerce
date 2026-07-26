import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  userId: string;
  businessName: string;
  email: string;
  phone: string;
  description?: string;
  logo?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  commissionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    description: { type: String },
    logo: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'BLOCKED'],
      default: 'ACTIVE',
      index: true
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    commissionPercentage: { type: Number, default: 10, min: 0, max: 100 }
  },
  { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorAnalytics extends Document {
  vendorId: string;
  totalSales: number;
  totalRevenue: number;
  lowStockCount: number;
  lastOrderAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VendorAnalyticsSchema = new Schema<IVendorAnalytics>({
  vendorId: { type: String, required: true, unique: true, index: true },
  totalSales: { type: Number, required: true, default: 0, min: 0 },
  totalRevenue: { type: Number, required: true, default: 0, min: 0 },
  lowStockCount: { type: Number, required: true, default: 0, min: 0 },
  lastOrderAt: { type: Date }
}, { timestamps: true });

export const VendorAnalytics = mongoose.model<IVendorAnalytics>('VendorAnalytics', VendorAnalyticsSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyAnalytics extends Document {
  date: string; // Formatted YYYY-MM-DD
  totalRevenue: number;
  totalOrders: number;
  successfulPayments: number;
  failedPayments: number;
  itemsSold: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyAnalyticsSchema = new Schema<IDailyAnalytics>({
  date: { type: String, required: true, unique: true, index: true },
  totalRevenue: { type: Number, required: true, default: 0, min: 0 },
  totalOrders: { type: Number, required: true, default: 0, min: 0 },
  successfulPayments: { type: Number, required: true, default: 0, min: 0 },
  failedPayments: { type: Number, required: true, default: 0, min: 0 },
  itemsSold: { type: Number, required: true, default: 0, min: 0 }
}, { timestamps: true });

export const DailyAnalytics = mongoose.model<IDailyAnalytics>('DailyAnalytics', DailyAnalyticsSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICommission extends Document {
  vendorId: string;
  orderId: string;
  percentage: number;
  amount: number;
  status: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: Date;
}

const CommissionSchema = new Schema<ICommission>({
  vendorId: { type: String, required: true, index: true },
  orderId: { type: String, required: true, index: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  amount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED'],
    default: 'PENDING',
    index: true
  },
  createdAt: { type: Date, default: Date.now }
});

export const Commission = mongoose.model<ICommission>('Commission', CommissionSchema);

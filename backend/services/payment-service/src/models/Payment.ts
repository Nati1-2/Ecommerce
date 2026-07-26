import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'MOCK';

export interface IPayment extends Document {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  transactionId?: string;
  idempotencyKey?: string;
  failureReason?: string;
  refundReason?: string;
  rawWebhookPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  paymentId: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true, index: true },
  customerId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD' },
  provider: {
    type: String,
    enum: ['STRIPE', 'PAYPAL', 'MOCK'],
    default: 'MOCK',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    index: true,
    required: true
  },
  transactionId: { type: String, index: true },
  idempotencyKey: { type: String, index: true },
  failureReason: { type: String },
  refundReason: { type: String },
  rawWebhookPayload: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

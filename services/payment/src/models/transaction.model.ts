import mongoose, { Document, Schema } from 'mongoose';

// ============================================
// Enums
// ============================================

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// ============================================
// Interface
// ============================================

export interface ITransaction extends Document {
  orderId: string;
  userId: string;
  paymentIntentId?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod?: string;
  stripeCustomerId?: string;
  metadata: Map<string, string>;
  refundId?: string;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Schema
// ============================================

const transactionSchema = new Schema<ITransaction>(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    paymentIntentId: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined values without unique constraint violation
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
      default: new Map(),
    },
    refundId: {
      type: String,
    },
    refundReason: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ orderId: 1, status: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

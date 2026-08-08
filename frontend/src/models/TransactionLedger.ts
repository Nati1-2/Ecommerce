import mongoose, { Schema, Document, Model } from "mongoose";

export type LedgerTransactionType = "PAYMENT" | "COMMISSION_CUT" | "VENDOR_PAYOUT" | "REFUND" | "DISPUTE_HOLD";

export interface ITransactionLedger extends Document {
  transactionId: string;
  type: LedgerTransactionType;
  amount: number;
  currency: string;
  orderId?: string;
  vendorId?: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: Date;
}

const transactionLedgerSchema = new Schema<ITransactionLedger>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    orderId: { type: String, index: true },
    vendorId: { type: String, index: true },
    status: { type: String, default: "COMPLETED", index: true },
  },
  { timestamps: true }
);

export const TransactionLedger: Model<ITransactionLedger> =
  mongoose.models.TransactionLedger ||
  mongoose.model<ITransactionLedger>("TransactionLedger", transactionLedgerSchema);

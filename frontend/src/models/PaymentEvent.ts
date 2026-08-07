import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentEventState = "CREATED" | "PROCESSING" | "SUCCESS" | "FAILED" | "RETRYING" | "RECOVERED";

export interface IPaymentEvent extends Document {
  stripeEventId: string;
  eventType: string;
  status: PaymentEventState;
  processed: boolean;
  orderId?: string;
  retryCount: number;
  lastError?: string;
  processedAt?: Date;
  failedAt?: Date;
  payload: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentEventSchema = new Schema<IPaymentEvent>(
  {
    stripeEventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    status: { type: String, default: "CREATED", index: true },
    processed: { type: Boolean, default: false },
    orderId: { type: String, index: true },
    retryCount: { type: Number, default: 0 },
    lastError: { type: String },
    processedAt: { type: Date },
    failedAt: { type: Date },
    payload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const PaymentEvent: Model<IPaymentEvent> =
  mongoose.models.PaymentEvent ||
  mongoose.model<IPaymentEvent>("PaymentEvent", paymentEventSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaymentEvent extends Document {
  stripeEventId: string;
  eventType: string;
  processed: boolean;
  orderId?: string;
  payload: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentEventSchema = new Schema<IPaymentEvent>(
  {
    stripeEventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    processed: { type: Boolean, default: false },
    orderId: { type: String, index: true },
    payload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const PaymentEvent: Model<IPaymentEvent> =
  mongoose.models.PaymentEvent ||
  mongoose.model<IPaymentEvent>("PaymentEvent", paymentEventSchema);

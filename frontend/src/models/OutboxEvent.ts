import mongoose, { Schema, Document, Model } from "mongoose";

export type OutboxStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface IOutboxEvent extends Document {
  eventId: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: Record<string, any>;
  status: OutboxStatus;
  retryCount: number;
  lastError?: string;
  createdAt: Date;
  processedAt?: Date;
  updatedAt: Date;
}

const outboxEventSchema = new Schema<IOutboxEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    aggregateId: { type: String, required: true, index: true },
    aggregateType: { type: String, required: true, index: true },
    eventType: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { type: String, default: "PENDING", index: true },
    retryCount: { type: Number, default: 0 },
    lastError: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export const OutboxEvent: Model<IOutboxEvent> =
  mongoose.models.OutboxEvent ||
  mongoose.model<IOutboxEvent>("OutboxEvent", outboxEventSchema);

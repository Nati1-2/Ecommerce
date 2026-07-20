import mongoose, { Schema, Document } from 'mongoose';

export type StockMovementType = 'RESTOCK' | 'SALE' | 'RESERVATION' | 'RELEASE' | 'ADJUSTMENT';

export interface IStockMovement extends Document {
  productId: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  performedBy?: string;
  createdAt: Date;
}

const stockMovementSchema = new Schema<IStockMovement>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['RESTOCK', 'SALE', 'RESERVATION', 'RELEASE', 'ADJUSTMENT'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
    },
    performedBy: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient queries: movements by product, newest first
stockMovementSchema.index({ productId: 1, createdAt: -1 });

export const StockMovement = mongoose.model<IStockMovement>('StockMovement', stockMovementSchema);

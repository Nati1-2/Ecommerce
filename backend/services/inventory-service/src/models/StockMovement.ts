import mongoose, { Schema, Document } from 'mongoose';

export type MovementType = 'REPLENISHMENT' | 'DEDUCTION' | 'RESERVATION' | 'RELEASE' | 'REFUND';

export interface IStockMovement extends Document {
  productId: string;
  quantity: number;
  type: MovementType;
  referenceId?: string;
  notes?: string;
  createdAt: Date;
}

const StockMovementSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['REPLENISHMENT', 'DEDUCTION', 'RESERVATION', 'RELEASE', 'REFUND']
    },
    referenceId: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const StockMovement = mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);

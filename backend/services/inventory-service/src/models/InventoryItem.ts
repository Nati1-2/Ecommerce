import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  productId: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number; // Virtual field
  warehouseLocation?: string;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    totalStock: {
      type: Number,
      required: true,
      min: [0, 'Total stock cannot be negative'],
      default: 0
    },
    reservedStock: {
      type: Number,
      required: true,
      min: [0, 'Reserved stock cannot be negative'],
      default: 0
    },
    warehouseLocation: {
      type: String,
      trim: true
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      min: [0, 'Low stock threshold cannot be negative'],
      default: 5
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for availableStock
InventoryItemSchema.virtual('availableStock').get(function (this: IInventoryItem) {
  return this.totalStock - this.reservedStock;
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);

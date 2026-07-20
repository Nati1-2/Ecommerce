import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  productId: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  sellerId: string;
  lastRestockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryItemSchema = new Schema<IInventoryItem>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    sellerId: {
      type: String,
      required: true,
      index: true,
    },
    lastRestockedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: availableStock = totalStock - reservedStock
inventoryItemSchema.virtual('availableStock').get(function (this: IInventoryItem) {
  return this.totalStock - this.reservedStock;
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);

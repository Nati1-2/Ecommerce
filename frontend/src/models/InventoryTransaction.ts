import mongoose, { Schema, Document, Model } from "mongoose";

export type InventoryAction = "PURCHASE" | "REFUND" | "RESTOCK" | "VENDOR_ADJUSTMENT" | "ADMIN_CORRECTION";

export interface IInventoryTransaction extends Document {
  productId: string;
  vendorId: string;
  orderId?: string;
  action: InventoryAction;
  quantity: number;
  previousStock: number;
  newStock: number;
  actor: string; // User ID or "SYSTEM"
  timestamp: Date;
}

const inventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    productId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    orderId: { type: String, index: true },
    action: { type: String, required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    actor: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const InventoryTransaction: Model<IInventoryTransaction> =
  mongoose.models.InventoryTransaction ||
  mongoose.model<IInventoryTransaction>("InventoryTransaction", inventoryTransactionSchema);

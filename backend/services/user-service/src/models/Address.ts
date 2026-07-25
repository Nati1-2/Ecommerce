import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  userId: string;
  type: 'HOME' | 'WORK';
  fullName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['HOME', 'WORK'], default: 'HOME' },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddress>('Address', AddressSchema);

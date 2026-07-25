import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  isVerified: boolean;
  verificationToken?: string;
  refreshTokens: Array<{
    token: string;
    createdAt: Date;
    expiresAt: Date;
    ipAddress?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CUSTOMER', 'VENDOR', 'ADMIN'], default: 'CUSTOMER' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
        ipAddress: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

import mongoose, { Schema } from 'mongoose';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const revokedTokenSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  revokedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const RevokedToken = mongoose.models.RevokedToken || mongoose.model('RevokedToken', revokedTokenSchema);

export async function revokeToken(token: string): Promise<void> {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string' || typeof decoded.exp !== 'number') {
    throw new Error('Token expiration is required for revocation');
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await RevokedToken.findOneAndUpdate(
    { tokenHash },
    { $setOnInsert: { tokenHash, revokedAt: new Date(), expiresAt: new Date(decoded.exp * 1000) } },
    { upsert: true }
  );
}

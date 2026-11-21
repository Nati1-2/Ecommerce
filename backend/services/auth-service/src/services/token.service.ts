import { User, IUser } from '../models/User.js';
import { JWTUtils, TokenPayload } from '../utils/jwt.js';
import { revokeToken } from '../models/RevokedToken.js';

export class TokenService {
  static generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    const userId = user._id.toString();
    const payload: TokenPayload = {
      userId,
      id: userId,
      email: user.email,
      role: user.role
    };

    const accessToken = JWTUtils.generateAccessToken(payload);
    const refreshToken = JWTUtils.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  static async saveRefreshToken(user: IUser, refreshToken: string): Promise<void> {
    user.refreshToken = refreshToken;
    await user.save();
  }

  static async invalidateRefreshToken(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }

  static async refreshTokens(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const decoded = await JWTUtils.verifyRefreshToken(oldRefreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== oldRefreshToken || user.status === 'BLOCKED') {
      throw new Error('Invalid or expired refresh token');
    }

    const newTokens = this.generateTokens(user);
    const rotated = await User.findOneAndUpdate(
      { _id: user._id, refreshToken: oldRefreshToken },
      { $set: { refreshToken: newTokens.refreshToken } },
      { new: true }
    );
    if (!rotated) throw new Error('Refresh token has already been rotated');
    await revokeToken(oldRefreshToken);

    return { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken, user: rotated };
  }
}

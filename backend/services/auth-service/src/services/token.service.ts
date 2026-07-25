import { User, IUser } from '../models/User.js';
import { JWTUtils, TokenPayload } from '../utils/jwt.js';

export class TokenService {
  static generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = JWTUtils.generateAccessToken(payload);
    const refreshToken = JWTUtils.generateRefreshToken({ userId: user._id.toString() });

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
    const decoded = JWTUtils.verifyRefreshToken(oldRefreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== oldRefreshToken || user.status === 'BLOCKED') {
      throw new Error('Invalid or expired refresh token');
    }

    const newTokens = this.generateTokens(user);
    user.refreshToken = newTokens.refreshToken;
    await user.save();

    return { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken, user };
  }
}

import crypto from 'crypto';
import { User, IUser } from '../models/User.js';
import { PasswordUtils } from '../utils/password.js';
import { TokenService } from './token.service.js';
import { EmailService } from './email.service.js';
import { publishUserCreatedEvent } from './event.service.js';

export class AuthService {
  static async register(data: { name: string; email: string; password: string; role?: 'CUSTOMER' | 'VENDOR' | 'ADMIN' }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await PasswordUtils.hashPassword(data.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'CUSTOMER',
      isEmailVerified: false,
      verificationToken,
      status: 'ACTIVE'
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    // Publish RabbitMQ USER_CREATED event
    await publishUserCreatedEvent({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user._id.toString()
    };
  }

  static async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status === 'BLOCKED') {
      throw new Error('Account is blocked. Please contact support.');
    }

    const isMatch = await PasswordUtils.comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const tokens = TokenService.generateTokens(user);
    await TokenService.saveRefreshToken(user, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    };
  }

  static async logout(userId: string) {
    await TokenService.invalidateRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  static async verifyEmail(token: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      // Return success to prevent email enumeration
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await EmailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    user.password = await PasswordUtils.hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully. You can now login with your new password.' };
  }
}

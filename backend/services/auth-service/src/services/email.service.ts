import { transporter } from '../config/email.js';
import { logger } from '../utils/logger.js';

export class EmailService {
  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;
    const mailOptions = {
      from: '"E-Commerce Platform" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to E-Commerce Platform!</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6B7280;">Token: ${token}</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`📧 Verification email sent to: ${email}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
    }
  }

  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: '"E-Commerce Platform Security" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6B7280;">Token expires in 1 hour.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`📧 Password reset email sent to: ${email}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
    }
  }
}

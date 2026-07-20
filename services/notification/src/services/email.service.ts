import nodemailer, { Transporter } from 'nodemailer';
import { createLogger } from '@ecom/common';

const logger = createLogger('notification-service');

let transporter: Transporter;

/**
 * Initializes the nodemailer SMTP transporter.
 */
export const initEmailTransporter = (): void => {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  logger.info('Email transporter initialized', {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || '587',
  });
};

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the configured SMTP transporter.
 * Failures are logged but do not throw — email delivery is best-effort.
 */
export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  if (!transporter) {
    initEmailTransporter();
  }

  const from = process.env.EMAIL_FROM || 'noreply@ecommerce.com';

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    logger.info('Email sent successfully', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });

    return true;
  } catch (error) {
    logger.error('Failed to send email', {
      to: options.to,
      subject: options.subject,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
};

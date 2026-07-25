import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8001', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://test1:test1@cluster0.1p6hyl7.mongodb.net/auth_db?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-2026',
  jwtExpire: process.env.JWT_EXPIRE || '15m',
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  smtpHost: process.env.SMTP_HOST || 'smtp.ethereal.email',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
  smtpPassword: process.env.SMTP_PASSWORD || 'ethereal_password',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
};

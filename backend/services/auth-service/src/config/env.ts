import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8001', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_here',
  jwtExpire: process.env.JWT_EXPIRE || '15m',
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  smtpHost: process.env.SMTP_HOST || 'smtp.ethereal.email',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || 'user@example.com',
  smtpPassword: process.env.SMTP_PASSWORD || 'password_placeholder',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
};

import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8005,
  NODE_ENV: process.env.NODE_ENV || 'development',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-ecom-jwt-key'
};

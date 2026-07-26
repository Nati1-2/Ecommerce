import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8009,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics_db',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-ecom-jwt-key'
};

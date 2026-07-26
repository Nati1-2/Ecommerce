import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8011', 10),
  MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_inventory',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  JWT_SECRET: process.env.JWT_ACCESS_SECRET || 'test-access-secret'
};

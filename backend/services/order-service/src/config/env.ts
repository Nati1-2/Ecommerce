import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET && !process.env.JWT_ACCESS_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
}

export const env = {
  PORT: process.env.PORT || 8006,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/order_db',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  JWT_SECRET: process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'dev_secret_only_for_local_development_testing_min_32_chars'
};

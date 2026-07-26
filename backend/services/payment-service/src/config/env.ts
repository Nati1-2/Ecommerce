import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8007,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/payment_db',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-ecom-jwt-key',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51ThDDICdX0hvCWhczONjNi3TCevUCN7vYmjW5h5KaNeNiyjAAkIG3KL1ZkqSOauu8wIRirZmCuETnr6Xw65tK34T00DDtz8A5O',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

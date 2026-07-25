import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8002', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/user_db?authSource=admin',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-2026',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
};

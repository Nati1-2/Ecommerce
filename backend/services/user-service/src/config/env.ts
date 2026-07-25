import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8002', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://test1:test1@cluster0.1p6hyl7.mongodb.net/user_db?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-2026',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
};

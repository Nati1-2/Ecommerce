import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8002', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/user_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
};

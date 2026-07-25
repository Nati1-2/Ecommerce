import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8003', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://test1:test1@cluster0.1p6hyl7.mongodb.net/product_db?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-2026',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  cloudinaryUrl: process.env.CLOUDINARY_URL || 'cloudinary://api_key:api_secret@cloud_name'
};

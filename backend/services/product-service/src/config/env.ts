import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8003', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  cloudinaryUrl: process.env.CLOUDINARY_URL || 'cloudinary://api_key:api_secret@cloud_name'
};

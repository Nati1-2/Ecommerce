import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import router from './routes/inventory.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { getRedisClient } from './config/redis.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Mount the inventory routes
app.use('/api/v1/inventory', router);

// Health Check Endpoint including Redis & MongoDB check
app.get('/health', async (req, res) => {
  let redisStatus = 'Disconnected';
  let dbStatus = 'Disconnected';

  try {
    const client = getRedisClient();
    const ping = await client.ping();
    if (ping === 'PONG') {
      redisStatus = 'Connected';
    }
  } catch (err) {
    redisStatus = 'Error';
  }

  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    dbStatus = 'Connected';
  } else if (dbState === 2) {
    dbStatus = 'Connecting';
  }

  const isHealthy = redisStatus === 'Connected' && dbStatus === 'Connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DOWN',
    service: 'inventory-service',
    database: dbStatus,
    redis: redisStatus,
    timestamp: new Date()
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;

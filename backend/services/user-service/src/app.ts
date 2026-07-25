import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { userRoutes } from './routes/user.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'User Service', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/', userRoutes);
app.use('/api/v1/users', userRoutes);

// ── Error Middleware ──
app.use(errorMiddleware);

export { app };

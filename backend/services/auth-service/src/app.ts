import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/auth.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'Auth Service', timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/', authRoutes);
app.use('/api/v1/auth', authRoutes);

// ── Error Middleware ──
app.use(errorMiddleware);

export { app };

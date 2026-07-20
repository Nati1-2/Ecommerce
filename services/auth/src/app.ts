import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, NotFoundError } from '@ecom/common';
import { authRouter } from './routes/auth.routes';

const app = express();

// ── Security ──────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// ── Body Parsing ──────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Routes ────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ── 404 Catch-All ─────────────────────────────────────
app.all('*', () => {
  throw new NotFoundError('Route');
});

// ── Error Handler ─────────────────────────────────────
app.use(errorHandler);

export { app };

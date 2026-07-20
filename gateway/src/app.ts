import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  currentUser,
  errorHandler,
  NotFoundError,
  createLogger,
} from '@ecom/common';
import { proxyRoutes } from './config/proxy-routes';
import { globalRateLimiter, authRateLimiter } from './middlewares/rate-limiter';

const logger = createLogger('gateway');

const app = express();

// ── Security ──────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request Logging ───────────────────────────────────
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  })
);

// ── Rate Limiting ─────────────────────────────────────
app.use(globalRateLimiter);
app.use('/api/auth', authRateLimiter);

// ── JWT Extraction ────────────────────────────────────
// Parse the JWT from Authorization header and attach currentUser to every request.
// Individual downstream services decide whether auth is required.
app.use(currentUser);

// ── Health Check ──────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Proxy Routes ──────────────────────────────────────
for (const route of proxyRoutes) {
  logger.info(`Registering proxy: ${route.path} -> ${route.target}`);

  app.use(
    route.path,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: route.pathRewrite,
      // Forward the decoded user payload as a header so downstream services
      // can trust it without re-verifying the JWT.
      on: {
        proxyReq: (proxyReq, req) => {
          const expressReq = req as express.Request;
          if (expressReq.currentUser) {
            proxyReq.setHeader(
              'x-user-data',
              JSON.stringify(expressReq.currentUser)
            );
          }
        },
        error: (err, _req, res) => {
          logger.error('Proxy error', {
            message: err.message,
            target: route.target,
          });
          if ('writeHead' in res && typeof res.writeHead === 'function') {
            (res as import('http').ServerResponse)
              .writeHead(502, { 'Content-Type': 'application/json' })
              .end(
                JSON.stringify({
                  errors: [{ message: 'Service unavailable' }],
                })
              );
          }
        },
      },
    })
  );
}

// ── 404 Catch-All ─────────────────────────────────────
app.all('*', () => {
  throw new NotFoundError('Route');
});

// ── Error Handler ─────────────────────────────────────
app.use(errorHandler);

export { app };

# 🚨 Error Handling Architecture & Fault Tolerance — Nati Platform

This document outlines the unified error handling strategy, custom error hierarchies, frontend fallback boundaries, and user feedback mechanisms for the **Nati.** E-Commerce Platform.

---

## 🏗️ Error Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│               Backend Service Error Flow               │
│  Throw CustomError ──► Catch Middleware ──► Sanitized  │
│  (BadRequest, etc)     (errorHandler.ts)   JSON Response│
└───────────────────────────┬────────────────────────────┘
                            │ (HTTP Status Code + Standard Envelope)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Frontend Client Error Flow                │
│  Axios Interceptor ──► Error Normalizer ──► React Toast│
│  (lib/api.ts)         (getErrorMessage)     / Boundary │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Backend Error Hierarchy (`@ecom/shared`)

All custom backend operational errors MUST extend the base `CustomError` abstract class:

```typescript
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
```

### Standard Backend Error Implementations
- **`BadRequestError`** (Status `400`): Returned for invalid inputs or business rule violations.
- **`UnauthorizedError`** (Status `401`): Returned when authentication token is missing or invalid.
- **`ForbiddenError`** (Status `403`): Returned when RBAC role lacks required permissions.
- **`NotFoundError`** (Status `404`): Returned when requested resource is missing.
- **`ConflictError`** (Status `409`): Returned on unique constraint violations or Redis lock failures.

---

## 🛡️ Centralized Express Error Middleware

Express microservices pass errors to the centralized `errorHandler` middleware from `@ecom/shared`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error('[UNHANDLED_ERROR]', err);
  res.status(500).send({
    errors: [{ message: 'An unexpected internal server error occurred' }]
  });
};
```

---

## ⚛️ Frontend Error Handling & Feedback

1. **Axios Response Interceptors**: Automatically catch non-2xx responses and extract sanitized error messages.
2. **React Query Error Callbacks**: Use `onError` callbacks on mutations to display user-friendly toast notifications.
3. **React Error Boundaries**: Wrap major page sections in `<ErrorBoundary>` components to catch rendering crashes without bringing down the entire application.

---

## 🔒 Security & Log Sanitization Rules

- **Zero Information Leakage**: User-facing error messages MUST remain helpful without exposing internal database connection strings, SQL/Mongo queries, stack traces, or server file paths.
- **Sanitized Logging**: Log full stack traces to Winston backend loggers or Sentry, but send ONLY sanitized messages over HTTP to the client.

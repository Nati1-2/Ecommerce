import { Request, Response, NextFunction } from 'express';

// ============================================
// Custom Error Base Class
// ============================================
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

// ============================================
// Bad Request Error (400)
// ============================================
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

// ============================================
// Not Authorized Error (401)
// ============================================
export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}

// ============================================
// Forbidden Error (403)
// ============================================
export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Access forbidden');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Access forbidden' }];
  }
}

// ============================================
// Not Found Error (404)
// ============================================
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public resource: string = 'Resource') {
    super(`${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: `${this.resource} not found` }];
  }
}

// ============================================
// Validation Error (422)
// ============================================
export class ValidationError extends CustomError {
  statusCode = 422;

  constructor(public errors: { message: string; field?: string }[]) {
    super('Validation failed');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return this.errors;
  }
}

// ============================================
// Internal Server Error (500)
// ============================================
export class InternalError extends CustomError {
  statusCode = 500;

  constructor(public message: string = 'Something went wrong') {
    super(message);
    Object.setPrototypeOf(this, InternalError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

// ============================================
// Conflict Error (409)
// ============================================
export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

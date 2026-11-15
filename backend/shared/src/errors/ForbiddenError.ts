import { CustomError } from './CustomError.js';

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(public message: string = 'Forbidden: Insufficient permissions') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}


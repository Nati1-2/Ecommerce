import { CustomError } from './CustomError.js';

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string = 'Conflict: Resource already exists or locked') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}


import { CustomError } from './CustomError.js';

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(public message: string = 'Not Authorized') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

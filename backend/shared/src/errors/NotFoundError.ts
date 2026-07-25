import { CustomError } from './CustomError.js';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string = 'Resource Not Found') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

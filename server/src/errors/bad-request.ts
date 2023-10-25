import { StatusCodes } from 'http-status-codes';
import CustomError from './custom-error';

export default class BadRequestError extends CustomError {
  private readonly _statusCode = StatusCodes.BAD_REQUEST;
  private readonly _context: { [key: string]: any };

  constructor(params?: { message?: string; context?: { [key: string]: any } }) {
    const { message, context } = params ?? {};

    super(message ?? 'Bad request');
    this._context = context ?? {};
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._statusCode;
  }
}

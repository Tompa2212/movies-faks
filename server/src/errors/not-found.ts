import { StatusCodes } from 'http-status-codes';
import CustomError from './custom-error';

export default class NotFoundError extends CustomError {
  private readonly _statusCode = StatusCodes.NOT_FOUND;
  private readonly _context: { [key: string]: any };

  constructor(params?: { message?: string; context?: { [key: string]: any } }) {
    const { message } = params || {};

    super(message ?? 'Not found');
    this._context = params?.context ?? {};
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._statusCode;
  }
}

import { StatusCodes } from 'http-status-codes';
import CustomError from './custom-error';

export default class UnauthenticatedError extends CustomError {
  private readonly _statusCode = StatusCodes.UNAUTHORIZED;
  private readonly _errors: { message: string }[];
  private readonly _description: string;

  constructor(params?: {
    description?: string;
    errors?: { message: string }[];
  }) {
    const { description = 'Unauthorized', errors = [] } = params || {};

    super(description);
    this._description = description;
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }

  get statusCode() {
    return this._statusCode;
  }

  get description() {
    return this._description;
  }
}

export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: any };
};

export default abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: CustomErrorContent[];

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }
}

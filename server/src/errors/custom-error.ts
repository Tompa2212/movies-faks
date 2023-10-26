export type CustomErrorContent = {
  message: string;
}[];

export default abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly description: string;
  abstract readonly errors: CustomErrorContent;

  constructor(description: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }
}

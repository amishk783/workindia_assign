export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capturing the stack trace (for debugging purposes)
    Error.captureStackTrace(this, this.constructor);
  }
}

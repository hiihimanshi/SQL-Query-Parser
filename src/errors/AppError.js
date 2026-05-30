/**
 * Base custom error class for the application.
 * All application-specific errors should extend this class.
 */
class AppError extends Error {
  constructor(message, code = "INTERNAL_ERROR", statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
      },
    };
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

module.exports = AppError;

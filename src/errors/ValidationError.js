const AppError = require("./AppError");

/**
 * Error thrown when input validation fails.
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, "VALIDATION_ERROR", 400);
    this.details = details;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        details: this.details,
      },
    };
  }
}

module.exports = ValidationError;

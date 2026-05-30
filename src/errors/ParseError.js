const AppError = require("./AppError");

/**
 * Error thrown when SQL parsing fails.
 */
class ParseError extends AppError {
  constructor(message, query = null, position = null) {
    super(message, "PARSE_ERROR", 400);
    this.query = query;
    this.position = position;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        query: this.query,
        position: this.position,
      },
    };
  }
}

module.exports = ParseError;

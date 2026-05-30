const AppError = require("./AppError");

/**
 * Error thrown when query execution fails.
 */
class ExecutionError extends AppError {
  constructor(message, operation = null, context = null) {
    super(message, "EXECUTION_ERROR", 500);
    this.operation = operation;
    this.context = context;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        operation: this.operation,
        context: this.context,
      },
    };
  }
}

module.exports = ExecutionError;

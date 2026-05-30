const AppError = require("./AppError");

/**
 * Error thrown when security validation fails.
 * (e.g., SQL injection attempts, unauthorized operations)
 */
class SecurityError extends AppError {
  constructor(message, threat = null) {
    super(message, "SECURITY_ERROR", 403);
    this.threat = threat;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      error: {
        ...super.toJSON().error,
        threat: this.threat,
      },
    };
  }
}

module.exports = SecurityError;

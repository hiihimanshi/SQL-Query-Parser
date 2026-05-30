const { ValidationError, SecurityError } = require("../errors");

/**
 * Validators module - Validates user inputs and SQL components
 */
const validators = {
  /**
   * Validates a table name to prevent SQL injection
   * @param {string} tableName - Table name to validate
   * @returns {boolean} True if valid
   * @throws {ValidationError} If invalid
   */
  tableName(tableName) {
    if (!tableName || typeof tableName !== "string") {
      throw new ValidationError("Table name must be a non-empty string");
    }

    // Only allow alphanumeric, underscore, hyphen
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(tableName)) {
      throw new SecurityError(
        `Invalid table name: "${tableName}". Only alphanumeric characters, underscore, and hyphen allowed.`,
        "INVALID_TABLE_NAME"
      );
    }

    if (tableName.length > 255) {
      throw new ValidationError("Table name exceeds max length of 255 characters");
    }

    return true;
  },

  /**
   * Validates a field/column name
   * @param {string} fieldName - Field name to validate
   * @returns {boolean} True if valid
   * @throws {ValidationError} If invalid
   */
  fieldName(fieldName) {
    if (!fieldName || typeof fieldName !== "string") {
      throw new ValidationError("Field name must be a non-empty string");
    }

    // Allow table.field format
    const parts = fieldName.split(".");
    if (parts.length > 2) {
      throw new ValidationError('Field name can only have one dot for "table.field" format');
    }

    for (const part of parts) {
      if (!/^[a-zA-Z_*][a-zA-Z0-9_*]*$/.test(part) && part !== "*") {
        throw new SecurityError(
          `Invalid field name: "${part}". Only alphanumeric characters and underscore allowed.`,
          "INVALID_FIELD_NAME"
        );
      }
    }

    if (fieldName.length > 255) {
      throw new ValidationError("Field name exceeds max length of 255 characters");
    }

    return true;
  },

  /**
   * Validates a value (prevents obvious SQL injection in values)
   * @param {*} value - Value to validate
   * @returns {boolean} True if valid
   * @throws {SecurityError} If suspicious
   */
  value(value) {
    if (value === null || value === undefined) {
      return true;
    }

    const strValue = String(value).toLowerCase();

    // Check for common SQL injection patterns in string values
    const sqlInjectionPatterns = [
      /(\*\/|\/\*)/,           // SQL comment syntax
      /(-{2}|#)/g,             // Single line comment
      /(;|xp_|sp_|exec|execute|script|javascript|onerror)/i, // Command terminators/execution
      /(union.*select|select.*from.*where|drop.*table|delete.*from|insert.*into.*values|update.*set)/i, // SQL commands
    ];

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(strValue)) {
        throw new SecurityError(
          `Potential SQL injection detected in value: "${String(value).substring(0, 50)}..."`,
          "SQL_INJECTION_ATTEMPT"
        );
      }
    }

    return true;
  },

  /**
   * Validates the entire query string for obvious threats
   * @param {string} query - Query to validate
   * @returns {boolean} True if valid
   * @throws {SecurityError} If threats detected
   */
  query(query) {
    if (!query || typeof query !== "string") {
      throw new ValidationError("Query must be a non-empty string");
    }

    if (query.length > 50000) {
      throw new ValidationError("Query exceeds maximum length of 50000 characters");
    }

    // Check for multiple statements (attempt to inject multiple queries)
    const statements = query.split(";").filter(s => s.trim());
    if (statements.length > 1) {
      throw new SecurityError(
        "Multiple SQL statements are not allowed. Use one statement at a time.",
        "MULTI_STATEMENT_INJECTION"
      );
    }

    return true;
  },

  /**
   * Validates SQL operators
   * @param {string} operator - Operator to validate
   * @returns {boolean} True if valid
   * @throws {ValidationError} If invalid
   */
  operator(operator) {
    const validOperators = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "IN", "NOT IN", "BETWEEN", "IS", "IS NOT"];
    if (!validOperators.includes(operator?.toUpperCase())) {
      throw new ValidationError(`Invalid operator: "${operator}"`);
    }
    return true;
  },

  /**
   * Validates SQL keywords and clauses
   * @param {string} keyword - Keyword to validate
   * @returns {boolean} True if valid
   * @throws {ValidationError} If invalid
   */
  keyword(keyword) {
    const validKeywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "NOT",
      "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
      "JOIN", "INNER", "LEFT", "RIGHT", "ON",
      "ORDER", "BY", "GROUP", "HAVING", "LIMIT",
      "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX",
      "CASE", "WHEN", "THEN", "ELSE", "END",
      "UNION", "LIKE", "IN", "BETWEEN", "IS", "NULL"
    ];
    if (!validKeywords.includes(keyword?.toUpperCase())) {
      throw new ValidationError(`Invalid or unsupported keyword: "${keyword}"`);
    }
    return true;
  },

  /**
   * Validates limit value
   * @param {number} limit - Limit value to validate
   * @returns {boolean} True if valid
   * @throws {ValidationError} If invalid
   */
  limit(limit) {
    if (!Number.isInteger(limit) || limit < 0) {
      throw new ValidationError("LIMIT value must be a non-negative integer");
    }
    if (limit > 1000000) {
      throw new ValidationError("LIMIT value exceeds maximum of 1,000,000");
    }
    return true;
  },

  /**
   * Validates file path for CSV operations
   * @param {string} filePath - File path to validate
   * @returns {boolean} True if valid
   * @throws {SecurityError} If suspicious
   */
  filePath(filePath) {
    if (!filePath || typeof filePath !== "string") {
      throw new ValidationError("File path must be a non-empty string");
    }

    // Prevent directory traversal attacks
    if (filePath.includes("..") || filePath.includes("~")) {
      throw new SecurityError(
        "Directory traversal detected in file path",
        "PATH_TRAVERSAL_ATTEMPT"
      );
    }

    // Only allow specific file extensions
    if (!/\.(csv|json|txt)$/i.test(filePath)) {
      throw new SecurityError(
        "Only .csv, .json, and .txt files are allowed",
        "INVALID_FILE_TYPE"
      );
    }

    return true;
  },
};

module.exports = validators;

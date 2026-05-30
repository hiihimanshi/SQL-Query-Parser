/**
 * Sanitizers module - Cleans and normalizes user inputs
 */
const sanitizers = {
  /**
   * Sanitizes a table name
   * @param {string} tableName - Table name to sanitize
   * @returns {string} Sanitized table name
   */
  tableName(tableName) {
    return String(tableName).trim().toLowerCase();
  },

  /**
   * Sanitizes a field name
   * @param {string} fieldName - Field name to sanitize
   * @returns {string} Sanitized field name
   */
  fieldName(fieldName) {
    return String(fieldName).trim().toLowerCase();
  },

  /**
   * Sanitizes a string value (removes leading/trailing whitespace)
   * @param {*} value - Value to sanitize
   * @returns {*} Sanitized value
   */
  value(value) {
    if (typeof value === "string") {
      return value.trim().replace(/^['"]|['"]$/g, "");
    }
    return value;
  },

  /**
   * Sanitizes a query string
   * @param {string} query - Query to sanitize
   * @returns {string} Sanitized query
   */
  query(query) {
    return String(query)
      .trim()
      // Normalize whitespace
      .replace(/\s+/g, " ")
      // Remove comments
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
  },

  /**
   * Sanitizes a column value for CSV output
   * @param {*} value - Value to sanitize
   * @returns {string} Sanitized value safe for CSV
   */
  csvValue(value) {
    if (value === null || value === undefined) {
      return "";
    }
    const strValue = String(value);
    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    if (strValue.includes(",") || strValue.includes("\n") || strValue.includes('"')) {
      return `"${strValue.replace(/"/g, '""')}"`;
    }
    return strValue;
  },

  /**
   * Sanitizes an array of field names
   * @param {string[]} fields - Fields to sanitize
   * @returns {string[]} Sanitized fields
   */
  fields(fields) {
    return Array.isArray(fields)
      ? fields.map(f => this.fieldName(f))
      : [];
  },

  /**
   * Sanitizes an object keys (for output)
   * @param {Object} obj - Object to sanitize
   * @returns {Object} Object with sanitized keys
   */
  objectKeys(obj) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[this.fieldName(key)] = value;
    }
    return sanitized;
  },
};

module.exports = sanitizers;

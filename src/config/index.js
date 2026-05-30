require("dotenv").config();
const path = require("path");

/**
 * Configuration module - Centralized application settings
 */
const config = {
  // Environment
  env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",

  // Application
  appName: process.env.APP_NAME || "Query-Master",
  appVersion: process.env.APP_VERSION || "1.0.0",
  dataDir: process.env.DATA_DIR || path.join(process.cwd(), "data"),
  logsDir: process.env.LOGS_DIR || path.join(process.cwd(), "logs"),

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || (process.env.DEBUG ? "debug" : "info"),
    format: process.env.LOG_FORMAT || "json",
    file: process.env.LOG_FILE || path.join(process.cwd(), "logs", "app.log"),
    maxSize: parseInt(process.env.LOG_MAX_SIZE || "10485760"), // 10MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES || "5"),
    enableConsole: process.env.LOG_CONSOLE !== "false",
    enableFile: process.env.LOG_FILE_ENABLED !== "false",
  },

  // Query execution
  query: {
    maxDuration: parseInt(process.env.QUERY_MAX_DURATION || "30000"), // 30 seconds
    maxResultSize: parseInt(process.env.QUERY_MAX_RESULT_SIZE || "1000000"), // 1M rows
    cacheEnabled: process.env.QUERY_CACHE !== "false",
    cacheTTL: parseInt(process.env.QUERY_CACHE_TTL || "3600000"), // 1 hour
  },

  // Security
  security: {
    enableValidation: process.env.SECURITY_VALIDATION !== "false",
    enableSanitization: process.env.SECURITY_SANITIZATION !== "false",
    maxQueryLength: parseInt(process.env.SECURITY_MAX_QUERY_LENGTH || "50000"),
    allowDirectoryTraversal: process.env.SECURITY_ALLOW_TRAVERSAL === "true",
  },

  // CSV
  csv: {
    encoding: process.env.CSV_ENCODING || "utf8",
    delimiter: process.env.CSV_DELIMITER || ",",
    quote: process.env.CSV_QUOTE || '"',
  },

  // Debug
  debug: process.env.DEBUG === "true",
  verbose: process.env.VERBOSE === "true",

  /**
   * Get a configuration value
   * @param {string} key - Configuration key (supports dot notation)
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  get(key, defaultValue = undefined) {
    const keys = key.split(".");
    let value = this;
    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    return value;
  },

  /**
   * Validate required environment variables
   * @throws {Error} If required variables are missing
   */
  validate() {
    const required = process.env.REQUIRED_ENV_VARS?.split(",") || [];
    const missing = required.filter(v => !process.env[v.trim()]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  },

  /**
   * Get configuration as object (useful for logging/debugging)
   * @param {boolean} hideSecrets - Hide sensitive values
   * @returns {Object} Configuration object
   */
  toObject(hideSecrets = true) {
    const obj = { ...this };
    if (hideSecrets) {
      delete obj.get;
      delete obj.validate;
      delete obj.toObject;
    }
    return obj;
  },
};

module.exports = config;

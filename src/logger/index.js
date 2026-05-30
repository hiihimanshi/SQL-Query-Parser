const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const config = require("../config");

/**
 * Simple logger for application events
 */
class Logger {
  constructor(options = {}) {
    this.logLevel = options.level || config.logging.level;
    this.format = options.format || config.logging.format;
    this.logFile = options.file || config.logging.file;
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile !== false;
    this.context = options.context || "App";

    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      fatal: 4,
    };

    this.levelColors = {
      debug: chalk.gray,
      info: chalk.blue,
      warn: chalk.yellow,
      error: chalk.red,
      fatal: chalk.bgRed.white,
    };

    // Ensure log directory exists
    if (this.enableFile) {
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  /**
   * Internal log method
   */
  log(level, message, data = null) {
    if (this.levels[level] < this.levels[this.logLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data,
    };

    if (this.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.enableFile) {
      this.logToFile(logEntry);
    }
  }

  /**
   * Log to console with colors
   */
  logToConsole(entry) {
    const { timestamp, level, context, message, data } = entry;
    const colorFn = this.levelColors[level] || chalk.white;
    const prefix = colorFn(`[${level.toUpperCase()}]`);
    const time = chalk.dim(timestamp);

    let output = `${time} ${prefix} ${context}: ${message}`;
    if (data) {
      output += "\n" + JSON.stringify(data, null, 2);
    }

    console.log(output);
  }

  /**
   * Log to file
   */
  logToFile(entry) {
    try {
      const logLine = JSON.stringify(entry) + "\n";
      fs.appendFileSync(this.logFile, logLine, { encoding: "utf8" });
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  /**
   * Debug level logging
   */
  debug(message, data = null) {
    this.log("debug", message, data);
  }

  /**
   * Info level logging
   */
  info(message, data = null) {
    this.log("info", message, data);
  }

  /**
   * Warning level logging
   */
  warn(message, data = null) {
    this.log("warn", message, data);
  }

  /**
   * Error level logging
   */
  error(message, error = null, data = null) {
    const errorData = {
      ...data,
      error: error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: config.isDev ? error.stack : undefined,
          }
        : error,
    };
    this.log("error", message, errorData);
  }

  /**
   * Fatal level logging
   */
  fatal(message, error = null, data = null) {
    const errorData = {
      ...data,
      error: error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
    };
    this.log("fatal", message, errorData);
  }

  /**
   * Log a query execution
   */
  logQuery(query, duration, rowsAffected = null, error = null) {
    const data = {
      query,
      duration: `${duration}ms`,
      rowsAffected,
      error: error ? error.message : null,
    };

    if (error) {
      this.error("Query execution failed", error, data);
    } else {
      this.info("Query executed successfully", data);
    }
  }

  /**
   * Create a child logger with different context
   */
  child(context) {
    return new Logger({
      level: this.logLevel,
      format: this.format,
      file: this.logFile,
      enableConsole: this.enableConsole,
      enableFile: this.enableFile,
      context,
    });
  }
}

// Create default logger instance
const logger = new Logger();

module.exports = logger;
module.exports.Logger = Logger;

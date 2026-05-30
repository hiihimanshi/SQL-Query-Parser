const fs = require("fs");
const path = require("path");
const { ValidationError } = require("../errors");

/**
 * Schema Validator - Validates data against table schemas
 */
class SchemaValidator {
  constructor(schemasDir = "./schemas") {
    this.schemasDir = schemasDir;
    this.schemas = new Map();
    this.ensureDir();
  }

  /**
   * Ensure schemas directory exists
   */
  ensureDir() {
    if (!fs.existsSync(this.schemasDir)) {
      fs.mkdirSync(this.schemasDir, { recursive: true });
    }
  }

  /**
   * Define or update a table schema
   */
  defineSchema(tableName, schema) {
    // Validate schema structure
    if (!schema.columns || typeof schema.columns !== "object") {
      throw new ValidationError("Schema must have a 'columns' object");
    }

    this.schemas.set(tableName, {
      name: tableName,
      version: schema.version || "1.0.0",
      columns: this.normalizeColumns(schema.columns),
      primaryKey: schema.primaryKey || null,
      constraints: schema.constraints || {},
      createdAt: new Date().toISOString(),
    });

    // Save to file
    this.saveSchema(tableName);
  }

  /**
   * Normalize column definitions
   */
  normalizeColumns(columns) {
    const normalized = {};
    for (const [name, def] of Object.entries(columns)) {
      normalized[name] = {
        type: def.type || "string",
        required: def.required !== false,
        default: def.default || null,
        unique: def.unique === true,
        description: def.description || "",
      };
    }
    return normalized;
  }

  /**
   * Load a schema from file
   */
  loadSchema(tableName) {
    if (this.schemas.has(tableName)) {
      return this.schemas.get(tableName);
    }

    const schemaFile = path.join(this.schemasDir, `${tableName}.json`);
    if (fs.existsSync(schemaFile)) {
      const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
      this.schemas.set(tableName, schema);
      return schema;
    }

    return null;
  }

  /**
   * Save schema to file
   */
  saveSchema(tableName) {
    const schema = this.schemas.get(tableName);
    if (!schema) return;

    const schemaFile = path.join(this.schemasDir, `${tableName}.json`);
    fs.writeFileSync(schemaFile, JSON.stringify(schema, null, 2), "utf8");
  }

  /**
   * Validate a row against schema
   */
  validateRow(tableName, row) {
    const schema = this.loadSchema(tableName);
    if (!schema) {
      // If no schema, allow any data
      return { valid: true, errors: [] };
    }

    const errors = [];

    // Check each column in schema
    for (const [colName, colDef] of Object.entries(schema.columns)) {
      const value = row[colName];

      // Check required
      if (colDef.required && (value === null || value === undefined || value === "")) {
        errors.push(`Column '${colName}' is required`);
        continue;
      }

      // Check type
      if (value !== null && value !== undefined && value !== "") {
        const error = this.validateType(value, colDef.type, colName);
        if (error) errors.push(error);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate data type
   */
  validateType(value, type, fieldName) {
    switch (type.toLowerCase()) {
      case "string":
        if (typeof value !== "string") {
          return `Field '${fieldName}' must be a string, got ${typeof value}`;
        }
        break;
      case "number":
      case "int":
      case "integer":
        if (isNaN(value)) {
          return `Field '${fieldName}' must be a number, got '${value}'`;
        }
        break;
      case "float":
      case "decimal":
        if (isNaN(parseFloat(value))) {
          return `Field '${fieldName}' must be a float, got '${value}'`;
        }
        break;
      case "boolean":
      case "bool":
        const boolStr = String(value).toLowerCase();
        if (!["true", "false", "1", "0", "yes", "no"].includes(boolStr)) {
          return `Field '${fieldName}' must be a boolean, got '${value}'`;
        }
        break;
      case "date":
        if (isNaN(Date.parse(value))) {
          return `Field '${fieldName}' must be a valid date, got '${value}'`;
        }
        break;
      case "json":
        try {
          JSON.parse(value);
        } catch {
          return `Field '${fieldName}' must be valid JSON, got '${value}'`;
        }
        break;
    }
    return null;
  }

  /**
   * Validate INSERT values
   */
  validateInsert(tableName, fieldNames, values) {
    const schema = this.loadSchema(tableName);
    if (!schema) return { valid: true, errors: [] };

    const errors = [];
    const row = {};

    // Build row from field names and values
    for (let i = 0; i < fieldNames.length; i++) {
      row[fieldNames[i]] = values[i];
    }

    // Validate the row
    return this.validateRow(tableName, row);
  }

  /**
   * Validate UPDATE values
   */
  validateUpdate(tableName, updates) {
    const schema = this.loadSchema(tableName);
    if (!schema) return { valid: true, errors: [] };

    const errors = [];

    for (const [fieldName, value] of Object.entries(updates)) {
      const colDef = schema.columns[fieldName];
      if (!colDef) {
        errors.push(`Unknown column '${fieldName}'`);
        continue;
      }

      const error = this.validateType(value, colDef.type, fieldName);
      if (error) errors.push(error);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get schema definition
   */
  getSchema(tableName) {
    return this.loadSchema(tableName);
  }

  /**
   * List all schemas
   */
  listSchemas() {
    const schemas = [];
    const files = fs.readdirSync(this.schemasDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const tableName = file.replace(".json", "");
        schemas.push(this.loadSchema(tableName));
      }
    }
    return schemas;
  }

  /**
   * Delete a schema
   */
  deleteSchema(tableName) {
    this.schemas.delete(tableName);
    const schemaFile = path.join(this.schemasDir, `${tableName}.json`);
    if (fs.existsSync(schemaFile)) {
      fs.unlinkSync(schemaFile);
    }
  }
}

module.exports = SchemaValidator;

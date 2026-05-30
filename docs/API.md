# Query-Master API Documentation

## Core Modules

### Query Parser

Parses SQL query strings into structured objects.

```javascript
const { 
  parseSelectQuery,
  parseInsertQuery, 
  parseUpdateQuery,
  parseDeleteQuery 
} = require('./queryParser');

// Parse SELECT query
const parsed = parseSelectQuery('SELECT name, age FROM student WHERE age > 20');
// Returns: {
//   fields: ['name', 'age'],
//   table: 'student',
//   whereClauses: {...},
//   ...
// }
```

### Query Executor

Executes parsed queries against CSV data.

```javascript
const {
  executeSELECTQuery,
  executeINSERTQuery,
  executeUpdateQuery,
  executeDELETEQuery
} = require('./queryExecutor');

// Execute SELECT
const results = await executeSELECTQuery('SELECT * FROM student');

// Execute INSERT
const insertResult = await executeINSERTQuery(
  "INSERT INTO student (id, name) VALUES (1, 'John')"
);

// Execute UPDATE
const updateResult = await executeUPDATEQuery(
  "UPDATE student SET age = 21 WHERE id = 1"
);

// Execute DELETE
const deleteResult = await executeDELETEQuery(
  "DELETE FROM student WHERE age < 18"
);
```

### Validators

Validate inputs for security and correctness.

```javascript
const { validators } = require('./security');

validators.query(queryString);           // Validates entire query
validators.tableName('student');         // Validates table name
validators.fieldName('student.name');    // Validates field name
validators.value('some value');          // Validates value
validators.operator('=');                // Validates operator
validators.limit(100);                   // Validates LIMIT value
validators.filePath('./data/file.csv');  // Validates file path
```

### Sanitizers

Clean and normalize user inputs.

```javascript
const { sanitizers } = require('./security');

sanitizers.query(queryString);           // Normalizes query
sanitizers.tableName('Student');         // Converts to lowercase
sanitizers.fieldName('USER.name');       // Normalizes field name
sanitizers.value("'hello'");             // Removes quotes
sanitizers.csvValue(value);              // Escapes for CSV
```

### Schema Validator

Validate data against table schemas.

```javascript
const { SchemaValidator } = require('./schema');
const validator = new SchemaValidator();

// Define a schema
validator.defineSchema('student', {
  columns: {
    id: { type: 'int', required: true },
    name: { type: 'string', required: true },
    age: { type: 'int', required: false, default: 0 },
    email: { type: 'string', unique: true }
  },
  primaryKey: 'id'
});

// Validate a row
const result = validator.validateRow('student', {
  id: 1,
  name: 'John',
  age: 21
});
// Returns: { valid: true, errors: [] }

// Validate INSERT values
const insertResult = validator.validateInsert('student', 
  ['id', 'name'], 
  [1, 'John']
);

// Validate UPDATE values
const updateResult = validator.validateUpdate('student', {
  age: 21,
  email: 'john@example.com'
});
```

### Logger

Log application events and queries.

```javascript
const logger = require('./logger');

logger.info('Query executed', { query, duration });
logger.warn('Slow query detected', { duration: 5000 });
logger.error('Query failed', error, { query });
logger.debug('Debug information', debugData);
logger.fatal('Critical error', error);

// Log query execution
logger.logQuery(query, duration, rowsAffected, error);

// Create child logger with context
const queryLogger = logger.child('QueryExecutor');
queryLogger.info('Operation started');
```

### Configuration

Access application configuration.

```javascript
const config = require('./config');

// Get all config
console.log(config);

// Get specific value with dot notation
const logLevel = config.get('logging.level');
const maxQueryDuration = config.get('query.maxDuration');

// Check environment
if (config.isDev) { /* development mode */ }
if (config.isProduction) { /* production mode */ }

// Get as object (safe for logging)
const configObj = config.toObject(hideSecrets = true);
```

## Error Classes

```javascript
const {
  AppError,
  ValidationError,
  ParseError,
  ExecutionError,
  SecurityError
} = require('./errors');

// ValidationError - Input validation failed
throw new ValidationError('Table name must be a string');

// ParseError - SQL parsing failed
throw new ParseError('Invalid SELECT format', query, position);

// ExecutionError - Query execution failed
throw new ExecutionError('Cannot read CSV file', 'SELECT', context);

// SecurityError - Security validation failed
throw new SecurityError('SQL injection detected', 'INJECTION_ATTEMPT');

// All errors have toJSON() method
const errorJson = error.toJSON();
// {
//   error: {
//     name: 'ValidationError',
//     message: '...',
//     code: 'VALIDATION_ERROR',
//     statusCode: 400,
//     timestamp: '2024-01-01T00:00:00Z'
//   }
// }
```

## Advanced Features

### HAVING Clause

Filter aggregated results.

```javascript
const { parseHavingClause } = require('./queryParser/advancedFeatures');

// Parse HAVING
const having = parseHavingClause('COUNT(*) > 5 AND SUM(age) > 100');
```

### IN Operator

Check membership in a set.

```sql
SELECT * FROM student WHERE grade IN ('A', 'B', 'C');
SELECT * FROM student WHERE age NOT IN (18, 19, 20);
```

### BETWEEN Operator

Range queries.

```sql
SELECT * FROM student WHERE age BETWEEN 18 AND 25;
SELECT * FROM courses WHERE duration NOT BETWEEN 30 AND 60;
```

### IS NULL / IS NOT NULL

Null checks.

```sql
SELECT * FROM student WHERE email IS NULL;
SELECT * FROM student WHERE phone IS NOT NULL;
```

### CASE Expression

Conditional logic.

```sql
SELECT name,
  CASE 
    WHEN age < 18 THEN 'Minor'
    WHEN age >= 18 AND age < 65 THEN 'Adult'
    ELSE 'Senior'
  END as category
FROM student;
```

## CLI Usage

```bash
# Start interactive shell
npm start

# Debug mode
npm run dev

# View help
--help

# View version
--version

# Example queries
SELECT * FROM student;
INSERT INTO student (id, name) VALUES (1, 'John');
UPDATE student SET age = 21 WHERE id = 1;
DELETE FROM student WHERE age < 18;
```

## Environment Variables

Configuration via `.env` file:

```
NODE_ENV=development
LOG_LEVEL=info
SECURITY_VALIDATION=true
QUERY_MAX_RESULT_SIZE=1000000
```

See `.env.example` for all available options.

## See Also

- [README.md](../README.md) - Project overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [examples/](../examples/) - Real-world examples

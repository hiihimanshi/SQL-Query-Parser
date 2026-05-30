# Query-Master 🗄️

[![Tests](https://github.com/query-master/query-master/actions/workflows/test.yml/badge.svg)](https://github.com/query-master/query-master/actions/workflows/test.yml)
[![Code Quality](https://github.com/query-master/query-master/actions/workflows/analyze.yml/badge.svg)](https://github.com/query-master/query-master/actions/workflows/analyze.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-16+-green)](https://nodejs.org/)

> **A production-ready SQL query parser and executor for CSV files** with security hardening, advanced SQL features, and an extensible architecture.

## ⭐ Why Query-Master?

- ✨ **Familiar SQL Syntax**: Write queries using standard SQL that you already know
- 🔒 **Security First**: Built-in SQL injection prevention and input validation
- 📊 **Full SQL Support**: SELECT, INSERT, UPDATE, DELETE with advanced features
- 🎯 **Real-World Ready**: Production-grade error handling, logging, and configuration
- 📈 **Zero Dependencies**: Minimal core with optional features
- 🐳 **Docker Ready**: One-command deployment with Docker/Docker Compose
- 🧪 **Well Tested**: Comprehensive test suite with 20+ test steps
- 📚 **Great Documentation**: Full API docs, examples, and guides

## 🚀 Quick Start

### Installation

Choose your setup method:

**Option 1: Quick Setup (Recommended)**
```bash
git clone https://github.com/yourusername/query-master.git
cd query-master

# On Linux/macOS
bash setup.sh

# On Windows
setup.bat
```

**Option 2: Manual Setup**
```bash
npm install
mkdir -p data logs schemas
cp .env.example .env
```

**Option 3: Docker**
```bash
docker-compose up -d
docker-compose exec query-master npm start
```

### First Query

```bash
npm start

# You'll see:
# SQL> SELECT * FROM student;
# ✓ Query executed in 12ms
# (table output with results)
```

## 📚 Usage Examples

### SELECT Queries

**Basic selection:**
```sql
SELECT name, age FROM student;
```

**With conditions:**
```sql
SELECT * FROM student WHERE age > 20 AND grade = 'A';
```

**With aggregation:**
```sql
SELECT grade, COUNT(*) as count, AVG(age) as avg_age
FROM student
GROUP BY grade
HAVING COUNT(*) > 2
ORDER BY avg_age DESC;
```

**With JOINs:**
```sql
SELECT s.name, c.course_name
FROM student s
LEFT JOIN enrollment e ON s.id = e.student_id
LEFT JOIN courses c ON e.course_id = c.course_id;
```

**Advanced operators:**
```sql
-- IN operator
SELECT * FROM student WHERE grade IN ('A', 'B', 'C');

-- BETWEEN operator
SELECT * FROM student WHERE age BETWEEN 18 AND 25;

-- IS NULL
SELECT * FROM student WHERE email IS NULL;

-- LIKE pattern
SELECT * FROM student WHERE name LIKE 'John%';
```

### INSERT Queries

```sql
INSERT INTO student (id, name, age, grade) 
VALUES (1, 'Alice Johnson', 21, 'A');
```

### UPDATE Queries

```sql
UPDATE student 
SET grade = 'A', updated_at = NOW() 
WHERE score > 85;
```

### DELETE Queries

```sql
DELETE FROM student WHERE status = 'inactive';
```

## 🔒 Security Features

Query-Master includes comprehensive security:

### ✓ Input Validation
```javascript
// Prevents SQL injection in field/table names
// Only allows: alphanumeric, underscore, hyphen
// Example: "student" ✓ but "student'; DROP TABLE" ✗
```

### ✓ Query Size Limits
```
Max query length: 50,000 characters (configurable)
Prevents DOS attacks with oversized queries
```

### ✓ Multi-Statement Prevention
```
Only one SQL statement per query allowed
Prevents query chaining attacks
```

### ✓ Sanitization
```javascript
// Removes comments, normalizes whitespace
// Escapes values for CSV output
// Removes quotes safely
```

## 🛠️ Commands

```bash
# Start interactive CLI
npm start

# Development mode (debug output, auto-reload)
npm run dev

# Run all tests with coverage
npm test

# Run specific test level
npm test:1    # Run step-01 tests
npm test:20   # Run step-20 tests (most complete)

# Code quality
npm run lint     # Check code style
npm run format   # Auto-format code
npm run security # Audit dependencies

# View help
npm run help
```

## 📖 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Examples](examples/README.md)** - Real-world query examples
- **[Configuration](docs/CONFIGURATION.md)** - Advanced setup options
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Architecture](docs/ARCHITECTURE.md)** - System design (coming soon)

## 🏗️ Architecture

```
src/
├── cli.js                 # Interactive command-line interface
├── queryParser.js         # SQL parsing engine
├── queryExecutor.js       # Query execution engine
├── csvReader.js           # CSV file I/O
├── outputs.js             # Result formatting
├── config/                # Configuration management
├── errors/                # Custom error classes
├── security/              # Validators & sanitizers
├── logger/                # Logging system
├── schema/                # Schema validation
└── queryParser/           # Advanced SQL features
```

## ⚙️ Configuration

Create `.env` file (copy from `.env.example`):

```env
# Environment
NODE_ENV=development
LOG_LEVEL=info

# Directories
DATA_DIR=./data
LOGS_DIR=./logs

# Security
SECURITY_VALIDATION=true        # Enable input validation
SECURITY_MAX_QUERY_LENGTH=50000 # Max query size

# Query
QUERY_MAX_DURATION=30000        # Max execution time
QUERY_CACHE=true                # Enable caching

# CSV
CSV_ENCODING=utf8
CSV_DELIMITER=,
```

[See all options →](docs/CONFIGURATION.md)

## 📊 Features Comparison

| Feature | Query-Master | SQLite | DuckDB |
|---------|------|--------|--------|
| **CSV Support** | ✅ | ❌ | ✅ |
| **SQL Syntax** | 90% | 100% | 95% |
| **Security** | ✅ Advanced | ✅ | ✅ |
| **In-Process** | ✅ | ✅ | ✅ |
| **CLI** | ✅ Interactive | ✅ | ✅ |
| **Learning Curve** | 📈 Easy | 📈 Easy | 📈 Easy |
| **Perfect for** | Education, CSV Queries | Apps, Real DBs | Analytics |

## 🧪 Testing

Query-Master has 20 test suites covering:

```
✓ Basic SELECT queries
✓ Complex WHERE conditions (AND, OR, parentheses)
✓ JOIN operations (INNER, LEFT, RIGHT)
✓ Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
✓ GROUP BY and ORDER BY
✓ LIMIT and DISTINCT
✓ INSERT, UPDATE, DELETE operations
✓ Schema validation
✓ Error handling
✓ Security validation
```

Run tests:
```bash
npm test                    # All tests with coverage
npm test:20                # Only step-20 (most complete)
npm test:watch            # Watch mode
npm test:verbose          # Verbose output
```

## 🐳 Docker

**Run with Docker Compose:**
```bash
docker-compose up
```

**In running container:**
```bash
docker-compose exec query-master npm start
```

**Build custom image:**
```bash
docker build -t query-master:latest .
docker run -it -v $(pwd)/data:/app/data query-master:latest
```

[See Docker docs →](docs/DOCKER.md)

## 🤝 Contributing

We welcome contributions! Please:

1. Read [Contributing Guidelines](CONTRIBUTING.md)
2. Follow [Code of Conduct](CODE_OF_CONDUCT.md)
3. Check existing [Issues](https://github.com/yourusername/query-master/issues)
4. Create feature branches from `develop`

**Quick contribution:**
```bash
git checkout -b feature/my-feature
npm run lint && npm test
git push && create pull request
```

## 📋 Roadmap

- [x] Core SQL parsing and execution
- [x] Security hardening
- [x] Comprehensive logging
- [ ] HAVING clause support
- [ ] Transaction support
- [ ] Query result caching
- [ ] REST API wrapper
- [ ] Web UI dashboard
- [ ] GraphQL API
- [ ] Plugin system

[See full roadmap →](docs/ROADMAP.md)

## 📝 Changelog

All changes documented in [CHANGELOG.md](CHANGELOG.md)

Recent highlights:
- v0.2.0: Security layer, logging, advanced operators
- v0.1.6: Full JOIN support, aggregates, advanced WHERE
- v0.1.0: Initial release

## 📄 License

[MIT License](LICENSE) - Feel free to use in personal and commercial projects

## 🤖 Support

- 📚 [Full Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/query-master/issues)
- 💬 [Discussions](https://github.com/yourusername/query-master/discussions)
- 📧 Email: support@example.com

## 🌟 Show Your Support

If you find Query-Master useful, please:
- ⭐ Star the repository
- 🐛 Report issues
- 📝 Improve documentation
- 🤝 Contribute code

## 👥 Authors

- **Original Author**: [Saqib Masood](https://github.com/saqibmasood)
- **Contributors**: [See full list →](https://github.com/yourusername/query-master/graphs/contributors)

---

<div align="center">

**[Documentation](docs/)** • **[Examples](examples/)** • **[Issues](https://github.com/yourusername/query-master/issues)** • **[License](LICENSE)**

Made with ❤️ for the developer community

</div>

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Security layer with input validation and SQL injection prevention
- Custom error classes (ValidationError, ParseError, ExecutionError, SecurityError)
- Comprehensive logging system with file and console output
- Configuration system with .env support
- Schema validation for tables (data types, constraints)
- Advanced SQL operators: HAVING, IN, NOT IN, BETWEEN, IS NULL
- Docker support with Dockerfile and docker-compose
- GitHub Actions CI/CD pipelines
- Community files: CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE
- Improved npm scripts (lint, format, dev, security)
- Enhanced documentation and examples

### Changed
- Updated query parser to use security validators and sanitizers
- Improved error messages with better context
- Enhanced CLI with better error handling

### Security
- SQL injection prevention in field/table names
- Input validation for all query components
- File path traversal prevention
- Query size limits

## [0.1.6] - Previous Release

### Features
- SELECT queries with WHERE, ORDER BY, GROUP BY, LIMIT, DISTINCT
- INSERT, UPDATE, DELETE operations
- INNER, LEFT, RIGHT JOIN support
- Aggregate functions: COUNT, SUM, AVG, MIN, MAX
- LIKE operator for pattern matching
- Interactive CLI shell
- CSV file operations

---

## Version History

### v1.0.0 (Planned)
- Full production release
- Complete security hardening
- Transaction support
- Query result caching
- REST API wrapper
- Web UI dashboard

### v0.2.0 (Planned)
- Additional advanced SQL features
- Performance optimizations
- Query execution statistics

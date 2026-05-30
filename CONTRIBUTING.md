# Contributing to Query-Master

Thank you for your interest in contributing to Query-Master! We welcome contributions from everyone.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## How to Contribute

### Reporting Bugs

- **Check existing issues** before creating a new one to avoid duplicates
- **Be specific** about the problem: what query failed, what was the error, what did you expect?
- **Include environment details**: Node.js version, OS, Query-Master version
- **Provide reproducible steps** with minimal example

### Suggesting Enhancements

- **Check existing issues** for similar suggestions
- **Explain the use case** - why would this feature be useful?
- **Provide examples** of how the feature would work
- **Label as enhancement request**

### Pull Requests

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code style
   - Use ESLint: `npm run lint`
   - Format code: `npm run format`
   - Keep functions small and focused
   - Add JSDoc comments for public functions

3. **Add tests** for new functionality
   ```bash
   npm test
   ```

4. **Update documentation** if adding new features
   - Update README.md
   - Add examples
   - Update JSDoc comments

5. **Commit with meaningful messages**
   ```bash
   git commit -m "feat: add HAVING clause support"
   git commit -m "fix: SQL injection vulnerability in field names"
   git commit -m "docs: add examples for advanced queries"
   ```

6. **Push to your fork** and create a Pull Request
   - Describe what you changed and why
   - Link related issues
   - Ensure all tests pass

## Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/query-master.git
cd query-master

# Install dependencies
npm install

# Run tests
npm test

# Run in development mode (with debug output)
npm run dev

# Format and lint code
npm run format
npm run lint
```

## Code Style

- Use 2-space indentation
- Use `const` by default, `let` if needed, avoid `var`
- Use meaningful variable names
- Keep functions under 50 lines when possible
- Add comments for complex logic
- Use JSDoc for all exports

Example:
```javascript
/**
 * Validates a table name for SQL injection attacks
 * @param {string} tableName - The table name to validate
 * @returns {boolean} True if valid
 * @throws {ValidationError} If invalid
 */
function tableName(tableName) {
  // Implementation
}
```

## Testing Guidelines

- Write tests for all new features
- Maintain or improve code coverage
- Test both success and error cases
- Use descriptive test names

```javascript
test("Should reject invalid table names with special characters", () => {
  expect(() => validators.tableName("table; DROP TABLE;")).toThrow();
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments to code
- Include examples for new features
- Update CHANGELOG.md

## Questions?

- Check existing [Issues](https://github.com/yourusername/query-master/issues)
- Read [README.md](README.md)
- Check [API documentation](docs/API.md)

Thank you for contributing! 🎉

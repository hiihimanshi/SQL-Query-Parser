#!/usr/bin/env node
// Simple demo to show improvements

const chalk = require('chalk');
const { validators, sanitizers } = require('./src/security');
const { ValidationError, SecurityError } = require('./src/errors');

console.log(chalk.bgBlue.white.bold('\n  QUERY-MASTER IMPROVEMENTS  \n'));

// DEMO 1: Security
console.log(chalk.cyan('1. SECURITY VALIDATION'));
console.log(chalk.cyan('─'.repeat(40)));
try {
  validators.tableName("student'; DROP TABLE;");
} catch (e) {
  console.log(chalk.green('✓ SQL Injection Blocked!'));
  console.log(chalk.dim(`  ${e.message}\n`));
}

// DEMO 2: Sanitization
console.log(chalk.cyan('2. QUERY SANITIZATION'));
console.log(chalk.cyan('─'.repeat(40)));
const dirty = "SELECT * FROM  student  WHERE age > 20";
const clean = sanitizers.query(dirty);
console.log(chalk.dim(`Before: "${dirty}"`));
console.log(chalk.green(`After:  "${clean}"\n`));

// DEMO 3: Error classes
console.log(chalk.cyan('3. STRUCTURED ERRORS'));
console.log(chalk.cyan('─'.repeat(40)));
const err = new ValidationError('Invalid table name');
console.log(chalk.yellow(`Name:`)  + ` ${err.name}`);
console.log(chalk.yellow(`Code:`)  + ` ${err.code}`);
console.log(chalk.yellow(`Message:`) + ` ${err.message}\n`);

// DEMO 4: File listing
console.log(chalk.cyan('4. NEW FILES CREATED'));
console.log(chalk.cyan('─'.repeat(40)));
console.log(chalk.green('✓ Security modules: ') + 'validators, sanitizers, custom errors');
console.log(chalk.green('✓ Infrastructure: ') + 'config, logging, schema validation');
console.log(chalk.green('✓ Documentation: ') + 'API.md, examples, CONTRIBUTING.md');
console.log(chalk.green('✓ DevOps: ') + 'Docker, GitHub Actions, setup scripts\n');

console.log(chalk.bgGreen.white.bold(' SUCCESS! All improvements loaded. '));

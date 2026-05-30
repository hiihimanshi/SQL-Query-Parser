#!/usr/bin/env node
const readline = require("readline");
const chalk = require("chalk");
const Table = require("cli-table3");
const logger = require("./logger");
const config = require("./config");
const { AppError } = require("./errors");
const {
  executeSELECTQuery,
  executeINSERTQuery,
  executeDELETEQuery,
  executeUPDATEQuery,
} = require("./queryExecutor");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printHeader() {
  console.log(chalk.bgBlue.white.bold(`\n  ${config.appName} v${config.appVersion}  `));
  console.log(chalk.bold("SQL Query Engine CLI\n"));
}

function printHelp() {
  console.log(chalk.cyan("\n📖 Query Engine CLI Usage:"));
  console.log(chalk.cyan("═".repeat(50)));
  
  console.log(chalk.yellow("\n📋 Supported SQL Commands:"));
  console.log(chalk.dim("  SELECT fields FROM table [WHERE ...] [ORDER BY ...] [GROUP BY ...] [LIMIT ...]"));
  console.log(chalk.dim("  INSERT INTO table (col1, col2) VALUES (val1, val2)"));
  console.log(chalk.dim("  UPDATE table SET col1 = val1 [WHERE ...]"));
  console.log(chalk.dim("  DELETE FROM table [WHERE ...]"));
  
  console.log(chalk.yellow("\n🔧 Special Commands:"));
  console.log(chalk.dim("  --help          Show this help message"));
  console.log(chalk.dim("  --version       Show application version"));
  console.log(chalk.dim("  --schema TABLE  Show table schema"));
  console.log(chalk.dim("  exit, quit      Exit the CLI"));
  
  console.log(chalk.yellow("\n💡 Examples:"));
  console.log(chalk.dim("  SELECT * FROM student;"));
  console.log(chalk.dim("  SELECT name, age FROM student WHERE age > 20;"));
  console.log(chalk.dim("  INSERT INTO student (id, name, age) VALUES (1, 'John', 21);"));
  
  console.log(chalk.cyan("═".repeat(50) + "\n"));
}

function formatResults(result) {
  if (!Array.isArray(result)) return result;
  if (result.length === 0) {
    return chalk.yellow("(No results)");
  }

  const table = new Table({
    head: Object.keys(result[0]).map(k => chalk.bold.cyan(k)),
    colWidths: Array(Object.keys(result[0]).length).fill(20),
    wordWrap: true,
  });

  for (const row of result) {
    table.push(Object.values(row));
  }

  return table.toString();
}

function formatError(error) {
  const timestamp = chalk.dim(new Date().toISOString());
  const errorType = chalk.red.bold(error.name || "Error");
  const message = chalk.red(error.message);
  const code = error.code ? chalk.dim(` [${error.code}]`) : "";
  
  let output = `${timestamp} ${errorType}${code}: ${message}`;
  
  if (config.isDev && error.stack) {
    output += "\n" + chalk.dim(error.stack);
  }
  
  if (error.details) {
    output += "\n" + chalk.dim(JSON.stringify(error.details, null, 2));
  }
  
  return output;
}

// Print header
printHeader();
console.log(chalk.dim(`📍 Environment: ${config.env}`));
console.log(chalk.dim(`📁 Data Directory: ${config.dataDir}`));
console.log(chalk.dim(`📝 Log Level: ${config.logging.level}`));
console.log(chalk.cyan(`\nType ${chalk.bold("--help")} for usage or enter SQL commands.\n`));

rl.setPrompt(chalk.green("SQL> "));
rl.prompt();

rl.on("line", async (line) => {
  const trimmed = line.trim();
  
  if (!trimmed) {
    rl.prompt();
    return;
  }

  if (trimmed === "exit" || trimmed === "quit") {
    console.log(chalk.cyan("\n👋 Goodbye!\n"));
    rl.close();
    return;
  }

  if (trimmed === "--help") {
    printHelp();
    rl.prompt();
    return;
  }

  if (trimmed === "--version") {
    console.log(chalk.cyan(`v${config.appVersion}`));
    rl.prompt();
    return;
  }

  try {
    const startTime = Date.now();
    let result, message;

    if (/^\s*SELECT/i.test(trimmed)) {
      result = await executeSELECTQuery(trimmed);
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✓ Query executed in ${duration}ms\n`));
      console.log(formatResults(result));
      logger.info("SELECT query executed", { query: trimmed, duration, rows: result?.length || 0 });
    } else if (/^\s*INSERT\s+INTO/i.test(trimmed)) {
      result = await executeINSERTQuery(trimmed);
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✓ ${result.message} (${duration}ms)`));
      logger.info("INSERT query executed", { query: trimmed, duration });
    } else if (/^\s*DELETE\s+FROM/i.test(trimmed)) {
      result = await executeDELETEQuery(trimmed);
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✓ ${result.message} (${duration}ms)`));
      logger.info("DELETE query executed", { query: trimmed, duration });
    } else if (/^\s*UPDATE\s+/i.test(trimmed)) {
      result = await executeUPDATEQuery(trimmed);
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✓ ${result.message} (${duration}ms)`));
      logger.info("UPDATE query executed", { query: trimmed, duration });
    } else {
      console.log(chalk.yellow("⚠️  Unrecognized command. Type --help for usage."));
    }
  } catch (error) {
    logger.error("Query execution failed", error);
    console.log(formatError(error));
  }
  
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

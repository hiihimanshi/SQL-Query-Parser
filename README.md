# SQL Query Parser

A lightweight Node.js SQL engine to parse and run SELECT, INSERT, UPDATE, and DELETE queries directly on CSV files. It supports advanced SQL features like JOINs, WHERE with logical operators, aggregation, and more—right from the command line or an interactive shell.

![screenshot](https://github.com/user-attachments/assets/c7d0501e-4403-436b-8595-e8a7b1d3009e)

## Features

Query CSV files using familiar SQL syntax
Supports WHERE conditions with AND, OR, and grouping
JOIN types: INNER, LEFT, RIGHT
Aggregate functions: COUNT, SUM, AVG, MIN, MAX
SQL clauses: ORDER BY, GROUP BY, LIMIT, DISTINCT
Interactive shell with color-coded output
CLI mode for one-off queries

## Installation

1. Clone this repository:
   ```sh
   git clone <repo-url>
   cd SQL-Query-Parser
   ```
2. Install dependencies:
   ```sh
   cd SQL-Query-Parser
   npm install
   ```

## Usage

### CLI

Run the CLI:

```sh
node src/cli.js
```

- Type SQL commands or `exit` to quit.
- Type `--help` for usage instructions.

### Interactive Shell

Run the interactive shell:

```sh
node src/outputs.js
```

- Type SQL commands or `exit` to quit.
- Type `--help` for usage instructions.

### Supported SQL Syntax

- `SELECT fields FROM table [WHERE ...] [ORDER BY ...] [GROUP BY ...] [LIMIT ...] [DISTINCT]`
- `INSERT INTO table (col1, col2) VALUES (val1, val2)`
- `UPDATE table SET col1 = val1 WHERE ...`
- `DELETE FROM table WHERE ...`
- WHERE supports AND, OR, parentheses, =, !=, >, <, >=, <=, LIKE
- JOINs: INNER, LEFT, RIGHT
- Aggregates: COUNT, SUM, AVG, MIN, MAX

### Examples

```sql
SELECT name, age FROM student WHERE (age > 18 AND grade = 'A') OR (name = 'John')
INSERT INTO student (id, name, age) VALUES (3, 'Alice', 22)
UPDATE student SET grade = 'B' WHERE score > 80
DELETE FROM student WHERE age < 18 OR grade = 'F'
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Submit a pull request.

## License

MIT

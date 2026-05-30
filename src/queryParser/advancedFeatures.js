const { ParseError } = require("../errors");

/**
 * Advanced SQL features parser - HAVING, IN, BETWEEN, IS NULL, etc.
 */

/**
 * Parse HAVING clause (filters aggregated results)
 * @param {string} havingString - HAVING clause string
 * @returns {Object} Parsed HAVING conditions
 */
function parseHavingClause(havingString) {
  if (!havingString) return null;

  const tokens = [];
  const regex =
    /\(|\)|\bAND\b|\bOR\b|[^\s()]+(?:\s*(?:=|!=|>|<|>=|<=|LIKE)\s*[^\s()]+)?/gi;
  let match;
  while ((match = regex.exec(havingString)) !== null) {
    tokens.push(match[0].trim());
  }

  function parseExpression(index = 0) {
    let operator;
    let result = null;

    while (index < tokens.length) {
      let token = tokens[index];

      if (token === "(") {
        const [expr, nextIdx] = parseExpression(index + 1);
        if (!result) result = expr;
        else result = { type: operator, left: result, right: expr };
        index = nextIdx;
      } else if (token === ")") {
        return [result, index + 1];
      } else if (token.toUpperCase() === "AND" || token.toUpperCase() === "OR") {
        operator = token.toUpperCase();
        index++;
      } else {
        // Parse condition (e.g., COUNT(*) > 5)
        const condMatch = token.match(/(.+?)(=|!=|>|<|>=|<=)(.+)/);
        if (condMatch) {
          const [, field, op, value] = condMatch;
          const cond = {
            type: "condition",
            field: field.trim(),
            operator: op,
            value: value.trim(),
          };
          if (!result) result = cond;
          else result = { type: operator, left: result, right: cond };
        }
        index++;
      }
    }

    return [result, index];
  }

  const [tree] = parseExpression();
  return tree;
}

/**
 * Parse IN operator
 * @param {string} inString - IN clause string
 * @returns {Object} Parsed IN condition
 */
function parseInClause(fieldName, inString) {
  const values = inString
    .replace(/^\s*\(\s*|\s*\)\s*$/g, "") // Remove outer parens
    .split(",")
    .map((v) => v.trim().replace(/^['"]|['"]$/g, ""));

  return {
    type: "condition",
    field: fieldName,
    operator: "IN",
    values,
  };
}

/**
 * Parse BETWEEN operator
 * @param {string} fieldName - Field name
 * @param {string} betweenString - BETWEEN range string
 * @returns {Object} Parsed BETWEEN condition
 */
function parseBetweenClause(fieldName, betweenString) {
  const [lower, upper] = betweenString
    .split(/\s+AND\s+/i)
    .map((v) => v.trim().replace(/^['"]|['"]$/g, ""));

  return {
    type: "condition",
    field: fieldName,
    operator: "BETWEEN",
    lower,
    upper,
  };
}

/**
 * Parse IS NULL / IS NOT NULL
 * @param {string} fieldName - Field name
 * @param {boolean} isNot - Whether it's IS NOT NULL
 * @returns {Object} Parsed IS NULL condition
 */
function parseIsNullClause(fieldName, isNot = false) {
  return {
    type: "condition",
    field: fieldName,
    operator: isNot ? "IS NOT NULL" : "IS NULL",
    value: null,
  };
}

/**
 * Parse CASE WHEN expression
 * @param {string} caseString - CASE expression string
 * @returns {Object} Parsed CASE expression
 */
function parseCaseExpression(caseString) {
  const whenRegex = /WHEN\s+(.+?)\s+THEN\s+(.+?)(?=WHEN|ELSE|END)/gi;
  const elseRegex = /ELSE\s+(.+?)\s+END/i;

  const whens = [];
  let match;

  while ((match = whenRegex.exec(caseString)) !== null) {
    whens.push({
      condition: match[1].trim(),
      result: match[2].trim(),
    });
  }

  const elseMatch = caseString.match(elseRegex);
  const elseResult = elseMatch ? elseMatch[1].trim() : null;

  return {
    type: "case",
    whens,
    else: elseResult,
  };
}

/**
 * Evaluate HAVING condition against aggregated data
 * @param {Object} condition - Parsed HAVING condition
 * @param {Object} row - Row with aggregated values
 * @returns {boolean} Whether row matches condition
 */
function evaluateHavingCondition(condition, row) {
  if (!condition) return true;

  if (condition.type === "condition") {
    const fieldValue = row[condition.field];
    const value = condition.value;

    switch (condition.operator) {
      case "=":
        return fieldValue === value || String(fieldValue) === String(value);
      case "!=":
        return fieldValue !== value && String(fieldValue) !== String(value);
      case ">":
        return Number(fieldValue) > Number(value);
      case "<":
        return Number(fieldValue) < Number(value);
      case ">=":
        return Number(fieldValue) >= Number(value);
      case "<=":
        return Number(fieldValue) <= Number(value);
      case "LIKE":
        const pattern = new RegExp(value.replace(/%/g, ".*"), "i");
        return pattern.test(String(fieldValue));
      default:
        return true;
    }
  }

  if (condition.type === "AND") {
    return (
      evaluateHavingCondition(condition.left, row) &&
      evaluateHavingCondition(condition.right, row)
    );
  }

  if (condition.type === "OR") {
    return (
      evaluateHavingCondition(condition.left, row) ||
      evaluateHavingCondition(condition.right, row)
    );
  }

  return true;
}

/**
 * Evaluate IN condition
 * @param {*} fieldValue - Field value to check
 * @param {Array} values - Array of allowed values
 * @param {boolean} isNot - Whether it's NOT IN
 * @returns {boolean} Whether field is in values
 */
function evaluateInCondition(fieldValue, values, isNot = false) {
  const found = values.some((v) => String(fieldValue) === String(v));
  return isNot ? !found : found;
}

/**
 * Evaluate BETWEEN condition
 * @param {*} fieldValue - Field value
 * @param {*} lower - Lower bound
 * @param {*} upper - Upper bound
 * @param {boolean} isNot - Whether it's NOT BETWEEN
 * @returns {boolean} Whether field is between bounds
 */
function evaluateBetweenCondition(fieldValue, lower, upper, isNot = false) {
  const val = Number(fieldValue);
  const lowerNum = Number(lower);
  const upperNum = Number(upper);
  const found = val >= lowerNum && val <= upperNum;
  return isNot ? !found : found;
}

/**
 * Evaluate IS NULL condition
 * @param {*} fieldValue - Field value
 * @param {boolean} isNot - Whether it's IS NOT NULL
 * @returns {boolean} Whether field is null
 */
function evaluateIsNullCondition(fieldValue, isNot = false) {
  const isNull = fieldValue === null || fieldValue === undefined || fieldValue === "";
  return isNot ? !isNull : isNull;
}

module.exports = {
  parseHavingClause,
  parseInClause,
  parseBetweenClause,
  parseIsNullClause,
  parseCaseExpression,
  evaluateHavingCondition,
  evaluateInCondition,
  evaluateBetweenCondition,
  evaluateIsNullCondition,
};

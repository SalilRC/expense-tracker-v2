import { EXPENSE_CATEGORIES } from './store.js';

const headers = ['id', 'name', 'category', 'date', 'amount', 'createdAt'];
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function escapeCsvField(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsvRows(content) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let closedQuote = false;
  let hasContent = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (inQuotes) {
      if (character === '"') {
        if (content[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
          closedQuote = true;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (closedQuote) {
      if (character === ',') {
        row.push(field);
        field = '';
        closedQuote = false;
        hasContent = true;
        continue;
      }
      if (character === '\r' || character === '\n') {
        row.push(field);
        if (hasContent || row.some((value) => value !== '')) rows.push(row);
        row = [];
        field = '';
        closedQuote = false;
        hasContent = false;
        if (character === '\r' && content[index + 1] === '\n') index += 1;
        continue;
      }
      throw new Error('Invalid CSV: unexpected character after a quoted field.');
    }

    if (character === '"') {
      if (field !== '') {
        throw new Error('Invalid CSV: quote in an unquoted field.');
      }
      inQuotes = true;
      hasContent = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
      hasContent = true;
    } else if (character === '\r' || character === '\n') {
      row.push(field);
      if (hasContent || row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
      hasContent = false;
      if (character === '\r' && content[index + 1] === '\n') index += 1;
    } else {
      field += character;
      if (character !== '') hasContent = true;
    }
  }

  if (inQuotes) {
    throw new Error('Invalid CSV: unterminated quoted field.');
  }
  if (field !== '' || row.length > 0 || hasContent || closedQuote) {
    row.push(field);
    if (hasContent || row.some((value) => value !== '')) rows.push(row);
  }

  return rows;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validateExpenseRow(values, rowNumber) {
  const [id, rawName, category, date, rawAmount, createdAt] = values;
  const prefix = `Invalid CSV row ${rowNumber}:`;

  if (!uuidPattern.test(id)) {
    throw new Error(`${prefix} id must be a valid UUID.`);
  }

  const name = rawName.trim();
  if (!name) {
    throw new Error(`${prefix} name is required.`);
  }
  if (!EXPENSE_CATEGORIES.includes(category)) {
    throw new Error(`${prefix} category is not supported.`);
  }
  if (!isValidDate(date)) {
    throw new Error(`${prefix} date must be a valid YYYY-MM-DD date.`);
  }

  const amount = Number(rawAmount);
  if (rawAmount.trim() === '' || !Number.isFinite(amount) || amount < 0.01) {
    throw new Error(`${prefix} amount must be finite and at least 0.01.`);
  }

  const timestamp = Date.parse(createdAt);
  if (
    !Number.isFinite(timestamp) ||
    !/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/.test(createdAt)
  ) {
    throw new Error(`${prefix} createdAt must be an ISO 8601 timestamp.`);
  }

  return { id, name, category, date, amount, createdAt };
}

export function serializeExpensesToCsv(expenses) {
  if (!Array.isArray(expenses)) {
    throw new TypeError('Expenses must be provided as an array.');
  }

  const records = [
    headers,
    ...expenses.map((expense) => headers.map((header) => expense[header])),
  ];
  return records
    .map((record) => record.map(escapeCsvField).join(','))
    .join('\r\n');
}

export function parseExpensesCsv(content) {
  if (typeof content !== 'string') {
    throw new TypeError('CSV content must be provided as a string.');
  }

  const rows = parseCsvRows(content.replace(/^\uFEFF/, ''));
  if (rows.length === 0) return [];

  if (
    rows[0].length !== headers.length ||
    rows[0].some((header, index) => header !== headers[index])
  ) {
    throw new Error(`Invalid CSV: header must be ${headers.join(',')}.`);
  }

  return rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error(
        `Invalid CSV row ${index + 2}: expected ${headers.length} fields, received ${values.length}.`,
      );
    }
    return validateExpenseRow(values, index + 2);
  });
}
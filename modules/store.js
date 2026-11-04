export const EXPENSE_CATEGORIES = Object.freeze([
  'Groceries',
  'Outside Food',
  'Fuel',
  'Travel',
  'Leisure',
  'Medicines',
  'Utilities',
  'Others',
]);

const expenses = [];

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function createId() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10).join(''),
  ].join('-');
}

function validateExpense(input) {
  const errors = {};
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const category = input?.category;
  const date = input?.date;
  const amountText =
    typeof input?.amount === 'string' ? input.amount.trim() : input?.amount;
  const amount = amountText === '' ? Number.NaN : Number(amountText);

  if (!name) {
    errors.name = 'Enter an expense name.';
  }

  if (!EXPENSE_CATEGORIES.includes(category)) {
    errors.category = 'Select a supported category.';
  }

  if (!isValidDate(date)) {
    errors.date = 'Enter a valid expense date.';
  }

  if (!Number.isFinite(amount) || amount < 0.01) {
    errors.amount = 'Enter an amount of at least ₹0.01.';
  }

  return {
    errors,
    normalized: { name, category, date, amount },
  };
}

export function addExpense(input) {
  const { errors, normalized } = validateExpense(input);

  if (Object.keys(errors).length > 0) {
    return { expense: null, errors };
  }

  const expense = {
    id: createId(),
    ...normalized,
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);

  return { expense: { ...expense }, errors: {} };
}

export function updateExpense(id, input) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) {
    return { expense: null, errors: { id: 'Expense was not found.' } };
  }

  const { errors, normalized } = validateExpense(input);
  if (Object.keys(errors).length > 0) {
    return { expense: null, errors };
  }

  const updatedExpense = {
    ...expenses[index],
    ...normalized,
  };
  expenses[index] = updatedExpense;

  return { expense: { ...updatedExpense }, errors: {} };
}

export function deleteExpense(id) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) {
    return { deleted: false, expense: null };
  }

  const [expense] = expenses.splice(index, 1);
  return { deleted: true, expense: { ...expense } };
}

export function getExpenses() {
  return expenses.map((expense) => ({ ...expense }));
}
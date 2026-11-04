import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '../modules/store.js';

const validExpense = {
  name: 'Weekly groceries',
  category: 'Groceries',
  date: '2026-11-04',
  amount: '1234.5',
};

describe('expense store', () => {
  test('adds a valid expense with a UUID and ISO creation timestamp', () => {
    const before = getExpenses().length;

    const { expense, errors } = addExpense(validExpense);

    expect(errors).toEqual({});
    expect(expense).toEqual({
      id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ),
      name: validExpense.name,
      category: validExpense.category,
      date: validExpense.date,
      amount: 1234.5,
      createdAt: expect.any(String),
    });
    expect(Number.isNaN(Date.parse(expense.createdAt))).toBe(false);
    expect(new Date(expense.createdAt).toISOString()).toBe(expense.createdAt);
    expect(getExpenses()).toHaveLength(before + 1);
  });

  test.each([
    ['name', ''],
    ['name', '   '],
    ['category', 'Unknown'],
    ['date', ''],
    ['date', '2026-02-30'],
    ['date', '2025-02-29'],
    ['date', '04-11-2026'],
    ['amount', ''],
    ['amount', '0'],
    ['amount', '0.001'],
    ['amount', '-1'],
    ['amount', 'not-a-number'],
  ])('rejects invalid %s value %s without changing state', (field, value) => {
    const before = getExpenses();

    const { expense, errors } = addExpense({ ...validExpense, [field]: value });

    expect(expense).toBeNull();
    expect(errors[field]).toEqual(expect.any(String));
    expect(getExpenses()).toEqual(before);
  });

  test('accepts future dates and duplicate entries', () => {
    const futureExpense = { ...validExpense, date: '2099-12-31' };
    const before = getExpenses().length;

    const first = addExpense(futureExpense);
    const duplicate = addExpense(futureExpense);

    expect(first.errors).toEqual({});
    expect(duplicate.errors).toEqual({});
    expect(getExpenses()).toHaveLength(before + 2);
    expect(first.expense.id).not.toBe(duplicate.expense.id);
  });

  test('returns a defensive copy of the current collection', () => {
    addExpense(validExpense);
    const expenses = getExpenses();
    expenses.pop();

    expect(getExpenses()).toHaveLength(expenses.length + 1);
  });

  test('updates an expense by ID and preserves its ID, timestamp, and precision', () => {
    const added = addExpense({ ...validExpense, amount: '0.015' }).expense;
    const result = updateExpense(added.id, {
      ...validExpense,
      name: 'Updated expense',
      amount: '1.239',
    });

    expect(result.errors).toEqual({});
    expect(result.expense).toEqual({
      ...added,
      name: 'Updated expense',
      amount: 1.239,
    });
    expect(getExpenses().find(({ id }) => id === added.id)).toEqual(result.expense);
  });

  test('rejects invalid updates without changing the existing expense', () => {
    const added = addExpense(validExpense).expense;
    const before = getExpenses();

    const result = updateExpense(added.id, { ...validExpense, amount: '0' });

    expect(result.expense).toBeNull();
    expect(result.errors.amount).toEqual(expect.any(String));
    expect(getExpenses()).toEqual(before);
  });

  test('reports an unknown expense ID without changing state', () => {
    const before = getExpenses();

    const result = updateExpense('missing-id', validExpense);

    expect(result.expense).toBeNull();
    expect(result.errors.id).toEqual(expect.any(String));
    expect(getExpenses()).toEqual(before);
  });

  test('deletes only the matching expense and preserves collection order', () => {
    const first = addExpense(validExpense).expense;
    const second = addExpense({ ...validExpense, name: 'Second' }).expense;

    const result = deleteExpense(first.id);

    expect(result.deleted).toBe(true);
    expect(result.expense).toEqual(first);
    expect(getExpenses().filter(({ id }) => id === second.id)).toHaveLength(1);
    expect(getExpenses().some(({ id }) => id === first.id)).toBe(false);
  });

  test('reports an unknown delete ID without changing state', () => {
    const before = getExpenses();

    const result = deleteExpense('missing-id');

    expect(result.deleted).toBe(false);
    expect(getExpenses()).toEqual(before);
  });
});

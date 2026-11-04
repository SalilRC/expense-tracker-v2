import { calculateCategoryMonthSummary } from '../modules/analytics.js';

const categories = [
  'Groceries',
  'Outside Food',
  'Fuel',
  'Travel',
  'Leisure',
  'Medicines',
  'Utilities',
  'Others',
];

function expense(name, category, date, amount) {
  return { id: name, name, category, date, amount };
}

describe('category by month calculations', () => {
  test('returns all category, month, and grand totals from original amounts', () => {
    const expenses = [
      expense('a', 'Groceries', '2026-12-03', 1.235),
      expense('b', 'Groceries', '2026-12-04', 2.111),
      expense('c', 'Fuel', '2026-10-31', 10.129),
    ];

    const summary = calculateCategoryMonthSummary(expenses);

    expect(summary.categories).toEqual(categories);
    expect(summary.months).toEqual(['2026-10', '2026-12']);
    expect(summary.categoryTotals.Groceries).toBeCloseTo(3.346);
    expect(summary.categoryTotals.Fuel).toBeCloseTo(10.129);
    expect(summary.monthlyTotals['2026-10']).toBeCloseTo(10.129);
    expect(summary.monthlyTotals['2026-12']).toBeCloseTo(3.346);
    expect(summary.grandTotal).toBeCloseTo(13.475);
    expect(summary.categoryMonthTotals.Groceries['2026-10']).toBe(0);
    expect(expenses[0].amount).toBe(1.235);
  });

  test('returns all categories and a zero total for an empty collection', () => {
    const summary = calculateCategoryMonthSummary([]);

    expect(summary.categories).toEqual(categories);
    expect(summary.months).toEqual([]);
    expect(summary.grandTotal).toBe(0);
    expect(summary.categoryTotals.Groceries).toBe(0);
  });
});

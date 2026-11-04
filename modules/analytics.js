import { EXPENSE_CATEGORIES } from './store.js';

export function calculateCategoryMonthSummary(expenses) {
  const months = [...new Set(expenses.map(({ date }) => date.slice(0, 7)))].sort();
  const categoryMonthTotals = Object.fromEntries(
    EXPENSE_CATEGORIES.map((category) => [
      category,
      Object.fromEntries(months.map((month) => [month, 0])),
    ]),
  );
  const categoryTotals = Object.fromEntries(
    EXPENSE_CATEGORIES.map((category) => [category, 0]),
  );
  const monthlyTotals = Object.fromEntries(months.map((month) => [month, 0]));

  expenses.forEach(({ category, date, amount }) => {
    const month = date.slice(0, 7);
    categoryMonthTotals[category][month] += amount;
    categoryTotals[category] += amount;
    monthlyTotals[month] += amount;
  });

  return {
    categories: [...EXPENSE_CATEGORIES],
    months,
    categoryMonthTotals,
    categoryTotals,
    monthlyTotals,
    grandTotal: expenses.reduce((total, { amount }) => total + amount, 0),
  };
}
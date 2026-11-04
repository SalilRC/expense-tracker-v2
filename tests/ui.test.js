import {
  clearExpenseErrors,
  renderExpenseErrors,
  renderExpenseLog,
  renderExpenseSummary,
} from '../modules/ui.js';

function expense(name, date, amount) {
  return {
    id: `${name}-${date}`,
    name,
    category: 'Groceries',
    date,
    amount,
    createdAt: '2026-11-04T10:00:00.000Z',
  };
}

describe('basic expense log', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="expense-log"></div>';
  });

  test('renders entries by date descending and newest insertion first for date ties', () => {
    renderExpenseLog([
      expense('Older date', '2026-10-31', 9),
      expense('First same-date entry', '2026-11-04', 1),
      expense('Newest date', '2026-11-05', 1234.5),
      expense('Second same-date entry', '2026-11-04', 2),
    ]);

    const rows = [...document.querySelectorAll('#expense-log tbody tr')];

    expect(rows.map((row) => row.cells[1].textContent)).toEqual([
      'Newest date',
      'Second same-date entry',
      'First same-date entry',
      'Older date',
    ]);
    expect(rows[0].cells[3].textContent).toBe('05-Nov-2026');
    expect(rows[0].cells[4].textContent).toBe(
      (1234.5).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      }),
    );
  });

  test('renders expense names as text rather than markup', () => {
    renderExpenseLog([expense('<img src=x onerror=alert(1)>', '2026-11-04', 1)]);

    expect(document.querySelector('#expense-log img')).toBeNull();
    expect(document.querySelector('#expense-log tbody').textContent).toContain(
      '<img src=x onerror=alert(1)>',
    );
  });

  test('reports a missing log container', () => {
    document.body.innerHTML = '';

    expect(() => renderExpenseLog([])).toThrow(
      'Expense log container #expense-log was not found.',
    );
  });

  test('renders required columns, sorted row numbers, actions, and empty state', () => {
    renderExpenseLog([
      expense('Older', '2026-10-31', 9),
      expense('Newer', '2026-11-05', 12.345),
    ]);

    expect([...document.querySelectorAll('#expense-log thead th')].map((cell) =>
      cell.textContent,
    )).toEqual(['#', 'Expense Name', 'Category', 'Date', 'Amount', 'Actions']);
    const rows = [...document.querySelectorAll('#expense-log tbody tr')];
    expect(rows.map((row) => row.cells[0].textContent)).toEqual(['1', '2']);
    expect(rows[0].cells[1].textContent).toBe('Newer');
    expect(rows[0].cells[4].textContent).toContain('12.35');
    expect(rows[0].querySelector('[data-action="edit"]').textContent).toBe(
      'Edit',
    );
    expect(rows[0].querySelector('[data-action="delete"]').textContent).toBe(
      'Delete',
    );

    renderExpenseLog([]);
    expect(document.getElementById('expense-log').textContent).toContain(
      'No expenses recorded yet',
    );
  });

  test('renders 50 or more entries', () => {
    const expenses = Array.from({ length: 55 }, (_, index) =>
      expense(`Expense ${index}`, '2026-11-04', index + 1),
    );

    renderExpenseLog(expenses);

    expect(document.querySelectorAll('#expense-log tbody tr')).toHaveLength(55);
  });

  test('renders the category and month summary with totals and rounded values', () => {
    document.body.innerHTML = '<div id="expense-summary"></div>';
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
    const categoryMonthTotals = Object.fromEntries(
      categories.map((category) => [
        category,
        { '2026-10': 0, '2026-11': 0 },
      ]),
    );
    categoryMonthTotals.Groceries['2026-10'] = 12.345;
    categoryMonthTotals.Fuel['2026-11'] = 4.5;
    const categoryTotals = Object.fromEntries(
      categories.map((category) => [
        category,
        categoryMonthTotals[category]['2026-10'] +
          categoryMonthTotals[category]['2026-11'],
      ]),
    );

    renderExpenseSummary({
      categories,
      months: ['2026-10', '2026-11'],
      categoryMonthTotals,
      categoryTotals,
      monthlyTotals: { '2026-10': 12.345, '2026-11': 4.5 },
      grandTotal: 16.845,
    });

    const table = document.querySelector('#expense-summary table');
    expect([...table.tHead.rows[0].cells].map((cell) => cell.textContent)).toEqual([
      'Category',
      'Oct 2026',
      'Nov 2026',
      'Total',
    ]);
    expect(table.tBodies[0].rows[0].cells[2].textContent).toContain('₹0.00');
    expect(table.tBodies[0].rows[0].cells[3].textContent).toContain('₹12.35');
    expect(table.tBodies[0].rows[8].cells[0].textContent).toBe('Grand Total');
    expect(table.tBodies[0].rows[7].cells[0].textContent).toBe('Others');
    expect(table.tBodies[0].rows[8].cells[3].textContent).toContain('₹16.85');
    expect(
      document.querySelector('#expense-summary .expense-summary-scroll'),
    ).not.toBeNull();
  });

  test('renders all categories and a single Total column when summary is empty', () => {
    document.body.innerHTML = '<div id="expense-summary"></div>';
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
    const categoryTotals = Object.fromEntries(
      categories.map((category) => [category, 0]),
    );

    renderExpenseSummary({
      categories,
      months: [],
      categoryMonthTotals: Object.fromEntries(
        categories.map((category) => [category, {}]),
      ),
      categoryTotals,
      monthlyTotals: {},
      grandTotal: 0,
    });

    const table = document.querySelector('#expense-summary table');
    expect([...table.tHead.rows[0].cells].map((cell) => cell.textContent)).toEqual([
      'Category',
      'Total',
    ]);
    expect(table.tBodies[0].rows).toHaveLength(9);
    expect(table.textContent.match(/₹0\.00/g)).toHaveLength(9);
  });
});

describe('expense form validation feedback', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="expense-form">
        <input name="name">
        <span id="name-error"></span>
        <select name="category"></select>
        <span id="category-error"></span>
        <input name="date">
        <span id="date-error"></span>
        <input name="amount">
        <span id="amount-error"></span>
      </form>
    `;
  });

  test('renders inline field errors, marks invalid controls, and focuses the first', () => {
    const form = document.getElementById('expense-form');

    renderExpenseErrors(form, {
      name: 'Enter an expense name.',
      amount: 'Enter a positive amount.',
    });

    expect(document.getElementById('name-error').textContent).toBe(
      'Enter an expense name.',
    );
    expect(document.getElementById('amount-error').textContent).toBe(
      'Enter a positive amount.',
    );
    expect(form.elements.namedItem('name').getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(
      form.elements.namedItem('category').hasAttribute('aria-invalid'),
    ).toBe(false);
    expect(document.activeElement).toBe(form.elements.namedItem('name'));
  });

  test('clears inline errors and invalid state from every field', () => {
    const form = document.getElementById('expense-form');
    const fields = ['name', 'category', 'date', 'amount'];
    fields.forEach((field) => {
      form.elements.namedItem(field).setAttribute('aria-invalid', 'true');
      document.getElementById(`${field}-error`).textContent = 'Invalid value.';
    });

    clearExpenseErrors(form);

    fields.forEach((field) => {
      expect(document.getElementById(`${field}-error`).textContent).toBe('');
      expect(
        form.elements.namedItem(field).hasAttribute('aria-invalid'),
      ).toBe(false);
    });
  });
});

import {
  clearExpenseErrors,
  renderExpenseErrors,
  renderExpenseLog,
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

    expect(rows.map((row) => row.cells[0].textContent)).toEqual([
      'Newest date',
      'Second same-date entry',
      'First same-date entry',
      'Older date',
    ]);
    expect(rows[0].cells[2].textContent).toBe('05-Nov-2026');
    expect(rows[0].cells[3].textContent).toBe(
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

import { getExpenses } from '../modules/store.js';
import { initializeExpenseApp } from '../app.js';

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

function setUpForm() {
  document.body.innerHTML = `
    <form id="expense-form" novalidate>
      <label for="expense-name">Expense Name</label>
      <input id="expense-name" name="name" type="text" required>
      <span id="name-error"></span>
      <label for="expense-category">Category</label>
      <select id="expense-category" name="category" required>
        <option value="">Select a category</option>
        ${categories.map((category) => `<option>${category}</option>`).join('')}
      </select>
      <span id="category-error"></span>
      <label for="expense-date">Expense Date</label>
      <input id="expense-date" name="date" type="date" required>
      <span id="date-error"></span>
      <label for="expense-amount">Amount in ₹</label>
      <input id="expense-amount" name="amount" type="number" min="0.01" step="any" required>
      <span id="amount-error"></span>
      <button type="submit">Add Expense</button>
    </form>
    <div id="expense-log"></div>
  `;
  initializeExpenseApp(document);
}

function submitForm() {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  document.getElementById('expense-form').dispatchEvent(event);
  return event;
}

describe('expense form submission', () => {
  beforeEach(setUpForm);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('defaults the date to the current local calendar date', () => {
    const today = new Date();
    const expected = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');

    expect(document.getElementById('expense-date').value).toBe(expected);
  });

  test('shows inline errors and does not change store or log for invalid input', () => {
    const before = getExpenses();
    document.getElementById('expense-date').value = '';

    const event = submitForm();

    expect(event.defaultPrevented).toBe(true);
    expect(document.getElementById('name-error').textContent).not.toBe('');
    expect(document.getElementById('category-error').textContent).not.toBe('');
    expect(document.getElementById('date-error').textContent).not.toBe('');
    expect(document.getElementById('amount-error').textContent).not.toBe('');
    expect(
      document
        .getElementById('expense-name')
        .getAttribute('aria-invalid'),
    ).toBe('true');
    expect(getExpenses()).toEqual(before);
    expect(document.querySelector('#expense-log tbody')).toBeNull();
  });

  test('adds and displays a valid expense, prevents reload, and resets to defaults', () => {
    const before = getExpenses().length;
    document.getElementById('expense-name').value = 'Lunch';
    document.getElementById('expense-category').value = 'Outside Food';
    document.getElementById('expense-date').value = '2026-11-04';
    document.getElementById('expense-amount').value = '250';

    const event = submitForm();

    expect(event.defaultPrevented).toBe(true);
    expect(getExpenses()).toHaveLength(before + 1);
    expect(document.querySelector('#expense-log tbody').textContent).toContain(
      'Lunch',
    );
    expect(document.querySelector('#expense-log tbody').textContent).toContain(
      'Outside Food',
    );
    expect(document.getElementById('expense-name').value).toBe('');
    expect(document.getElementById('expense-category').value).toBe('');
    expect(document.getElementById('expense-amount').value).toBe('');
    const today = new Date();
    expect(document.getElementById('expense-date').value).toBe(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    );
    expect(document.getElementById('name-error').textContent).toBe('');
    expect(
      document.getElementById('expense-name').hasAttribute('aria-invalid'),
    ).toBe(false);
  });

  test('accepts future dates and duplicate submissions', () => {
    const before = getExpenses().length;
    document.getElementById('expense-name').value = 'Future expense';
    document.getElementById('expense-category').value = 'Groceries';
    document.getElementById('expense-date').value = '2099-12-31';
    document.getElementById('expense-amount').value = '0.01';

    submitForm();
    document.getElementById('expense-name').value = 'Future expense';
    document.getElementById('expense-category').value = 'Groceries';
    document.getElementById('expense-date').value = '2099-12-31';
    document.getElementById('expense-amount').value = '0.01';
    submitForm();

    expect(getExpenses()).toHaveLength(before + 2);
    expect(
      [...document.querySelectorAll('#expense-log tbody tr')].filter((row) =>
        row.textContent.includes('Future expense'),
      ),
    ).toHaveLength(2);
  });
});

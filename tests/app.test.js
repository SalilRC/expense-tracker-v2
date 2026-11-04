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
      <button id="cancel-edit" type="button" hidden>Cancel</button>
    </form>
    <div id="expense-log"></div>
    <div id="expense-summary"></div>
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

  test('updates an expense, re-sorts it, and canceling an edit changes nothing', () => {
    document.getElementById('expense-name').value = 'First';
    document.getElementById('expense-category').value = 'Groceries';
    document.getElementById('expense-date').value = '2026-11-04';
    document.getElementById('expense-amount').value = '1';
    submitForm();
    document.getElementById('expense-name').value = 'Second';
    document.getElementById('expense-category').value = 'Fuel';
    document.getElementById('expense-date').value = '2026-11-03';
    document.getElementById('expense-amount').value = '2';
    submitForm();

    const secondRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Second',
    );
    secondRow.querySelector('[data-action="edit"]').click();
    expect(document.getElementById('expense-name').value).toBe('Second');
    expect(document.querySelector('#expense-log tr[data-editing="true"]')).not.toBeNull();
    expect(document.querySelector('#expense-form button[type="submit"]').textContent).toBe(
      'Update Expense',
    );
    const beforeCancel = getExpenses();
    document.getElementById('cancel-edit').click();
    expect(getExpenses()).toEqual(beforeCancel);
    expect(document.getElementById('expense-name').value).toBe('');

    const secondRowAgain = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Second',
    );
    secondRowAgain.querySelector('[data-action="edit"]').click();
    document.getElementById('expense-name').value = 'Moved later';
    document.getElementById('expense-date').value = '2026-11-06';
    document.getElementById('expense-amount').value = '1.239';
    submitForm();

    expect(
      [...document.querySelectorAll('#expense-log tbody tr')].find(
        (row) => row.cells[1].textContent === 'Moved later',
      ),
    ).toBeDefined();
    expect(document.querySelector('#expense-summary tbody')).not.toBeNull();
    expect(getExpenses().find(({ name }) => name === 'Moved later').amount).toBe(
      1.239,
    );
  });

  test('switches the active edit and supports inline delete cancellation and confirmation', () => {
    document.getElementById('expense-name').value = 'Delete me';
    document.getElementById('expense-category').value = 'Groceries';
    document.getElementById('expense-date').value = '2026-11-04';
    document.getElementById('expense-amount').value = '5';
    submitForm();
    document.getElementById('expense-name').value = 'Keep me';
    document.getElementById('expense-category').value = 'Fuel';
    document.getElementById('expense-date').value = '2026-11-05';
    document.getElementById('expense-amount').value = '7';
    submitForm();

    const deleteMeRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Delete me',
    );
    deleteMeRow.querySelector('[data-action="edit"]').click();
    const keepMeRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Keep me',
    );
    keepMeRow.querySelector('[data-action="edit"]').click();
    expect(document.getElementById('expense-name').value).toBe('Keep me');
    expect(document.querySelectorAll('#expense-log tr[data-editing="true"]')).toHaveLength(1);

    const targetRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Delete me',
    );
    targetRow.querySelector('[data-action="delete"]').click();
    let promptRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Delete me',
    );
    expect(promptRow.textContent).toContain('Delete this entry?');
    const beforeCancel = getExpenses();
    promptRow.querySelector('[data-action="cancel-delete"]').click();
    expect(getExpenses()).toEqual(beforeCancel);

    const rowAgain = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Delete me',
    );
    rowAgain.querySelector('[data-action="delete"]').click();
    promptRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (row) => row.cells[1].textContent === 'Delete me',
    );
    promptRow.querySelector('[data-action="confirm-delete"]').click();
    expect(getExpenses().some(({ name }) => name === 'Delete me')).toBe(false);
    expect(document.querySelector('#expense-summary tbody')).not.toBeNull();
  });

  test('removes a month column after deleting its last expense', () => {
    document.getElementById('expense-name').value = 'Only expense in month';
    document.getElementById('expense-category').value = 'Others';
    document.getElementById('expense-date').value = '2098-01-02';
    document.getElementById('expense-amount').value = '3';
    submitForm();

    expect(
      [...document.querySelectorAll('#expense-summary thead th')].some((cell) =>
        cell.textContent.includes('Jan 2098'),
      ),
    ).toBe(true);

    const row = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (item) => item.cells[1].textContent === 'Only expense in month',
    );
    row.querySelector('[data-action="delete"]').click();
    const promptRow = [...document.querySelectorAll('#expense-log tbody tr')].find(
      (item) => item.cells[1].textContent === 'Only expense in month',
    );
    promptRow.querySelector('[data-action="confirm-delete"]').click();

    expect(
      [...document.querySelectorAll('#expense-summary thead th')].some((cell) =>
        cell.textContent.includes('Jan 2098'),
      ),
    ).toBe(false);
  });
});

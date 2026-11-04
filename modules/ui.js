const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const validationFields = ['name', 'category', 'date', 'amount'];

function formatExpenseDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}-${monthNames[Number(month) - 1]}-${year}`;
}

function createCell(tagName, value) {
  const cell = document.createElement(tagName);
  cell.textContent = value;
  return cell;
}

export function renderExpenseErrors(form, errors) {
  const doc = form.ownerDocument;
  let firstInvalidInput;

  validationFields.forEach((fieldName) => {
    const input = form.elements.namedItem(fieldName);
    const error = doc.getElementById(`${fieldName}-error`);
    const message = errors[fieldName] || '';
    error.textContent = message;

    if (message) {
      input.setAttribute('aria-invalid', 'true');
      firstInvalidInput ||= input;
    } else {
      input.removeAttribute('aria-invalid');
    }
  });

  firstInvalidInput?.focus();
}

export function clearExpenseErrors(form) {
  const doc = form.ownerDocument;

  validationFields.forEach((fieldName) => {
    const input = form.elements.namedItem(fieldName);
    const error = doc.getElementById(`${fieldName}-error`);
    input.removeAttribute('aria-invalid');
    error.textContent = '';
  });
}

export function renderExpenseLog(expenses) {
  const container = document.getElementById('expense-log');
  if (!container) {
    throw new Error('Expense log container #expense-log was not found.');
  }

  container.replaceChildren();
  if (expenses.length === 0) {
    return;
  }

  const table = document.createElement('table');
  table.setAttribute('aria-label', 'Expenses');
  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Expense Name', 'Category', 'Date', 'Amount'].forEach((label) => {
    headerRow.append(createCell('th', label));
  });
  head.append(headerRow);

  const body = document.createElement('tbody');
  const orderedExpenses = expenses
    .map((expense, index) => ({ expense, index }))
    .sort(
      (left, right) =>
        right.expense.date.localeCompare(left.expense.date) ||
        right.index - left.index,
    );

  orderedExpenses.forEach(({ expense }) => {
    const row = document.createElement('tr');
    row.append(
      createCell('td', expense.name),
      createCell('td', expense.category),
      createCell('td', formatExpenseDate(expense.date)),
      createCell(
        'td',
        expense.amount.toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
        }),
      ),
    );
    body.append(row);
  });

  table.append(head, body);
  container.append(table);
}
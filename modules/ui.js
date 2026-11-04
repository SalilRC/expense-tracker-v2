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
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatExpenseDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}-${monthNames[Number(month) - 1]}-${year}`;
}

function formatExpenseMonth(value) {
  const [year, month] = value.split('-');
  return `${monthNames[Number(month) - 1]} ${year}`;
}

function createCell(doc, tagName, value) {
  const cell = doc.createElement(tagName);
  cell.textContent = value;
  return cell;
}

function createActionButton(doc, label, action, id) {
  const button = doc.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.expenseId = id;
  return button;
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

export function setExpenseFormMode(form, expense, localToday) {
  const doc = form.ownerDocument;
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = doc.getElementById('cancel-edit');
  const heading = doc.getElementById('expense-form-heading');

  clearExpenseErrors(form);
  if (expense) {
    validationFields.forEach((fieldName) => {
      form.elements.namedItem(fieldName).value = String(expense[fieldName]);
    });
    submitButton.textContent = 'Update Expense';
    if (cancelButton) cancelButton.hidden = false;
    if (heading) heading.textContent = 'Edit an Expense';
    return;
  }

  form.reset();
  form.elements.namedItem('date').value = localToday;
  submitButton.textContent = 'Add Expense';
  if (cancelButton) cancelButton.hidden = true;
  if (heading) heading.textContent = 'Add an Expense';
}

export function renderExpenseLog(expenses, options = {}) {
  const container = document.getElementById('expense-log');
  if (!container) {
    throw new Error('Expense log container #expense-log was not found.');
  }

  const doc = container.ownerDocument;
  container.replaceChildren();
  if (expenses.length === 0) {
    const emptyMessage = doc.createElement('p');
    emptyMessage.textContent = 'No expenses recorded yet';
    container.append(emptyMessage);
    return;
  }

  const table = doc.createElement('table');
  table.setAttribute('aria-label', 'Expenses');
  const head = doc.createElement('thead');
  const headerRow = doc.createElement('tr');
  ['#', 'Expense Name', 'Category', 'Date', 'Amount', 'Actions'].forEach(
    (label) => headerRow.append(createCell(doc, 'th', label)),
  );
  head.append(headerRow);

  const orderedExpenses = expenses
    .map((expense, index) => ({ expense, index }))
    .sort(
      (left, right) =>
        right.expense.date.localeCompare(left.expense.date) ||
        right.index - left.index,
    );

  const body = doc.createElement('tbody');
  orderedExpenses.forEach(({ expense }, index) => {
    const row = doc.createElement('tr');
    row.dataset.expenseId = expense.id;
    if (expense.id === options.editingId) row.dataset.editing = 'true';
    row.append(
      createCell(doc, 'td', String(index + 1)),
      createCell(doc, 'td', expense.name),
      createCell(doc, 'td', expense.category),
      createCell(doc, 'td', formatExpenseDate(expense.date)),
      createCell(doc, 'td', currencyFormatter.format(expense.amount)),
    );

    const actions = doc.createElement('td');
    if (expense.id === options.pendingDeleteId) {
      const prompt = doc.createElement('span');
      prompt.textContent = 'Delete this entry? ';
      actions.append(
        prompt,
        createActionButton(doc, 'Confirm', 'confirm-delete', expense.id),
        createActionButton(doc, 'Cancel', 'cancel-delete', expense.id),
      );
    } else {
      actions.append(
        createActionButton(doc, 'Edit', 'edit', expense.id),
        createActionButton(doc, 'Delete', 'delete', expense.id),
      );
    }
    row.append(actions);
    body.append(row);
  });

  table.append(head, body);
  const wrapper = doc.createElement('div');
  wrapper.className = 'table-scroll expense-log-scroll';
  wrapper.append(table);
  container.append(wrapper);
}

export function renderExpenseSummary(summary) {
  const container = document.getElementById('expense-summary');
  if (!container) {
    throw new Error('Expense summary container #expense-summary was not found.');
  }

  const doc = container.ownerDocument;
  const table = doc.createElement('table');
  table.setAttribute('aria-label', 'Spending by category and month');

  const head = doc.createElement('thead');
  const header = doc.createElement('tr');
  header.append(createCell(doc, 'th', 'Category'));
  summary.months.forEach((month) =>
    header.append(createCell(doc, 'th', formatExpenseMonth(month))),
  );
  header.append(createCell(doc, 'th', 'Total'));
  head.append(header);

  const body = doc.createElement('tbody');
  summary.categories.forEach((category) => {
    const row = doc.createElement('tr');
    row.append(createCell(doc, 'th', category));
    summary.months.forEach((month) =>
      row.append(
        createCell(
          doc,
          'td',
          currencyFormatter.format(summary.categoryMonthTotals[category][month]),
        ),
      ),
    );
    row.append(
      createCell(
        doc,
        'td',
        currencyFormatter.format(summary.categoryTotals[category]),
      ),
    );
    body.append(row);
  });

  const totalRow = doc.createElement('tr');
  totalRow.append(createCell(doc, 'th', 'Grand Total'));
  summary.months.forEach((month) =>
    totalRow.append(
      createCell(doc, 'td', currencyFormatter.format(summary.monthlyTotals[month])),
    ),
  );
  totalRow.append(
    createCell(doc, 'td', currencyFormatter.format(summary.grandTotal)),
  );
  body.append(totalRow);

  table.append(head, body);
  const wrapper = doc.createElement('div');
  wrapper.className = 'table-scroll expense-summary-scroll';
  wrapper.append(table);
  container.replaceChildren(wrapper);
}
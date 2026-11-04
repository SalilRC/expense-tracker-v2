import { addExpense, getExpenses } from './modules/store.js';
import {
  clearExpenseErrors,
  renderExpenseErrors,
  renderExpenseLog,
} from './modules/ui.js';

function getLocalToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function initializeExpenseApp(doc = document) {
  const form = doc.getElementById('expense-form');
  if (!form || form.dataset.initialized === 'true') {
    return;
  }

  const dateInput = form.elements.namedItem('date');
  dateInput.value = getLocalToday();
  renderExpenseLog(getExpenses());
  form.dataset.initialized = 'true';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const result = addExpense({
      name: form.elements.namedItem('name').value,
      category: form.elements.namedItem('category').value,
      date: dateInput.value,
      amount: form.elements.namedItem('amount').value,
    });

    if (result.expense === null) {
      renderExpenseErrors(form, result.errors);
      return;
    }

    clearExpenseErrors(form);
    renderExpenseLog(getExpenses());
    form.reset();
    dateInput.value = getLocalToday();
  });
}

if (typeof document !== 'undefined') {
  initializeExpenseApp(document);
}
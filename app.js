import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from './modules/store.js';
import { calculateCategoryMonthSummary } from './modules/analytics.js';
import {
  clearExpenseErrors,
  renderExpenseErrors,
  renderExpenseLog,
  renderExpenseSummary,
  setExpenseFormMode,
} from './modules/ui.js';

function getLocalToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function findExpense(id) {
  const expense = getExpenses().find((item) => item.id === id);
  if (!expense) {
    throw new Error(`Expense ${id} was not found.`);
  }
  return expense;
}

export function initializeExpenseApp(doc = document) {
  const form = doc.getElementById('expense-form');
  if (!form || form.dataset.initialized === 'true') {
    return;
  }

  const dateInput = form.elements.namedItem('date');
  dateInput.value = getLocalToday();
  let editingId = null;
  let pendingDeleteId = null;

  function refreshViews() {
    const expenses = getExpenses();
    renderExpenseLog(expenses, { editingId, pendingDeleteId });
    renderExpenseSummary(calculateCategoryMonthSummary(expenses));
  }

  refreshViews();
  form.dataset.initialized = 'true';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = {
      name: form.elements.namedItem('name').value,
      category: form.elements.namedItem('category').value,
      date: dateInput.value,
      amount: form.elements.namedItem('amount').value,
    };
    const result = editingId
      ? updateExpense(editingId, input)
      : addExpense(input);

    if (result.expense === null) {
      renderExpenseErrors(form, result.errors);
      return;
    }

    clearExpenseErrors(form);
    editingId = null;
    pendingDeleteId = null;
    setExpenseFormMode(form, null, getLocalToday());
    refreshViews();
  });

  const cancelEditButton = doc.getElementById('cancel-edit');
  cancelEditButton?.addEventListener('click', () => {
    editingId = null;
    setExpenseFormMode(form, null, getLocalToday());
    refreshViews();
  });

  const log = doc.getElementById('expense-log');
  log.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, expenseId } = button.dataset;
    if (action === 'edit') {
      editingId = expenseId;
      pendingDeleteId = null;
      setExpenseFormMode(form, findExpense(expenseId), getLocalToday());
      refreshViews();
    } else if (action === 'delete') {
      pendingDeleteId = expenseId;
      refreshViews();
    } else if (action === 'cancel-delete') {
      pendingDeleteId = null;
      refreshViews();
    } else if (action === 'confirm-delete') {
      const result = deleteExpense(expenseId);
      if (!result.deleted) {
        throw new Error(`Expense ${expenseId} could not be deleted.`);
      }
      pendingDeleteId = null;
      if (editingId === expenseId) {
        editingId = null;
        setExpenseFormMode(form, null, getLocalToday());
      }
      refreshViews();
    }
  });
}

if (typeof document !== 'undefined') {
  initializeExpenseApp(document);
}
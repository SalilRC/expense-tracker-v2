# Quickstart: Validate Remaining ET-2 Stories

## Prerequisites

- A modern desktop browser and a narrow/mobile viewport for responsive checks.
- Node.js and the project's installed development dependencies.
- No backend or persistent storage is required. Serve the project as static files if the browser blocks ES module imports when opening `index.html` directly.

## Automated checks

Run the Jest suite from the repository root:

```powershell
npm.cmd test -- --runInBand
```

The tests should cover:

1. ET-4: empty state, required columns/actions, date and tie ordering, fixed two-decimal INR formatting, and at least 50 rows.
2. ET-5: selecting an edit row, population and highlighting, validation, successful update, date re-sort, cancel without mutation, and switching the active row.
3. ET-6: inline confirmation, cancel without mutation, confirm removes only the selected expense, zero category-month cells, and month-column removal for the last expense in that month.
4. ET-7: all categories, chronological months, category and grand totals, empty state, first-expense month creation, and updates after add/edit/delete.
5. ET-3 regressions: add validation, duplicate/future acceptance, reset, no reload, and existing log order.

## Browser smoke check

1. Start with no expenses. Confirm the log shows “No expenses recorded yet” and the summary shows eight zero-valued categories with only a Total column.
2. Add expenses in at least two months and categories. Confirm they appear in newest-first log order and summary month columns are chronological with correct category, monthly, and overall totals.
3. Add enough records to reach at least 50. Confirm the log remains available and amount digits align.
4. Edit an expense, change its date to another month, and save. Confirm the row moves to the correct position, the summary recalculates both affected months, and the expense identity is unchanged.
5. Start editing, cancel, then select Edit on a different row. Confirm cancellation does not mutate data and only the selected row is highlighted.
6. Select Delete and cancel. Confirm neither log nor summary changes. Select Delete again and confirm; verify the row and summary update immediately.
7. Delete the last expense for a category in a month that still has other expenses and confirm its cell is ₹0.00. Delete the final expense for a month and confirm that month column disappears.
8. At a mobile-width viewport, horizontally scroll the log and summary. Confirm the page itself does not overflow and the summary category column remains visible while scrolling.

See the exact user-visible rules in [expense-entry-form.md](./contracts/expense-entry-form.md) and [expense-log-and-summary.md](./contracts/expense-log-and-summary.md), and the state/aggregation rules in [data-model.md](./data-model.md).

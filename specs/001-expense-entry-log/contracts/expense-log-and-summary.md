# Expense Log and Summary Contract (ET-4, ET-6, ET-7)

This contract defines the visible log and spending summary; it introduces no network API.

## Expense log (ET-4)

- Columns, in order: `#`, Expense Name, Category, Date, Amount (₹), Actions.
- `#` is the one-based row position in the currently sorted log.
- Each row displays Edit and Delete actions.
- Rows sort by expense date descending; equal-date rows sort by entry/insertion order descending.
- An empty log displays “No expenses recorded yet.”
- The log displays one or more entries, including at least 50 entries.
- Dates use `DD-MMM-YYYY`; amounts use INR formatting with exactly two decimal places, rounded to the nearest paise for display, while calculations and stored values retain original precision. Digits align consistently.
- On narrow/mobile viewports, an overflowing table scrolls horizontally without causing page-level horizontal overflow.

## Edit action (ET-5)

Selecting Edit populates the expense form with the row's values, highlights the row, and changes the form action label to “Update Expense.” Only one row is in edit mode at a time. Update validates with ET-3 rules, changes the row in place, refreshes affected views, and re-sorts when the date changes. Cancel returns to add mode without mutation.

## Delete action (ET-6)

Selecting Delete shows an inline row prompt, “Delete this entry?”, with Confirm and Cancel. No browser confirmation dialog is used. Cancel keeps the expense and all views unchanged. Confirm removes that expense and immediately refreshes the log and summary.

## Category × Month Summary (ET-7)

- Rows include all eight supported categories in the established category order.
- Populated month columns correspond to months with at least one current expense, in chronological order, followed by a rightmost Total column.
- Category-month cells sum matching expense amounts. A zero intersection for a month that still exists displays ₹0.00.
- Category totals sum their amounts across all months.
- A bottom Grand Total row sums each month and the overall amount.
- All totals are calculated from original stored precision and displayed in INR with Indian digit grouping, rounded to the nearest paise, and exactly two decimals.
- With no expenses, show all eight categories at ₹0.00 in a Total column and no month columns.
- Adding, editing, or deleting an expense immediately updates affected cells and totals. A month column appears with the first expense for that month and disappears when its last expense is removed.
- On narrow/mobile viewports, the table scrolls horizontally while the category column remains visible.

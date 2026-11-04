# Data Model: Expense Entry and Log View (ET-2)

## Expense

An expense record is the single source of truth for log and summary views.

| Field | Type | Rule |
|-------|------|------|
| `id` | string | Unique UUID generated on add and retained on update. |
| `name` | string | Required, non-empty after trimming. |
| `category` | string | Required; one of `Groceries`, `Outside Food`, `Fuel`, `Travel`, `Leisure`, `Medicines`, `Utilities`, or `Others`. |
| `date` | string | Required, valid `YYYY-MM-DD` calendar date; future dates are permitted. |
| `amount` | number | Required, finite INR amount of at least `0.01`; preserve the submitted numeric precision. |
| `createdAt` | string | ISO 8601 timestamp generated on add and retained on update. |

Duplicate expenses are allowed. Records remain in in-memory state for the current page session. Deletion removes the selected record from that collection.

## Expense Collection and Ordering

- Add validates the complete record before changing state.
- Update identifies one record by `id`, applies the same name/category/date/amount rules as add, and preserves `id` and `createdAt`.
- Delete identifies and removes one record by `id`; cancelling a UI prompt does not call deletion.
- Log order is expense date descending, then collection/insertion order descending for equal dates. Updating a record's date changes its date group but does not make it a new insertion.

## Category × Month Summary

The summary is derived from the current expense collection; it is not separately mutable state.

| Derived value | Rule |
|---------------|------|
| Categories | Always the eight supported categories, in the established category order. |
| Month keys | Distinct `YYYY-MM` prefixes from expense dates, oldest to newest. A month with no remaining expenses is omitted. |
| Category-month amount | Sum of original stored amounts for that category and expense month; zero when the month exists but that category has no entries. |
| Category total | Sum of original stored amounts for that category across all current months. |
| Monthly grand total | Sum of all original stored category-month amounts for that month. |
| Overall grand total | Sum of all original stored expense amounts. |

The rendered empty summary has all eight categories, no month columns, and a Total column with ₹0.00 values. When populated, the summary includes the chronological month columns, a rightmost Total column, and a bottom Grand Total row.

## Form and UI States

1. **Add mode**: blank name/category/amount, date initialized to local today.
2. **Invalid submission**: inline errors identify invalid fields; state is unchanged and entered values remain available for correction.
3. **Edit mode**: one selected expense populates the form; its log row is highlighted; the primary button reads “Update Expense.”
4. **Edit canceled**: no state mutation; form returns to blank add mode with date reset to local today.
5. **Edit saved**: the selected record is updated after validation; log and summary reflect its changed values.
6. **Delete confirmation**: an inline prompt is shown for the selected row; neither Confirm nor Cancel is implicit.
7. **Delete canceled**: no state mutation; prompt closes.
8. **Delete confirmed**: the selected record is removed; log and summary are recalculated from remaining state.

## Formatting

- Expense dates in the log: `DD-MMM-YYYY`.
- The log `#` column displays the one-based row position after sorting.
- Log and summary amounts: calculate from original stored precision; display INR in `en-IN` grouping rounded to the nearest paise with exactly two fraction digits where required by ET-4/ET-7.

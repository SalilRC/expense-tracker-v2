# Expense Entry Form Contract (ET-3 and ET-5)

This is the user-facing contract for adding and editing expenses; it introduces no network API.

## Fields

| Field | Required behavior |
|-------|-------------------|
| Expense Name | Required; non-empty after trimming. |
| Category | Required; exactly the eight supported project categories. |
| Expense Date | Required; valid calendar date; defaults to local today in add mode. |
| Amount in ₹ | Required; finite and at least `0.01`; no additional precision restriction is imposed by ET-3. |

Each control has a visible label and an associated inline error target. The form must expose invalid state accessibly. The form does not use native browser validation bubbles as its only error feedback.

## Add mode

- A valid submission adds exactly one expense, updates the log and summary, and resets the form to add mode with the date set to local today.
- An invalid submission shows field-specific inline errors, leaves expense state and views unchanged, and preserves entered values for correction.
- Duplicate and future-dated expenses are accepted.
- Submission does not navigate or reload the page.

## Edit mode (ET-5)

- Selecting Edit on a log row populates this form with that expense's name, category, date, and amount; highlights the row; and changes the submit button label to “Update Expense.”
- Only one row can be in edit mode; selecting another row replaces the active edit.
- Updates use the same validation rules as add and retain the expense identity and creation timestamp.
- A valid update changes the selected record, refreshes the log and summary, and returns the form to add mode. The log is re-sorted if the expense date changed.
- Cancel exits edit mode without changing the expense and restores blank add mode with local today.

## Module responsibilities

- `modules/store.js` owns add, read, update, and delete operations and validates expense records.
- `modules/analytics.js` provides pure calculations for category/month amounts and totals.
- `modules/ui.js` owns all DOM rendering, including form feedback, log rows, edit highlighting, delete confirmation, and summary.
- `app.js` coordinates user events and refreshes the UI from store state.

# Expense Entry Form Contract (ET-3)

This is the user-facing contract for the browser form; it introduces no network API.

## Inputs

| Field | Control | Required behavior |
|-------|---------|-------------------|
| Expense Name | Text input | Required; associated visible label. |
| Category | Select | Required; exactly the eight supported project categories. |
| Expense Date | Date input | Required; initialized to local today; future dates allowed. |
| Amount in ₹ | Number input | Required; minimum `0.01`; do not impose an unstated precision restriction. |

Each control has an associated inline error target. The form may expose invalid values through accessible invalid-state attributes and error descriptions. The submit button submits the form.

## Submit behavior

- Submitting the form does not navigate or reload the page.
- If any required value is missing or invalid, show a field-specific inline error and do not add an expense.
- On valid submission, add exactly one expense to the in-memory store. Duplicate entries are accepted.
- On success, clear error feedback, reset the name/category/amount values, and reset the date to local today.

## Out of scope

Persistence, server requests, expense editing/deletion, expense-log rendering, and summary rendering are not part of ET-3.

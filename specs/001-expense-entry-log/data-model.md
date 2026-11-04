# Data Model: Add an Expense Entry (ET-3)

## Expense

The store creates one expense record for each successful form submission.

| Field | Type | Rule |
|-------|------|------|
| `id` | string | Unique UUID generated for the record. |
| `name` | string | Required, non-empty expense name. |
| `category` | string | Required; one of `Groceries`, `Outside Food`, `Fuel`, `Travel`, `Leisure`, `Medicines`, `Utilities`, or `Others`. |
| `date` | string | Required, valid calendar date encoded as `YYYY-MM-DD`. Future dates are permitted. |
| `amount` | number | Required, finite INR amount of at least `0.01`. |
| `createdAt` | string | ISO 8601 timestamp generated when the record is added. |

Duplicate expenses are allowed. The collection is held in module memory and lasts only for the current page session.

## Form submission

The form submits `name`, `category`, `date`, and `amount`. Empty or invalid values must not mutate the expense collection. Errors are associated with their respective fields and rendered inline by `modules/ui.js`.

On successful add, the store adds exactly one `Expense`. The UI clears validation feedback, clears the form's name/category/amount values, and restores the date field to the browser's local current date.

## Basic Expense Log

The visible ET-3 log contains accepted expenses with enough information to identify each record: name, category, date, and amount. It is rendered in expense-date descending order; records with the same expense date appear in reverse insertion order. Dates are displayed as `DD-MMM-YYYY`, and INR amounts are formatted with `toLocaleString('en-IN')`. Full ET-4 columns, row actions, empty-state rules, large-list requirements, and mobile scrolling are deferred.

## Validation and state transitions

1. **Unsubmitted**: no expense is created.
2. **Invalid submission**: one or more required fields fail validation; show inline field errors; leave the expense collection unchanged and keep the entered values available for correction.
3. **Valid submission**: create and append one complete expense record; clear errors and reset the form to add mode with date set to local today.

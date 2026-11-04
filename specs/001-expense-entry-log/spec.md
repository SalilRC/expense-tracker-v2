# Feature Specification: Expense Entry and Log View (ET-2)

**Feature Branch**: `ET-2-expense-entry-and-log-view`

**Created**: 2026-11-04

**Status**: Draft

**Input**: Jira epic ET-2, “Expense entry and log view,” and its child stories ET-3 through ET-7. ET-3 is complete; this specification records its scope and details the remaining stories without changing their Jira names or boundaries.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add an Expense Entry (ET-3, Complete) (Priority: P1)

As a user, I want to fill in an expense form and submit it, so that the expense is recorded and visible in my expense log.

**Why this priority**: Adding an expense creates the records that the log and summary show.

**Independent Test**: Submit valid and invalid expense details; verify that valid entries appear in the log, invalid entries are rejected with field-specific feedback, and successful submission resets the form without reloading the page.

**Acceptance Scenarios**:

1. **Given** the expense form is available, **When** the user submits a name, one of the supported categories, a valid date, and an amount of at least ₹0.01, **Then** the new entry appears immediately in the basic log and the form resets to its defaults.
2. **Given** one or more required fields are missing or invalid, **When** the user submits the form, **Then** inline errors identify the invalid fields and no expense is added.
3. **Given** the user enters a valid future date or submits an otherwise valid duplicate, **When** the user submits the form, **Then** the expense is accepted.
4. **Given** the user submits a valid entry, **When** it is recorded, **Then** the page does not reload and the expense remains available for the current page session.

### User Story 2 - Expense Log Table (ET-4) (Priority: P1)

As a user, I want to see all my expenses in a table sorted newest-first, so that I have a clear log of what I’ve recorded.

**Why this priority**: The complete log is the primary way to review and act on recorded expenses.

**Independent Test**: View the log with zero, one, and at least 50 expenses; verify its columns, ordering, amount display, actions, and narrow-screen usability.

**Acceptance Scenarios**:

1. **Given** there are no expenses, **When** the user views the log, **Then** the table area displays “No expenses recorded yet.”
2. **Given** one or more expenses exist, **When** the user views the log, **Then** each row shows `#`, Expense Name, Category, Date, Amount, and Actions with Edit and Delete actions.
3. **Given** multiple expenses exist, **When** the log is displayed, **Then** entries are ordered by expense date descending and by entry order descending when dates match.
4. **Given** the log contains one or at least 50 expenses, **When** it is displayed, **Then** all entries remain available in the table.
5. **Given** the user views the table on a mobile-width screen, **When** its content is wider than the viewport, **Then** the table can be scrolled horizontally without making the page layout overflow.
6. **Given** amounts have different digit widths, **When** the user views the Amount column, **Then** digits align consistently and amounts display in INR with exactly two decimal places.

### User Story 3 - Edit an Expense Row (ET-5) (Priority: P2)

As a user, I want to edit any existing expense entry inline or via the form, so that I can correct mistakes.

**Why this priority**: Editing lets users correct an existing record without deleting and re-entering it.

**Independent Test**: Edit an expense, cancel an edit, change an expense date, and attempt to switch edit mode to another row; verify values, row order, and edit state.

**Acceptance Scenarios**:

1. **Given** an expense row is displayed, **When** the user selects Edit, **Then** its values populate the expense form, its row is visually highlighted, and the submit button reads “Update Expense.”
2. **Given** an expense is being edited, **When** the user submits valid changes, **Then** that row is updated in place and the log is re-sorted if its date changed.
3. **Given** an expense is being edited, **When** the user selects Cancel, **Then** no expense data changes and the form returns to blank add mode.
4. **Given** an edit is active on one row, **When** the user selects Edit on another row, **Then** the second row replaces the first as the sole row in edit mode.
5. **Given** the user submits an edit with missing or invalid values, **When** validation runs, **Then** the same required-field, category, date, and minimum-amount rules as ET-3 apply and no invalid update is saved.

### User Story 4 - Delete an Expense Row (ET-6) (Priority: P2)

As a user, I want to delete an expense entry, so that I can remove incorrect or duplicate records.

**Why this priority**: Deletion gives users control to remove entries they no longer want included in their records.

**Independent Test**: Start a deletion, cancel it, and confirm a deletion; verify the row and all affected summary values and month columns.

**Acceptance Scenarios**:

1. **Given** an expense row is displayed, **When** the user selects Delete, **Then** an inline prompt in that row asks “Delete this entry?” and offers Confirm and Cancel, without opening a browser confirmation dialog.
2. **Given** the inline deletion prompt is shown, **When** the user selects Cancel, **Then** the expense and summary remain unchanged.
3. **Given** the inline deletion prompt is shown, **When** the user selects Confirm, **Then** the expense is removed and the log and category-by-month summary update immediately.
4. **Given** deleting the expense leaves its category-month total with no matching expenses while other expenses remain in that month, **When** the summary updates, **Then** that cell displays ₹0.00.
5. **Given** deleting the expense removes the last expense for a month, **When** the summary updates, **Then** that month column is removed.

### User Story 5 - Category × Month Summary Table (ET-7) (Priority: P3)

As a user, I want to see a summary table of spending by category and month, so that I can track where my money goes over time.

**Why this priority**: The summary provides a cross-category and month-by-month view of spending after expense records and log actions are available.

**Independent Test**: Use expenses in multiple categories and months; verify every category, monthly and overall totals, live updates, and horizontal navigation on narrow screens.

**Acceptance Scenarios**:

1. **Given** expenses exist in one or more months, **When** the user views the summary, **Then** it shows one row for each of the eight categories, one column per month containing at least one expense in chronological order, and a rightmost Total column.
2. **Given** a category has expenses in a month, **When** its summary cell is displayed, **Then** the cell equals the sum of those expenses and is formatted as ₹X,XXX.00.
3. **Given** a category has expenses across multiple months, **When** its Total cell is displayed, **Then** it equals the sum of that category’s expenses across all months.
4. **Given** the summary is displayed, **When** the user views its bottom row, **Then** “Grand Total” shows each month’s sum across categories and the overall sum in the Total column.
5. **Given** there are no expenses, **When** the user views the summary, **Then** all eight categories appear with ₹0.00 in a Total column and no month columns.
6. **Given** the user adds an expense in a month not already shown, **When** the summary updates, **Then** a column for that month appears in chronological order.
7. **Given** the user adds, edits, or deletes an expense, **When** the change is recorded, **Then** affected summary values and totals update immediately.
8. **Given** the summary is wider than the viewport, **When** the user views it on a narrow screen, **Then** it can be scrolled horizontally and the category column remains visible.

### Edge Cases

- Invalid ET-3 input must leave the expense collection, log, and summary unchanged.
- Expenses on the same date must follow entry order descending in the log.
- A date change during editing can change the row’s position in the log and the expense’s month in the summary.
- Deleting the last expense in a category-month intersection sets that cell to ₹0.00 if the month still has entries; deleting the last expense for the month removes that month column.
- Adding a new expense month introduces its summary column in chronological position.
- Empty states for the log and summary are distinct: the log shows its empty message, while the summary shows eight zero-valued categories and a Total column.
- Tables with wide content must remain usable on mobile-sized screens without breaking the page layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (ET-3)**: The expense entry form MUST collect Expense Name, Category, Expense Date, and Amount in ₹. All four fields MUST be required. The category choices MUST be Groceries, Outside Food, Fuel, Travel, Leisure, Medicines, Utilities, and Others. The date MUST default to the user's local current date.
- **FR-002 (ET-3)**: A submitted expense MUST have a non-empty name, one supported category, a valid calendar date, and a finite amount of at least ₹0.01. Future dates and duplicate entries MUST be allowed.
- **FR-003 (ET-3)**: Invalid submissions MUST show an inline error for each invalid field and MUST NOT add an expense. A valid submission MUST add exactly one expense, show it immediately in the basic log, reset the form to its defaults, and MUST NOT reload the page.
- **FR-004 (ET-3)**: The basic log MUST display expense name, category, date as DD-MMM-YYYY, and amount in Indian rupee formatting. It MUST sort by expense date descending and entry order descending for equal dates.
- **FR-005 (ET-4)**: The expense log MUST provide columns for `#`, Expense Name, Category, Date, Amount, and Actions; each row MUST offer Edit and Delete actions. The `#` column MUST show each row's one-based position after sorting.
- **FR-006 (ET-4)**: The log MUST display “No expenses recorded yet” when empty and MUST correctly display one or at least 50 entries.
- **FR-007 (ET-4)**: The log MUST retain the ET-3 date and entry-order sorting. Amounts MUST be shown in INR with exactly two decimal places, rounded to the nearest paise for display; calculations and stored values MUST retain the original amount precision. Digits in the Amount column MUST align consistently.
- **FR-008 (ET-4)**: On mobile-width screens, a log wider than the viewport MUST support horizontal scrolling without breaking the page layout.
- **FR-009 (ET-5)**: Selecting Edit on a log row MUST populate the expense form with that row's values, highlight the row, and change the submit button label to “Update Expense.”
- **FR-010 (ET-5)**: Submitting a valid edit MUST update the selected expense in place. If its date changes, the log MUST be re-sorted. ET-3 validation rules MUST apply to edited values.
- **FR-011 (ET-5)**: Canceling an edit MUST leave expense data unchanged and return the form to blank add mode.
- **FR-012 (ET-5)**: At most one row MUST be in edit mode. Selecting Edit on another row MUST replace the active row in the form.
- **FR-013 (ET-6)**: Selecting Delete MUST show an inline row-level prompt containing “Delete this entry?”, Confirm, and Cancel. It MUST NOT use a browser confirmation dialog.
- **FR-014 (ET-6)**: Canceling a deletion MUST leave the expense unchanged. Confirming MUST remove it and immediately update the log and summary.
- **FR-015 (ET-6/ET-7)**: A category-month cell with no matching expenses MUST display ₹0.00 when that month remains in the summary; a month with no remaining expenses MUST not appear as a summary column.
- **FR-016 (ET-7)**: The summary MUST show all eight categories as rows, months with at least one expense as columns in chronological order, and a rightmost Total column. Each category-month value and category total MUST equal the corresponding expense sums, calculated from unrounded stored amounts, and display as ₹X,XXX.00 rounded to the nearest paise.
- **FR-017 (ET-7)**: The summary MUST include a bottom “Grand Total” row with per-month and overall totals calculated from unrounded stored amounts and displayed rounded to the nearest paise. With no expenses, it MUST show all eight categories at ₹0.00 in a Total column and no month columns.
- **FR-018 (ET-7)**: Adding, editing, or deleting an expense MUST immediately update affected summary amounts and totals. Adding the first expense in a month MUST add that month's column.
- **FR-019 (ET-7)**: The summary MUST support horizontal scrolling when wider than the viewport while keeping the category column visible.

### Key Entities

- **Expense**: A spending record with an expense name, supported category, expense date, and INR amount.
- **Expense Log**: An ordered table of expense records with row-level edit and delete actions.
- **Category-Month Summary**: A matrix of category spending by month, with category totals and a grand-total row.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid expense submissions add exactly one expense and display it in the log; 100% of invalid submissions add none and identify each invalid field.
- **SC-002**: Users can locate each expense's name, category, date, amount, and available actions in the log, including when there are at least 50 records.
- **SC-003**: The log and summary remain operable at mobile viewport widths, with no page-layout break caused by table width.
- **SC-004**: A user can edit one selected expense, cancel without changing it, and confirm a deletion with the corresponding log and summary values updated immediately.
- **SC-005**: For any set of expenses, all displayed category-month totals, category totals, monthly grand totals, and the overall grand total equal the corresponding sums of expense amounts.

## Assumptions

- ET-3 is complete; its requirements are retained as context and as the validation rules reused by ET-5.
- The project’s eight supported categories and INR/date display conventions remain unchanged.
- ET-4 through ET-7 are specified in their Jira order. Story priorities indicate a reasonable delivery order; Jira story names and acceptance-criteria scope are preserved.
- An empty category-month intersection is displayed as ₹0.00 when its month remains present. A month column is omitted or removed when it has no expenses in any category; this reconciles ET-6's zero-or-blank choice with ET-7's totals and month-column rules.
- Expense records remain in the current page session; persistence beyond the current session is outside this epic's defined story scope.

# Feature Specification: Expense Entry and Log View

**Feature Branch**: `ET-2-expense-entry-and-log-view` (proposed; not created)

**Created**: 2026-11-01

**Status**: Draft

**Input**: Jira epic ET-2, “Expense entry and log view”: “A working single-page web app where a user can add, edit, and delete expenses, see them in a log, and view a category × month summary table.” Scope and story names below match ET-3 through ET-7.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add an Expense Entry (Priority: P1)

As a user, I want to fill in an expense form and submit it, so that it is recorded in my expense log.

**Why this priority**: Adding an expense is the first step to creating a record in the log.

**Independent Test**: Submit valid expense details and verify the submitted entry, form reset, and no-reload behavior; submit invalid details and verify per-field inline errors and that no entry is added.

**Acceptance Scenarios**:

1. **Given** the expense form is available, **When** the user submits a name, one of the supported categories, a valid date, and an amount of at least ₹0.01, **Then** the new entry appears immediately in the expense log's date-descending order (with the newest entry first among entries with the same date), and the form resets to its default values.
2. **Given** the name, category, date, or amount is missing, the date is invalid, or the amount is not greater than zero, **When** the user submits the form, **Then** inline errors appear for the invalid fields and the form is not submitted.
3. **Given** the user enters a valid future date or submits an entry that duplicates another, **When** the user submits the otherwise valid form, **Then** the entry is accepted.
4. **Given** the user submits a valid entry, **When** the entry is recorded, **Then** the page does not reload and the expense remains in in-memory state for the current page session.

### User Story 2 - Expense Log Table (Priority: P1)

As a user, I want to see all my expenses in a table sorted newest-first, so that I have a clear log of what I’ve recorded.

**Why this priority**: The log provides the user’s primary view of recorded expense entries.

**Independent Test**: Display logs with zero, one, and at least 50 entries; verify columns, sort order, empty state, amount alignment, and narrow-screen scrolling.

**Acceptance Scenarios**:

1. **Given** the log contains one or more expenses, **When** the user views the log, **Then** the table shows columns for #, Expense Name, Category, Date (DD-MMM-YYYY), Amount (₹ with two decimal places), and Actions (Edit | Delete).
2. **Given** entries have different expense dates, **When** the log is displayed, **Then** entries are sorted by Expense Date descending and entries with the same date are sorted by entry order descending.
3. **Given** the log contains zero entries, **When** the user views the table, **Then** it shows “No expenses recorded yet.”
4. **Given** the log contains one entry or 50 or more entries, **When** the user views the table, **Then** it renders the entries correctly.
5. **Given** the table is wider than a mobile screen, **When** the user views it on that screen, **Then** it can be scrolled horizontally without breaking the page layout.
6. **Given** amounts appear in multiple rows, **When** the user views the Amount column, **Then** the digits align consistently.

### User Story 3 - Edit an Expense Row (Priority: P2)

As a user, I want to edit any existing expense entry inline or via the form, so that I can correct mistakes.

**Why this priority**: Editing lets users correct an existing record rather than leave mistakes in the log.

**Independent Test**: Edit an existing row, verify its form values, highlight, update and date-based resort; cancel another edit and verify no changes.

**Acceptance Scenarios**:

1. **Given** an expense row is displayed, **When** the user clicks Edit, **Then** the add-expense form is populated with that row’s values, its submit button reads “Update Expense,” and the row is visually highlighted.
2. **Given** the user is editing an expense and the values satisfy the Add an Expense Entry validation rules, **When** the user submits “Update Expense,” **Then** the row is updated in place and the table is re-sorted if its date changed.
3. **Given** the user is editing an expense, **When** the user clicks Cancel, **Then** the form returns to blank/add mode and no expense data changes.
4. **Given** one row is in edit mode, **When** the user clicks Edit on a second row, **Then** the second row replaces the first in the form and is the only row in edit mode.

### User Story 4 - Delete an Expense Row (Priority: P2)

As a user, I want to delete an expense entry, so that I can remove incorrect or duplicate records.

**Why this priority**: Deletion lets users remove unwanted records and their effect on the log and summary.

**Independent Test**: Start a deletion and cancel it, then confirm a deletion; verify the row and summary remain unchanged after cancellation and update immediately after confirmation.

**Acceptance Scenarios**:

1. **Given** an expense row is displayed, **When** the user clicks Delete, **Then** an inline confirmation prompt appears within that row with “Delete this entry?”, Confirm, and Cancel, without a browser confirmation dialog.
2. **Given** the inline confirmation prompt is displayed, **When** the user clicks Cancel, **Then** the row remains unchanged.
3. **Given** the inline confirmation prompt is displayed, **When** the user confirms deletion, **Then** the row is removed and both the log and summary table update immediately.
4. **Given** the deleted expense was the only entry for its category-month cell, **When** the summary updates, **Then** the cell displays ₹0.00.
5. **Given** the user confirms deletion, **When** the row and summary are updated, **Then** no undo action is required.

### User Story 5 - Category × Month Summary Table (Priority: P2)

As a user, I want to see a summary table of spending by category and month, so that I can track where my money goes over time.

**Why this priority**: The table summarizes spending across categories and months, beyond individual log entries.

**Independent Test**: Compare the summary for multiple months and categories against independent sums, then add, edit, and delete entries and verify the table updates.

**Acceptance Scenarios**:

1. **Given** expenses exist, **When** the user views the summary, **Then** it displays one row for each of the eight categories, including categories with ₹0, and a column for each calendar month with at least one expense, in chronological order, followed by a rightmost Total column.
2. **Given** expenses exist for a category and month, **When** the user views the corresponding cell, **Then** it shows the sum of those expenses formatted as ₹X,XXX.00.
3. **Given** expenses exist across categories and months, **When** the user views the summary, **Then** each category’s Total equals its sum across all months and the bottom “Grand Total” row shows each month’s sum across categories and the overall grand total.
4. **Given** an expense is added, edited, or deleted, **When** the summary is displayed, **Then** it reflects the change immediately.
5. **Given** a new month receives its first expense, **When** the summary updates, **Then** that month appears as a column in chronological order.
6. **Given** a month loses its last expense, **When** the summary updates, **Then** that month’s column is removed.
7. **Given** there are no expenses, **When** the user views the summary, **Then** it displays all eight categories with ₹0.00 in a Total column only.
8. **Given** the table is wider than the available screen, **When** the user scrolls it horizontally, **Then** the category column remains visible and the page layout does not break.

### Edge Cases

- Expense entry validation is tested with empty fields, zero amount, invalid date, future date, and a duplicate entry.
- The expense log is tested with zero entries, one entry, at least 50 entries, different dates, and multiple entries with the same date.
- Editing is cancelled, or the user selects another row while an edit is in progress.
- An edited date changes the entry’s position in the expense log.
- Deleting the only entry in a category-month leaves that cell as ₹0.00.
- Deleting the last expense for a month removes that month’s summary column.
- The expense log or category-by-month summary is wider than a mobile screen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (ET-3)**: The expense form MUST collect Expense Name, Category, Expense Date, and Amount in ₹. Name, category, date, and amount MUST be required. The category choices MUST be Groceries, Outside Food, Fuel, Travel, Leisure, Medicines, Utilities, and Others. The date MUST default to today.
- **FR-002 (ET-3)**: On submission, required fields MUST be present, the date MUST be valid, and the amount MUST be greater than zero and at least ₹0.01.
- **FR-003 (ET-3)**: When validation fails, inline errors MUST appear per invalid field and the form MUST NOT be submitted. Future dates and duplicate entries MUST be allowed.
- **FR-004 (ET-3)**: On successful submission, the new entry MUST appear immediately in the expense log in date-descending order, the form MUST reset to its default values, and the page MUST NOT reload. At this stage, expense data MUST remain in memory only.
- **FR-005 (ET-4)**: The expense log MUST display columns for #, Expense Name, Category, Date (DD-MMM-YYYY), Amount (₹ with two decimal places), and Actions (Edit | Delete).
- **FR-006 (ET-4)**: The expense log MUST sort by Expense Date descending and sort entries with the same date by entry order descending.
- **FR-007 (ET-4)**: The expense log MUST show “No expenses recorded yet” with zero entries and render correctly with one entry and with 50 or more entries.
- **FR-008 (ET-4)**: Amount digits MUST align consistently, and the log MUST be horizontally scrollable on mobile without breaking the page layout.
- **FR-009 (ET-5)**: Clicking Edit MUST populate the add-expense form with that row’s values, change the submit button label to “Update Expense,” and visually highlight the row being edited.
- **FR-010 (ET-5)**: Submitting “Update Expense” MUST update the row in place, re-sort the table if the date changed, and use the same validation rules as adding an expense.
- **FR-011 (ET-5)**: Clicking Cancel while editing MUST restore the form to blank/add mode without changing expense data.
- **FR-012 (ET-5)**: Only one row MUST be in edit mode at a time; clicking Edit on a second row MUST replace the first row in the form.
- **FR-013 (ET-6)**: Clicking Delete MUST show an inline confirmation prompt in the row with “Delete this entry? Confirm / Cancel” and MUST NOT invoke a browser confirmation dialog.
- **FR-014 (ET-6)**: Confirming deletion MUST remove the row and immediately update both the log and summary table. Cancelling MUST leave the row untouched. Undo MUST NOT be required.
- **FR-015 (ET-6)**: If a deleted expense was the only entry for a category-month cell, that cell MUST show ₹0.00.
- **FR-016 (ET-7)**: The summary MUST show one row for each of the eight categories, including categories with no expenses. It MUST show a column for every calendar month with at least one expense, ordered chronologically, followed by a rightmost Total column.
- **FR-017 (ET-7)**: Each category-month cell MUST show the sum of the expenses in that category and month, formatted as ₹X,XXX.00. The category Total column MUST show each category’s sum across all months.
- **FR-018 (ET-7)**: The bottom row MUST be “Grand Total” and show each month’s sum across categories and the overall grand total.
- **FR-019 (ET-7)**: The summary MUST update live whenever an expense is added, edited, or deleted. Adding an expense in a new month MUST add a month column; deleting the last expense in a month MUST remove its column.
- **FR-020 (ET-7)**: With no expenses, the summary MUST show all eight categories with ₹0.00 in a Total column only.
- **FR-021 (ET-7)**: The summary table MUST be horizontally scrollable, and its category column MUST remain visible while scrolling.

### Key Entities *(include if feature involves data)*

- **Expense**: A spending record with a name, one supported category, an expense date, and an amount in Indian rupees.
- **Expense Log**: The table of all recorded expenses, with their dates, entry order, and row actions.
- **Category × Month Summary**: The table of category-month expense sums, category totals, monthly grand totals, and an overall grand total.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All valid ET-3 entry tests add exactly one expense immediately in date-descending log order, reset the form, and do not reload the page; all invalid-entry tests add zero expenses and show inline errors for the invalid fields.
- **SC-002**: ET-4 log tests with 0, 1, and 50 or more entries show the specified empty message or all required rows and columns; sorting matches the date-descending and same-date entry-order criteria.
- **SC-003**: All ET-5 edit tests update only the selected expense, use the same validation as ET-3, restore unchanged data on cancellation, and re-sort when the date changes.
- **SC-004**: All ET-6 deletion tests leave data unchanged on cancellation and immediately remove the confirmed row from the log and summary; the only-entry category-month cell displays ₹0.00.
- **SC-005**: For all ET-7 test datasets, category-month amounts, category totals, monthly grand totals, and the overall grand total equal independently calculated sums to the displayed ₹0.01 precision; month columns appear or disappear when their first or last expense is added or deleted.
- **SC-006**: On mobile, both tables can be horizontally scrolled without breaking page layout, and the summary category column remains visible.

## Assumptions

- The feature is the Stage 1 browser-only single-page expense-entry and log experience defined by epic ET-2; expense data remains in memory only at this stage.
- The category choices are the eight categories listed in ET-3 and in the project expense data model.
- The expense date defaults to today; valid future dates and duplicate entries are allowed, as specified by ET-3.
- New entries follow the ET-3 and ET-4 date-descending order, with entry order descending as the tie-breaker for the same date.
- For the ET-6 deletion case, the user confirmed that an empty category-month cell shows ₹0.00. ET-7 specifies that a month column is removed when its last expense is deleted.
- Dates in the log use DD-MMM-YYYY. Summary amounts use the ₹X,XXX.00 format specified by ET-7.
- No additional user types, roles, or workflows beyond the ET-2 epic goal and its five listed stories are included.

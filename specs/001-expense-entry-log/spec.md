# Feature Specification: Add an Expense Entry (ET-3)

**Feature Branch**: `ET-2-expense-entry-and-log-view` (parent epic branch; not created)

**Created**: 2026-11-01

**Status**: Draft

**Input**: Jira story ET-3, “Add an Expense Entry.” This specification covers only adding an expense and displaying accepted entries in the basic expense log. The remaining ET-2 epic stories are explicitly deferred.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add an Expense Entry (Priority: P1)

As a user, I want to fill in an expense form and submit it, so that the expense is recorded and visible in my expense log.

**Why this priority**: Adding an expense is the first step to creating a record in the log.

**Independent Test**: Submit valid expense details and verify the submitted entry appears in the log in the required order, the form resets, and the page does not reload; submit invalid details and verify per-field inline errors and that no entry is added.

**Acceptance Scenarios**:

1. **Given** the expense form is available, **When** the user submits a name, one of the supported categories, a valid date, and an amount of at least ₹0.01, **Then** the new entry appears immediately in the expense log's date-descending order (with the newest entry first among entries with the same date), and the form resets to its default values.
2. **Given** the name, category, date, or amount is missing, the date is invalid, or the amount is not greater than zero, **When** the user submits the form, **Then** inline errors appear for the invalid fields, the form is not submitted, and the expense log remains unchanged.
3. **Given** the user enters a valid future date or submits an entry that duplicates another, **When** the user submits the otherwise valid form, **Then** the entry is accepted and displayed.
4. **Given** the user submits a valid entry, **When** the entry is recorded, **Then** the page does not reload and the expense remains in in-memory state for the current page session.

### Deferred Epic Stories

The following stories belong to the parent ET-2 epic but are not part of this ET-3 specification. Their detailed requirements will be specified and planned separately:

- **ET-4 - Expense Log Table**: full log columns/actions, empty state, large-list behavior, and mobile scrolling.
- **ET-5 - Edit an Expense Row**: editing, cancellation, and edit-mode behavior.
- **ET-6 - Delete an Expense Row**: inline confirmation and deletion behavior.
- **ET-7 - Category × Month Summary Table**: category/month sums, totals, and responsive behavior.

ET-3 includes only the basic log display needed to show newly accepted entries. It does not include editing, deletion, the full ET-4 log requirements, or analytics.

### Edge Cases

- Expense entry validation is tested with empty fields, zero amount, invalid date, future date, and a duplicate entry.
- Multiple entries with the same expense date are shown in reverse insertion order.
- Invalid submission leaves both the expense store and visible log unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (ET-3)**: The expense form MUST collect Expense Name, Category, Expense Date, and Amount in ₹. Name, category, date, and amount MUST be required. The category choices MUST be Groceries, Outside Food, Fuel, Travel, Leisure, Medicines, Utilities, and Others. The date MUST default to today.
- **FR-002 (ET-3)**: On submission, required fields MUST be present, the date MUST be valid, and the amount MUST be greater than zero and at least ₹0.01.
- **FR-003 (ET-3)**: When validation fails, inline errors MUST appear per invalid field and the form MUST NOT be submitted. Future dates and duplicate entries MUST be allowed.
- **FR-004 (ET-3)**: On successful submission, exactly one new entry MUST be added to in-memory state and appear immediately in the expense log in date-descending order, with newest insertion first for equal dates. The log MUST display dates as DD-MMM-YYYY and INR amounts with Indian number formatting. The form MUST reset to its default values and the page MUST NOT reload.

### Key Entities *(include if feature involves data)*

- **Expense**: A spending record with a name, one supported category, an expense date, and an amount in Indian rupees.
- **Basic Expense Log**: A visible list of accepted expenses ordered by expense date descending and insertion order descending for equal dates, with dates shown as DD-MMM-YYYY and INR amounts using Indian number formatting.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every valid ET-3 submission adds exactly one expense and displays it immediately in date-descending order; ties display newest insertion first. The form resets and the page does not reload. Every invalid submission adds zero expenses, leaves the log unchanged, and shows inline errors for invalid fields.
- **SC-002**: Future-dated and duplicate valid entries are both accepted and displayed.

## Assumptions

- The feature is the ET-3 browser-only add-expense story within epic ET-2; expense data remains in memory only at this stage.
- The category choices are the eight categories listed in the ET-3 Jira story and project data model.
- The expense date defaults to the user's local current date; future dates and duplicate entries are allowed.
- New entries follow date-descending order, with insertion order descending as the tie-breaker for the same date.
- The basic log shows enough expense fields to identify each accepted record; full log columns, row actions, empty-state behavior, and responsive scrolling are deferred to ET-4.

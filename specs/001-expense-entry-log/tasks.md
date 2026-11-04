# Tasks: Expense Entry and Log View (ET-2)

**Input**: Design documents from `specs/001-expense-entry-log/`

**Scope**: Remaining ET-2 stories only: ET-4 Expense Log Table, ET-5 Edit an Expense Row, ET-6 Delete an Expense Row, and ET-7 Category × Month Summary Table. ET-3 Add an Expense Entry is complete and must remain covered by regression tests.

**Tests**: Required by the project constitution for changed behavior and pure logic. Use the existing Jest/jsdom setup; write focused tests before implementation and verify they fail for the new behavior.

**Organization**: User-story labels match the complete specification: US2=ET-4, US3=ET-5, US4=ET-6, and US5=ET-7. ET-7 is implemented before ET-6 because ET-6's acceptance criteria require deletion to refresh the summary.

## Phase 1: Setup

**Purpose**: Confirm the completed ET-3 baseline and existing test environment before expanding the app.

- [X] T011 Run `npm.cmd test -- --runInBand` and confirm the existing ET-3 suites pass before changing `tests/`, `modules/`, `app.js`, `index.html`, or `style.css`.

## Phase 2: Foundational

**Purpose**: No additional shared infrastructure is needed. The existing in-memory store, HTML/CSS/ES-module structure, and Jest/jsdom setup provide the prerequisites for the remaining stories.

## Phase 3: User Story 2 - Expense Log Table (ET-4, Priority: P1)

**Goal**: Show all expenses in a complete, sorted, responsive table with a useful empty state and row actions.

**Independent Test**: Render zero, one, and at least 50 expenses; verify the six required columns, sorted order, row numbering, Edit/Delete controls, exact two-decimal INR amounts, and horizontal scrolling without page overflow on mobile widths.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementing the full table.

- [X] T012 [P] [US2] Add renderer tests in `tests/ui.test.js` for the empty message “No expenses recorded yet”, columns `#`, Expense Name, Category, Date, Amount, Actions, one-based row numbers after sorting, Edit/Delete controls, date-descending and same-date entry-order-descending sorting, `DD-MMM-YYYY` dates, INR amounts rounded to the nearest paise with exactly two decimal places, and at least 50 rows.

### Implementation for User Story 2

- [X] T013 [US2] Extend `renderExpenseLog` in `modules/ui.js` to render the required empty state and all six columns, assign one-based positions after sorting, render Edit/Delete action buttons, preserve date-descending and insertion-order-descending tie sorting, and format amounts in INR rounded to the nearest paise with exactly two fraction digits without changing stored values.
- [X] T014 [US2] Add a horizontally scrollable log-table wrapper and amount-digit alignment in `style.css`, ensuring overflow stays within the log area and does not widen the page.

**Checkpoint**: ET-4 can be demonstrated with an empty log, a populated log, and 50+ rows, independently of edit/delete behavior.

## Phase 4: User Story 3 - Edit an Expense Row (ET-5, Priority: P2)

**Goal**: Edit one selected expense through the existing form, cancel safely, and retain correct ordering and derived values.

**Independent Test**: Select Edit on a row, save valid changes including a changed date, submit invalid changes, cancel, and select another row while editing; verify state, highlight, button label, and sort order.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementing update/edit behavior.

- [X] T015 [P] [US3] Add `updateExpense` tests in `tests/store.test.js` verifying identity-based updates, atomic rejection of invalid input, and that update rules remain: name required and non-empty after trimming; category one of the eight supported categories; date a valid `YYYY-MM-DD` calendar date with future dates permitted; amount finite and at least `0.01`; preserve `id` and `createdAt`.
- [X] T016 [P] [US3] Add edit-flow tests in `tests/app.test.js` verifying Edit populates all four fields, highlights the selected row, changes the submit label to “Update Expense”, applies ET-3 validation, saves the selected entry without rounding stored amount precision, re-sorts on date change, Cancel makes no mutation and restores add mode, and editing a second row replaces the first active edit.

### Implementation for User Story 3

- [X] T017 [US3] Implement `updateExpense(id, input)` in `modules/store.js`; validate the complete input before mutation, update only the matching record, retain its `id` and `createdAt`, and report a missing ID or validation errors without changing state.
- [X] T018 [US3] Add UI helpers in `modules/ui.js` to enter edit mode, populate the form, highlight exactly one expense row, change the submit label, and restore blank add mode with local-today date on cancel or successful update; add the initially hidden Cancel control in `index.html`.
- [X] T019 [US3] Extend event orchestration in `app.js` to start edit mode from the selected log row, submit through `updateExpense`, support cancellation and switching active rows, and delegate successful updates to the shared view-refresh function without directly rendering DOM.

**Checkpoint**: ET-5 works end-to-end with a single active edit and no data mutation on cancel or invalid submission.

## Phase 5: User Story 5 - Category × Month Summary Table (ET-7, Priority: P3)

**Goal**: Show all eight categories with expense-month amounts, category totals, monthly grand totals, and an overall grand total.

**Independent Test**: Supply expenses in multiple categories and months; verify exact sums, chronological month columns, all categories, empty-state output, and updates after adding or editing expenses.

### Tests for User Story 5

> Write these tests first and confirm they fail before implementing calculations or rendering.

- [X] T020 [P] [US5] Create pure calculation tests in `tests/analytics.test.js` for all eight categories, chronological months derived from expense dates, category-month sums, category totals, monthly grand totals, overall grand total, empty input, zero category-month intersections, immutability of input, and recalculation after add/edit-shaped input changes; assert calculations use unrounded stored amounts.
- [X] T021 [P] [US5] Add summary-renderer tests in `tests/ui.test.js` verifying populated month columns followed by Total, all eight category rows, the bottom Grand Total row, values rounded to the nearest paise and formatted as ₹X,XXX.00, the empty state with only a Total column, and the sticky-category/scroll wrapper hooks.

### Implementation for User Story 5

- [X] T022 [US5] Implement pure category/month aggregation in `modules/analytics.js`, deriving `YYYY-MM` months from expense dates, including all eight categories, summing category-month/category/month/grand totals from original stored amounts, returning zeros for missing category-month intersections, and not mutating input expenses.
- [X] T023 [US5] Add the summary section and labeled container to `index.html`, and add a horizontally scrollable summary wrapper with a sticky category column in `style.css`.
- [X] T024 [US5] Implement the summary renderer in `modules/ui.js` to consume the analytics result, display all eight categories, chronological month columns, rightmost Total and bottom Grand Total, round displayed INR values to the nearest paise with two decimals, and show eight zero totals with no month columns when empty.
- [X] T025 [US5] Implement a shared view-refresh function in `app.js` that obtains current expenses, renders the log and summary, and is called after successful add and successful edit; do not duplicate rendering logic in the submit handlers.

**Checkpoint**: ET-7 calculations and rendering are testable independently, and add/edit changes immediately update the summary.

## Phase 6: User Story 4 - Delete an Expense Row (ET-6, Priority: P2)

**Goal**: Let the user safely cancel or confirm deletion inline, then immediately refresh the log and summary.

**Independent Test**: Start deletion on a row and cancel, then confirm a deletion; verify only the selected expense is removed, all views update, an emptied category-month cell shows ₹0.00 while that month remains, and a month column disappears after its last expense is deleted.

**Dependency**: ET-4 log actions and ET-7 summary must be complete before this story can meet its full acceptance criteria.

### Tests for User Story 4

> Write these tests first and confirm they fail before implementing deletion behavior.

- [X] T026 [P] [US4] Add `deleteExpense` tests in `tests/store.test.js` verifying deletion by ID removes exactly one matching expense, preserves other entries and order, and reports an unknown ID without mutating state.
- [X] T027 [P] [US4] Add delete-flow tests in `tests/app.test.js` verifying the inline row prompt text and Confirm/Cancel controls, no browser confirmation call, cancel leaves log and summary unchanged, confirm removes only the selected row and refreshes both views, an empty category-month intersection renders ₹0.00, and deleting the last expense removes its month column.

### Implementation for User Story 4

- [X] T028 [US4] Implement `deleteExpense(id)` in `modules/store.js` to remove only the matching expense and report whether an expense was found.
- [X] T029 [US4] Add UI helpers in `modules/ui.js` to show the row-level “Delete this entry?” prompt with Confirm and Cancel, close it on either choice, and keep confirmation entirely inline without browser dialogs.
- [X] T030 [US4] Extend `app.js` action handling so Cancel closes the prompt without mutation and Confirm calls `deleteExpense`, then refreshes both the log and summary from current expenses.

**Checkpoint**: ET-6 deletion, cancellation, category-month zero values, and last-month removal all pass with ET-7 active.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete ET-2 increment across stories and preserve ET-3 behavior.

- [X] T031 Run all desktop/mobile smoke scenarios in `specs/001-expense-entry-log/quickstart.md`; resolve any regressions in the relevant source or test files.
- [X] T032 Run `npm.cmd test -- --runInBand` and verify all tests pass, ET-3 remains covered by regression tests, and `modules/analytics.js` meets the minimum 80% line coverage. CSV coverage is deferred to the separate ET-8 scope.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T011 confirms the existing test baseline before story changes.
- **Foundational (Phase 2)**: No additional shared code prerequisites.
- **ET-4 / US2 (Phase 3)**: Depends on the existing ET-3 expense store and basic renderer.
- **ET-5 / US3 (Phase 4)**: Depends on ET-4 row identity/action controls and the existing ET-3 form/store validation.
- **ET-7 / US5 (Phase 5)**: Depends on the shared expense state from ET-3; integrates with edit refresh after ET-5.
- **ET-6 / US4 (Phase 6)**: Depends on ET-4 delete controls and ET-7 summary rendering so deletion can refresh both views and remove empty months correctly.
- **Polish (Phase 7)**: Depends on all four remaining stories being implemented.

### User Story Dependencies

- **US2 (ET-4, P1)**: Depends on completed ET-3 only.
- **US3 (ET-5, P2)**: Depends on US2's rendered rows and Edit action.
- **US5 (ET-7, P3)**: Depends on ET-3 expense data; ET-5 updates are wired into the summary in T025.
- **US4 (ET-6, P2)**: Depends on US2's Delete action and US5's summary. Although ET-6 has higher stated priority than ET-7, implement ET-7 first to honor ET-6's delete-and-refresh-summary acceptance criteria.

### Parallel Opportunities

- T015 and T016 can be authored in parallel because they target separate test files.
- T020 and T021 can be authored in parallel because they target separate test files.
- T026 and T027 can be authored in parallel because they target separate test files.
- Within each story, tests precede implementation; source tasks that modify the same file remain sequential.
- ET-4 and initial ET-7 pure-calculation work can proceed independently after the ET-3 baseline, but the listed implementation sequence keeps each story verifiable before integration.

## Parallel Examples

```text
# ET-5 tests:
T015 tests/store.test.js
T016 tests/app.test.js

# ET-7 tests:
T020 tests/analytics.test.js
T021 tests/ui.test.js

# ET-6 tests:
T026 tests/store.test.js
T027 tests/app.test.js
```

## Implementation Strategy

### MVP First

The original ET-2 MVP (ET-3 add expense) is complete. For the remaining increment, deliver ET-4 first as the next independently testable slice, then ET-5. Implement ET-7 before ET-6 because deletion's acceptance criteria require immediate summary refresh. Finish with cross-story browser checks and the full Jest suite.

### Task Format Validation

All task entries use the required unchecked-checkbox form with a sequential task ID, a `[P]` marker only for parallelizable tasks, the appropriate `[US2]`–`[US5]` label for story tasks, and concrete repository file paths in each description.

## Phase 8: Convergence

- [X] T033 Implement and test `modules/csv.js` to achieve at least 80% line coverage and include it in Jest `collectCoverageFrom`, satisfying Constitution IV and plan Testable Completion (CRITICAL; contradicts).

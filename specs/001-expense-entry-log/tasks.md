# Tasks: Add an Expense Entry (ET-3)

**Input**: Design documents from `specs/001-expense-entry-log/`

**Scope**: ET-3 only. Includes the minimal log display required to show accepted expenses; the full ET-4 log and ET-5–ET-7 stories are deferred in `spec.md` and `plan.md`.

**Tests**: Included because the constitution requires tests for changed behavior and the plan calls for focused Jest tests.

## Phase 1: Setup

**Purpose**: Make the existing Jest test command runnable for browser-native ES modules and DOM behavior.

- [X] T001 Configure Jest and its browser DOM test environment in `package.json` and `jest.config.cjs`; add only the required development dependencies and generate `package-lock.json`, without adding runtime dependencies.

## Phase 2: Foundational

**Purpose**: No separate foundational code is needed for this single-story plan. T001 establishes the test runner required by US1.

## Phase 3: User Story 1 - Add an Expense Entry (Priority: P1) 🎯 MVP

**Goal**: Accept valid expense details into page-session memory, display the new expense immediately in the basic log, show inline errors for invalid input, and reset the form without a page reload after a successful add.

**Independent Test**: Submit valid and invalid expense details; verify exactly one record is added and displayed for valid input, invalid input leaves the store and log unchanged and shows field-specific errors, future dates and duplicate records are accepted, entries are ordered by expense date descending and insertion order descending for ties, and success resets the form to local today without navigation.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementing the form, store, log renderer, and submit behavior.

- [X] T002 [P] [US1] Add store tests in `tests/store.test.js` verifying the Expense constraints verbatim: `id` is a unique UUID string; `name` is required and non-empty; `category` is required and one of `Groceries`, `Outside Food`, `Fuel`, `Travel`, `Leisure`, `Medicines`, `Utilities`, or `Others`; `date` is required, a valid `YYYY-MM-DD` calendar date, and may be in the future; `amount` is required, finite, and at least `0.01`; `createdAt` is an ISO 8601 timestamp. Verify invalid input leaves the collection unchanged and duplicate expenses are accepted.
- [X] T003 [P] [US1] Add DOM-renderer tests in `tests/ui.test.js` verifying the basic log displays accepted expense fields immediately in date-descending order and uses newest insertion first for equal dates.
- [X] T004 [P] [US1] Add submit-handler tests in `tests/app.test.js` verifying the date initializes to local today, missing or invalid values show per-field inline errors, successful submission prevents navigation and adds exactly one record, the basic log updates, errors clear and fields reset with date restored to local today, and future dates and duplicate submissions are accepted.

### Implementation for User Story 1

- [X] T005 [P] [US1] Add the ET-3 form and basic expense-log container in `index.html` with labeled required name, category, date, and INR amount controls; include exactly the eight supported categories, a date input, a numeric amount input with minimum `0.01` and no unstated precision restriction, and an inline error target associated with each field.
- [X] T006 [P] [US1] Implement the in-memory expense collection, `addExpense(input)`, and `getExpenses()` in `modules/store.js`; validate the complete record before mutation, allow future dates and duplicates, and create the UUID and ISO 8601 `createdAt` value for each accepted expense.
- [X] T007 [P] [US1] Implement the basic log renderer in `modules/ui.js` to display accepted expense name, category, date (`DD-MMM-YYYY`), and INR amount formatted with `toLocaleString('en-IN')` in date-descending order with newest insertion first for equal dates; keep the renderer limited to ET-3 rather than adding ET-4 actions or responsive-table requirements.
- [X] T008 [US1] Wire the form `submit` handler in `app.js` to prevent the browser's default navigation, submit field values through `addExpense`, delegate field-specific inline validation feedback to `modules/ui.js`, and on success render the updated log, clear validation feedback, and reset the form with its date restored to local today.

**Checkpoint**: US1 is independently testable for form validation, in-memory add, immediate basic-log rendering and order, duplicate/future-date acceptance, reset, and no-reload behavior.

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Verify the scoped story against its design validation guide.

- [X] T009 Run the focused Jest tests and the ET-3 browser smoke scenarios in `specs/001-expense-entry-log/quickstart.md`; resolve failures in the scoped source and test files before marking ET-3 complete.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 must complete before Jest tests can run.
- **Foundational (Phase 2)**: No separate tasks; T001 is the only shared prerequisite.
- **User Story 1 (Phase 3)**: Depends on T001. T002–T004 are written first and should fail before implementation. After the tests exist, T005–T007 can proceed in parallel because they target separate files; T008 depends on the form, store API, and renderer.
- **Polish (Phase 4)**: T009 depends on the form, store, renderer, submit handler, and tests being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on another user story.
- **ET-4 through ET-7**: Deferred and not dependencies of this ET-3 increment.

### Parallel Opportunities

- T002, T003, and T004 can be authored in parallel after T001 because they target separate test files.
- After tests are written, T005, T006, and T007 can be implemented in parallel because they target separate files and have no dependency on one another.
- T008 is sequential after T005–T007; T009 is the final verification step.

## Parallel Example: User Story 1

```text
# After T001, write independent tests in parallel:
T002 tests/store.test.js
T003 tests/ui.test.js
T004 tests/app.test.js

# After tests are in place, implement independent files in parallel:
T005 index.html
T006 modules/store.js
T007 modules/ui.js

# Then wire and verify:
T008 app.js
T009 specs/001-expense-entry-log/quickstart.md
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001 to make the repository's Jest command usable.
2. Write T002–T004 first and confirm they fail against the current empty implementation.
3. Implement T005–T007, then connect them with T008.
4. Run T009 and validate the ET-3 form and basic log independently.
5. Do not mark the full ET-4 log, edit, delete, or summary requirements complete; those stories are explicitly deferred.

## Phase 5: Convergence

- [X] T010 Move inline validation-message and `aria-invalid` DOM updates from `app.js` into `modules/ui.js`, keep `app.js` limited to submission orchestration, and update `tests/app.test.js` and `tests/ui.test.js` to verify unchanged ET-3 inline error behavior per Constitution III.

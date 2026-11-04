# Implementation Plan: Expense Entry and Log View (ET-2)

**Branch**: `ET-1.2-to-1.5-expense-entry-and-view` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Jira epic ET-2, “Expense entry and log view.” ET-3 is complete. This plan covers the remaining child stories ET-4 (Expense Log Table), ET-5 (Edit an Expense Row), ET-6 (Delete an Expense Row), and ET-7 (Category × Month Summary Table), preserving their Jira names and acceptance criteria.

## Summary

Extend the existing browser-only expense tracker from the completed ET-3 add flow into the complete ET-2 log and summary experience. The in-memory store will support validated updates and deletions as well as additions. The UI module will render the full sorted log, edit/delete states, inline confirmation, and category-by-month summary; pure summary calculations will remain independently testable. The app module will coordinate user events and refresh affected views after state changes. Responsive table behavior, accessible actions and inline prompts, and all monetary/date formats will be verified without adding a framework, backend, persistence layer, or build tool.

## Technical Context

**Language/Version**: Browser-native JavaScript ES modules and HTML5

**Primary Dependencies**: Existing Jest and jsdom development dependencies; no new runtime dependencies

**Storage**: Existing in-memory expense collection for the current page session

**Testing**: Jest via `npm test`; extend `tests/store.test.js`, `tests/ui.test.js`, and `tests/app.test.js`, and add focused tests for pure summary calculations. Run browser smoke checks for responsive behavior and full user journeys.

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Browser-only single-page web application

**Performance Goals**: Log, summary, and totals update synchronously after an expense change; 50 or more log entries remain available and correctly ordered.

**Constraints**: Preserve ET-3 add behavior and the eight supported categories. Keep stateful CRUD in `modules/store.js`, pure summary calculations in `modules/analytics.js`, and all DOM manipulation/rendering in `modules/ui.js`; `app.js` coordinates event handling only. No persistence, backend, framework, or build tool. Do not use browser `alert()`, `confirm()`, or `prompt()`.

**Scale/Scope**: One in-memory collection, one complete expense log with row actions, one expense form supporting add/edit, and one category-by-month summary. Work is limited to ET-4–ET-7; ET-3 is a completed dependency and must not regress.

## Constitution Check

### Before Phase 0

- **Spec Before Code**: Pass. The ET-2 specification captures ET-3 through ET-7 and retains Jira story boundaries. Implementation must follow the approved acceptance scenarios.
- **Vanilla JavaScript in Stage 1**: Pass. Existing browser-native HTML, CSS, and JavaScript remain in use; no framework or build system is planned.
- **Pure Logic and DOM Separation**: Pass. CRUD remains in `modules/store.js`, category/month aggregation and totals are pure functions in `modules/analytics.js`, and all DOM rendering remains in `modules/ui.js`.
- **Testable Completion**: Pass. Extend Jest tests for changed behavior and cover each pure analytics function. Preserve the constitution's minimum 80% line coverage for both `modules/csv.js` and `modules/analytics.js`.
- **Consistent User-Facing Conventions**: Pass. Amounts remain INR formatted using `toLocaleString('en-IN')`, with exactly two fraction digits where ET-4/ET-7 require them. Dates remain `DD-MMM-YYYY`. Delete confirmation and validation feedback use inline UI.
- **Stage 1 constraints**: Pass. State stays in memory; no backend, database, persistence, framework, or bundler is introduced.
- **Epic branch naming**: Exception. The current branch is `ET-1.2-to-1.5-expense-entry-and-view`, which does not follow the constitution's `ET-2-...` epic naming convention. The user directed continuing on the current branch; no branch change was made.

No pre-design technical clarifications remain. The branch naming exception is documented below.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-entry-log/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── expense-entry-form.md
│   └── expense-log-and-summary.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
style.css
app.js
modules/
├── store.js
├── ui.js
└── analytics.js
tests/
├── app.test.js
├── store.test.js
├── ui.test.js
└── analytics.test.js
```

**Structure Decision**: Retain the existing single-project layout. Extend the store for CRUD, add pure category/month calculations in the planned `modules/analytics.js`, extend the UI renderer for the full log and summary, and keep `app.js` focused on orchestration. Use the existing HTML entry point and stylesheet for semantic markup, responsive wrappers, and sticky summary category behavior.

## Implementation Sequence

1. **ET-4 — Expense Log Table**: Extend the existing log to render `#`, Expense Name, Category, Date, Amount, and Actions; preserve date-descending and same-date reverse-entry ordering; show the required empty state; use fixed two-decimal INR display and aligned amount digits; provide horizontal scrolling on narrow screens. Render Edit/Delete controls as the specified row actions, with their behaviors completed in ET-5 and ET-6.
2. **ET-5 — Edit an Expense Row**: Add a validated store update operation that retains the expense identity and creation time; populate the existing form from a selected row; visibly highlight the edited row; switch the submit label to “Update Expense”; support cancel and switching the active row; re-sort after date changes and apply ET-3 validation rules. Centralize successful log and summary refresh so each add/edit/delete event invokes the same render coordination.
3. **ET-7 — Category × Month Summary Table**: Add pure calculations for chronological expense months, eight category rows, category-month values, category totals, monthly totals, and grand total. Render the empty state with all categories and a Total column, update after add/edit/delete changes, and provide horizontally scrollable layout with a sticky category column. Calculate using original stored precision and round only displayed totals to the nearest paise.
4. **ET-6 — Delete an Expense Row**: Add deletion by expense identity and row-level inline confirmation with Confirm/Cancel. Cancel leaves state unchanged; confirm removes one expense, refreshes the log, and refreshes the summary. Show ₹0.00 for a category-month intersection without expenses when the month remains; remove a month column after its last expense is deleted.
5. **Cross-story verification**: Exercise combined add, edit, cancel, delete, sorting, summary, empty-state, and responsive scenarios; run the focused Jest suite and the browser checks in [quickstart.md](./quickstart.md). Preserve all ET-3 tests and behavior.

**Dependency note**: ET-7's summary renderer/calculations must be in place before ET-6 can verify that confirmed deletion refreshes both views. The Jira story order is preserved in scope, while implementation sequence accounts for that acceptance-criteria dependency.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Current branch does not follow the ET-2 epic naming convention | User explicitly chose to continue on the existing branch for this planning work. | Switching branches would disrupt the current work context; no branch change was requested. |

## Scope Boundaries

- ET-3 is complete and is not reimplemented; it is regression-tested and supplies the shared add form and expense rules.
- ET-4 defines the full table and action controls; edit and delete behavior belongs to ET-5 and ET-6 respectively.
- ET-5 and ET-6 change only in-memory expense state; persistence and undo are not specified.
- ET-7 derives its rows, month columns, and totals from current expenses. Months with no remaining expenses are omitted; categories without expenses for a month display ₹0.00 when that month exists.
- CSV import/export and analytics beyond the ET-7 category-by-month summary are outside ET-2.

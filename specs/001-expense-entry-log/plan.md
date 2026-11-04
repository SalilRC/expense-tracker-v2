# Implementation Plan: Add an Expense Entry (ET-3)

**Branch**: `001-expense-entry-log` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Jira story ET-3, “Add an Expense Entry.” This plan covers the form, in-memory store, submit orchestration, and the minimal log rendering required to show accepted entries. Full ET-4 log behavior and ET-5–ET-7 remain deferred.

## Summary

Implement a browser-only expense form that accepts a required name, supported category, date, and positive INR amount. The form defaults to the user's local date, shows field-specific inline validation errors, and adds valid entries to in-memory state without a page reload. After a successful add, render the updated basic expense log immediately, then reset the fields and restore the local-today date. The store remains responsible for creating and validating expense records; `modules/ui.js` owns DOM rendering for the log and validation feedback, while the submit handler coordinates store calls, rendering, and form reset.

## Technical Context

**Language/Version**: Browser-native JavaScript (ES modules), HTML5

**Primary Dependencies**: None; no framework or build tool

**Storage**: In-memory JavaScript module state for the current page session

**Testing**: Jest is the project test target (`npm test`); add focused unit tests for `addExpense`, basic log rendering, and submit-handler behavior in `tests/`. The current package manifest has the test script but no declared dev dependencies and the tests directory has no test files yet.

**Target Platform**: Modern browser, single-page application

**Project Type**: Browser-only web application

**Performance Goals**: Synchronous local form submission and in-memory update, with no navigation or page reload

**Constraints**: Implement `index.html`, `modules/store.js`, `modules/ui.js`, and `app.js`; keep data in memory; use the eight ET-3 categories; accept future dates and duplicate entries; require an amount of at least ₹0.01. All DOM rendering belongs in `modules/ui.js`; `app.js` coordinates form submission and reset behavior. Full ET-4 log features and ET-5–ET-7 are deferred.

**Scale/Scope**: One add form and an in-memory expense collection for a single browser page session, plus a basic log view that displays accepted expenses in the required order. Full log behavior, editing, deletion, and summary calculations are outside this story plan.

## Constitution Check

### Before Phase 0

- **Spec Before Code**: Pass. This plan is based on the existing ET-2 feature spec and ET-3 Jira acceptance criteria; implementation must not precede the approved story requirements.
- **Vanilla JavaScript in Stage 1**: Pass. The approach uses native HTML and JavaScript only.
- **Pure Logic and DOM Separation**: Pass. `modules/store.js` remains DOM-free; all log and inline validation DOM rendering is performed by `modules/ui.js`, while `app.js` coordinates submission and form reset.
- **Testable Completion**: Pass as a plan gate. Cover store validation/add behavior and submission behavior with Jest tests before marking ET-3 Done.
- **Consistent User-Facing Conventions**: Pass. INR amounts are formatted with `toLocaleString('en-IN')`; expense dates are displayed as `DD-MMM-YYYY` and submitted in `YYYY-MM-DD` form. No browser alert, confirm, or prompt dialogs are needed.
- **Stage 1 constraints**: Pass. No backend, database, persistence, framework, or build tool is introduced.

No unresolved requirements or technical clarifications remain for this scoped story.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-entry-log/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── expense-entry-form.md
```

### Source Code (repository root)

```text
index.html
app.js
modules/
├── store.js
└── ui.js
tests/
└── focused ET-3 Jest tests
```

**Structure Decision**: Use the existing single-project, browser-only structure. Keep expense state and validation in `modules/store.js`; render the basic log and inline validation feedback through `modules/ui.js`; use `app.js` for event wiring and submission orchestration.

## Implementation Sequence

1. Add semantic, labeled form controls, per-field inline error targets, and a basic expense-log container in `index.html`, including native required/type/minimum constraints, no unstated amount precision limit, and the ET-3 category choices.
2. Implement the in-memory expense collection, `addExpense(input)`, and `getExpenses()` in `modules/store.js`. Validate the complete input before mutation; create the expense identity and creation timestamp on success.
3. Implement `renderExpenseLog(expenses)` in `modules/ui.js` to display accepted expenses in date-descending order and insertion order descending for equal dates.
4. Wire the form `submit` event in `app.js`. Prevent navigation, validate/submit through the store, call the UI validation renderer for invalid fields, and on success call `renderExpenseLog(getExpenses())`, clear validation feedback through the UI module, and reset the form while setting its date back to local today.
5. Add and run focused Jest tests for valid adds, invalid fields, future dates, duplicates, immediate log rendering and order, reset/default date, and prevention of page navigation.

## Complexity Tracking

No exceptions to the project constitution are required.

## Deferred Scope

The full ET-4 expense-log table, edit behavior (ET-5), deletion behavior (ET-6), and category-by-month summary (ET-7) are not part of this plan. See [spec.md](./spec.md) for the deferred story boundaries.

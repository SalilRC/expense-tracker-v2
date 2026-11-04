# Implementation Plan: Add an Expense Entry (ET-3)

**Branch**: `001-expense-entry-log` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Jira story ET-3, “Add an Expense Entry.” This plan is limited to the story and its requested files: `index.html`, `modules/store.js`, and `app.js`.

## Summary

Implement a browser-only expense form that accepts a required name, supported category, date, and positive INR amount. The form defaults to the user's local date, shows field-specific inline validation errors, and adds valid entries to in-memory state without a page reload. After a successful add, reset the fields and restore the local-today date. The store remains responsible for creating and validating expense records; the submit handler coordinates submission and the inline feedback required by ET-3.

## Technical Context

**Language/Version**: Browser-native JavaScript (ES modules), HTML5

**Primary Dependencies**: None; no framework or build tool

**Storage**: In-memory JavaScript module state for the current page session

**Testing**: Jest is the project test target (`npm test`); add focused unit tests for `addExpense` and submit-handler behavior in `tests/`. The current package manifest has the test script but no declared dev dependencies and the tests directory has no test files yet.

**Target Platform**: Modern browser, single-page application

**Project Type**: Browser-only web application

**Performance Goals**: Synchronous local form submission and in-memory update, with no navigation or page reload

**Constraints**: Implement only `index.html`, `modules/store.js`, and `app.js`; keep data in memory; use the eight ET-3 categories; accept future dates and duplicate entries; require an amount of at least ₹0.01. This story specifically authorizes `app.js` to render and clear inline validation feedback as an exception to the constitution's DOM-rendering boundary. The exception is limited to this story and does not authorize moving expense CRUD or other rendering into `app.js`.

**Scale/Scope**: One add form and one in-memory expense collection for a single browser page session. Log rendering, editing, deletion, and summary calculations are outside this story plan.

## Constitution Check

### Before Phase 0

- **Spec Before Code**: Pass. This plan is based on the existing ET-2 feature spec and ET-3 Jira acceptance criteria; implementation must not precede the approved story requirements.
- **Vanilla JavaScript in Stage 1**: Pass. The approach uses native HTML and JavaScript only.
- **Pure Logic and DOM Separation**: Pass with a story-specific exception. `modules/store.js` owns in-memory CRUD and domain validation. `app.js` handles event wiring and, as explicitly authorized for ET-3 only, the field-level inline error DOM updates. No DOM access will be added to the store.
- **Testable Completion**: Pass as a plan gate. Cover store validation/add behavior and submission behavior with Jest tests before marking ET-3 Done.
- **Consistent User-Facing Conventions**: Pass. Amounts are INR; the entry date is submitted in `YYYY-MM-DD` form. No browser alert, confirm, or prompt dialogs are needed.
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
└── store.js
tests/
└── focused ET-3 Jest tests (new tests, not part of this plan's source-file scope)
```

**Structure Decision**: Use the existing single-project, browser-only structure. Keep the requested three source files in scope. `app.js` performs the ET-3-specific inline validation rendering under the explicit exception above; introducing or expanding another UI module is outside this story plan.

## Implementation Sequence

1. Add semantic, labeled form controls and per-field inline error targets in `index.html`, including native required/type/minimum constraints, no unstated amount precision limit, and the ET-3 category choices.
2. Implement the in-memory expense collection and `addExpense` in `modules/store.js`. Validate the complete input before mutation; create the expense identity and creation timestamp on success.
3. Wire the form `submit` event in `app.js`. Prevent navigation, validate/submit through the store, render errors for invalid fields, and on success clear errors and reset the form while setting its date back to local today.
4. Add and run focused Jest tests for valid adds, invalid fields, future dates, duplicates, reset/default date, and prevention of page navigation.

## Complexity Tracking

| Exception | Why Needed | Narrow Boundary |
|-----------|------------|-----------------|
| Inline validation feedback is rendered in `app.js` | The user's requested ET-3 file scope excludes `modules/ui.js`, while the story requires per-field inline errors. The user explicitly approved this as a story-only exception. | Keep CRUD and validation rules in `modules/store.js`; keep DOM updates to the ET-3 form's error targets in `app.js`; do not treat this as a project-wide architecture change. |

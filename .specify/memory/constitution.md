<!--
Sync Impact Report
Version change: unversioned scaffold → 1.0.0
Modified principles:
- Principle 1 template placeholder → Spec Before Code
- Principle 2 template placeholder → Vanilla JavaScript in Stage 1
- Principle 3 template placeholder → Pure Logic and DOM Separation
- Principle 4 template placeholder → Testable Completion
- Principle 5 template placeholder → Consistent User-Facing Conventions
Added sections: Stage 1 Constraints; Development Workflow
Removed sections: None
Follow-up TODOs: Confirm the original ratification date.
-->
# Expense Tracker Constitution

## Core Principles

### I. Spec Before Code
Every feature MUST have a feature specification artifact in `.specify/` before implementation
begins. Implementation MUST follow the approved specification; material scope or behavior changes
MUST be reflected in the specification before the corresponding code changes.

### II. Vanilla JavaScript in Stage 1
Stage 1 MUST use browser-native HTML, CSS, and JavaScript. External JavaScript frameworks and
build tools are prohibited in this stage. This keeps the application browser-only and simple to run.

### III. Pure Logic and DOM Separation
Business, validation, CSV, and analytics logic MUST live in testable functions in `modules/`;
domain calculations and transformations MUST be pure. Stateful expense CRUD belongs in
`modules/store.js`. DOM manipulation and rendering MUST occur only in `modules/ui.js`, keeping
logic independently testable and preventing rendering concerns from leaking into the domain.

### IV. Testable Completion
Tests MUST cover every pure logic function before its story is marked Done. Tests MUST be written
and run for new or changed behavior. Jest tests belong in `tests/`; `modules/csv.js` and
`modules/analytics.js` MUST each maintain at least 80% line coverage.

### V. Consistent User-Facing Conventions
All monetary values MUST be represented in Indian Rupees and formatted with
`toLocaleString('en-IN')`. Dates MUST be displayed as `DD-MMM-YYYY`. The application MUST NOT use
browser `alert()`, `confirm()`, or `prompt()` dialogs; confirmations and feedback MUST use inline UI.

## Stage 1 Constraints

Stage 1 is a browser-only single-page application with no backend or database. Expense records
MUST conform to the project data model: UUID string ID, name, supported category, `YYYY-MM-DD` date,
positive INR amount, and ISO 8601 creation timestamp. Stage 1 MUST NOT introduce frameworks,
bundlers, or build tools.

## Development Workflow

Branches for epic work MUST follow `ET-[epic-number]-short-description`, for example
`ET-2-expense-entry-and-log-view`. Each story MUST be implemented against its specification, and
its required tests MUST pass before the story is marked Done.

## Governance

This constitution governs project specifications, implementation, and review. To amend it, update
this document, increment its semantic version, and record the impact in the Sync Impact Report
while preparing the amendment. Reviewers MUST verify that specifications, code, and tests comply
with these principles; deviations require an explicit constitution amendment before implementation.
Versioning follows SemVer: MAJOR for incompatible governance changes, MINOR for added principles
or materially expanded requirements, and PATCH for clarifications and non-semantic refinements.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-10-31

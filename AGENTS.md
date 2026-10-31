# expense-tracker-v2 — Agent Context

## What this project is
A personal expense tracking web application. Stage 1 is a browser-only
single-page app (no backend, no database, no framework). Vanilla HTML, CSS,
and JavaScript only.

## JIRA project
Key: ET. Stories follow the format ET-1.1, ET-1.2, etc.
Epics: ET-2 (Expense entry and log view), ET-8 (CSV export and import),
ET-12 (Analytics Dashboard — stretch goal).

## Data model
An expense object:
{
  id: string (uuid),
  name: string,
  category: "Groceries" | "Outside Food" | "Fuel" | "Travel" |
            "Leisure" | "Medicines" | "Utilities" | "Others",
  date: string (YYYY-MM-DD),
  amount: number (positive, INR),
  createdAt: string (ISO 8601)
}

## Module structure
- index.html — entry point
- style.css — all styles
- app.js — event wiring and app init
- modules/store.js — in-memory state, all CRUD operations
- modules/ui.js — all DOM rendering functions
- modules/csv.js — CSV export and import logic
- modules/analytics.js — analytics calculations (Epic 3)

## Constraints
- No external JS frameworks (no React, Vue, Angular)
- No build tools in Stage 1 (no webpack, vite, etc.)
- Amount always in Indian Rupees (₹), formatted with toLocaleString('en-IN')
- Dates displayed as DD-MMM-YYYY (e.g. 31-Oct-2026)
- No browser confirm() or alert() dialogs — use inline UI

## Testing
Jest for unit tests. Tests live in tests/ directory.
Target: ≥80% line coverage on modules/csv.js and modules/analytics.js.

## CI
GitHub Actions (.github/workflows/ci.yml) added in Stage 2.
Runs on every PR: lint (ESLint) → test (Jest + coverage).
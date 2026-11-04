# Research: Expense Entry and Log View (ET-2)

## Decision: Extend the existing in-memory store with identity-based updates and deletion

**Rationale:** ET-3 already owns the expense collection and validation rules. Update and delete operations belong beside add/get so each change has one state owner, updates can preserve the expense identity and creation timestamp, and the UI does not mutate records directly.

**Alternatives considered:** Keep editable state in the form or table, which would create competing sources of truth; introduce persistence or a backend, which is outside Stage 1 and ET-2.

## Decision: Keep summary aggregation pure and separate from rendering

**Rationale:** Category/month bucketing and totals are domain transformations that can be unit-tested without a DOM. A pure calculation can return the ordered month keys, fixed category rows, cell amounts, category totals, and grand totals. `modules/ui.js` can then render that result without embedding business calculations.

**Alternatives considered:** Calculate totals during DOM rendering, which couples correctness to markup; maintain separate mutable summary state, which risks drifting from expense CRUD state.

## Decision: Use expense date as the summary month and chronological month keys

**Rationale:** The story summarizes spending by category and month, so each expense is grouped by the month portion of its expense date. The visible month columns are the distinct months present in current expenses, ordered oldest to newest; removing the last expense for a month removes its column.

**Alternatives considered:** Group by creation timestamp, which would classify expenses under the recording month rather than the date of the spending; preserve empty month columns, which conflicts with ET-7's “month that has at least one expense” requirement.

## Decision: Keep sorting deterministic across add and edit

**Rationale:** The log sorts expense date descending and insertion order descending for equal dates. Store order is the stable tie-break source: a successful edit updates the existing record without changing its insertion position or identity. Re-rendering after an edit that changes the date naturally places the record in its new date group.

**Alternatives considered:** Use a new timestamp or identifier as the tie-breaker, which does not directly represent entry order and can change on edit.

## Decision: Use the existing form for edit mode and inline row confirmation for delete

**Rationale:** ET-5 explicitly requires selecting Edit to populate the existing form and changing its button label. The same form validation applies; Cancel exits edit mode without mutation. ET-6 explicitly requires a row-level inline prompt and prohibits browser confirmation dialogs.

**Alternatives considered:** Separate edit forms or modal dialogs, which do not match the stated acceptance criteria; browser `confirm()`, which violates both ET-6 and the project constitution.

## Decision: Format list and summary amounts as INR with two fractional digits

**Rationale:** ET-4 requires two decimal places in the Amount column and ET-7 specifies ₹X,XXX.00 cell values. Use the project's Indian locale formatting convention while ensuring the specified fixed precision for these tables. Dates remain `DD-MMM-YYYY`.

**Alternatives considered:** Variable precision, which would violate the story criteria; storing formatted strings in the expense state, which would impair arithmetic and validation.

## Decision: Preserve responsive tables through horizontal scrolling and sticky category labels

**Rationale:** ET-4 requires the log to scroll horizontally on mobile without page overflow; ET-7 requires the summary to scroll with its category column remaining visible. These are presentation concerns and belong in UI markup and stylesheet behavior, not data logic.

**Alternatives considered:** Compressing or hiding required columns, which loses information; allowing the document itself to overflow horizontally, which breaks the page layout.

## Decision: Extend existing Jest coverage and add no runtime dependencies

**Rationale:** The repository already has Jest/jsdom and focused store, UI, and app tests. Pure aggregation can be tested in a dedicated `tests/analytics.test.js`; DOM interactions remain covered by UI/app tests, and browser smoke checks verify responsive behavior.

**Alternatives considered:** Add another unit-test framework or browser automation dependency; neither is necessary for the specified behavior.

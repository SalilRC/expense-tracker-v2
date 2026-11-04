# Research: Add an Expense Entry (ET-3)

## Decision: Keep validation at both the form and store boundaries

**Rationale:** Native HTML constraints (`required`, appropriate input types, and a minimum amount) provide useful browser semantics. The store must still reject invalid domain data independently so invalid records cannot enter module state through a non-form caller. The submit handler should display all applicable field errors inline rather than relying on a browser validation bubble.

**Alternatives considered:** Rely only on native browser validation, which does not provide the required field-specific inline messages; validate only in `app.js`, which would leave the state boundary unprotected.

## Decision: Use a native date input with local-today initialization

**Rationale:** The date picker returns the required `YYYY-MM-DD` value. Generate the default from the browser's local calendar date rather than UTC so users near a UTC date boundary see their local today. Do not set a maximum date: ET-3 explicitly permits future dates. Restore the date to local today after a successful reset.

**Alternatives considered:** Use a UTC ISO date substring, which can select the wrong local calendar day; restrict the maximum date to today, which violates the acceptance criteria.

## Decision: Use a numeric amount input with the specified ₹0.01 minimum

**Rationale:** The acceptance criteria specify a numeric input and minimum of ₹0.01 but do not constrain precision. Use `min="0.01"` and `step="any"` to avoid imposing an unstated precision limit. Validate finite numeric input and the minimum again in the store.

**Alternatives considered:** Leave the default number step of 1, which rejects ordinary fractional INR amounts; use `step="0.01"`, which would add a two-decimal increment rule not stated in ET-3.

## Decision: Allow duplicates and future dates; keep records in memory

**Rationale:** ET-3 explicitly allows both duplicates and future dates and requires in-memory session state only. The add path must not add uniqueness checks, date caps, local storage, or a backend.

**Alternatives considered:** Persistent browser storage and duplicate prevention, both of which introduce behavior outside the story requirements.

## Decision: Keep CRUD, log rendering, and form orchestration in their designated modules

**Rationale:** The user kept this feature scoped to ET-3 and approved adding only the basic log display needed to satisfy ET-3's visible-log acceptance criterion. `modules/store.js` remains DOM-free and owns state and domain validation; `modules/ui.js` owns the basic log and inline validation rendering; `app.js` owns form event orchestration.

**Alternatives considered:** Put DOM logic in the store, which would violate the separation between state and rendering. Full ET-4 log behavior and ET-5–ET-7 remain deferred.

## Decision: Use focused Jest tests and no new runtime dependencies

**Rationale:** Jest is the project's declared test command and no external runtime dependencies are necessary. Tests should exercise store validation, the basic log renderer, and the submit handler's observable behavior, including display ordering, reset, and no navigation.

**Alternatives considered:** Add a test framework or browser automation dependency during planning; no need is established for this story.

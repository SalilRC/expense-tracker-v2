# Quickstart: Validate ET-3 Expense Entry

## Prerequisites

- A modern browser.
- The project test environment with Jest available. The package script is `npm test`; the package manifest currently does not declare Jest as a dev dependency.

No backend or persistent storage is required. Serve the project as static files if the browser blocks ES module imports when opening `index.html` directly.

## Automated checks

Run the focused ET-3 Jest tests (once implemented) using the repository test script:

```powershell
npm test -- --runInBand
```

The tests should verify:

1. A valid submission adds exactly one fully formed expense to module memory.
2. Missing name, category, date, invalid date, and amounts below ₹0.01 produce field errors and do not mutate the store.
3. A future date and a duplicate entry are accepted.
4. A successful submission is handled without page navigation and resets fields, with the date restored to local today.

## Browser smoke check

1. Load the app and confirm the date field is initialized to the browser's local date.
2. Submit the empty form; confirm inline errors appear for the required fields and no entry is created.
3. Submit an otherwise valid entry with amount `0.01`; confirm it is accepted and the page does not reload.
4. Confirm the form resets, the date returns to local today, and the expense exists only in current-page memory.
5. Submit a future-dated entry and a duplicate of an existing entry; confirm both are accepted.

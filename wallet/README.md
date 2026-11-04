# Task 1: Fintech wallet interface

Mira is a responsive personal money journal built using HTML, CSS and vanilla JavaScript. It records amounts manually on the current device, so it is useful without a server or financial provider.

## What's included

- Starts at **₹0**, with no invented history, fake bank card, or preloaded spending totals.
- Records income and expenses with categories, descriptions, dates, and accurate two-decimal INR arithmetic.
- Rejects invalid amounts and outflows larger than the recorded balance.
- Calculates balance, this-month income/outflow, and searchable/filterable activity from saved records.
- Hides displayed amounts, exports CSV backups, and provides a confirm-before-delete action.
- Supports mobile layouts, keyboard navigation, clear empty states, and accessible form validation.

## Open locally

From the repository root:

    python -m http.server 8000

Visit http://localhost:8000/wallet/

Alternatively, use any static file server. The app has no runtime dependencies.

## Data and limitations

Entries are stored in the current browser's localStorage as version 2. A private browser window, device change, cleared site data, or blocked storage can remove them, so use **Export CSV** for a backup. The export contains user-entered financial information; store it securely.

This is **not** a bank account, payment service, or actual wallet ledger. It does not send money, collect credentials, invent balances, or represent manually recorded data as bank-verified transactions. A regulated production payment wallet would need authenticated users, a secure backend, auditable ledger, provider integration, reconciliation, and regulatory/security reviews. Those features are outside this static frontend project.

## Quality checks

See [QA.md](./QA.md) for verification scenarios. Browser test automation is in [tests/wallet.spec.js](../tests/wallet.spec.js). Do not claim usability testing with research participants unless it actually occurs.
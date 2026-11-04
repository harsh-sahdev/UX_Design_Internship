# Functional verification notes

Date: 4 November 2026

## Verified with a simulated browser DOM

The wallet's current JavaScript was loaded directly from GitHub and executed against a lightweight DOM/localStorage harness. These checks ran successfully:

1. Fresh storage starts with ₹0.00.
2. No fake transactions are preloaded.
3. Adding ₹500.00 as money in produces ₹500.00.
4. Recording ₹125.25 as money out produces ₹374.75.
5. Both entries appear in activity.
6. Editing the expense to ₹100.50 recalculates balance to ₹399.50.
7. Deleting that expense restores ₹500.00.
8. Records are written to versioned localStorage.
9. Attempting to record ₹600.00 outflow against ₹500.00 is rejected.
10. The rejected outflow does not appear in activity.

JavaScript parsing, Playwright spec parsing, and HTML ID reference checks also passed.

## Not yet verified

The mock checks are **not** a substitute for running Playwright in a real browser. Mobile rendering, keyboard navigation, dialog focus, CSV download behavior and actual persistent storage in a browser have not been observed yet. Do not claim them as passed or mark Task 1 ready for final internship submission until these are checked.

To run browser checks, use the repository's Playwright config: install npm dependencies, install a Chromium browser for Playwright, then run `npm test` from the repo root.

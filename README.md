# UX Design Internship · Interface Craft

A set of practical UI/UX assignments built with responsive HTML, CSS and JavaScript. The focus is on complete interactions, honest product states, clean design decisions and code that a reviewer can run without a complicated setup.

[![Browser QA](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml/badge.svg)](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml)

## Submitted work

| Assignment | Deliverable | Link |
| --- | --- | --- |
| **Task 1** · Fintech Wallet Redesign | Local-first money journal with zero-state balance, income/expense entries, corrections, filters, privacy toggle and CSV export | [Open Wallet](./wallet/) |
| **Task 3** · Interactive E-commerce Checkout | Editable basket, shipping methods, promo code, delivery validation, payment-method selection and an explicit sample confirmation | [Open Checkout](./checkout/) |

These are the **two selected coding assignments** for this portfolio. They do not process payments or connect to real bank accounts.

## Additional work

**Task 2 · Design System:** [Live component showcase](./design-system/), [editable SVG board](./design-system/figma-component-board.svg), [tokens](./design-system/tokens.json) and [Figma handoff instructions](./design-system/README.md) are included. A **native Figma component file has not been created** and Task 2 should not be marked as complete until that file is published and linked.

**Task 4 · UX Case Study:** not submitted.

## Review locally

A local static server is recommended to keep browser storage and URLs consistent.

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. The homepage links to all three sections.

To run the browser checks:

```bash
npm install
npx playwright install chromium
npm test
```

[GitHub Actions](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml) runs the Playwright suite on push and stores desktop/mobile screenshots as downloadable workflow artifacts. The current build result is shown by the badge above.

## Design and implementation notes

The wallet starts at **₹0.00** and creates records only when someone adds them. Entries stay in that browser's local storage. This is a record-keeping interface, not a live wallet or money-transfer app.

The checkout begins with a clearly labelled **sample basket** so a reviewer can complete the full flow immediately. Item quantities, totals, delivery charges and discounts update together. No customer information is sent to a backend; no real purchase is created.

The three sections share the same **Interface Craft** typography, teal palette, spacing tokens and wordmark. For detailed reasoning, see the [wallet design notes](./wallet/UX-NOTES.md) and [checkout design decisions](./checkout/DESIGN-DECISIONS.md).

## Submission evidence

[Submission checklist and reviewer guide](./SUBMISSION.md) · [Wallet QA](./wallet/QA.md) · [Checkout QA](./checkout/QA.md) · [Design System QA](./design-system/QA.md)

No external services, checkout credentials or API secrets are required.

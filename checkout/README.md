# Task 3 · Interactive E-commerce Checkout

**Interface Craft Checkout** demonstrates a complete, responsive checkout journey using a small sample basket. It is a front-end UI/UX assignment and intentionally does not charge money or create a server-side order.

## What to review

1. Review the basket. Add or remove units with accessible + and − controls (maximum 8 per product).
2. Choose standard or express delivery. The totals update immediately.
3. Enter the sample code `DEMO10` for a 10% basket discount. Invalid codes show feedback and are not applied.
4. Enter a name, email, street address, city and six-digit Indian PIN code. Incomplete values are rejected with clear field-level focus and text errors.
5. Review the delivery summary on the payment screen. **Edit** returns to the form without losing entries.
6. Select a sample payment method and complete the checkout to see an explicit `DEMO-` reference. No real payment or purchase is made.
7. Restart to clear the form and restore the sample basket.

This is an editable checkout, not a screenshot: quantity, shipping, discounts, validation, back-navigation and confirmation are interactive.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000/checkout/`. No runtime packages or API keys are needed.

## Browser checks

```sh
npm install
npx playwright install chromium
npm test
```

The checkout tests live in `tests/checkout.spec.js`. GitHub Actions generates full-page desktop and mobile screenshots as workflow artifacts, and tests the checkout at 360px, 390px, 768px and 1440px.

See [QA.md](./QA.md) for the acceptance matrix.

## Intentional boundaries

Illustrative products and Indian rupee prices are part of a clearly identified exercise, not a live product catalogue. The shipping estimates, discount, reference code and completion state are simulated. The checkout does not store or transmit personal details and never asks for card credentials. Building real e-commerce processing would require inventory, verified shipping/tax rules, an authenticated backend and a regulated payment provider. No user research or production security audit is claimed.

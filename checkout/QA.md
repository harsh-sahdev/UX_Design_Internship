# Task 3 · Checkout QA

| Journey | Expected behaviour | Automated coverage |
| --- | --- | --- |
| First load | Two sample products, ₹3,698 subtotal, free delivery | `checkout.spec.js` |
| Quantity increase/decrease | Item count and subtotal change, no negative quantities | `checkout.spec.js` |
| Empty basket | Cannot proceed to payment, clear explanatory message | `checkout.spec.js` |
| Express delivery | Adds ₹149 to total | `checkout.spec.js` |
| `DEMO10` promotion | Deducts 10% of subtotal in integer paise | `checkout.spec.js` |
| Invalid promotion | Returns message and removes previous sample discount | `checkout.spec.js` |
| Empty / invalid delivery form | Visible errors and targeted field focus | `checkout.spec.js` |
| Edit delivery | Returns from payment, keeps entered values | `checkout.spec.js` |
| Confirmation | Explicit `DEMO-` reference, no payment credentials | `checkout.spec.js` |
| Restart | Original sample basket, blank delivery form, no promotion | `checkout.spec.js` |
| Responsive width | No page overflow at 360/390/768/1440 | `checkout.spec.js` |

## Manual visual / accessibility checklist

- [ ] Review screenshots at desktop and 390px mobile widths.
- [ ] Use keyboard only, including quantity controls, radio options and submit.
- [ ] Check focus outlines and error messages with screen reader.
- [ ] Check long user names, 80-character product strings and zoom at 200%.
- [ ] Verify no language suggests a real payment/order is processed.

**Evidence:** GitHub Actions workflow called “UI/UX portfolio browser QA” runs Playwright and uploads screenshots. Only mark these manual items complete after conducting the specific checks.

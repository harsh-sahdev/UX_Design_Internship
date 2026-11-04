# Task 1 quality and review

## Functional acceptance

- [ ] On first load, the balance is ₹0.00 with no transactions.
- [ ] Recording ₹500.00 as income updates balance to ₹500.00 and adds an activity entry.
- [ ] Recording ₹125.25 as an expense updates the balance to ₹374.75.
- [ ] Trying to spend more than the balance shows a readable error.
- [ ] Invalid amounts (negative, extra decimal places, empty values) are rejected.
- [ ] Search, In/Out filters, balance privacy, and CSV export work.
- [ ] Reload preserves entries in a browser with localStorage enabled.
- [ ] Clear records requires confirmation and returns the page to zero.

## Visual and accessibility review

- [ ] 390px mobile: navigation and action controls are readable without horizontal scrolling.
- [ ] 1440px desktop: headings and content align; no clipped amounts.
- [ ] Keyboard focus is visible; modal can be opened, submitted, cancelled, or dismissed with Escape.
- [ ] Long descriptions, very large numbers, and empty search results display cleanly.
- [ ] User-facing language never claims a real bank connection or payment.

The checkboxes are intentionally unmarked until browser verification has been performed.
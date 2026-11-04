# Task 3 · Design decisions

## Problem framing

Checkout users should always know three things: **what they are buying, what it costs, and what remains before completion**. The form avoids requiring a third screen for reviewing an address or modifying the basket.

This is a design hypothesis based on common checkout patterns, not a claim of interviews or observed user research.

## Journey map

| Moment | User question | Interaction choice |
| --- | --- | --- |
| Review | What's in my basket? | Item thumbnail, name, option, quantity and price in a single row |
| Adjust | Can I change it? | Plus/minus next to the quantity; no need to leave checkout |
| Price | What changed? | Subtotal, delivery and discount update together |
| Delivery | What do you need? | Minimum named fields with explicit labels |
| Error | What is wrong? | First invalid field receives focus and a readable message |
| Payment | Am I sending real money? | Explicitly simulated methods and no card credentials |
| Finish | Did I complete the flow? | Distinct confirmation state with a DEMO reference and restart |

## Interface decisions

- **Two forms, three visible stages.** Delivery and sample payment are the active steps. Confirmation is a state, not another form.
- **Real calculations in the interface.** Basket amounts are integer paise, avoiding floating-point inaccuracies.
- **Honest content.** The checkout starts with two sample items solely to enable a full review journey. It never suggests an actual order was accepted.
- **Recoverable mistakes.** The address can be edited; empty baskets cannot progress; rejected promo codes explain what happened.
- **Constrained controls.** Quantity changes are between 0 and 8; duplicate promotional reductions are not stacked.
- **Consistent branding.** The same wordmark, muted surfaces and primary colour as Wallet.

## What I would validate next

Ask a reviewer to try the checkout on a phone without instructions, then record whether they notice the editable basket, understand the promotional code and can return to the address. Observations would guide further refinement. No such study is claimed here.

## Technical limits

The interface is client-side. A real store would need server-verified pricing, inventory reservation, order persistence, tax and shipping calculation, payment processing, user consent and a security assessment.

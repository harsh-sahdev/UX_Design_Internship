# Task 1: Fintech Mobile Wallet Redesign

Mira Wallet is a responsive UI/UX internship concept with a working browser prototype. It uses sample transactions and balances, with no real payment service.

## Run

From the repository root, run `python -m http.server 8000` and visit `http://localhost:8000/wallet/`.

## Interactions

The prototype includes an overview, sample balance and card, Send money, Add money, Pay a bill, transaction search, incoming/outgoing filters, and a balance privacy toggle.

## Design choices

The home screen brings common actions close to the account balance. Forms use clear labels and readable validation. Desktop and mobile layouts share the same features.

## Current limits

The spending graphic uses illustrative numbers and does not recalculate after a demo payment. Transaction history is saved locally when browser storage is available. No user research or real financial integration is claimed.

## Review checklist

Check at mobile and desktop widths. Try a successful send, top-up, invalid amount, insufficient balance, bill payment, search, filters, and balance masking. Record actual results before marking this assignment complete.

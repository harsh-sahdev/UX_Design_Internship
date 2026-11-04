# Interface Craft

A small collection of UI/UX internship assignments. Each has its own source, usage notes and limits. The implementation stays straightforward: accessible HTML, responsive CSS and plain JavaScript.

## Projects

| Task | Project | Current state |
| --- | --- | --- |
| 1 | [Interface Craft Wallet](./wallet/) | Redesigned and implemented; browser verification pending |
| 2 | [Figma design system](./design-system/) | Web reference ready; native Figma file not built |
| 3 | [Interface Craft Checkout](./checkout/) | Interactive checkout flow; final UI review pending |
| 4 | UX case study | Not started |

## Run

From the repository root run:

    python -m http.server 8000

Open http://localhost:8000/wallet/ to review Task 1, or http://localhost:8000/checkout/ for Task 3. The projects are static and don't require a build.

Interface Craft Wallet is a browser-local personal money journal, not a banking service. It starts at zero and records only data the user enters. No real bank transfers or card payments happen.

## Verification

Browser test scenarios are under [tests/](./tests/). After installing dependencies, run npm test. Manual responsive and accessibility review is tracked in [wallet/QA.md](./wallet/QA.md).

The repository is public for portfolio review. Do not submit or claim native Figma work until that deliverable actually exists.

## Brand identity

All sections use the **Interface Craft** wordmark, dark-teal palette, shared type and component tokens. `design-system/tokens.css` defines the foundation; `assets/brand.css` defines the wordmark. Wallet and Checkout are section labels, not separate companies.

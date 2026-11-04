# Interface Craft · Progress and verification

Updated 5 November 2026.

| Task | Implemented | Remaining external verification |
| --- | --- | --- |
| **1 · Wallet** | Responsive running app with balance overview, income/outflow and peer-transfer recording, Playwright checks, native 390px and 1440px Figma reference screens, clickable entry states | Reviewer visual accessibility pass |
| **2 · Design system** | 24 Figma variables, text/colour styles, seven native component sets with 29 variants, source tokens and web showcase | Verify the file's external viewer permissions and whether team publishing is available |
| **3 · Checkout** | Functional example basket and validation; desktop/mobile Figma frames; linked payment and confirmation screens | Confirm responsive visual QA and form behavior |
| **4 · Case study** | [10-slide responsive deck](./case-study/) with problem framing, hypothesis personas, journey map, low-fidelity wireframes, final UI and print/PDF layout | Final slide-by-slide visual inspection |

## Native Figma document

**URL:** https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes

Pages: `00 · Foundations`, `01 · Native components`, and `02 · Wallet & Checkout screens`.

Four initial Figma screens: Wallet/Desktop 1440, Wallet/Mobile 390, Checkout/Desktop 1440, Checkout/Mobile 390. Four additional mobile interaction states: Wallet/Add income, Wallet/Recorded entry, Checkout/Payment, Checkout/Confirmation. Prototype navigation links connect the two main journeys.

## Running QA

The public [browser QA workflow](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml) runs Playwright tests and collects screenshots. Reviewer paths and verification constraints are listed in [SUBMISSION.md](./SUBMISSION.md). The case study separates design hypotheses from verified product behavior.

## Intentional limits

No real bank balances, payments, customer research, participant statistics, or production conversion metrics are claimed. The linked Figma file is not the same as a published Figma team library; check its share settings before providing it to external reviewers.

# Interface Craft · Internship reviewer guide

**Source repository:** https://github.com/harsh-sahdev/UX_Design_Internship  
**Design file:** https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes  
**Case study:** [10-slide presentation](./case-study/)

## Four tasks and entry points

| Task | Evidence | Review route |
| --- | --- | --- |
| **1. Fintech Mobile Wallet App Redesign** | Responsive wallet with a truthful zero balance, manually recorded income and expenses, edit/delete, privacy and CSV export. Includes native desktop and mobile Figma references and a sample interactive entry flow. | [Wallet](./wallet/) · [Figma mobile](<https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-240>) |
| **2. Design System & Component Library** | Native Figma collection with **24 variables**, text and colour styles, **7 component families / 29 variants**; matching code tokens and web documentation. | [Figma library](<https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-112>) · [Design system web demo](./design-system/) |
| **3. Interactive E-commerce Checkout** | Editable sample basket, shipping, discount, delivery validation, back/edit path, payment selection and demo confirmation. Native Figma delivery→review→confirmation flow. | [Checkout](./checkout/) · [Figma mobile](<https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-307>) |
| **4. End-to-end UX Case Study** | Responsive 10-slide deck covering the challenge, scope, user task hypotheses, information architecture, mobile direction, reusable components, interactions, QA evidence and next steps. | [Case study](./case-study/) · [Study notes](./case-study/README.md) |

## Practical reviewer route

1. Clone or download this public repository and run `python3 -m http.server 8000` from its root.
2. Open `http://localhost:8000/` and use the four portfolio cards.
3. **Wallet:** start at ₹0; record ₹500 income and ₹125.25 expense; edit, search, filter, delete and export; reload to check browser-local persistence.
4. **Design system:** open the linked Figma file, review the foundations page, inspect seven real component sets and switch between button/field/badge variants. Also review the matching [component showcase](./design-system/).
5. **Checkout:** adjust basket quantities, select shipping, apply `DEMO10`, validate a six-digit PIN, review payment and complete the simulated order.
6. **Case study:** use arrow keys to move through ten slides, or print the full presentation to PDF using the browser.

## Verification and evidence

Playwright tests run in [GitHub Actions](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml) with screenshots. Manual checks: [Wallet QA](./wallet/QA.md), [Checkout QA](./checkout/QA.md) and [Design System QA](./design-system/QA.md). A linked Figma design file exists, but **external link-access and team library publishing must be independently verified** before claiming either is public or published.

## Boundaries

These are interface exercises. The Wallet records locally entered entries and is not a linked bank, money-transfer service or auditable financial ledger. The Checkout does not charge money, store a real order or ship products. The case study documents design decisions and repeatable UI checks; it does not invent interviews, participant counts, conversion results or production telemetry.

The public GitHub repository is the primary code link. Additional live-demo and professional-profile fields in the portal are optional unless the portal itself imposes new requirements.

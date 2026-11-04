# UX Design Internship · Interface Craft

Four connected UI/UX deliverables built around thoughtful interaction, honest product states, and consistent reusable design.

[![Browser QA](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml/badge.svg)](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml)

## Four tasks

| Assignment | Deliverable | Review |
| --- | --- | --- |
| **Task 1 · Fintech Mobile Wallet App Redesign** | Local-first money journal, ₹0.00 empty state, income/outflow, peer-transfer recording, editing, filtering, privacy and export; native mobile/desktop Figma screens | [Open Wallet](./wallet/) · [View Figma wallet](<https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-240>) |
| **Task 2 · Design System & Component Library** | Native Figma design tokens, 24 variables, text/colour styles, 7 component families and 29 variants; matching web showcase | [View native Figma components](<https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-112>) · [Web showcase](./design-system/) |
| **Task 3 · Interactive E-commerce Checkout** | Editable sample basket, delivery selection, discount, validation, payment review and simulated confirmation; Figma click-through flow | [Open Checkout](./checkout/) · [View Figma checkout](<https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-307>) |
| **Task 4 · End-to-end UX Case Study** | Ten-slide responsive presentation: problem, hypothesis personas, journey map, low-fidelity wireframes, final UI, interaction decisions, QA and next steps | [Open case-study deck](./case-study/) |

### Figma source
[**Interface Craft: Design System & Prototypes**](https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes) contains native editable design layers, reusable component variants, four overview designs and four linked interaction-state frames. Figma file view permissions and team-library publishing status are separate from creating the content and must be checked in the share dialog.

### Review locally
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`. All demos are static and need no credentials. To run automated browser checks:

```bash
npm install
npx playwright install chromium
npm test
```

[GitHub Actions QA](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml) runs automated Playwright tests and exports screenshots. [Reviewer and submission guide](./SUBMISSION.md) · [Progress](./PROGRESS.md).

### Product boundaries
This is coursework rather than production banking or e-commerce. The Wallet begins with no invented records and saves manual data in localStorage; it does not connect to a bank or transfer money. The Checkout is a plainly labelled example order without an actual purchase or payment. Case-study hypotheses are not presented as real interviews, survey results or measurable conversion lifts.

### Source and handoff
[Wallet notes](./wallet/UX-NOTES.md) · [Checkout decisions](./checkout/DESIGN-DECISIONS.md) · [Tokens](./design-system/tokens.json) · [Native Figma builder source](./design-system/figma-plugin/) · [Case study notes](./case-study/README.md).

**Public source repository:** https://github.com/harsh-sahdev/UX_Design_Internship

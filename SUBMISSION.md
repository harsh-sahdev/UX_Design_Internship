# Internship submission guide

**Repository:** https://github.com/harsh-sahdev/UX_Design_Internship

**Repository visibility:** public.

## Tasks to select in the portal

- **Task 1: Fintech Mobile Wallet App Redesign.** Source: [wallet/](./wallet/). Interactive money journal with a zero-state, transaction actions, entry corrections, filters, local persistence and export.
- **Task 3: Interactive E-commerce Checkout Prototype.** Source: [checkout/](./checkout/). Two-step delivery/payment journey with editable sample basket, calculations, form validation, edit-address path and a sample success state.

There are **two selected tasks** (meeting the internship's minimum requirement). Task 2 assets are provided as additional work but the native Figma library is **not** complete, so **do not tick Task 2** until a viewable Figma file exists. Task 4 is not submitted.

## Reviewer route

1. On a computer with Python 3, clone/download the repository and run `python3 -m http.server 8000` from the root.
2. Visit `http://localhost:8000/` for links to the tasks.
3. In Wallet: add ₹500 as income, record ₹125.25 spending, edit/delete a record, search the activity and export CSV. Reload the browser to check persistence.
4. In Checkout: change the sample quantities, switch to express delivery, apply `DEMO10`, enter a valid six-digit PIN code, edit the address, choose a sample method and complete the demo order.
5. In Design System: inspect the [component showcase](./design-system/) and editable [SVG asset](./design-system/figma-component-board.svg).

## Automated test evidence

Workflow: [UI/UX portfolio browser QA](https://github.com/harsh-sahdev/UX_Design_Internship/actions/workflows/wallet-qa.yml).

It runs Playwright Chromium tests and uploads screenshots. The workflow badge in the root README reflects the most recent result. Manual accessibility/visual items should not be marked complete without checking them.

## Boundaries and authenticity

These projects are coursework interfaces, not production banking or e-commerce systems. There is no login, database, actual inventory, regulatory payment flow or fulfilment. Sample values are explicitly labelled. No user interviews, real customer testing or security certification is claimed.

**Portal form:** paste the public GitHub URL above and select only the tasks whose mandatory deliverables exist. LinkedIn and live-demo links are optional fields on the dashboard, not prerequisites.

## Additional Task 2 option

To include **Task 2 (Design System & Component Library in Figma)**, use the [one-run Figma builder](./design-system/figma-plugin/) to create actual native Figma components, variables and desktop/mobile frames in a new file. Share that file and add the link to this repository. The SVG/JSON assets or builder source **alone do not count as completing native Figma work**. Until the native file has been run and checked, select Tasks 1 and 3 only.

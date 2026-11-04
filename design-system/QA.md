# Task 2 · Design System QA

## Foundations

- [x] One primary colour and consistent text/surface palette defined in CSS and JSON.
- [x] Spacing scale 4/8/12/16/20/24/32 documented.
- [x] Radii 6/10/12 documented.
- [x] Typography scale and font family documented.
- [x] Reference board grouped by component family in editable SVG.

## Native Figma file (verified existence; external sharing still unverified)

- [x] Create a native editable Figma file and document its URL: [Interface Craft](https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes).
- [x] Create 24 native Figma variables and document the corresponding source tokens.
- [x] Create reusable native component families: 7 sets and 29 variants.
- [x] Create 1440px desktop and 390px mobile reference screens for Wallet and Checkout.
- [x] Define two prototype starting points for Wallet and Checkout flows.
- [ ] Confirm all intended component states (default, hover, focus, error and disabled) are represented and correctly configured.
- [ ] Inspect native components at 100% zoom and manually follow every prototype transition.
- [ ] Verify external viewer access using a signed-out/private browser: **Share → General access → Anyone with the link → Can view**.
- [ ] Verify team library publication separately, only if the Figma plan permits it.

**Evidence boundary:** The native document and the listed design inventory were inspected through the connected Figma file in earlier work. The public GitHub Actions workflow verifies the reproducible builder smoke harness and browser UI; it does **not** establish anonymous Figma access, team-library publication or completion of manual accessibility checks.

## Usability/accessibility

- [ ] Confirm body and supporting text meet intended contrast goals.
- [ ] Test error states with text feedback, not only red borders.
- [ ] Test keyboard focus visibility in web components.
- [ ] Ensure controls have at least a 44px target in high-priority actions.

**Notes:** Web, SVG/JSON and native Figma deliverables exist. Manual accessibility, external sharing and optional library publication checks remain open. The native builder and smoke harness live in `figma-plugin/` and `../tests/figma-builder-smoke.cjs`; they are supplementary evidence, not a substitute for external reviewer access.

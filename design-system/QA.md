# Task 2 · Design System QA

## Foundations

- [x] One primary colour and consistent text/surface palette defined in CSS and JSON.
- [x] Spacing scale 4/8/12/16/20/24/32 documented.
- [x] Radii 6/10/12 documented.
- [x] Typography scale and font family documented.
- [x] Reference board grouped by component family in editable SVG.

## Native Figma file (requires Figma account)

- [ ] Create the native Figma file and share its URL.
- [ ] Create Figma variables mapped to the supplied JSON.
- [ ] Use Auto Layout and reusable components, not independent visual copies.
- [ ] Create default, hover, focus, error and disabled variants.
- [ ] Create 1440px desktop and 390px mobile screen frames.
- [ ] Test prototype connections and inspect components at 100% zoom.

## Usability/accessibility

- [ ] Confirm body and supporting text meet intended contrast goals.
- [ ] Test error states with text feedback, not only red borders.
- [ ] Test keyboard focus visibility in web components.
- [ ] Ensure controls have at least a 44px target in high-priority actions.

**Notes:** Web and SVG/JSON assets are implemented. Native Figma-only checks remain open.

Native builder source and mock harness exist at `figma-plugin/` and `../tests/figma-builder-smoke.cjs`. This is not a substitute for inspecting the generated native Figma file. Do not tick the native-file checklist boxes without the actual file URL.

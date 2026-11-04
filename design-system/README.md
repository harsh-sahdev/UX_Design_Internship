# Task 2 · Native Figma Design System and Handoff

**Interface Craft** is a shared UI system for the Wallet and Checkout coursework. The native editable Figma document has already been created. The repository also contains the matching web reference and source tokens.

## Review the actual Figma file

[**Open Interface Craft · Design System & Prototypes in Figma**](https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes)

[**Jump to native components**](https://www.figma.com/design/fIEafLV381i2Fda5Vwbdsg/Interface-Craft---Design-System---Prototypes?node-id=18-112)

The Figma document contains three pages: foundations, native components, and Wallet/Checkout screens. It includes **24 native variables**, text and colour styles, **7 component families with 29 variants**, four overview screens (mobile/desktop Wallet and Checkout) and four mobile interaction-state screens. Two prototype starting points cover Wallet recording and Checkout.

**Sharing caveat:** A file existing in the connected Figma account does not prove that anonymous reviewers can view it. Check **Share → General access → Anyone with the link → Can view** in the Figma UI before submitting to external reviewers. Native components are not automatically a published team library; publishing is a separate Figma operation and may depend on plan permissions.

## Repository source and references

- [Component board (SVG)](./figma-component-board.svg): editable reference artwork.
- [Design tokens (JSON)](./tokens.json): portable colour, spacing, radius and typography tokens.
- [Web component showcase](./index.html): working browser examples.
- [Figma handoff specification](./figma-handoff.md): component inventory and design rules.
- [Figma builder source](./figma-plugin/): reproducible builder for a new document; **not needed** to view the existing native file.
- [QA checklist](./QA.md): accessibility, state and component acceptance criteria.

## Reviewer checklist

1. Open the native Figma link and verify it works in a signed-out or private browser window.
2. Inspect native variable collections, styles and component variants rather than treating imported SVGs as the library.
3. Inspect Wallet and Checkout mobile/desktop frames and run both prototype flows.
4. Compare the native components with the [web showcase](./index.html) and [tokens](./tokens.json).
5. Use [SUBMISSION.md](../SUBMISSION.md) for the four-task reviewer route.

## Product and publishing boundaries

These are coursework UI prototypes, not production financial or payment systems. The source SVG and token JSON are supporting assets, not substitutes for the existing native Figma file. The Figma link must be externally accessible before it is submitted, and a **published team library** should only be claimed after Figma explicitly confirms publication.

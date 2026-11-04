# Task 2 · Design System and Figma Handoff

**Interface Craft** uses one consistent system across the Wallet and Checkout exercises. This directory contains editable assets and reference screens that can be used to build a native Figma component library.

## Deliverables available now

- [Component board (SVG)](./figma-component-board.svg): 1600 × 1360 px, editable vector layers grouped into colour, type, button, form, status, wallet and checkout reference sections.
- [Design tokens (JSON)](./tokens.json): portable colour, spacing, radius and typography values using `$type` / `$value` notation.
- [Live component reference](./index.html): browser-rendered buttons, inputs, progress, cards and modal states.
- [Figma handoff specification](./figma-handoff.md): pages, component inventory, variants and implementation guidance.
- [QA checklist](./QA.md): components, accessibility states and Figma-specific acceptance.

## Fast route: build native Figma library automatically

A [ready-to-run local Figma builder](./figma-plugin/) now creates the Figma pages, styles, variables, native component sets/variants, and editable Wallet/Checkout frames. Download and import its manifest from Figma Desktop, then run it inside a new empty file. The following manual route remains useful if the plugin cannot be imported.

## Build the native Figma library

1. Create a Figma design file named **Interface Craft · Design System**.
2. Import `figma-component-board.svg` onto a page called **00 · Overview**. Figma can import the vector elements as editable shapes (font matching may affect text).
3. Use `tokens.json` to create or map colours, spacing, radius and type variables.
4. Construct individual **Auto Layout** components from the board: Button (type/state variants), Input (default/focus/error/disabled), Badge, Transaction Row, Navigation, Checkout Step and Dialog.
5. Add mobile/desktop frames for Wallet and Checkout and wire basic prototype links.
6. Publish the file and add its public/viewable link to the repository's README.

**Important:** These SVG and JSON sources do not themselves constitute a native `.fig` file or published Figma component library. A Figma account and file are needed for that deliverable. Do not tick Task 2 as completed on the internship form until the native file is created and linked.

## Technical source of truth

The running interfaces use `tokens.css` and `../assets/brand.css`. Whenever values change in Figma, update both the JSON tokens and corresponding CSS to keep handoff consistent.

# Interface Craft — native Figma Design builder

The existing `../figma-component-board.svg` and `../tokens.json` are editable **source assets**, but SVG alone is not a complete Figma design-system task. This local development plugin creates native layers in a real Figma Design document.

## What it builds

- **3 Figma pages**: `00 · Foundations`, `01 · Native components`, and `02 · Wallet & Checkout screens`. Fits Figma Starter's three-page limit.
- **1 Figma variable collection** with 14 colour variables, 7 spacing variables and 3 corner-radius variables. A single Light mode is used so free accounts can run it. Matching palette fills are bound to the created colour variables when supported.
- **Text and colour styles** matching the repository's actual CSS tokens.
- **7 native component sets**, with variants: Button (12), Text field (4), Status badge (4), Transaction row (2), Checkout step (3), Navigation item (2), Balance card (2).
- **4 editable design frames**: Wallet desktop + mobile, Checkout desktop + mobile. The screens contain named Figma shapes and text, plus native button instances.

**Not just an image:** Figma components, styles, variables and frames are constructed using the official Figma Plugin API.

## Install and run

1. Download the repository as ZIP and extract it. (Or clone it.)
2. Install/open **Figma Desktop** on Windows or macOS, then create a **new empty Figma Design file**, named `Interface Craft · Design System`. Do not run on an existing project.
3. In Figma: **Plugins → Development → Import plugin from manifest**, then choose this folder's `manifest.json`.
4. Run **Interface Craft — Design System Builder** from Plugins → Development. It creates the pages automatically.
5. Inspect the components/variants and desktop/mobile screens. Save the file and use **Share → Anyone with the link can view** (or a suitable share setting allowed by your account).
6. Add the actual Figma file URL under **Task 2** in `../../README.md` and `../../SUBMISSION.md`, and add screenshots of the native component set/pages if required.

If Figma rejects the `manifest.json` ID, use **Plugins → Development → New plugin…** to generate a valid local manifest ID, then use `code.js` from this directory as the generated plugin's main file. Do not publish this tool to the Figma Community.

The plugin requires **Inter** or **Roboto** fonts to be available. It does not use the network, read private Figma files, or alter an existing non-empty document. Running twice on the same file intentionally stops rather than duplicating pages.

## Validation and limitations

- The code can be syntax-checked with `node --check code.js`.
- Actual native Figma API execution and visual QA must occur inside your Figma Desktop account, not GitHub Actions.
- The generated screens are design references and component instances; they are not the live wallet app or e-commerce website.
- Only mark **Task 2 completed** after the plugin has actually created the Figma file, the components/frames have been reviewed and the share URL is recorded in the public repository.

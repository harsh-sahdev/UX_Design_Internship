# Figma handoff: Interface Craft

This document is a **Figma-ready specification**, not an exported or native Figma file. The interactive examples and source tokens live alongside it in this repository.

## File structure to recreate in Figma

Suggested pages:

1. `00 · Cover and principles`
2. `01 · Foundations` (color, typography, spacing, radii)
3. `02 · Components` (buttons, fields, navigation, cards, badges)
4. `03 · Wallet screens` (dashboard, send-money overlay, validation)
5. `04 · Checkout screens` (delivery, payment, confirmation)

Use 1440 × 900 desktop frames and 390 × 844 mobile frames. The layouts are responsive references, not rigid pixel specifications.

## Variables

| Figma variable | Hex | Intended use |
| --- | --- | --- |
| `color/primary` | `#205B50` | Primary actions and active states |
| `color/primary-soft` | `#EAF3EF` | Subtle selected backgrounds |
| `color/text` | `#172B31` | Titles and body |
| `color/muted` | `#61717A` | Supporting labels |
| `color/canvas` | `#F6F8F8` | Main background |
| `color/surface` | `#FFFFFF` | Cards and controls |
| `color/border` | `#DFE6E6` | Dividers and outlines |
| `color/success` | `#277052` | Positive money movement |
| `color/error` | `#A73542` | Validation feedback |

Spacing tokens: `space/1=4`, `space/2=8`, `space/3=12`, `space/4=16`, `space/5=20`, `space/6=24`, `space/8=32` (px).

Radii: `radius/control=6`, `radius/card=10`, `radius/hero=12` (px).

Typography: system sans-serif, regular 400, semibold 600, bold 750. Use 14px body, 12px labels, 20px section heading, and 36px display as a starting point.

## Component inventory

| Component | Properties / variants | Notes |
| --- | --- | --- |
| Button | Type: Primary / Secondary / Danger; State: Default / Hover / Focus / Disabled | Minimum 43px tall |
| Text field | State: Default / Focus / Error / Disabled | Persistent label + descriptive error |
| Transaction row | Direction: In / Out | Name, description, date, signed amount |
| Status badge | Type: Neutral / Success / Warning | Include visible text, not only color |
| Wallet card | Balance: Visible / Hidden | Privacy toggle should hide amounts |
| Dialog | Type: Money in / Money out / Edit | Close, cancel, submit, validation |
| Checkout step | State: Pending / Current / Complete | Text + semantic step number |

## Design quality checklist

- Build Auto Layout, not manually distributed spacer shapes.
- Use components and variants for states, not duplicated unlinked layers.
- Keep at least 16px horizontal padding on a 390px mobile frame.
- Verify labels remain readable and focus indication is unambiguous.
- Error flows must be designed, not just the successful state.
- Annotate which values are simulated. No real bank or payment integration exists.
- Export screenshots only after reviewing at 100% zoom and testing mobile widths.

## Handoff to implementation

The canonical implementation values are in [tokens.css](./tokens.css). Live examples appear in [the component showcase](./index.html). Differences discovered during implementation should be reconciled before final presentation.

## Brand consistency

Interface Craft is the umbrella identity. Wallet, Checkout, and Design System are sections, not independent companies. Wordmark rules are in `../assets/brand.css`.

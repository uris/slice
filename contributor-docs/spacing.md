# Spacing Standard

## Purpose
This document defines how components use the theme spacing grid for padding and related insets. It records the approved spacing decisions (originally drafted in `docs/spacing-tbd.md`) as a standing standard.

This standard applies to:

- new components
- updates to existing components
- padding-related prop changes during refactors
- Storybook defaults and component docs (`.mdx`)

Use the spacing tokens (`var(--spacing-*)`) in CSS and style objects. Do not introduce raw pixel values for padding.

## The grid
Use the existing grid: `xxs=2`, `xs=4`, `s=8`, `m=16`, `l=24`, `xl=32`, `xxl=64`, `h=128`.

## Rules

- **Standard fields** use 8px vertical / 16px horizontal padding. **Buttons** keep their size-specific 16px or 24px horizontal baseline.
- **Compact components** may use 2px/4px base padding. This is reserved for intentionally compact components (file chips, tooltips) and mechanical insets (a switch track).
- **Optical compensation for icons.** Reduce an icon-bearing edge by 4px for standard controls and 2px for compact controls. Express the reduction with a token-based `calc()`, for example `calc(var(--spacing-m) - var(--spacing-xs))`. Never add a new 12px/20px spacing token. Do not reduce an edge whose outermost content is text or a labeled button.
- **Overrides are exact.** Optical compensation applies to built-in defaults only. Explicit padding props must be applied exactly, including zero, must accept the component's supported types (numbers become px; strings such as `var()`, `calc()` and 1-4 value shorthands pass through), and must not silently subtract more space. Resolve values with `setStyle`; do not parse CSS expressions in JavaScript.
- **Stable spacing.** Keep spacing stable when a reserved icon slot temporarily becomes empty (for example the clear icon on an empty field), so content does not move on focus or typing.
- **Geometry is exempt.** Geometry-derived spacing (slider head padding, border-width insets, avatar overlap, switch knob size) does not snap to the grid.

## Component reference

| Component | Standard |
| --- | --- |
| DropDown | 8px top/bottom, 16px left, 12px right (16px - 4px, chevron on the right). Underline mode still removes top and side padding. |
| RadioButton | Framed: 8px vertical, 16px horizontal, with 12px left only when the radio icon is present. `hideRadio` uses 16px on both sides. `noFrame` padding is zero. |
| TextField | 8px vertical / 16px horizontal. Left edge 12px only when the left icon is the outermost content (a visible label before it keeps 16px). Right edge 12px when the outermost trailing element is an icon control or its reserved slot, otherwise 16px. Explicit `padding` is applied as given; no automatic side overrides. |
| Toast | 8px vertical / 16px horizontal, with the token-based 4px reduction on the close-icon side. |
| Tip | 4px vertical / 8px horizontal (`--spacing-xs` / `--spacing-s`). A compact exception. |
| Switch | 44x22px track, 2px inset (`--spacing-xxs`). Knob size is derived from the track height minus twice the resolved inset (18px by default). |
| UploadArea file rows | 8px top/bottom, 16px at text edges, 12px at icon edges (leading file icon: 12px left; 12px right when a remove icon is rendered, otherwise 16px). The outer 32px upload padding is unchanged. |
| Button | Regular horizontal baselines 24px (medium/large) and 16px (small), 4px less on icon edges. Round buttons have zero side padding. Text buttons use 4px side padding without an icon and zero on an icon edge, at every size. Vertical text-button padding is zero. |
| Chip | 8px vertical / 16px horizontal, 4px icon-side reduction for defaults. Keep the `paddingTop`/`paddingTops` alias and its precedence. Explicit `paddingSides` is exact. |
| FileList (compact) | 4px base padding, 2px leading inset for the file icon (4px - 2px). Same 2px inset on the trailing edge when a remove icon is present, otherwise 4px. |
| TextArea | 16px content inset on all sides (16px wrapper padding, zero textarea padding). Scrollbar clearance is a separate layout concern. |
| PromptInput | Content padding follows the grid. Border inset is derived from border width and stays as is. The unused `.clear` rule was removed. |

## Deliberate exceptions

- **Slider:** keeps `ceil(trackHeadSize / 2)` padding so the head stays within the track. No token replacement.
- **PromptInput border inset:** derived from border width because it exposes the decorative border. Changing it to a token would change the border's apparent thickness.
- **AvatarGroup overlap and RadioButtonList custom margin:** caller-supplied values are used exactly, including zero. They are geometry or explicit overrides, not built-in defaults.
- **Typography margins** (`src/theme/type/type.css`): heading margins (`1.5em 0 0.6em 0`) and paragraph bottom margin (`1.5em`) stay font-relative so they scale with text size. If a global fixed grid is wanted later, review h1-h6 individually and check long-form content and margin collapsing first.

## Checks when changing spacing

- Compare default and compact sizes with icons present, absent, hidden, and reserved-but-empty.
- Confirm explicit zero, numeric padding, and supported CSS strings stay valid.
- Exercise custom spacing tokens to confirm dependent icon reductions and switch geometry respond together.
- Check dropdown truncation, wrapped toast text, upload removal states, textarea scrollbars, and small text-button clickable areas.
- Update the component `.mdx` docs and tests alongside the change.

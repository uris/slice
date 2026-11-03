# Component review batch 01

Five website documents are ready for individual review: ButtonBar, CheckBox, Chip,
Dot, and Switch. These pages describe the current implementation, including its
limitations. The original writing pass left APIs and implementation unchanged;
completed component updates are recorded below.

Review in the order below. After each component is agreed, update its implementation,
consumers, website reference, existing MDX, and meaningful regression tests together.
Do not carry legacy prop names forward as compatibility aliases when normalizing.

## ButtonBar — completed

Route: `/docs/react/button-bar/`. Source:
[ButtonBar](../../../../../packages/slice/src/components/ButtonBar/ButtonBar.tsx),
[types](../../../../../packages/slice/src/components/ButtonBar/_types.ts).

- Removed unused item `label` and `labelColor` styling.
- Removed `frameSize`; `buttonSize` now accepts a preset or a positive finite pixel
  diameter. Removed `borderSize` in favor of `borderWidth`.
- Renamed `backgroundColorActive` to `backgroundColorSelected` without an alias.
- Selected and hovered items have circular highlights, inside a separately styled
  bar. Uniform padding defaults to 4px and is configurable through padding;
  buttonGap defaults to -2px and allows negative
  overlap. selectionRadius defaults to 50% and accepts pixel or CSS radii. Borders
  apply only to the outside edge.
- Independent actions are the default (`toggle=false`), with no initial selection.
  The website and main story show Previous/Next only.
- With toggle enabled, selection is controlled when `selectedIndex` is supplied, including `null` for no
  selection. `defaultSelectedIndex` initializes local selection once. Repeat activation
  emits `onClick` without another `onChange`; independent action mode has no pressed state.
- Native buttons expose `aria-pressed` in selection mode, use `tip` for accessible
  names, hide decorative icons, and show a focus ring. The root is a named group;
  Tab visits its buttons rather than introducing a toolbar arrow-key contract.
- Tooltips support keyboard focus and hover; focus requests include the button ref
  without a mouse event. Application tooltip rendering remains external.
- Updated website docs, MDX, stories, type checks, and benchmark fixtures together.

Optional follow-ups: stable item IDs for reorder identity, per-item disabled
support, and an identity-based selection API if dynamic item reordering is needed.
These were not necessary for the agreed index-based selection contract.

## CheckBox — completed

Route: `/docs/react/check-box/`. Source:
[CheckBox](../../../../../packages/slice/src/components/CheckBox/CheckBox.tsx),
[types](../../../../../packages/slice/src/components/CheckBox/_types.ts).

- Added label, which replaces children as visible content and supplies the default
  accessible name. Rich children are associated through their rendered content,
  rather than stringified; explicit ARIA naming remains supported.
- Added iconChecked, iconUnChecked, iconPartial, iconColor, iconColorSelected,
  iconSize, gap, textColor, and textSize. align controls top/middle/bottom alignment
  for multiline labels (middle by default). textTopOffset adds signed manual text
  adjustment, with top padding for positive values and bottom padding for negatives. Removed size and color instead of maintaining aliases. Kept existing
  icon names, state color tokens, 20px icons, 6px gaps, and medium text defaults.
- Fixed the malformed unchecked icon color fallback.
- Replaced the unused Motion root with a plain div. Inherited events now have
  native div signatures, and docs no longer list Motion animation or drag events.
- Native onClick/onKeyDown compose with toggling; preventDefault cancels it.
  Disabled state still prevents changes. Icons are decorative without extra tab stops,
  and keyboard focus has a visible inset indicator.
- Text can size naturally without the former fixed-height clipping. Text color
  transitions use the valid Water easing token and respect reduced motion.
- Updated website docs, preview, snippets, MDX, Storybook controls, and regressions.

The existing local-state/checked synchronization contract remains unchanged. Native
form participation would require a separate input-based design decision; the docs
state that this div-based control does not submit a native form value.

## Chip — completed

Route: `/docs/react/chip/`. Source:
[Chip](../../../../../packages/slice/src/components/Chip/Chip.tsx),
[types](../../../../../packages/slice/src/components/Chip/_types.ts).

- Normalized primary text props to textColor, textColorHover, and textSize.
  Removed borderSize, paddingTops, paddingSides, and the unused focused prop.
- Added uniform padding and four independent side props. Each side overrides the
  uniform value; unspecified values retain the compact/regular and icon-side defaults.
- Label takes precedence over children, including an empty label. Numeric children
  such as 0 render correctly. Icon containers now have explicit dimensions.
- An onClick handler creates the main native button; without it, content is static. Native buttons have
  type=button by default, native keyboard activation, disabled behavior, and an inset
  focus indicator. Native attributes/events are typed by the presence of onClick; no keyboard event
  is cast to a mouse event.
- Mouse/focus handlers compose with tooltip requests. Tooltips include a root ref
  and support focus/blur as well as hover/leave. Decorative icons add no tab stops.
- CSS controls hover/focus colors, removing hover-driven React rerenders. Water
  transitions target color, background-color, and border-color; reduced motion disables them.
- Updated website docs, MDX, snippets, previews, Storybook controls, spacing fixtures,
  type checks, and meaningful regressions together.

Selected state is controlled by the parent and exposes aria-pressed on the main
action. Selection colors have explicit overrides. onRemove adds a separate sibling
button; the parent owns actual removal. variant was removed. Motion layout resizing
is enabled when selected is supplied, with a configurable Water transition and
reduced-motion support. Inner content uses position layout to avoid stretching text.

## Dot — `/docs/react/dot/`

Source: [Dot](../../../../../packages/slice/src/components/Dot/Dot.tsx),
[styles](../../../../../packages/slice/src/components/Dot/Dot.module.css),
[types](../../../../../packages/slice/src/components/Dot/_types.ts).

- **Confirmed border bug:** `--dot-border` contains `3px solid`, but CSS appends
  another `solid`, making the shorthand invalid. Browser inspection shows a
  configured `3px solid` with computed border width `0px` and style `none`.
  Fix this before promising total dimensions that include a border.
- **Normalize:** `border` is a width and should be `borderWidth`; `color` represents
  the dot fill and is a candidate for `backgroundColor`. Add `borderColor` if users
  need to match different parent surfaces.
- **Motion updated:** removed the unused `motion` prop. `motionValues` remains
  the component-managed variants configuration, following the public naming
  standard. Incidental Motion callbacks are not documented as Dot features.
- **Accessible status:** the default label always says “Blue dot indicating active
  or new”, even for red, green, or explicit colors. Decide whether status should
  require a meaningful label or be decorative by default. Avoid redundant live
  regions when dots appear in groups or inside other status components.
- **Reduced motion implemented:** visibility changes immediately, bypassing custom
  animation delays and repeats; live preference changes are observed. The normal
  AnimatePresence path suppresses entrance animation on initial mount.

## Switch — completed

Route: `/docs/react/switch/`. Source:
[Switch](../../../../../packages/slice/src/components/Switch/Switch.tsx),
[styles](../../../../../packages/slice/src/components/Switch/Switch.module.css),
[types](../../../../../packages/slice/src/components/Switch/_types.ts).

- Replaced `state` with controlled `checked` and initial-only `defaultChecked`.
- Removed `fieldName`; use native `aria-label` or `aria-labelledby`.
- Root is a native button with switch semantics, an inset focus indicator, and a
  disabled appearance that preserves the on/off state. No form input is submitted.
- Native `onClick` composes with toggling; preventDefault cancels it. `onChange`
  reports user changes with typed value metadata. External prop updates do not emit it.
- Corrected generic native attribute omission and excluded unsupported children and
  dangerouslySetInnerHTML. Removed the Motion root and its any cast.
- One transition prop controls knob movement and knob/track color changes, merged
  with theme Water defaults; reduced motion disables both and responds to live preference changes.
- Added `knobWidth` for pill and rectangular knobs, independent `knobRadius` and
  outer `borderRadius`, with shape controls and examples in Storybook. Knob width
  is clamped to the available track space.
- Invalid dimensions fall back safely, width is at least height, padding is clamped
  to retain a positive knob, and flex shrinking is disabled. Theme spacing still
  controls omitted padding, including CSS token overrides.
- Updated website examples, useActiveTab preview, Storybook controls, MDX, and
  interaction/geometry/type regression tests together.

## Validation of the documentation batch

- All public component props and custom callbacks have definitions.
- Props are alphabetized within their sections, inherited attributes last; Motion
  definitions are grouped separately where appropriate.
- H1/H2/Definition anchors match navigation order; H3s are untracked. Dot’s Motion
  heading retains its `motion-section` anchor.
- All 16 snippet strings parse and all five published story IDs are verified.
- Existing browser regression tests: 21 passed across the five components.
- Website typecheck and production build pass. All five routes and preview
  interactions were checked in a browser without page errors.

Passing existing tests does not resolve the issues above; the individual component
updates should add coverage for the agreed behavior and regressions.

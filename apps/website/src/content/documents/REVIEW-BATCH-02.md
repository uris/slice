# Component review batch 02

The writing pass covers IconButton, ToggleButton, RadioButton, RadioButtonList,
and TabBar. Website pages describe the current API, including known limitations.
Implementation behavior and public names have not changed in this pass.

Review in dependency order below. Once each change is agreed, update the component,
consumers, website reference, MDX, stories, and meaningful regression tests together.
Use the [prop naming standard](../../../../../packages/slice/docs/style-prop-naming.md)
and [documentation guide](README.md). Remove superseded props rather than adding aliases.

## IconButton — completed

Route: `/docs/react/icon-button/`. Sources:
[implementation](../../../../../packages/slice/src/components/IconButton/IconButton.tsx),
[types](../../../../../packages/slice/src/components/IconButton/_types.ts),
[styles](../../../../../packages/slice/src/components/IconButton/IconButton.module.css).

- Removed visible label and inherited children. actionName supplies the internal
  aria-label, with “Action” as the fallback for missing or blank names. Direct aria-label
  and aria-labelledby props are excluded; counts, dots, and icons are decorative.
- buttonSize accepts s/m/l/xl or positive finite pixels; removed frameSize.
  borderWidth/borderColor/borderRadius replace border/round, including zero radius.
- Removed color/colorOn and numeric fillColor. iconColorSelected and
  backgroundColorSelected replace On names; selected colors take priority over hover.
  hover=false disables both background and icon hover colors.
- toggle uses controlled selected or initial defaultSelected and emits onChange(boolean).
  Native aria-pressed follows state. Ordinary actions have no pressed state or selection event.
- onClick runs first and preventDefault cancels selection. Native mouse/focus handlers
  compose with internal behavior; tooltips support hover and focus and are dismissed
  on activation, disable, loss of both hover/focus, tooltip changes, or unmount.
- Native button has one tab stop and visible focus. Decorative icons cannot receive Tab focus.
- motionValues supplies selected/unselected inner-icon targets. A single transition,
  merged with Water, drives icon transforms and background/icon colors. Removed outer
  animation props and preset/custom props from IconButton. Reduced motion settles
  keyframes immediately and cancels active delays/repeats while preserving button focus.
- Migrated internal consumers, benchmark fixtures, docs canvas, stories, website/MDX
  references, and examples. IconButton and ToggleButton share an internal native-button implementation for
  selection, naming, tooltip handling, and reduced-motion-safe animation.

## ToggleButton — completed

Route: `/docs/react/toggle-button/`. Sources:
[implementation](../../../../../packages/slice/src/components/ToggleButton/ToggleButton.tsx),
[types](../../../../../packages/slice/src/components/ToggleButton/_types.ts).

- Icon and text are one native button with one Tab stop, aria-pressed, visible focus,
  and complete disabled behavior. actionName overrides the visible string/numeric
  name; unnamed controls fall back to Action. Direct naming attributes are excluded.
- selected/onChange controls selection; defaultSelected initializes local state once.
  onClick runs first and preventDefault cancels selection. deselect replaces unselect.
  Removed the redundant onSelect callback; use onChange's boolean for selection-only work.
- Removed frameSize/iconTwo, normalized fill to iconFill, iconOn to iconSelected,
  On colors to Selected, and border to borderWidth/borderColor/borderRadius.
  buttonSize accepts presets or a positive finite minimum frame size.
- Added native button attributes/events, text state colors, hover control, normalized
  padding and sides, and optical icon padding. Explicit padding remains authoritative.
  label now takes priority over children; numeric children including zero render correctly.
- motionValues and transition replace preset/custom animation APIs. One Water-based
  transition drives icon animation and background/icon/text colors. Reduced motion
  cancels custom delays/repeats and retains keyboard focus on live changes.
- labelOutside optionally limits the background, border, and radius to the icon frame;
  the label remains part of the same button. Its selected text keeps textColor by default.
  The disabled website preview starts unselected.
- Shared internal behavior with IconButton rather than nesting buttons. Removed obsolete
  animation helper types, enums, exports, and tests after migrating their final consumer.
- Updated website docs, MDX, demos, video playback consumers, and meaningful regression tests.

## RadioButton — completed

Route: `/docs/react/radio-button/`. Sources:
[implementation](../../../../../packages/slice/src/components/RadioButton/RadioButton.tsx),
[types](../../../../../packages/slice/src/components/RadioButton/_types.ts),
[styles](../../../../../packages/slice/src/components/RadioButton/RadioButton.module.css).

- Native radio input replaces the button/role combination. Same-name controls gain
  exclusive selection, native arrow navigation, form submission, required validation,
  and uncontrolled form reset. Repeated activation keeps a radio checked.
- checked/defaultChecked replace hybrid selected state. Native onClick composes with
  onChange, and preventDefault cancels selection. Generic option metadata is retained;
  formValue explicitly serializes nonprimitive values for native forms.
- Styling follows CheckBox: iconChecked/iconUnChecked, iconColorSelected, iconSize,
  gap, textColor/textSize, align, and signed textTopOffset. label takes priority over
  children, including numeric content. actionName handles alternate naming.
- Removed checkbox mode and deselection, layout-only list/wrap, hideRadio, and noFrame.
  iconSize=0 hides the icon; border/padding/background props express framed appearance.
- Complete disabled styling, visible focus, decorative icons without extra tab stops,
  Water color transitions, and CSS reduced-motion support.
- RadioButtonList now uses native radios exclusively. Its separate cleanup removes
  multiple selection and the old array/deselection APIs; see its completed entry below.
- Updated docs, MDX, examples, consumers, stories, and meaningful regression tests.

## RadioButtonList — completed

Route: `/docs/react/radio-button-list/`. Sources:
[implementation](../../../../../packages/slice/src/components/RadioButtonList/RadioButtonList.tsx),
[types](../../../../../packages/slice/src/components/RadioButtonList/_types.ts).

- Composition is the primary API: RadioButton children can live inside wrappers or
  custom components. The options array is shorthand over the same context, not a
  separate renderer. Group state/name/disabled behavior is authoritative; child styles
  override inherited defaults.
- Strictly single selection with native radios. Removed multiSelect/deselect and
  checkbox rendering. Multiple choices belong in CheckBox controls.
- value/defaultValue own one selection; onChange(value, option) reports its identity
  and metadata. Removed the index and array APIs. Selection follows values when
  choices reorder; unique primitive values are recommended. Controlled state is authoritative.
- Normalized icon props to match RadioButton/CheckBox; iconSize=0 hides the icon.
  Removed unused toggleIcon and positive tabIndexSeed. Native grouping owns keyboard focus.
- Explicit direction/wrap separates layout from frames. Removed noFrame and spacer/custom;
  use border, padding, background, and marginBottom. Added itemGap and the same flattened
  text/alignment styles as RadioButton.
- disabled blocks the group. name supports native form fields; omitted group names are
  unique. Object values remain metadata and need application serialization. Uncontrolled groups reset to initial defaultValue. Controlled forms reset application state.
- Updated website/MDX references, previews, consumers, benchmarks, and hidden test stories.

## TabBar — completed

Sources: [implementation](../../../../../packages/slice/src/components/TabBar/TabBar.tsx),
[types](../../../../../packages/slice/src/components/TabBar/_types.ts),
[styles](../../../../../packages/slice/src/components/TabBar/TabBar.module.css).

- Tab and TabBar have separate source folders, entrypoints, stories, website slugs,
  and MDX references. The private shared context keeps selection and layout coordinated.
- Composed Tab children are primary; options is a shorthand using the same context.
  Selection uses typed value/defaultValue and one onChange(value, option). Legacy
  selected/selectedValue/onTabChange and name fields are removed.
- Context values are memoized. Stable values preserve selection on reorder; an
  unmatched or removed value leaves no selection. Empty groups render no placeholders.
- Native disabled tabs and close controls block interaction; keyboard navigation
  skips disabled choices. Tab id/panelId connect application-rendered panels,
  decorative icons are hidden, and close sits outside the tablist.
- Focus-ring styling is deliberately unchanged at the user's request.
- Dimension formatting uses setStyle once; closeWidth and icon sizing are applied.
  Local flex styles replace composed layout overrides and !important rules.
- A shared measured underline slides and resizes using Slice's Water transition.
  The transition prop overrides its timing; duration: 0 snaps into place. ResizeObserver
  keeps the destination aligned as tabs or their container resize. Live reduced-motion
  preferences stop movement immediately; CSS color transitions also respect them.
- The incomplete custom memo comparator is removed. Stories cover composition,
  controlled state, keyboard selection, disabled choices, SSR, panel metadata, resizing,
  animation, snap timing, and live reduced-motion changes. Website and MDX docs use
  the current API; benchmark consumers are migrated.

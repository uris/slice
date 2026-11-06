# Style Prop Naming Standard

## Purpose
This document defines the required public prop naming standard for component style props in this codebase.

This standard applies to:

- new components
- updates to existing components
- prop renames during refactors
- examples and documentation

All component APIs and docs must follow this naming pattern.

## Core names
Use these prop names for general visual styling:

- `backgroundColor`
- `textColor`
- `borderColor`
- `borderWidth`
- `borderRadius`
- `borderStyle`
- `padding`
- `paddingTop`
- `paddingRight`
- `paddingBottom`
- `paddingLeft`
- `gap`
- `width`
- `height`
- `minWidth`
- `minHeight`
- `maxWidth`
- `maxHeight`

Do not introduce:

- `bgColor`
- `borderSize`
- `paddingTops`
- generic `color` for main text
- generic `radius` when the prop is border radius

## Shared size types

Use the exported types in `src/components/sharedTypes.ts` for matching size APIs:

- `ComponentSize`: `xs | s | m | l | xl | auto`.
- `FixedSize`: excludes `auto`, for typography and other fixed tiers.
- `ButtonSize`: excludes `xs` and also accepts numeric pixel sizes.

Components must support `auto` explicitly in their layout implementation. Fixed-frame
controls such as IconButton and ButtonBar use `Exclude<ButtonSize, 'auto'>`.
ToggleButton accepts `ButtonSize`: explicit `auto` removes the minimum frame size,
while an omitted size retains `m`, including when children are supplied.
The existing FlexDiv `Size` enum describes layout dimensions and is separate.

Shared button padding props use `PaddingProps` and `ButtonStyleProps`. Button size
values and padding defaults are defined once in `buttonStyleDefaults` in the same
shared file. ToggleButton children use 6px top and bottom padding; horizontal
padding retains the standard text/icon calculations.

## State suffixes
When a style changes by state, keep the base prop name and append a state suffix.

Allowed suffixes:

- `Hover`
- `Active`
- `Focused`
- `Blurred`
- `Disabled`
- `Selected`
- `Error`
- `Placeholder`
- `On`
- `Off`

Examples:

- `backgroundColorHover`
- `backgroundColorActive`
- `backgroundColorFocused`
- `backgroundColorDisabled`
- `backgroundColorSelected`
- `backgroundColorError`
- `backgroundColorOn`
- `backgroundColorOff`
- `borderColorHover`
- `borderColorFocused`
- `borderColorError`
- `textColorHover`
- `textColorDisabled`
- `textColorError`
- `textColorPlaceholder`

Do not introduce:

- `bgColorHover`
- `bgColorActive`
- `bgColorDisabled`
- `bgColorOn`
- `bgColorOff`

## Text and typography props
For text and text-adjacent sizing props, use this token set:

`'xs' | 's' | 'm' | 'l' | 'xl'`

Use:

- `textSize`
- `labelSize`
- `helperTextSize`
- `errorTextSize`

When a component has more than one independent typography-size prop for different
sub-elements (for example a title and a body), name each one `<qualifier>TextSize` —
qualifier first, matching `helperTextSize`/`errorTextSize`. Example: a modal's title and
content sizes are `titleTextSize` and `contentTextSize`, not `textSizeTitle` /
`textSizeContent`.

Do not introduce:

- `'small' | 'medium' | 'large'`
- `'sm' | 'md' | 'lg'`
- mixed text size sets that omit `xs` or `xl`
- a bare `size` prop for what is actually a typography size (use `textSize`, or a
  qualified `<qualifier>TextSize`, instead)

If a size prop controls typography, it must use `xs | s | m | l | xl`.

## Content-specific color props
Use specialized color names only when the prop styles a distinct non-primary element.

Allowed:

- `iconColor`
- `iconColorHover`
- `iconColorSelected`
- `labelColor`
- `fillColor`
- `strokeColor`

Rules:

- use `textColor` for the primary rendered text content
- use `iconColor` for icons
- use `fillColor` and `strokeColor` for SVG-specific styling
- use `labelColor` only when a distinct label sub-element exists

Do not use `color` for the main text of a component.

Pager intentionally retains `color`, `colorHover`, and `colorOn` for its dot colors.
This is an agreed component-specific exception; preserve these names when updating it.

## Spacing props
Use:

- `padding`
- `paddingTop`
- `paddingRight`
- `paddingBottom`
- `paddingLeft`
- `gap`

Axis-based spacing is allowed only when the component already uses axis-style spacing consistently:

- `paddingX`
- `paddingY`

Do not introduce:

- `paddingTops`
- `paddingSides`

## Border props
Use:

- `borderWidth`
- `borderColor`
- `borderRadius`
- `borderStyle`

Do not introduce:

- `borderSize`
- `radius` for border radius

## Flattened prop rule
Public style props must be flattened.

Use:

```
backgroundColor
backgroundColorFocused
borderColor
borderColorError
textColor
textColorPlaceholder
```

Do not use grouped style objects such as:

```
backgroundColor = {
    focused: '',
    blurred: '',
}
```

The public component API must expose flattened props.

## Motion integration

Use `motionValues` for a component-level animation variants configuration, typed
as Motion's `Variants`. Use `transition` for its timing and easing configuration,
typed as Motion's `Transition`. Wire both into the animation implementation;
never declare animation props that only fall through as DOM attributes.

Use the current theme's Water easing and duration as the default transition.
Merge custom `transition` settings with Water so partial overrides retain the
remaining defaults. Use the internal [getWaterTransition](../src/utils/styling/getWaterTransition.ts)
helper to convert theme tokens into Motion timing settings. In docs, say that
transition settings are merged with Water.

Use the same `transition` settings for coordinated state animations, such as a
Switch's knob movement and track color. Avoid leaving one animation on fixed CSS
timing while the public prop controls only the other. Use Motion for both when
the full transition API cannot be represented by CSS timing alone.

Do not introduce `motion` as an alias for `motionValues`, or expose both names for
the same configuration. When normalizing an existing component, remove unused
aliases and update its types, stories, examples, docs, and tests together.

Components that deliberately expose Motion's native props directly should retain
their native names, such as `initial`, `animate`, `exit`, `variants`, and `layout`.
Do not add a redundant `motionValues` wrapper around that API. Explain whether a
prop configures component-managed variants or passes directly to a Motion element.
Only expose and document gestures or animation callbacks that the component
intentionally supports.

Respect reduced-motion preferences by default, including custom animation
configuration. See the [reduced-motion implementation guidance](../../../apps/website/src/content/documents/README.md#reduced-motion-is-the-default).

## Documentation rule
Documentation must use the same public prop names as the implementation.

Examples, prop tables, stories, and MDX snippets must not use old aliases after a component has been normalized.

Code snippets in documentation must:

- use plain fenced code blocks with no language tag
- avoid setting a `language` prop on `RenderSource`

## Creation and maintenance rules
For new components:

- use only the standard names
- do not add compatibility aliases

For existing components being modified:

- rename public props to the standard names when making breaking changes
- update stories, docs, and examples in the same change
- remove outdated aliases when the component is intentionally normalized

For internal implementation:

- internal CSS variable names may be shorter
- public prop names must still follow this standard

## Required mappings
Use these names when normalizing or creating props:

| Do not use | Use instead |
| --- | --- |
| `bgColor` | `backgroundColor` |
| `bgColorHover` | `backgroundColorHover` |
| `bgColorActive` | `backgroundColorActive` |
| `bgColorDisabled` | `backgroundColorDisabled` |
| `bgColorOn` | `backgroundColorOn` |
| `bgColorOff` | `backgroundColorOff` |
| `borderSize` | `borderWidth` |
| `paddingTops` | `paddingTop` |
| `paddingSides` | `paddingLeft` and `paddingRight` |
| `color` for main text | `textColor` |
| `radius` for border radius | `borderRadius` |

## Standard examples

### Simple surface component

```
type ExampleProps = {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number | string;
    padding?: number | string;
};
```

### Stateful interactive component

```
type ExampleProps = {
    backgroundColor?: string;
    backgroundColorHover?: string;
    backgroundColorActive?: string;
    backgroundColorDisabled?: string;
    textColor?: string;
    textColorHover?: string;
    textColorDisabled?: string;
    borderColor?: string;
    borderColorHover?: string;
    borderColorDisabled?: string;
    borderWidth?: number;
    borderRadius?: number | string;
};
```

### Icon-bearing text component

```
type ExampleProps = {
    textSize?: 'xs' | 's' | 'm' | 'l';
    textColor?: string;
    iconColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number | string;
};
```

## Summary
The required naming pattern is:

- `backgroundColor`
- `textColor`
- `textSize`
- `borderColor`
- `borderWidth`
- `borderRadius`
- `borderStyle`
- `padding`
- `paddingTop`
- `paddingRight`
- `paddingBottom`
- `paddingLeft`
- `gap`
- `iconColor`
- `labelColor`
- `fillColor`
- `strokeColor`

State-specific variants must append a suffix to the normalized base prop name.

## Accessible names and ARIA

Expose intent-based props for accessibility rather than raw `aria-*` attributes.
For example, use `actionName` to describe an icon action or `tabBarName` to name a
tab group. Derive the appropriate ARIA attributes internally from these props,
selection, disabled state, and panel relationships. Use a meaningful fallback when
an accessible name is omitted or blank.

Omit `keyof React.AriaAttributes` from inherited native attribute types for new or
refined components that manage their semantics, and prevent forwarded attributes
from overriding the managed ARIA values. Do not document raw ARIA attributes as the
component's configuration API. Keep intent-based relationship props such as `id`
and `panelId` when consumers render related content themselves; examples may use
native ARIA attributes on those application-owned elements.

Apply this convention when reviewing a component; do not silently change unrelated
components as part of another component's update.

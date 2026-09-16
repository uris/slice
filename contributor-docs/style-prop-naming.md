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

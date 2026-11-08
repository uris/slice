# PopMenu documentation review

The `pop-menu` and `pop-menu-controller` pages describe the current implementation.
The documentation reflects the current naming and custom-content updates.

Confirmed limitations to address separately:

- `PopMenu` uses `role="menu"`, but its items remain native buttons without menuitem
  roles or menu keyboard/focus management. Escape and reduced-motion handling are
  not currently implemented. Menu names now derive from the existing name, label,
  title, and supplied ID props, with generated DOM IDs and naming defaults.
- `PopMenuItem` accepts native button attributes in its type but does not forward
  them. This includes `disabled`, `style`, and `className`. Its `level` prop
  is also currently unused. These are documented rather than silently normalized.
- Root and item color values are assigned directly to CSS variables. Examples use
  CSS color values or `var(--token)` expressions; the group resolves Slice color
  tokens through `resolveColorProps`.
- Positioning does not observe dynamic menu content. A caller-supplied `minWidth`
  larger than the viewport can also defeat the computed maximum width.

Sources: [PopMenu](../../../../../packages/slice/src/components/PopMenu/PopMenu.tsx),
[PopMenuItem](../../../../../packages/slice/src/components/PopMenu/PopMenuItem.tsx),
[types](../../../../../packages/slice/src/components/PopMenu/_types.ts), and
[PopMenuController](../../../../../packages/slice/src/components/PopMenuController/PopMenuController.tsx).

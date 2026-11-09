# PopMenu — done

The approved PopMenu review is complete. Website references and examples now cover
menu context composition, stable option IDs, explicit disabled items, CSS icon
states, keyboard navigation and focus, branch dismissal, portal containers for
roots and submenus, and live reduced-motion support. Motion values and transitions
remain configurable while reduced motion takes precedence. Root options now accept
item callbacks; generic item payloads flow through item, group, and menu click
callbacks consistently with composed children. Website and local docs cover both APIs.

Non-blocking follow-ups remain separate: observe dynamic content size, reconcile
caller minimum widths with viewport limits, align root/item color token resolution
with groups, and revisit the unused item `level` prop.

Sources: [PopMenu](../../../../../packages/slice/src/components/PopMenu/PopMenu.tsx),
[PopMenuItem](../../../../../packages/slice/src/components/PopMenu/PopMenuItem.tsx),
[types](../../../../../packages/slice/src/components/PopMenu/_types.ts), and
[PopMenuController](../../../../../packages/slice/src/components/PopMenuController/PopMenuController.tsx).

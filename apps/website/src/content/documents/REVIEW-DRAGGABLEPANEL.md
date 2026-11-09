# DraggablePanel — done

Route: `/docs/react/draggable-panel/`.

The refinement preserves existing props, defaults, resize direction, stop-at-bounds
pointer behavior, callback order/payloads, and remembered width on reopening.
`deltaWidth` remains pointer travel during a gesture and zero at start/end.
`resizeHandle.offsetX` remains accepted and documented as having no effect.

Implemented:

- Named, focusable vertical separator with panel association, size/bounds, arrow
  keys, Shift stepping, Home/End, and keyboard-only focus outlines.
- Pointer Events for mouse, pen, and touch, with capture, pointer cancellation,
  Escape, window blur, and unmount cleanup. Uses the panel's owning document and
  restores previous document selection styles exactly.
- Symmetric bounds enforcement for either edge, validated relative/pixel
  constraints, and saved-width clamping when bounds change.
- Closed content stays mounted but becomes inert and hidden to assistive tech;
  `isClosed` is respected when resizing is disabled too.
- Live reduced motion disables width/highlight transitions.
- Typed content/styles and exported DraggablePanelResizeInfo, without callback
  migration. Optional resizeHandleLabel distinguishes multiple panels.
- Composed native context-menu handlers and partial rail defaults.
- Removed mirrored closed/constraint state and panel resize observation. Pointer
  movement writes width and separator values directly; internal React state is
  updated at gesture boundaries, not on every move. Container observation remains.
- Website left/right workspace previews, complete API/events reference, copyable
  snippets, refreshed MDX, and distinct labels on the website's own sidebars.
- Focused browser stories for resizing, keyboard access, constraints, cancellation,
  unmount cleanup, reduced motion, closed content, and width restoration. Pure
  constraint tests and server-rendering checks remain in the unit project.

Validation: focused checks and the 1,900-test full coverage run passed. Real mouse
resizing, keyboard controls, hidden content, reopen, and live reduced motion were
verified for both directions in Chromium and WebKit. Package/website builds and
workspace typechecks passed. Standalone snippets, the authored page's interactive preview and anchors, and
native Chromium touch dragging passed. Refreshed/rendered benchmarks report
1.511ms mount, 0.265ms rerender, and 0.282ms keyboard resize (jsdom measurements;
previous mount/rerender were 1.637ms/0.334ms). The main drag optimization removes
internal React updates and panel ResizeObserver notifications from pointer moves.

Follow-up: explicit FlexDiv overflow styles now take precedence over generated
scroll-axis defaults, so the rounded panel preview clips its background correctly.
Regression stories cover clipping and explicit axis overrides. Docs also explain
setting the inner content wrapper's minWidth to the pixel minimum constraint to
avoid squeezing during collapse while leaving the outer panel free to close.

Implementation, documentation, and validation were reviewed and accepted. This review is complete.

Pointer focus now explicitly suppresses both browser and custom outlines. Keyboard interaction restores the focus outline; native Tab/mouse/arrow checks passed in Chromium and WebKit, along with 25 focused panel tests.

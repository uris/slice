# Component review batch 04

This batch documents **Overlay, DialogBox, ModalController, Tip, and Toast** using the
current public implementations. The authored pages and previews are ready for
review; implementation changes are recorded after each control’s review is approved.

Follow the [root AGENTS.md](../../../../../AGENTS.md),
[prop standard](../../../../../packages/slice/docs/style-prop-naming.md), and
[documentation guide](README.md). Implement approved changes one component at a
time, updating types, stories, MDX, authored docs, consumers, and benchmarks together.
Runtime component regression tests belong in the component's stories, with `tests`
tags on fixtures. Only H1/H2/Definition anchors are tracked in authored docs.

## Overlay — implemented

Route: `/docs/react/overlay/`. Sources:
[implementation](../../../../../packages/slice/src/components/Overlay/Overlay.tsx),
[types](../../../../../packages/slice/src/components/Overlay/_types.ts),
[styles](../../../../../packages/slice/src/components/Overlay/Overlay.module.css).

Agreed interaction contract: the clear layer always intercepts pointers. Children
remain interactive and events reach the layer unless a child stops the matching
event's propagation. Outside-click dismissal is application-controlled.

- Removed unused `overlay`, redundant `global`/`toggleOverlay`, and the overlapping
  `type` preset. Renamed `color` to `backgroundColor`; no aliases are retained.
- `opacity` defaults to zero for a clear layer and accepts clamped finite values
  from zero to one. It affects a dedicated visual backdrop, never the children.
- Kept a fixed native interaction div with pointer events enabled, even when the
  backdrop is transparent or fading out. Native events retain their React payloads;
  context-menu prevention and dismissal belong to application handlers.
- Added Water-merged `transition` and component-managed `motionValues` for
  `initial`/`animate`/`exit`. Live reduced motion bypasses custom animation.
- The backdrop alone is hidden from assistive technology. Foreground semantics,
  keyboard/focus management, Escape, and background scroll locking remain app-owned.
- Migrated ModalController and VideoController consumers to the normalized visual
  props without changing their presentation, focus, drag, or lifecycle behavior.
- Updated website/MDX docs, the clear-menu preview, Storybook controls and interaction
  fixtures, type checks, and benchmarks. Controller backdrop hit-testing and WebKit
  dragging remain separate findings for the controller review below.

## DialogBox — implemented

Route: `/docs/react/dialog-box/`. Sources:
[implementation](../../../../../packages/slice/src/components/DialogBox/DialogBox.tsx),
[types](../../../../../packages/slice/src/components/DialogBox/_types.ts),
[styles](../../../../../packages/slice/src/components/DialogBox/DialogBox.module.css).

Approved changes:

- Renamed the public panel, types, component entrypoint, stories, consumers,
  benchmarks, and authored route to `DialogBox` (`/docs/react/dialog-box/`).
- Added parent-only `DialogBox.Title`, `.Content`, and `.Actions` sections, with
  fragments/conditionals, fixed structural order, duplicate/conflict validation,
  and the existing props alternative. `useDialogBox<T>()` exposes stable close,
  resolve, and reject controls to descendants. Both previews and docs use composition.
- The panel supplies dialog naming through its heading or `dialogName` and a
  `Dialog` fallback; title icons are decorative. Raw ARIA/role overrides are excluded.
- ModalController owns modal state, initial focus, focus containment/restoration,
  Escape, background inertness, and scroll locking. Backdrop hit testing is fixed;
  descriptor callbacks run after store settlement. Its full review remains below.
- Close invokes only `onClose`. Actions retain resolve/reject defaults and accept
  `promise="none"`, `disabled`, and `working`. Keys use stable action IDs.
- Native div/event typing replaces `any`; interactive header/footer controls do
  not start dragging. `titleTextColor` follows the prop naming convention.
- Uses Slice’s `useObserveResize` on content and viewport to update scroll dividers.
  Header, body, and footer use consistent padding, preserving CSS expressions.
- Removed logging and `!important`; constrained sizing and wrapping keep narrow
  containers predictable.

Previews: a short confirmation and a constrained scrolling panel.

## ModalController — ready for review

Route: `/docs/react/modal-controller/`. Sources:
[implementation](../../../../../packages/slice/src/components/ModalController/ModalController.tsx),
[types](../../../../../packages/slice/src/components/ModalController/_types.ts),
[styles](../../../../../packages/slice/src/components/ModalController/ModalController.module.css),
[store](../../../../../packages/slice/src/stores/modal/modalStore.ts).

Findings:

- The store supports one active modal, not a stack. Replacing/dismissing an active
  promise rejects it; docs/examples must handle that rejection.
- Backdrop hit testing is fixed: the positioning container passes pointers through,
  while the panel remains interactive. Browser story coverage checks actual hit targets.
- Dialog naming belongs to DialogBox. Focus containment/restoration, initial focus,
  Escape, background inertness, and scroll locking are implemented by the host.
  Portal ownership remains application-controlled.
- Panel and backdrop transitions now share Water-merged timing and respect live
  reduced-motion preferences.
- Variants/initial/animate/exit are an intentional native Motion API. Keep that API
  coherent rather than introducing an alias when reviewing motion configuration.
- The presence wrapper is not keyed by modal identity, so replacements can inherit
  previous drag/animation state. Review replacement and exit/re-entry behavior.
- Native pointer QA moved the dialog in Chromium, but title-bar dragging did not
  move it in WebKit. Investigate event initiation, constraints, and engine behavior.
- `onDragPointerDown` calls drag controls even when dragging is disabled. Guard
  initiation and avoid accidentally dragging from action/close controls.
- Descriptor callbacks run after store settlement, so a throwing callback cannot
  strand the active modal. Further dismissal-reason design can follow the host review.
- Decide whether stacking is needed before adding it; first make single-dialog
  presentation and promise lifecycle predictable.

Preview: one local controller, an open button, and an actual stored DialogBox. The
preview owns a descriptor ID and only clears its own modal on unmount. Transformed
canvas containment keeps fixed layers from covering website navigation.

## Tip — ready for review

Route: `/docs/react/tip/`. Sources:
[implementation](../../../../../packages/slice/src/components/Tip/Tip.tsx),
[types](../../../../../packages/slice/src/components/Tip/_types.ts),
[styles](../../../../../packages/slice/src/components/Tip/Tip.module.css),
[positioning hook](../../../../../packages/slice/src/hooks/useToolTip/useToolTip.ts).

Findings:

- Positive coordinates, rather than content/explicit visibility, control display.
  Valid coordinates at zero or outside the viewport are treated as hidden.
- Changing coordinates restarts both timers. Hide expiry occurs even while the
  trigger is active; decide whether the component or trigger owns visibility.
- `textColor`/`color` populate a CSS variable the stylesheet never reads. Fix the
  color application, remove `color`, and remove the `radius` fallback when approved.
- `payload.duration` is ignored; the actual lifetime comes from `hideDelay`.
  Clarify metadata versus configuration instead of silently supporting two APIs.
- The first reveal fades, but later reveals can retain opacity 1. Hiding is an
  immediate visibility change; implement proper presence/exit and Water timing.
- There is no reduced-motion handling, tooltip role/association, Escape behavior,
  or built-in keyboard activation. Keep accessibility configuration intent-based.
- Positioning is external through `useToolTip`; that helper measures on metadata
  changes, not all scrolling/resizing/anchor layout changes. Decide ownership and
  collision/anchor behavior before broadening the API.
- The wrapper is always mounted, uses `!important`, and forwards incidental Motion
  props. Give it a deliberate, typed configuration surface and native events.

Previews: a static hint and application-owned hover/focus activation.

## Toast — ready for review

Route: `/docs/react/toast/`. Sources:
[implementation](../../../../../packages/slice/src/components/Toast/Toast.tsx),
[types](../../../../../packages/slice/src/components/Toast/_types.ts),
[styles](../../../../../packages/slice/src/components/Toast/Toast.module.css),
[store](../../../../../packages/slice/src/stores/toast/toastStore.ts).

Findings:

- `onShow` is declared but never called. It falls through to the wrapper rather
  than acting as a lifecycle callback. Normalize and implement lifecycle events.
- `radius`, `notifId`, `didHide`, and the capitalized `Infinite` sentinel need a
  naming/behavior review. Native `id` already has separate DOM semantics.
- Updating only notification ID does not restart visibility. Closing/timing out
  leaves content state behind, making repeated identical messages unreliable.
  A fresh React key works around this today; define identity and replacement rules.
- Hover/focus clears the timer; leaving either state restarts the entire duration,
  even if the other interaction is still active. Track both states and remaining
  time. Define behavior for live duration/message changes and long-running tasks.
- Infinite duration forces both close visibility and the default progress indicator.
  Separate persistence, dismissibility, and working status so each prop is honest.
- The dismiss control is a div with button semantics. Use a native button, meaningful
  intent-based naming, and robust keyboard/focus handling.
- A polite status exists, but mounting it with the message may miss initial
  announcements. Review persistent announcement semantics and urgency controls.
- Entry/exit timing is fixed in internal variants. Add intentional transition and
  variant integration with Water and live reduced-motion handling.
- Constrain width and wrapping, verify small screens/long messages, and remove
  `!important`. Define consistent timer callbacks with dismissal reasons.
- The toast store holds one notification. Treat queuing/stacking as a separate
  design choice rather than implying it already exists.

Previews: info, success, timed, and working notifications, each replayable without
sharing the application's toast store. Parent positioning contains them in canvas.

## Website integration notes

The website maps both Slice components and store entrypoints to source so shared
singletons stay coherent. The controller example uses the public `stores/modal`
subpath. Importing the compiled broad stores barrel exposed an uploads-worker URL
that does not resolve from its compiled chunk; packaging that worker needs separate
review rather than a silent change in this documentation batch.

## Suggested review order

Start with Overlay, then DialogBox, then ModalController so shared layering and dialog
ownership are settled first. Review Tip and Toast afterward, applying the agreed
motion, accessible naming, native-button, and timer conventions.

## Validation of the documentation batch

- Audited all 78 declared component props/events against source, including defaults,
  alphabetical reference order, untracked H3s, unique anchors, and tracking order.
- Parsed all snippets and verified canvas links against the published story index.
- Website production build, document API/snippet/route audits, and scoped Biome
  checks pass.
- Chromium and WebKit checks cover all five routes, preview containment, overlay
  dismissal/reopening, modal actions/scrolling, controller store settlement and
  route cleanup, tooltip hover/focus, notification replay/timing/progress, and
  missing-document shells for unknown React and unregistered Native slugs.
- Browser checks confirmed controller backdrop interception and a WebKit title-drag
  failure. WebKit also reported the nonfatal layout notification noted above;
  these findings remain for the component review, rather than being silently fixed
  by the documentation pass.

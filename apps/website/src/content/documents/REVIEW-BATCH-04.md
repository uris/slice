# Component review batch 04

This batch documents **Overlay, Modal, ModalController, Tip, and Toast** using the
current public implementations. The authored pages and previews are ready for
review; this writing pass does not normalize or silently repair the library APIs.

Follow the [root AGENTS.md](../../../../../AGENTS.md),
[prop standard](../../../../../packages/slice/docs/style-prop-naming.md), and
[documentation guide](README.md). Implement approved changes one component at a
time, updating types, stories, MDX, authored docs, consumers, and benchmarks together.
Runtime component regression tests belong in the component's stories, with `tests`
tags on fixtures. Only H1/H2/Definition anchors are tracked in authored docs.

## Overlay — ready for review

Route: `/docs/react/overlay/`. Sources:
[implementation](../../../../../packages/slice/src/components/Overlay/Overlay.tsx),
[types](../../../../../packages/slice/src/components/Overlay/_types.ts),
[styles](../../../../../packages/slice/src/components/Overlay/Overlay.module.css).

Findings:

- The layer is always fixed. `global` only changes the click callback sequence;
  the name suggests a positioning distinction it does not provide.
- `overlay` is typed `any`, destructured, and unused. `type="clear"` overrides
  explicit opacity to zero; the invisible layer still intercepts pointer input.
- `color` sets the background. Normalize to `backgroundColor` when approved and
  define whether opacity should be independent of a visual preset.
- Opacity affects children too. Keep backdrop and foreground content separate,
  or explicitly define a composition API with a dedicated backdrop element.
- `onClick` discards the native event. `toggleOverlay` and `global` overlap with
  application-controlled `show`; consider a single clear dismissal contract.
- Fixed easeOut timing replaces rather than merges transitions. Add Water defaults,
  live reduced-motion handling, and meaningful exit interaction behavior.
- The backdrop has no keyboard/focus/background-inertness behavior. Establish
  ownership between the backdrop and dialog controller rather than duplicating it.
- WebKit QA emitted a nonfatal ResizeObserver-loop notification on the Overlay
  page; investigate measurement feedback in the layer/canvas host during review.
- Native props are cast onto Motion. Context-menu overrides replace the internal
  handler instead of composing with it; document/normalize event semantics.

Preview: two opacity treatments, with the fixed layer contained within the canvas.

## Modal — ready for review

Route: `/docs/react/modal/`. Sources:
[implementation](../../../../../packages/slice/src/components/Modal/Modal.tsx),
[types](../../../../../packages/slice/src/components/Modal/_types.ts),
[styles](../../../../../packages/slice/src/components/Modal/Modal.module.css).

Findings:

- The panel does not supply dialog naming, heading association, focus management,
  Escape dismissal, or modal semantics. Agree what belongs here versus the host.
- Action handling always calls `onAction`, then resolves by default or rejects
  with an Error whose cause is the action value. There is no action-only path.
- Close invokes both `onReject` and `onClose`. The controller then rejects and
  dismisses through separate callbacks; simplify ownership and settlement order.
- Entry keys combine action ID with array index. Prefer stable action IDs and
  type the actual native root/events without `any` casts.
- Scroll detection runs on children/maxHeight changes but not all layout changes,
  font loads, or container resizes. Use measurement/observation with cleanup.
- Default minimum width can overflow narrow containers; verify min/max dimensions,
  long titles, long labels, and footer wrapping on smaller layouts.
- Header/footer/body padding differs. Body top is always zero and bottom is
  conditional. Parsing shorthand with `split(' ')` breaks CSS expressions such as
  `calc()`; normalize spacing semantics and preserve explicit values accurately.
- Remove `!important` rules and the unconditional `console.log(scrolls)`.
- Review title/icon decorative semantics, close/tooltip labels, callback payloads,
  action disabled/working behavior, and whether title styling needs normalization.

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
- The fixed full-screen container sits above the Overlay and can intercept backdrop
  clicks. Verify actual pointer hit testing, not just dispatched overlay events.
- Dialog semantics, focus containment/restoration, initial focus, Escape, background
  inertness, scroll locking, and portal ownership are missing or application-owned.
- The controller's transition and backdrop transition are independent fixed timings.
  Merge dialog/backdrop settings with Water and respect live reduced motion.
- Variants/initial/animate/exit are an intentional native Motion API. Keep that API
  coherent rather than introducing an alias when reviewing motion configuration.
- The presence wrapper is not keyed by modal identity, so replacements can inherit
  previous drag/animation state. Review replacement and exit/re-entry behavior.
- Native pointer QA moved the dialog in Chromium, but title-bar dragging did not
  move it in WebKit. Investigate event initiation, constraints, and engine behavior.
- `onDragPointerDown` calls drag controls even when dragging is disabled. Guard
  initiation and avoid accidentally dragging from action/close controls.
- Descriptor callbacks run before store settlement. A throwing callback can prevent
  cleanup; define exception-safe settlement and explicit dismissal reasons.
- Decide whether stacking is needed before adding it; first make single-dialog
  presentation and promise lifecycle predictable.

Preview: one local controller, an open button, and an actual stored Modal. The
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

Start with Overlay, then Modal, then ModalController so shared layering and dialog
ownership are settled first. Review Tip and Toast afterward, applying the agreed
motion, accessible naming, native-button, and timer conventions.

## Validation of the documentation batch

- Audited all 79 declared component props/events against source, including defaults,
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

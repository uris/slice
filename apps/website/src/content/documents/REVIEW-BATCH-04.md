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

## ModalController — done

Route: `/docs/react/modal-controller/`. Sources:
[implementation](../../../../../packages/slice/src/components/ModalController/ModalController.tsx),
[types](../../../../../packages/slice/src/components/ModalController/_types.ts),
[styles](../../../../../packages/slice/src/components/ModalController/ModalController.module.css),
[store](../../../../../packages/slice/src/stores/modal/modalStore.ts).

Completed the approved lifecycle and motion changes:

- Kept one active modal without stacking. Replacement/dismissal reject pending
  responses; documentation examples handle rejection.
- Presentation keys track stored instances, including reused or omitted descriptor
  IDs. Drag controls, constraint refs, and animation state belong to each instance.
- Exiting hosts become inert, stop focus/Escape handling, and release background
  and scroll locks. Replacements receive initial focus; dismissal restores focus.
- Retained close/resolve/reject callbacks cannot affect a replacement. Settlement
  precedes descriptor callbacks, and subscriber-created replacements are preserved.
- Simplified motion to `motionValues={{ initial, animate, exit }}` plus `transition`,
  matching PopMenu. Partial values merge with defaults; removed separate variant
  label props. Water timing applies to panel and backdrop.
- Live reduced motion cancels panel animation and variant-level delays, including
  during exit. Backdrop reduced motion continues to be handled by Overlay.
- Verified native title-bar dragging in Chromium and WebKit with frame-paced pointer
  input. Close controls did not initiate dragging. The earlier fast-input WebKit
  failure was not reproduced with realistic pacing; no engine-specific fix added.

Website previews now use the existing layout controller. Updated component/store
references, focused lifecycle stories, hook/store unit tests, and replacement benchmarks.
Implementation, validation, and documentation were reviewed and approved; this review is closed.

## Tip — done

Route: `/docs/react/tip/`. Sources:
[implementation](../../../../../packages/slice/src/components/Tip/Tip.tsx),
[types](../../../../../packages/slice/src/components/Tip/_types.ts),
[styles](../../../../../packages/slice/src/components/Tip/Tip.module.css),
[positioning hook](../../../../../packages/slice/src/hooks/useToolTip/useToolTip.ts).

Completed the approved review with the agreed singleton and timing behavior:

- Kept the wrapper permanently mounted for the single application-wide instance.
  New request data resets visibility and timers; coordinate updates do not restart
  either timer. Content plus finite coordinates control display, including zero.
- Default reveal is 150ms with Water easing; removal is always immediate. Kept
  the 500ms show delay and 2500ms lifetime. Per-request `payload.duration` overrides
  the lifetime; expiry still applies while a trigger remains active.
- Clicks and Escape dismiss visible and pending requests, cancel timers, and do
  not move focus. Clearing data/coordinates or unmounting also cleans up.
- Added tooltip semantics and trigger description association, preserving existing
  description IDs. Triggers own hover/focus activation and leave/blur/click cleanup.
- Added intentional `motionValues` and `transition` props with live reduced-motion
  overrides. Every reveal resets animation; custom animation delays never delay hiding.
- Applied text color, removed `color`/`radius` aliases and `!important`, constrained
  long text, and narrowed native attributes/events to a deliberate public surface.
- Positioning follows anchor/content geometry and viewport/layout movement while
  a request exists. It flips above when needed, clamps both axes, returns undefined
  for missing/removed anchors, and avoids rendering unchanged coordinates.

Updated website, local component/hook references, examples, tests, and benchmarks.
The website examples use the existing layout Tip through `tipActions.push`,
with focused built-in control and Avatar profile-trigger examples. Documentation
and examples were reviewed and approved; Tip is checked off.

## Toast — done

Route: `/docs/react/toast/`. Sources:
[implementation](../../../../../packages/slice/src/components/Toast/Toast.tsx),
[types](../../../../../packages/slice/src/components/Toast/_types.ts),
[styles](../../../../../packages/slice/src/components/Toast/Toast.module.css),
[store](../../../../../packages/slice/src/stores/toast/toastStore.ts).

Completed the approved review:

- Implemented `onShow(ToastInfo)` and `onHide(ToastHideInfo)` with original identity
  and timeout/dismiss/cleared/replaced reasons. Exit callbacks run once after exit;
  unmount cancels timers without callbacks.
- Normalized `radius` → `borderRadius`, `notifId` → `notificationId`, `didHide` →
  `onHide`, and `'Infinite'` → `'infinite'`; migrated internal consumers and examples.
- New IDs replay identical text without remounting. Pending shows cancel on
  replacement; changing duration restarts its lifetime and preserves active pauses.
- Hover/focus independently pause remaining time until both end. Persistence,
  progress, and dismissibility are independent.
- Added a native dismiss button, configurable intent label, keyboard focus style,
  prior-focus restoration, and persistent polite/assertive announcements.
- Added `motionValues` and `transition`, Water integration, live reduced-motion
  overrides, and a static working indicator under reduced motion.
- Constrained width/height, wrapped long text, removed `!important`, and retained
  native wrapper events alongside timer behavior.
- Added generic `data` and `onClick(event, data)` action support with native
  keyboard activation and independent dismissal. Store pushes infer payload types.
- Store values compose directly with component props. Generated IDs and guarded
  clear callbacks protect replacements. The store remains a single slot;
  queuing/stacking is separate future work.

Website and local reference docs describe the current API. Previews replay through
notification identity without sharing the application store. Lifecycle unit tests,
store tests, and focused interaction stories cover the new behavior.

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

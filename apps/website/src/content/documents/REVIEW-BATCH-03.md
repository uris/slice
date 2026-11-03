# Component review batch 03

The website writing pass covers **TextField, TextArea, DropDown, DivInput, and
ErrorSummary**. Pages describe the current public API and verified limitations.
This pass does not change library behavior, rename props, or add compatibility aliases.

Review these components one at a time in the order below. After agreeing on each
change, update implementation, consumers, website, MDX, Storybook controls/play
functions, and benchmarks together. Use the [prop standard](../../../../../packages/slice/docs/style-prop-naming.md)
and [documentation guide](README.md). Component runtime regression checks belong
in stories, with `tests` tags on fixtures that should not appear in the sidebar.

## TextField — first fix pass completed

Route: `/docs/react/textfield/`. Sources:
[implementation](../../../../../packages/slice/src/components/Textfield/TextField.tsx),
[types](../../../../../packages/slice/src/components/Textfield/_types.ts),
[styles](../../../../../packages/slice/src/components/Textfield/TextField.module.css).

Implemented in the authorized first pass:

- Removed the incomplete memo comparator. Updated handlers, dimensions, names,
  native settings, and read-only state render immediately through ordinary memoization.
- `value` is strictly controlled; `defaultValue` initializes local text. Native
  form reset restores the initial local value without emitting `onChange`; canceled
  reset is respected and external form owners are supported.
- `width`/`height` replace `size`; `readOnly` replaces `editable` without disabling
  selection or focus. `onKeyDown(event)` replaces `onKeydown(key, event)`.
  `borderStyle` replaces `borderType`; positive `showPasswordToggle` replaces `noShow`.
  Legacy names are removed rather than retained as aliases.
- Associated the visible label with the native input using generated or supplied
  `inputId`. `inputName` supplies an optional accessible-name override; absent labels
  fall back to `name` then Text input. Native form naming is separate from visible labels.
  Managed ARIA is not directly exposed or forwarded.
- Added `inputAttributes` for native settings such as autocomplete, required, pattern,
  minimum length, input mode, and form ownership; managed fields/callbacks and raw
  ARIA are excluded. Outer attributes remain on the wrapper.
- Fixed the input color variable and applied focused/blurred/error/disabled colors
  to their intended states. Removed `!important` and broad CSS transitions, kept
  exact explicit padding and existing optical spacing, and made flex sizing self-contained.
- Disabled state covers input, clear, action, and visibility controls. Read-only blocks
  edits, clearing, and the action while allowing focus/copy and password visibility.
- Clear remains in a reserved slot but is not accessible while hidden or empty.
  `clearBlurs` explicitly controls whether a clear request retains or removes focus.
- Replaced the hardcoded Translate action with `actionLabel` (Action fallback).
  Password actions switch names between Show password and Hide password; icons are decorative.
- Enter handling calls the consumer first, supports cancellation and IME composition,
  and emits one blur. A supplied `onSubmit` prevents duplicate native form submission;
  without it, the native form owns Enter and the field does not force blur.
- Action fading uses `transition` merged with Water. CSS focus/color changes use Water;
  live reduced motion disables both without replacing focused controls. Exiting actions
  are inert and are removed immediately when reduced motion is enabled.
- Migrated website/MDX reference, preview, consumers, and Storybook runtime checks.
  The new stories cover value contracts, labeling, colors, forms, disabled/read-only,
  latest props/handlers, paste, cancellation, composition, presence, and reduced motion.

The label-interaction follow-up adds `variant` (simple/stacked/outlined), `behavior`
(persistent/appear), `stackedGap` (2px), `stackedLabelTextSize` (body-xs-regular),
and outlined-only `labelBackgroundColor` (core-surface-primary). Stacked and outlined
labels align with the value, including leading icons. Outlined backing uses
spacing-xs (4px by default) on both sides and spacing-xxs (2px) above,
with a 1em label line height. Only stacked appearance animates;
reduced motion switches it to the persistent label plus original placeholder.

The user may request further interaction changes. This pass
establishes the state/API contract and fixes the confirmed bugs without preempting
that next design discussion.

## TextArea — ready for review

Route: `/docs/react/text-area/`. Sources:
[implementation](../../../../../packages/slice/src/components/TextArea/TextArea.tsx),
[types](../../../../../packages/slice/src/components/TextArea/_types.ts),
[styles](../../../../../packages/slice/src/components/TextArea/TextArea.module.css).

Confirmed findings:

- `value` is effect-synchronized local state. `submitClears` changes the DOM and
  local state without emitting `onChange`, so application state can retain stale text.
- Auto-sizing runs on mount, `rows` changes, and input events, but not on later
  `value` changes. Explicit height, rows, native resizing, and auto-sizing compete
  without a clear mode. `minWidth` creates an unused variable and appends `px` to
  strings. `sendSize` also creates an unused variable. `textSize="xl"` maps to small.
- The textarea has no built-in accessible label; `name` is only a native form name.
  Wrapper IDs and ARIA do not reach the inner textarea. The docs preview uses an
  implicit native label as application-owned wiring.
- The send action is on a div's `onMouseDown`, not the button's click handler.
  Keyboard activation does not take that path, and `disabled` only disables the
  textarea. The send icon needs an action name.
- Enter submission ignores Shift and composition. `onKeyDown` runs after submission,
  so a consumer cannot cancel it. Blur/focus callbacks live on the outer wrapper
  and fire for descendant focus changes, including the send control.
- CSS uses broad transitions and `!important`, with no reduced-motion override.
  A private dimension helper repeats `setStyle` behavior.

Proposed decisions:

- Align value, focus, label, read-only, and native-attribute contracts with TextField.
- Define auto-grow versus fixed/native-resize modes. Remeasure on external text,
  width, and typography changes; preserve explicit bounds. Apply `minWidth`, fix
  the `xl` mapping, and implement or remove `sendSize`.
- Move submission to a named native action button, honor disabled state, and define
  Enter/Shift+Enter/composition behavior. Let consumer handlers cancel it first.
- Keep clearing observable to application state and emit focus callbacks for the
  intended control. Replace duplicate sizing and broad animation with shared helpers,
  targeted Water timing, and reduced-motion handling.

## DropDown — ready for review

Route: `/docs/react/drop-down/`. Sources:
[implementation](../../../../../packages/slice/src/components/DropDown/DropDown.tsx),
[types](../../../../../packages/slice/src/components/DropDown/_types.ts),
[styles](../../../../../packages/slice/src/components/DropDown/DropDown.module.css).

Confirmed findings:

- `disabled` only changes colors and prevents pointer-down. The native select
  remains enabled, keyboard-selectable, and unguarded by `handleChange`.
- `selectedIndex` and `selectedValue` both synchronize local state. Value matching
  also guesses from label/alt strings, and unmatched values retain a stale selection.
  The visible face starts at “Select an option” independently of the actual first
  native option unless a selection prop is supplied; SSR and hydration can disagree.
- `placeholder` only changes index-zero coloring. It does not insert a placeholder
  option. The face strips the first `-- ` from labels, introducing an implicit text convention.
- Native option values are indexes. `name` is used as an ARIA label but is never
  assigned as the native select's form name, preventing normal form serialization.
- `borderSize` duplicates `borderWidth`. `validate` is typed but unused and forwarded
  to the wrapper. `height` generates an unused variable. The outer span inherits
  div attribute/event types.
- Box-border state and bottom-border state use different color paths: error and
  disabled colors can disagree. The visible label is unassociated, the chevron is
  not decorative, and the transparent native select removes its outline.
- Option mouse-up and select change handlers duplicate selection paths. CSS uses
  broad transitions and `!important`, with no reduced-motion handling.

Proposed decisions:

- Fix native disabling and form naming first. Define explicit value/defaultValue
  selection, stable object matching if retained, and one change callback.
- Replace prompt/label guessing with an explicit placeholder contract. Decide
  whether composed options are useful, using the same selection path as data options.
- Remove `borderSize` and unused `validate`; apply dimensions and correct native
  span/select types. Keep selected display, native value, and form data consistent.
- Associate labels, hide decorative icons, and keep accessibility configuration
  intent-based. Reconcile state colors and use targeted Water transitions with reduced motion.

## DivInput — ready for review

Route: `/docs/react/div-input/`. Sources:
[implementation](../../../../../packages/slice/src/components/DivInput/DivInput.tsx),
[types](../../../../../packages/slice/src/components/DivInput/_types.ts),
[styles](../../../../../packages/slice/src/components/DivInput/DivInput.module.css).

Confirmed findings:

- Enter calls `onChange(null)` and `onSubmit`, then blurs. The blur handler repeats
  both callbacks, so one commit can produce duplicate side effects.
- Placeholder text is actual editable content and shares mutable refs with the value.
  Clearing, typing over placeholder text, and blur can expose placeholder or stale
  text as a value. Initial server-rendered empty content differs from the placeholder
  written after mount.
- `setCursor` uses hardcoded Range offsets and can target invalid child offsets.
  Paste manipulates the selection/DOM directly and updates a ref without updating
  the local text state used by placeholder rendering. `cleanString` is plain-text
  normalization, not a rich-text model or a general HTML security boundary.
- `wrap=false` generates invalid `white-space: no-wrap`; the true branch’s
  `wrap` value is supported in both tested browsers. `clamp` is removed only
  during focused editing. `focus=false` changes visual state without actually blurring.
- `radius` duplicates `borderRadius`; the inner surface uses its own fixed radius.
  `isEditable`, `focus`, and `onDblClick` differ from established native naming.
- All keyboard events stop propagation; Enter and angle brackets are blocked before
  inherited wrapper handlers can help. Click handling prevents default and bubbling.
  Read-only text retains a textbox role without corresponding read-only state;
  multiline semantics and native form serialization are absent.
- A Motion wrapper is used without an intentional animation/gesture API. CSS has
  no reduced-motion override, and the component repeats a dimension helper.

Proposed decisions:

- Decide whether this should remain a contenteditable editor or use a native input
  for single-line title editing. Preserve a separate component only for a clear benefit.
- Define text/value/defaultValue semantics and one commit event. Separate placeholder
  presentation from stored content; handle plain-text paste and caret restoration safely.
- Normalize `readOnly`, focus requests, `onDoubleClick`, and `borderRadius`; remove
  legacy aliases and the unused Motion layer if it adds no intended behavior.
- Fix wrapping/clamping, preserve intended browser editing shortcuts, support IME,
  and define form integration and semantics with intent-based accessibility props.

## ErrorSummary — ready for review

Route: `/docs/react/error-summary/`. Sources:
[implementation](../../../../../packages/slice/src/components/ErrorSummary/ErrorSummary.tsx),
[types](../../../../../packages/slice/src/components/ErrorSummary/_types.ts),
[styles](../../../../../packages/slice/src/components/ErrorSummary/ErrorSummary.module.css).

Confirmed findings:

- Show/hide animation has a hardcoded `maxHeight: 500` while the panel hides overflow,
  so a long summary can be clipped. Timing is fixed easeInOut at 250ms, not Water;
  reduced-motion preferences are not observed and there is no public transition prop.
- The summary has no built-in alert/live-region role, focus handling, heading
  association, or field-navigation links. Titles are bold spans rather than headings.
  Application-owned wrappers can provide announcement semantics in the meantime.
- Entry keys include array indexes; message keys use raw message text, so duplicate
  messages within one entry produce duplicate React keys. Stable item IDs are absent.
- `textColor` also sets the border color; border shape/width, spacing, and heading
  styling are hardcoded. CSS contains `!important` overrides.
- Remaining div attributes are cast to `any` and spread onto a Motion wrapper,
  allowing accidental APIs beyond the declared native event contract.

Proposed decisions:

- Animate intrinsic height or measured height without a fixed clipping ceiling.
  Expose `transition` merged with Water and honor live reduced-motion changes.
- Choose announcement and optional focus behavior deliberately through named props;
  avoid raw ARIA configuration. Consider field targets as typed entry metadata,
  with application-owned navigation when the summary cannot own it.
- Add stable identities where needed and preserve duplicate messages safely. Decide
  which presentation controls are useful before adding more props.
- Keep native event typing accurate and document only intentional animation behavior.

## Suggested review order

Start with TextField, then TextArea, so naming, disabled/read-only behavior, focus,
and value contracts can be shared. Review DropDown next for the native-selection
contract, DivInput for whether contenteditable is justified, and ErrorSummary last
for integration with the refined fields.

# Component review batch 03

The website writing pass covers **TextField, TextArea, DropDown, ContentEditable, and
ErrorSummary**. Pages describe the current public API and verified limitations.
The component reviews below record the agreed implementation changes, with no compatibility aliases.

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

## TextArea — first fix pass completed

Route: `/docs/react/text-area/`. Sources:
[implementation](../../../../../packages/slice/src/components/TextArea/TextArea.tsx),
[types](../../../../../packages/slice/src/components/TextArea/_types.ts),
[styles](../../../../../packages/slice/src/components/TextArea/TextArea.module.css).

- Split controlled `value` from local `defaultValue`. Submission clearing reports
  `onChange('')`; native form reset restores initial local text, respects canceled
  resets, and supports external form ownership.
- Added explicit `autoGrow`, with `rows` as its baseline and `maxHeight` as its
  scrolling limit. External values, parent width, typography, and row changes
  remeasure content. Explicit `height` takes precedence; native vertical resizing
  is available with `autoGrow={false}` and `height="auto"`.
- Added associated `label`, `inputId`, intent-based `inputName`, native
  `inputAttributes`, and `readOnly`. Autocomplete follows the form/browser default.
  Managed values, callbacks, styling, and raw ARIA are not duplicated in native settings.
- Added `tip` and `errorMessage` with accessible descriptions and field-aligned
  horizontal padding plus 4px above. Errors style the outline and message, leaving
  the value at its normal color.
- Replaced `hasSend` with `showSendButton` and `border` with `borderStyle`.
  Removed the unused TextArea-specific `Tip` type. No legacy aliases are retained.
- The send action is a native named button, supports keyboard activation, and honors
  disabled/read-only/empty states. `sendSize` now sizes it, and reserved footer space
  prevents overlap with text. Pointer sending retains textarea focus.
- Enter handling calls the consumer first, honors cancellation and composition,
  preserves Shift+Enter newlines, and avoids duplicate native form submission.
  Without `onSubmit`, native multiline editing remains available.
- Applied `minWidth` correctly, fixed `xl` typography, consolidated dimensions through
  `setStyle`, removed broad transitions and `!important`, and honored reduced motion.
- Updated consumers, website/MDX references and previews, and colocated stories/type
  checks. Runtime checks now live in the component story instead of shared play helpers.

Label variants and animated label appearance remain a separate follow-up pass.

## DropDown — first fix pass completed; placeholder review next

Route: `/docs/react/drop-down/`. Sources:
[implementation](../../../../../packages/slice/src/components/DropDown/DropDown.tsx),
[types](../../../../../packages/slice/src/components/DropDown/_types.ts),
[styles](../../../../../packages/slice/src/components/DropDown/DropDown.module.css).

- Added strict `value` / local `defaultValue` selection in place of competing
  `selectedIndex` / `selectedValue` inputs. Selection and the visible face derive
  from the same value during SSR, prop updates, option reordering, and option removal.
- Kept stable object matching through `valueKey` or reference identity; removed
  accidental label/alt matching. A null or unmatched value leaves no matching choice
  instead of displaying the previous selection.
- Consolidated selection into `onChange(value, option, index)`. Removed `onOption`
  and option mouse handlers; native change is the only selection path.
- Added native disabling, option disabling, form naming/serialization, and reset
  behavior. Primitive values serialize directly; object keys or explicit option
  `formValue` provide meaningful form values. Object values without either fall
  back to indexes. Controlled form reset preserves the current application value.
- Added associated labels, `inputId`, intent-based `inputName`, and native
  `inputAttributes`. Raw ARIA is managed internally; mirrored text and the chevron
  are decorative. Native focus updates the visible border.
- Removed `borderSize` and unused `validate`; renamed the bottom border mode to
  `underline`, matching TextField/TextArea. Applied numeric/CSS width and height,
  accurate span attributes, consistent error/disabled border colors, exact explicit
  padding, and self-contained clipping/layout.
- Replaced broad transitions and `!important` with targeted Water color timing and
  reduced-motion support. Updated stories, type checks, docs, previews, and benchmarks.

The form-layout follow-up adds TextField's `simple`, `stacked`, and `outlined`
label variants, stacked `behavior="appear"`, stable reserved label space, live
reduced-motion fallback, label typography/backing controls, and exact `padding`
with side overrides. `tip` / `errorMessage` share the field inset and a 4px top gap,
provide accessible descriptions, and keep error coloring off the selected value.
Underline backgrounds default to transparent unless a color is explicitly supplied.

Native `option` children are now an alternative to array `options`, using the
same value, form, and label paths. Fragments/conditional entries are flattened;
non-option elements, custom components, mixed sources, option `selected` state,
and non-text option content are rejected. Children use native string values;
arrays retain generic object values and metadata. Native option attributes are
preserved. Docs introduce composition first and the array alternative immediately
next, with the main canvas preview using children.

The current placeholder convention is deliberately retained for the next discussion:
`placeholder` styles index zero; applications provide a selectable first option such
as `-- Choose a status`, usually with an empty value. The leading marker stays in the
menu and is omitted on the closed face. It is not treated as a real selected answer,
but it remains available so users can return to no selection. No new visible
placeholder option is inserted automatically.

## ContentEditable — implemented: editing text in place

Route: `/docs/react/content-editable/`. Sources:
[implementation](../../../../../packages/slice/src/components/ContentEditable/ContentEditable.tsx),
[types](../../../../../packages/slice/src/components/ContentEditable/_types.ts),
[styles](../../../../../packages/slice/src/components/ContentEditable/ContentEditable.module.css).

### Agreed intent

ContentEditable displays text that an application can temporarily make editable, such as
an item title. It does not own its activation gesture or participate in form
submission. The application controls `isEditable` and can attach Slice's
`useDoubleClick` handlers directly, use a single click, or provide a keyboard/edit
button trigger. Keep `isEditable` as an editing-mode prop rather than replacing it
with a form-style `readOnly` contract.

### Issues addressed in this pass

- Enter calls `onChange(null)` and `onSubmit`, then blur repeats both. A single edit
  can trigger duplicate persistence requests; unchanged blur also submits.
- Placeholder text is written into the editable DOM and can be mistaken for saved
  content. Literal text equal to the placeholder is also incorrectly classified.
- The synchronization effect rewrites DOM text when value, placeholder, focus, or
  editability changes, which can discard drafts or disturb the caret.
- Click handling prevents default and propagation, drops the native event payload,
  and uses a custom `onDblClick` name. This obstructs external activation handlers.
  Keyboard handling stops every key before consumers can intervene.
- Range placement uses fixed child offsets that are invalid for empty or more
  complex DOM. Paste does not consistently synchronize the draft and display state.
  `cleanString` removes whitespace/markup from plain user text; blocking angle
  brackets does not make sense when text is rendered safely as text.
- Static text still exposes a textbox role and cannot be selected for copying.
  Wrapping uses invalid `no-wrap`; the inner and outer radius can disagree.
  An unused Motion layer and private width helper add unnecessary machinery.
- `useDoubleClick` returns timer cleanup from an event handler. React does not run
  that return value as unmount cleanup, so pending single-click work needs a hook
  lifecycle cleanup when the activation example is implemented.

### Implementation checklist (completed)

1. Keep a committed/display value and a separate edit-session draft. Snapshot the
   starting value on activation, focus safely, and avoid DOM rewrites during typing.
   External updates should not erase an active draft or move its caret. Define
   how queued external values and external edit-mode exit are resolved explicitly.
2. Replace `onSubmit` with `onCommit`, called once only when the draft differs from
   the session's starting value. Enter and blur share one guarded finish path;
   Escape cancels without committing. `onChange` reports strings only, never null.
   Add a completion notification such as `onEditEnd(reason)` so the owner can exit
   edit mode even when nothing changed. Preserve IME composition and undo shortcuts.
3. Use native `onClick(event)`, `onDoubleClick(event)`, and `onKeyDown(event)`.
   Activation remains application-owned; honor consumer cancellation before handling
   finish keys. No built-in double-click detector or persistence/network ownership.
4. Keep placeholder presentation outside the stored/editable value. Use safe text
   DOM operations and plain-text paste; preserve literal angle brackets and spaces.
   For a single-line title model, pasted line breaks become spaces rather than
   concatenating words. `wrap` controls visual wrapping, not Enter submission.
5. Render normal selectable text outside editing and appropriate textbox semantics
   during editing. Keep accessible naming intent-based. Examples need a keyboard
   activation path in addition to any pointer gesture. Selecting all on activation
   should be optional so click activation can retain natural caret placement.
6. Remove `radius` in favor of `borderRadius` and normalize any retained focus
   request to `focused`. Use `setStyle`, valid wrapping/clamping, self-contained
   flex sizing, consistent radii, and surrounding typography by default. Remove
   the unused Motion wrapper; any visual transitions use Water and reduced motion.

### Documentation and verification

- Introduce the component as editing text in place, with `onCommit` described as
  requesting application persistence rather than submitting a form.
- Show an application-owned activation example using `useDoubleClick`, then an
  immediate single-click alternative and a keyboard/edit-button activation path.
- Demonstrate optimistic local title updates followed by application-owned async
  persistence. Keep pending/error handling outside the base component unless a
  separate need is established.
- Canvas previews: double-click title editing, single-click editing, an empty title
  with a real placeholder, and wrapped/clamped title text. Instructions belong in
  a concise TipBox, not in the rendered title.
- Keep the established Usage/Behavior/Accessibility/alpha Props/Events structure,
  with no repeated prop guidance and only H1/H2/Definition tracking.
- Replace tests that assert the old bugs with focused hidden story fixtures for
  one commit, unchanged edits, cancel, Enter then blur, external activation, native
  event forwarding, placeholders, caret/paste, composition, and external updates.
  Add hook unit coverage for timer cleanup if `useDoubleClick` is updated.

Implemented the edit-session contract above, with `onCommit(value, previousValue)`,
string-only `onChange`, and `onEditEnd(reason)`. Native events now reach the text
surface directly. `radius`, `focus`, `onDblClick`, and `onSubmit` were removed;
activation automatically focuses, so a separate focus prop was unnecessary.
`defaultValue` supports local committed text; controlled `value` stays separate
from the draft. External exit commits changed text, and Escape restores the latest
committed value. Static text inherits typography and remains selectable. Plain-text
paste preserves spaces and angle brackets; placeholders remain presentation only.
The unused Motion layer was removed in favor of CSS Water with reduced motion.
Website/Storybook docs, canvas previews, interaction fixtures, public type exports,
and benchmark scenarios reflect the new API. `useDoubleClick` also cancels pending
single-click work on unmount; its existing manual cancellation API is retained.

## ErrorSummary — implemented

Route: `/docs/react/error-summary/`. Sources:
[implementation](../../../../../packages/slice/src/components/ErrorSummary/ErrorSummary.tsx),
[types](../../../../../packages/slice/src/components/ErrorSummary/_types.ts),
[styles](../../../../../packages/slice/src/components/ErrorSummary/ErrorSummary.module.css).

- Removed numbering and the `autoNumber` prop. Errors are unnumbered groups with
  optional bullet messages; repeated messages render safely and blanks are omitted.
- Kept `feedback-warning` defaults. Added independent `borderColor`, `borderWidth`,
  `borderRadius`, `padding`, and `gap`, with exact CSS dimension handling.
- Replaced the 500px ceiling with internal AnimatePresence height/opacity animation,
  including initial appearance. `motionValues` customizes `initial`, `animate`, and
  `exit` states; partial object overrides retain defaults. `transition` merges with
  Slice's Water defaults; live reduced-motion changes stop movement and
  fading, including an exit already in progress.
- Added a persistent live region: `announcement` defaults to `polite`, with
  `assertive` and `off` alternatives. `summaryName` supplies the accessible name.
  Showing errors does not steal focus; a forwarded native div ref supports
  application-managed focus after validation.
- Entries accept optional stable `id` and `fieldName`. A field title becomes a
  native button when `fieldName` is present. Navigation matches a visible enabled
  input/select/textarea by native `name`, preferring the surrounding form. It
  focuses the control and scrolls its parent into view; reduced motion scrolls
  immediately. Missing targets do nothing.
- Kept native attributes/events on the persistent outer div rather than casting
  them to Motion props. Managed ARIA is intent-based; incidental Motion callbacks
  are not public API. Removed CSS `!important` overrides.
- Updated website/MDX docs, the Motion section, field-navigation and live-validation
  previews, interaction stories, public type checks, and benchmark fixtures. All
  examples place the summary above the fields, reflecting its role as a top-of-form
  overview rather than an individual field’s error message.

## Suggested review order

Start with TextField, then TextArea, so naming, disabled/read-only behavior, focus,
and value contracts can be shared. Review DropDown next for the native-selection
contract, ContentEditable for whether contenteditable is justified, and ErrorSummary last
for integration with the refined fields.

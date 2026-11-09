# Component review batch 05 — in progress

Selected scope: **ProgressIndicator, FileIcon, FileList, UploadArea, and PromptInput**.
ProgressIndicator and FileIcon are complete. FileList is documented for review;
UploadArea and PromptInput are pending.
Together they cover file presentation, upload feedback, and composing messages
with attachments.

Start with a documentation and source-review pass. Describe the current API and
record confirmed findings separately from proposed API decisions. Refine each
component after its review is agreed, updating consumers, website docs, MDX, tests,
and benchmarks together. Follow the [documentation guide](README.md) and
[prop naming standard](../../../../../packages/slice/docs/style-prop-naming.md).

## Selected order and review focus

The topics below are review targets, not confirmed defects.

| Order | Component | Review focus |
| --- | --- | --- |
| 1 | ProgressIndicator | Visibility/lifecycle, timing, reduced motion, accessible loading status. |
| 2 | FileIcon | File/type mapping, fallbacks, sizing/colors, decorative versus meaningful semantics. |
| 3 | FileList | Shared FileItem data, removal callbacks, upload/error feedback, keyboard access and tooltips. |
| 4 | UploadArea | File selection and drag/drop, accepted types, validation, disabled/busy states, composition with FileList. |
| 5 | PromptInput | Controlled text and attachments, submission/IME behavior, working/stop states, accessible controls. |

## Composition to document

- FileList uses FileIcon and ProgressIndicator.
- UploadArea uses FileList and ProgressIndicator.
- PromptInput shares FileItem attachment data with FileList and UploadArea.
- Where supported, connect onToolTip directly to the website layout's shared Tip.
- Show ordinary application usage first, then a focused composed example. Avoid
  adapters or type assertions where related public APIs should connect directly.

## Sources

- [ProgressIndicator](../../../../../packages/slice/src/components/Progress/ProgressIndicator/ProgressIndicator.tsx)
- [FileIcon](../../../../../packages/slice/src/components/FileIcon/FileIcon.tsx)
- [FileList](../../../../../packages/slice/src/components/FileList/FileList.tsx)
- [UploadArea](../../../../../packages/slice/src/components/UploadArea/UploadArea.tsx)
- [PromptInput](../../../../../packages/slice/src/components/PromptInput/PromptInput.tsx)

## ProgressIndicator — done

Route: `/docs/react/progress-indicator/`. Sources:
[implementation](../../../../../packages/slice/src/components/Progress/ProgressIndicator/ProgressIndicator.tsx),
[types](../../../../../packages/slice/src/components/Progress/ProgressIndicator/_types.ts),
[styles](../../../../../packages/slice/src/components/Progress/ProgressIndicator/ProgressIndicator.module.css).

Completed the approved refinement:

- Replaced callback-dependent effects with a tested playback lifecycle. Callback
  changes and Strict Mode replay do not duplicate events or reset the timer.
  Renamed didStart/didStop to onStart/onStop, without compatibility aliases.
- Show controls presence; duration remains in seconds and limits logical playback.
  Expiry leaves a static indicator visible. Zero stops immediately; negative or
  non-finite values have no limit. Very large values use the browser timer maximum.
- Live duration changes reset an active deadline, but do not revive expired
  playback. A new show cycle restarts it. Initially hidden mounts and unmounts do
  not fire stop; hiding an expired cycle does not fire it twice.
- Added motionValues and transition for presence, using Water defaults. Rotation
  uses independent CSS animation. Live reduced motion leaves a static arc and
  bypasses presence transitions/delays, including during exit. Timing/events remain
  logical playback events rather than animation-completion notifications.
- Added label and decorative intent. A persistent polite status region announces
  task text; the SVG is always decorative. Migrated Button/Toast/UploadArea to avoid
  duplicate status, FileList to filename-specific upload labels, and Video to a
  task-specific label. Updated consumer tests for the new semantics.
- Added optional visible label text through displayLabel (false by default), with
  labelPosition left/right/top/bottom (right by default), textSize m, and
  textColor core-text-primary. Visible text does not duplicate announcements.
- Added a forwarded wrapper ref, removed native any/Motion forwarding, !important,
  dead CSS, and the unused pixel-size variable. SVG IDs remain unique. Numeric size
  and speed use safe defaults; stroke is clamped to 0–10 and kept within the viewBox.

Updated website examples, component reference, focused stories, lifecycle unit
coverage, and benchmarks. Benchmarks now render visible spinners rather than
measuring only the hidden component.

Implementation, optional label display/positioning, documentation, and validation
were reviewed and approved; this component review is closed.


## FileIcon — done

Route: `/docs/react/file-icon/`.

Completed the approved refinement:

- Renamed name to the typed type prop, with FileIconTypes and FileIconType exports.
  Added filename accepting a string or File. Explicit type overrides inference;
  missing or unknown types render other.
- Exported resolveFileIconType and reused it in FileList. Resolution uses the
  case-insensitive filename extension or File.name, never MIME type. Clipboard
  files resolve to text; common document, code, image, audio, and video extensions
  share one mapping.
- onClick establishes keyboard interaction independently of the pointer cursor.
  Enter and Space activation deliver the same MouseEvent contract as pointer clicks.
  Native key handlers compose and may preventDefault to cancel activation.
- Added label/decorative intent, keyboard-only focus outlines, protected disabled
  semantics, safe sizing, and a forwarded SVG ref. Simplified styling while
  preserving light/dark artwork.
- Updated website examples, MDX, focused component/unit tests, and benchmarks.
  File actions compose a decorative FileIcon inside a Slice Button with custom
  children.

Implementation and validation were reviewed and approved; this component review is closed.


## FileList — implemented

Route: `/docs/react/file-list/`.

Completed the approved refinement:

- Native removal buttons have filename-specific names and keyboard-only focus
  outlines. Controlled removal preserves surviving nodes and moves focus to the
  next action, previous action, or empty list. List semantics and listName name
  the wrapper; a forwarded ref targets its HTMLDivElement.
- FileItem.id is optional and unique within a list. Explicit IDs preserve identity
  through immutable updates; retained attachment objects or File objects provide
  fallback identity. Recreated objects without IDs may remount; duplicate filenames
  are supported and no longer used as keys.
- Progress is consistently 0–100 percent. Finite values are rounded/clamped;
  missing or nonfinite progress is indeterminate while uploading and defaults to
  100% otherwise. Named progress bars expose numeric values when known, errors
  announce the filename, and decorative spinners avoid duplicate announcements.
- Progress transitions and spinners respect reduced motion. Removed !important
  overrides and unused metadata/style memoization. Preserved the user’s 6px default
  padding using spacing tokens; explicit padding, including zero, remains exact.
- Tooltip hover/focus are coordinated and tips clear on removal, hidden triggers,
  or unmount. UploadArea.onFilesChange accepts the same FileItem[] setter as
  FileList.onChange and PromptInput.onAttachmentsChange; removal is offered only
  when connected and not busy. FileList and its types are now root exports too.
- Updated website examples/reference, MDX, consumers, focused interaction/unit
  coverage, and benchmarks to use stable IDs and percentage progress.

Full unit/browser coverage gates, typechecks, package/website builds, benchmarks,
snippet checks, and Chromium/WebKit interaction checks pass. The implementation is
ready for final review.

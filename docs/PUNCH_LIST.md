# Slice Punch List

A prioritized backlog across five workstreams: browser API hooks, component coverage, unit testing, accessibility, and documentation accuracy. Grounded in a pass over the current `src/` tree (45 components, 18 hooks, 14 stores). Last updated 2026-09-24.

**Priority key:** `P0` next up / highest leverage · `P1` important, not urgent · `P2` nice to have · `P3` opportunistic

The accessibility section was updated on 2026-09-24 from a full local `npm run coverage` run, which passed with every component story gated for a11y (see section 4).

---

## 1. Browser API Hooks & Stores

Already wrapped today, for reference (don't re-add): `localStorage` (`useLocalStore`), IndexedDB (`LocalDB` store, `IndexedDB` util), geolocation (`useWindow`), `matchMedia`/prefers-color-scheme (`useObserveTheme`, `useWindow`), `ResizeObserver` (`useObserveResize`), media devices/mic (`useMicrophone`, `useAudioRecorder`), WebRTC (`useBindWebRTC`, `WebRTC` store), SSE/WebSocket (`SSE`/`WS` stores), Page Visibility (`useActiveTab`, `activeTab` store), BroadcastChannel (`BrowserChannel` util and `browserChannel` store), IntersectionObserver (`useIntersecting`), clipboard (`useClipboard`).

| API | Proposed export | Priority | Notes |
|---|---|---|---|
| Page Visibility API | `useActiveTab`, `useActiveTabStore` | ✅ Done | Standalone hook and shared `activeTab` store observe visibility and document focus via `visibilitychange`, `focus`, and `blur`, with SSR defaults, listener cleanup, unit tests, Storybook demos, and usage docs. |
| BroadcastChannel | `BrowserChannel`, `useBrowserChannelsStore` | ✅ Done | Shipped as a `BrowserChannel` class (`src/utils/objects/browserChannel/broadcastChannel.ts`) plus a singleton `browserChannel` store (`src/stores/browserChannel`) that keeps a named channel registry and the latest message per channel, with atomic hooks (`useBrowserChannels`, `useMessage`, `useParentMessage`, `useIsActiveChannel`, `useBrowserChannelActions`) and imperative getters. Messages can be filtered by parent id. Covered by unit tests, Storybook demos, and MDX docs. There is no standalone `useBroadcastChannel` hook; add one only if a hook-only entry point is wanted. |
| Clipboard API (read + write) | `useClipboard` | ✅ Done | Implemented in `src/hooks/useClipboard/useClipboard.ts` — wraps `navigator.clipboard` read/write with an `execCommand` fallback, observes native `paste` events, and tracks live `clipboard-read`/`clipboard-write` permission state via the Permissions API. Covered by `useClipboard.test.ts`, a Storybook demo, and `useClipboard.mdx`. |
| Fullscreen API | `useFullscreen` | P1 | Currently inlined ad hoc in `Video.tsx` (`video.requestFullscreen()`); worth extracting into a reusable hook so any element can use it. |
| Online/offline status | `useOnlineStatus` | P1 | `navigator.onLine` + `online`/`offline` events. |
| IntersectionObserver | `useIntersecting` | ✅ Done | `src/hooks/useIntersecting`, with tests, stories, and docs. Sibling to `useObserveResize`, and the detection mechanism behind `useInfiniteScroll`. |
| Generic media query | `useMediaQuery` | P1 | `useObserveTheme` is dark/light-specific — a generic breakpoint/query hook is a common ask on top of it. |
| Notifications API | `useNotification` | P2 | Permission request + display wrapper. |
| Web Share API | `useShare` | P2 | `navigator.share` with feature-detection fallback. |
| Screen Wake Lock | `useWakeLock` | P2 | Useful given the video/audio-heavy surface area already in Slice. |
| sessionStorage | `useSessionStore` | P2 | Mirror of `useLocalStore` for tab-scoped state. |
| Idle detection | `useIdle` | P2 | `requestIdleCallback`/inactivity timer — check for existing overlap with `useLastUpdated`. |
| MutationObserver | `useMutationObserver` | P3 | Lower-traffic ask; add if a concrete use case shows up. |

---

## 2. Components — gap check vs. Material Design 3 catalog

Current Slice inventory (45): AudioBubble, Avatar, AvatarGroup, Badge, Button, ButtonBar, Camera, CheckBox, Chip, DataTable, DivInput, Dot, DraggablePanel, DropDown, ErrorSummary, FileIcon, FileList, FlexDiv, Grouper, Icon, IconButton, Label, Level, Modal, ModalController, Overlay, Pager, Progress (ProgressIndicator, DoneCheck), PromptInput, RadioButton, RadioButtonList, Slider, Spacer, Switch, TabBar, TextArea, Textfield, Tip, Toast, ToggleButton, UploadArea, Video, VideoController.

Already covered, functionally equivalent to an M3 component (naming differs — no action needed unless you want to formalize the mapping): Tooltip ≈ `Tip`, Menu ≈ `DropDown`, Snackbar ≈ `Toast`, Dialog ≈ `Modal`/`Overlay`.

### Composite / data components (explicitly requested)

| Component | Priority | Notes |
|---|---|---|
| Table | ✅ Done | Shipped as `DataTable` (`src/components/DataTable`). Column definitions are typed over the row shape (`key` or `accessor`, `createColumnHelper`), with sortable headers (`sort`/`onSortChange`), column resize and drag reorder, and row virtualization (`virtualizeRows`, threshold default 200). Original brief, kept for reference: generic, renderer-driven: accepts **column definitions** (id, header renderer, cell/content renderer per column) and a **data array**, rather than fixed markup. Both header cells and body cells are user-supplied renderers, so consumers can drop any Slice component into a cell. Type the component generically over the row shape so column defs and renderer props stay type-safe end to end (`Column<T>` with `accessor: keyof T | (row: T) => unknown`, `renderHeader?`, `renderCell?`). Sorting/selection/row-virtualization are natural P1/P2 follow-ons once the core renderer contract lands. |
| Infinite Scroll (list) | P2 | The hook half is done: `useInfiniteScroll` (`src/hooks/useInfiniteScroll`) loads pages through an async loader, appends results, and observes a sentinel with `useIntersecting`. It supports `root`, `rootMargin` prefetch, `resetKey`, `retry()` and `reset()`, with tests, stories, and docs. Remaining: an optional thin wrapper component around it for arbitrary list content (composing with `FileList`, `DataTable`, or a future generic `List`), only if a concrete need shows up. |


| Missing component | Priority | Notes |
|---|---|---|
| Card | P0 | Notable gap — one of the most fundamental, highest-reuse primitives in almost any design system, and Slice doesn't have one yet. |
| Divider | P0 | Small surface area, very high reuse; cheap win. |
| Search (input/bar) | P1 | `Textfield` exists but there's no dedicated search affordance (icon, clear button, submit semantics). |
| Date Picker | P1 | Common product need, none of the existing inputs cover it. |
| Navigation Drawer | P1 | `DraggablePanel` is adjacent but isn't purpose-built as a nav drawer — evaluate reuse vs. new component. |
| App/Top Bar | P1 | No dedicated header/toolbar component. |
| Bottom Sheet | P2 | Mobile-pattern sheet; `DraggablePanel` may cover part of this — evaluate before building new. |
| FAB (Floating Action Button) | P2 | |
| Navigation Bar (bottom nav) | P2 | |
| Navigation Rail | P2 | |
| Carousel | P2 | |
| Time Picker | P2 | Could likely share infrastructure with a new Date Picker. |
| Generic List / ListItem | P2 | `FileList` and `RadioButtonList` are purpose-built; no general-purpose list primitive. |
| Segmented Control | P3 | `ButtonBar`/`ToggleButton` may already approximate this — confirm before building new. |

---

## 3. Unit Tests — path to ~80% coverage

**Superseded by [UNIT_TEST_COVERAGE_PLAN.md](./UNIT_TEST_COVERAGE_PLAN.md), 2026-09-16.** This section was written without a real coverage run (see "How this list was built" below) and used file-existence checks as a rough proxy. The linked doc is built from an actual `npm run coverage` run (`reports/coverage/coverage-final.json`) with a tiered, per-file punch list. This section's other finding — hooks/stores mostly already have tests, gaps are narrower than "nothing is tested" — held up against the real data.

## 4. Accessibility

**Status as of 2026-09-24:** the full local `npm run coverage` run passes. `.storybook/preview.tsx` sets `parameters.a11y.test: 'error'` globally, so a pass means axe found no violations on any gated story. Every component story is gated; hooks and stores render nothing, so accessibility only applies to components. The gate is silent on success, so there is no per-component report; open the Accessibility panel in `npm run storybook` if you want to see passes and "incomplete" results, not just failures.

**Beyond axe:** automated checks miss keyboard and screen-reader behavior, so a manual pass is still worth doing on these (risk areas based on implementation patterns, not confirmed violations):

- `DivInput` — contenteditable-based text input with custom clipboard/paste handling; these often miss proper `role`/`aria-*` wiring that a native `<input>` gets for free.
- `DropDown`, `Modal`, `Overlay` — focus trap, focus return on close, and ARIA `role`/`aria-modal`/`aria-expanded` correctness are the usual failure points for these.
- `Slider` — keyboard operability and `aria-valuenow`/`aria-valuemin`/`aria-valuemax` announcements.
- `Switch`, `CheckBox`, `RadioButton` — confirm `role` + `aria-checked` state is exposed correctly for custom-styled controls.
- `Camera` toolbar — the disabled Photo button is nearly invisible (25% opacity on a bar-colored circle); check the disabled state's contrast and whether the icon color should change with it.

**Priority scheme for any findings:** P0 = keyboard traps / content unreachable by screen reader, P1 = missing or incorrect ARIA labels/roles, P2 = color-contrast findings.

---

## 5. Documentation audit

Snapshot: 28 files under `documentation/` (Welcome, QuickStart, ThemeTokens, Motion, Icons, BrandColors, FunnelSans, Typesizes, AboutStores, Benchmarks, Support + shared MDX components), and per-component/per-hook `.mdx` docs are structurally complete — only one folder (`Progress`) lacks its own top-level `.mdx`/story, and that's because it's a composite of `ProgressIndicator` and `DoneCheck`, which are each documented individually, so not a real gap.

The open question isn't "do docs exist" — it's whether they're still *accurate*. Where a check below turns up a mismatch, the fix isn't always "update the doc" — reconcile in whichever direction is actually correct: if the code drifted from a documented convention, fix the code; if the convention itself changed, update the doc. Suggested audit pass:

| Task | Priority | Notes |
|---|---|---|
| Verify README/QuickStart install & usage snippets against the current API | P1 | First-impression surface; e.g. confirm the `zustand` peer-dependency note, the Funnel Sans font-loading snippet, and the `ThemeProvider` example still match current props. |
| Spot-check each hook/component `.mdx` prop table against its actual TS types | P1 | Highest risk of drift is anywhere an API changed but the doc wasn't updated in the same PR. |
| Confirm `CONTRIBUTING.md` commands still work as written | P2 | e.g. Node version requirement, `npm run` script list — cross-check against current `package.json` scripts. |
| Reconcile `contributor-docs/build-architecture.md`, `style-prop-naming.md`, and the new `spacing.md` against the actual codebase — fix whichever side is stale | P1 | For `build-architecture.md`: diff its description against the real `rollup.config.js`/`tsconfig.build.json`/`scripts/*` pipeline. For `style-prop-naming.md`: spot-check documented naming conventions (e.g. style-prop patterns) against how components actually name their props today — if components have drifted from the documented convention, that's a codebase fix (rename/align props), not just a doc edit; if the convention documented is simply outdated, update the doc instead. For `spacing.md` (added 2026-09-24 from `docs/spacing-tbd.md`), spot-check the per-component table against current defaults. Contributor-facing and lower traffic than user-facing docs, but same drift risk, and it's the doc new contributors will trust literally. |
| Audit external links (fonts CDN, docs site, GitHub repo URL) for correctness | P2 | Quick pass, easy to script with a link checker. |

---

## How this list was built

The original pass (2026-09-08) walked the repo directly (`src/hooks`, `src/stores`, `src/components`, `src/utils`, `src/providers`, `documentation/`, `.github/workflows/`) and used a Material Design 3 component catalog lookup for the component gap analysis. It could not run Storybook or the test suite from its sandbox. The 2026-09-24 update reflects new work in the repo (BrowserChannel, `useActiveTab`, `useIntersecting`, `useInfiniteScroll`, `DataTable`) and a passing local `npm run coverage` run.

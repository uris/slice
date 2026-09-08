# Slice Punch List

A prioritized backlog across five workstreams: browser API hooks, component coverage, unit testing, accessibility, and documentation accuracy. Grounded in a pass over the current `src/` tree (44 components, 14 hooks, ~12 stores) on 2026-09-08.

**Priority key:** `P0` next up / highest leverage · `P1` important, not urgent · `P2` nice to have · `P3` opportunistic

Two sections below (accessibility findings, the 3 failing interaction tests) are marked `TODO` — they need to come from actually running Storybook/Vitest, which wasn't possible from this session (see "How this list was built" at the bottom). Fill those in and this doc is ready to drive real work.

---

## 1. Browser API Hooks & Stores

Already wrapped today, for reference (don't re-add): `localStorage` (`useLocalStore`), IndexedDB (`LocalDB` store, `IndexedDB` util), geolocation (`useWindow`), `matchMedia`/prefers-color-scheme (`useObserveTheme`, `useWindow`), `ResizeObserver` (`useObserveResize`), media devices/mic (`useMicrophone`, `useAudioRecorder`), WebRTC (`useBindWebRTC`, `WebRTC` store), SSE/WebSocket (`SSE`/`WS` stores).

| API | Proposed export | Priority | Notes |
|---|---|---|---|
| Page Visibility API | `usePageVisibility` (or `useActiveTab`) | P0 | Explicitly requested. `document.visibilityState` + `visibilitychange`. |
| BroadcastChannel | `useBroadcastChannel` | P0 | Explicitly requested. Cross-tab messaging; pairs well with the existing store pattern. |
| Clipboard API (read + write) | `useClipboard` | P0 | Upgrades the existing write-only `copyToClipboard` util (`src/utils/functions/misc.ts`) into a real hook with read support, paste events, and permission state. |
| Fullscreen API | `useFullscreen` | P1 | Currently inlined ad hoc in `Video.tsx` (`video.requestFullscreen()`); worth extracting into a reusable hook so any element can use it. |
| Online/offline status | `useOnlineStatus` | P1 | `navigator.onLine` + `online`/`offline` events. |
| IntersectionObserver | `useIntersectionObserver` / `useInView` | P0 | Natural sibling to `useObserveResize`. Bumped to P0 — it's the detection mechanism the new Infinite Scroll component (below) should be built on, rather than scroll-event polling. |
| Generic media query | `useMediaQuery` | P1 | `useObserveTheme` is dark/light-specific — a generic breakpoint/query hook is a common ask on top of it. |
| Notifications API | `useNotification` | P2 | Permission request + display wrapper. |
| Web Share API | `useShare` | P2 | `navigator.share` with feature-detection fallback. |
| Screen Wake Lock | `useWakeLock` | P2 | Useful given the video/audio-heavy surface area already in Slice. |
| sessionStorage | `useSessionStore` | P2 | Mirror of `useLocalStore` for tab-scoped state. |
| Idle detection | `useIdle` | P2 | `requestIdleCallback`/inactivity timer — check for existing overlap with `useLastUpdated`. |
| MutationObserver | `useMutationObserver` | P3 | Lower-traffic ask; add if a concrete use case shows up. |

---

## 2. Components — gap check vs. Material Design 3 catalog

Current Slice inventory (44): AudioBubble, Avatar, AvatarGroup, Badge, Button, ButtonBar, Camera, CheckBox, Chip, DivInput, Dot, DraggablePanel, DropDown, ErrorSummary, FileIcon, FileList, FlexDiv, Grouper, Icon, IconButton, Label, Level, Modal, ModalController, Overlay, Pager, Progress (ProgressIndicator, DoneCheck), PromptInput, RadioButton, RadioButtonList, Slider, Spacer, Switch, TabBar, TextArea, Textfield, Tip, Toast, ToggleButton, UploadArea, Video, VideoController.

Already covered, functionally equivalent to an M3 component (naming differs — no action needed unless you want to formalize the mapping): Tooltip ≈ `Tip`, Menu ≈ `DropDown`, Snackbar ≈ `Toast`, Dialog ≈ `Modal`/`Overlay`.

### Composite / data components (explicitly requested)

| Component | Priority | Notes |
|---|---|---|
| Table | P0 | Generic, renderer-driven: accepts **column definitions** (id, header renderer, cell/content renderer per column) and a **data array**, rather than fixed markup. Both header cells and body cells are user-supplied renderers, so consumers can drop any Slice component into a cell. Type the component generically over the row shape so column defs and renderer props stay type-safe end to end (`Column<T>` with `accessor: keyof T | (row: T) => unknown`, `renderHeader?`, `renderCell?`). Sorting/selection/row-virtualization are natural P1/P2 follow-ons once the core renderer contract lands. |
| Infinite Scroll (list) | P0 | Reveals/loads more items as the user scrolls toward the end of a list. Build on the `useIntersectionObserver` hook above (sentinel-element detection) rather than scroll-event polling, so it composes cleanly with `FileList`, a future generic `List`, and the new `Table`. Consider exposing it as both a hook (`useInfiniteScroll`) and a thin wrapper component, so it can wrap arbitrary list content. |


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

**Correction to the working assumption:** hooks and stores are *not* uniformly untested — most already have `.test.ts` files (11 of 14 hooks, 11 of 12 store groups). The real gaps are narrower than "hooks/stores have no tests":

| Area | Missing test file | Priority |
|---|---|---|
| Hooks | `useBindWebRTC`, `useObserveResize`, `useTrackRenders` | P0 |
| Stores | `LocalDB` | P0 |
| `utils/objects` | `IndexedDB`, `WebRTCConnection`, `MDStreamBuffer` (siblings `audioVisualizer`, `SSEConnection`, `WSConnection` already have tests) | P1 |
| `theme/*` | No tests at all for `colors`, `corners`, `elevations`, `motion`, `type`, `themes` (pure functions — cheap to cover) | P1 |
| `providers` | `ThemeProvider`, `themeServer` — zero test coverage | P1 |
| Components | Currently covered only via Storybook interaction/render tests through stories — no separate unit tests. Fine as a strategy, but confirm it's actually wired into the coverage number (see below). | — |

**Failing interaction tests (3):** `TODO` — needs the component/story names filled in. Run `npm run storybook` or the storybook Vitest project and paste the failures here; they'll get triaged into P0 since regressions block the coverage push.

**Plan to reach 80%:**
1. **P0** — Fix the 3 failing interaction tests first; a red suite makes coverage numbers unreliable and blocks CI adoption.
2. **P0** — Run `npm run coverage` to get a real baseline number (this session couldn't run it — see note at bottom) and confirm the storybook project's browser tests are actually included in the coverage merge.
3. **P0** — Add tests for the 4 zero-coverage hook/store gaps above; highest coverage-per-effort since they're isolated units.
4. **P1** — Add tests for the 3 `utils/objects` gaps and the pure `theme/*` functions.
5. **P1** — Add `ThemeProvider`/`themeServer` tests.
6. **P1** — Add a CI workflow that runs `npm run test` and `npm run coverage` on PRs (today `.github/workflows/` only has `deploy-site.yml` — there's no automated test gate at all). Wire an 80% threshold check.
7. **P2** — Once the baseline is real, revisit whether story-based "coverage via demos" is actually asserting behavior (interaction tests) vs. just rendering (which inflates coverage without verifying correctness).

---

## 4. Accessibility

`TODO` — the Storybook a11y addon (`@storybook/addon-a11y`, already installed) needs to actually run to produce real findings; this session couldn't launch Storybook/the browser test runner. Run `npm run storybook`, open each story's Accessibility panel (or run the addon-vitest browser project), and drop the flagged components + violation types here.

Until that list exists, a few components worth a close look based on their implementation patterns (not confirmed violations — just where risk tends to hide):

- `DivInput` — contenteditable-based text input with custom clipboard/paste handling; these often miss proper `role`/`aria-*` wiring that a native `<input>` gets for free.
- `DropDown`, `Modal`, `Overlay` — focus trap, focus return on close, and ARIA `role`/`aria-modal`/`aria-expanded` correctness are the usual failure points for these.
- `Slider` — keyboard operability and `aria-valuenow`/`aria-valuemin`/`aria-valuemax` announcements.
- `Switch`, `CheckBox`, `RadioButton` — confirm `role` + `aria-checked` state is exposed correctly for custom-styled controls (vs. relying on native `<input type="checkbox">` semantics being visually hidden but present).

**Priority scheme to apply once real findings land:** P0 = keyboard traps / content unreachable by screen reader, P1 = missing or incorrect ARIA labels/roles, P2 = color-contrast findings.

---

## 5. Documentation audit

Snapshot: 28 files under `documentation/` (Welcome, QuickStart, ThemeTokens, Motion, Icons, BrandColors, FunnelSans, Typesizes, AboutStores, Benchmarks, Support + shared MDX components), and per-component/per-hook `.mdx` docs are structurally complete — only one folder (`Progress`) lacks its own top-level `.mdx`/story, and that's because it's a composite of `ProgressIndicator` and `DoneCheck`, which are each documented individually, so not a real gap.

The open question isn't "do docs exist" — it's whether they're still *accurate*. Suggested audit pass:

| Task | Priority | Notes |
|---|---|---|
| Verify README/QuickStart install & usage snippets against the current API | P1 | First-impression surface; e.g. confirm the `zustand` peer-dependency note, the Funnel Sans font-loading snippet, and the `ThemeProvider` example still match current props. |
| Spot-check each hook/component `.mdx` prop table against its actual TS types | P1 | Highest risk of drift is anywhere an API changed but the doc wasn't updated in the same PR. |
| Confirm `CONTRIBUTING.md` commands still work as written | P2 | e.g. Node version requirement, `npm run` script list — cross-check against current `package.json` scripts. |
| Check `contributor-docs/build-architecture.md` and `style-prop-naming.md` for staleness | P2 | Contributor-facing, lower traffic, but same drift risk. |
| Audit external links (fonts CDN, docs site, GitHub repo URL) for correctness | P2 | Quick pass, easy to script with a link checker. |

---

## How this list was built

Generated by walking the repo directly (`src/hooks`, `src/stores`, `src/components`, `src/utils`, `src/providers`, `documentation/`, `.github/workflows/`) plus a Material Design 3 component catalog lookup for the component gap analysis. The Storybook a11y results and the 3 failing interaction test names could **not** be gathered automatically — this session's sandbox has a Linux `node_modules` mismatch against the Mac's native build (`@rollup/rollup-linux-arm64-gnu` missing), and fixing that risked writing Linux binaries into your real project's `node_modules`. Run `npm run storybook` / `npm run coverage` locally and update the two `TODO` sections above with real output.

# Writing Tests

This is the deeper how-to behind the split in [CONTRIBUTING.md#testing-strategy](../CONTRIBUTING.md#testing-strategy).
Read that section first for the high-level rule (components vs. everything else); this doc covers
the conventions and gotchas you'll actually hit while writing either kind.

## Which kind of test does this need?

- **Renders something?** It's a component test: a `play:` function in the component's own
  `src/components/<Name>/<Name>.stories.tsx`, run by `@storybook/addon-vitest` (the `storybook`
  Vitest project, real Chromium via Playwright). There is no separate `<Name>.test.tsx` — the
  story *is* the test.
- **Doesn't render anything?** Hooks, stores, `src/utils` objects/functions, API/browser
  abstractions — a plain colocated `<name>.test.ts` (the `unit` Vitest project, `jsdom`). Do not
  reach for a story here just because the hook happens to be used inside a component somewhere.

Both projects feed one merged coverage report, but they don't cover for each other. A hook with
no `.test.ts` shows as uncovered even if a story renders a component that calls it — rendering
doesn't exercise every branch of what's underneath. If you touched a hook or store, it needs its
own `.test.ts`, full stop.

## Component tests: one story is one test

A story with a `play:` function makes an assertion about one specific rendered behavior. Query
the DOM the way a user or assistive tech would, in this order of preference:

1. `getByRole` with an accessible name (`canvas.getByRole('button', { name: 'close' })`)
2. `getByLabelText` / `aria-label` you control
3. `data-testid` as a last resort for something with no sensible role/name (e.g. a plain `<span>`
   used purely as a done-loading flag)

Avoid matching on CSS Module class names (`canvasElement.querySelector('[class*="close"]')`).
Class names are hashed at build time and the substring match can silently fail to find anything —
that exact bug once made a ModalController test pass for the wrong reason (a `closeButton` guard
that quietly evaluated to `null` and skipped the click it was supposed to make). The fix ended up
being a real accessibility improvement: `Modal.tsx`'s icon-only close button was missing an
`aria-label`, so it had no accessible name to query by in the first place. If you find yourself
reaching for a class-name selector, ask whether the component is actually missing an aria
attribute it should have anyway.

(`playHelpers.ts`'s `getOverlay()` — matching `[class*="overlay"]` — is a deliberate, narrow
exception for a wrapper element that genuinely has no better hook. Don't take it as precedent for
everything else.)

## The `tests` tag

`tags: ['tests']` is a **Storybook sidebar filter only** (`.storybook/main.ts` sets
`tags: { tests: { defaultFilterSelection: 'exclude' } }`). It hides a story from the default
sidebar view so consumers browsing the docs aren't wading through prop-combination variants meant
for coverage, not documentation.

**It has zero effect on `vitest --project=storybook`.** A tagged story's `play:` function still
runs, and it still counts fully toward coverage. Tagging something `tests` is not a way to skip
or de-prioritize it — it's purely about what a human sees in the Storybook UI.

The convention (see `Avatar.stories.tsx` for the original example, or `ModalController`, `Toast`,
`Video`, `DataTable` for larger ones):

- Keep one untagged story (`Demo` or `Default`) that's meant to be actually browsed — it should
  render well and, if it has a `play:` function, keep that function light and documentation-y.
- Put every other prop combination or interaction flow you need for coverage behind its own
  `tags: ['tests']` story, each with a narrow, single-purpose `play:` function.

## Prefer several small isolated stories over one long sequential one

It's tempting to write a single story whose `play:` function marches through every interaction
the component supports — open the modal, resolve it, reopen it, reject it, reopen it again,
dismiss it — because it's fewer stories to name and think about. Don't. That shape is fragile in
ways that are hard to debug because failures show up several steps downstream of their actual
cause:

- **Animation timing.** A Framer Motion exit animation can keep a "closed" dialog mounted for
  ~0.35s after the resolving action returns. A sequential story that reopens too soon interacts
  with a stale instance and fails an assertion that looks unrelated to timing at all.
- **Shared module-level state.** A Zustand store used by the component (see the next section) is
  a singleton across every story in the file. A `clear()` triggered by an exit animation can land
  *after* the next step in the sequence has already pushed new state, wiping it out. The failure
  shows up as "element not found" for content that really was there a moment ago.
- **One flaky step fails everything downstream of it**, and the failure message points at the
  step that broke, not necessarily the step that caused it.
- **They're harder to extend.** Adding one more prop combination to a monolithic play function
  means understanding and not breaking every step before it.

Splitting into isolated stories - each with its own fresh mount and a `play:` function that does
one thing - removes entire classes of these bugs by construction, not by adding more waits and
guards to a long function. See `ModalController.stories.tsx` (`Default` /
`ResolveViaPrimaryAction` / `RejectViaCloseButton` / `DismissViaBackdrop`), `Toast.stories.tsx`, or
`Video.stories.tsx` (`Default` / `PlaybackLifecycle` / `NativeControls` / `ControlsHidden` /
`ImperativeRefControls` / `HoverAndCustomControls`) for the pattern applied to components that
used to be single sprawling stories.

## Resetting shared state at the top of `play`

If a component reads from a Zustand store created at module scope (`export const useToast = ...`,
`export const toastActions = ...`), that store is one singleton shared by every story in the file
- and across every test run within a single `vitest --project=storybook` invocation. A previous
story's leftover state, or an in-flight async `clear()` still pending from a dismiss animation,
can bleed into the next story before its own `play:` function even starts.

Guard against this defensively: call the store's imperative reset as the very first line of every
`play:` function that touches it, even if you're fairly sure the previous story already cleaned up
after itself.

```tsx
import { modalActions as modalActionsImperative, useModalActions } from '../../stores';

export const ResolveViaPrimaryAction: StoryObj<typeof ModalController> = {
  tags: ['tests'],
  render: (args) => <ModalControllerDemo {...args} />,
  play: async ({ canvasElement, args }) => {
    // the store is a module-level singleton shared across every story in this
    // file - reset it before this one runs so a previous story's leftover
    // state (or a slow pending clear() from an exit animation) can never
    // bleed into this run
    modalActionsImperative.clear();
    await runModalControllerResolveViaPrimaryActionPlay({ canvasElement, args });
  },
};
```

Import the store's action object under an aliased name (`modalActions as modalActionsImperative`,
`toastActions as toastActionsImperative`) alongside whatever hook-based accessor the component
itself uses, so it's obvious at the call site that this is the defensive reset, not part of the
interaction under test.

## Other gotchas worth knowing before you hit them

- **Hover the element that actually has the listener, not `canvasElement`.** `userEvent.hover()`
  only fires `mouseenter`/`mousemove` on the exact element you pass it. If a component's hover
  state lives on its own wrapper div (`onMouseEnter` on `css.wrapper`, say) and you hover the
  outer Storybook canvas root instead, the component's `hovered` state never flips - every
  descendant control gated behind `pointer-events: none` until hover stays permanently
  unreachable, silently. Query the component's actual interactive root
  (`canvasElement.querySelector('[class*="wrapper"]')`) and hover that.
- **Real fixtures beat remote URLs for anything playback-dependent.** A story that needs a real
  `<video>` to actually play, pause, seek, and end should point at a small, local, checked-in
  clip (see `public/video/sample.mp4`, generated with `ffmpeg`) rather than a network-hosted demo
  URL. It removes a network dependency from CI, and — combined with `muted: true` on that specific
  story - sidesteps Chromium's autoplay-gesture policy entirely instead of needing a runtime
  `video.muted = true` override.
- **Headless Chromium has no real display.** `requestFullscreen()`/`exitFullscreen()` reliably
  reject there; write your component so those calls are already caught (`.catch(() => null)`) and
  your test so it doesn't assert real fullscreen actually engaged - just that the ref/handler
  wiring got called correctly.
- **Mock `window.alert` before clicking through a flow that triggers one.** A real `alert()` call
  blocks the test runner. Use `spyOn(window, 'alert').mockImplementation(() => undefined)` from
  `storybook/test`, and `mockRestore()` it when you're done with that story's play function.

# Contributing to Slice

This repository contains the source for the `@apple-pie/slice` package, Storybook docs, and benchmark tooling.

## Local Setup

Requirements:

- Node.js 20+ (CI runs Node 20; see `.github/workflows/ci.yml`)
- npm

Install dependencies:

```bash
npm install
```

Start the main local workflows:

```bash
npm run dev
npm run storybook
npm run test
npm run coverage
npm run benchmark
npm run build
npm run lint
```

## Repository Layout

- `src/components` React components and their local public entrypoints
- `src/hooks` hooks and hook subpath entrypoints
- `src/providers` providers
- `src/stores` optional Zustand-backed stores
- `src/workers` publishable worker entrypoints
- `src/theme` theme tokens, presets, and typed theme utilities
- `src/utils` package utilities and low-level objects
- `documentation` Storybook docs pages and doc-only helpers
- `benchmarks` Vitest benchmark suite
- `contributor-docs` contributor-specific implementation notes

## Testing Strategy

Vitest runs two projects side by side. `npm test` runs both during local dev; `npm run coverage` runs both together with coverage merged into a single report (this is what CI enforces).

- **Components — anything rendered:** write interaction tests as `play:` functions inside the component's own `src/components/<Name>/<Name>.stories.tsx`, using the Storybook Vitest addon (the `storybook` project). A story with a `play` function *is* the test for that behavior — there is no separate `<Name>.test.tsx`. Stories without a `play` function are fine for pure visual/docs examples, they just don't add coverage.
- **Everything non-visual — hooks, stores, `src/utils` objects and functions, API/browser abstractions:** write plain Vitest unit tests colocated with the source as `<name>.test.ts` (the `unit` project, `jsdom` environment). These do not belong in stories.
- Both projects feed the same coverage report. A hook or store with no accompanying `.test.ts` will show as uncovered even if it's used inside a story — rendering a component doesn't exercise every branch of the store it happens to call into. Write the unit test.

For the `tests` tag convention, why to prefer several small isolated stories over one long
sequential `play:` function, and how to reset module-level store state (Zustand) at the top of a
story's `play:` function, see [contributor-docs/writing-tests.md](./contributor-docs/writing-tests.md).

### Accessibility gate

`@storybook/addon-a11y` runs axe-core checks against every story as part of the `storybook`
Vitest project. `.storybook/preview.tsx` sets `parameters.a11y.test: 'error'` as the global
default, so every `Components/*` and `Providers/*` story — including new ones — is gated: an
accessibility violation fails that story's test, `npm run coverage`, and the `Test & Coverage`
CI check.

`src/hooks/**` and `src/stores/**` stories exist to demo a hook or store's behavior, not to
test the components they compose — those components already have their own gated story. Every
existing file under those two directories overrides the default with
`parameters: { a11y: { test: 'todo' } }` in its meta: checks still run and violations still
show up in the Accessibility panel, they just don't fail the build.

**New story files under `src/hooks` or `src/stores` do not inherit that override.** They pick
up the global `'error'` default like everything else and will be gated unless you add the
`parameters: { a11y: { test: 'todo' } }` override yourself. New `src/components/*.stories.tsx`
files need no extra step — they're gated automatically.

**BTW: a green `npm run coverage` run does not mean anyone has seen the accessibility
results.** The Vitest/`storybookTest` integration only surfaces a11y as a pass/fail assertion —
no violation, pass, or incomplete detail is written to the terminal, `reports/coverage`, or CI
logs, whether a story is gated (`'error'`) or non-blocking (`'todo'`). The only place that
detail actually shows up is the interactive Accessibility panel: run `npm run storybook`, open
the testing widget in the sidebar, check "Accessibility," and click "Run tests" (or just open
any story — the panel updates live as you browse). Treat a green coverage run as "nothing
failed," not "someone reviewed this."

### Coverage gate

`vitest.config.ts` defines `coverage.thresholds` (statements/branches/functions/lines) as a
manual floor, not an auto-generated target. `autoUpdate` is intentionally off — it caused
several problems when it was on (silently rewriting the file on every run, including
reformatting it wholesale) — so the threshold numbers only change when a contributor hand-edits
them. CI runs `npm run coverage` and fails the build if coverage drops below the committed
thresholds.

The committed numbers are set roughly 1.5 points below the last confirmed-stable full-suite
measurement, on purpose: v8/browser-mode coverage has run-to-run measurement noise (a few
hundredths of a percent), so a threshold matched exactly to one run fails intermittently with
no real regression.

To raise the floor after you've genuinely increased coverage: run `npm run coverage` locally a
few times to find a stable current number, hand-set the threshold values in
`vitest.config.ts` to roughly 1.5 points below that, and run `npm run lint` to fix formatting
before committing. Never set the numbers to exactly the last measured run, and never lower them
to make a failing PR pass.

### Lint gate

Run `npm run lint` locally before opening a PR — it formats the codebase and reports remaining issues. CI runs `npm run lint:ci` (`biome ci .`), which checks formatting, lint rules, and import order without writing anything; any issue fails the build.

### Typecheck gate

Biome does not type-check. `npm run typecheck` (`tsc --noEmit -p tsconfig.json`) does, and it covers `src/**/*` including `*.stories.tsx` files and `documentation/**/*` — the build configs exclude stories, so this is the only place story typings are checked. It is also part of `npm run lint`, `lint:fix` and `lint:ci`, so the `Lint` check in CI fails on type errors.

## Contribution Rules

- Component style props must follow the naming standard in [contributor-docs/style-prop-naming.md](./contributor-docs/style-prop-naming.md) (e.g. `backgroundColor`/`backgroundColorHover`, not `bgColor`/`bgColorHover`). New components must use only the standard names; existing components get renamed to match only as part of an intentional breaking change.
- Component padding and insets must follow the spacing standard in [contributor-docs/spacing.md](./contributor-docs/spacing.md): use the `--spacing-*` tokens, express icon-side reductions with token-based `calc()`, and apply explicit padding overrides exactly (including zero).
- Keep public exports intentional. New files are not automatically public unless they are wired into the relevant entrypoints and `package.json` `exports`.
- Put Storybook examples in `*.stories.ts(x)` or `documentation/**`.
- Do not import story files into production source. That can leak story typings into `dist/types`.
- If you add a new package subpath, update both Rollup entry discovery and `package.json` `exports`.
- Keep package stylesheet behavior intentional. Public theme and base styles are published through `@apple-pie/slice/styles.css`, which is built from `src/theme.css`.
- `ThemeProvider` manages theme state and document attributes. It does not bootstrap theme CSS by itself.
- If you move or rename public CSS files, update `src/theme.css`, the build pipeline, `package.json` `exports`, and public usage docs in the same change.
- Component CSS Modules (`src/components/**/*.module.css`) must stay unlayered and must not use `!important`. That is what lets them always win the cascade against page-level or docs-only CSS, regardless of specificity.
- Global, bare-tag-selector CSS meant only for Storybook docs cosmetics (e.g. `.storybook/preview-body.html`, MDX prose styling) must be wrapped in `@layer slice-docs-chrome`, not left unlayered and not forced with `!important`. Unlayered rules always beat layered ones, so this guarantees docs styling can never leak into and override an actual component's rendered output on a docs page.

## Component Lifecycle Checklist

When adding a new component or making a material change to an existing one:

1. Add or update the component source under `src/components/<Name>/`.
2. Keep the local public entrypoint current in `src/components/<Name>/index.ts`.
3. Re-export from `src/index.ts` if the component belongs on the package root API.
4. Add or update Storybook interaction coverage (a `play:` function) in `src/components/<Name>/<Name>.stories.tsx` for the component's rendered behavior. If the change also touches a hook, store, or util, add or update its own `<name>.test.ts` — see [Testing Strategy](#testing-strategy).
5. Add or update benchmark coverage:
   - add or update `benchmarks/components/<Name>.bench.tsx`
   - add or update the config in `benchmarks/configs/all-configs.tsx`
   - export the benchmark from `benchmarks/components/index.ts`
6. Re-run the generated benchmark report with `npm run benchmark` when benchmark coverage changes.
7. If the benchmark report changed intentionally, verify the Storybook benchmarks page still renders the updated `reports/benchmark-results.md`.
8. Run `npm run build` and verify the component output exists in `dist/cjs`, `dist/esm`, and `dist/types`.
9. Run `npm run lint` (Biome + typecheck) and `npm run coverage` and confirm both pass — CI enforces both and will block the merge otherwise.

## Build and Package Validation

Before opening a PR or publishing:

1. Run `npm run build`.
2. Run `npm pack --dry-run`.
3. Verify the new or changed API appears under `dist/cjs`, `dist/esm`, and `dist/types`.
4. Verify `dist/styles.css` contains the expected shared theme or component styles when CSS output changed.
5. Verify Storybook files do not appear in `dist/types`.
6. Run `npm run benchmark` when component performance coverage or benchmarkable behavior changed.

Build architecture details: [contributor-docs/build-architecture.md](./contributor-docs/build-architecture.md)

## Publishing Notes

- The package name is `@apple-pie/slice`.
- The current package metadata is defined in `package.json`.
- `README.md` is part of the published package, so public-facing usage and install guidance should stay current.
- This repo is preparing for public GitHub visibility, so contributor docs should avoid private-only assumptions.

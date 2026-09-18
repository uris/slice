# Working in this repo

Read [CONTRIBUTING.md](./CONTRIBUTING.md) first — it's the source of truth for setup, the
component lifecycle, testing strategy, and the lint/coverage/build gates CI enforces. For
build/publish pipeline detail, read [contributor-docs/build-architecture.md](./contributor-docs/build-architecture.md);
for component prop naming, [contributor-docs/style-prop-naming.md](./contributor-docs/style-prop-naming.md);
for how to actually write a component test vs. a regular one, [contributor-docs/writing-tests.md](./contributor-docs/writing-tests.md).

Do not duplicate guidance from those docs into this file. If something here and something in
CONTRIBUTING.md disagree, CONTRIBUTING.md wins — fix this file, not the other way around.

## Operational notes (things that aren't obvious from the docs alone)

- **`autoUpdate` on `vitest.config.ts`'s coverage thresholds is intentionally off** — see
  [CONTRIBUTING.md](./CONTRIBUTING.md#coverage-gate) for why the thresholds are a deliberate
  floor rather than the last measured number. It caused real problems when it was on: it
  rewrites the file on every run, and that kind of rewrite reformats the whole file (spaces
  instead of tabs) and can silently drop unrelated comments elsewhere in it. If any tool
  (a codemod, an editor action, flipping `autoUpdate` back to `true`) rewrites this file
  wholesale, diff the *entire* file before committing, not just the lines you expect to have
  changed, and run `npm run lint` afterward to restore formatting.
- **`npm run coverage` requires a working Playwright Chromium install.** If it's missing, the run
  aborts but still prints a full coverage table showing every file at 0% — that table is not a
  real signal, it means the browser never launched. Check the actual error above it before
  trusting a 0%-everywhere report.
- **`npm run lint` auto-formats (writes fixes).** `npm run lint:ci` (`biome ci .`) is what CI
  actually runs — it only checks, never writes. Use `lint:ci` to verify something is truly clean;
  `lint`/`lint:fix` to actually fix it locally.
- **`coverage/` output is gitignored and lives at `reports/coverage/`** (not the root `coverage/`
  directory some tooling defaults to). If a stale root-level `coverage/` shows up, it's leftover
  from an older run and safe to delete.
- **Coverage is the union of two Vitest projects** (`unit` + `storybook`, both run by
  `npm run coverage`). A hook or store with no `.test.ts` shows as uncovered even if a component
  that uses it has a story with a `play:` function — rendering a component doesn't exercise every
  branch of what it calls into. Don't treat "it's used in a story" as "it's tested."
- **Accessibility gating defaults to strict, not opt-in.** `.storybook/preview.tsx` sets
  `parameters.a11y.test: 'error'` globally, so any new story — including a new file under
  `src/hooks/**` or `src/stores/**` — is a11y-gated by default and can fail `npm run coverage`
  on an axe violation. Existing hooks/stores demo stories carry an explicit
  `parameters: { a11y: { test: 'todo' } }` override in their own meta; a *new* one needs that
  override added by hand or it'll be unexpectedly gated. See
  [CONTRIBUTING.md](./CONTRIBUTING.md#accessibility-gate).
- **A green `npm run coverage` run gives you zero accessibility visibility, pass or fail.**
  Nothing about axe's violations/passes/incomplete is written to the terminal, `reports/`, or
  CI logs — pass/fail on the gated assertion is the only signal that exists outside the
  interactive Storybook UI. If you actually want to see results (not just "did it fail"), run
  `npm run storybook` and use the Accessibility panel / testing widget. Don't read a green
  pipeline as "reviewed" — see [CONTRIBUTING.md](./CONTRIBUTING.md#accessibility-gate).
- **The `tests` story tag does not skip or de-prioritize anything.** It only filters what shows
  up in Storybook's sidebar — a `tags: ['tests']` story's `play:` function still runs under
  `npm run coverage` and still counts toward the coverage report. See
  [contributor-docs/writing-tests.md](./contributor-docs/writing-tests.md) for the full
  convention: isolated single-purpose stories instead of one long sequential `play:` function, and
  resetting module-level Zustand store state at the top of `play` when a component reads from one.
- **`main` is branch-protected**: PR required, three status checks required (`Lint`,
  `Test & Coverage`, `Build`). Always work on a feature branch, never push directly to `main`.

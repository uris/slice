# Working in this repo

Read [CONTRIBUTING.md](./CONTRIBUTING.md) first — it's the source of truth for setup, the
component lifecycle, testing strategy, and the lint/coverage/build gates CI enforces. For
build/publish pipeline detail, read [contributor-docs/build-architecture.md](./contributor-docs/build-architecture.md);
for component prop naming, [contributor-docs/style-prop-naming.md](./contributor-docs/style-prop-naming.md).

Do not duplicate guidance from those docs into this file. If something here and something in
CONTRIBUTING.md disagree, CONTRIBUTING.md wins — fix this file, not the other way around.

## Operational notes (things that aren't obvious from the docs alone)

- **`vitest.config.ts`'s coverage thresholds are a deliberate floor, not the last measured
  number.** They're set ~1.5 points below a confirmed-stable baseline on purpose — v8/browser-mode
  coverage has run-to-run measurement noise, so an exact-matched threshold fails intermittently
  with no real regression. `autoUpdate` is intentionally off. Don't turn it back on and don't
  tighten the numbers to match a single run.
- **If you do run a tool that rewrites `vitest.config.ts` wholesale** (e.g. `autoUpdate: true`,
  or any codemod), diff the *entire* file before committing, not just the lines you expect to
  change — this kind of rewrite reformats the whole file (spaces instead of tabs) and can silently
  drop unrelated comments elsewhere in it. Run `npm run lint` afterward to restore formatting.
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
- **`main` is branch-protected**: PR required, three status checks required (`Lint`,
  `Test & Coverage`, `Build`). Always work on a feature branch, never push directly to `main`.

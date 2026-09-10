# Contributing to Slice

This repository contains the source for the `@apple-pie/slice` package, Storybook docs, and benchmark tooling.

## Local Setup

Requirements:

- Node.js 18+ recommended
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

## Contribution Rules

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
4. Add or update Storybook coverage in `src/components/<Name>/<Name>.stories.tsx`.
5. Add or update benchmark coverage:
   - add or update `benchmarks/components/<Name>.bench.tsx`
   - add or update the config in `benchmarks/configs/all-configs.tsx`
   - export the benchmark from `benchmarks/components/index.ts`
6. Re-run the generated benchmark report with `npm run benchmark` when benchmark coverage changes.
7. If the benchmark report changed intentionally, verify the Storybook benchmarks page still renders the updated `reports/benchmark-results.md`.
8. Run `npm run build` and verify the component output exists in `dist/cjs`, `dist/esm`, and `dist/types`.

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

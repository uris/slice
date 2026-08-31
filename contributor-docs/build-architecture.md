# Build Architecture Guide

This document describes the current publish pipeline for `@apple-pie/slice` and the file/layout conventions that keep new APIs publishable.

## Build Command

`npm run build` runs these steps in order:

1. `prebuild`: `rm -rf dist`
2. Rollup bundle build: `NODE_ENV=production rollup -c --bundleConfigAsCjs`
3. Type declaration build: `tsc -p tsconfig.build.json`
4. Stylesheet finalize step: `node ./scripts/finalize-styles.mjs`
5. CSS copy step: `./scripts/copy-css.sh`

`npm run build:min` runs the same pipeline with `MINIFY=true`.

## Stage 1: Rollup Bundles

Build config: `rollup.config.js`

Rollup discovers entrypoints automatically from `src`:

- Package roots:
  - `src/index.ts`
  - `src/hooks/index.ts`
  - `src/providers/index.ts`
  - `src/stores/index.ts`
  - `src/theme/index.ts`
  - `src/utils/index.ts`
  - `src/utils/objects/index.ts`
- Components:
  - every `src/components/<Name>/index.ts`
- Hooks:
  - every `src/hooks/<HookName>/<HookName>.ts` or `.tsx`
- Providers:
  - every non-story `.ts`/`.tsx` file in `src/providers`
- Stores:
  - every `src/stores/<StoreName>/index.ts`
- Workers:
  - `src/workers/<WorkerName>/<WorkerName>.ts`
  - or `src/workers/<WorkerName>/<WorkerName>.worker.ts`
  - or `src/workers/<WorkerName>/index.ts`
- Theme subpaths:
  - `src/theme/colors/colors.ts`
  - `src/theme/corners/corners.ts`
  - `src/theme/elevations/elevations.ts`
  - `src/theme/motion/motion.ts`
  - `src/theme/type/type.ts`
  - `src/theme/themes.ts`

Output layout:

- CommonJS: `dist/cjs/**`
- ESM: `dist/esm/**`
- Shared chunks: `dist/cjs/chunks/**` and `dist/esm/chunks/**`

Entry naming conventions in output:

- Root entry: `dist/cjs/index.js`, `dist/esm/index.mjs`
- Component subpaths: `dist/{cjs,esm}/components/<Name>/index.{js,mjs}`
- Worker subpaths: `dist/{cjs,esm}/workers/<WorkerName>/<WorkerName>.{js,mjs}`
- Utils objects: `dist/{cjs,esm}/utils/objects/index.{js,mjs}`

Important plugin behavior:

- `@rollup/plugin-typescript` uses `tsconfig.rollup.json` for transpile-only bundling
- `rollup-plugin-postcss` extracts imported CSS into `dist/{esm,cjs}/styles.css`
- `@svgr/rollup` handles SVG React imports
- `@rollup/plugin-url` emits SVG, PNG, JPG, and GIF assets into `dist/**/assets`
- `rollup-plugin-peer-deps-external` keeps peer deps external
- `@rollup/plugin-terser` runs for both normal and minified builds
- `rollup-plugin-visualizer` writes `reports/package-size-visualizer.html`

Externalized runtime deps:

- `react`
- `react-dom`
- `motion`

## Stage 2: Type Declarations

Type build config: `tsconfig.build.json`

Declaration output is written to `dist/types/**` via the base `tsconfig.json` settings:

- `declaration: true`
- `emitDeclarationOnly: true`
- `declarationDir: dist/types`

Included source:

- `src/**/*`

Excluded from declaration build:

- `documentation/**`
- `**/*.stories.ts`
- `**/*.stories.tsx`

Important note:

- Story files stay out of the published type tree only if production source files do not import them. If a source file imports a story file, TypeScript will still pull that story into the declaration graph.

## Stage 3: Stylesheet Finalization

Script: `scripts/finalize-styles.mjs`

Rollup extracts CSS for both module formats into:

- `dist/esm/styles.css`
- `dist/cjs/styles.css`

The finalize step:

- reads the extracted ESM and CJS stylesheets
- verifies they match when both exist
- writes the package-level stylesheet to `dist/styles.css`
- removes the format-specific temporary stylesheet copies

Published consumers import the package stylesheet through:

- `@apple-pie/slice/styles.css`

That export is defined in `package.json` as `./styles.css`.

## Stage 4: CSS Copy

Script: `scripts/copy-css.sh`

Copied files:

- `src/utils/styling/flexBox.module.css` -> `dist/css/flexBox.module.css`
- `src/utils/styling/type.module.css` -> `dist/css/type.module.css`

## Theme CSS Bootstrap

`src/theme.css` is the package stylesheet entrypoint.

It imports these theme foundation files:

- `src/theme/colors/colors.css`
- `src/theme/elevations/elevation.css`
- `src/theme/type/type.css`
- `src/theme/breakpoints/custom-media.css`
- `src/theme/motion/motion.css`
- `src/theme/global/global.css`

`src/index.ts` imports `src/theme.css`, so the package root bundle participates in stylesheet extraction during the build.

Those imports are required for theme CSS variables, typography classes, custom media aliases, motion tokens, global body styles, and elevation tokens to exist at runtime.

`ThemeProvider` in `src/providers/ThemeProvider.tsx` manages theme state, document attributes, cookies, and the `data-slice-theme-scope` wrapper. It does not import the theme foundation CSS files.

If the stylesheet entrypoint or those imports are removed, theming may appear to work from React state while consuming apps fail at runtime because the CSS variables and utility classes are missing.

## Published Package Contract

Package metadata lives in `package.json`.

Top-level fields:

- `main`: `dist/cjs/index.js`
- `module`: `dist/esm/index.mjs`
- `types`: `dist/types/index.d.ts`
- `type`: `commonjs`
- `sideEffects`: `["**/*.css"]`

Published export map:

- `.`
- `./styles.css`
- `./css/flexBox.module.css`
- `./css/type.module.css`
- `./components/*`
- `./hooks`
- `./hooks/*`
- `./providers`
- `./providers/*`
- `./stores`
- `./stores/*`
- `./workers/*`
- `./theme`
- `./theme/colors`
- `./theme/corners`
- `./theme/elevations`
- `./theme/motion`
- `./theme/type`
- `./theme/themes`
- `./utils`
- `./utils/objects`

Representative import patterns:

```ts
import { Button } from '@apple-pie/slice';
import { Avatar } from '@apple-pie/slice/components/Avatar';
import { useTheme } from '@apple-pie/slice/hooks/useTheme';
import { ThemeProvider } from '@apple-pie/slice/providers/ThemeProvider';
import { useUploadsActions } from '@apple-pie/slice/stores/uploads';
import uploadsWorkerUrl from '@apple-pie/slice/workers/uploads/uploads?url';
import '@apple-pie/slice/styles.css';
import { lightTheme } from '@apple-pie/slice/theme/themes';
import { IndexedDB } from '@apple-pie/slice/utils/objects';
```

## Adding New Public APIs

### Components

For `src/components/<Name>/...`:

1. Add `src/components/<Name>/index.ts`.
2. Export the component and public types from that `index.ts`.
3. Re-export from `src/index.ts` if the component should be available from the package root.
4. Keep Storybook files named `*.stories.tsx`.
5. Add or update benchmark coverage:
   - `benchmarks/components/<Name>.bench.tsx`
   - the component config in `benchmarks/configs/all-configs.tsx`
   - `benchmarks/components/index.ts`
6. Run `npm run benchmark` when benchmark coverage or benchmarked behavior changes.
7. Run `npm run build`.
8. Verify:
   - `dist/esm/components/<Name>/index.mjs`
   - `dist/cjs/components/<Name>/index.js`
   - `dist/types/components/<Name>/index.d.ts`

### Hooks

For a new hook subpath:

1. Place it at `src/hooks/<HookName>/<HookName>.ts` or `.tsx`.
2. Export from `src/hooks/index.ts` if it should also appear in `@apple-pie/slice/hooks`.
3. Re-export from `src/index.ts` if it should also appear in the package root.
4. Run `npm run build`.

### Providers

For a new provider:

1. Add the provider source file in `src/providers`.
2. Export it from `src/providers/index.ts`.
3. Re-export from `src/index.ts` if it belongs on the root API.
4. Run `npm run build`.

For `ThemeProvider` specifically:

1. Keep the provider focused on theme state and document synchronization.
2. Keep stylesheet bootstrapping in `src/theme.css` unless the public styling entrypoint is intentionally redesigned.
3. If you move that bootstrap, update this document, `package.json` exports, and the README or quick start usage guidance.

### Stores

For a new store:

1. Add `src/stores/<StoreName>/index.ts`.
2. Export the public store API from that folder.
3. Export it from `src/stores/index.ts` only if it belongs in `@apple-pie/slice/stores`.
4. Run `npm run build`.
5. Verify:
   - `dist/esm/stores/<StoreName>.mjs`
   - `dist/cjs/stores/<StoreName>.js`
   - `dist/types/stores/<StoreName>/index.d.ts`

### Workers

For a new worker:

1. Add `src/workers/<WorkerName>/`.
2. Use one of the recognized entry names:
   - `<WorkerName>.ts`
   - `<WorkerName>.worker.ts`
   - `index.ts`
3. Run `npm run build`.
4. Verify the worker appears under `dist/{esm,cjs}/workers/<WorkerName>/`.

### Theme Modules

For a new top-level theme subpath:

1. Add the source module under `src/theme/...`.
2. Add it to `themeEntries` in `rollup.config.js`.
3. Add the corresponding `exports` entry in `package.json`.
4. Export types and values from `src/theme/index.ts` as needed.
5. Run `npm run build`.

### Utilities

For utilities:

1. Export package-level helpers from `src/utils/index.ts`.
2. Export low-level object helpers from `src/utils/objects/index.ts`.
3. If you need a new public utility subpath beyond the existing ones, update `package.json` `exports` and Rollup entry discovery accordingly.

## Storybook Separation

Keep Storybook-only material in:

- `documentation/**`
- colocated `*.stories.ts(x)`
- colocated `*.mdx`

Do not import story files into production code.

## Release Verification

Before publishing:

1. Run `npm run build`.
2. Run `npm pack --dry-run`.
3. Confirm core artifacts exist:
   - `dist/cjs/index.js`
   - `dist/esm/index.mjs`
   - `dist/types/index.d.ts`
4. Confirm new API artifacts exist in `dist/cjs`, `dist/esm`, and `dist/types`.
5. Confirm story files are not present in the type output:
   - `rg 'stories\\.d\\.ts|\\.stories\\.' dist/types`
6. Confirm `package.json` `exports` includes any new public import path.
7. Run `npm run benchmark` when benchmark coverage or performance-sensitive component behavior changed.
8. If the benchmark report changed intentionally, confirm `reports/benchmark-results.md` still renders in Storybook docs.

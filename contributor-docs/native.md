# Native Package Guide

`@apple-pie/slice-native` is an **experimental, icons-only** package. Its broader name leaves
room for future work; it does not imply that core Slice components or themes already work
in React Native. `CONTRIBUTING.md` remains the source of truth for contribution policy;
this guide describes the native-specific workflow.

## Package boundary

| Concern | Core Slice | Slice Native |
| --- | --- | --- |
| npm name | `@apple-pie/slice` | `@apple-pie/slice-native` |
| Manifest and lockfile | Repository root | `native/` |
| Public entrypoint | `src/index.ts` | `native/src/index.ts` |
| Component source | `src/components/` | `native/components/Icon/` |
| Build output | `dist/` | `native/dist/` |
| Rendering | React DOM, browser SVG, CSS | React Native and `react-native-svg` |

Keep runtime dependency graphs separate in both directions. Do not import core Slice,
`src/index.ts`, web hooks/providers, CSS, or DOM utilities into native production code.
Do not export native components from core Slice or add native peers to the root web package.
Native consumers should not need to install core Slice. Shared repository tooling does not
make these packages one runtime library.

The allowed cross-package reads today are build-time icon generation and test-only artwork
comparisons. Generated native files must be self-contained at runtime. Keep native public
exports in `native/components/Icon/index.ts` and `native/src/index.ts`; export-map changes belong
in `native/package.json`, not the root manifest.

## Icon source of truth

- `src/components/Icon/iconRegistry.tsx` owns canonical artwork and variants.
- `src/components/Icon/_types.ts` owns canonical `SliceIcons` name constants.
- `native/scripts/generate-icons.mjs` reads those sources and writes
  `native/components/Icon/iconRegistry.tsx` and `icons.ts`.
- Edit the canonical source or generator, then regenerate. Do not manually maintain a
  second set of paths or edit generated output as the source of truth.
- Maintain the native wrapper and prop types directly in
  `native/components/Icon/NativeIcon.tsx` and `_types.ts`.

Generation converts SVG tags to native SVG components, translates `xlinkHref` to `href`,
and removes empty dash arrays. New SVG element types need an explicit generator mapping
and native validation. The wrapper uses `onPress` and native accessibility props without
the web component's theme hook, CSS classes, cursor, or keyboard event handling.

## Local workflow and build

Install root tooling and native dependencies separately. Use a Node version supported by
the React Native version installed in `native/node_modules`; the web CI's Node version is
not a statement of native tooling compatibility.

From the repository root:

```sh
npm ci
npm ci --prefix native
npm run generate --prefix native
npm run lint --prefix native
npm run build --prefix native
```

Native lint mirrors the root workflow: `biome format --write .`, `biome check .`, then native
`typecheck`. It inherits root Biome rules and writes formatting changes. Test/spec files are
excluded by those rules. Root Biome scans native sources too, but root TypeScript checking
and the web build do not include native production files.

The build regenerates artwork, then `native/scripts/build.mjs` uses
`native/tsconfig.build.json` to type-check and emit temporary JavaScript plus declarations.
Rollup bundles the native entrypoint into:

- `native/dist/cjs/index.js`
- `native/dist/esm/index.mjs`
- `native/dist/types/index.d.ts` and referenced component declarations

React, React Native, `react-native-svg`, and their subpath imports remain external peers.
The build cleans native output first and removes temporary `native/.build/` afterward.
It does not run the web stylesheet pipeline or produce CSS. Build from a full repository
checkout, since generation reads the canonical web artwork.

## Validation

From the repository root:

```sh
npm run lint --prefix native
npm test --prefix native
npm run build --prefix native
```

`native/vitest.config.mts` discovers native component tests in an independent Node test
environment. Install native dependencies before running them: Vite must resolve the modules
even when tests mock their implementations. Root test discovery and coverage exclude all
native code, so core Slice CI does not require React Native dependencies.
Current tests mock native dependencies and check artwork
parity, variants, wrapper props, fill opacity, and disabled behavior. They do not render
on a device, prove native accessibility, or replace iOS/Android smoke tests when visual or
interaction behavior changes. Do not apply browser-only Storybook conventions to native.

CI runs a separate **Slice Native Lint, Build, Test** job on Node 24. It installs root tooling and native
dependencies, runs `npm run lint:ci --prefix native` (checks without formatting writes,
plus native typechecking), runs native tests, builds, and inspects the package with
`npm pack --dry-run --ignore-scripts` from `native/`. The pack step reuses the build already
produced in that job. Core Slice jobs and coverage remain separate. Native CI uses mocked
unit tests; it does not perform device rendering or native accessibility validation.

## Publishing

Versions and releases are independent. Update `native/package.json` and its lockfile for
native version changes without bumping core Slice just because native changed.

Run package commands from `native/`:

```sh
cd native
npm run lint
npm pack --dry-run
npm publish
```

`prepack` regenerates and builds automatically for packing and publishing. The manifest
allows `dist` in the tarball; npm also includes package metadata and the README. Inspect
the dry-run file list for native outputs and absence of web assets, tests, and tooling.
Publishing requires appropriate npm account/scope permissions. Do not run the root publish
command when intending to release native.

With npm staged publishing, the submitted release needs maintainer approval. A public
`0.0.0-stage` placeholder with “Temporary Holding Version” is not the operational release.
Review it in npm's Staged Packages UI, or use `npm stage list @apple-pie/slice-native` and
`npm stage view <stage-id>` before `npm stage approve <stage-id>` (2FA required).
See [npm staged publishing documentation](https://docs.npmjs.com/staged-publishing/).

## Future shared theme data

The intended next area is sharing **platform-independent TypeScript constants**, especially
color values and semantic light/dark palettes from `src/theme/colors/colors.ts` and their
types. The same color values should serve web and native without separately maintained
copies. This extraction has not been implemented or exported by Slice Native yet.

When that work is undertaken:

1. Identify pure data and its transitive imports. A `.ts` extension or `const` declaration
   alone does not guarantee portability; keep CSS, DOM access, web providers, and
   browser-specific values out of the shared layer.
2. Establish one platform-neutral source of truth with explicit build/package boundaries.
   Bundle or separately package shared data so consumers do not need repository-relative
   imports or a runtime dependency on the full web UIKit.
3. Preserve existing core Slice imports and values, with parity checks for shared constants.
   Do not move or rename the web theme API as an incidental native change.
4. Keep theme selection/state, providers, and style application platform-specific. Web CSS
   variables and document attributes stay on web; native receives resolved values and native
   styles. Audit spacing units, typography, shadows, and motion separately before sharing them.
5. Add deliberate native exports and document/test light and dark behavior when implemented.

Today, `NativeIcon` only uses the system color scheme for black/white defaults and fill
opacity. Apps can pass `strokeColor` and `coverUp` explicitly. This is not shared Slice
theming; do not import the web `ThemeProvider` to simulate native support.

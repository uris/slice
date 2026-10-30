# Native package workflow

`@apple-pie/slice-native` is the independently published React Native library in
`packages/slice-native`. See [README](../README.md) for current components and runtime
requirements, [AGENTS.md](../AGENTS.md) for implementation conventions, and
[the scripts index](../scripts/README.md) for generator and validation details.

## Workspace boundary

Each library owns its manifest, version, exports, build output, and release. All
workspaces install through the single repository-root lockfile. Run `npm install`
from the repository root; do not create a native lockfile or install separately.

Native shares plain theme modules from `../slice/src/theme` and generates icon
artwork from `../slice/src/components/Icon`. The build includes these definitions
in the native output, so consumers do not install the web library. Keep browser
stores, hooks, providers, and CSS out of native production imports. Shared tokens
and artwork will move to dedicated packages in a later migration.

## Development and validation

Run from `packages/slice-native` after the root install:

```sh
npm run typecheck
npm test
npm run coverage
npm run test:package
npm run pack:tarball
```

Generation requires Playwright Chromium (`npx playwright install chromium` from
the repository root). `npm run build` regenerates artwork and iOS color assets,
then emits CJS, ESM, TypeScript declarations, and Metro-compatible platform files.
The package build uses `.build/` temporarily and replaces `dist/`.

Keep generated source assets alongside generator changes. Do not hand-edit generated
registries or iOS resources. `test:package` validates exports, Metro files, Codegen
specifications, iOS assets, and tree-shaking fixtures. These checks do not replace
compiling and exercising the native components on a device or simulator.

Native unit-test coverage enforces 100% for statements, branches, functions, and
lines. Colocated `*.stories.tsx` examples are excluded from this source coverage
gate and validated separately by Storybook typechecks and builds.

The browser documentation lives in `apps/storybook-native`, with component and hook stories colocated in this
package's `src/` tree and shared MDX pages in `documentation/`. From the repository root:

```sh
npm run storybook:native
npm run build-storybook:native
npm run typecheck:storybook:native
```

## Publishing

Update this package's version independently and refresh the root lockfile. Pack or
publish this workspace rather than the private repository root. `prepack` builds
the package again; `npm pack --dry-run --ignore-scripts` inspects an existing build.
The package's `react-native`, type, and export paths must match generated output.

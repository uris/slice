# Native package scripts

These scripts build and verify `@apple-pie/slice-native`. Run the commands below
from `native/`. npm commands are defined in [package.json](../package.json).
The web package has a separate [scripts directory](../../scripts/README.md).

| Script | Purpose and inputs | Outputs / side effects | How to run |
| --- | --- | --- | --- |
| [generate-icons.mjs](generate-icons.mjs) | Converts the shared web icon registry and icon-name constants in `src/components/Icon/` at the repository root into React Native equivalents. Replaces SVG tags with `react-native-svg` components and removes unsupported empty dash arrays. | Overwrites `native/src/components/SliceIcon/iconRegistry.tsx` and `icons.ts`. | `npm run generate` runs this and formats its output. For only this generator: `node scripts/generate-icons.mjs`. |
| [generate-ios-colors.mjs](generate-ios-colors.mjs) | Reads the shared light/dark semantic tokens from the repository's `src/theme/colors/colors.ts`. Converts hex and RGBA colors to sRGB components, preserves alpha, and excludes shadow definitions. Checks matching appearance keys, supported values, and Swift accessor name collisions. Emits explicit decimal components so Xcode does not interpret full intensity or opacity as byte values. | Recreates generated color sets in `platform/ios/Resources/SliceColors.xcassets/` and overwrites `platform/ios/SliceColors.generated.swift`. Produces SwiftUI `SliceColors` and UIKit `SliceUIColors` accessors. | `npm run generate`, or `node scripts/generate-ios-colors.mjs`. |
| [build.mjs](build.mjs) | Type-checks and compiles using `tsconfig.build.json`, then bundles public entries with Rollup while keeping peer dependencies external. Preserves Metro platform files and original typed Codegen specifications. | Replaces `dist/` with CommonJS, ESM, declaration, and Metro outputs. Uses `.build/` temporarily and removes it afterward. Removes incomplete `dist/` output on failure. | `npm run build` runs generators first, then this script. |
| [check-package.mjs](check-package.mjs) | Checks built export paths, Metro platform files, Codegen schemas/Babel transformation, native source availability (including the glass button and its event schema), and selected ESM tree-shaking behavior. Requires a completed build. | Reports validation failures or success; bundles small consumer fixtures in memory. Does not produce a tarball or run an iOS/Android build. | `npm run test:package`, or after building: `node scripts/check-package.mjs`. |
| [check-ios-colors.mjs](check-ios-colors.mjs) | Compares generated color sets against shared theme tokens for both appearances, including alpha. Checks asset names, SwiftUI/UIKit accessor presence, the pod's resource declaration, and inclusion of `platform` in package files. | Reports validation failures or success. Does not compile Swift, compile the asset catalog, or test runtime resource loading. | `npm run test:package`, or `node scripts/check-ios-colors.mjs`. |
| [pack.mjs](pack.mjs) | Invokes `npm pack` through npm's current executable. Uses an isolated temporary npm cache; npm's `prepack` lifecycle runs a fresh build. | Writes `pack/apple-pie-slice-native-<version>.tgz` and removes the temporary cache. Does not publish or install the package. | `npm run pack:tarball` or `npm run pack`. Use npm rather than invoking this file directly, because it requires `npm_execpath`. |

## Native template icon scripts

- [ios-icon-source.mjs](ios-icon-source.mjs) is a shared helper, not a command. It
  transpiles the web JSX registry with a small SVG serializer, fixes stroke width
  at 1.5, normalizes paint to monochrome, and constructs luminance masks that turn
  cover-up shapes into transparent cutouts. It enumerates outline, opaque-fill,
  and toggle artwork without changing either existing icon renderer.
- [generate-ios-icons.mjs](generate-ios-icons.mjs) runs in `npm run generate`.
  It uses Playwright Chromium to rasterize masks at 20, 40, and 60 pixels, then
  writes template image sets to `platform/ios/Resources/SliceIcons.xcassets`, a
  variant manifest to `platform/ios/Resources/SliceIcons.manifest.json`, and Swift
  accessors to `platform/ios/SliceIcons.generated.swift`. It replaces generated
  image sets only after rendering succeeds. Requires the repository development
  dependencies and Chromium (`npx playwright install chromium` at repository root).
  Linux CI must run `npx playwright install --with-deps chromium` at repository
  root before building or packing the native package. Each job needs this setup;
  installing browsers in the web test job does not provision the native job.
  The native CI job caches browsers but still runs installation to ensure the
  required browser revision and Linux system dependencies are available.
  Direct invocation from `native/`: `node scripts/generate-ios-icons.mjs`.
- [check-ios-icons.mjs](check-ios-icons.mjs) runs in `npm run test:package` and
  validates source/manifest coverage, unique asset names, 1×/2×/3× PNG dimensions,
  template metadata, Swift enum coverage, and the pod's resource declaration.
  Run `node scripts/check-ios-icons.mjs --pixels` to additionally use Chromium to
  check monochrome pixels, intentional blank artwork, wallet cutouts, and toggle
  masks. These checks do not test glass contrast or runtime bundle loading.

## Workflow

### Native button presence regression

`npm run test:ios-button` runs
[test-ios-button-presence.mjs](test-ios-button-presence.mjs). It requires macOS,
Xcode, generated iOS assets, and one booted iOS 26+ simulator. With multiple
simulators, pass `npm run test:ios-button -- --device <UDID>`.

The script compiles the real Swift button surface and
[`GlassButtonPresenceSmoke.swift`](../tests/ios/GlassButtonPresenceSmoke.swift)
into a temporary UIKit app, compiles the asset catalogs, installs/runs the app,
and checks deferred glass installation during ancestor opacity/scale changes,
hidden views, nested opacity, detach/reattach, reset, and repeated exit/entrance
cycles with entering values applied after a recycled host mounts. The button
now composes a plain UIKit control inside glass content; the checks also assert
that its effect remains attached and its foreground survives each re-entry.
It writes assertions and
a screenshot to `coverage/ios-button-presence/`, then uninstalls its temporary app
and deletes build files. It does not edit the consuming app. This is an isolated
UIKit regression test, not a full React Native/Reanimated integration test.
It does not run Fabric's recycling pool. Also verify repeated conditional
mount/unmount in a consuming app: the Fabric host must replace its internal
UIKit surface on recycle. A configured-button flag alone does not prove that
UIKit is drawing the glass material.

This optional native check runs separately from `npm test` and `test:package`.

We generate iOS color assets so native controls can use Slice theme colors as
dynamic native colors, including as tints that participate in iOS's automatic
contrast adaptation on supported regular Liquid Glass controls. The assets
provide light/dark appearance variants; the native glass control provides the
backdrop-dependent color adjustments. Generating assets alone does not enable
contrast detection for arbitrary React Native text, SVGs, or clear glass.

```sh
npm run generate      # Refresh committed generated icons and iOS color resources
npm run build         # Generate, type-check, and build distributable files
npm run test:package  # Build, then check package structure and iOS color/icon parity
npm run pack:tarball  # Build through prepack, then create a local installable archive
```

`pack:tarball` does not run the package validation scripts or component tests.
Run `npm run test:package` and the relevant `npm test` checks separately when
validating changes before distribution.

Edit shared token/icon sources rather than generated outputs. Regenerate and
include resulting changes together. The color resource bundle is installed by
CocoaPods; consuming iOS apps need updated pods and a native rebuild to pick up
new assets. Reloading Metro alone does not install native resources.

The root `../biome.json` (relative to `native/`) excludes
`native/platform/ios/Resources` and `native/.build` from formatting and linting.
Asset generators own their JSON serialization, so packing followed by
`npm run lint` must not reformat generated resources. `npm run lint` still formats
the files in scope before checking them; use `npm run lint:ci` for a read-only
format/lint check plus type checking. Generated React Native icon TypeScript is
formatted explicitly by `npm run generate` and remains checked by Biome.

Keep this index updated when adding, renaming, or changing a script.

### `test-ios-glass-text.mjs`

Run `npm run test:ios-glass-text` with one booted iOS 26+ simulator, or pass
`-- --device <UDID>`. Requires Xcode and the generated Slice color assets.
Compiles the actual glass/text Swift surfaces into a temporary UIKit app, installs
and launches it on that simulator, checks semantic foreground selection, wrapping,
explicit overrides, and reuse, and writes a report and screenshot to
`coverage/ios-glass-text/`. Removes its temporary app and build directory afterward.
This is an isolated UIKit smoke test; inspect the screenshot for visual behavior
and separately verify React Native/Fabric integration and animation cycles.

For a manual scrolling backdrop test, run
`npm run test:ios-glass-text -- --interactive`. After the static checks, it launches
fixed glass labels over repeating white/gray/black/gray scroll content. Use the on-screen
controls to switch system/light/dark appearance and regular/clear glass. Drag over
the labels to scroll underneath. This mode leaves the app installed and running;
`--keep-installed` also retains the static app without entering interactive mode.
The interactive screenshot is saved to `coverage/ios-glass-text/interactive.png`.

The glass text smoke app also compiles `GlassIconSurface.swift` and loads the
existing generated `SliceNativeIcons.bundle` assets. It checks template rendering,
actual Slice tint selection, artwork/color updates, invalid names, and reset.
Interactive mode includes a row of template icons in the scrolling backdrop test.
It compiles the existing assets without regenerating them.

`generate-icons.mjs` also adapts the shared SVG renderer's stroke color type to
React Native `ColorValue`, allowing literal and opaque native foreground colors
on the regular SVG path. This does not regenerate the iOS template image assets.

The button presence smoke test also checks independent native text/icon tints,
rendered template-image tint, UIKit disabled-title handling, and resetting the
title transformer to shared tint.

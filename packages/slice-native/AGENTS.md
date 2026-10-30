# Slice Native working practices

These instructions apply to work under `packages/slice-native/`. Keep this file current when
the user agrees to a new convention or architectural decision. Record established
decisions, not speculative plans. Explicit user instructions take precedence.

## Readability

- Favor readability over compactness. Use descriptive names, explicit conditions,
  and small helpers for shared decisions.
- Avoid ternary operators in handwritten code. Use `if`/`else`, guard clauses, or
  `switch`, especially when choosing styles, colors, or defaults. Do not hand-edit
  generated files to satisfy this convention; change the generator if necessary.
- Use multiline JSDoc for props and declarations, including short descriptions:

  ```ts
  /**
   * Plain string title. On regular buttons, takes precedence over children.
   */
  label?: string;
  ```

- Explain intent and platform differences in comments. Keep public behavior and
  examples in [README.md](README.md).
- Document every script's purpose, inputs, outputs, side effects, and invocation
  in [scripts/README.md](scripts/README.md). Update that index when scripts change.

## Shared sources and generated assets

- Shared web sources are the source of truth: semantic colors come from
  `../slice/src/theme/colors/colors.ts`; icon artwork comes from
  `../slice/src/components/Icon/iconRegistry.tsx`.
- React Native SVG icons and the parallel iOS template library derive from the
  same registry. Preserve the existing `Icon` renderer; native assets are an
  additional library, not a replacement.
- Update source definitions or generators rather than generated registries,
  asset catalogs, Swift accessors, or `dist/`. Include regenerated source assets
  alongside generator/source changes.
- Keep generated iOS resources and temporary build output excluded from Biome.
  Their generators own serialization; packing followed by lint must not reformat
  them. The root `../../biome.json` contains these exclusions. Generated React Native
  icon TypeScript is intentionally formatted by the generation command itself.
- iOS colors include light/dark variants and preserve alpha. Emit explicit decimal
  component strings such as `"1.0"`: Xcode can interpret integer strings such as
  `"1"` as byte values, corrupting opacity and RGB intensity. Shadow definitions
  are not color assets; do not invent a high-contrast palette.
- Native icon masks use a 20×20 base coordinate system and a fixed 1.5-point
  stroke. They ship as 1×/2×/3× template PNGs. Bake optional fills as outline or
  opaque-filled variants; export distinct toggle artwork where available.
- Convert icon cover-up paint into transparent cutouts. Template rendering uses
  alpha, so painting a cover-up black or white without masking is insufficient.
- Package native resources in named CocoaPods bundles and load them from those
  bundles rather than assuming assets live directly in the app's main catalog.

## Liquid Glass and platform behavior

- `FabButton` always renders a regular button and excludes Liquid Glass from its
  public props. Keep its outer shadow unclipped and its corners synchronized with
  the button; the inner button owns ripple clipping.

- Keep a regular React Native fallback. Native glass controls are used only on
  iOS when capability detection reports support and the caller opts in.
- Metro chooses `.ios.tsx` by platform, not capability. The iOS entry point must
  still choose the regular implementation when glass is unsupported or disabled.
- `Button` and `TextInput` accept `liquidGlassBackground={true}` for default regular glass,
  `false`/omission for regular rendering, or an options object. Keep the existing
  `glassStyle` name; there is no `tintStyle` prop.
- Inside supported `LiquidGlass` content, `Icon` selects existing
  native template assets through glass context, including intermediate views.
  Keep SVG rendering outside glass and for options templates cannot represent.
  Use actual Slice native color assets; do not substitute UIKit semantic colors
  for Slice tokens in text or icons. Glass input text/placeholder defaults use
  `DynamicColorIOS` with both actual Slice palette variants because RN's public
  color API cannot select our named resource bundle. Document that distinction
  from asset loading. Foreground props accept tokens or ColorValue: on glass,
  recover matching palette values as tokens and fall back to primary when
  unmatched; outside glass, preserve literal values. Keep system colors
  explicitly labeled in comparison fixtures.
- Glass buttons compose a plain native UIButton inside UIVisualEffectView content,
  like inputs, so regular glass honors independent icon/title assets. Keep the
  visibility/recycle lifecycle on the effect and UIKit event/disabled handling
  on the control. Do not revert to UIButton.Configuration.glass(): the isolated
  direct-UIKit comparison reproduced ignored image colors on regular glass,
  while clear glass honored them. Glass buttons own their native title and
  template image. Accept a string
  `label`, an icon, or both; do not accept arbitrary React children for glass.
  Regular buttons retain children support, with `label` taking precedence.
- Carry content and geometry into the native button: size, icon placement/size,
  padding, typography, radius, accessibility, disabled state, and supported events.
  Leave the glass surface, outline, and disabled visuals to UIKit. Do not apply
  solid button backgrounds or custom borders to the native glass path.
- Public foreground props use `iconColor` for icons and `textColor` for text.
  Buttons accept both independently; `tintColor` is their shared fallback.
  `Icon` does not retain a `strokeColor` compatibility alias in this alpha.
- Buttons and inputs exercise the same glass-content composition available to
  consumers through view/text/icon primitives. The user verified custom text/icon
  colors and backdrop adaptation on a physical device for both composed controls.
  Preserve that hierarchy; this does not establish every color/backdrop as accessible.
- Input typography defaults to body-xl-bold (17pt) and a 1.2× effective line
  height. Caller font-size overrides recalculate line height; explicit lineHeight
  wins last. Preserve RN font scaling by default. For size investigations, inspect
  the system content-size category: Large is the iOS baseline, and Medium shrinks
  the rendered font. Use allowFontScaling={false} only for a fixed-size comparison
  or when explicitly requested, not as a workaround for a typography issue.
- Keep foreground `tintColor` (a Slice color token) distinct from material
  `glassTintColor`. Resolve native color tokens through generated native assets;
  avoid resolving them to fixed JavaScript hex colors first.
- Forward the provider's explicit light/dark preference to native containers.
  React context alone does not set native appearance; `system` should inherit it.
- Distinguish appearance selection from backdrop adaptation. Dynamic color assets
  and `DynamicColorIOS` do not measure background contrast. Native regular glass
  owns its adaptive treatment; clear glass does not provide the same behavior.
- Do not claim arbitrary React Native text, text inputs, or SVG paths receive
  native glass contrast adaptation without testing their actual rendering path.
- Apply presence-animation lifecycle guidance to all Liquid Glass elements and
  their animated ancestors, not only buttons. Verify repeated exit/entrance cycles
  through React Native/Reanimated for each implementation; a passing UIKit smoke
  test or configuration flag does not establish that glass renders after reuse.
  Distinguish general requirements from fixes verified for a specific component.
- Install a native button's glass during a layout pass after it joins a window
  and its ancestor opacity is high enough. Entering animations can otherwise
  leave UIKit's material permanently missing. Keep content measurable using a
  plain configuration while waiting; observe visibility changes rather than
  polling indefinitely. Keep observing after installation so subsequent exits
  and entrances invalidate and rebuild the material, including entering values
  applied after a recycled host mounts. Tear down on detach and recycling.
- Replace the button's internal UIKit surface when Fabric recycles its host.
  The previous configured-button implementation needed a fresh surface; retain
  that verified lifecycle when composing the plain control inside glass. Clear
  the effect on detach/reset, reconnect events, cancel old callbacks, and preserve
  accessibility values because Fabric may skip unchanged props on the new control.
  React keys do not guarantee a fresh native control; do not require callers to
  change keys as a workaround.
- Preserve presence/layout callbacks and `animatedStyle` while fixing native
  material lifecycle issues; do not silently disable the caller's animations.
- Document unsupported Pressable options and native behavior differences rather
  than implying exact gesture parity.
- Native event adapters must support getter-only event properties and keep
  getters/methods bound to the original event instance. Do not assign to
  `nativeEvent` or assume that cloning an event's prototype preserves its state.
  Include regression tests with getter-only properties and instance-bound
  methods; plain-object event mocks alone can hide runtime incompatibilities.

## Build and validation

Run commands from `packages/slice-native/` unless stated otherwise:

```sh
npm run generate      # Regenerate icons, iOS templates, and iOS colors
npm run typecheck     # Check native TypeScript sources
npm test             # Run component and utility tests
npm run test:ios-button # Optional UIKit presence smoke test on a booted simulator
npm run test:package  # Build and validate exports, Metro/Codegen files, and assets
npm run pack:tarball  # Produce a local tarball through the prepack build
```

- `npm run build` always runs generation first. Packing runs a fresh build through
  `prepack`; it does not replace component tests or package validation.
- Icon generation needs the repository's development dependencies and Playwright
  Chromium. See [scripts/README.md](scripts/README.md) for setup and pixel checks.
- Match validation to the change. Comment-only edits need formatting/diff checks,
  not new tests. Behavior changes need relevant tests and type checks; native
  bridge/API changes also need Codegen and native compilation checks where tools
  are available.
- For asset or glass rendering changes, inspect actual simulator/device output
  when possible. Static asset checks and compilation do not prove runtime bundle
  loading, color accuracy, or backdrop adaptation.
- State what was tested and distinguish isolated UIKit smoke tests from a full
  React Native integration test. Report unavailable checks plainly.
- New native controls/resources require a refreshed consuming package, updated
  pods/Codegen bindings, and a native app rebuild. A Metro reload is insufficient.
- Preserve unrelated user edits. Do not change a consuming application outside
  this package merely to make package checks pass.

## Storybook organization

- Colocate component stories in `src/components/<Component>/<Component>.stories.tsx`.
- Colocate hook stories in `src/hooks/<Hook>/<Hook>.stories.tsx`.
- Keep shared MDX pages in `documentation/`. The Storybook app owns discovery and
  browser tooling under `../../apps/storybook-native/`.
- Keep stories excluded from the native package build, unit-test discovery, and unit-test coverage.
- Native source coverage must remain at 100% for statements, branches, functions, and lines.
  Storybook examples are checked by Storybook typechecking/builds and do not count toward this gate.

## Reusable smoke screens

- Name reusable React Native smoke screens `*.smoketest.tsx`. The root Biome
  configuration excludes this suffix from linting and formatting. Keep the
  screen's setup and reuse instructions alongside it in `tests/react-native/`.

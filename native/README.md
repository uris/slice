# @apple-pie/slice-native

Experimental React Native SVG icons, with the same names and artwork as the web UIKit.
Includes native light/dark theme tokens and a theme provider.
It is built and published independently
of `@apple-pie/slice` and does not require that package at runtime.

```tsx
import { SliceIcon, SliceIcons } from '@apple-pie/slice-native';

<SliceIcon
  name={SliceIcons.ui.home}
  size={24}
  strokeColor="#334155"
  accessibilityLabel="Go home"
  onPress={() => navigation.navigate('Home')}
/>
```

Supply native SVG props and
native `style` objects; use `onPress` instead of `onClick`. CSS classes, cursor
styling (`pointer`), and browser keyboard handlers are not part of this API.
Use an enclosing React Native `Pressable` when you need a larger touch target or
button feedback, and mark the icon `accessible={false}` when it is decorative.

Defaults are 20×20, stroke width 1.5, and black/white colors based on the system
color scheme. Pass `strokeColor` and `coverUp` explicitly to match an app theme.
`fillColor` retains the web API's meaning: **opacity from 0 to 1**, not a color.
`fill` enables that opacity (default 0.125 in light mode, 0.2 in dark mode).
`toggle` selects the on variant when available; unknown names render nothing.
`disabled` blocks press callbacks and halves the specified opacity.

The package requires React, React Native, and react-native-svg as peers. Install
the native SVG dependency in the consuming app using its normal native/Expo setup.

## Development

The package manifest and entry point live in `native/`. Icon components, types,
generated artwork, and tests live in `native/components/SliceIcon/`.

From this directory, run `npm run generate` after changing the web icon registry
or `SliceIcons` constants. Generated files contain native SVG components and have
no runtime imports from the web UIKit. Run `npm run typecheck` with the peer
dependencies installed and TypeScript available from the repository.

From the repository root:

```sh
npm install
npm install --prefix native
npm run lint --prefix native
npm test --prefix native
npm run build --prefix native
```

The build refreshes generated icons, checks types, and produces `dist/cjs/index.js`,
`dist/esm/index.mjs`, and declarations under `dist/types`. React, React Native, and
react-native-svg stay external peer dependencies. The web build is independent.

Native tests use their own `vitest.config.mts` and mocked native components. Install native
dependencies before running them. Root tests and coverage do not include the native package;
passing the native unit tests does not replace device rendering checks.

### Native coverage

From the repository root, run:

```sh
npm run coverage --prefix native
```

This runs only the native tests and measures runtime TypeScript in native components,
providers, theme modules, and the package entry point, including generated icon artwork.
Tests and type-only files are excluded. Shared web sources, build scripts, and dependencies
are outside this report. Files without tests are included in the coverage calculation.

Open `native/coverage/index.html` for the interactive report. The command also prints
a terminal summary and writes `native/coverage/lcov.info` and
`native/coverage/coverage-summary.json` for tooling. Reports are ignored by Git.
The coverage provider comes from the repository's existing `@vitest/coverage-v8`
development dependency; install both root and native dependencies as described above.

CI runs these checks independently in **Slice Native Lint, Build, Test** on Node 24.
It uses `npm run lint:ci --prefix native` to check formatting and types without writing
fixes, then runs native tests, builds, and inspects the package contents. Root dependencies
provide shared tooling such as Biome; native dependencies are installed separately.

Run `npm pack --dry-run` from `native/` to inspect the publishable files, or
`npm pack` to create a tarball. The `prepack` hook builds automatically. Build and
pack from this repository: generation uses the web artwork in `src/components/Icon`.

## Theme tokens

### Buttons

`SliceButton` uses the shared theme provider.
It supports `primary` and `secondary` variants, optional left/right icons, disabled
state, native Pressable props, and Reanimated layout/enter/exit animations.
Reanimated 4 and its compatible Worklets setup are required in the consuming app.
Supply an `accessibilityLabel` for icon-only buttons; button icons are decorative.

```tsx
import { SliceButton, SliceThemeProvider } from '@apple-pie/slice-native';

<SliceThemeProvider>
  <SliceButton icon="home" onPress={() => navigation.navigate('Home')}>
    Go home
  </SliceButton>
</SliceThemeProvider>
```

Wrap the app in `SliceThemeProvider` and read its theme with `useSliceTheme`:

```tsx
import { SliceThemeProvider, useSliceTheme } from '@apple-pie/slice-native';

function App() {
  return <SliceThemeProvider>{/* app content */}</SliceThemeProvider>;
}
```

The provider follows the system appearance by default. Pass `preference="light"`
or `preference="dark"` to override it. For an app-controlled preference, pass
`preference` and `onPreferenceChange`; the app owns updating and persisting that
value. `useSliceContext` exposes `theme`, `mode`, `preference`, and the optional
`setPreference` callback. Both hooks require a surrounding `SliceThemeProvider`.
Use this exported provider and its hooks together so app and library components
share the same context.

```tsx
import { Text, View, useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@apple-pie/slice-native/theme';

function Card() {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
  return (
    <View style={{
      backgroundColor: theme.colors['core-surface-primary'],
      padding: theme.spacing.m,
      borderRadius: theme.corners['corner-m'],
      ...theme.shadows['surface-shadow-soft'],
    }}>
      <Text style={{ ...theme.type['body-m-regular'], color: theme.colors['core-text-primary'] }}>
        Hello Slice
      </Text>
    </View>
  );
}
```

`lightTheme`, `darkTheme`, `createTypography`, and the `SliceNativeTheme` type are
also available from the package root. `SliceTheme` aliases the native theme type.
The dedicated `/theme` entry has no runtime React Native, React, or SVG imports.
It also exports `coreColors`, `corners`, `spacing`, `elevations`, `type`, and `motion`.

Colors, spacing, corners, and stacking levels are sourced from the web tokens at
build time and bundled into this package. No web package is needed in an app.
CSS shadow strings are removed from `colors` and `coreColors`; use `theme.shadows`
instead. Shadows use native `boxShadow` arrays, which require the New Architecture
and supported Android versions (outset shadows require Android 9+).

Typography uses a fixed 16dp base for rem conversion and numeric line heights and
letter spacing. Load Funnel Sans in your app, or replace `theme.type` with
`createTypography('YourLoadedFontName')`. Exact font weights depend on the font
and platform; test your loaded font on devices. This package does not load fonts.

Motion durations are milliseconds. Curve tokens are easing functions suitable for
`Animated.timing`'s `easing` option; the CSS spring is interpolated from its original
samples, preserving overshoot. They are ordinary JavaScript functions, not Reanimated
worklets. `elevations` retains the web stacking levels for `zIndex`; do not pass these
values to Android's `elevation` property.

Build from the repository so shared source tokens are available. All generated
JavaScript and declarations are included under `dist/`, including declarations for
shared source types. Changes to web tokens are picked up by the next native build.

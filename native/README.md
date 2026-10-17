# @apple-pie/slice-native

Experimental React Native SVG icons, with the same names and artwork as the web UIKit.
Currently **icons only**: this package does not provide the rest of Slice's components,
theme provider, or shared light/dark palettes. It is built and published independently
of `@apple-pie/slice` and does not require that package at runtime.

```tsx
import { Icon, SliceIcons } from '@apple-pie/slice-native';

<Icon
  name={SliceIcons.ui.home}
  size={24}
  strokeColor="#334155"
  accessibilityLabel="Go home"
  onPress={() => navigation.navigate('Home')}
/>
```

`NativeIcon` is also exported as an alias of `Icon`. Supply native SVG props and
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
generated artwork, and tests live in `native/components/Icon/`.

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

CI runs these checks independently in **Slice Native Lint, Build, Test** on Node 24.
It uses `npm run lint:ci --prefix native` to check formatting and types without writing
fixes, then runs native tests, builds, and inspects the package contents. Root dependencies
provide shared tooling such as Biome; native dependencies are installed separately.

Run `npm pack --dry-run` from `native/` to inspect the publishable files, or
`npm pack` to create a tarball. The `prepack` hook builds automatically. Build and
pack from this repository: generation uses the web artwork in `src/components/Icon`.

Contributor architecture and future theme-data extraction are documented in
`contributor-docs/native.md` in the source repository. Shared plain TypeScript color
constants are planned; the current system light/dark defaults are only icon defaults.

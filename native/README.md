# @apple-pie/slice-native

**Alpha software — APIs, styling, and platform behavior may change between releases.**

A React Native UI kit with themed components, SVG icons, native blur, and Liquid Glass.
It shares Slice’s visual language with the web UIKit, but is packaged independently
and does not require `@apple-pie/slice` at runtime.

**Blur, gradient masking, Liquid Glass, and device capability detection are built
into this package and connected directly to native platform code.** No additional
blur, gradient, masking, or glass libraries are required—including `expo-blur`,
`expo-linear-gradient`, and `@react-native-masked-view/masked-view`.

## Installation

```sh
npm install @apple-pie/slice-native
```

Configure the package’s peer dependencies in your app: React 18/19, React Native
0.80+, `react-native-svg` 15, and Reanimated 4 with its compatible Worklets setup.
For Expo projects, use `npx expo install` for native peers to select compatible versions.
These general UI dependencies are separate from the built-in native visual effects.

Native components require the New Architecture. iOS builds require Xcode 26+.
Install iOS pods and rebuild your app after installing or updating the package.
Expo apps need a development build; the custom native components are not available
in Expo Go. Restarting Metro alone does not register new native code.

## Quick start

```tsx
import { View } from 'react-native';
import {
  SliceButton,
  SliceIcons,
  SliceTextInput,
  SliceThemeProvider,
} from '@apple-pie/slice-native';

export default function App() {
  return (
    <SliceThemeProvider>
      <View style={{ padding: 24, gap: 16 }}>
        <SliceTextInput accessibilityLabel="Search tasks" placeholder="Search…" />
        <SliceButton icon={SliceIcons.ui.home} onPress={() => console.log('Home')}>
          Go home
        </SliceButton>
      </View>
    </SliceThemeProvider>
  );
}
```

## Components

| Component | Summary |
| --- | --- |
| `SliceButton` | Primary/secondary buttons, optional icons, disabled states, Reanimated transitions, and optional Liquid Glass backgrounds. |
| `SliceTextInput` | Themed native input with icons, optional focus control, focus callbacks, and opt-in clearing on blur. |
| `StyledText` | Theme-based typography presets with native text props. |
| `SliceIcon` / `SliceIcons` | Native SVG artwork and typed icon names shared with the web UIKit. Supports toggles, fills, sizing, and press handlers. |
| `SliceLiquidGlassView` | Native glass container with children, tint, interaction feedback, and rounded corners. |
| `SliceBackgroundBlur` | Background blur overlay with an optional directional fade on iOS. |

Buttons and inputs support `size` (`s`, `m`, `l`, or a number), `borderRadius`
(`pill`, `rectangular`, or a number), `borderWidth`, `borderColor`, and
`backgroundColor`. Sizes define minimum heights, allowing room for larger text.
Inputs forward `style` to the underlying text field. Buttons expose `animatedStyle`
for their wrapper.

`SliceButton`, `SliceTextInput`, and `StyledText` use `SliceThemeProvider`. Give
inputs and icon-only buttons an accessible name. Icons inside these components
are decorative; standalone icons can use `accessibilityLabel` and `onPress`.
For `SliceIcon`, `fillColor` means fill opacity, not a color value.

### Built-in Liquid Glass and blur

| Effect | iOS | Android | Web |
| --- | --- | --- | --- |
| `SliceLiquidGlassView` | Native Liquid Glass on iOS 26+; system blur on older iOS. | Tinted color fallback. | Tinted color fallback. |
| `SliceBackgroundBlur` | Native backdrop blur; optional directional fade. | Uniform backdrop blur when the required API is present (SDK 37.2+) and hardware acceleration is available; otherwise a color fallback. | Color fallback. |

The implementations ship with the package: Swift/UIKit and Fabric on iOS, and Java
platform code on Android. Consumers do not need to install another effects library.
iOS respects Reduce Transparency and renders a fallback when it is enabled.

```tsx
import { SliceBackgroundBlur, SliceLiquidGlassView } from '@apple-pie/slice-native';

// Place over background content; fills its parent by default.
<SliceBackgroundBlur blurIntensity={20} fadeStop={0.5} direction="down" />

<SliceLiquidGlassView cornerRadius={24} glassStyle="regular" style={{ padding: 20 }}>
  {/* Foreground content */}
</SliceLiquidGlassView>

<SliceButton liquidGlassBackground={{ glassStyle: 'clear', fallbackColor: '#eeeeee' }}>
  Continue
</SliceButton>
```

Blur defaults to intensity `12` and `fadeStop={0}`, which renders uniform blur
without a mask. A positive `fadeStop` (0–1) enables fading on iOS. Directions are
`down`, `up`, `left`, and `right`, from transparent toward full blur. Android
ignores fading props. This fades the visibility of a uniform blur rather than
varying the blur radius across the view.

Use `cornerRadius` to control a glass container’s shape. Supported glass buttons
keep their background transparent; unsupported devices use their solid background
or configured fallback. Both effect components accept `fallbackColor`. Avoid opaque
content over glass when you want the backdrop to remain visible. Android backdrop
blur samples the same window; separately composed surfaces such as video may differ.

## Hooks, provider, and theme

| Export | Purpose |
| --- | --- |
| `SliceThemeProvider` | Light/dark themes; follows the system by default. Use `preference="light"` or `"dark"` to override. |
| `useSliceTheme()` | Returns the active theme. |
| `useSliceContext()` | Returns the theme, mode, preference, and optional preference setter. |
| `useCreateThemedStyles(factory)` | Creates memoized styles from the active theme. Define the factory outside the component for stable reuse. |
| `useDeviceCapabilities()` | Reports native effect support, platform, OS/API version, and device information. Does not require the theme provider. |

```tsx
const {
  supportsLiquidGlass,
  supportsNativeBlur,
  platform,
  iosVersion,
  androidSdkVersion,
  deviceName,
  deviceModel,
} = useDeviceCapabilities();
```

Capability flags describe API availability, not live accessibility settings or
per-view rendering conditions. They return `false` when the native module is absent.
`iosVersion` is a full version string; `androidSdkVersion` is an integer API level
without minor-release information. Use the support flags for effects decisions.
Unavailable fields are `null`. iOS device names may be generic; its model is a
hardware identifier such as `iPhone17,1`, not a marketing name. Android reports
the system model name/code.

`lightTheme`, `darkTheme`, and `createTypography` are exported alongside theme types.
Themes include colors, spacing, corners, typography, shadows, stacking levels, and
motion. The `/theme` entry also exposes the underlying token groups. Typography
uses Funnel Sans by default; load it in your app or use `createTypography` with
your own loaded font. Fonts are not loaded by the package.

## Utilities and entry points

| Utility | Purpose |
| --- | --- |
| `sizeToNumber(size)` | Resolves size presets to points: `s` = 40, `m` = 48, `l` = 56. |
| `borderRadiusToNumber(radius)` | Resolves `pill` to 1000, `rectangular` to 4, and numeric radii to nonnegative points. |
| `lineHeightTextStyle(style, multiplier)` | Returns a new text style with an absolute line height. |

Public types include `Size`, `BorderRadius`, `LiquidGlassBackground`,
`DeviceCapabilities`, component props, and theme/provider types.

Import from the package root or the dedicated `/components`, `/hooks`, `/providers`,
`/theme`, and `/utils` entry points. ESM, CommonJS, TypeScript declarations, and
Metro platform files are included. Theme tokens and utilities can be used independently
of the component runtime.

## Development

From the repository root:

```sh
npm install
npm install --prefix native
npm run lint:ci --prefix native
npm run coverage --prefix native
npm run test:package --prefix native
npm run pack:tarball --prefix native
```

Builds regenerate and automatically format native icons from the shared web artwork,
check types, and emit the package distributions. The tarball is written to
`native/pack/apple-pie-slice-native-<version>.tgz`; reinstall it and rebuild the
consuming native app when testing platform changes.

Browser documentation runs with `npm run storybook:native` from the repository root.
It previews web fallbacks; native effects need simulator/device checks. Native unit
coverage enforces a 95% overall threshold and does not measure Swift/Java rendering.

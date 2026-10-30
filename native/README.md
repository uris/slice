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
  Button,
  SliceIcons,
  TextInput,
  SliceThemeProvider,
} from '@apple-pie/slice-native';

export default function App() {
  return (
    <SliceThemeProvider>
      <View style={{ padding: 24, gap: 16 }}>
        <TextInput accessibilityLabel="Search tasks" placeholder="Search…" />
        <Button icon={SliceIcons.ui.home} onPress={() => console.log('Home')}>
          Go home
        </Button>
      </View>
    </SliceThemeProvider>
  );
}
```

## Components

| Component | Summary |
| --- | --- |
| `Button` | Primary/secondary buttons, optional icons, disabled states, Reanimated transitions, and optional Liquid Glass backgrounds. |
| `FabButton` | Floating action button with an unclipped shadow, a default plus icon and 56-point size. Always uses regular rendering. |
| `TextInput` | Themed native input with icons, optional focus control, focus callbacks, and opt-in clearing on blur. |
| `Text` | Theme-based typography presets with native text props. |
| `Icon` / `SliceIcons` | Native SVG artwork and typed icon names shared with the web UIKit. Supports toggles, fills, sizing, and press handlers. |
| `LiquidGlass` | Native glass container with children, tint, interaction feedback, and rounded corners. |
| `BackgroundBlur` | Background blur overlay with an optional directional fade on iOS. |

Buttons and inputs support `size` (`s`, `m`, `l`, or a number), `borderRadius`
(`pill`, `rectangular`, or a number), `borderWidth`, `borderColor`, and
`backgroundColor`. Sizes define minimum heights, allowing room for larger text.
Inputs forward `style` to the underlying text field. Buttons expose `animatedStyle`
for their wrapper.

`Button`, `TextInput`, and `Text` use `SliceThemeProvider`. Give
inputs and icon-only buttons an accessible name. Icons inside these components
are decorative; standalone icons can use `accessibilityLabel` and `onPress`.
For `Icon`, `fillColor` means fill opacity, not a color value.

### Built-in Liquid Glass and blur

| Effect | iOS | Android | Web |
| --- | --- | --- | --- |
| `LiquidGlass` | Native Liquid Glass on iOS 26+; system blur on older iOS. | Tinted color fallback. | Tinted color fallback. |
| `BackgroundBlur` | Native backdrop blur; optional directional fade. | Uniform backdrop blur when the required API is present (SDK 37.2+) and hardware acceleration is available; otherwise a color fallback. | Color fallback. |

The implementations ship with the package: Swift/UIKit and Fabric on iOS, and Java
platform code on Android. Consumers do not need to install another effects library.
iOS respects Reduce Transparency and renders a fallback when it is enabled.

```tsx
import { BackgroundBlur, LiquidGlass } from '@apple-pie/slice-native';

// Place over background content; fills its parent by default.
<BackgroundBlur blurIntensity={20} fadeStop={0.5} direction="down" />

<LiquidGlass cornerRadius={24} glassStyle="regular" style={{ padding: 20 }}>
  {/* Foreground content */}
</LiquidGlass>

<Button label="Continue" liquidGlassBackground={{ glassStyle: 'clear', fallbackColor: '#eeeeee' }} />
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
| `useCreateThemedStyles(styles)` | Memoizes a stylesheet, theme factory, or platform map. Platform maps merge `base` with the current `Platform.OS` entry. Keep the input stable for reuse. |
| `useDeviceCapabilities()` | Reports native effect support, platform, OS/API version, and device information. Does not require the theme provider. |

`useCreateThemedStyles` accepts an existing `StyleSheet.create(...)` result or a
factory `(theme) => StyleSheet.create(...)`. It also accepts a map keyed by `base`,
`ios`, `android`, `macos`, `windows`, or `web`, either directly or returned by a
theme factory. Each map entry can be a stylesheet or its own theme factory.

```tsx
const createStyles = (theme: SliceNativeTheme) => ({
  base: StyleSheet.create({
    container: { padding: 16, backgroundColor: theme.colors['core-surface-primary'] },
    title: theme.type['body-xxl-medium'],
  }),
  ios: StyleSheet.create({ container: { paddingTop: 24 } }),
  android: StyleSheet.create({ container: { paddingTop: 20 } }),
});

function Screen() {
  const styles = useCreateThemedStyles(createStyles);
  return <View style={styles.container}><Text style={styles.title}>Hello</Text></View>;
}
```

The selected OS entry overrides properties within each matching named style;
other base properties remain. Style values such as `transform` and `shadowOffset`
are replaced as a whole, following React Native style merging. Entries for other
platforms are ignored, and their factories are not evaluated. Without a matching
OS entry, the hook returns base styles; without either, it returns an empty
stylesheet. Platform-only style names are optional in the return type because
they may be absent on another OS. Style factories and maps defined outside the
component retain memoization across renders and update when the theme changes.

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

### Native iOS theme colors

`npm run generate` creates `platform/ios/Resources/SliceColors.xcassets` and
`SliceColors.generated.swift` from the shared `src/theme/colors/colors.ts` tokens.
Do not edit the generated files. Each semantic color has Any (light) and Dark
appearances, including its alpha. Shadow definitions are excluded; no separate
high-contrast palette is currently defined. CocoaPods packages the catalog as
`SliceNativeColors.bundle`.

SwiftUI, from a target that imports the pod module:

```swift
import SliceNative

Button("Save") {}
    .buttonStyle(.glass) // iOS 26+
    .tint(SliceColors.coreOutlinePrimary)
```

UIKit:

```swift
button.tintColor = SliceUIColors.coreOutlinePrimary
// String lookup is also available:
label.textColor = SliceColors.uiColor(named: "core-text-primary")
```

These are named native assets, independent of `DynamicColorIOS`. Native colors
follow the receiving view's appearance. `SliceThemeProvider` controls React
context only; it does not override native appearance. When the app forces a theme,
set the corresponding native container's `overrideUserInterfaceStyle` to `.light`
or `.dark` (or SwiftUI's `.environment(\.colorScheme, .dark)` / `.light`). Use
`.unspecified` in UIKit to return to inherited appearance. Native Slice components must forward the provider's preference to their native
container; the native glass button, glass text, and glass view do so.

These resources alone do not change React component colors or glass button
rendering. Reinstall pods and rebuild the consuming iOS application
after updating the package; a Metro reload alone cannot install native assets.
Run `npm run test:package` to verify generated color parity and packaging.

### Native iOS template icons

The SVG renderer remains available on every platform. Inside supported iOS glass,
`Icon` selects the existing native templates automatically. The native library,
`SliceNativeIcon`, loads template images from `SliceNativeIcons.bundle`:

```swift
import SliceNative

// SwiftUI (glass button style requires iOS 26+):
Button {} label: {
    SliceNativeIcon.home.image()
}
.buttonStyle(.glass)
.tint(SliceColors.coreIconPrimary)

// UIKit:
configuration.image = SliceNativeIcon.home.uiImage()
// Optional baked variants, falling back to the base artwork when unavailable:
imageView.image = SliceNativeIcon.view.uiImage(toggled: true, filled: false)
// String names match the shared registry:
let wallet = SliceNativeIcon(rawValue: "wallet")?.uiImage()
```

Generated icons use the same 20×20 coordinate system, with stroke width fixed at
1.5 points at the base size. Assets include 1×, 2×, and 3× PNGs marked as templates.
Optional fill opacity is baked as 0 (outline) or 1 (filled); toggle and filled
variants are emitted only where their source artwork differs. Cover-up paint is
converted to transparent cutouts through luminance masking. Original multicolor
artwork becomes monochrome. The intentional `blank` icon remains transparent;
the registry's empty-name icon is available as `.unnamed`, and `@` as `.atSign`.
Scaling an image also scales its baked stroke; runtime stroke/opacity editing
continues to be available only through the existing SVG component.

`npm run generate` refreshes this library from the shared icon registry. Generation
uses the repository's Playwright development dependency and requires Chromium
(`npx playwright install chromium` from the repository root). It is a build-time
tool, not an app dependency. Run `node scripts/check-ios-icons.mjs --pixels` from
`native/` to check alpha masks as well as variant coverage and asset metadata.

Template assets allow native controls to manage tint; they do not themselves
measure background contrast. Verify automatic adaptation on a device with a
native regular-glass control. Reinstall pods and rebuild the app to install this
new resource bundle.

### Presence animations and Liquid Glass

Presence animations need native lifecycle handling for any element that renders
Liquid Glass, including buttons, text inputs, glass views, and their animated
ancestors. UIKit can leave the material missing after an exit/entrance cycle even
while the element's icon or text continues to render.

Check both visibility during material installation and native view recycling.
Removing opacity from a custom animation does not rule out visibility changes:
Reanimated can briefly hide entering views internally, including for scale-only
animations. A new React key also does not guarantee a fresh UIKit control because
Fabric can reuse native views.

Native implementations should install material during a visible layout pass,
clean up on removal, and restore a working surface on subsequent mounts. Where
resetting the existing material is insufficient, recreate the internal native
surface on recycling, reconnect events, and preserve accessibility values. Keep
the caller's presence/layout animations and `animatedStyle` intact.

Validate repeated exit/entrance cycles through the actual React Native/Reanimated
path on a simulator or device. A successful first entrance or a native
configuration flag does not prove that glass renders after reuse. The confirmed
fresh-surface recycling fix currently applies to `Button`; other Liquid Glass
components need their own integration verification.

`LiquidGlass` also defers its effect until a visible layout pass, observes
ancestor layer opacity/visibility throughout subsequent animation cycles, and
clears the effect on detach and Fabric recycling. Its React content container
stays stable while the material is rebuilt. This lifecycle handling still needs
repeated-cycle verification in a consuming React Native/Reanimated app; the
button's fresh-control recycling result does not establish the same result for
`UIVisualEffectView`.

### Native Liquid Glass buttons

On iOS 26+ with native support, `Button` uses a UIKit `UIButton` when
`liquidGlassBackground` is supplied. The plain native control is nested inside
a `UIVisualEffectView` glass content view, matching the input composition and
allowing independent icon and title colors. Other platforms, older iOS versions, and
buttons without that opt-in retain the regular React Native rendering.

```tsx
<Button
  label="Save"
  icon="check"
  liquidGlassBackground
  tintColor="core-text-primary"
  size="m"
  labelTextStyle="body-xl-bold"
  contentInsets={{ top: 8, bottom: 8, leading: 16, trailing: 22 }}
  onPress={save}
/>
```

`liquidGlassBackground={true}` (or the shorthand `liquidGlassBackground`) enables
regular glass with default options. `false` or an omitted prop uses the regular
button and permits children. Use an object for options, such as
`liquidGlassBackground={{ glassStyle: 'clear' }}`. The existing `glassStyle` and
`tintColor` names are unchanged.

Glass buttons accept a string `label`, an `icon`, or both. They do not accept React
children. Regular buttons continue to support children; when `label` is supplied,
it takes precedence. Use `accessibilityLabel` for icon-only actions.

The native control loads the generated Slice template image, applies the title's
Slice typography (with a system-font fallback if the custom font is not loaded),
and uses named Slice color assets for foregrounds. `iconColor` and `textColor`
resolve independently, with `tintColor` as their shared fallback. When omitted,
they default to `core-icon-primary` and `core-text-primary`, respectively. `iconPosition`, `iconSize`, `iconGap` (default 6), logical `contentInsets`,
`size`, and `borderRadius` control content and geometry. Native intrinsic width is
capped by the parent width; size remains a minimum height and width. UIKit measures
the title and image, so initial layout settles after the native size event.
Native titles support Dynamic Type; the fixed label typography is single-line and
truncates when constrained.

The native button delays material installation while an entering ancestor is
hidden or near-transparent, then installs glass in a visible layout pass. This
avoids UIKit permanently skipping the material during presence fades. Visibility
observations remain active while mounted and stop on removal or recycling;
there is no polling.
When Fabric recycles the host, the button replaces its internal UIKit surface
and reconnects its events. This retains the fresh-surface lifecycle established
for the previous configured-button implementation; the composed version also
clears its glass effect on detach/reset. See the shared
[presence animation guidance](#presence-animations-and-liquid-glass) above.
Run `npm run test:ios-button` on macOS with a booted iOS 26+ simulator for the
isolated UIKit regression check and screenshot (see `scripts/README.md`).

Native glass owns the surface and outline; the plain UIKit control owns disabled
content treatment. `backgroundColor`,
`borderWidth`, `borderColor`, and the primary/secondary `variant` do not customize
that surface. `animatedStyle`, presence, and layout animations still wrap the
control; use these for geometry, opacity, and transforms rather than painting a
second background. The regular fallback retains its existing variant, borders,
and `fallbackColor` behavior.

`glassStyle: 'regular'` selects a regular `UIGlassEffect`; `'clear'` selects
clear glass, which does not promise backdrop contrast adaptation.
`glassTintColor` tints that material. `iconColor` and `textColor` select independent
native Slice color assets, with `tintColor` as their shared fallback. The button
uses a plain configuration inside the effect's content view because UIKit's
regular glass button configuration overrides custom icon colors on tested systems.
Disabled content uses UIKit's plain-button treatment; enabled glass is interactive.

The native button forwards press, press-in, press-out, and long-press callbacks,
plus accessibility metadata and disabled state. Touch tracking and long-press
cancellation use UIKit behavior. Pressable-specific options such as
`android_ripple`, `pressRetentionOffset`, `unstable_pressDelay`, and delayed
press-in/out do not configure the native control. The provider's explicit
light/dark preference is forwarded to the button; `system` inherits native
appearance. This is separate from regular-glass backdrop adaptation.

Repack the library, reinstall pods to regenerate Fabric bindings, and rebuild the
consuming iOS app before testing. A Metro reload cannot register the new native
button. Check label-only, icon-only, combined content, disabled, Dynamic Type,
forced/system themes, long presses, and scrolling dark/light backdrops on a device
or simulator. Regular and clear glass should be evaluated separately.

### Native text inside Liquid Glass

`Text` (the exported Slice text component) automatically uses a native iOS
`UILabel` for plain string/number children inside a supported
`LiquidGlass`, including through intermediate `View` components:

```tsx
<LiquidGlass style={{ padding: 20 }}>
  <View>
    <Text textColor="core-text-secondary">Account details</Text>
  </View>
</LiquidGlass>
```

All text tokens, including primary, secondary, and tertiary, load their actual
native Slice color assets. They retain native light/dark variants instead of
being substituted with UIKit semantic label colors. UIKit owns the glass rendering
treatment; backdrop-dependent contrast must be verified for these actual colors.
An explicit `style.color` takes precedence when selecting the foreground token;
like the color prop, it uses the shared glass token/fallback resolver. The glass container inherits
the provider's appearance preference, or system appearance without a provider.

This initial native text path supports font family/size/weight, letter spacing,
line height, Dynamic Type (including maximum size multiplier), alignment, line
limits, truncation, layout styles, and accessibility labels. It measures intrinsic
width and constrained multiline height asynchronously; layout can settle after
the first native measurement. Rich/nested children, selection, press handlers,
text layout callbacks, padding, and unsupported text styling keep React Native's
existing text renderer. Descendants of a regular text run also keep that renderer.
Outside supported glass and on other platforms, behavior stays with React Native.

Context follows the React tree: do not assume that content moved into a portal or
modal still belongs to the native glass content hierarchy. Clear glass and Reduce
Transparency also have different material behavior; this API does not promise
uniform backdrop-dependent contrast across those settings.

`npm run test:ios-glass-text` checks the isolated UIKit implementation and captures
primary/secondary/tertiary/custom text over white and black backgrounds. It does
not prove the full React Native/Fabric path or guarantee foreground switching.
Reinstall pods/refresh Codegen and rebuild the consuming iOS app before trying the
new native text component; a Metro reload is insufficient.

### Icons inside Liquid Glass

`Icon` uses a native `UIImageView` and the existing generated template assets
when rendered inside supported iOS `LiquidGlass` content, including
through intermediate `View` components. No additional asset export is needed.

```tsx
<LiquidGlass style={{ padding: 16 }}>
  <View>
    <Icon name={SliceIcons.ui.home} size={24} />
  </View>
</LiquidGlass>
```

The native path defaults to the actual `core-icon-primary` Slice color asset,
which follows the native glass container's appearance. Explicit `iconColor` values select a token through the shared resolver. No Slice token is replaced with a UIKit semantic color.
Native template rendering allows UIKit to own its foreground treatment; it does
not guarantee adequate contrast for every color and backdrop.

Size, toggled artwork, opaque fills (`fill` with `fillColor={1}`), disabled opacity,
accessibility, and press handlers are supported. Native press handlers use React
Native `Pressable`. Templates use the existing fixed 1.5-point base stroke.
Custom stroke widths, translucent/default-opacity fills, explicit `coverUp`, and
other SVG-specific options keep the SVG renderer. Outside supported glass,
including Android/web, icons retain their SVG implementation. Context must still
correspond to native ancestry; portals/modals do not establish glass ancestry.

The interactive glass smoke app includes a template-icon row over the scrolling
backdrop. New Fabric bindings require updated package/Codegen, pods, and a native
app rebuild; reloading Metro alone cannot install the icon component.

### Input glass content hierarchy

Use `liquidGlassBackground={true}` (or the shorthand prop) for default regular
glass, an options object to customize it, or `false`/omission for a regular input.
On iOS with Liquid Glass support and `liquidGlassBackground` enabled,
`TextInput` places its icon and React Native editor inside
`LiquidGlass` content. The glass container owns the horizontal layout;
it is no longer an absolutely positioned sibling behind the editor. The nested
icon can select the existing native template renderer through glass context.
Without the opt-in, or on unsupported platforms/devices, the input renders its
regular content with no glass element and retains its background fallback.

The input defaults to `body-xl-bold`: 17 points, with a 20.4-point line height
(1.2×). An explicit `style.fontSize` overrides that size and recalculates line
height; an explicit `style.lineHeight` wins last. React Native font scaling remains
enabled by default, so system text-size settings can decrease or increase the
rendered size. With no font-size override, `allowFontScaling={false}` fixes the size at 17 points.
iOS uses the Large content-size category as its baseline; Medium can render this
17-point style at approximately 16 points. Check the system Text Size setting
when comparing typography rather than disabling font scaling by default.

The editor remains React Native's existing implementation. Glass style, tint,
and theme changes keep the mounted editor. Switching the glass opt-in or
capability changes the wrapper hierarchy and can remount the editor; controlled
values are reapplied, but uncontrolled edits, native focus, and selection should
not be assumed to survive that switch. Choose the glass opt-in before editing.
Custom text and icon colors and their backdrop adaptation have been verified
on a physical device for the composed input and button. This does not guarantee
accessible contrast for every token, glass setting, and backdrop.

While native input glass is active, `borderWidth` and `borderColor` are ignored:
UIKit supplies the material outline. Regular and unsupported-device fallback
inputs retain their configured borders.

Glass input icons now leave their default foreground to `Icon`, which loads
`core-icon-primary` from the existing native Slice color assets. `textColor` no
longer overrides the glass icon tint; use `iconColor` to select a different Slice token or palette value.
Regular/fallback inputs continue to default their icon to `textColor`.

Glass inputs default entered text to a native `DynamicColorIOS` carrying Slice's
light/dark `core-text-primary` values, and placeholders to the matching
`core-text-secondary` pair. These are native dynamic UIColors built from the
shared palette values, not colors loaded from the baked asset bundle. Explicit
`textColor`, `placeholderTextColor`, and `style.color` values pass through the
shared token resolver; the style color takes precedence for entered text.
Regular/fallback inputs retain their selected-theme defaults. Device testing
confirmed text/icon adaptation in the composed controls. Evaluate placeholder
legibility separately, especially for faint tokens and different glass settings.

Input line height defaults to 1.2 times the effective font size, including
`style.fontSize` overrides. An explicit `style.lineHeight` takes precedence.

### Floating action button

`FabButton` is available from the package root and `/components`, with
`FabButtonProps` exported alongside it. It always uses a regular `Button`;
`liquidGlassBackground` is not supported. The default icon is `plus` and the
default size is 56 points. Supply an `accessibilityLabel` for an icon-only FAB.

```tsx
<FabButton accessibilityLabel="Add task" onPress={addTask} />
<FabButton label="Create task" icon="plus" size={64} onPress={addTask} />
<FabButton borderRadius={16} shadowStyle={{ elevation: 8, marginBottom: 16 }} />
```

The outer shadow wrapper sizes to the button's layout instead of stretching to
fill its parent. It follows size overrides and wider labels without fixed
wrapper dimensions. Its corner radii match the button's resolved `borderRadius`
prop or regular `style` values, including individual corner styles. The wrapper
stays unclipped so the shadow can extend beyond the ripple-clipped button.

Use `style` for the button's box/text styling and `shadowStyle` for outer shadow
and positioning styles (including margins). Both accept style arrays. Resolved
button corners and visible overflow take precedence over matching `shadowStyle`
values to keep the shadow outline synchronized and unclipped. Other button props,
including press events, disabled state, typography, and animation props, are
forwarded to the wrapped button.

### Android input keyboard actions

When `TextInput` is focused on Android, changes to `returnKeyType`,
`returnKeyLabel`, or the effective `enterKeyHint` refresh the existing keyboard
input connection. `enterKeyHint` takes precedence over `returnKeyType`, matching
React Native. Rapid updates are coalesced; initial rendering and unfocused
changes use Android's normal input connection setup. Refreshing does not remount
or blur the editor, clear its value, or invoke `blurClears`. Other platforms keep
their existing keyboard behavior. The keyboard app controls the final icon/label
appearance and may reset an active composing suggestion when its connection restarts.

This uses the Android `SliceTextInputKeyboard` native module. Install a freshly
packed package and rebuild the consuming Android app to include it; a Metro
reload alone cannot add it. Older native builds without the module retain the
previous behavior until rebuilt.

### Regular button and input styles

Regular primary buttons default both their label and icon to `core-text-light`
in light and dark themes. This also applies to the primary `FabButton` and regular
glass fallbacks. Explicit `textColor`, `iconColor`, `tintColor`, and label
`style.color` overrides retain their existing priority. Secondary buttons,
disabled colors, and native Liquid Glass foreground defaults are unchanged.

`Button` and `TextInput` both accept `style: StyleProp<TextStyle>`, including
style arrays and `StyleSheet.create` results. Define box and text properties in
one style key: both components automatically separate them and apply each to the
correct wrapper, content host, or text element. You do not need separate box and
text style objects.

Regular controls resolve each supported setting in this order: explicit
component prop, matching style value, then the Slice default. For example,
`borderRadius={0}` overrides `style={{ borderRadius: 12 }}`; omitting the prop
uses the style's radius. The same priority applies to `borderWidth`, `borderColor`,
`backgroundColor`, and `textColor` versus `style.color`. Zero values remain
valid overrides. Explicit uniform border props also override per-edge style values.

```tsx
const styles = StyleSheet.create({
  action: { borderRadius: 12, paddingHorizontal: 24, fontSize: 18, color: '#405261' },
});

<Button label="Save" style={styles.action} />
<TextInput style={{ borderRadius: 12, backgroundColor: '#f4f4f4', fontSize: 18 }} />
<TextInput borderRadius={0} style={{ borderRadius: 12 }} />
```

Button box styles (including borders, backgrounds, dimensions, and margins)
apply to the painted surface wrapper. Padding, gap, and content alignment apply
to the inner `Pressable`, keeping the ripple host stretched across the surface.
Both the painted wrapper and ripple host clip to the resolved corner radii;
the default Android ripple is bounded. Explicit `contentInsets` edges
override matching padding values; omitted edges retain their style or default
values. `iconGap` overrides style gaps. Text properties such as `fontSize`,
`fontWeight`, and `color` apply to the label. An explicit `labelTextStyle` takes
priority over matching typography values; `textColor` and `tintColor` take priority
over `style.color`. Disabled buttons retain their disabled colors and interaction behavior, and `animatedStyle` remains the final
animation layer.

Input box styles apply to the outer wrapper, while typography and text color apply
to the editor. Padding belongs to the wrapper so the icon and editor share the
same surface. `size` sets minimum height (and icon-only button width); without
`size`, styles can supply `minHeight` or a numeric `height` before the 48-point
default applies. A fixed style height can expand beyond the minimum.

These wrapper overrides apply to regular rendering, including unsupported glass
fallbacks. Active native glass buttons ignore `style`. Active glass inputs retain
their existing editor-only style handling and native surface behavior.

### Shared foreground color values

Button `iconColor`/`textColor` (with shared `tintColor` fallback), text `textColor`,
icon `iconColor`, and input `iconColor`,
`textColor`, and `placeholderTextColor` accept `SliceColorValue`: a semantic Slice
token or React Native `ColorValue`. The existing placeholder prop name remains
`placeholderTextColor`.

```tsx
<Button label="Save" liquidGlassBackground tintColor="core-text-primary" />
<Text textColor="core-text-secondary">Details</Text>
<Icon name="search" iconColor="core-icon-secondary" />
<TextInput liquidGlassBackground icon="search"
  iconColor="core-icon-secondary" textColor="core-text-primary"
  placeholderTextColor="core-text-secondary" />
```

Regular rendering resolves tokens against the selected theme and passes literal
or native color values through. Supported glass rendering preserves token names
for native asset lookup (buttons, text, icons) or creates a native dynamic pair
from that token (input text/placeholder). A literal matching either Slice palette
is recovered as a token; equivalent hex/RGB syntax is normalized using RN's
`processColor`. Shared values cannot identify a unique semantic token: matches
favor the component default, then the text/icon role, then palette order. Pass a
token name to select its exact meaning and light/dark pair.

Unmatched glass colors, including opaque color objects that cannot be mapped
back to a Slice token, fall back to `core-text-primary` for text foregrounds
or `core-icon-primary` for icon foregrounds, including button icons. An omitted input placeholder still
defaults to `core-text-secondary`; an explicitly unmatched placeholder uses
`core-text-primary`. Custom fixed colors therefore remain available on regular
renderers, while the glass paths consistently use Slice native foregrounds.
Material `glassTintColor` is separate and is not changed by foreground resolution.

### Independent button foregrounds

Use `iconColor` for icon foregrounds and `textColor` for text foregrounds across
components. `Icon` exposes `iconColor`; it has no public `strokeColor` prop.
Button `iconColor` and `textColor` can differ. `tintColor` remains a shorthand
fallback for either foreground when its specific prop is omitted:

```tsx
<Button label="Save" icon="home" liquidGlassBackground
  iconColor="core-icon-secondary" textColor="core-text-primary" />
<Icon name="search" iconColor="core-icon-secondary" />
```

Each foreground uses the shared regular/glass resolver independently. Regular
buttons preserve their disabled color treatment; native glass buttons leave the
disabled image treatment to UIKit. `glassTintColor` still controls only material
color. Separate native button colors add Fabric props, so update Codegen/pods and
rebuild the consuming iOS app before testing them.

### Component names and text typography

The native components are exported as `BackgroundBlur`, `Button`, `FabButton`,
`Icon`, `LiquidGlass`, `Text`, and `TextInput` from both the package root and `/components`.
Replace the previous `Slice*` component imports and `StyledText` with these names;
public prop types use the matching names (for example, `TextProps`). Alias React
Native primitives when importing both: `import { Text as NativeText } from 'react-native'`.
The theme provider and `SliceIcons` registry retain their names.

`Text` supports body presets from `body-xs` through `body-xxl` in regular, medium,
and bold weights. `body-xxl` computes to 18 points, a 133.33% line height, and
0.16875-point letter spacing from the shared theme.

`Text` defaults to `body-l-regular` and supports `fontFamily`, `fontSize`,
`fontWeight`, `lineHeight`, and `letterSpacing` on regular and native glass paths.
The `lineHeight` prop is a font-size multiplier; theme line heights and
`style.lineHeight` are points. Changing `fontSize` preserves the theme's line-height
ratio. `singleLine` limits text to one line and uses a 1.2 multiplier, or its numeric
value. Explicit `style` values take precedence. Named weights (`thin`, `extra light`,
`light`, `normal`, `medium`, `semi`, `bold`, `extra`, `heavy`) map to 100–900;
numeric weights pass through. Letter spacing is in points.

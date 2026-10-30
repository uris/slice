# React Native input glass smoke screen

`InputGlass.smoketest.tsx` renders the real exported `TextInput` from the package.
It compares two editable glass inputs (empty placeholder and entered text) with
an ordinary input over scrolling white/gray/black/gray backgrounds. Controls change
light/dark appearance and regular/clear glass; Done dismisses the keyboard.

This screen is separate from the isolated UIKit harness in `tests/ios`. Run it in
a rebuilt React Native app with the package's current Fabric bindings, native
resources, Reanimated/Worklets, and `react-native-safe-area-context` installed.
For an Expo app, register it with `registerRootComponent`. Use one shared copy of
React, React Native, and the package's peer dependencies when linking the local
package. Build the package before consuming its Metro distribution.

The local simulator preview for this task is staged in `/tmp/slice-input-rn-smoke`
with its own iOS project and bundle identifier `com.slice.InputGlassRNSmoke`.
Its dependencies were reused from the existing development app; its project and
entry screen were copied into temporary storage rather than editing that app.
The preview embeds its JavaScript bundle, so it can remain usable without Metro.

This screen checks actual React Native composition and editing. Glass input text
and placeholders use the component's native dynamic Slice palette defaults;
icons use the native Slice asset tint. Physical-device testing
confirmed custom text/icon colors and backdrop adaptation for the composed
button and input. Repeat device checks after changing the native rendering path;
simulator results alone do not establish that behavior.

The first glass input passes named Slice tokens for its icon, text, and placeholder.
The second passes current-theme palette values, exercising token recovery before
native rendering. Both paths should retain the appropriate native light/dark pair.

The input smoke uses the default 17pt body-xl-bold typography with no font-size
override. Its first input uses `liquidGlassBackground={true}` (always regular);
the second uses the style options object and follows the regular/clear control.
The second also sets `allowFontScaling={false}` for an exact 17pt reference;
the first and regular baseline retain system font scaling.

## Button foreground smoke screen

`ButtonColors.smoketest.tsx` uses the actual exported `Button` through Fabric.
It includes a blue icon/title glass button, separate token colors, an icon-only button matching
the consuming app, matching palette literals, disabled split colors, and a
regular-renderer baseline. Swap colors updates props in place; press counts verify
the native event path. The backdrop scrolls through white, gray, and black.
Use the same isolated app setup above with this screen as its root. Refresh
Codegen/pods and rebuild after native button prop changes; a JS bundle refresh
alone cannot add new native props.

The Cycle presence ×3 control repeatedly removes and remounts the first button
with Reanimated FadeIn/FadeOut. After each entrance, check that its material
and blue icon/title return. Run this for both regular and clear glass.

## Native tint comparison

`../ios/GlassButtonTintSmoke.swift` is the isolated UIKit visual fixture used to
compare direct regular glass, an explicit image transformer, clear glass with
the same template, and the real composed `GlassButtonSurface`. It requires the
Swift button/color/icon sources and both compiled asset bundles in a native
smoke host. It is separate from the automated presence script.

The direct regular-glass configuration ignored the requested blue image color
in the tested simulator, including without recycling. Clear glass honored it.
The composed regular-glass button honored both foregrounds; subsequent physical
device testing confirmed text/icon contrast adaptation in buttons and inputs.
These observations do not establish whether UIKit's configured-button behavior
is intentional, or guarantee behavior on every OS version.

## Android keyboard actions and ripple clipping

`KeyboardActions.smoketest.tsx` is a reusable React Native/Fabric fixture for
Android. Pack and reinstall the current library and rebuild the consuming app
so Codegen includes `NativeTextInputKeyboardSpec` and the package registers
`SliceTextInputKeyboard`. Then register this screen as the app's root or a test
route. It uses the package's normal provider, button, and input.

Tap the editor, enter text or select a range, then toggle Search/Done and cycle
the custom label while the keyboard is open. The keyboard should refresh its
action/label without increasing the focus/blur counters or clearing the text;
selection should remain on the same editor. Test several switches in both
directions, with and without an active composing suggestion. A keyboard may
commit/cancel an active composing suggestion when its connection restarts. Tap
Done separately to verify normal submit/blur behavior, then navigate away with a
refresh pending to check unmount safety. Repeat with another keyboard app/device
when available because IMEs control their final presentation.

Press and hold the rounded/asymmetric buttons near their corners. The ripple
should stay inside the painted outline for repeated presses, including after
changing styles. Default ripples are bounded; callers can still supply an explicit
`android_ripple` configuration. This fixture is a manual integration check;
JavaScript tests and native compilation alone do not establish rendered behavior.

# Core palette

The screenshot accents live in `../../../scripts/core-palette.json`. Each family
has one shared, appearance-independent ramp. The exact light accent is always
500. The exact dark accent is included at its nearest 50-step position, based on
perceptual lightness. If rounding would put both anchors at 500, the dark anchor
gets the adjacent 450 or 550 stop in the appropriate direction.

Current dark accent stops:

- 400: yellow, mint, teal, cyan
- 450: red, orange, lime, green, blue, indigo, purple, pink, brown

All families include 50, 100–900 in steps of 100, and 950. Additional stops exist
only where an exact screenshot anchor requires one. Shade numbers increase from
light to dark, regardless of which appearance uses the color.

Generation interpolates in [Oklab](https://bottosson.github.io/posts/oklab/)
between a near-white endpoint, both exact anchors, and a dark endpoint. Out-of-gamut
interpolated colors lose chroma at fixed lightness and hue until they fit sRGB.
Anchor hex values bypass conversion, so rounding never changes the supplied colors.
Regenerate with `npm run generate:palette` from this workspace.

`coreColors` combines these ramps with a shared gray ramp, the existing theme
neutrals, and effects. Neutral theme mappings now reference these ramps and shared opacity recipes. Chromatic families use `core-<color>`
instead of the former brand names: sea becomes blue, sky becomes cyan, land
becomes lime, and magenta becomes pink. Array tokens use the same family names: `array-blue`, `array-cyan`,
`array-lime`, and `array-pink` (and their `-accent` counterparts) reference those ramps.
The legacy sea, sky, land, and magenta array names have been removed.

Theme roles need not use 500. In particular, light-theme blue text, primary-button
fills, and destructive red fills use deeper shades for contrast with white.
Native semantic color resources must be regenerated when these mappings change.


## Gray ramp

`../../../scripts/grey-palette.json` records all printed hex colors and opacity
settings from `greays.png`. The generated gray ramp contains all 22 distinct base
colors exactly, plus interpolated standard stops and one custom design stop (31 shades in total).
White is `core-grey-0`, the screenshot's light Gray is `core-grey-500` (`#939292`),
its dark Gray is `core-grey-501` (`#939290`), the darkest screenshot Gray 6 is
`core-grey-950` (`#1e1e1d`), and black is `core-grey-1000`.

Other anchors are positioned by Oklab lightness, rounding to 5-step labels where
possible. Closely spaced values receive adjacent numbers so none are discarded
or merged. Standard 50, 100–900, and 950 stops are interpolated where absent.
Unlike the chromatic ramps, gray includes exact white and black endpoints.

`coreGreyAnchors` maps original hex values to ramp tokens. `coreGreyLayers` records
the source token and exact opacity for each translucent fill/label in both
appearances. These preserve the source recipes. `coreGreyRecipes` also includes opaque fills, text, and backgrounds; `recipes.ts` maps them into active theme tokens.
Their visible color depends on the underlying surface; the ramp stores their
unflattened base colors. For example, primary fill is `core-grey-565` (`#808080`)
at 12%, and secondary light text is `core-grey-795` (`#434242`) at 60%.

## Theme recipes

`recipes.ts` is the shared mapping from neutral theme tokens to source recipes.
`resolveColorRecipe` produces hex for opaque colors and RGBA for translucent
colors, suitable for JavaScript and React Native. `colorRecipeCss` produces a
palette CSS variable or `color-mix(..., transparent)` for web. Alpha stays in the
color value; recipes never set component opacity or bake against a backdrop.

Existing theme token names remain stable. Primary/secondary surfaces use the
screenshot backgrounds, primary text uses black/white, secondary text and icons
use the 60% label recipe, tertiary text uses 30%, and disabled/quaternary text uses
18%. New tokens cover `core-text-quaternary`, `core-fill-primary`,
`core-fill-secondary`, `core-fill-tertiary`, `core-surface-elevated`, and
`core-surface-liquid-glass`. Outlines, tint surfaces, and scrollbars use solid gray
stops. Glass/overlay surfaces use the source 80% recipe.

The old `brand-grey-*` and `brand-white-*` primitives are retired. Existing
chromatic mappings remain intact. Regenerate palette and theme CSS together with
`npm run generate:palette`; then regenerate native color resources. The generated
CSS retains palette references, while native resources preserve numeric alpha.


## Custom dark primary surface

`../../../scripts/grey-custom.json` adds `core-grey-975` (`#101010`) between pure
black and the secondary surface (`#1f1e1e`). The dark `core-surface-primary` role
uses this custom stop; light primary stays white. Original screenshot anchors and
recipes remain unchanged. The override is explicit in `neutralRecipe` in
`recipes.ts`, so both CSS and native resolve the same color.


## Array backgrounds and accents

`array-<family>` uses the family's 500 color at 10% in light appearance and 16%
in dark appearance. Alpha remains in the color, so backgrounds blend with the
receiving surface. `array-<family>-accent` replaces the former `-label` token and
is opaque: light uses 700 (cyan 800, purple 600), while dark uses 400.
Light lime and yellow deliberately use 700 to preserve their hue; these visual
choices do not guarantee 4.5:1 contrast for normal text on every tinted surface.


## Appearance-aware base aliases

Use `core-red`, `core-blue`, and the other `core-<family>` aliases for the base
accent that follows the current appearance. They resolve to the exact light/dark
anchors recorded in `corePaletteAnchors`; `core-grey` uses 500 / 501.
Numbered ramp tokens remain fixed and unchanged for explicit shade selection.
These base aliases are palette accents, not contrast-adjusted text roles.


### Grey level aliases

`core-grey-1` through `core-grey-6` follow the original light/dark grey pairs.
`core-grey-1` is equivalent to `core-grey`. These aliases do not change any
numbered ramp stop, including `core-grey-40` and the 50–1000 range.

| Alias | Light stop | Dark stop |
| --- | --- | --- |
| `core-grey-1` | 500 | 501 |
| `core-grey-2` | 350 | 660 |
| `core-grey-3` | 230 | 770 |
| `core-grey-4` | 185 | 821 |
| `core-grey-5` | 95 | 880 |
| `core-grey-6` | 40 | 950 |

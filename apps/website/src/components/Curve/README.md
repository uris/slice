# Curve

Render CSS easing strings, numeric samples, or explicit `{ x, y }` points as SVG. Import from server or client components; playback runs in the browser.

```tsx
import { Curve } from '@/components/Curve';

// Pass Slice motion tokens directly (duration tokens are not easing curves).
<Curve values={motion['motion-water']} label="Water easing" />
<Curve values={motion['motion-magnet']} label="Magnet easing" />
<Curve values={motion['motion-spring']} label="Spring easing" />

<Curve values={[0, 0.8, 1.2, 0.9, 1.05, 1]} label="Spring response" />
<Curve
  values={[{ x: 0, y: 0 }, { x: 0.2, y: 1 }, { x: 1, y: 0.5 }]}
  width={400}
  height={160}
  strokeColor="magenta"
  strokeWidth={2}
  label="Sampled curve"
/>
```

Numeric samples have evenly spaced X coordinates. Explicit points must arrive in
strictly increasing X order. Coordinates must be finite. Larger Y values draw
higher on the graph. Each dataset scales to fit the viewport; constant values draw
at the vertical center. Empty datasets draw nothing and single samples draw a dot.

Interpolation passes through each sample without introducing extra peaks. Supply
enough samples to capture the shape of a wave or spring; the component draws the
provided values rather than simulating physics. Updating `values` redraws the curve.

Defaults: `width={400}`, `height={160}`, `strokeColor="currentColor"`, and
`strokeWidth={2}`. The SVG shrinks to fit its container while preserving its aspect
ratio. Use `className` and `style` for layout. Supply `label` for an accessible image;
without a label, the SVG is decorative and hidden from assistive technology.

CSS `cubic-bezier(...)` values draw an exact cubic Bézier segment. CSS `linear(...)`
values draw straight segments between stops, preserving the actual timing function,
including overshoot, repeated positions, two-position stops, and implicit positions.
Multiline strings are accepted. Both axes fit the actual curve minimum and maximum, including overshoot and
undershoot. Bézier bounds use exact curve extrema, rather than control points.
Padding leaves room for the stroke and animated shape to avoid clipping. Unsupported strings such
as durations, `var(...)`, or `calc(...)` throw a descriptive error.

Click a curve (or focus it and press Enter/Space) to animate a square marker along
the path. Each click restarts playback. On completion, the shape waits two seconds, then resets to the start. X represents elapsed time, so the marker
tracks the displayed easing rather than travelling at constant path speed.

```tsx
<Curve
  values={motion['motion-water']}
  duration={motion['motion-water-duration']}
  shapeColor="magenta"
  shapeSize={16}
  resetDelay={2000}
  label="Water easing"
/>
```

`animateOnClick` defaults to `true`; set it to `false` for a static SVG. `duration`
defaults to 1000 milliseconds and accepts numbers or CSS `s`/`ms` strings. Playback
respects reduced-motion preferences by leaving the shape at the start. Empty and
single-value curves have playback disabled. Playback is cancelled when the curve
changes or unmounts.

Use `shapeColor` to set the animated square’s fill (defaults to `strokeColor`) and
`shapeSize` to set its side length in SVG units (defaults to 10). The size scales with
the SVG and is capped at half the smaller viewport dimension to leave room for
the curve. `shapeSize={0}` hides the shape. Sizes must be finite and non-negative.
`markerColor` remains supported as an alias; `shapeColor` takes precedence.

`resetDelay` controls the pause after playback, defaulting to `2000` milliseconds.
It also accepts CSS strings such as `"2s"`. Set `resetDelay={0}` for an immediate
reset. Clicking again cancels a pending reset and restarts playback.

By default, the animated shape is transparent at rest. It becomes visible during
playback and remains visible during `resetDelay`, then returns to the start and
becomes transparent. Set `resetToTransparent={false}` to keep it visible at rest
and after resetting. The default is `true`.

`shapeRadius` sets the square’s corner radius in SVG units (default `0`).
For example, `shapeSize={20} shapeRadius={4}` draws a rounded square. Radius is
capped at half the shape size; use half the size to get a circle.

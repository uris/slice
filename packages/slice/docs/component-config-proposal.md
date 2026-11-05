# Slice configuration proposal

Status: proposed; not implemented. This records the intended approach for future
work on the web Slice package. API names and exact configurable props remain subject
to implementation review.

## Intent

Slice deliberately exposes styling and motion through component props. Let consuming
applications set those props' defaults centrally, without wrapping every component
or maintaining a fork. Configuration is incremental: setting only Slider's height
must leave every other default unchanged.

A static `slice.config.ts` (or imported JSON object) in the consuming project is
passed to `ThemeProvider`. The provider receives an object, not a path string or
the name of a JavaScript variable. No file discovery or runtime fetching is needed.
TypeScript is preferred for autocomplete and validation; JSON can be imported and
checked against the same shape, with runtime validation needed for untrusted input.

## Proposed consumer API

```tsx
// slice.config.ts
import type { SliceConfig } from '@apple-pie/slice';

export const sliceConfig = {
  components: {
    Slider: {
      height: 6,
    },
    Button: {
      variant: 'solid',
      borderRadius: 8,
      textColor: 'core-text-primary',
      transition: { duration: 0.15 },
    },
  },
  themes: {
    light: {
      colors: { 'core-button-primary': '#2458E6' },
    },
    dark: {
      colors: { 'core-button-primary': '#8EA8FF' },
    },
  },
} satisfies SliceConfig;
```

```tsx
import { sliceConfig } from './slice.config';

<ThemeProvider config={sliceConfig}>
  <App />
</ThemeProvider>
```

The flat component entries are themselves default props; an additional `defaults`
level is unnecessary for the initial scope. Omitting either section preserves the
existing behavior.

## Types and prop resolution

Use an explicit `Pick` allowlist for each component, wrapped in `Partial`:

```ts
type ButtonConfig = Partial<Pick<
  ButtonProps,
  'variant' | 'size' | 'borderRadius' | 'textColor' | 'transition'
>>;

type SliderConfig = Partial<Pick<
  SliderProps,
  'height' | 'trackHeadBorderWidth' | 'trackColor' | 'progressColor'
>>;

export type SliceConfig = {
  components?: {
    Button?: ButtonConfig;
    Slider?: SliderConfig;
    // Add an explicit entry for each supported component.
  };
  themes?: {
    light?: { colors?: Partial<Colors> };
    dark?: { colors?: Partial<Colors> };
  };
};
```

These reuse existing prop types. Event handlers such as `onClick` and `onChange`,
content, controlled values, refs, and operational state are excluded. New component
props do not automatically become configurable. Start with styling and motion;
review other interaction options individually.

Each component uses a shared helper along these lines:

```tsx
const configuredProps = useComponentConfig('Button', rawProps);
const props = resolveColorProps(configuredProps);
// Existing destructuring defaults and derived styles follow.
```

Resolution order, from lowest to highest priority:

1. Built-in component defaults.
2. Configured component defaults.
3. Explicit instance props.

Treat `undefined` as inherit at every layer, preserving meaningful `false`, `0`,
empty strings, and supported `null` values. A plain object spread is insufficient
because an instance's `undefined` would erase a configured value. Existing
destructuring defaults can remain the final fallback; built-in defaults need not
all move into a central registry.

Use shallow prop merging. Object-valued props such as Motion's `transition` replace
the lower-priority object rather than undergoing generic deep merging. Define any
exception explicitly. Resolve configuration before color normalization and other
derived calculations.

## Token values and their multiple representations

Configuration has two complementary paths:

- Component entries supply React prop defaults through context.
- Theme entries supply CSS custom property overrides.

Keep the existing token vocabulary fixed initially. Consumers customize values for
light/dark mode, not token names. A color prop containing a token name resolves to
`var(--token-name)`. Utility classes and exported CSS-variable helpers must reference
that same variable, so one override affects all of those usages consistently.
Existing `resolveColor` and `colorCssVars` already support this direction.

A literal color in component config remains fixed across modes. A semantic token
reference follows that token's configured light/dark values. Theme changes therefore
do not require separate mode-specific component defaults for ordinary colors.

For sizes, distinguish reusable token values from component recipes. Changing a
spacing token affects its references; setting `Button.size` selects the button's
existing sizing recipe. It does not redefine what every component's "medium" means.
Use explicit dimension props for component-specific dimensions. Redefining entire
per-size recipes can remain a future extension.

Audit literal JavaScript exports before promising universal customization. For
example, `corners['corner-m']` currently returns a number. A CSS variable override
cannot change that number. CSS-compatible consumers should use variable references;
code needing numeric values would need a config-aware resolution path. The same
limitation applies to raw theme objects exposed to JavaScript: they do not become
configured values automatically.

## When and how CSS is applied

The provider generates a small `<style>` element containing declarations only for
configured tokens. It does not modify any stylesheet on disk. Render it with the
initial tree, including SSR, rather than injecting it in a mount effect; overrides
should be available on the first paint.

Emit both light and dark declarations together. Switching the existing theme
attribute selects the appropriate rules without regenerating CSS. The proposed
config keys `light` and `dark` map to Slice's current DOM theme names `lightMode`
and `darkMode`.

Selector precedence needs deliberate implementation. Current color defaults are
declared on `[data-slice-theme-scope]` beneath
`:root[data-slice-theme="lightMode"]` / `darkMode`. Merely setting an override on
`:root` will not override a value declared directly on the descendant scope. Target
the actual scope and ensure configured rules win regardless of stylesheet load
order, preferably using a provider-specific scope identifier. Avoid global overrides
from one provider accidentally affecting another.

The current provider controls document-level mode. Independently themed nested
providers are a separate feature, not implied by scoped token overrides. If nested
configuration is supported, merge component entries and token maps in the provider
with inner values winning, and verify CSS inheritance across nested scopes.

Account for CSP nonce support where required and use a controlled CSS serializer
for known token keys/values, including safe rendering inside an SSR style element.

## Performance

An imported module-level constant has a stable reference and will not itself cause
context updates during normal rendering. Each component performs a context read
and a small shallow prop merge, without an additional render caused by the merge.

Keep configuration context separate from changing theme state internally, even if
both are exposed through `ThemeProvider`. Memoize generated CSS and any inherited
configuration by config identity. Do not deep-merge the whole configuration in
every component or mutate caller-owned objects.

Changing a shared config context would notify all its consumers, including memoized
components. That is acceptable for the intended static-file usage. Per-component
subscriptions and elaborate caching are unnecessary initially. CSS mode changes
still incur normal browser style/paint work, but token-only consumers need not
subscribe to mode changes in JavaScript.

## Implementation follow-up

1. Inventory and approve configurable props for each component; derive their types
   with `Pick` and publish `SliceConfig` through a type-only export.
2. Add the optional provider config and the typed component-resolution hook, keeping
   existing behavior intact when no config is supplied.
3. Integrate resolution before normalization/derived styles in components. Preserve
   tree shaking by avoiding runtime imports of all components into a registry.
4. Add scoped, SSR-rendered token override CSS with correct cascade precedence.
   Audit classes, token helpers, and literal JavaScript values for consistency.
5. Verify incremental config, precedence, undefined handling, false/zero/null,
   object replacement, token-name colors, light/dark switching, SSR first paint,
   and multiple/nested provider behavior if supported.
6. Compare representative existing component benchmarks with and without static
   config before introducing further optimization.

Wrappers remain useful for application-specific composition. Slots, named recipes,
new token names, native support, and per-mode component defaults can be considered
later when concrete needs justify expanding the API.

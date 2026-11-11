# Contributing

Use Node.js 24. Install dependencies once from the repository root with `npm install`
(or `npm ci` in CI). Commit the root lockfile; do not create workspace lockfiles.

## Workspace boundaries

- `apps/` contains private deployable applications. Each owns its configuration and scripts.
- `packages/` contains independently versioned libraries. Published names and exports belong
  to each package manifest; the repository root is private and cannot be published.
- Keep project documentation and scripts with their workspace. Repository-wide conventions
  belong here; deployment infrastructure lives in `deployment/`.
- Shared tokens and icons still live in `packages/slice` for this migration. Native imports
  the existing plain theme modules and generates artwork from web sources. Do not import
  browser stores, providers, or CSS into native. Extracting shared packages is a later step.

## Code readability

Avoid nested ternary expressions. Extract branching logic into a named statement
or helper with explicit `if`/`return` branches, even when this takes more lines.
For complex derived values, prefer a local `const getValue = () => { ... }` helper
and use its result in the rendering or style object. Keep JSX and configuration
objects easy to scan rather than embedding several decisions in one expression.
A simple two-way ternary is fine when it remains easy to read.

```tsx
const getTextColor = () => {
  if (disabled) return textColorDisabled;
  if (error) return textColorError;
  if (isFocused) return textColorFocused;
  return textColorBlurred;
};

const textColor = getTextColor();
```

Apply this when writing or editing code; avoid unrelated repository-wide rewrites.
Do not add memoization solely to make an extracted helper look optimized.

## Composable APIs

**Composability is a core Slice requirement.** Always look for useful connections
between components, hooks, stores, and utilities when designing or changing an API.
A value or callback produced by one Slice API should be directly usable by related
APIs, with compatible types and semantics. Avoid forcing consumers to write adapter
callbacks, reshape equivalent data, or use type assertions just to connect Slice APIs.

For example, the web `useMicrophone` hook exposes `micOptions` as
`DropDownOption<MicOption>[]`, and its `setMicrophone` callback accepts the selected
option. Consumers can connect them directly:

```
import { DropDown, useMicrophone } from '@apple-pie/slice';

function MicrophonePicker() {
    const { micOptions, setMicrophone } = useMicrophone();
    return <DropDown options={micOptions} onChangeOption={setMicrophone} />;
}
```

Likewise, a `KeyboardShortcut` definition should work with both
`useKeyboardShortcuts` and `PopMenuItem.shortcut`; the item handles its own display
formatting while the application owns activation.

Before introducing a new shape or callback signature, inspect related public APIs
and reuse their types where their meaning matches. Preserve generic inference and
optional/null behavior across the connection. Prefer explicit, typed integrations
over coupling unrelated APIs or introducing broad unions merely to hide a mismatch.
Document and test the direct composition, including assigning callbacks without
casts or glue code, so future changes preserve the contract.

## Commands

Run a workspace's command with `npm run <script> --workspace=<name>`.
The existing root shortcuts (`build`, `test`, `coverage`, `storybook`,
`storybook:native`, `dev:landing`, and their build commands) remain available.
React and React DOM use the same pinned development version across workspaces and
the root test runtime. Update them together to avoid duplicate or mismatched renderers.
Root `lint`, `lint:fix`, and `lint:ci` use the single root `biome.json` and run
`typecheck:all`, which invokes every workspace that defines a `typecheck` script.
Workspace lint commands inherit the same root Biome configuration.

Biome includes JavaScript/JSX, TypeScript/TSX, JSON/JSONC, and CSS files recursively,
covering workspace sources, Storybook configuration, and root configuration files.
The same patterns work when a command runs from the root or an individual workspace. Generated dependencies, library builds, Storybook sites, pack
folders, coverage/reports, public assets, Next.js output and generated type references, and native iOS resource
catalogs are excluded. Existing exclusions for tests, smoke screens, and web
benchmarks remain. Generated native icon TypeScript stays included because its
generator intentionally formats it.

```sh
npm run lint:ci
npm run typecheck --workspace=@apple-pie/slice-native
npm run typecheck:storybook:native
npm test --workspace=@apple-pie/slice-native
npm run build:landing
npm run build-storybook
npm run build-storybook:native
```

Web tests and coverage include the web Storybook integration. Install Playwright
Chromium with `npx playwright install chromium` before browser tests or native icon generation.
Build output stays inside the workspace (`dist/`, `storybook-static/`, or coverage reports).
Native packaging also validates Codegen files and generated iOS assets.

See [web contribution guidance](packages/slice/CONTRIBUTING.md),
[web architecture](packages/slice/docs/build-architecture.md), and
[native working practices](packages/slice-native/AGENTS.md) for project-specific rules.

Work on a feature branch and open a PR; do not push directly to protected `main`.
CI runs for all workspaces on PRs and pushes to `main`, without path filters.
After merging, deployment is a separate manual action: run **Deploy Slice Site**
from `main` and choose `website`, `web-docs`, or `native-docs`. Merging does not
deploy any site. See [deployment instructions](deployment/README.md).

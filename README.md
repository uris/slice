# Slice (`@apple-pie/slice`)

Slice is a TypeScript-first React UI kit with themed components, hooks, optional Zustand stores, worker-backed uploads, and Storybook documentation.

The package is currently in beta. Until `1.0.0`, breaking API changes may still happen.

Docs and showcase: https://slice-uikit.com

GitHub repository: https://github.com/uris/slice

## Installation

```bash
npm install @apple-pie/slice react react-dom motion
```

Optional peer dependency for store APIs:

```bash
npm install zustand
```

## Quick Start

Import the package stylesheet once at your app root:

```tsx
import '@apple-pie/slice/styles.css';
```

Slice uses Funnel Sans as its default typeface. Load the font in your app so the theme typography renders correctly.

```css
@import url("https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap");
```

Wrap your app with `ThemeProvider` and use components inside that scope:

```tsx
import '@apple-pie/slice/styles.css';
import { Avatar, Button, ThemeProvider, useTheme } from '@apple-pie/slice';

function ThemeToggle() {
	const theme = useTheme();

	return (
		<Button
			label={theme.isDark ? 'Switch to Light' : 'Switch to Dark'}
			onClick={() => theme.toggle()}
		/>
	);
}

export default function App() {
	return (
		<ThemeProvider system global>
			<Avatar size={32} name="John Appleseed" />
			<ThemeToggle />
		</ThemeProvider>
	);
}
```

For more setup examples, theming guidance, component docs, and Storybook demos, use the site:

- https://slice-uikit.com

## What Slice Includes

- React UI components for layout, inputs, feedback, modal flows, overlays, media, and uploads
- Typed theme tokens for color, typography, elevation, motion, and light or dark themes
- Hooks for theme state, resize observation, keyboard shortcuts, local storage, audio, microphone, tooltips, and window helpers
- Optional Zustand-backed stores exposed through package subpaths
- Worker-backed uploads through `@apple-pie/slice/workers/uploads`

## Package Surface

Primary entrypoint:

```ts
import { Avatar, ThemeProvider, useTheme } from '@apple-pie/slice';
```

Common subpaths:

- `@apple-pie/slice/components/*`
- `@apple-pie/slice/hooks`
- `@apple-pie/slice/hooks/*`
- `@apple-pie/slice/providers`
- `@apple-pie/slice/providers/*`
- `@apple-pie/slice/stores`
- `@apple-pie/slice/stores/*`
- `@apple-pie/slice/theme`
- `@apple-pie/slice/theme/colors`
- `@apple-pie/slice/theme/corners`
- `@apple-pie/slice/theme/elevations`
- `@apple-pie/slice/theme/motion`
- `@apple-pie/slice/theme/type`
- `@apple-pie/slice/theme/themes`
- `@apple-pie/slice/css/flexBox.module.css`
- `@apple-pie/slice/css/type.module.css`
- `@apple-pie/slice/utils`
- `@apple-pie/slice/utils/objects`
- `@apple-pie/slice/workers/*`
- `@apple-pie/slice/styles.css`

## Development

```bash
npm install
npm run dev
npm run storybook
npm run test
npm run benchmark
npm run build
npm run lint
```

Contributor setup and workflow:

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [contributor-docs/build-architecture.md](./contributor-docs/build-architecture.md)

## License

[ISC](./LICENSE) - do whatever you'd like with it.

## Support

- Documentation and demos: https://slice-uikit.com
- Source and issues: https://github.com/uris/slice

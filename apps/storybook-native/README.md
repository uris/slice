# storybook-native

Native documentation application using React Native Web. Stories remain in
`packages/slice-native/stories`; this workspace owns the browser tooling.

Install dependencies from the repository root. Run these commands from this workspace:

```sh
npm run dev
npm run build
npm run typecheck
```

Build output is `apps/storybook-native/storybook-static/` relative to the repository root,
including when using the root build shortcut.

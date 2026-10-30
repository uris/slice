# storybook-native

Native documentation application using React Native Web. Component and hook stories live beside their implementations under
`packages/slice-native/src`. Shared MDX pages live in
`packages/slice-native/documentation`; this workspace owns the browser tooling.

Install dependencies from the repository root. Run these commands from this workspace:

```sh
npm run dev
npm run build
npm run typecheck
```

Build output is `apps/storybook-native/storybook-static/` relative to the repository root,
including when using the root build shortcut.

# storybook-web

Web documentation application. Stories and MDX remain with the web library in
`packages/slice`; this workspace owns the Storybook configuration and static assets.

Install dependencies from the repository root. Run these commands from this workspace:

```sh
npm run dev
npm run build
```

Build output is `apps/storybook-web/storybook-static/` relative to the repository root,
including when using the root build shortcut.

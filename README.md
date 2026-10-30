# Slice monorepo

Slice's web and React Native libraries, documentation apps, and website.

| Workspace | Purpose |
| --- | --- |
| [packages/slice](packages/slice/README.md) | Published `@apple-pie/slice` React library |
| [packages/slice-native](packages/slice-native/README.md) | Published `@apple-pie/slice-native` library |
| [apps/website](apps/website/README.md) | Landing website (Next.js static export) |
| [apps/storybook-web](apps/storybook-web/README.md) | Web Storybook |
| [apps/storybook-native](apps/storybook-native/README.md) | Native Storybook rendered on the web |

Use Node.js 24 and run `npm install` at the repository root. npm manages all
workspaces with one root `package-lock.json`.

```sh
npm run dev:landing      # Website on port 6008
npm run storybook        # Web docs on port 6006
npm run storybook:native # Native docs on port 6007
npm run build           # Web library
npm run build --workspace=@apple-pie/slice-native
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for workspace conventions and
[deployment/README.md](deployment/README.md) for hosting.

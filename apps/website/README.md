# Slice website

Repository guidance: [AGENTS.md](../../AGENTS.md).

Next.js App Router website, served by a Next.js Node server in production.

Install dependencies from the repository root. Run from this workspace:

```sh
npm run dev       # http://localhost:6008
npm run build     # Production output in .next/
npm run start     # Production server at http://localhost:6008
npm run typecheck
npm run test:css-hmr
```

The root shortcuts `dev:landing`, `build:landing`, `start:landing`, and `typecheck:landing` still work.
The page lives in `app/page.tsx`; `layout.tsx` owns metadata and global styles.
The client provider preserves the existing fixed dark theme, and `src/App.tsx`
contains the landing page UI.

The workspace uses Webpack and TypeScript paths to consume local Slice sources,
so development does not require building the web library first. Its PostCSS
configuration preserves Slice's nesting and custom media handling.

In development, `next.config.ts` replaces mini-css-extract-plugin's CSS reload
helper with `loaders/css-hot-reload.js`. The upstream helper also clones preload
links and assumes the original link still has a parent, which can race with App
Router stylesheet replacement. The local helper remembers loaded stylesheets and
fetches their compiled CSS with fresh URLs and `cache: 'no-store'`, then applies it
through development-owned style elements. Webpack already resolves font/image asset
URLs. This prevents React from restoring stale links over an update. Previous styles
stay active until their replacements load; failed or out-of-order responses cannot
overwrite the last working version.
Production keeps Next's standard CSS pipeline. Restart the dev server after editing
the config or reload helper.

The Docker `landing` target runs `next start` on container port 80. Known docs
slugs are prerendered by `generateStaticParams()`; other slugs reach the docs page at
request time. Unknown, missing, or unwritten documents show a content-level
"Document not found" message while keeping the package navigation, menu, and sidebar visible.
See [deployment](../../deployment/README.md) for hosting.

`next-env.d.ts`, `.next/`, `out/`, and TypeScript build caches are generated and ignored.
The typecheck command runs `next typegen` before TypeScript so it works on a fresh checkout.

## Documents

Follow the [component documentation guide](src/content/documents/README.md) for
content structure, tone, previews, examples, API references, and AI editing guidance.

Routes use `/docs/{packageType}/{slug}/`, for example `/docs/react/avatar/`.
The content layout resolves the package and slug through `src/docs/registry/documents.ts`
and dynamically imports only the selected document. Documents are registered per package;
a React document is not automatically available under React Native.

To add a document:

1. Create it under `src/content/documents/<package>/`. Export its component as the default
   export and an optional `trackedItems` array. Existing named exports can stay:

   ```
   export { AvatarDoc as default, avatarTrackedItems as trackedItems };
   ```

2. Add its explicit import to the matching package map in `src/docs/registry/documents.ts`.
3. Set the sidebar item's slug in `src/docs/registry/sidebar.ts` to the same key.
4. Add its slug and metadata to `src/docs/registry/react.ts` or `react-native.ts` if it
   should have custom metadata and be included in static generation.

The loaded module owns its table of contents. Only H1, H2, and Definition anchors are
tracked; H3 content is not. Missing documents have no document-specific navigation.
Unfinished sidebar entries keep their own slugs and show the missing-document view
until an implementation is registered. Import failures show a separate loading error
inside the same shell. Missing slugs (`/docs/react/` or `/docs/react-native/`) also retain
the docs shell.

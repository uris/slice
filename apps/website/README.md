# Slice website

Next.js App Router landing site, exported as static HTML for the existing Nginx deployment.

Install dependencies from the repository root. Run from this workspace:

```sh
npm run dev       # http://localhost:6008
npm run build     # Static output in out/
npm run typecheck
```

The root shortcuts `dev:landing`, `build:landing`, and `typecheck:landing` still work.
The page lives in `src/app/page.tsx`; `layout.tsx` owns metadata and global styles.
The client provider preserves the existing fixed dark theme, and `src/App.tsx`
contains the landing page UI.

The workspace uses Webpack and TypeScript paths to consume local Slice sources,
so development does not require building the web library first. Its PostCSS
configuration preserves Slice's nesting and custom media handling.

`output: 'export'` writes `apps/website/out/` when built from the root. The Docker
`landing` target serves this directory with Nginx. Server-only Next.js features
require revisiting this deployment mode; no Node server is needed for this page.
See [deployment](../../deployment/README.md) for hosting.

`next-env.d.ts`, `.next/`, `out/`, and TypeScript build caches are generated and ignored.
The typecheck command runs `next typegen` before TypeScript so it works on a fresh checkout.

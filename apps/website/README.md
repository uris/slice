# Slice website

Next.js App Router website, served by a Next.js Node server in production.

Install dependencies from the repository root. Run from this workspace:

```sh
npm run dev       # http://localhost:6008
npm run build     # Production output in .next/
npm run start     # Production server at http://localhost:6008
npm run typecheck
```

The root shortcuts `dev:landing`, `build:landing`, `start:landing`, and `typecheck:landing` still work.
The page lives in `app/page.tsx`; `layout.tsx` owns metadata and global styles.
The client provider preserves the existing fixed dark theme, and `src/App.tsx`
contains the landing page UI.

The workspace uses Webpack and TypeScript paths to consume local Slice sources,
so development does not require building the web library first. Its PostCSS
configuration preserves Slice's nesting and custom media handling.

The Docker `landing` target runs `next start` on container port 80. Known docs
slugs are prerendered by `generateStaticParams()`; other slugs reach the page at
request time, where `isDocSlug()` and `notFound()` return a 404.
See [deployment](../../deployment/README.md) for hosting.

`next-env.d.ts`, `.next/`, `out/`, and TypeScript build caches are generated and ignored.
The typecheck command runs `next typegen` before TypeScript so it works on a fresh checkout.

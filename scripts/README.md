# Web package scripts

These scripts support the repository-root `@apple-pie/slice` package. Run them
from the repository root; their paths depend on the current working directory.
React Native generation, packaging, and verification scripts are documented in
[native/scripts/README.md](../native/scripts/README.md).

| Script | What it does | Inputs and outputs | How it is used |
| --- | --- | --- | --- |
| [finalize-styles.mjs](finalize-styles.mjs) | Consolidates Rollup's extracted stylesheet into the single public stylesheet. Rejects missing/empty CSS and differing ESM/CJS stylesheets. | Reads `dist/esm/styles.css` and/or `dist/cjs/styles.css`; writes `dist/styles.css` and removes the per-format copies. | Runs after Rollup and TypeScript in `npm run build` and `npm run build:min`. Direct command: `node scripts/finalize-styles.mjs`. |
| [copy-css.sh](copy-css.sh) | Copies the two public CSS modules without transforming them. | Copies `src/utils/styling/flexBox.module.css` and `type.module.css` to `dist/css/`. Uses `mkdir` without `-p`, so expects that output directory not to exist yet. | Last step of `npm run build` and `npm run build:min`. Direct command: `bash scripts/copy-css.sh`. |
| [copy-tgz.sh](copy-tgz.sh) | Moves all root-level `.tgz` archives into `pack/`, creating the directory if necessary. Exits successfully if no archives exist. | Moves `./*.tgz` to `pack/`; does not create, publish, or install packages. | `npm run pack:tarball` first runs `npm pack` (which triggers the build through `prepack`), then this script. Direct command: `bash scripts/copy-tgz.sh`. |

The build commands are defined in [package.json](../package.json). They generate
`dist/`; do not edit build output directly. Keep this index updated when scripts
change.

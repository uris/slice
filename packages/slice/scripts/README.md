# Web package scripts

These scripts support the `packages/slice` package. Run them
from `packages/slice`; their paths depend on the current working directory.
React Native generation, packaging, and verification scripts are documented in
[native scripts](../../slice-native/scripts/README.md).

| Script | What it does | Inputs and outputs | How it is used |
| --- | --- | --- | --- |
| [finalize-styles.mjs](finalize-styles.mjs) | Consolidates Rollup's extracted stylesheet into the single public stylesheet. Rejects missing/empty CSS and differing ESM/CJS stylesheets. | Reads `dist/esm/styles.css` and/or `dist/cjs/styles.css`; writes `dist/styles.css` and removes the per-format copies. | Runs after Rollup and TypeScript in `npm run build` and `npm run build:min`. Direct command: `node scripts/finalize-styles.mjs`. |
| [copy-css.sh](copy-css.sh) | Copies the two public CSS modules without transforming them. | Copies `src/utils/styling/flexBox.module.css` and `type.module.css` to `dist/css/`. Uses `mkdir` without `-p`, so expects that output directory not to exist yet. | Last step of `npm run build` and `npm run build:min`. Direct command: `bash scripts/copy-css.sh`. |
| [copy-tgz.sh](copy-tgz.sh) | Moves this workspace's `.tgz` archives into `packages/slice/pack/`, creating the directory if necessary. Resolves paths from the script location, regardless of the caller's working directory. Exits successfully if no archives exist. | Moves `packages/slice/*.tgz` to `packages/slice/pack/`; does not create, publish, or install packages. | Run `npm run pack:tarball` from the repository root or this workspace. It first runs `npm pack` (which triggers the build through `prepack`), then this script. Direct command from the repository root: `bash packages/slice/scripts/copy-tgz.sh`. |

The build commands are defined in [package.json](../package.json). They generate
`dist/`; do not edit build output directly. Keep this index updated when scripts
change.

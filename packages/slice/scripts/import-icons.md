# Import Figma icons

Export SVGs into folders such as `icons/basic/*.svg`, then run from the repo root:

```sh
node packages/slice/scripts/import-icons.mjs /absolute/path/to/icons
npx biome check --write packages/slice/src/components/Icon/iconRegistry.tsx packages/slice/src/components/Icon/_types.ts
```

Supply all imported groups on each run. The importer replaces the consolidated
registry and catalog, including preserved artwork from `icon-registry.template.txt`
and `preserved-icon-groups.json`. Edit those templates to change retained icons.
`icon-types.template.txt` defines the Icon props included in the generated types.

Folders become groups in the single `SliceIcons` catalog. Filenames become
camel-case keys, for example `SliceIcons.basic.bookOpen`, whose value is
`basic.book-open`. `SliceIcon` is the union of all catalog values and is used by
Icon and component icon props. Nested export folders stay in their top-level group.
The existing Icon visualizer discovers the catalog automatically.

Legacy AI artwork is retained under `ai`, legacy brands are combined with imported
brands under `brands`, and specialized control artwork is retained under `system`:
check-circle (progress and radio), circle (radio), checkbox, checkbox-checked,
checkbox-partial, view (password visibility toggle), and blank (empty icon slots).
Compact filled More artwork is retained under `basic` as `more-horiz-fill` and
`more-vert-fill`, with 2.5px dots in the 20px viewBox.
Retained artwork takes precedence where an imported name matches. Bare legacy
names are removed; use qualified names such as `ai.wand` or `system.check-circle`.

The importer converts this export set's 24px artwork to 20px paths, removes
full-viewport clip wrappers, converts circles and rounded rectangles, preserves
opacity, and binds strokes to Slice's color and width props. The default stroke is
1.25px. Unsupported elements and path attributes are rejected for review.
Keep original exports to rerun the import and review the result in the visualizer.

Filled outlines inherit the stroke color but retain fixed geometry. The importer
reports these names after each run. They need centerline artwork for adjustable
stroke width.

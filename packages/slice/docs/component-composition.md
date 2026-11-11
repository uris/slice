# Component composition

Choose exports according to whether a child has a useful identity outside its
parent. Apply this convention to new APIs and intentional component refactors;
do not rename unrelated existing components just to match it.

## Composition across APIs

Composition includes compatible data and callbacks across hooks, stores,
components, and utilities, as well as JSX structure. Follow the repository's
[composable API guideline](../../../CONTRIBUTING.md#composable-apis) before adding
new shapes or callback signatures. Demonstrate related APIs connected directly,
without adapter callbacks or type assertions, and keep that usage typechecked.

## Parent-only sections

Expose structural sections through their parent using dot notation:

```
<DialogBox>
  <DialogBox.Title>Archive project?</DialogBox.Title>
  <DialogBox.Content>Keep the project history.</DialogBox.Content>
  <DialogBox.Actions>...</DialogBox.Actions>
</DialogBox>
```

DialogBox implements this shape. Verify each component’s current exports before
using the same pattern in its consumer docs.

These sections belong to the parent's structure, layout, and semantics. They are
not standalone controls. Export the parent with typed section members; do not add
bare `Title`, `Content`, or `Actions` exports or separate public component subpaths
for these sections. Memoization and generic parent props must retain their public
types when section members are attached.

Document sections on the parent's page, including their supported props, events,
and relationship to the parent. They do not need standalone website slugs.

## Independently useful controls

Keep controls that can be used independently as named exports, even when they also
participate in a group. For example, `RadioButton` can be used alone or within
`RadioButtonList`; it should not become only `RadioButtonList.RadioButton`.
These controls retain their own API documentation pages, linked to related parents.

## Documentation grouping for dependent controls

Use a parent-named sidebar group with `childDocs` when its related controls depend
on the parent for meaningful use. Include the parent's own page first, followed by
the dependent controls' pages: `TabBar` groups `TabBar` and `Tab`; `PopMenu` groups
`PopMenu`, `PopMenuGroup`, and `PopMenuItem`. Give a dependent control its own page
when it has a distinct public API to document; structural sections can remain on
the parent's page.

Compatibility alone does not establish a parent/child documentation relationship.
`RadioButton` remains a standalone sidebar entry because it is useful independently,
even though `RadioButtonList` can host it directly. Link their pages instead of
nesting the radio control under the list.

This is a documentation convention, not a requirement to reject standalone rendering
or rename public exports. Preserve the existing API and explain which behavior the
parent provides. See the [website documentation guide](../../../apps/website/src/content/documents/README.md#page-structure)
for page layout, sidebar registration, and tracking rules.

## Composition contracts

For parents with a fixed set of structural slots, define and test the contract:

- Which direct child sections are accepted, which are required, and whether each
  section may repeat. DialogBox's title, content, and actions sections
  are each accepted at most once.
- Whether the parent determines section order or preserves authored order.
  DialogBox's sections occupy header, body, and footer positions.
- How unsupported children, duplicate sections, and sections outside their parent
  are reported. Give clear development diagnostics instead of silently discarding
  content. Explain whether fragments and conditional children are supported.
- How composed sections interact with existing shorthand props or options arrays.
  Preserve useful alternatives, but reject competing definitions of the same slot
  rather than inventing implicit precedence.

Sections own their structural role; the parent coordinates shared layout and
accessibility relationships. Ordinary controls inside an actions section retain
explicit handlers. Do not infer cancellation, resolution, or rejection from button
labels or positions. If shared actions are exposed through context, document their
callback payloads and standalone-versus-hosted behavior explicitly.

Use Storybook interaction fixtures for rendered composition behavior, following
[the test-writing conventions](writing-tests.md). Update public types, examples,
and both documentation surfaces with the implementation. See the
[website documentation guide](../../../apps/website/src/content/documents/README.md#page-structure)
for page ownership and example ordering.

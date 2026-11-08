# Component documentation guide

This guide records the editorial and implementation conventions for the website's
component docs. Extend it as we agree on new patterns. Apply it to new documents
and edits to existing ones; preserve deliberate user changes.

Use [Avatar](react/components/Avatar/Avatar.tsx),
[Button](react/components/Button/Button.tsx), and
[ToggleButton](react/components/ToggleButton/ToggleButton.tsx) as references for
structure and focused preview-and-code examples.
[AudioBubble](react/components/AudioBubble/AudioBubble.tsx) also demonstrates a live
preview and a separate preview tip. These are examples, not sources of truth for
another component's API.

## Intent and audience

Help someone understand what a component offers, try it, and use it correctly.
Balance product appeal with a reliable technical reference. Readers should not
need to know our repository, Storybook, or internal implementation to follow the page.

Each section has a distinct job:

| Content | Purpose |
| --- | --- |
| Introduction | What the component does and where it is useful. |
| Preview | The actual component, with enough wiring to demonstrate its behavior. |
| Preview tip | How to try that particular demo. |
| Usage | How to use the component in an application. |
| Behavior | What happens during use, including meaningful edge cases. |
| Accessibility | Semantics, keyboard behavior, labels, and relevant application responsibilities. |
| Props | Complete, precise API reference. |
| Events | Component callbacks and inherited event support. |

## Voice and tone

- Write in plain, direct language. Be welcoming and useful without sales hype.
- Prefer “UI” over “interface” in product copy.
- Keep the introduction to one or two short sentences. Describe a concrete benefit
  or use case rather than making broad claims about quality or performance.
- Prefer short paragraphs, usually one or two sentences. Each paragraph should add
  something new. Remove phrases that merely restate the heading, type, or default.
- Explain an action and its effect: "Lower peakIntensity for a stronger response to
  quiet sounds." Avoid vague phrases such as "unlock powerful customization."
- Use inline `Code` by default for API identifiers in all guidance text: prop and
  event names, component and hook references, types, methods, native attributes
  (including ARIA), and literal values or expressions. This applies to Usage,
  Behavior, Accessibility, tips, and prop descriptions—not only the API reference.
  For example: `<Code>tabBarName</Code>`, `<Code>panelId</Code>`,
  `<Code>role="tabpanel"</Code>`, and `<Code>null</Code>`. Explain what changing a
  value does, with units or a small example when useful.
- Use Markdown backticks for the same references in MDX and Markdown docs. Code
  formatting does not imply a link; follow the separate related-document linking
  guidance. Keep established title, heading, Definition, and navigation styling.
- Leave ordinary language unformatted when it is not referring to an API identifier
  or literal—for example, “Tab enters the group” names a keyboard key, and “the
  selected tab” describes state. Depart from inline code only when context provides
  a clear readability or semantic reason; do not omit it merely to reduce markup.
- Keep implementation details only when they affect a consumer's decision, such as
  whether scaling reserves layout space or stopping visualization stops the source.
- Do not refer to Storybook in document prose, tips, or snippets. Its only visible
  reference should be the canvas's **View on Storybook** button.
- Do not repeat preview instructions in Usage or repeat a prop's complete reference
  description in several sections. A short usage explanation and a precise prop
  description can coexist when each serves its own purpose.

For example, prefer:

> Pass an audio stream or track to `audioStream` and set `playing` to enable the animation.

Keep microphone setup in its own usage example and instructions for trying the
live preview in the tip below the canvas.

## Page structure

Use the existing shared components and this order:

1. `Path` breadcrumb.
2. `H1` with `<ComponentName> component` and **always** `id="title"`.
3. Short introduction in `P`, usually with `clipWidth`.
4. `ComponentCanvas` containing the preview and the published component's Storybook URL.
5. Optional `TipBox` immediately below the canvas, when the demo needs instructions.
6. `H2 id="usage"`: basic example followed by useful focused examples under `H3`.
7. `H2 id="behavior"`: simple behavior notes.
8. `H2 id="accessibility"`: relevant accessibility guidance and examples.
9. `H2 id="props"`: public props, excluding any documented in a dedicated section.
10. `H2 id="events"`: custom callbacks and native event support.

Follow the [component composition convention](../../../../../packages/slice/docs/component-composition.md)
when choosing notation and documentation ownership:

- Components with child controls that expose their own props, events, methods, or
  refs have focused documentation pages for each control. Give the parent and its
  children separate slugs, and group them in the sidebar with `childDocs`.
- Keep the parent page focused on composition, shared behavior, and its own API.
  Link to each child page rather than repeating its full reference. Child pages
  demonstrate their own usage inside the required parent when applicable.
- Preserve the actual public API: named controls such as `PopMenuGroup` and
  `PopMenuItem` remain named exports; structural sections that use dot notation
  keep that notation. A separate doc page does not imply standalone behavior.
- Independently useful controls also retain their own pages. Link related pages
  and explain which behavior comes from the containing component.

Verify current public exports before writing usage snippets; a convention does not
mean every component has already adopted it. For components
with both composition and an options/props alternative, show composition first and
place the concise alternative immediately afterward. Explain supported child types,
section cardinality, ordering, and mixed-API restrictions where relevant, without
repeating the full child reference on multiple pages.

Use the established document width and layout rather than redesigning each page.
Add sections when the content calls for them; keep the main structure consistent.
Do not add advanced examples solely to fill space.

For components with imperative handles, add an H2 `ref` section after Events.
Document what the ref points to, show a focused example, and use tracked
Definitions for its public methods. Explain related prop combinations (such as
controlled busy state versus timed progress) in Usage and Behavior; keep the full
prop reference alphabetical within each section. For components with animation props,
an optional H2 `Motion` section between Props and Events can collect `animate`,
`exit`, `initial`, `transition`, and `variants`, alongside a focused animation
example. Document each prop once, alphabetize within the group, and nest its tracked
Definitions under Motion. Keep callbacks in Events. For native attribute groups, use the actual root
element name, such as `...buttonAttributes`, and keep that group last. For a component
whose props choose the native root, use `...elementAttributes`, document both
root types, and keep event signatures tied to the active native element.

Follow the [Motion prop naming convention](../../../../../packages/slice/docs/style-prop-naming.md#motion-integration):
`motionValues` configures component-managed variants; `transition` controls timing
and easing. Do not add a `motion` alias. When a component intentionally exposes
Motion's native API, retain names such as `variants`, `initial`, and `animate`
instead of adding a second configuration API. Describe the supported integration
and document each prop only once.

## Preview and tips

Choose previews for the value of seeing or trying the result. Key visual variants,
layout changes, validation states, and meaningful interactions belong in a canvas
beside their Usage explanation. Minor adjustments, typed metadata, persistence,
and equivalent APIs can use a code snippet alone. Avoid a separate lead gallery
when Usage already demonstrates the component.

For the paired preview-and-code presentation used by ToggleButton and Button,
place each focused usage example in `ComponentCanvas` and pass its snippet as the
item's `code` (and optional `codeFilename`). The canvas owns the collapsible code
display; do not repeat the same snippet in a separate `CodeBlock`. A page may start
its previews under Usage rather than duplicating a lead preview above Usage.
For paged examples, give each item a distinct caption and code matching that
specific preview. Keep hooks and interactive wiring in the colocated preview file.
Every item in the first preview array must have a complete, independently copyable
example, including imports and an exported component. Later snippets can focus on
the relevant props without repeating the initial setup; retain any wiring needed
to explain stateful behavior.

- Pass `ComponentCanvas` an array through `components`, even for one preview:
  `components={[{ label: 'Example', component: <ExamplePreview /> }]}`. Each entry
  is one pager page, and its label becomes the caption when selected. Keep
  deliberately grouped examples together. The canvas has no separate `name` prop.
  The canvas handles directional slide/fade transitions with Water timing; do not
  add another page-transition wrapper inside individual previews. Reduced motion
  switches pages immediately.
- Each canvas page should demonstrate a discernible visual or behavioral difference.
  Show equivalent composition and options-array APIs in Usage rather than duplicating
  an indistinguishable preview. Put an options alternative immediately after the basic
  composed example, before controlled or advanced examples.
- Canvas preview and slide wrappers fill the available width inside the canvas padding.
  Give examples their intended width explicitly; percentage widths resolve against
  that full preview area. Exiting slides overlap the active slide during transitions
  and must not split the available width with it.
- Show the clean component. Do not add labels such as "Say something!", instructional
  text, status messages, or extra demo chrome inside the canvas.
- Keep necessary demo wiring in a colocated preview component. Hooks, streams, and
  state can power a preview without becoming part of the library component's API.
- Match the real behavior. AudioBubble's preview intentionally requests an unmuted
  microphone on mount through `useMicrophone(false)` and feeds it into the bubble.
  The library component itself does not request microphone access.
- Put interaction instructions in a separate `TipBox`, following the current
  `inline`, `noBorder`, `title="Tip:"` pattern when appropriate. Keep the tip short.
- Use `ComponentCanvas`'s `storybookUrl` for the external demo action. Verify the
  actual published story ID; do not derive it from the website slug or assume every
  component's story has the same name.
- Keep the existing top-right square button and its normal button styling. Its
  `onClick` opens the external page with `window.open`; do not add a separate link.

The clean-preview rule does not prohibit text in an accessibility code example
when that text demonstrates a necessary status or label in a consumer's application.

## Optional tips and instructions

Use `TipBox` when a short instruction or contextual tip helps someone try an
example. It is optional, not a required block on every component page.

Good uses include explaining how to activate a live preview, allowing microphone
access, trying a keyboard interaction, or calling out a helpful setup detail.
Place it next to the content it explains; preview instructions belong immediately
below the canvas, outside the clean component preview.

```
<TipBox inline noBorder title="Tip:">
    Allow microphone access and speak to see the bubble react.
</TipBox>
```

Keep tips brief, specific, and actionable. Use the existing `TipBox` component
rather than creating a new callout style. Do not repeat the tip in Usage or turn
it into a second API reference. Essential behavior and accessibility guidance
still belong in their respective sections; a tip can supplement that content.
Omit the box when the example is already clear without instructions.

For menus and their controllers, default usage snippets render normally without
portals. Keep portals needed by the documentation canvas in preview wiring only.
Explain a portal as a conditional option under Behavior, with a small example for
transformed or clipping ancestors and a target that preserves theme variables.

## Code snippets

Use Slice components in previews and copyable examples wherever an equivalent
exists: for example, `Button` for actions and submission, `TextField` for inputs,
and `FlexDiv` for layout. Keep native semantic containers such as `form`, `ul`,
and `li` where appropriate. For form spacing, use a column `FlexDiv` with an
explicit `gap` inside the form; do not rely on `gap` on a non-flex form.
Use native controls only when the example specifically teaches native behavior
that a Slice component cannot represent.

Keep copyable examples framework-neutral: omit `'use client'` directives. The actual
Next.js preview modules still declare their client boundary where required.

Store snippet strings in a colocated `code.ts` and render them with `CodeBlock`.
Use the first basic example to introduce the public package import. Later snippets
should generally show only the component and the props relevant to that example.

```
<Avatar name="Jane Smith" onClick={openProfile} />
```

- Omit repeated imports, export functions, unrelated defaults, and styling unless
  they explain the feature being demonstrated.
- Include new imports when introducing another API, such as `useMicrophone`.
- Use a function wrapper when hooks or state require it. Explain when the example
  belongs in a client component. Keep event handlers as real JSX expressions, with
  correctly cased names such as `onClick`.
- Names such as `openProfile`, `audioStream`, or `isListening` may represent the
  reader's application logic. Make that context clear in the surrounding copy;
  do not imply that they are library exports.
- Keep samples valid for the current public API. Check optional values before
  accessing their fields, and preserve relevant event types in generic examples.
- When editing existing MDX docs, also follow the repository's snippet conventions
  in the prop naming standard linked below. The website uses `CodeBlock` with its
  supported TSX language setting.

## Related-document links

Use inline `Code` links sparingly to connect related component, hook, and utility
docs. Link when the destination helps the reader understand or use the current
example—for example, linking `useMicrophone(false)` to the microphone hook docs.

```
<Code openURL="/docs/react/use-microphone/">useMicrophone(false)</Code>
```

- Prefer the first useful mention in the relevant explanation. Do not link every
  occurrence of a name or repeat the same link throughout the page.
- Keep ordinary prop names and code references unlinked unless there is a useful,
  separate document to visit. Avoid making a paragraph look like a list of links.
- Use the actual package-specific documentation route and a descriptive API name
  as the label. Check the sidebar/registry for the slug; do not invent a URL.
- Prefer completed documents. If an intentional link points to an unwritten doc,
  verify that it uses the correct route and reaches the in-layout missing-document
  view; do not imply that the linked reference is already available.
- Use `Code`'s `openURL` prop rather than adding custom click handlers or link styles
  in individual documents. It preserves the code text color and uses an underline
  to signal navigation, with hover and keyboard-focus feedback.
- Keep these links in explanatory content, outside copyable code snippets. Plain
  `Code` without `openURL` stays non-interactive.

## Props and events

For accessibility configuration, follow the [accessible-name convention](../../../../../packages/slice/docs/style-prop-naming.md#accessible-names-and-aria).
Use intent-based props such as `actionName` or `tabBarName`; explain the internally
managed ARIA behavior under Accessibility. Do not recommend passing raw `aria-*`
attributes to components that manage those semantics. Native panels or other
application-owned elements may still need ARIA attributes in usage examples.

Read the component's `_types.ts`, implementation, styles, and relevant utilities
before writing the reference. Stories demonstrate intended interactions; older
MDX pages may have stale defaults and should not be copied without checking.

For props:

- Document every public component prop using `Definition`, `Prop`, `TypeDef`, and
  `DefaultVal`, followed by a concise description.
- Keep prop explanations as running text, with code examples or a type shape when
  useful. Do not insert H3 headings or other subheadings within a prop reference.
  Introduce supporting types such as `AvatarInfo` in the paragraph itself.
- Sort prop definitions alphabetically, case-insensitively, with `...divAttributes`
  **always last**. Keep the tracked navigation in the same order.
- Use the exact public names and types. State units, precedence, accepted values,
  or restrictions where they affect usage. Distinguish configured defaults from
  effective theme fallbacks when needed.
- Explain shared color-token support once; do not repeat it under every color prop.
- Keep Behavior focused on useful interaction rules. Do not restate obvious outcomes
  or repeat the API reference. Keep distinct ideas (item content, callback metadata,
  tooltips) in their relevant references instead of combining them into one paragraph.
  Merge usage examples that teach the same concept, such as keeping and controlling
  a selection.
- Explain inherited attributes in the final `...divAttributes` entry, including
  where `style` and `className` apply and whether children are rendered.

For events:

- Use `Definition`, `Method`, and `TypeDef` for component callbacks, with accurate
  signatures and a short explanation of when they run.
- Describe callback payloads, dismissal values such as null, cancellation behavior,
  and pointer/keyboard differences when relevant.
- Document events that the component intentionally supports as public behavior.
  Summarize inherited DOM events in one group instead of listing them individually.
  Do not generate event entries from Motion or another wrapper’s inherited types.
  Incidental passthrough does not make a callback a component feature.
- Only document drag, pan, tap, layout, or animation-lifecycle callbacks when the
  component deliberately exposes and implements that behavior. Check its API,
  configuration, and tests; merely rendering motion.div or motion.button is not
  evidence of gesture support. Dot, for example, has no intentional drag API.
- For an intentionally supported wrapper callback, document its actual signature
  (such as Motion’s animation definition, rather than a native AnimationEvent).
  If there are no component-specific callbacks, say so and keep only the inherited
  DOM event group. Do not imply every wrapper callback is a native event.
- Do not copy Avatar's generic `info` argument into another component's reference
  unless that component actually supports it.

Follow the [public prop naming standard](../../../../../packages/slice/docs/style-prop-naming.md).
Documentation work must not invent a normalized prop or compatibility alias that
is absent from the implementation. If the existing API has an unusual name, document
it accurately and flag a potential API cleanup separately. Make breaking API changes
only as part of an authorized component change, updating its consumers and docs together.

Use the component's existing `name`, `label`, `title`, and ID-based fallbacks for
accessible naming wherever supported. Avoid redundant `aria-label` props in
examples. Explain the actual naming sources and fallback order in Accessibility;
keep explicit ARIA overrides for cases the normal naming props cannot express.

## Accessibility

Use a dedicated H2 section. Keep accessible naming, keyboard/focus guidance, decorative
content, and reduced-motion guidance together here. Avoid repeating those explanations
in Usage, Behavior, or individual prop descriptions; keep the API reference focused
on each prop’s value and effect. Describe actual semantics and behavior, including any
work the consuming application must do. Distinguish built-in support from recommendations.
For example, do not imply that a plain div gains keyboard activation because it has
an onClick handler. Confirm reduced-motion behavior in code before documenting it.

Keep guidance relevant to the component: labels and keyboard activation for actions,
text alternatives for visual status, and reduced motion for animation. Accessibility
examples may include the supporting text or controls they are teaching.

## Tracking and document registration

Only **H1, H2, and Definition** elements opt into visibility tracking. Give their
anchors stable, unique IDs. **H3 content must remain untracked**: do not add IDs or
tracked navigation entries for usage subsections. Paragraphs, inline code, tips,
and preview content do not belong in the tracked list either.

Export the document as the module's default and its navigation as `trackedItems`.
Named exports can stay:

```
export { AudioBubbleDoc as default, audioBubbleTrackedItems as trackedItems };
```

The tracked list must match the rendered anchor order and labels. Nest prop and
event definitions under their respective H2 entries; use `code: true` for API entries.
Keep the title label consistent with the H1, and keep `...divAttributes` last.

Register the explicit dynamic import by package and slug in
[documents.ts](../../docs/registry/documents.ts). Set the same slug in the sidebar
and add the page metadata/static slug entry in the relevant package registry.
For example, React's AudioBubble route is `/docs/react/audio-bubble/`. Documents
are package-specific; registering a React doc does not register a React Native doc.
The [website README](../../../README.md#documents) explains the routing workflow.

## Checks and guidance for AI contributors

Before considering a document complete:

- Verify its API coverage and defaults against the current implementation.
- Check that examples explain distinct use cases and that prose has no avoidable
  duplication, placeholder copy, or Storybook references outside the canvas action.
- Check prop ordering, unique IDs, and the exact correspondence between rendered
  anchors and tracked navigation. H3 content stays untracked.
- Verify the route, sidebar selection, page metadata, and external demo URL. Switch
  between documents to check that the content and table of contents both change.
- Confirm unknown slugs and unregistered package variants still show the docs shell
  with a missing-document message.
- Match validation to the change. Copy-only edits need formatting and anchor checks;
  new documents or changed examples also need typechecks, snippet checks, and browser
  inspection. Routing changes need a production build and route checks.
- Follow the repository’s [testing strategy](../../../../../packages/slice/CONTRIBUTING.md#testing-strategy)
  and [test-writing conventions](../../../../../packages/slice/docs/writing-tests.md)
  for component stories, test-only tags, accessibility checks, and nonvisual tests.
- Use a simulated media source when testing microphone demos. Do not equate a fake
  device test with a check of the user's actual microphone.

For AI edits, treat these conventions as constraints, not a request to add more
content or refactor unrelated code. Inspect current files before editing; preserve
user-authored changes. Do not add speculative features, claims, API behavior, or
instructions to make a template feel complete. When a user establishes a new
convention, update the relevant section of this guide and remove superseded advice.
Keep this guide as a living record of agreed intent rather than a transcript of edits.

## Hook documents

Use the same tone, layout, snippets, tracking, and registration rules for hooks.
Store hook pages under `react/hooks/<hookName>/` and use `<hookName> hook` for the
H1, with `id="title"`. Keep the public hook’s casing in titles and code.

Adapt the component structure to the hook’s API:

- Show a small live consumer in the canvas when the hook has observable output.
  Display returned state or a meaningful result; place instructions in a separate
  TipBox. A hook has no visual component of its own.
- Use Usage for a complete basic consumer and distinct focused examples. Hooks
  need a function wrapper; introduce imports once. State client-boundary requirements
  when browser APIs are involved.
- Use Behavior to explain what the hook observes or performs and what the consumer
  must implement. Distinguish similarly named return values and browser limitations.
- Add Lifecycle when initial snapshots, effect timing, listener
  cleanup, per-instance resources, or SSR affect correct use. Describe actual behavior;
  do not imply that an initial fallback is a confirmed browser state.
- Replace Props with Parameters and Events with Returns. Include the call signature,
  argument order, optionality, defaults, and return type. When there are no parameters,
  use just “None” under Parameters; omit a redundant signature example. Use tracked Definitions for named parameters/options and returned
  fields, alphabetized within each object; preserve positional argument and tuple order.
- For reactive return values, label starting values as the initial snapshot in prose;
  they are not configurable defaults. Document returned functions with their signatures,
  effects, and cleanup/cancellation requirements. Document callbacks under Parameters
  when passed as options, rather than inventing an Events section.
- Hooks without UI do not need an Accessibility section by default. Add one only
  when the hook directly manages accessibility behavior, such as keyboard interaction
  or focus management. A visual documentation preview alone does not require one.
  Omit empty sections and do not invent props, events, a ref, or a preview for a hook
  that needs none.

[useActiveTab](react/hooks/useActiveTab/useActiveTab.tsx) is the first hook reference.

For hooks with positional parameters, keep definitions and tracked entries in call
order, even when this differs from alphabetical order. Use inline `Code` in
Parameters to show argument order and optionality, for example
`useLastUpdated(timestamp, prefix?, interval?)`, rather than a separate signature
code block. A required argument that
accepts `undefined` is still required; explain that distinction. State timer units
and distinguish a configured value from an effective clamped value. Returned fields
need their actual initial behavior, not an invented fixed default. Use
[useLastUpdated](react/hooks/useLastUpdated/useLastUpdated.tsx) as this example.

## Batch documentation and review

For batches, choose five components and document the current public API. Record
normalization opportunities, bugs, accessibility gaps, and useful optimizations in
a separate review file, grouped by component with concrete source references.
Do not silently change implementation behavior or remove aliases during the writing
pass. Review and refine one component at a time; then update consumers, website docs,
MDX, and relevant regression tests together. Track confirmed findings separately
from proposed design decisions. See [batch 01](REVIEW-BATCH-01.md), [batch 02](REVIEW-BATCH-02.md), and
[batch 03](REVIEW-BATCH-03.md).

## Optical spacing around icons

When reviewing icon-bearing components, account for empty space inside the icon’s
SVG viewBox. Use Button and Chip as references: reduce the default outer padding
on the edge occupied by an icon, rather than changing the icon geometry or scale.
Chip subtracts spacing-xs for m–xl text, or spacing-xxs for xs/s. Its remove button
counts as a right-edge icon; an icon-only chip adjusts both outer edges.

Keep this compensation separate from gap, which controls spacing between content
items. Apply it only to inferred default padding: explicit padding or individual
side values are authoritative. Avoid measuring individual SVG paths at runtime.
Document the optical rule briefly in Behavior and the padding reference, including
which edges are affected and how to override it. Verify left/right placement,
removal, compact sizes, icon-only content, and explicit padding in layout checks.

## Reduced motion is the default

New and refined components should respect `prefers-reduced-motion: reduce` by
default. Disable nonessential CSS transitions/animations and Motion layout,
entrance, exit, and repeating animations. State changes and essential feedback must
still appear immediately; disabling animation must not hide the result or leave an
exit animation delaying removal. Custom animation settings must not bypass the
preference accidentally.

Use the shared internal
[usePrefersReducedMotion](../../../../../packages/slice/src/utils/styling/usePrefersReducedMotion.ts)
observer for JavaScript animation decisions, and a media query for CSS. Handle live
preference changes, clean up listeners, and preserve keyboard focus for interactive
controls. Dot and Chip provide examples of static rendering and disabled layout
animation respectively.

Document this briefly in Accessibility after implementing and verifying it. This
is the implementation standard, not permission to claim existing components already
comply. Check components as they are reviewed. Exceptions for essential or unusual
motion must be deliberate: explain why it remains, provide an appropriate reduced
alternative, and document that specific exception. Do not infer exceptions from
using Motion or from having a custom transition prop.

# Component documentation guide

This guide records the editorial and implementation conventions for the website's
component docs. Extend it as we agree on new patterns. Apply it to new documents
and edits to existing ones; preserve deliberate user changes.

Use [Avatar](react/components/Avatar/Avatar.tsx) as the structural reference and
[AudioBubble](react/components/AudioBubble/AudioBubble.tsx) as a reference for concise
copy, a live preview, and a separate preview tip. These are examples, not sources
of truth for another component's API.

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
- Keep the introduction to one or two short sentences. Describe a concrete benefit
  or use case rather than making broad claims about quality or performance.
- Prefer short paragraphs, usually one or two sentences. Each paragraph should add
  something new. Remove phrases that merely restate the heading, type, or default.
- Explain an action and its effect: "Lower peakIntensity for a stronger response to
  quiet sounds." Avoid vague phrases such as "unlock powerful customization."
- Name props in inline `Code` when discussing the API. Explain what changing a value
  does, with units or a small example when useful.
- Keep implementation details only when they affect a consumer's decision, such as
  whether scaling reserves layout space or stopping visualization stops the source.
- Do not refer to Storybook in document prose, tips, or snippets. Its only visible
  reference should be the canvas's **View on Storybook** button.
- Do not repeat preview instructions in Usage or repeat a prop's complete reference
  description in several sections. A short usage explanation and a precise prop
  description can coexist when each serves its own purpose.

For example, prefer:

> Pass an audio stream or track to audioStream and set playing to enable the animation.

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
element name, such as `...buttonAttributes`, and keep that group last.

## Preview and tips

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

## Code snippets

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
- Explain inherited attributes in the final `...divAttributes` entry, including
  where `style` and `className` apply and whether children are rendered.

For events:

- Use `Definition`, `Method`, and `TypeDef` for component callbacks, with accurate
  signatures and a short explanation of when they run.
- Describe callback payloads, dismissal values such as null, cancellation behavior,
  and pointer/keyboard differences when relevant.
- Summarize standard inherited React events instead of listing the entire DOM API.
  For wrapped primitives such as Motion components, verify any event names owned
  by the wrapper and document their actual callback signatures separately.
  If there are no custom callbacks, say so and describe the native event forwarding.
- Do not copy Avatar's generic `info` argument into another component's reference
  unless that component actually supports it.

Follow the [public prop naming standard](../../../../../packages/slice/docs/style-prop-naming.md).
Documentation work must not invent a normalized prop or compatibility alias that
is absent from the implementation. If the existing API has an unusual name, document
it accurately and flag a potential API cleanup separately. Make breaking API changes
only as part of an authorized component change, updating its consumers and docs together.

## Accessibility

Use a dedicated H2 section. Describe actual semantics and behavior, including any
work the consuming application must do. Distinguish built-in support from recommendations.
For example, do not imply that a plain div gains keyboard activation because it has
an onClick handler, or that reduced-motion preferences are handled automatically.

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
- Use a simulated media source when testing microphone demos. Do not equate a fake
  device test with a check of the user's actual microphone.

For AI edits, treat these conventions as constraints, not a request to add more
content or refactor unrelated code. Inspect current files before editing; preserve
user-authored changes. Do not add speculative features, claims, API behavior, or
instructions to make a template feel complete. When a user establishes a new
convention, update the relevant section of this guide and remove superseded advice.
Keep this guide as a living record of agreed intent rather than a transcript of edits.

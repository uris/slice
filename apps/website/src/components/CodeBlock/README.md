# CodeBlock

Import and render directly in any server or client component. Each block accepts
its own code string; no children plumbing is required through layouts.

```tsx
import { CodeBlock } from '@/components/CodeBlock';

<CodeBlock showFilename filename="example.ts" code={'const greeting: string = "Hello, Slice";'} />
<CodeBlock language="tsx" code={'<Avatar name="Alex Morgan" />'} />
```

`code` is required. `filename` and `className` are optional. `showFilename` defaults
to `false`; set it to `true` to display the filename header. The code area uses
`--core-surface-primary-tint`, with transparent backgrounds behind the colored text.
The language defaults
to `typescript`; use `tsx` for JSX. Plain code renders immediately; highlighting
loads in the browser using a shared highlighter with only TypeScript, TSX, and
the GitHub Dark theme. Whitespace is preserved and long lines scroll horizontally.

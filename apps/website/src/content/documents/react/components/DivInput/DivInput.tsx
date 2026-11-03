import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { DivInputPreview } from './DivInputPreview';
import { readonlyCode, usageCode } from './code';
export function DivInputDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">DivInput component</H1>
			<P clipWidth>
				{'Edit a short title or label in place, with an editable text surface that can blend into surrounding content.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-divinput--default"
				components={[
					{ label: 'Editable title', component: <DivInputPreview /> },
					{ label: 'Placeholder', component: <DivInputPreview variant="empty" /> },
					{ label: 'Read-only title', component: <DivInputPreview variant="readonly" /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Use <Code openURL="/docs/react/textfield/">TextField</Code> when native input and form behavior are needed.
			</P>
			<P>
				{'Provide a meaningful '}
				<Code>{'name'}</Code>
				{' and initial '}
				<Code>{'value'}</Code>
				{'. Use '}
				<Code>{'onSubmit'}</Code>
				{' to receive committed text.'}
			</P>
			<CodeBlock filename="DivInputExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Present read-only text</H3>
			<P>
				{'Set '}
				<Code>{'isEditable'}</Code>
				{' to '}
				<Code>{'false'}</Code>
				{' when the text should remain visible without editing.'}
			</P>
			<CodeBlock filename="DivInputExample2.tsx" language="tsx" code={readonlyCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'The editable surface manages its text locally. Changes to '}
				<Code>{'value'}</Code>
				{', '}
				<Code>{'placeholder'}</Code>
				{', '}
				<Code>{'focus'}</Code>
				{', or '}
				<Code>{'isEditable'}</Code>
				{' rewrite its content.'}
			</P>
			<P>
				{'Enter and blur both commit text. '}
				<Code>{'onChange(null)'}</Code>
				{' marks a commit; Enter can trigger a second submission through blur.'}
			</P>
			<P>
				{'Placeholder content is inserted into the editable text itself. Paste and edits pass through '}
				<Code>{'cleanString'}</Code>
				{', which removes markup and some whitespace; this is plain-text editing, not a rich-text editor.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'The editable surface has a textbox role and uses '}
				<Code>{'name'}</Code>
				{' for its accessible label. It is not a native form input and needs application-managed serialization.'}
			</P>
			<P>
				{
					'Read-only mode currently retains textbox semantics without a read-only ARIA state. Wrapping and multiline semantics also need refinement.'
				}
			</P>
			<P>{'Its background transition does not currently include reduced-motion handling.'}</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Editable hover and focused background. Read-only mode uses a transparent background.'}</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'radius (4)'}</DefaultVal>
			</Definition>
			<P>
				{'Outer wrapper radius. Takes priority over legacy '}
				<Code>{'radius'}</Code>
				{'; the inner editable surface still uses the small theme radius.'}
			</P>
			<Definition id={'clamp'}>
				<Prop>clamp</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'3'}</DefaultVal>
			</Definition>
			<P>{'Maximum displayed lines while unfocused. Focused editable content removes the line clamp.'}</P>
			<Definition id={'focus'}>
				<Prop>focus</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				<Code>{'true'}</Code>
				{' requests focus and selects existing text. '}
				<Code>{'false'}</Code>
				{' updates styling but does not explicitly blur the element.'}
			</P>
			<Definition id={'isEditable'}>
				<Prop>isEditable</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Controls '}
				<Code>{'contentEditable'}</Code>
				{'. '}
				<Code>{'false'}</Code>
				{' presents non-editable text; it does not remove the textbox role.'}
			</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Input Field'}</DefaultVal>
			</Definition>
			<P>{'Internally supplied accessible name for the editable textbox.'}</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'0px'}</DefaultVal>
			</Definition>
			<P>{'CSS padding on the outer wrapper.'}</P>
			<Definition id={'placeholder'}>
				<Prop>placeholder</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Placeholder'}</DefaultVal>
			</Definition>
			<P>{'Displayed as actual editable text when the value is empty; it is not a native placeholder.'}</P>
			<Definition id={'radius'}>
				<Prop>radius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>
				{'Legacy wrapper-radius fallback. '}
				<Code>{'borderRadius'}</Code>
				{' takes precedence.'}
			</P>
			<Definition id={'textAlign'}>
				<Prop>textAlign</Prop>
				<TypeDef>{"'left' | 'center' | 'right'"}</TypeDef>
				<DefaultVal>{'left'}</DefaultVal>
			</Definition>
			<P>{'Horizontal text alignment.'}</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'empty string'}</DefaultVal>
			</Definition>
			<P>{'Initial text and a source for later synchronization. Prop updates replace the editable DOM content.'}</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>{'Wrapper width in pixels or CSS units.'}</P>
			<Definition id={'wrap'}>
				<Prop>wrap</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				The <Code>false</Code> path emits invalid <Code>white-space: no-wrap</Code>, so disabling wrapping is currently
				unreliable. The <Code>true</Code> path uses the supported <Code>wrap</Code> value.
			</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native attributes and handlers apply to the outer wrapper, not the inner control. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged; component CSS variables take priority.'}
			</P>
			<H2 id="events">Events</H2>
			<Definition id={'onBlur'}>
				<Method>onBlur</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{'Reports cleaned text after the blur handler also calls '}
				<Code>{'onChange(null)'}</Code>
				{' and '}
				<Code>{'onSubmit'}</Code>
				{'.'}
			</P>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: string | null) => void'}</TypeDef>
			</Definition>
			<P>
				{'Reports edited text. '}
				<Code>{'null'}</Code>
				{' is a commit marker emitted on Enter and blur, not an empty text value.'}
			</P>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Runs when the editable surface is clicked. Internal handling prevents default and stops bubbling before calling it.'
				}
			</P>
			<Definition id={'onDblClick'}>
				<Method>onDblClick</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs on double-click. This is the current public spelling; the native '}
				<Code>{'onDoubleClick'}</Code>
				{' wrapper handler is separate.'}
			</P>
			<Definition id={'onFocus'}>
				<Method>onFocus</Method>
				<TypeDef>{'(event: React.FocusEvent<HTMLDivElement>) => void'}</TypeDef>
			</Definition>
			<P>{'Receives the focus event from the editable surface.'}</P>
			<Definition id={'onSubmit'}>
				<Method>onSubmit</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Runs on both Enter and blur. Enter then blurs, so a single Enter can currently invoke it twice. Keep side effects idempotent until this is refined.'
				}
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Other native handlers apply to the outer wrapper. No Motion gesture or animation lifecycle callbacks are part of
				the documented component API.
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DivInput component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'clamp', title: 'clamp', code: true },
			{ id: 'focus', title: 'focus', code: true },
			{ id: 'isEditable', title: 'isEditable', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'radius', title: 'radius', code: true },
			{ id: 'textAlign', title: 'textAlign', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'wrap', title: 'wrap', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onBlur', title: 'onBlur', code: true },
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onDblClick', title: 'onDblClick', code: true },
			{ id: 'onFocus', title: 'onFocus', code: true },
			{ id: 'onSubmit', title: 'onSubmit', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default DivInputDoc;

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { TextAreaPreview } from './TextAreaPreview';
import { submitCode, usageCode } from './code';
export function TextAreaDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">TextArea component</H1>
			<P clipWidth>
				{'Make room for notes, comments, and longer messages with multiline editing and optional submission.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textarea--default"
				components={[
					{ label: 'Notes', component: <TextAreaPreview /> },
					{ label: 'Initial content', component: <TextAreaPreview variant="content" /> },
					{ label: 'Disabled textarea', component: <TextAreaPreview variant="disabled" /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				For short, single-line answers, use <Code openURL="/docs/react/textfield/">TextField</Code>.
			</P>
			<P>
				{'Use a native label around the field to name it, and '}
				<Code>{'onChange'}</Code>
				{' to receive edits.'}
			</P>
			<CodeBlock filename="TextAreaExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Submit with Enter</H3>
			<P>
				{'Set '}
				<Code>{'returnSubmits'}</Code>
				{' to submit on Enter and '}
				<Code>{'submitClears'}</Code>
				{' to choose whether text stays afterward.'}
			</P>
			<CodeBlock filename="TextAreaExample2.tsx" language="tsx" code={submitCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'Text is managed locally and synchronized when '}
				<Code>{'value'}</Code>
				{' changes. Rows are measured on mount and when '}
				<Code>{'rows'}</Code>
				{' changes; user input remeasures the content height. Prop-driven text updates do not currently remeasure it.'}
			</P>
			<P>
				{'With '}
				<Code>{'returnSubmits'}</Code>
				{', Enter submits even when Shift is held. '}
				<Code>{'submitClears'}</Code>
				{' clears local text without calling '}
				<Code>{'onChange'}</Code>
				{' again.'}
			</P>
			<P>
				{
					'The optional send control currently submits on pointer-down. Keyboard activation and disabled-state handling need refinement before relying on it as the only submission path.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'A native textarea provides multiline editing. Wrap it in a native label; '}
				<Code>{'name'}</Code>
				{' is only the form field name, and wrapper attributes do not name the inner textarea.'}
			</P>
			<P>
				{
					'The optional send control does not yet provide a reliable keyboard submission path. Native textarea disabling does not disable that separate control.'
				}
			</P>
			<P>{'The wrapper’s color and layout transitions currently remain enabled with reduced-motion preferences.'}</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Background of the textarea wrapper.'}</P>
			<Definition id={'border'}>
				<Prop>border</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows the one-pixel outline.'}</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>{'Corner radius in pixels or CSS units.'}</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Disables the native textarea. The optional send control is not currently disabled with it.'}</P>
			<Definition id={'error'}>
				<Prop>error</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Uses the warning border when the textarea is not focused. Focus styling takes precedence.'}</P>
			<Definition id={'focused'}>
				<Prop>focused</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Changes focus or blur the textarea. Normal user focus remains possible.'}</P>
			<Definition id={'hasSend'}>
				<Prop>hasSend</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Shows the send control. Its current submission handling is attached to pointer-down on a wrapper.'}</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>
				{'Wrapper height. A non-auto height also limits its maximum height; textarea content is measured separately.'}
			</P>
			<Definition id={'maxLength'}>
				<Prop>maxLength</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Maximum length accepted by the native textarea.'}</P>
			<Definition id={'minWidth'}>
				<Prop>minWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Minimum-width configuration. Currently a CSS variable is generated but not applied; string values are also incorrectly suffixed with pixels.'
				}
			</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'text_area'}</DefaultVal>
			</Definition>
			<P>{'Native form field name. It does not currently provide an accessible label.'}</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-m)'}</DefaultVal>
			</Definition>
			<P>{'Wrapper padding. Numbers are pixels; strings accept CSS padding syntax.'}</P>
			<Definition id={'placeholder'}>
				<Prop>placeholder</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Enter text here...'}</DefaultVal>
			</Definition>
			<P>{'Hint while the textarea is empty; not a replacement for a label.'}</P>
			<Definition id={'resizable'}>
				<Prop>resizable</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Allows native vertical resizing; '}
				<Code>{'false'}</Code>
				{' removes the resize handle.'}
			</P>
			<Definition id={'returnSubmits'}>
				<Prop>returnSubmits</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Enter submits instead of inserting a newline. Shift+Enter is currently treated the same way.'}</P>
			<Definition id={'rows'}>
				<Prop>rows</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>{'Native row count used for the initial size. Input and row changes trigger a content-height measurement.'}</P>
			<Definition id={'sendOffset'}>
				<Prop>sendOffset</Prop>
				<TypeDef>{'{ bottom: number; right: number }'}</TypeDef>
				<DefaultVal>{'{ bottom: 10, right: 10 }'}</DefaultVal>
			</Definition>
			<P>{'Send-control offsets from the wrapper edges, in pixels.'}</P>
			<Definition id={'sendSize'}>
				<Prop>sendSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'36'}</DefaultVal>
			</Definition>
			<P>{'Currently sets a CSS variable that is not consumed, so it does not size the send button.'}</P>
			<Definition id={'submitClears'}>
				<Prop>submitClears</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Clears local text after submission. This does not emit a clearing '}
				<Code>{'onChange'}</Code>
				{' callback.'}
			</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				{'Text size. The current mapping renders '}
				<Code>{'xl'}</Code>
				{' using the small style; the other sizes map normally.'}
			</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'empty string'}</DefaultVal>
			</Definition>
			<P>{'Initial text and a source for later prop synchronization. Edits still update local text.'}</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>{'Wrapper width in pixels or CSS units.'}</P>
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
			<P>{'Reports the textarea’s current value when focus leaves a descendant of the wrapper.'}</P>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>{'Reports user edits. Submission clearing and prop synchronization do not emit it.'}</P>
			<Definition id={'onFocus'}>
				<Method>onFocus</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>{'Reports the current value when the wrapper receives a bubbled focus event.'}</P>
			<Definition id={'onKeyDown'}>
				<Method>onKeyDown</Method>
				<TypeDef>{'(event: React.KeyboardEvent<HTMLTextAreaElement>) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Runs after built-in Enter handling, so preventing default here does not cancel a submission already performed.'
				}
			</P>
			<Definition id={'onSubmit'}>
				<Method>onSubmit</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{'Reports submitted text through Enter when '}
				<Code>{'returnSubmits'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{', or through the send control. The field refocuses and may clear locally.'}
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
	{ id: 'title', title: 'TextArea component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'border', title: 'border', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'error', title: 'error', code: true },
			{ id: 'focused', title: 'focused', code: true },
			{ id: 'hasSend', title: 'hasSend', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'maxLength', title: 'maxLength', code: true },
			{ id: 'minWidth', title: 'minWidth', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'resizable', title: 'resizable', code: true },
			{ id: 'returnSubmits', title: 'returnSubmits', code: true },
			{ id: 'rows', title: 'rows', code: true },
			{ id: 'sendOffset', title: 'sendOffset', code: true },
			{ id: 'sendSize', title: 'sendSize', code: true },
			{ id: 'submitClears', title: 'submitClears', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onBlur', title: 'onBlur', code: true },
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onFocus', title: 'onFocus', code: true },
			{ id: 'onKeyDown', title: 'onKeyDown', code: true },
			{ id: 'onSubmit', title: 'onSubmit', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default TextAreaDoc;

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ErrorSummaryPreview } from './ErrorSummaryPreview';
import { dynamicCode, usageCode } from './code';
export function ErrorSummaryDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ErrorSummary component</H1>
			<P clipWidth>
				{'Bring validation messages together so people can see what needs attention before they continue.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-errorsummary--default"
				components={[
					{ label: 'One error', component: <ErrorSummaryPreview /> },
					{ label: 'Multiple errors', component: <ErrorSummaryPreview variant="multiple" /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Pair the summary with fields such as <Code openURL="/docs/react/textfield/">TextField</Code> and keep their
				validation state in your application.
			</P>
			<P>
				{'Pass '}
				<Code>{'entries'}</Code>
				{' with a short title and optional supporting messages.'}
			</P>
			<CodeBlock filename="ErrorSummaryExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Update validation messages</H3>
			<P>
				{'Pass the current validation result as '}
				<Code>{'entries'}</Code>
				{'. An empty array hides the panel.'}
			</P>
			<CodeBlock filename="ErrorSummaryExample2.tsx" language="tsx" code={dynamicCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'The panel is present only when '}
				<Code>{'entries'}</Code>
				{' contains at least one item. Strings and arrays in '}
				<Code>{'message'}</Code>
				{' both become bullet lists.'}
			</P>
			<P>
				{'With '}
				<Code>{'autoNumber'}</Code>
				{', multiple entries receive numbered titles. A single entry keeps its title without a number.'}
			</P>
			<P>
				{'Showing and hiding uses a fixed opacity and maximum-height animation. Content taller than '}
				<Code>{'500px'}</Code>
				{' can currently be clipped.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'Titles and message lists provide visible structure, but the component does not currently add alert or live-region semantics, move focus, or link errors back to fields.'
				}
			</P>
			<P>
				{
					'If updates need announcing, use an application-owned live region around the summary. Keep it mounted while entries change.'
				}
			</P>
			<P>{'The show/hide animation currently has no component-specific reduced-motion handling.'}</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'autoNumber'}>
				<Prop>autoNumber</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Prefixes entry titles with numbers when there is more than one entry. A single entry is never numbered.'}</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning at 10% opacity'}</DefaultVal>
			</Definition>
			<P>{'Background of the summary panel.'}</P>
			<Definition id={'entries'}>
				<Prop>entries</Prop>
				<TypeDef>{'ErrorMessage[]'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Errors shaped as '}
				<Code>{'{ title: string; message?: string | string[] }'}</Code>
				{'. Each optional message is rendered as a list item. Missing or empty entries hide the panel.'}
			</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>{'Color of titles, messages, and the panel border.'}</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Typography size for entry titles and messages.'}</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native attributes apply to the visible panel. The wrapper renders only while entries are present. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged; component CSS variables take priority.'}
			</P>
			<H2 id="events">Events</H2>
			<P>No component-specific callbacks.</P>
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
	{ id: 'title', title: 'ErrorSummary component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'autoNumber', title: 'autoNumber', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'entries', title: 'entries', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
];
export default ErrorSummaryDoc;

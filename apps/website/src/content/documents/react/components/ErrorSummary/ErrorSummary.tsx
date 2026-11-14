import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { ErrorSummaryFieldsExample, ErrorSummaryLiveExample, ErrorSummaryUsageExample } from './UsagePreviews';
import { announcementCode, entryCode, fieldsCode, focusCode, liveCode, motionCode, usageCode } from './code';

export function ErrorSummaryDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ErrorSummary component</H1>
			<P clipWidth>
				Bring validation messages together so people can see what needs attention and get back to the right field.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place the summary above the fields, typically at the top of a large form. It collects errors across fields; each
				field can retain its own error message.
			</P>
			<P>
				{'Pass your current validation errors through '}
				<Code>{'entries'}</Code>
				{'. Each entry has a title and optional supporting messages.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-errorsummary--default"
				components={[
					{
						label: 'Basic usage',
						component: <ErrorSummaryUsageExample />,
						code: { code: usageCode.trim(), filename: 'ErrorSummaryExample.tsx' },
					},
				]}
			/>
			<H3>Connect errors to fields</H3>
			<P>
				{'Set '}
				<Code>{'fieldName'}</Code>
				{' to the native '}
				<Code>{'name'}</Code>
				{' used by a field such as '}
				<Code>{'TextField'}</Code>
				{', '}
				<Code>{'TextArea'}</Code>
				{', or '}
				<Code>{'DropDown'}</Code>
				{'. Activating the title focuses that control and scrolls its parent into view.'}
			</P>
			<P>
				Pass your application’s <Code>validateEmail</Code> function to this form. It returns an{' '}
				<Code>ErrorMessage</Code> with <Code>fieldName: 'email'</Code>, or <Code>undefined</Code> when valid.
			</P>
			<TipBox inline noBorder>
				Submit an empty or invalid email address to show an error, then select its title to focus the field. Enter a
				valid address to clear it.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-errorsummary--default"
				components={[
					{
						label: 'Connect errors to fields',
						component: <ErrorSummaryFieldsExample />,
						code: { code: fieldsCode.trim(), filename: 'ContactForm.tsx' },
					},
				]}
			/>
			<H3>Show errors as you type</H3>
			<P>This example treats every entered value as invalid. Your app supplies its own validation rules.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-errorsummary--default"
				components={[
					{ label: 'Live validation', component: <ErrorSummaryLiveExample />, code: { code: liveCode.trim() } },
				]}
			/>
			<H3>Choose announcement urgency</H3>
			<P>
				{'Use '}
				<Code>{'announcement="assertive"'}</Code>
				{' for errors that need immediate attention, or '}
				<Code>{'announcement="off"'}</Code>
				{' when your app already announces them.'}
			</P>
			<CodeBlock filename="AnnounceErrors.tsx" language="tsx" code={announcementCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{
					'Entries appear as unnumbered groups. Supporting messages become bullet lists, with blank messages omitted. The panel expands to its content without a fixed height limit.'
				}
			</P>
			<P>
				{
					'Field navigation searches the surrounding form first, or the current document when there is no form. It uses the first visible, enabled control with the matching '
				}
				<Code>{'name'}</Code>
				{'. Missing, hidden, or disabled targets are skipped.'}
			</P>
			<P>
				{'Validation and when to show errors remain application-controlled. Clear '}
				<Code>{'entries'}</Code>
				{' to hide the panel.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'The mounted summary announces updates politely by default without moving focus. Keep it mounted while updating '
				}
				<Code>{'entries'}</Code>
				{'; its live region stays in place when the panel is empty. '}
				<Code>{'summaryName'}</Code>
				{' supplies its accessible name.'}
			</P>
			<P>
				{'Field titles with '}
				<Code>{'fieldName'}</Code>
				{' are native buttons, so Enter and Space activate them. A forwarded '}
				<Code>{'ref'}</Code>
				{
					' lets your app focus the summary when needed. Reduced-motion preferences disable panel movement and fading, and use immediate scrolling for field navigation, including when the preference changes during an animation.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>All props are optional. Colors accept Slice theme tokens or CSS colors.</P>
			<Definition id="announcement">
				<Prop>announcement</Prop>
				<TypeDef>{"'polite' | 'assertive' | 'off'"}</TypeDef>
				<DefaultVal>{'polite'}</DefaultVal>
			</Definition>
			<P>
				{'Controls announcements of updated errors. '}
				<Code>{'polite'}</Code>
				{' waits for a pause, '}
				<Code>{'assertive'}</Code>
				{' requests immediate attention, and '}
				<Code>{'off'}</Code>
				{' disables announcements.'}
			</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning at 10% opacity'}</DefaultVal>
			</Definition>
			<P>{'Panel background.'}</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>
				{'Panel border color, independent of '}
				<Code>{'textColor'}</Code>
				{'.'}
			</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-xs (4px)'}</DefaultVal>
			</Definition>
			<P>{'Panel corner radius in pixels or CSS units.'}</P>
			<Definition id="borderWidth">
				<Prop>borderWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>{'Border width in pixels or CSS units. Zero removes the border.'}</P>
			<Definition id="entries">
				<Prop>entries</Prop>
				<TypeDef>{'ErrorMessage[]'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Current validation errors. An empty or omitted array hides the visible panel while retaining its announcement region.'
				}
			</P>
			<CodeBlock filename="ErrorMessage.ts" language="typescript" code={entryCode.trim()} />
			<P>
				{'Use '}
				<Code>{'id'}</Code>
				{' for stable identity when entries change or reorder. Without it, identity is derived from '}
				<Code>{'fieldName'}</Code>
				{' or '}
				<Code>{'title'}</Code>
				{'. Duplicate titles and messages are supported.'}
			</P>
			<P>
				{''}
				<Code>{'title'}</Code>
				{' is the error group\u2019s label. '}
				<Code>{'message'}</Code>
				{' accepts one string or multiple strings. Optional '}
				<Code>{'fieldName'}</Code>
				{' connects the title to a control\u2019s native '}
				<Code>{'name'}</Code>
				{'; it is separate from an accessible name such as '}
				<Code>{'inputName'}</Code>
				{'.'}
			</P>
			<Definition id="gap">
				<Prop>gap</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'spacing-xs (4px)'}</DefaultVal>
			</Definition>
			<P>{'Space between error groups, in pixels or CSS units.'}</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'spacing-m (16px)'}</DefaultVal>
			</Definition>
			<P>{'Panel padding. Numeric values become pixels; CSS shorthands and zero are applied exactly.'}</P>
			<Definition id="summaryName">
				<Prop>summaryName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Errors to review'}</DefaultVal>
			</Definition>
			<P>{'Accessible name for the summary. Blank names use the fallback.'}</P>
			<Definition id="textColor">
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>{'Color of titles, messages, and field actions.'}</P>
			<Definition id="textSize">
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Slice body text size for titles and messages.'}</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native attributes and events apply to the persistent outer wrapper. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{
					' is merged; component CSS variables take priority. Content, roles, and raw ARIA attributes are managed internally.'
				}
			</P>
			<H2 id="motion">Motion</H2>
			<P>
				Appearance and removal use an internal <Code>AnimatePresence</Code> and Motion element. The summary fades in
				while its height expands from <Code>0</Code> to <Code>auto</Code>, and reverses on removal.
			</P>
			<CodeBlock filename="SummaryMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id="motionValues">
				<Prop>motionValues</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>Fade and height expansion</DefaultVal>
			</Definition>
			<P>
				Motion variants merged into the internal <Code>initial</Code>, <Code>animate</Code>, and <Code>exit</Code>{' '}
				states. Defaults use <Code>{'height: 0'}</Code> and <Code>{'opacity: 0'}</Code> for entry/exit, with{' '}
				<Code>{'height: "auto"'}</Code> and <Code>{'opacity: 1'}</Code> when visible. Partial object overrides retain
				the other default values.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Water'}</DefaultVal>
			</Definition>
			<P>
				Motion <Code>transition</Code> settings are merged with Slice’s <Code openURL="/docs/react/motion/">Water</Code>{' '}
				transition. Reduced-motion preferences override animation settings.
			</P>
			<H2 id="events">Events</H2>
			<P>No component-specific callbacks.</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Native events apply to the outer wrapper. Field actions bubble normally. Motion gesture and animation lifecycle callbacks are not part of the public component API.'
				}
			</P>
			<H2 id="ref">Ref</H2>
			<Definition id="summaryRef">
				<Prop>ref</Prop>
				<TypeDef>{'React.Ref<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{'Points to the persistent outer wrapper. With visible errors it can receive programmatic focus. Call '}
				<Code>{'focus()'}</Code>
				{' after the errors have rendered, such as from a review action.'}
			</P>
			<CodeBlock filename="FocusErrors.tsx" language="tsx" code={focusCode.trim()} />
		</FlexBox>
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
			{ id: 'announcement', title: 'announcement', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'entries', title: 'entries', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'summaryName', title: 'summaryName', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'motionValues', title: 'motionValues', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
	{ id: 'ref', title: 'Ref', items: [{ id: 'summaryRef', title: 'ref', code: true }] },
];
export default ErrorSummaryDoc;

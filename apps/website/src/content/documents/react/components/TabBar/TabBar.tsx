import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { TabBarPreview } from './TabBarPreview';
import { controlledCode, motionCode, optionsCode, usageCode } from './code';
export function TabBarDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">TabBar component</H1>
			<P clipWidth>
				Keep related views within reach. Compose a row of tabs with optional icons, counts, and an indicator that
				follows the selected view.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tabbar--default"
				components={[
					{ label: 'Standard tabs', component: <TabBarPreview /> },
					{ label: 'Icons and counts', component: <TabBarPreview variant="extras" /> },
					{ label: 'Equal-width tabs', component: <TabBarPreview variant="fill" /> },
					{ label: 'Disabled', component: <TabBarPreview variant="disabled" /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code openURL="/docs/react/tab/">Tab</Code> choices inside TabBar. Each value identifies a view;
				defaultValue sets the initial selection.
			</P>
			<CodeBlock filename="TabBarExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Use options</H3>
			<P>Pass options to create the same tabs from data.</P>
			<CodeBlock filename="TabBarOptions.tsx" language="tsx" code={optionsCode.trim()} />
			<H3>Control selection</H3>
			<P>Use value and onChange to keep the active view in application state.</P>
			<CodeBlock filename="TabBarSelection.tsx" language="tsx" code={controlledCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				Selection follows a value rather than a position, so reordering tabs preserves the selected view. Values must be
				unique and non-null. Use stable primitive values for most bars.
			</P>
			<P>
				The first enabled tab is selected initially when defaultValue is omitted. An explicit null starts with no
				selection. Controlled values stay under application control; unmatched or removed values leave no selected tab.
			</P>
			<P>
				Children take priority over options. The bar renders navigation; your application displays the selected view.
				hasClose adds one action for closing the whole bar.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Use <Code>tabBarName</Code> to describe the group. The component supplies its ARIA label, with <Code>Tabs</Code>{' '}
				as the fallback. Tabs expose their selected state; icons and the underline are decorative. The close action is
				separate from the tablist.
			</P>
			<P>
				Tab enters the enabled selected tab, or the first enabled choice when no selection matches. Left and Right
				arrows move and activate tabs, wrapping at each end; Home and End select the first and last enabled choices.
				Disabled tabs are skipped.
			</P>
			<P>
				Set <Code>id</Code> and <Code>panelId</Code> on each <Code>Tab</Code> to connect it to a panel. Give each panel{' '}
				<Code>role="tabpanel"</Code> and <Code>aria-labelledby</Code>
				pointing back to its tab. Reduced-motion preferences disable indicator movement and color transitions, including
				when the preference changes during an animation.
			</P>
			<H2 id="props">Props</H2>
			<P>
				All group props are optional. Tab choices each require a value. Color props accept Slice theme tokens or CSS
				colors.
			</P>
			<Definition id={'border'}>
				<Prop>border</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows the baseline beneath the tabs.'}</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-secondary'}</DefaultVal>
			</Definition>
			<P>{'Baseline color. Accepts Slice color tokens or CSS colors.'}</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Composed Tab choices. Takes priority over options, including when explicitly set to null.'}</P>
			<Definition id={'closeWidth'}>
				<Prop>closeWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>{'Width of the separate close area. Numbers are pixels; strings accept CSS dimensions.'}</P>
			<Definition id={'defaultValue'}>
				<Prop>defaultValue</Prop>
				<TypeDef>{'T | null'}</TypeDef>
				<DefaultVal>{'first enabled value'}</DefaultVal>
			</Definition>
			<P>{'Initial selection for an uncontrolled bar. Use null to start with no selection.'}</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Disables all tabs and the close action.'}</P>
			<Definition id={'hasClose'}>
				<Prop>hasClose</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Shows one close action for the entire bar. Handle it with onClose.'}</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>{'Height of the bar. Numbers are pixels; strings accept CSS dimensions.'}</P>
			<Definition id={'iconFill'}>
				<Prop>iconFill</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Uses the filled treatment for tab icons and the close icon.'}</P>
			<Definition id={'iconGap'}>
				<Prop>iconGap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Gap in pixels between the icon, label, and count.'}</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>{'Size of tab icons in pixels.'}</P>
			<Definition id={'justify'}>
				<Prop>justify</Prop>
				<TypeDef>{"'start' | 'center' | 'end'"}</TypeDef>
				<DefaultVal>{'start'}</DefaultVal>
			</Definition>
			<P>{'Aligns compact or fixed-width tabs within the bar. Filled tabs occupy the available width.'}</P>
			<Definition id={'options'}>
				<Prop>options</Prop>
				<TypeDef>{'TabOption<T>[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>
				{
					'Creates tabs from data. Each entry supplies Tab content and state, including a unique non-null value. Use composed Tab children for native button attributes and handlers.'
				}
			</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-s)'}</DefaultVal>
			</Definition>
			<P>
				{
					'Padding inside each tab and the close area. Numbers are pixels; strings accept CSS padding syntax. Explicit zero is preserved.'
				}
			</P>
			<Definition id={'tabBarName'}>
				<Prop>tabBarName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Tabs'}</DefaultVal>
			</Definition>
			<P>Accessible name for the tab group. Blank names use Tabs. ARIA attributes are managed internally.</P>
			<Definition id={'tabGap'}>
				<Prop>tabGap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Gap between tabs in pixels.'}</P>
			<Definition id={'tabWidth'}>
				<Prop>tabWidth</Prop>
				<TypeDef>{"'compact' | 'fill' | number"}</TypeDef>
				<DefaultVal>{'compact'}</DefaultVal>
			</Definition>
			<P>
				{
					'Use compact for natural content widths that shrink when space is limited, fill for equal shares of the available space, or a number for a fixed pixel width.'
				}
			</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Text size for tab labels.'}</P>
			<Definition id={'underline'}>
				<Prop>underline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows the moving selection indicator. It slides and resizes to the selected enabled tab.'}</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'T | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Controlled selection. Use null to clear it. An unmatched value selects no tab.'}</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>{'Width of the complete bar, including its close area. Numbers are pixels; strings accept CSS dimensions.'}</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Native attributes and events apply to the tablist. className and style apply to the outer layout wrapper. The tablist role, name, ARIA attributes, and horizontal orientation are managed by the component.'
				}
			</P>
			<H2 id="motion">Motion</H2>
			<P>
				<Code>transition</Code> is merged with Slice’s <Code openURL="/docs/react/motion/">Water</Code> transition. The
				shared underline slides and resizes to its new tab, and stays aligned when tab widths or the container change.
			</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Slice’s water transition'}</DefaultVal>
			</Definition>
			<P>{'Motion timing for the underline. Set duration to 0 to snap to the selected tab.'}</P>
			<CodeBlock filename="TabBarTransition.tsx" language="tsx" code={motionCode.trim()} />
			<H2 id="events">Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: T, option: TabOption<T>) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Requests a different selection after pointer or keyboard activation. Receives the selected value and tab metadata. Repeat activation, initialization, and prop changes do not emit a change.'
				}
			</P>
			<Definition id={'onClose'}>
				<Method>onClose</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>{'Runs when the close action is activated. Your application decides what to close.'}</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Provides tooltip data on tab hover and null on pointer leave or selection. Your application displays the tooltip.'
				}
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Native group handlers apply to the tablist. Individual Tab children accept button handlers; there are no incidental drag or animation lifecycle callbacks.'
				}
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'TabBar component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'border', title: 'border', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'closeWidth', title: 'closeWidth', code: true },
			{ id: 'defaultValue', title: 'defaultValue', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'hasClose', title: 'hasClose', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'iconFill', title: 'iconFill', code: true },
			{ id: 'iconGap', title: 'iconGap', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'justify', title: 'justify', code: true },
			{ id: 'options', title: 'options', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'tabBarName', title: 'tabBarName', code: true },
			{ id: 'tabGap', title: 'tabGap', code: true },
			{ id: 'tabWidth', title: 'tabWidth', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'underline', title: 'underline', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'motion', title: 'Motion', items: [{ id: 'transition', title: 'transition', code: true }] },
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onClose', title: 'onClose', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default TabBarDoc;

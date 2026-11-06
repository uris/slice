import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ButtonBarPreview } from './ButtonBarPreview';
import { controlledCode, example2Code, overlapCode, usageCode } from './code';

export function ButtonBarDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>ButtonBar component</H1>
			<P clipWidth>Keep related icon actions together in a compact bar, with optional selection.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-buttonbar--default"
				components={[{ label: 'ButtonBar', component: <ButtonBarPreview /> }]}
			/>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Pass a <Code>buttons</Code> array and handle <Code>onClick</Code> for independent actions. Enable{' '}
				<Code>toggle</Code> for selection.
			</P>
			<CodeBlock filename="ButtonBarExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Adjust the frame</H3>
			<P>
				<Code>buttonSize</Code> accepts a preset or a custom pixel diameter. <Code>borderWidth</Code> applies to the
				outer bar.
			</P>
			<CodeBlock filename="ButtonBarExample2.tsx" language="tsx" code={example2Code.trim()} />
			<H3>Control selection</H3>
			<P>
				Enable <Code>toggle</Code>, pass <Code>selectedIndex</Code>, and update it in <Code>onChange</Code>. Indices
				start at 0; use null for no selection.
			</P>
			<CodeBlock filename="ControlledButtonBar.tsx" language="tsx" code={controlledCode.trim()} />
			<H3>Adjust highlights and spacing</H3>
			<P>
				Use <Code>selectionRadius</Code> to shape hover and selection highlights. <Code>buttonGap</Code> is in pixels;
				negative values overlap buttons and their hit areas. Use <Code>padding</Code> to inset the buttons from the
				wrapper edge.
			</P>
			<CodeBlock filename="ButtonBarSpacing.tsx" language="tsx" code={overlapCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Buttons run independent actions by default. Enable <Code>toggle</Code> to keep one selected. Without{' '}
				<Code>selectedIndex</Code>, the bar manages selection, starting from <Code>defaultSelectedIndex</Code>.
			</P>
			<P>
				<Code>onClick</Code> runs on every activation. In selection mode, <Code>onChange</Code> runs when a different
				button is chosen.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The bar is a group of native <Code>buttons</Code>, named “Actions” by default. Override <Code>aria-label</Code>{' '}
				to name the group. Each button uses its <Code>tip</Code> as its accessible name; icons are decorative and do not
				add tab stops.
			</P>
			<P>
				Enter and Space activate a focused button. Toggle <Code>buttons</Code> expose <Code>aria-pressed</Code> and a
				visible focus ring. Tab moves through the <Code>buttons</Code>; this is a button group rather than a tab list or
				radio group. Tooltips can open on keyboard focus as well as hover.
			</P>
			<P>
				Hover and selection color transitions are automatically disabled when the user enables reduced motion in their
				system settings.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>
				All props are optional. Color props accept Slice theme tokens or CSS colors. Hover and selection colors use
				Water transitions.
			</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>
				Background of the bar. Unselected <Code>buttons</Code> are transparent.
			</P>
			<Definition id={'backgroundColorHover'}>
				<Prop>backgroundColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>
				Circular highlight on hover. A selected button keeps <Code>backgroundColorSelected</Code>.
			</P>
			<Definition id={'backgroundColorSelected'}>
				<Prop>backgroundColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>Circular highlight for the selected button.</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>Outer border color. Buttons have no internal separators.</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-round'}</DefaultVal>
			</Definition>
			<P>
				Outer bar corner radius. Numbers are pixels; strings are CSS values. Icon <Code>buttons</Code> remain circular.
			</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Outer border width in pixels.</P>
			<Definition id={'buttonGap'}>
				<Prop>buttonGap</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>-2</DefaultVal>
			</Definition>
			<P>
				Spacing between buttons in pixels. Zero makes them touch; negative values overlap them. Selected, hovered, and
				keyboard-focused buttons are raised above idle neighbors.
			</P>
			<Definition id={'buttons'}>
				<Prop>buttons</Prop>
				<TypeDef>{'BarButton[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>
				Array of <Code>BarButton</Code> records. Each record has an optional <Code>icon</Code>, required{' '}
				<Code>tip</Code>, and optional <Code>action</Code>.
			</P>
			<P>
				<Code>tip</Code> names the button and provides its tooltip text. Use <Code>action</Code> as an identifier in
				your click handler.
			</P>

			<Definition id={'buttonSize'}>
				<Prop>buttonSize</Prop>
				<TypeDef>{"'s' | 'm' | 'l' | 'xl' | number"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				Shared overall height presets: s=24px, m=36px, l=44px, and xl=56px. Inner circles compensate for default wrapper
				padding and borders. A positive finite number sets the inner circle diameter instead. Invalid runtime values use
				m.
			</P>
			<Definition id={'defaultSelectedIndex'}>
				<Prop>defaultSelectedIndex</Prop>
				<TypeDef>{'number | null'}</TypeDef>
				<DefaultVal>{'null'}</DefaultVal>
			</Definition>
			<P>
				Starting index when the bar manages selection. Read once and ignored if <Code>selectedIndex</Code> is set. Use
				null to start without selection.
			</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>Icon dimensions in pixels.</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>4</DefaultVal>
			</Definition>
			<P>
				Uniform space between the buttons and all four wrapper edges, in pixels. Defaults to the spacing-xs token.
				Explicit values change the overall height and are applied exactly. Use 0 for no inset. Independent of buttonGap,
				which controls space between buttons.
			</P>
			<Definition id={'selectedIndex'}>
				<Prop>selectedIndex</Prop>
				<TypeDef>{'number | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Index of the selected button, starting at 0. Set null to clear it. When supplied, update this value in{' '}
				<Code>onChange</Code>; otherwise, the bar manages selection.
			</P>
			<Definition id={'selectionRadius'}>
				<Prop>selectionRadius</Prop>
				<TypeDef>number | string</TypeDef>
				<DefaultVal>'50%'</DefaultVal>
			</Definition>
			<P>
				Corner radius of the individual highlight and inset focus indicator. Applies to both hover and selection.
				Numbers are pixels; strings accept CSS values. Use '50%' for a circle, 8 for rounded corners, or 0 for square
				corners. The bar’s outer radius is controlled by borderRadius.
			</P>
			<Definition id={'toggle'}>
				<Prop>toggle</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Enables single selection with <Code>aria-pressed</Code>. false makes <Code>buttons</Code> independent actions
				and suppresses <Code>onChange</Code>.
			</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other attributes apply to the group root. className is appended; style is merged after component variables.
				Override <Code>aria-label</Code> to name the group. Children are not rendered; items come from{' '}
				<Code>buttons</Code>.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(button: BarButton) => void'}</TypeDef>
			</Definition>
			<P>
				Runs when a different button is chosen with <Code>toggle</Code> enabled. Receives its record. Updating props
				does not call it.
			</P>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'(button: BarButton) => void'}</TypeDef>
			</Definition>
			<P>
				Runs on every pointer or keyboard activation, before <Code>onChange</Code>.
			</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				Provides tooltip text and the button ref on hover or focus. A mouse event is included only for hover. null
				dismisses the tooltip. Your application renders it.
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Standard group-root events pass through. <Code>onClick</Code> and <Code>onChange</Code> above are component
				callbacks with item payloads, not native div events.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'ButtonBar component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorHover', title: 'backgroundColorHover', code: true },
			{ id: 'backgroundColorSelected', title: 'backgroundColorSelected', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'buttonGap', title: 'buttonGap', code: true },
			{ id: 'buttons', title: 'buttons', code: true },
			{ id: 'buttonSize', title: 'buttonSize', code: true },
			{ id: 'defaultSelectedIndex', title: 'defaultSelectedIndex', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'selectedIndex', title: 'selectedIndex', code: true },
			{ id: 'selectionRadius', title: 'selectionRadius', code: true },
			{ id: 'toggle', title: 'toggle', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];

export default ButtonBarDoc;

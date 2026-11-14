import { CodeBlock } from '@/components/CodeBlock/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	ButtonBarUsageExample,
	ButtonBarVerticalExample,
	GroupedButtonBarUsageExample,
	InputFieldExample,
} from './UsagePreviews';
import { flexBoxCode, inputField, optionsCode, usageCode, verticalOrientation } from './code';

export default function ButtonBarDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ButtonBar component</H1>
			<P clipWidth>
				Group related actions in a horizontal or vertical stack, with shared styling and optional separators.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Compose <Code openURL="/docs/react/button/">Button</Code> elements for related actions.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-buttonbar--button-defaults"
				components={[
					{
						label: 'Basic Button Bar',
						component: <ButtonBarUsageExample />,
						code: { code: usageCode, filename: 'DocumentActions.tsx' },
					},
				]}
			/>
			<P>
				For a concise alternative, supply <Code>ButtonProps</Code> records through <Code>buttons</Code>.
			</P>
			<CodeBlock code={optionsCode} language="tsx" />
			<H3>Group multiple button bars</H3>
			<P>
				Compose multiple <Code>ButtonBar</Code> components in a <Code>FlexBox</Code> using the built in{' '}
				<Code>{'preset={Preset.ButtonBar}'}</Code> prop value.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-buttonbar--sizes"
				components={[
					{
						label: 'Multiple Button Bars',
						component: <GroupedButtonBarUsageExample />,
						code: { code: flexBoxCode.trim() },
					},
				]}
			/>
			<H3>Vertical layout</H3>
			<P>
				Set <Code>orientation = 'vertical'</Code> to create custom elements like steppers, etc.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-buttonbar--sizes"
				components={[
					{
						label: 'Vertical layout',
						component: <ButtonBarVerticalExample />,
						code: { code: verticalOrientation.trim() },
					},
				]}
			/>
			<H3>Combine with other inputs</H3>
			<P>
				Compose a TextField directly into the bar. Each field retains its width and padding, uses the simple variant,
				and follows the bar height. Parent click and change callbacks identify the source item.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-buttonbar--input-composition"
				components={[
					{
						label: 'Combined with TextField',
						component: <InputFieldExample />,
						code: { code: inputField.trim() },
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Defined parent styles override child styles. Omitted values preserve child settings before applying bar
				defaults. Borders and corners belong to the wrapper; child <Code>buttons</Code> are square and borderless. When
				both APIs are used, button definitions render before composed <Code>children</Code>. The bar does not manage
				selection.
			</P>
			<P>
				<Code>inset</Code> keeps edge backgrounds continuous. It adds space to the first and last horizontal item,
				including fields, or both sides of every vertical item. Explicit padding and zero overrides are respected.
				Plain-text children share the optical adjustment used by labels; custom elements retain their own alignment.
			</P>
			<P>
				<Code>hoverTint</Code> derives a lighter background from each resolved surface. An explicit{' '}
				<Code>backgroundColorHover</Code> wins. Small buttons add their default vertical padding to the frame height;
				other presets keep their fixed height.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The wrapper uses role="group". Name it with <Code>aria-label</Code> or <Code>aria-labelledby</Code>, and give
				icon-only <Code>buttons</Code> their own <Code>aria-label</Code>. Buttons retain native Tab, Enter, and Space
				behavior. Separators are decorative. Focusing a child changes the wrapper border color. Buttons also retain an
				inset keyboard focus ring.
			</P>
			<H2 id="props">Props</H2>
			<P>
				Color props accept Slice theme tokens and CSS colors. Shared style values override child settings only when
				supplied.
			</P>
			<Definition id="animate">
				<Prop>animate</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion animation target forwarded to each <Code>Button</Code>.
			</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>
				Surface color for the wrapper and all <Code>buttons</Code>. When omitted, individual button backgrounds are
				preserved.
			</P>
			<Definition id="backgroundColorDisabled">
				<Prop>backgroundColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'Button variant default'}</DefaultVal>
			</Definition>
			<P>
				Shared <Code>disabled</Code> button background.
			</P>
			<Definition id="backgroundColorHover">
				<Prop>backgroundColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'derived from hoverTint'}</DefaultVal>
			</Definition>
			<P>Explicit hover background; takes precedence over the derived tint.</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-primary'}</DefaultVal>
			</Definition>
			<P>
				Wrapper border color; <Code>children</Code> have no borders.
			</P>
			<Definition id="borderColorFocused">
				<Prop>borderColorFocused</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>core-fill-secondary</DefaultVal>
			</Definition>
			<P>Wrapper border color while a child has focus. Composed fields use this instead of an inner outline.</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'half buttonSize'}</DefaultVal>
			</Definition>
			<P>
				Wrapper corner radius. Numeric sizes use half their pixel value; <Code>auto</Code> uses 18px.
			</P>
			<Definition id="borderStyle">
				<Prop>borderStyle</Prop>
				<TypeDef>{"CSSProperties['borderStyle']"}</TypeDef>
				<DefaultVal>{'solid'}</DefaultVal>
			</Definition>
			<P>
				Wrapper border <Code>style</Code>.
			</P>
			<Definition id="borderWidth">
				<Prop>borderWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>Wrapper border thickness. Numbers use pixels.</P>
			<Definition id="buttons">
				<Prop>buttons</Prop>
				<TypeDef>{'ButtonProps[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>
				<Code>Button</Code> definitions rendered before composed <Code>Button</Code> <Code>children</Code>.
			</P>
			<Definition id="buttonSize">
				<Prop>buttonSize</Prop>
				<TypeDef>{'s | m | l | xl | auto | number'}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				Shared button size: 24, 36, 44, or 56px. Small <Code>buttons</Code> add 2px top and bottom by default for a 28px
				frame. Numeric <Code>padding</Code> contributes to that small frame; CSS string <Code>padding</Code> is applied
				within its fixed frame. Auto follows content.
			</P>
			<Definition id="children">
				<Prop>children</Prop>
				<TypeDef>{'ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Only direct <Code>Button</Code> and <Code>TextField</Code> elements are processed. Fields use the bar height and
				the <Code>simple</Code> variant, retaining their own width and value callbacks. Other nodes, including fragments
				and custom wrapper components, are ignored.
			</P>
			<Definition id="destructive">
				<Prop>destructive</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Shared <Code>destructive</Code> <Code>Button</Code> styling.
			</P>
			<Definition id="disabled">
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Disables every button and field when supplied; false also overrides <Code>disabled</Code> child values.
			</P>
			<Definition id="divider">
				<Prop>divider</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Show decorative separators between adjacent <Code>buttons</Code>.
			</P>
			<Definition id="dividerColor">
				<Prop>dividerColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-primary'}</DefaultVal>
			</Definition>
			<P>Separator color.</P>
			<Definition id="dividerOpacity">
				<Prop>dividerOpacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.75'}</DefaultVal>
			</Definition>
			<P>Separator opacity from 0 to 1.</P>
			<Definition id="dividerStyle">
				<Prop>dividerStyle</Prop>
				<TypeDef>{"CSSProperties['borderStyle']"}</TypeDef>
				<DefaultVal>{'solid'}</DefaultVal>
			</Definition>
			<P>
				Separator border <Code>style</Code>.
			</P>
			<Definition id="dividerWidth">
				<Prop>dividerWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>Separator thickness. Numbers use pixels.</P>
			<Definition id="exit">
				<Prop>exit</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion <Code>exit</Code> target forwarded to each <Code>Button</Code>.
			</P>
			<Definition id="fill">
				<Prop>fill</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				<Code>Button</Code> <Code>fill</Code> treatment; separate from choosing a filled icon name.
			</P>
			<Definition id="gap">
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>
				Pixel <Code>gap</Code> between icons and content, and between composed <Code>children</Code>. Does not space{' '}
				<Code>buttons</Code> apart.
			</P>
			<Definition id="hoverTint">
				<Prop>hoverTint</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>
				Percentage mixed toward white on hover, clamped to 0–100. Zero disables tinting. Explicit hover backgrounds take
				precedence.
			</P>
			<Definition id="iconColor">
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-secondary'}</DefaultVal>
			</Definition>
			<P>Shared icon color; individual child colors are retained when omitted.</P>
			<Definition id="iconColorHover">
				<Prop>iconColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>Shared hover icon color.</P>
			<Definition id="iconDualTone">
				<Prop>iconDualTone</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Passes <Code>Button</Code> icon <Code>fill</Code> behavior through to its icons.
			</P>
			<Definition id="iconSize">
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>Icon dimensions in pixels, clamped to a 14px minimum.</P>
			<Definition id="iconStrokeWidth">
				<Prop>iconStrokeWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1.5 at 14px; otherwise 1.25'}</DefaultVal>
			</Definition>
			<P>
				Explicit icon stroke <Code>width</Code> overrides the size-dependent default.
			</P>
			<Definition id="initial">
				<Prop>initial</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion <Code>initial</Code> target forwarded to each <Code>Button</Code>.
			</P>
			<Definition id="inset">
				<Prop>inset</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4; l: 6; xl: 10; vertical: 0'}</DefaultVal>
			</Definition>
			<P>
				Extra left/right space inside edge button backgrounds. Horizontal bars apply it at the first and last button;
				vertical bars apply it on both sides of every item, including fields. Zero is respected.
			</P>
			<Definition id="orientation">
				<Prop>orientation</Prop>
				<TypeDef>{'horizontal | vertical'}</TypeDef>
				<DefaultVal>{'horizontal'}</DefaultVal>
			</Definition>
			<P>
				Stack direction. Vertical <Code>buttons</Code> <Code>fill</Code> the bar <Code>width</Code>.
			</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'Button default'}</DefaultVal>
			</Definition>
			<P>
				Shared button <Code>padding</Code> shorthand; does not pad the wrapper. Explicit <Code>padding</Code> bypasses
				small-size <Code>padding</Code> defaults.
			</P>
			<Definition id="paddingBottom">
				<Prop>paddingBottom</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'2 for s; Button default otherwise'}</DefaultVal>
			</Definition>
			<P>
				<Code>Button</Code> bottom <Code>padding</Code>. Explicit side values override shorthand and defaults.
			</P>
			<Definition id="paddingLeft">
				<Prop>paddingLeft</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'Button default'}</DefaultVal>
			</Definition>
			<P>
				<Code>Button</Code> left <Code>padding</Code>, separate from the bar edge <Code>inset</Code>.
			</P>
			<Definition id="paddingRight">
				<Prop>paddingRight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'Button default'}</DefaultVal>
			</Definition>
			<P>
				<Code>Button</Code> right <Code>padding</Code>, separate from the bar edge <Code>inset</Code>.
			</P>
			<Definition id="paddingTop">
				<Prop>paddingTop</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'2 for s; Button default otherwise'}</DefaultVal>
			</Definition>
			<P>
				<Code>Button</Code> top <Code>padding</Code>. Explicit side values override shorthand and defaults.
			</P>
			<Definition id="state">
				<Prop>state</Prop>
				<TypeDef>{'normal | hover | disabled'}</TypeDef>
				<DefaultVal>{'normal'}</DefaultVal>
			</Definition>
			<P>
				Shared <Code>Button</Code> visual <Code>state</Code>.
			</P>
			<Definition id="textColor">
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-secondary'}</DefaultVal>
			</Definition>
			<P>Shared text color; individual child colors are retained when omitted.</P>
			<Definition id="textColorHover">
				<Prop>textColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>Shared hover text color.</P>
			<Definition id="textSize">
				<Prop>textSize</Prop>
				<TypeDef>{'xs | s | m | l | xl'}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				Shared text size, independent of <Code>buttonSize</Code>.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Button default'}</DefaultVal>
			</Definition>
			<P>
				Motion <Code>transition</Code> forwarded to each <Code>Button</Code>.
			</P>
			<Definition id="underline">
				<Prop>underline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Underline <Code>Button</Code> content on hover and keyboard focus.
			</P>
			<Definition id="variant">
				<Prop>variant</Prop>
				<TypeDef>{'solid | outline | text'}</TypeDef>
				<DefaultVal>{'outline'}</DefaultVal>
			</Definition>
			<P>
				Shared <Code>Button</Code> <Code>variant</Code>. The wrapper always owns borders and corners.
			</P>
			<Definition id="variants">
				<Prop>variants</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion <Code>variants</Code> forwarded to each <Code>Button</Code>.
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'content width'}</DefaultVal>
			</Definition>
			<P>
				Wrapper <Code>width</Code>; <Code>fill</Code> means 100%. Vertical child <Code>buttons</Code>
				<Code>fill</Code> this <Code>width</Code>.
			</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other non-event DOM attributes apply to the group wrapper. <Code>className</Code> is appended; component
				geometry takes precedence over <Code>style</Code>. Supply <Code>aria-label</Code> or{' '}
				<Code>aria-labelledby</Code> to name the group.
			</P>
			<H2 id="events">Events</H2>
			<P>
				Child callbacks run before parent callbacks. Parent click and change callbacks receive the event or value
				followed by item metadata. Other parent handlers receive button events rather than wrapper events.{' '}
				<Code>onClick</Code> can receive <Code>undefined</Code> for programmatic or deferred <Code>Button</Code>{' '}
				activation; <Code>onToolTip</Code> receives a tooltip or <Code>null</Code> to dismiss it.
			</P>
			<Definition id="onChange">
				<Method>onChange</Method>
				<TypeDef>{'(value: string, item: ButtonBarItemInfo) => void'}</TypeDef>
			</Definition>
			<P>
				Receives changes from composed <Code>TextField</Code> children after their own callback. The second argument
				contains <Code>index</Code>, <Code>label</Code> (label/inputName/name), and optional <Code>id</Code>{' '}
				(inputId/id), so multiple fields can be distinguished. Button clicks and programmatic value changes do not emit
				this callback.
			</P>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>
					{'(event: React.MouseEvent<HTMLButtonElement> | undefined, item: ButtonBarItemClickInfo) => void'}
				</TypeDef>
			</Definition>
			<P>
				Receives each child button activation after that child’s callback. The second argument contains{' '}
				<Code>index</Code>, <Code>label</Code>, and <Code>id</Code>. The zero-based index includes TextField positions;
				the label uses text content or the accessible label/tooltip. Supply explicit button IDs for stable identity when
				reordering.
			</P>
			<Definition id="onToolTip">
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				Receives tooltip requests and <Code>null</Code> dismissal from child buttons.
			</P>
			<Definition id="buttonEvents">
				<Method>...buttonEvents</Method>
				<TypeDef>Button event callbacks</TypeDef>
			</Definition>
			<P>
				Other supported <Code>Button</Code> events, including focus, blur, and pointer callbacks, retain their button
				event signatures.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'ButtonBar' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'animate', title: 'animate', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorDisabled', title: 'backgroundColorDisabled', code: true },
			{ id: 'backgroundColorHover', title: 'backgroundColorHover', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderColorFocused', title: 'borderColorFocused', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderStyle', title: 'borderStyle', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'buttons', title: 'buttons', code: true },
			{ id: 'buttonSize', title: 'buttonSize', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'destructive', title: 'destructive', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'divider', title: 'divider', code: true },
			{ id: 'dividerColor', title: 'dividerColor', code: true },
			{ id: 'dividerOpacity', title: 'dividerOpacity', code: true },
			{ id: 'dividerStyle', title: 'dividerStyle', code: true },
			{ id: 'dividerWidth', title: 'dividerWidth', code: true },
			{ id: 'exit', title: 'exit', code: true },
			{ id: 'fill', title: 'fill', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'hoverTint', title: 'hoverTint', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorHover', title: 'iconColorHover', code: true },
			{ id: 'iconDualTone', title: 'iconDualTone', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'iconStrokeWidth', title: 'iconStrokeWidth', code: true },
			{ id: 'initial', title: 'initial', code: true },
			{ id: 'inset', title: 'inset', code: true },
			{ id: 'orientation', title: 'orientation', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'paddingBottom', title: 'paddingBottom', code: true },
			{ id: 'paddingLeft', title: 'paddingLeft', code: true },
			{ id: 'paddingRight', title: 'paddingRight', code: true },
			{ id: 'paddingTop', title: 'paddingTop', code: true },
			{ id: 'state', title: 'state', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorHover', title: 'textColorHover', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'transition', title: 'transition', code: true },
			{ id: 'underline', title: 'underline', code: true },
			{ id: 'variant', title: 'variant', code: true },
			{ id: 'variants', title: 'variants', code: true },
			{ id: 'width', title: 'width', code: true },
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
			{ id: 'buttonEvents', title: '...buttonEvents', code: true },
		],
	},
];

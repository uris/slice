import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { IconButtonExampleExample, IconButtonMotionExample, IconButtonUsageExample } from './UsagePreviews';
import { exampleCode, motionCode, usageCode } from './code';

export function IconButtonDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>IconButton component</H1>
			<P clipWidth>
				Keep frequent actions within easy reach. IconButton pairs a compact action with optional activity dots and
				counts.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Set <Code>actionName</Code> and provide your click handler.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-iconbutton--default"
				components={[
					{
						label: 'Basic usage',
						component: <IconButtonUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'IconButtonExample.tsx',
					},
				]}
			/>
			<H3>Control selection</H3>
			<P>
				Use <Code>selected</Code> and <Code>onChange</Code> to control a toggle. For local state, use{' '}
				<Code>defaultSelected</Code> instead.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-iconbutton--default"
				components={[
					{
						label: 'Control selection',
						component: <IconButtonExampleExample />,
						code: exampleCode.trim(),
						codeFilename: 'IconButtonToggle.tsx',
					},
				]}
			/>
			<H3>Animate an icon on toggle</H3>
			<P>
				Give <Code>selected</Code> and <Code>unselected</Code> different animation targets, such as rotation or scale.
				The icon animates between them when toggled. This example uses rotation.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-iconbutton--default"
				components={[
					{
						label: 'Animate an icon on toggle',
						component: <IconButtonMotionExample />,
						code: motionCode.trim(),
						codeFilename: 'IconButtonMotion.tsx',
					},
				]}
			/>
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Selected colors take priority over hover colors. Setting <Code>hover</Code> to false disables both background
				and icon hover colors.
			</P>
			<P>
				<Code>onClick</Code> runs before selection changes. Call <Code>event.preventDefault()</Code> to cancel the
				change. Tooltips are requested through <Code>onToolTip</Code>; your application displays them.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				<Code>actionName</Code> supplies the button’s <Code>aria-label</Code>. Missing, empty, or whitespace-only names
				fall back to “Action”. Set a specific name such as “More options” so people know what the button does. There is
				no visible label.
			</P>
			<P>
				The native button supports Enter and Space, with a visible keyboard focus ring. Toggles expose{' '}
				<Code>aria-pressed</Code>. Disabled buttons cannot be activated or reached through Tab.
			</P>
			<P>
				Icons, dots, and counts are decorative to assistive technology. Include meaningful status in{' '}
				<Code>actionName</Code> or nearby text. The component manages its accessible name and pressed state internally;
				direct naming attributes are not part of its public API.
			</P>
			<P>
				Reduced-motion preferences disable color and icon animation, including custom delays and repeats. State changes
				appear immediately, and changing the preference preserves keyboard focus.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>All props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'actionName'}>
				<Prop>actionName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Action'}</DefaultVal>
			</Definition>
			<P>Describes the action without adding visible text.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Resting background.'}</P>
			<Definition id={'backgroundColorHover'}>
				<Prop>backgroundColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Hover background while unselected.'}</P>
			<Definition id={'backgroundColorSelected'}>
				<Prop>backgroundColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Selected background; takes priority over '}
				<Code>hover</Code>
				{'.'}
			</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Outline color.'}</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'50%'}</DefaultVal>
			</Definition>
			<P>{'Corner radius. Numbers are pixels; use 0 for square corners.'}</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Border width in pixels. Negative or nonfinite values become zero.'}</P>
			<Definition id={'buttonSize'}>
				<Prop>buttonSize</Prop>
				<TypeDef>{"'s' | 'm' | 'l' | 'xl' | number"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				{
					'Square frame size: s=24, m=36, l=44, xl=56px. A positive finite number sets a custom pixel size; invalid values fall back to 36px.'
				}
			</P>
			<Definition id={'count'}>
				<Prop>count</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Badge count. Zero hides it.</P>
			<Definition id={'defaultSelected'}>
				<Prop>defaultSelected</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Initial local '}
				<Code>toggle</Code>
				{' state. Later changes are ignored; use '}
				<Code>selected</Code>
				{' for external control.'}
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Disables activation, dims the '}
				<Code>icon</Code>
				{', and dismisses an open '}
				<Code>tooltip</Code>
				{'.'}
			</P>
			<Definition id={'hover'}>
				<Prop>hover</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Enables '}
				<Code>hover</Code>
				{' colors for both background and '}
				<Code>icon</Code>
				{'. Tooltip requests remain available.'}
			</P>
			<Definition id={'icon'}>
				<Prop>icon</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'basic.more-horiz'}</DefaultVal>
			</Definition>
			<P>{'Icon name.'}</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Resting '}
				<Code>icon</Code>
				{' color.'}
			</P>
			<Definition id={'iconColorHover'}>
				<Prop>iconColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Hover '}
				<Code>icon</Code>
				{' color while unselected.'}
			</P>
			<Definition id={'iconColorSelected'}>
				<Prop>iconColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Selected '}
				<Code>icon</Code>
				{' color; takes priority over '}
				<Code>hover</Code>
				{'.'}
			</P>
			<Definition id={'iconDualTone'}>
				<Prop>iconDualTone</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Enables the optional translucent layer on icons that support dual tone.</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>{'Icon size in pixels. Zero hides its geometry; negative or nonfinite values fall back to 20px.'}</P>
			<Definition id={'iconStrokeWidth'}>
				<Prop>iconStrokeWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Stroke width in the icon’s 20-unit viewBox. Omit to use <Code>Icon</Code>’s default. Zero removes strokes;
				solid-filled artwork is unaffected.
			</P>
			<Definition id={'selected'}>
				<Prop>selected</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Controls selection when '}
				<Code>toggle</Code>
				{'=true. Update it from '}
				<Code>onChange</Code>
				{'. User activation requests a change without mutating this value.'}
			</P>
			<Definition id={'showDot'}>
				<Prop>showDot</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Shows a corner activity dot.</P>
			<Definition id={'toggle'}>
				<Prop>toggle</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Enables on/off selection. Ordinary actions do not emit <Code>onChange</Code>.
			</P>
			<Definition id={'toggleIcon'}>
				<Prop>toggleIcon</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Uses the '}
				<Code>icon</Code>
				{'’s alternate '}
				<Code>selected</Code>
				{' shape when available and '}
				<Code>toggle</Code>
				{'=true.'}
			</P>
			<Definition id={'tooltip'}>
				<Prop>tooltip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Optional text requested through '}
				<Code>onToolTip</Code>
				{' on '}
				<Code>hover</Code>
				{' or focus. Your application renders the '}
				<Code>tooltip</Code>
				{'.'}
			</P>
			<Definition id={'buttonAttributes'}>
				<Prop>...buttonAttributes</Prop>
				<TypeDef>{'React.ButtonHTMLAttributes<HTMLButtonElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other native attributes apply to the button. className is appended and style is merged; component sizing and
				border variables take priority. type defaults to button. Children are not supported.
			</P>

			<H2 id={'motion-section'}>Motion</H2>
			<P>
				<Code>motionValues</Code> defines icon animation targets. <Code>transition</Code> controls their timing and
				color changes, merged with Slice’s <Code openURL="/docs/react/motion/">Water</Code> transition.
			</P>

			<Definition id={'motionValues'}>
				<Prop>motionValues</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Inner-icon animation targets named '}
				<Code>selected</Code>
				{
					' and unselected. Each state is merged with neutral rotate=0, scale=1, and opacity=1 values. Variant functions receive the selection boolean. Use '
				}
				<Code>transition</Code>
				{' for timing; per-variant '}
				<Code>transition</Code>
				{' settings are ignored.'}
			</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Shared timing for background colors, '}
				<Code>icon</Code>
				{' colors, and '}
				<Code>icon</Code>
				{' animation. Partial settings are merged with Slice’s Water '}
				<Code>transition</Code>
				{'.'}
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(selected: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				{'Requests the next '}
				<Code>toggle</Code>
				{' state after an uncancelled activation. Runs only when '}
				<Code>toggle</Code>
				{'=true.'}
			</P>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'React.MouseEventHandler<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				{'Runs first for pointer or keyboard activation. Calling '}
				<Code>event.preventDefault()</Code>
				{' cancels selection changes and '}
				<Code>onChange</Code>
				{'. Disabled buttons do not activate.'}
			</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				{'Requests '}
				<Code>tooltip</Code>
				{' content on '}
				<Code>hover</Code>
				{
					' or focus. ToolTip carries type, payload.label, and the button ref; event is present for mouse requests and absent for focus. Sends null on activation, when both '
				}
				<Code>hover</Code>
				{' and focus end, when '}
				<Code>disabled</Code>
				{', when '}
				<Code>tooltip</Code>
				{' text changes, or on unmount.'}
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...buttonEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				{'Native handlers are composed with internal '}
				<Code>hover</Code>
				{
					' and focus handling. Preventing default on entry or focus suppresses the corresponding internal behavior. There are no drag or pan gestures.'
				}
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'IconButton component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'actionName', title: 'actionName', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorHover', title: 'backgroundColorHover', code: true },
			{ id: 'backgroundColorSelected', title: 'backgroundColorSelected', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'buttonSize', title: 'buttonSize', code: true },
			{ id: 'count', title: 'count', code: true },
			{ id: 'defaultSelected', title: 'defaultSelected', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'hover', title: 'hover', code: true },
			{ id: 'icon', title: 'icon', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorHover', title: 'iconColorHover', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconDualTone', title: 'iconDualTone', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'iconStrokeWidth', title: 'iconStrokeWidth', code: true },
			{ id: 'selected', title: 'selected', code: true },
			{ id: 'showDot', title: 'showDot', code: true },
			{ id: 'toggle', title: 'toggle', code: true },
			{ id: 'toggleIcon', title: 'toggleIcon', code: true },
			{ id: 'tooltip', title: 'tooltip', code: true },
			{ id: 'buttonAttributes', title: '...buttonAttributes', code: true },
		],
	},
	{
		id: 'motion-section',
		title: 'Motion',
		items: [
			{ id: 'motionValues', title: 'motionValues', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'nativeEvents', title: '...buttonEvents', code: true },
		],
	},
];
export default IconButtonDoc;

import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { ToggleButtonPreview } from './ToggleButtonPreview';
import { childrenCode, disabledCode, exampleCode, motionCode, outsideCode, textOnly } from './code';

export function ToggleButtonDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id={'title'}>ToggleButton component</H1>
			<P clipWidth>Make on/off actions easy to recognize with a label, an optional icon, and a clear selected state.</P>
			<H2 id={'usage'}>Usage</H2>
			<H3>Basic usage</H3>
			<P>
				Use <Code>selected</Code> and <Code>onChange</Code> to keep selection in application state. Use{' '}
				<Code>defaultSelected</Code> instead for local state. Set <Code>deselect</Code> to false when an active choice
				should stay selected.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-togglebutton--default"
				components={[{ label: 'Basic usage', component: <ToggleButtonPreview />, code: exampleCode.trim() }]}
			/>

			<H3>Disabled</H3>
			<P>
				Use <Code>disabled</Code> to control enabling and disabling the button. The button stops responding to click
				events.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-togglebutton--default"
				components={[
					{
						label: 'Disabled',
						component: <ToggleButtonPreview variant="disabled" />,
						code: disabledCode.trim(),
					},
				]}
			/>

			<H3>Keep the label outside the background</H3>
			<P>
				Use <Code>labelOutside</Code> for an icon highlight with text beside it.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-togglebutton--default"
				components={[
					{
						label: 'Label outside',
						component: <ToggleButtonPreview variant="outside" />,
						code: outsideCode.trim(),
					},
				]}
			/>

			<H3>Animate an icon on toggle</H3>
			<P>
				Give <Code>selected</Code> and <Code>unselected</Code> different animation targets, such as rotation or scale.
				This example uses rotation.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-togglebutton--default"
				components={[
					{
						label: 'Animated',
						component: <ToggleButtonPreview variant="animated" />,
						code: motionCode.trim(),
					},
				]}
			/>

			<H3>Text only</H3>
			<P>
				Omit <Code>icon</Code> to display the label only.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-togglebutton--default"
				components={[
					{
						label: 'Text only',
						component: <ToggleButtonPreview variant="text" />,
						code: textOnly.trim(),
					},
				]}
			/>

			<H3>Custom content</H3>
			<P>
				Use children when you want to provide custom content with <Code>buttonSize</Code> set to <Code>"auto"</Code> to
				allow the button to resize freely (or add your own content wrapper). Include an <Code>actionName</Code> for
				accessibility.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-togglebutton--default"
				components={[
					{
						label: 'Custom content',
						component: <ToggleButtonPreview variant="children" />,
						code: childrenCode.trim(),
					},
				]}
			/>

			<H2 id={'behavior'}>Behavior</H2>
			<P>
				The icon and text form one button. <Code>label</Code> takes priority over <Code>children</Code>; omit the icon
				for a text-only toggle. Selected colors take priority over hover colors.
			</P>
			<P>
				<Code>onClick</Code> runs before selection changes. Call <Code>event.preventDefault()</Code> to cancel a change.
				A group of toggles needs application state to coordinate its selection.
			</P>
			<P>
				Default padding compensates for the icon’s internal space: the left edge is smaller with an icon, and both edges
				adjust for icon-only content. Explicit padding values take priority.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The native button supports Enter and Space and has a visible keyboard focus ring. Its selected state is exposed
				through <Code>aria-pressed</Code>. Disabling the control blocks interaction with both icon and text and removes
				it from the Tab order.
			</P>
			<P>
				The visible string label or numeric content supplies the accessible name. Use <Code>actionName</Code> for
				icon-only or rich content, or when a more specific description helps. Missing or blank names fall back to
				“Action”. Direct <Code>aria-label</Code> and <Code>aria-labelledby</Code> props are not exposed. Icons are
				decorative and have no separate tab stop.
			</P>
			<P>
				Reduced-motion preferences disable icon and color animation, including custom delays and repeats. State changes
				appear immediately, and live preference changes preserve keyboard focus.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>
				All props are optional. Color props accept Slice theme tokens or CSS colors. Numeric padding values are pixels;
				negative values become zero.
			</P>
			<Definition id={'actionName'}>
				<Prop>actionName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Optional action description in place of the visible text.'}</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Resting background.'}</P>
			<Definition id={'backgroundColorHover'}>
				<Prop>backgroundColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Hover background while unselected.'}</P>
			<Definition id={'backgroundColorSelected'}>
				<Prop>backgroundColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-special'}</DefaultVal>
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
			<P>{'Border color.'}</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>{'Corner radius. Numbers are pixels; zero gives square corners.'}</P>
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
					'Minimum frame height and width: s=24, m=36, l=44, xl=56px. A positive finite number sets a custom minimum. Content and '
				}
				<Code>padding</Code>
				{' can make the button larger; invalid sizes fall back to 36px.'}
			</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Content used when '}
				<Code>label</Code>
				{' is absent. Keep it noninteractive; the whole control is one button.'}
			</P>
			<Definition id={'defaultSelected'}>
				<Prop>defaultSelected</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Initial local selection. Later changes are ignored; use '}
				<Code>selected</Code>
				{' for external control.'}
			</P>
			<Definition id={'deselect'}>
				<Prop>deselect</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Allows clearing an active selection. False keeps it '}
				<Code>selected</Code>
				{' without another '}
				<Code>onChange</Code>
				{'; '}
				<Code>onClick</Code>
				{' still runs.'}
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Disables the whole control, dims '}
				<Code>icon</Code>
				{' and text, and dismisses an open '}
				<Code>tooltip</Code>
				{'.'}
			</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>
				{'Pixel '}
				<Code>gap</Code>
				{' between '}
				<Code>icon</Code>
				{' and text. Negative or nonfinite values resolve to zero or the 4px default respectively.'}
			</P>
			<Definition id={'hover'}>
				<Prop>hover</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Enables background, '}
				<Code>icon</Code>
				{', and text '}
				<Code>hover</Code>
				{' colors.'}
			</P>
			<Definition id={'icon'}>
				<Prop>icon</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Optional '}
				<Code>icon</Code>
				{' before the content.'}
			</P>
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
				<DefaultVal>{'core-surface-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Selected '}
				<Code>icon</Code>
				{' color; takes priority over '}
				<Code>hover</Code>
				{'.'}
			</P>
			<Definition id={'iconFill'}>
				<Prop>iconFill</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Uses the '}
				<Code>icon</Code>
				{'’s filled appearance.'}
			</P>
			<Definition id={'iconSelected'}>
				<Prop>iconSelected</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Alternate '}
				<Code>icon</Code>
				{' when '}
				<Code>selected</Code>
				{'. Requires '}
				<Code>icon</Code>
				{'; otherwise the original '}
				<Code>icon</Code>
				{' remains.'}
			</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>{'Icon size in pixels. Negative or nonfinite values fall back to 20px; zero hides its geometry.'}</P>
			<Definition id={'iconStrokeWidth'}>
				<Prop>iconStrokeWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Stroke width in the icon’s 20-unit viewBox. Omit to use <Code>Icon</Code>’s default. Zero removes strokes;
				solid-filled artwork is unaffected.
			</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Visible text. Takes priority over '}
				<Code>children</Code>
				{'.'}
			</P>
			<Definition id={'labelOutside'}>
				<Prop>labelOutside</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Applies the background, border, and corner radius only around the icon, leaving the label outside. Both remain
				one clickable control. Without an icon, the background stays on the whole button. Default outer padding is 4px
				horizontally and zero vertically in this mode; explicit padding still applies.
			</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Uniform '}
				<Code>padding</Code>
				{
					'. Defaults to zero vertical padding and spacing-s + spacing-xs horizontally (12px by default), with spacing-xs subtracted on an '
				}
				<Code>icon</Code>
				{
					' edge; icon-only content adjusts both edges. An explicit value disables this optical adjustment. Numbers are pixels.'
				}
			</P>
			<Definition id={'paddingBottom'}>
				<Prop>paddingBottom</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Bottom '}
				<Code>padding</Code>
				{'; overrides '}
				<Code>padding</Code>
				{'.'}
			</P>
			<Definition id={'paddingLeft'}>
				<Prop>paddingLeft</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Left '}
				<Code>padding</Code>
				{'; overrides '}
				<Code>padding</Code>
				{' and the default '}
				<Code>icon</Code>
				{' adjustment.'}
			</P>
			<Definition id={'paddingRight'}>
				<Prop>paddingRight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Right '}
				<Code>padding</Code>
				{'; overrides '}
				<Code>padding</Code>
				{' and the default icon-only adjustment.'}
			</P>
			<Definition id={'paddingTop'}>
				<Prop>paddingTop</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Top '}
				<Code>padding</Code>
				{'; overrides '}
				<Code>padding</Code>
				{'.'}
			</P>
			<Definition id={'selected'}>
				<Prop>selected</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Controlled selection. Update it from '}
				<Code>onChange</Code>
				{'; activation requests a change without mutating this value.'}
			</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Resting text color.'}</P>
			<Definition id={'textColorHover'}>
				<Prop>textColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Hover text color while unselected.'}</P>
			<Definition id={'textColorSelected'}>
				<Prop>textColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'textColor when labelOutside; otherwise core-surface-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Selected text color; takes priority over '}
				<Code>hover</Code>
				{'.'}
			</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'s'}</DefaultVal>
			</Definition>
			<P>{'Visible text size.'}</P>
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
				{' shape when available. Use '}
				<Code>iconSelected</Code>
				{' to choose a different '}
				<Code>icon</Code>
				{' name.'}
			</P>
			<Definition id={'tooltip'}>
				<Prop>tooltip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Optional '}
				<Code>tooltip</Code>
				{' text requested through '}
				<Code>onToolTip</Code>
				{'. Your application renders the '}
				<Code>tooltip</Code>
				{'.'}
			</P>
			<Definition id={'buttonAttributes'}>
				<Prop>...buttonAttributes</Prop>
				<TypeDef>{'React.ButtonHTMLAttributes<HTMLButtonElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Other native attributes apply to the single button. className is appended; style is merged, with component sizing, border, and '
				}
				<Code>padding</Code>
				{' variables taking priority. type defaults to button.'}
			</P>

			<H2 id={'motion-section'}>Motion</H2>
			<P>
				<Code>motionValues</Code> configures icon animation. <Code>transition</Code> controls animation and color
				timing, merged with Slice’s <Code openURL="/docs/react/motion/">Water</Code> transition.
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
					' and unselected, merged with neutral rotate=0, scale=1, and opacity=1 values. Variant functions receive the selection boolean. Per-variant '
				}
				<Code>transition</Code>
				{' settings are ignored; use '}
				<Code>transition</Code>
				{'.'}
			</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Shared timing for '}
				<Code>icon</Code>
				{' animation and background, '}
				<Code>icon</Code>
				{', and text colors. Partial settings are merged with Slice’s Water '}
				<Code>transition</Code>
				{'.'}
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(selected: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				{'Requests the next selection after an uncancelled activation. Does not run when '}
				<Code>deselect</Code>
				{'=false keeps an active selection.'}
			</P>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'React.MouseEventHandler<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				{'Runs before selection handling. Calling '}
				<Code>event.preventDefault()</Code>
				{' cancels the change. Disabled buttons do not activate.'}
			</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				{'Requests a '}
				<Code>tooltip</Code>
				{' on '}
				<Code>hover</Code>
				{' or focus. ToolTip carries type, payload.'}
				<Code>label</Code>
				{
					', and the button ref; event is present for mouse requests and absent for focus. Sends null on activation, when both '
				}
				<Code>hover</Code>
				{' and focus end, on disable, '}
				<Code>tooltip</Code>
				{'/callback changes, or unmount.'}
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...buttonEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Other native button handlers are composed with internal behavior. Preventing default on mouse entry or focus suppresses that internal handling. No drag or pan gestures are implemented.'
				}
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'ToggleButton component' },
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
			{ id: 'children', title: 'children', code: true },
			{ id: 'defaultSelected', title: 'defaultSelected', code: true },
			{ id: 'deselect', title: 'deselect', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'hover', title: 'hover', code: true },
			{ id: 'icon', title: 'icon', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorHover', title: 'iconColorHover', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconFill', title: 'iconFill', code: true },
			{ id: 'iconSelected', title: 'iconSelected', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'iconStrokeWidth', title: 'iconStrokeWidth', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'labelOutside', title: 'labelOutside', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'paddingBottom', title: 'paddingBottom', code: true },
			{ id: 'paddingLeft', title: 'paddingLeft', code: true },
			{ id: 'paddingRight', title: 'paddingRight', code: true },
			{ id: 'paddingTop', title: 'paddingTop', code: true },
			{ id: 'selected', title: 'selected', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorHover', title: 'textColorHover', code: true },
			{ id: 'textColorSelected', title: 'textColorSelected', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
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
export default ToggleButtonDoc;

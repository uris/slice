import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { SliderDisabledExample, SliderHoverExample, SliderStepExample, SliderUsageExample } from './UsagePreviews';
import { commitCode, controlledCode, disabledCode, hoverCode, stepCode, usageCode } from './code';

export function SliderDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Slider component</H1>
			<P clipWidth>
				Fine-tune a value with a compact track and draggable head. Slider fits volume, zoom, and other continuous
				settings.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Give the slider an accessible label. It manages its own value unless you provide <Code>value</Code>.
			</P>
			<TipBox inline noBorder>
				Drag to change the value, or focus the slider and use the arrow keys. Dragging stays continuous; step controls
				keyboard increments only.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-slider--default"
				components={[
					{
						label: 'Basic usage',
						component: <SliderUsageExample />,
						code: { code: usageCode.trim(), filename: 'SliderExample.tsx' },
					},
				]}
			/>
			<H3>Control the value</H3>
			<P>
				Use <Code>value</Code> and <Code>onChange</Code> to keep the slider in sync with your UI. For an uncontrolled
				starting value, use <Code>defaultValue</Code>.
			</P>
			<CodeBlock filename="ControlledSlider.tsx" language="tsx" code={controlledCode.trim()} />
			<H3>Set keyboard increments</H3>
			<P>
				<Code>step</Code> controls keyboard increments only. Dragging remains continuous, and keyboard increments start
				from the current value without snapping it to a grid.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-slider--default"
				components={[
					{
						label: 'Set keyboard increments',
						component: <SliderStepExample />,
						code: { code: stepCode.trim(), filename: 'SliderKeyboard.tsx' },
					},
				]}
			/>
			<H3>Reveal the head on hover</H3>
			<P>
				Use <Code>trackHeadOnHover</Code> to keep a nonzero head transparent until hover, keyboard focus, or dragging.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-slider--default"
				components={[
					{
						label: 'Reveal the head on hover',
						component: <SliderHoverExample />,
						code: { code: hoverCode.trim(), filename: 'SliderHover.tsx' },
					},
				]}
			/>
			<H3>Handle a completed change</H3>
			<P>
				Use <Code>onChange</Code> for live feedback and <Code>onChangeEnd</Code> for work that should run after an
				interaction finishes.
			</P>
			<CodeBlock filename="SliderCommit.tsx" language="tsx" code={commitCode.trim()} />
			<H3>Disable the control</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-slider--default"
				components={[
					{
						label: 'Disabled slider',
						component: <SliderDisabledExample />,
						code: { code: disabledCode.trim() },
					},
				]}
			/>
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				With <Code>value</Code>, your app controls the display. Without it, the slider manages local state and reads{' '}
				<Code>defaultValue</Code> once. External value changes do not emit callbacks.
			</P>
			<P>
				Values stay within <Code>min</Code> and <Code>max</Code>. Dragging can continue outside the track; the value
				stops at either end. Unchanged values do not emit callbacks, and canceled interactions do not emit{' '}
				<Code>onChangeEnd</Code>.
			</P>
			<P>
				The control uses a native range input. Pass <Code>name</Code> to include its current value in form submission;
				disabled sliders are excluded.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				Label the input with <Code>aria-label</Code>, <Code>aria-labelledby</Code>, or an associated HTML label. The
				input exposes its current value and bounds. Use <Code>aria-valuetext</Code> when a number needs a more
				descriptive reading.
			</P>
			<P>
				Arrow keys and Page Up/Down move by one keyboard increment. Home selects the minimum and End selects the
				maximum. Keyboard focus has a visible inset indicator. Disabled sliders cannot be focused or activated.
			</P>
			<P>
				The hover head fades with Slice’s <Code openURL="/docs/react/motion/">Water</Code> transition. Reduced-motion
				preferences make this fade immediate. Value changes always follow input directly.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'cursor'}>
				<Prop>cursor</Prop>
				<TypeDef>{"'default' | 'grab' | 'grabbing' | 'pointer'"}</TypeDef>
				<DefaultVal>{'grabbing'}</DefaultVal>
			</Definition>
			<P>Cursor for an enabled slider. Disabled sliders use the default cursor.</P>
			<Definition id={'defaultValue'}>
				<Prop>defaultValue</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'50'}</DefaultVal>
			</Definition>
			<P>
				Initial uncontrolled value. Later changes do not reset it; the displayed value is clamped to the current bounds.
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Blocks interaction and removes the input from the tab order.</P>
			<Definition id={'disabledOpacity'}>
				<Prop>disabledOpacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.5'}</DefaultVal>
			</Definition>
			<P>Opacity of the whole control while disabled. Clamped to 0–1; non-finite values use 0.5.</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'2'}</DefaultVal>
			</Definition>
			<P>
				Track thickness. Numbers are pixels; strings accept CSS lengths. Negative numbers become zero; non-finite
				numbers use 2.
			</P>
			<Definition id={'max'}>
				<Prop>max</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'100'}</DefaultVal>
			</Definition>
			<P>
				Maximum value. Non-finite bounds use their defaults; reversed bounds are sorted. Equal bounds produce a fixed
				value.
			</P>
			<Definition id={'min'}>
				<Prop>min</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Minimum value. Non-finite bounds use their defaults; reversed bounds are sorted.</P>
			<Definition id={'progressColor'}>
				<Prop>progressColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-tertiary'}</DefaultVal>
			</Definition>
			<P>Color of the filled track.</P>
			<Definition id={'step'}>
				<Prop>step</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Keyboard increment for Arrow and Page keys. Pointer dragging stays continuous. Omit or pass an
				invalid/nonpositive number to use 1% of the range, with a minimum increment of 0.01.
			</P>
			<Definition id={'touchHeight'}>
				<Prop>touchHeight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'24'}</DefaultVal>
			</Definition>
			<P>
				Minimum interaction height. Numbers are pixels; strings accept CSS lengths. The hit area also fits the track and
				head. Negative numbers become zero; non-finite numbers use 24.
			</P>
			<Definition id={'trackColor'}>
				<Prop>trackColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>Color of the unfilled track.</P>
			<Definition id={'trackHeadBorderColor'}>
				<Prop>trackHeadBorderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-secondary'}</DefaultVal>
			</Definition>
			<P>Head border color.</P>
			<Definition id={'trackHeadBorderRadius'}>
				<Prop>trackHeadBorderRadius</Prop>
				<TypeDef>{'number | string | null'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>Head corner radius. Numbers are pixels; strings accept CSS radius values. Null uses the rounded default.</P>
			<Definition id={'trackHeadBorderWidth'}>
				<Prop>trackHeadBorderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>Head border width in pixels, included in its size. Negative values become zero; non-finite values use 1.</P>
			<Definition id={'trackHeadColor'}>
				<Prop>trackHeadColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-light'}</DefaultVal>
			</Definition>
			<P>Head background color.</P>
			<Definition id={'trackHeadOnHover'}>
				<Prop>trackHeadOnHover</Prop>
				<TypeDef>{'true | undefined'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Fade in a nonzero head on hover, keyboard focus, or while dragging. Omit to keep the head visible. Uses Water
				timing and respects reduced motion.
			</P>
			<Definition id={'trackHeadSize'}>
				<Prop>trackHeadSize</Prop>
				<TypeDef>{'number | null'}</TypeDef>
				<DefaultVal>{'12'}</DefaultVal>
			</Definition>
			<P>Head diameter in pixels. Zero or null hides it; negative values become zero and non-finite values use 12.</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Controlled value. Update it through onChange. Values are clamped to the bounds; non-finite values use the
				minimum.
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100'}</DefaultVal>
			</Definition>
			<P>
				Overall width, including head clearance. Numbers are pixels; strings accept CSS lengths. Use 100% or auto to
				fill available width. Negative numbers become zero; non-finite numbers use 100.
			</P>
			<Definition id={'inputAttributes'}>
				<Prop>...inputAttributes</Prop>
				<TypeDef>{'React.InputHTMLAttributes<HTMLInputElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Native attributes apply to the range input, including id, name, form, aria-label, aria-labelledby,
				aria-valuetext, and data attributes. className and style apply to the visual wrapper. Internal geometry and
				color variables take priority over overlapping style variables. Children are not supported.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: number, percent: number) => void'}</TypeDef>
			</Definition>
			<P>
				Runs when the user requests a different value. The second argument is a fraction from 0 to 1, not a percentage
				from 0 to 100. Controlled prop changes do not emit it.
			</P>
			<Definition id={'onChangeEnd'}>
				<Method>onChangeEnd</Method>
				<TypeDef>{'(value: number, percent: number) => void'}</TypeDef>
			</Definition>
			<P>
				Runs once after a changed pointer interaction ends or a slider key is released. Repeated key presses commit on
				release; blur commits a pending keyboard change. Cancellation, disabling, and unmounting do not emit a
				completion. Atomic assistive-technology changes commit immediately.
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...inputEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLInputElement>'}</TypeDef>
			</Definition>
			<P>
				Standard events target the native range input. <Code>onChange</Code> above is the numeric component callback.
				Native <Code>onKeyDown</Code> and <Code>onPointerDown</Code> handlers run first;{' '}
				<Code>event.preventDefault()</Code> cancels the corresponding default interaction.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{
		id: 'title',
		title: 'Slider component',
	},
	{
		id: 'usage',
		title: 'Usage',
	},
	{
		id: 'behavior',
		title: 'Behavior',
	},
	{
		id: 'accessibility',
		title: 'Accessibility',
	},
	{
		id: 'props',
		title: 'Props',
		items: [
			{
				id: 'cursor',
				title: 'cursor',
				code: true,
			},
			{
				id: 'defaultValue',
				title: 'defaultValue',
				code: true,
			},
			{
				id: 'disabled',
				title: 'disabled',
				code: true,
			},
			{
				id: 'disabledOpacity',
				title: 'disabledOpacity',
				code: true,
			},
			{
				id: 'height',
				title: 'height',
				code: true,
			},
			{
				id: 'max',
				title: 'max',
				code: true,
			},
			{
				id: 'min',
				title: 'min',
				code: true,
			},
			{
				id: 'progressColor',
				title: 'progressColor',
				code: true,
			},
			{
				id: 'step',
				title: 'step',
				code: true,
			},
			{
				id: 'touchHeight',
				title: 'touchHeight',
				code: true,
			},
			{
				id: 'trackColor',
				title: 'trackColor',
				code: true,
			},
			{
				id: 'trackHeadBorderColor',
				title: 'trackHeadBorderColor',
				code: true,
			},
			{
				id: 'trackHeadBorderRadius',
				title: 'trackHeadBorderRadius',
				code: true,
			},
			{
				id: 'trackHeadBorderWidth',
				title: 'trackHeadBorderWidth',
				code: true,
			},
			{
				id: 'trackHeadColor',
				title: 'trackHeadColor',
				code: true,
			},
			{
				id: 'trackHeadOnHover',
				title: 'trackHeadOnHover',
				code: true,
			},
			{
				id: 'trackHeadSize',
				title: 'trackHeadSize',
				code: true,
			},
			{
				id: 'value',
				title: 'value',
				code: true,
			},
			{
				id: 'width',
				title: 'width',
				code: true,
			},
			{
				id: 'inputAttributes',
				title: '...inputAttributes',
				code: true,
			},
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{
				id: 'onChange',
				title: 'onChange',
				code: true,
			},
			{
				id: 'onChangeEnd',
				title: 'onChangeEnd',
				code: true,
			},
			{
				id: 'nativeEvents',
				title: '...inputEvents',
				code: true,
			},
		],
	},
];
export default SliderDoc;

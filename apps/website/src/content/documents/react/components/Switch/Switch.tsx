import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import {
	SwitchDisabledExample,
	SwitchShapeExample,
	SwitchUncontrolledExample,
	SwitchUsageExample,
} from './UsagePreviews';
import { example1Code, example2Code, motionCode, shapeCode, uncontrolledCode, usageCode } from './code';

export function SwitchDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Switch component</H1>
			<P clipWidth>
				Make a setting easy to turn on or off. Switch pairs a compact track with a moving knob and a typed change
				payload.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Use <Code>checked</Code> and <Code>onChange</Code> to control a setting, or pass <Code>defaultChecked</Code>
				when the switch should manage its own state. Give it an accessible label with <Code>name</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-switch--default"
				components={[
					{
						label: 'Basic usage',
						component: <SwitchUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'SwitchExample.tsx',
					},
				]}
			/>
			<H3>Pass a typed value</H3>
			<P>
				<Code>value</Code> carries optional metadata into <Code>onChange</Code>. The second argument is the new on/off
				state.
			</P>
			<CodeBlock filename="SwitchExample1.tsx" language="tsx" code={example1Code.trim()} />
			<H3>Start on</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-switch--default"
				components={[
					{
						label: 'Start on',
						component: <SwitchUncontrolledExample />,
						code: uncontrolledCode.trim(),
						codeFilename: 'SwitchUncontrolled.tsx',
					},
				]}
			/>
			<H3>Disable a setting</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-switch--default"
				components={[
					{
						label: 'Disable a setting',
						component: <SwitchDisabledExample />,
						code: example2Code.trim(),
						codeFilename: 'SwitchExample2.tsx',
					},
				]}
			/>
			<H3>Customize the knob and track</H3>
			<P>
				Match <Code>knobWidth</Code> to the knob’s height and use <Code>knobRadius="50%"</Code> for a circular head.
				This example uses a 30px head and a 60px-wide track. A 34px <Code>height</Code> leaves 2px padding above and
				below.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-switch--default"
				components={[
					{
						label: 'Customize the knob and track',
						component: <SwitchShapeExample />,
						code: shapeCode.trim(),
						codeFilename: 'SwitchShape.tsx',
					},
				]}
			/>
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				With <Code>checked</Code>, your application controls the switch. Without it, the switch manages its own state;
				<Code>defaultChecked</Code> sets the starting value only.
			</P>
			<P>
				Switch is a native button, not a form input. <Code>value</Code> is callback metadata and is not submitted with a
				form. Use application state or a hidden input when submitting a setting.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The button uses <Code>role="switch"</Code> and exposes its state through <Code>aria-checked</Code>. Use{' '}
				<Code>name</Code> to describe the setting; its trimmed value supplies <Code>aria-label</Code>. Omitted or blank
				names fall back to <Code>Switch</Code>.
			</P>
			<P>
				Enter and Space toggle the setting. Keyboard focus has a visible inset indicator. <Code>disabled</Code>
				blocks interaction and dims the control while preserving its on/off state.
			</P>
			<P>
				Reduced-motion preferences disable the knob animation and track color transition, including custom animation
				delays. Changes appear immediately, and keyboard focus is preserved when the preference changes.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColorOff'}>
				<Prop>backgroundColorOff</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>Track background when off.</P>
			<Definition id={'backgroundColorOn'}>
				<Prop>backgroundColorOn</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-positive'}</DefaultVal>
			</Definition>
			<P>Track background when on.</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--corner-round)'}</DefaultVal>
			</Definition>
			<P>Outer track corner radius. Numbers are pixels; strings accept CSS radius values. Use 0 for square corners.</P>
			<Definition id={'checked'}>
				<Prop>checked</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Controlled on/off state. Update it through <Code>onChange</Code>.
			</P>
			<Definition id={'defaultChecked'}>
				<Prop>defaultChecked</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Initial on/off state when <Code>checked</Code> is omitted. Later changes do not reset the switch.
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Inherited native button attribute. Blocks pointer and keyboard activation.</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'22'}</DefaultVal>
			</Definition>
			<P>
				Track <Code>height</Code> in pixels. Invalid or nonpositive values fall back to 22; the minimum is 1px.
			</P>
			<Definition id={'knobColor'}>
				<Prop>knobColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary'}</DefaultVal>
			</Definition>
			<P>Knob background color.</P>
			<Definition id={'knobRadius'}>
				<Prop>knobRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--corner-round)'}</DefaultVal>
			</Definition>
			<P>
				Knob corner radius, independent of the track. Numbers are pixels; strings accept CSS radius values. The default
				keeps circles and pills fully rounded.
			</P>
			<Definition id={'knobWidth'}>
				<Prop>knobWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'26'}</DefaultVal>
			</Definition>
			<P>
				Knob width in pixels. Defaults to a pill shape. Width is clamped to the available track space. Invalid or
				nonpositive values use the default.
			</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Button name and accessible label. Whitespace is trimmed for <Code>aria-label</Code>; omitted or blank names use{' '}
				<Code>Switch</Code>.
			</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Inset between knob and track edges in pixels. When omitted, uses spacing-xxs. Padding is clamped to keep at
				least a 1px knob. Knob height is <Code>height</Code> minus twice this inset.
			</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'T'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Optional payload of type T. Returned unchanged as the first <Code>onChange</Code> argument. T defaults to
				string.
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'48'}</DefaultVal>
			</Definition>
			<P>
				Track <Code>width</Code> in pixels. Invalid or nonpositive values fall back to 48; width is at least the track
				height.
			</P>
			<Definition id={'buttonAttributes'}>
				<Prop>...buttonAttributes</Prop>
				<TypeDef>{'React.ButtonHTMLAttributes<HTMLButtonElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other native button attributes apply to the root. Role and ARIA attributes are managed internally. className is
				appended; style is merged. Component layout and color styles take priority over overlapping style fields.
				Children are not supported; the internal knob is retained. The default button type is button.
			</P>
			<H2 id={'motion'}>Motion</H2>
			<P>
				<Code>transition</Code> configures knob movement and color changes with Slice’s{' '}
				<Code openURL="/docs/react/motion/">Water</Code> motion as the default.
			</P>
			<CodeBlock filename="SwitchMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Settings are merged with Slice’s <Code>Water</Code> transition and applied to both the knob and track.
			</P>
			<H2 id={'events'}>Events</H2>

			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: T | undefined, checked: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				Runs after activation with the original typed payload and new on/off state. Changes to the <Code>checked</Code>{' '}
				prop do not emit it.
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...buttonEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Standard button events pass through. <Code>onClick</Code> runs before toggling; call{' '}
				<Code>event.preventDefault()</Code> to cancel the change. <Code>onChange</Code> above is the component callback,
				not a native change event.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Switch component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColorOff', title: 'backgroundColorOff', code: true },
			{ id: 'backgroundColorOn', title: 'backgroundColorOn', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'checked', title: 'checked', code: true },
			{ id: 'defaultChecked', title: 'defaultChecked', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'knobColor', title: 'knobColor', code: true },
			{ id: 'knobRadius', title: 'knobRadius', code: true },
			{ id: 'knobWidth', title: 'knobWidth', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'buttonAttributes', title: '...buttonAttributes', code: true },
		],
	},
	{ id: 'motion', title: 'Motion', items: [{ id: 'transition', title: 'transition', code: true }] },
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'nativeEvents', title: '...buttonEvents', code: true },
		],
	},
];

export default SwitchDoc;

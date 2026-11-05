import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { RadioButtonPreview } from './RadioButtonPreview';
import { exampleCode, typedCode, usageCode } from './code';
export function RadioButtonDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>RadioButton component</H1>
			<P clipWidth>
				Make one choice from a set with a clear selection icon and a label. Customize its colors, spacing, and text for
				compact options or longer descriptions.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-radiobutton--default"
				components={[
					{ label: 'Default', component: <RadioButtonPreview /> },
					{ label: 'Framed choices', component: <RadioButtonPreview variant="framed" /> },
					{ label: 'Multiline', component: <RadioButtonPreview variant="multiline" /> },
					{ label: 'Disabled', component: <RadioButtonPreview variant="disabled" /> },
				]}
			/>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Give related options the same <Code>name</Code> so choosing one clears the others.
			</P>
			<CodeBlock filename="RadioButtonExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Control selection</H3>
			<P>
				Use <Code>checked</Code> and <Code>onChange</Code> to keep the group’s value in application state.
			</P>
			<CodeBlock filename="RadioButtonSelection.tsx" language="tsx" code={exampleCode.trim()} />
			<H3>Pass typed metadata</H3>
			<P>
				<Code>value</Code> can carry an object to <Code>onChange</Code>. Set <Code>formValue</Code> when the form should
				submit a string representation of that object.
			</P>
			<CodeBlock filename="RadioButtonValue.tsx" language="tsx" code={typedCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Inside <Code openURL="/docs/react/radio-button-list/">RadioButtonList</Code>, the group owns selection, input
				naming, and group-disabled state. Give each choice a unique non-null value; child styling can override the group
				defaults.
			</P>
			<P>
				A checked radio stays checked when activated again. Use <Code>name</Code> to group choices; radios without a
				shared name are independent. For choices that can be toggled on and off independently, use{' '}
				<Code openURL="/docs/react/check-box/">CheckBox</Code>.
			</P>
			<P>
				<Code>label</Code> takes priority over <Code>children</Code>. Use <Code>align</Code>=top for multiline content
				and <Code>textTopOffset</Code> for manual adjustment. Frames use regular border, padding, and background props.
			</P>
			<P>
				Native form submission includes the checked option’s <Code>formValue</Code> or primitive <Code>value</Code>.
				Uncontrolled radios follow native form reset. Controlled groups should keep form reset and application state in
				sync.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The underlying input is a native radio. Its visible label names the choice and activates it when clicked. Use{' '}
				<Code>actionName</Code> for an alternate description or icon-only use; unnamed inputs fall back to “Option”.
				Icons are decorative and never add another tab stop.
			</P>
			<P>
				Use a shared <Code>name</Code> for a group: Tab enters the group, Space selects, and arrow keys move and select
				between enabled choices. Enter retains the browser’s form behavior. Group options under a fieldset and legend,
				or an appropriately named group. A visible focus ring follows keyboard focus. Disabled choices cannot be
				activated and are skipped during keyboard navigation.
			</P>
			<P>
				<Code>required</Code> participates in native form validation. Reduced-motion preferences disable the icon color
				and background transitions; selection and focus still update immediately.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'actionName'}>
				<Prop>actionName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Optional action description in place of the visible content.'}</P>
			<Definition id={'align'}>
				<Prop>align</Prop>
				<TypeDef>{"'top' | 'middle' | 'bottom'"}</TypeDef>
				<DefaultVal>{'middle'}</DefaultVal>
			</Definition>
			<P>
				{'Aligns the icon with the content. Use top for a multiline '}
				<Code>label</Code>
				{'.'}
			</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>{'Unselected background.'}</P>
			<Definition id={'backgroundColorSelected'}>
				<Prop>backgroundColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>{'Checked background.'}</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Border color.'}</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Corner radius; numbers are pixels.'}</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Border width in pixels. Negative or nonfinite numbers become zero.'}</P>
			<Definition id={'checked'}>
				<Prop>checked</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Standalone controlled selection. Inside RadioButtonList, use the group value instead. Update this from '}
				<Code>onChange</Code>
				{'; activation does not mutate the supplied '}
				<Code>value</Code>
				{'.'}
			</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Content used when '}
				<Code>label</Code>
				{' is absent. Keep nested content noninteractive.'}
			</P>
			<Definition id={'defaultChecked'}>
				<Prop>defaultChecked</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Initial selection for an uncontrolled radio. Use '}
				<Code>checked</Code>
				{' for external control.'}
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Blocks interaction and dims the whole control.'}</P>
			<Definition id={'fieldName'}>
				<Prop>fieldName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Option identifier included in callback metadata. Native '}
				<Code>name</Code>
				{' instead identifies the radio group and '}
				<Code>form</Code>
				{' field.'}
			</P>
			<Definition id={'formValue'}>
				<Prop>formValue</Prop>
				<TypeDef>{'string | number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Explicit '}
				<Code>form</Code>
				{' submission '}
				<Code>value</Code>
				{'. Falls back to '}
				<Code>value</Code>
				{' when '}
				<Code>value</Code>
				{' is a string or number; otherwise the native '}
				<Code>value</Code>
				{' is on.'}
			</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>
				{'Pixel '}
				<Code>gap</Code>
				{
					' between icon and content. Zero is supported; negative values become zero and nonfinite values fall back to 6px.'
				}
			</P>
			<Definition id={'iconChecked'}>
				<Prop>iconChecked</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'check circle'}</DefaultVal>
			</Definition>
			<P>
				{'Icon while '}
				<Code>checked</Code>
				{'.'}
			</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Unselected icon color.'}</P>
			<Definition id={'iconColorSelected'}>
				<Prop>iconColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'undefined (iconColor)'}</DefaultVal>
			</Definition>
			<P>
				{'Checked icon color. Falls back to '}
				<Code>iconColor</Code>
				{'.'}
			</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>
				{'Icon size in pixels. Zero removes the icon and its '}
				<Code>gap</Code>
				{'. Negative or nonfinite values fall back to 20px.'}
			</P>
			<Definition id={'iconUnChecked'}>
				<Prop>iconUnChecked</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'circle'}</DefaultVal>
			</Definition>
			<P>{'Icon while unchecked.'}</P>
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
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				{'Uniform surface '}
				<Code>padding</Code>
				{'. Numbers are pixels; strings accept CSS shorthand.'}
			</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Content color.'}</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Content size.'}</P>
			<Definition id={'textTopOffset'}>
				<Prop>textTopOffset</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				{'Manual content alignment in pixels. Positive values add top '}
				<Code>padding</Code>
				{'; negative values add bottom '}
				<Code>padding</Code>
				{' to raise the text. Does not move the icon.'}
			</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'T'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Typed callback metadata, with T defaulting to string. String and number values also supply the native '}
				<Code>form</Code> <Code>value</Code>
				{' unless '}
				<Code>formValue</Code>
				{' is provided.'}
			</P>
			<Definition id={'inputAttributes'}>
				<Prop>...inputAttributes</Prop>
				<TypeDef>{'React.InputHTMLAttributes<HTMLInputElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native input attributes such as '}
				<Code>name</Code>
				{', id, '}
				<Code>form</Code>
				{', '}
				<Code>required</Code>
				{', tabIndex, and data attributes apply to the radio input. '}
				<Code>name</Code>
				{' groups choices and identifies the submitted field. className and style apply to the outer '}
				<Code>label</Code>
				{'; component CSS variables take priority. The input type is always radio.'}
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(option: RadioButtonOption<T>, checked: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs when this option becomes '}
				<Code>checked</Code>
				{'. The option contains '}
				<Code>fieldName</Code>
				{', '}
				<Code>label</Code>
				{', and '}
				<Code>value</Code>
				{'. Selecting another option does not emit false for the previously '}
				<Code>checked</Code>
				{' input; controlled groups should update all '}
				<Code>checked</Code>
				{' props together.'}
			</P>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'React.MouseEventHandler<HTMLInputElement>'}</TypeDef>
			</Definition>
			<P>
				{'Native input click, including label-forwarded clicks. Calling '}
				<Code>event.preventDefault()</Code>
				{' cancels selection and the component change callback.'}
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...inputEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLInputElement>'}</TypeDef>
			</Definition>
			<P>
				{'Other native input handlers pass through. Keyboard and '}
				<Code>form</Code>
				{' behavior remain native; there are no drag or animation lifecycle callbacks.'}
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'RadioButton component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'actionName', title: 'actionName', code: true },
			{ id: 'align', title: 'align', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorSelected', title: 'backgroundColorSelected', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'checked', title: 'checked', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'defaultChecked', title: 'defaultChecked', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'fieldName', title: 'fieldName', code: true },
			{ id: 'formValue', title: 'formValue', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'iconChecked', title: 'iconChecked', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'iconUnChecked', title: 'iconUnChecked', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'textTopOffset', title: 'textTopOffset', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'inputAttributes', title: '...inputAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'nativeEvents', title: '...inputEvents', code: true },
		],
	},
];
export default RadioButtonDoc;

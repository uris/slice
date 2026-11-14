import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	RadioButtonListCustomExample,
	RadioButtonListDisabledExample,
	RadioButtonListUsageExample,
} from './UsagePreviews';
import { customCode, disabledCode, exampleCode, optionsCode, usageCode } from './code';
export function RadioButtonListDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>RadioButtonList component</H1>
			<P clipWidth>
				Compose related choices when someone needs to pick one. Use your own labels, content, and layout, with shared
				selection and styling defaults.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Place <Code openURL="/docs/react/radio-button/">RadioButton</Code> choices inside the list. Each choice’s{' '}
				<Code>value</Code> identifies it; <Code>defaultValue</Code> sets the initial selection.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-radiobuttonlist--default"
				components={[
					{
						label: 'Basic usage',
						component: <RadioButtonListUsageExample />,
						code: { code: usageCode.trim(), filename: 'RadioButtonListExample.tsx' },
					},
				]}
			/>
			<H3>Use options</H3>
			<P>
				<Code>options</Code> creates the same radio choices from data. It shares the composed group’s selection and
				styling behavior.
			</P>
			<CodeBlock filename="RadioButtonListOptions.tsx" language="tsx" code={optionsCode.trim()} />
			<H3>Control selection</H3>
			<P>
				Use <Code>value</Code> and <Code>onChange</Code> to keep selection in application state. Set the controlled
				value to null to clear it.
			</P>
			<CodeBlock filename="RadioButtonListSelection.tsx" language="tsx" code={exampleCode.trim()} />
			<H3>Compose custom content</H3>
			<P>
				Children can include layout wrappers or custom components. Group styles provide defaults; individual RadioButton
				props override them.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-radiobuttonlist--default"
				components={[
					{
						label: 'Compose custom content',
						component: <RadioButtonListCustomExample />,
						code: { code: customCode.trim(), filename: 'RadioButtonListCustom.tsx' },
					},
				]}
			/>
			<H3>Disable the group</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-radiobuttonlist--default"
				components={[
					{
						label: 'Disabled choices',
						component: <RadioButtonListDisabledExample />,
						code: { code: disabledCode.trim() },
					},
				]}
			/>
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				The group owns one selected value and the shared input name. Children inherit its selection and disabled state;
				set <Code>checked</Code> or <Code>defaultChecked</Code> only when using RadioButton outside a list.
			</P>
			<P>
				Values identify choices rather than positions, so reordering children keeps the same choice selected. Each value
				must be unique and non-null. Use stable primitive values for most groups. A disabled child stays disabled, and a
				disabled group blocks every child.
			</P>
			<P>
				When both are supplied, <Code>children</Code> takes priority over <Code>options</Code>. Use{' '}
				<Code openURL="/docs/react/check-box/">CheckBox</Code> for independent or multiple choices.
			</P>
			<P>
				Set <Code>name</Code> for native form submission. An uncontrolled group resets to its initial{' '}
				<Code>defaultValue</Code>; controlled forms should reset application state. Object values remain callback
				metadata—use child <Code>formValue</Code> for a serialized form value.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The list is a radiogroup with native radio inputs. <Code>label</Code> names the group, or provide aria-label
				when a visible heading is not needed. Each radio’s label names and activates its input. Icons are decorative.
			</P>
			<P>
				Tab enters the group, Space selects, and arrow keys move between enabled choices. Keyboard focus is visible.
				Native input props such as required belong on the child radios. Reduced-motion preferences disable color
				transitions without delaying selection.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>
				All group props are optional. Each choice needs a value. Color props accept Slice theme tokens or CSS colors.
				Icon, text, border, background, and padding props provide defaults for child radios; explicit child props take
				priority.
			</P>
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
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Composed RadioButton choices, optionally inside wrappers or custom components. Each grouped radio needs a unique, non-null value. Children take priority over options when supplied.'
				}
			</P>
			<Definition id={'defaultValue'}>
				<Prop>defaultValue</Prop>
				<TypeDef>{'T | null'}</TypeDef>
				<DefaultVal>{'null'}</DefaultVal>
			</Definition>
			<P>{'Initial local selection. Later changes do not reset it. Use value for external control.'}</P>
			<Definition id={'direction'}>
				<Prop>direction</Prop>
				<TypeDef>{"'row' | 'column'"}</TypeDef>
				<DefaultVal>{'column'}</DefaultVal>
			</Definition>
			<P>{'Layout direction, independent of borders or frames.'}</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Disables all descendant choices. A child cannot override a disabled group.'}</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'16'}</DefaultVal>
			</Definition>
			<P>
				{
					'Pixel spacing between direct group children and the optional heading. Custom layout wrappers control spacing inside themselves.'
				}
			</P>
			<Definition id={'iconChecked'}>
				<Prop>iconChecked</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'system.check-circle'}</DefaultVal>
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
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'system.circle'}</DefaultVal>
			</Definition>
			<P>{'Icon while unchecked.'}</P>
			<Definition id={'itemGap'}>
				<Prop>itemGap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>{'Default pixel gap between each radio’s icon and text. A child gap prop overrides it.'}</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Visible heading and accessible group name.'}</P>
			<Definition id={'marginBottom'}>
				<Prop>marginBottom</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Space below the group. Numbers are pixels; strings accept CSS lengths.'}</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'generated unique name'}</DefaultVal>
			</Definition>
			<P>
				{
					'Shared native radio group and form field name. The group supplies it to every descendant radio. Use distinct names for independent groups.'
				}
			</P>
			<Definition id={'options'}>
				<Prop>options</Prop>
				<TypeDef>{'RadioButtonListOption<T>[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>
				{
					'Data shorthand for composed choices. Each option accepts RadioButton props with a required value, excluding checked, defaultChecked, and name. Rendered through the same group context as explicit children.'
				}
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
				<TypeDef>{'T | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Controlled selection; null clears it. Choices match using Object.is. Prefer unique primitive values; keep object references stable. A value without a matching choice leaves no input checked.'
				}
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'min-content'}</DefaultVal>
			</Definition>
			<P>{'Group width; numbers are pixels and strings accept CSS dimensions.'}</P>
			<Definition id={'wrap'}>
				<Prop>wrap</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Allows direct children to wrap. Most useful with direction=row and a constrained width.'}</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other native attributes apply to the outer group. className is appended and style is merged; component CSS
				variables take priority over overlapping variable fields. The role stays radiogroup.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: T, option: RadioButtonOption<T>) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Requests a newly selected value. The second argument contains fieldName, label, and value metadata. Runs after the child’s onChange. Repeat activation, prop changes, and form reset do not emit another change.'
				}
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Other native handlers apply to the outer group. Keyboard selection remains native to the radio inputs; there are no drag or animation lifecycle callbacks.'
				}
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'RadioButtonList component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'align', title: 'align', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorSelected', title: 'backgroundColorSelected', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'defaultValue', title: 'defaultValue', code: true },
			{ id: 'direction', title: 'direction', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'iconChecked', title: 'iconChecked', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'iconUnChecked', title: 'iconUnChecked', code: true },
			{ id: 'itemGap', title: 'itemGap', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'marginBottom', title: 'marginBottom', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'options', title: 'options', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'textTopOffset', title: 'textTopOffset', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'wrap', title: 'wrap', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default RadioButtonListDoc;

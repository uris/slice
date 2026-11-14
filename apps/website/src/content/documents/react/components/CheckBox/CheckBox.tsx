import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {} from './CheckBoxPreview';
import {
	CheckBoxCustomExample,
	CheckBoxDisabledExample,
	CheckBoxMixedExample,
	CheckBoxMultilineExample,
	CheckBoxUsageExample,
} from './UsagePreviews';
import { customCode, disabledCode, mixedCode, multilineCode, usageCode } from './code';

export function CheckBoxDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>CheckBox component</H1>
			<P clipWidth>
				Let people choose an option or show a partially selected group. CheckBox pairs a state icon with text you can
				tailor to your interface.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Set <Code>label</Code> for the text beside the icon and handle <Code>onChange</Code> to update your application.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-checkbox--default"
				components={[
					{
						label: 'Basic usage',
						component: <CheckBoxUsageExample />,
						code: { code: usageCode.trim(), filename: 'CheckBoxExample.tsx' },
					},
				]}
			/>
			<H3>Show a mixed selection</H3>
			<P>
				Use <Code>checked="mixed"</Code> for a partially selected group. setAllSelected is your application handler.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-checkbox--default"
				components={[
					{
						label: 'Show a mixed selection',
						component: <CheckBoxMixedExample />,
						code: { code: mixedCode.trim(), filename: 'MixedCheckBox.tsx' },
					},
				]}
			/>
			<H3>Adjust icons and text</H3>
			<P>
				Choose an icon for each state. <Code>iconSize</Code> and <Code>textSize</Code> size them independently;{' '}
				<Code>gap</Code> sets the space between them.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-checkbox--default"
				components={[
					{
						label: 'Adjust icons and text',
						component: <CheckBoxCustomExample />,
						code: { code: customCode.trim(), filename: 'CustomCheckBox.tsx' },
					},
				]}
			/>
			<H3>Align a multiline label</H3>
			<P>
				Constrain the width to wrap a long label. Use <Code>align="top"</Code> to keep the icon beside the first line,
				or <Code>align="bottom"</Code> for the last line. The default is <Code>middle</Code>. Line breaks in label text
				are preserved. Use <Code>textTopOffset</Code> for a small manual adjustment: positive moves text down, negative
				moves it up.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-checkbox--default"
				components={[
					{
						label: 'Align a multiline label',
						component: <CheckBoxMultilineExample />,
						code: { code: multilineCode.trim(), filename: 'TermsCheckBox.tsx' },
					},
				]}
			/>
			<H3>Disable an option</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-checkbox--default"
				components={[
					{
						label: 'Disable an option',
						component: <CheckBoxDisabledExample />,
						code: { code: disabledCode.trim(), filename: 'DisabledCheckBox.tsx' },
					},
				]}
			/>
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				The checkbox keeps local state and synchronizes when <Code>checked</Code> changes. Activating a mixed checkbox
				checks it; <Code>onChange</Code> always returns a boolean.
			</P>
			<P>
				<Code>label</Code> replaces <Code>children</Code> when supplied. Omit it to use custom text content.
			</P>
			<P>This is a div-based control. It does not submit a native form value or provide required-field validation.</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The root has <Code>role="checkbox"</Code>, <Code>aria-checked</Code>, and <Code>aria-disabled</Code>. Enter and
				Space toggle it, with a visible keyboard focus indicator. Disabled checkboxes leave the tab order.
			</P>
			<P>
				<Code>label</Code> supplies the default accessible name. Otherwise, the name comes from the rendered children.
				Override it with <Code>aria-label</Code> or <Code>aria-labelledby</Code>; provide one when there is no visible
				text. Icons are decorative and do not add tab stops.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>
				All props are optional. Color props accept Slice theme tokens or CSS colors. Explicit color overrides also apply
				when disabled.
			</P>
			<Definition id={'align'}>
				<Prop>align</Prop>
				<TypeDef>{"'top' | 'middle' | 'bottom'"}</TypeDef>
				<DefaultVal>middle</DefaultVal>
			</Definition>
			<P>Aligns the icon vertically with the text block. Useful when the label wraps to multiple lines.</P>
			<Definition id={'checked'}>
				<Prop>checked</Prop>
				<TypeDef>{"'mixed' | boolean"}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Checked value, synchronized when the prop changes. mixed represents a partial selection.</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Content beside the icon when label is not supplied. Rich text and numeric content are supported.</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Blocks toggling and removes the checkbox from the keyboard tab order.</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>Space between the icon and text in pixels.</P>
			<Definition id={'iconChecked'}>
				<Prop>iconChecked</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'system.checkbox-checked'}</DefaultVal>
			</Definition>
			<P>Slice icon name for the checked state.</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Base icon color override. iconColorSelected takes priority in checked and mixed states. By default, uses
				core-icon-secondary when unchecked, core-text-special when checked, core-icon-primary when mixed, and
				core-icon-disabled when disabled.
			</P>
			<Definition id={'iconColorSelected'}>
				<Prop>iconColorSelected</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Icon color for checked and mixed states. Takes priority over iconColor while selected; omit it to retain the
				existing state colors.
			</P>
			<Definition id={'iconPartial'}>
				<Prop>iconPartial</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'system.checkbox-partial'}</DefaultVal>
			</Definition>
			<P>Slice icon name for the mixed state.</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>Icon width and height in pixels. Text size is independent.</P>
			<Definition id={'iconUnChecked'}>
				<Prop>iconUnChecked</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'system.checkbox'}</DefaultVal>
			</Definition>
			<P>Slice icon name for the unchecked state.</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Text beside the icon and its default accessible name. Takes precedence over children when supplied, including an
				empty string.
			</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Text color override. Defaults to core-text-primary, or core-text-disabled when disabled.</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>Theme typography size for label or children.</P>
			<Definition id={'textTopOffset'}>
				<Prop>textTopOffset</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>0</DefaultVal>
			</Definition>
			<P>
				Manual text adjustment in pixels. Positive values add top padding and move text down; negative values add bottom
				padding and move text up. Works with all align values. Zero leaves the normal alignment unchanged.
			</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other attributes apply to the root div. className is appended and style is merged; component variables take
				priority. aria-label and aria-labelledby can override the accessible name. The component maintains its checkbox
				role, checked state, and disabled state.
			</P>

			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(state: boolean) => void'}</TypeDef>
			</Definition>
			<P>Runs after activation with the new checked value. Disabled controls and prop updates do not emit it.</P>
			<Definition id={'divEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Standard div events pass through. <Code>onClick</Code> and <Code>onKeyDown</Code> run before built-in toggling;
				call <Code>event.preventDefault()</Code> to cancel it. <Code>onChange</Code> above is the component callback.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'CheckBox component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'align', title: 'align', code: true },
			{ id: 'checked', title: 'checked', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'iconChecked', title: 'iconChecked', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconPartial', title: 'iconPartial', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'iconUnChecked', title: 'iconUnChecked', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'textTopOffset', title: 'textTopOffset', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'divEvents', title: '...divEvents', code: true },
		],
	},
];

export default CheckBoxDoc;

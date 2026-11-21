import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { PillButtonBarExample } from './UsagePreview';
import { iconsCode, usageCode } from './code';

const appearance = [
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		initial: "tintFromColor('core-surface-secondary', -2)",
		text: 'Track fill.',
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		initial: "tintFromColor('core-surface-secondary', -4)",
		text: 'Track outline color.',
	},
	{ name: 'borderRadius', type: 'number | string', initial: 'var(--corner-l)', text: 'Track corner radius.' },
	{ name: 'borderWidth', type: 'number | string', initial: '1', text: 'Track outline width.' },
	{ name: 'elevation', type: 'ElevationLevel', initial: '0', text: 'Track shadow.' },
	{ name: 'height', type: 'number | string', initial: 'auto', text: 'Overall bar height.' },
	{ name: 'iconSize', type: 'number', initial: '18', text: 'Default tab icon size.' },
	{
		name: 'padding',
		type: 'number | string',
		initial: '1px 8px',
		text: 'Vertical and horizontal padding inside each tab.',
	},
	{ name: 'pillBackgroundColor', type: 'ColorValue', initial: 'core-surface-primary', text: 'Selected pill fill.' },
	{
		name: 'pillBorderColor',
		type: 'ColorValue',
		initial: 'core-outline-primary',
		text: 'Selected pill outline color.',
	},
	{
		name: 'pillBorderRadius',
		type: 'number | string',
		initial: 'var(--corner-m)',
		text: 'Selected pill corner radius.',
	},
	{ name: 'pillBorderWidth', type: 'number | string', initial: '0', text: 'Selected pill outline width.' },
	{ name: 'pillElevation', type: 'ElevationLevel', initial: '1', text: 'Selected pill shadow.' },
	{
		name: 'pillInset',
		type: 'number | string',
		initial: '4',
		text: 'Space between the inner edge of the track and the tabs.',
	},
	{ name: 'tabGap', type: 'number', initial: '4', text: 'Space between neighboring tabs.' },
	{ name: 'textColor', type: 'ColorValue', initial: 'core-text-secondary', text: 'Unselected label color.' },
	{ name: 'textColorSelected', type: 'ColorValue', initial: 'core-text-primary', text: 'Selected label color.' },
	{ name: 'textSize', type: "'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'", initial: 'l', text: 'Tab label text size.' },
];

export default function PillButtonBarDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PillButtonBar component</H1>
			<P clipWidth>
				Switch between related views using a rounded track and a pill that slides behind the selected tab.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Compose <Code openURL="/docs/react/tab/">Tab</Code> children or pass <Code>options</Code>. Use{' '}
				<Code>value</Code> and <Code>onChange</Code> to control selection, or <Code>defaultValue</Code> to set the
				initial tab.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-pillbuttonbar--default"
				components={[
					{
						label: 'Activity range',
						component: <PillButtonBarExample />,
						code: { code: usageCode.trim(), filename: 'ActivityRange.tsx' },
					},
				]}
			/>
			<H3>Add icons</H3>
			<P>
				Set <Code>icon</Code> on each <Code>Tab</Code> to show an icon beside its label.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-pillbuttonbar--default"
				components={[
					{
						label: 'Activity range with icons',
						component: <PillButtonBarExample showIcons />,
						code: { code: iconsCode.trim(), filename: 'ActivityRangeIcons.tsx' },
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				The track fits the combined width of its tabs and spacing. The pill follows selection and resizes with the tab.
				With reduced motion enabled, it moves immediately.
			</P>
			<P>
				The bar fits the height of its options by default. Use <Code>padding</Code> to adjust the space inside the tabs
				and <Code>pillInset</Code> to adjust the space around the pill. Set <Code>height</Code> to give the bar a fixed
				height.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Set <Code>tabBarName</Code> to name the group. Connect each tab to its panel using <Code>id</Code> and{' '}
				<Code>panelId</Code>. Left and Right Arrow move focus and select the next enabled tab. Home and End select the
				first and last enabled tabs.
			</P>
			<H2 id="props">Props</H2>
			<P>
				Numbers for dimensions use pixels. See <Code openURL="/docs/react/tab-bar/">TabBar</Code> for shared selection,
				tab content, and layout props.
			</P>
			{appearance.map(({ name, type, initial, text }) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Prop>{name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{initial}</DefaultVal>
					</Definition>
					<P>{text}</P>
				</Fragment>
			))}
			<H2 id="events">Events</H2>
			<Definition id="onChange">
				<Method>onChange</Method>
				<TypeDef>{'(value: T, option: TabOption<T>) => void'}</TypeDef>
			</Definition>
			<P>Runs when the user selects a different enabled tab.</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'PillButtonBar component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{ id: 'props', title: 'Props', items: appearance.map(({ name }) => ({ id: name, title: name, code: true })) },
	{ id: 'events', title: 'Events', items: [{ id: 'onChange', title: 'onChange', code: true }] },
];

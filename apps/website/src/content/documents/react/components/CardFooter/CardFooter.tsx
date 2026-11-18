import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { type CardDocProp, CardEventsReference, CardPropsReference, cardTrackedItems } from '../Card/Reference';
import { FooterCardPreview } from '../Card/UsagePreviews';
import { footerCode, horizontalFooterCode } from '../Card/code';

const props: CardDocProp[] = [
	{
		name: 'actionButtons',
		type: 'ButtonProps[]',
		defaultValue: 'undefined',
		description: (
			<>
				{'Button descriptors. Supply stable '}
				<Code>id</Code>
				{' values when buttons can move or change; omitted IDs use their array positions.'}
			</>
		),
	},
	{
		name: 'align',
		type: "'start' | 'center' | 'end'",
		defaultValue: 'start',
		description: (
			<>
				{
					'Main-axis alignment for the action group. With a horizontal stack, controls move left, center, or right when space remains.'
				}
			</>
		),
	},
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: '30% black tint of core-surface-secondary (dark); core-surface-primary-tint (light)',
		description: <>{'Footer fill, separate from the Card surface. Accepts a Slice token or CSS color.'}</>,
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'core-outline-primary',
		description: <>{'Top separator color.'}</>,
	},
	{
		name: 'borderWidth',
		type: 'number | string',
		defaultValue: '1',
		description: (
			<>
				{'Top separator width. Numbers are pixels; use '}
				<Code>0</Code>
				{' to remove it.'}
			</>
		),
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: <>{'Custom footer content. Replaces the generated action buttons.'}</>,
	},
	{
		name: 'layout',
		type: "'fill' | 'fit'",
		defaultValue: 'fill',
		description: (
			<>
				{'Default width for generated buttons. '}
				<Code>fill</Code>
				{' shares available width; '}
				<Code>fit</Code>
				{' follows content. An individual button’s '}
				<Code>width</Code>
				{' overrides this default.'}
			</>
		),
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: 'inherited Card.padding',
		description: (
			<>
				{'Section padding. Inherits '}
				<Code>Card.padding</Code>
				{' by default; explicit values, including '}
				<Code>0</Code>
				{', take precedence. Numbers are pixels; strings accept CSS padding shorthands.'}
			</>
		),
	},
	{
		name: 'stack',
		type: "'vertical' | 'horizontal'",
		defaultValue: 'vertical',
		description: (
			<>
				{
					'Generated action-button direction. Vertical stacks place buttons in a column; horizontal stacks place them in a row.'
				}
			</>
		),
	},
];

export default function CardFooterDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">CardFooter component</H1>
			<P clipWidth>Finish a card with action buttons or custom content on a separate surface.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>CardFooter</Code> inside <Code openURL="/docs/react/card/">Card</Code> with the other sections shown
				below.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--default"
				components={[
					{
						label: 'Stacked actions',
						component: <FooterCardPreview />,
						code: { code: footerCode.trim(), filename: 'CardFooterExample.tsx' },
					},
				]}
			/>
			<H3>Horizontal actions</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--no-image"
				components={[
					{
						label: 'Horizontal actions',
						component: <FooterCardPreview horizontal />,
						code: { code: horizontalFooterCode.trim(), filename: 'CardFooterExample.tsx' },
					},
				]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				<>
					{'Custom '}
					<Code>children</Code>
					{' replace '}
					<Code>actionButtons</Code>
					{
						'. Generated buttons use the footer’s stack and width defaults unless a button supplies its own width. A button’s own '
					}
					<Code>onClick</Code>
					{' callback runs before the footer’s '}
					<Code>onAction</Code>
					{'. The footer does not infer navigation or submission from button labels.'}
				</>
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'Actions are ordinary buttons, keeping their Button keyboard behavior and disabled state. Give every action a clear label, and provide an accessible name for icon-only actions. Custom children retain their own semantics.'
				}
			</P>
			<CardPropsReference entries={props} />
			<CardEventsReference action={true} />
		</FlexBox>
	);
}

export const trackedItems = cardTrackedItems('CardFooter', props, true);

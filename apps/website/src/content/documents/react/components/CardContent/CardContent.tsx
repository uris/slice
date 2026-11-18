import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { type CardDocProp, CardEventsReference, CardPropsReference, cardTrackedItems } from '../Card/Reference';
import { ContentCardPreview } from '../Card/UsagePreviews';
import { contentCode } from '../Card/code';

const props: CardDocProp[] = [
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				{'Rich content such as fields, text, or other controls. Takes precedence over '}
				<Code>text</Code>
				{'.'}
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
				{', take precedence. Numbers are pixels; strings accept CSS padding shorthands. When directly after '}
				<Code>CardTitle</Code>
				{', inferred top padding is removed; explicit padding is preserved.'}
			</>
		),
	},
	{
		name: 'text',
		type: 'string',
		defaultValue: 'undefined',
		description: (
			<>
				{'Plain-text fallback when '}
				<Code>children</Code>
				{' is absent.'}
			</>
		),
	},
];

export default function CardContentDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">CardContent component</H1>
			<P clipWidth>Place text, form fields, or custom content inside a card with shared spacing.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>CardContent</Code> inside <Code openURL="/docs/react/card/">Card</Code> with the other sections
				shown below.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--section-spacing"
				components={[
					{
						label: 'Inherited and explicit padding',
						component: <ContentCardPreview />,
						code: { code: contentCode.trim(), filename: 'CardContentExample.tsx' },
					},
				]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				<>
					{'Custom '}
					<Code>children</Code>
					{' take precedence over '}
					<Code>text</Code>
					{'. Content can repeat, and all children remain in authored order. A content section directly after '}
					<Code>CardTitle</Code>
					{' removes its inferred top padding to avoid doubling the gap; explicit section padding, including '}
					<Code>0</Code>
					{', is preserved.'}
				</>
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'The section adds no independent role or focus behavior. Use semantic children such as paragraphs, lists, headings, and labeled fields. A custom section can use native ARIA attributes when needed.'
				}
			</P>
			<CardPropsReference entries={props} />
			<CardEventsReference action={false} />
		</FlexBox>
	);
}

export const trackedItems = cardTrackedItems('CardContent', props, false);

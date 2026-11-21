import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { type CardDocProp, CardEventsReference, CardPropsReference, cardTrackedItems } from '../Card/Reference';
import { TitleCardPreview, TitleStatusPreview } from '../Card/UsagePreviews';
import { titleCode, titleStatusCode } from '../Card/code';

const props: CardDocProp[] = [
	{
		name: 'action',
		type: 'ButtonProps[] | React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				Content beside the title. Pass an array of <Code>ButtonProps</Code> to generate buttons or a React node to
				render custom content. Generated buttons default to the <Code>text</Code> variant, automatic height, and zero
				padding. Supplied button props override these defaults.
			</>
		),
	},
	{
		name: 'caption',
		type: 'string',
		defaultValue: 'undefined',
		description: <>{'Small uppercase caption above the title.'}</>,
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: <>{'Custom title content. Replaces the generated caption, title, supporting text, and action.'}</>,
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
	{ name: 'text', type: 'string', defaultValue: 'undefined', description: <>{'Supporting text below the title.'}</> },
	{
		name: 'title',
		type: 'string',
		defaultValue: 'undefined',
		description: <>{'Main title text. Long titles are truncated to one line.'}</>,
	},
];

export default function CardTitleDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">CardTitle component</H1>
			<P clipWidth>Introduce a card with a caption, title, supporting text, and an optional action.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>CardTitle</Code> inside <Code openURL="/docs/react/card/">Card</Code> with the other sections shown
				below.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--no-image"
				components={[
					{
						label: 'Button descriptors',
						component: <TitleCardPreview />,
						code: { code: titleCode.trim(), filename: 'CardTitleExample.tsx' },
					},
					{
						label: 'Custom React node',
						component: <TitleStatusPreview />,
						code: { code: titleStatusCode.trim(), filename: 'ProjectStatusCard.tsx' },
					},
				]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				Custom <Code>children</Code> replace the generated title layout, including <Code>action</Code>. For generated
				buttons, each button’s <Code>onClick</Code> runs before <Code>onAction</Code>. Handle interactions for custom
				actions on the supplied nodes themselves.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				<>
					{
						'The generated title is visual text, not a semantic heading. When the surrounding page needs a heading, supply custom '
					}
					<Code>children</Code>
					{
						' with an appropriate heading element. Give icon-only action buttons an accessible name through their button props.'
					}
				</>
			</P>
			<CardPropsReference entries={props} />
			<CardEventsReference action={true} />
		</FlexBox>
	);
}

export const trackedItems = cardTrackedItems('CardTitle', props, true);

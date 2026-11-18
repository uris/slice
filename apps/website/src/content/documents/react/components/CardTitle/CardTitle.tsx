import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { type CardDocProp, CardEventsReference, CardPropsReference, cardTrackedItems } from '../Card/Reference';
import { TitleCardPreview } from '../Card/UsagePreviews';
import { titleCode } from '../Card/code';

const props: CardDocProp[] = [
	{
		name: 'actionButton',
		type: 'ButtonProps',
		defaultValue: 'undefined',
		description: (
			<>
				{
					'Optional action beside the title. Defaults to a text button with automatic height and zero padding; supplied button props override those defaults.'
				}
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
						label: 'Title with an action',
						component: <TitleCardPreview />,
						code: { code: titleCode.trim(), filename: 'CardTitleExample.tsx' },
					},
				]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				<>
					{
						'Without custom children, the section renders its caption, title, supporting text, and optional action. Custom '
					}
					<Code>children</Code>
					{' replace that generated layout. The action’s own '}
					<Code>onClick</Code>
					{' callback runs before '}
					<Code>onAction</Code>
					{'. CardTitle does not submit a form or open a help panel automatically.'}
				</>
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

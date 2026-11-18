import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { type CardDocProp, CardEventsReference, CardPropsReference, cardTrackedItems } from '../Card/Reference';
import { ImageCardPreview } from '../Card/UsagePreviews';
import { imageCode, imageOnlyCode } from '../Card/code';

const props: CardDocProp[] = [
	{
		name: 'alt',
		type: 'string',
		defaultValue: 'empty string',
		description: (
			<>{'Text alternative for the image. Describe meaningful images; use an empty string for decorative images.'}</>
		),
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'inherited Card.borderColor',
		description: <>{'Top and bottom separator color. Accepts a Slice token or a CSS color.'}</>,
	},
	{
		name: 'borderWidth',
		type: 'number | string',
		defaultValue: '1; adjusted by position',
		description: (
			<>
				{
					'Top and bottom separator width. Default top separator is removed for the first child; both default separators are removed for an image-only card. Explicit values override these defaults.'
				}
			</>
		),
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: <>{'Optional content over the image. Interactive children remain ordinary controls.'}</>,
	},
	{
		name: 'height',
		type: 'number | string',
		defaultValue: 'undefined',
		description: (
			<>
				{'Section height and minimum height. Numbers are pixels. Supply a height for an image-only section; '}
				<Code>100%</Code>
				{' requires a parent with a definite height.'}
			</>
		),
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '0',
		description: (
			<>
				{'Padding for content over the image. Does not inherit '}
				<Code>Card.padding</Code>
				{'.'}
			</>
		),
	},
	{
		name: 'src',
		type: 'string',
		defaultValue: 'undefined',
		description: (
			<>
				{'Image URL. The image fills the section using '}
				<Code>object-fit: cover</Code>
				{', cropping when needed.'}
			</>
		),
	},
];

export default function CardImageDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">CardImage component</H1>
			<P clipWidth>Add a full-width image section with optional content over it and separators between sections.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>CardImage</Code> inside <Code openURL="/docs/react/card/">Card</Code> with the other sections shown
				below.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--with-image"
				components={[
					{
						label: 'Image with content',
						component: <ImageCardPreview />,
						code: { code: imageCode.trim(), filename: 'CardImageExample.tsx' },
					},
				]}
			/>
			<H3>Image only</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--image-only"
				components={[
					{
						label: 'Image only',
						component: <ImageCardPreview only />,
						code: { code: imageOnlyCode.trim(), filename: 'CardImageExample.tsx' },
					},
				]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				<>
					{
						'The image covers the section without stretching, cropping as needed. Custom children are displayed over the image. The default top separator disappears when the section is the Card’s first child; both separators disappear when it is the only child. Explicit border widths and styles override these inferred defaults. Without '
					}
					<Code>height</Code>
					{' or content that supplies a height, the section can collapse.'}
				</>
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				<>
					{'Provide '}
					<Code>alt</Code>
					{
						' for meaningful images; leave it empty for decorative images. The image does not replace or hide the semantics of overlaid content. Ensure that text and controls placed over an image have enough contrast.'
					}
				</>
			</P>
			<CardPropsReference entries={props} />
			<CardEventsReference action={false} />
		</FlexBox>
	);
}

export const trackedItems = cardTrackedItems('CardImage', props, false);

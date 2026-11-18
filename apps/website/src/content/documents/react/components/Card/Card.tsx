import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { type CardDocProp, CardEventsReference, CardPropsReference, cardTrackedItems } from './Reference';
import { ImageCardPreview, LoginCardPreview } from './UsagePreviews';
import { imageLoginCode, imageOnlyCode, loginCode, spacingCode } from './code';

const props: CardDocProp[] = [
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'core-surface-secondary (dark); core-surface-primary (light)',
		description: <>{'Card surface color. Accepts a Slice color token or a CSS color.'}</>,
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'core-outline-primary',
		description: <>{'Outer border color and the default separator color for image sections.'}</>,
	},
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: 'var(--corner-xl)',
		description: <>{'Outer corner radius. Overflow is clipped to the rounded shape.'}</>,
	},
	{
		name: 'borderWidth',
		type: 'number | string',
		defaultValue: '1',
		description: (
			<>
				{'Outer border width. Numbers are pixels; use '}
				<Code>0</Code>
				{' to hide it.'}
			</>
		),
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				{'Card sections and custom content, rendered in authored order. Fragments and repeated sections are supported.'}
			</>
		),
	},
	{
		name: 'maxWidth',
		type: 'number | string',
		defaultValue: 'undefined',
		description: (
			<>
				{'Maximum width. Numbers are pixels; CSS strings such as '}
				<Code>100%</Code>
				{' also work. Use '}
				<Code>style.width</Code>
				{' when the card should fill its available width.'}
			</>
		),
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: 'var(--spacing-m)',
		description: (
			<>
				{
					'Shared padding for title, content, and footer sections. Image sections remain flush unless they supply their own padding.'
				}
			</>
		),
	},
];

export default function CardDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Card component</H1>
			<P clipWidth>Group related content, forms, images, and actions inside one bordered surface.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Compose <Code openURL="/docs/react/card-title/">CardTitle</Code>,{' '}
				<Code openURL="/docs/react/card-content/">CardContent</Code>,{' '}
				<Code openURL="/docs/react/card-image/">CardImage</Code>, and{' '}
				<Code openURL="/docs/react/card-footer/">CardFooter</Code>. Each section has its own page in this group.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--default"
				components={[
					{
						label: 'Login card',
						component: <LoginCardPreview />,
						code: { code: loginCode.trim(), filename: 'CardExample.tsx' },
					},
				]}
			/>
			<H3>More spacing</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--larger-spacing"
				components={[
					{
						label: 'More spacing',
						component: <LoginCardPreview padding="var(--spacing-xl)" />,
						code: { code: spacingCode.trim(), filename: 'CardExample.tsx' },
					},
				]}
			/>
			<H3>With an image</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-card--with-image"
				components={[
					{
						label: 'With an image',
						component: <LoginCardPreview withImage />,
						code: { code: imageLoginCode.trim(), filename: 'CardExample.tsx' },
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
						code: { code: imageOnlyCode.trim(), filename: 'CardExample.tsx' },
					},
				]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				<>
					{'Card preserves child order and accepts fragments, repeated sections, and custom content. '}
					<Code>Card.padding</Code>
					{
						' is inherited by title, content, and footer sections. Content directly after a title omits inferred top padding. Explicit section padding and styles take precedence. Image sections use their own padding and are flush by default. The card clips overflowing content to its corner radius.'
					}
				</>
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				<>
					{'Card is a visual div wrapper; it adds no focus or keyboard behavior. Use '}
					<Code>role</Code>
					{' and '}
					<Code>aria-label</Code>
					{
						' only when a named group is useful. Give each field a visible label, and let the controls inside the card retain their own keyboard behavior. The login preview does not authenticate or send credentials.'
					}
				</>
			</P>
			<CardPropsReference entries={props} />
			<CardEventsReference action={false} />
		</FlexBox>
	);
}

export const trackedItems = cardTrackedItems('Card', props, false);

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import { GradientCanvas } from '@/components/GradientCanvas/GradientCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { iconStylesCode } from '@/documents/react/design-system/icons/code';
import { AllIcons, PreviewSizes, trackedIconGGroupItems } from '@/documents/react/design-system/icons/previews';
import iconGrid from '@/src/assets/colors/icon-grid-trash.svg';
import { FlexBox, Preset } from '@apple-pie/slice';

export function IconsDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Icons</H1>
			<P clipWidth>
				Slice icons bring character and a sense of fun to your UI, with friendly shapes that keep actions clear and
				familiar. Built to balance personality with purpose, they help make everyday interactions feel intuitive and
				inviting.
			</P>
			<H2 id="grid-sizing">Grid & sizing</H2>
			<P>
				Slice icons are designed on a <Code>24px</Code> grid with a <Code>1.5</Code> stroke and a <Code>4px</Code> safe
				area. Components such as Button and Chip account for the artwork’s inset when calculating their default padding,
				helping icons align visually with nearby text.
			</P>
			<GradientCanvas
				caption={'24px Grid | 1.5 stroke'}
				height={400}
				imageSrc={iconGrid}
				imageDescription={'Trash icon overlaid on its construction grid and alignment guides'}
			/>
			<H3>Sizes and strokes</H3>
			<P>
				Use <Code>size</Code> to set the icon’s width and height in pixels, and <Code>stroke</Code> to control its
				outline weight. The defaults are <Code>20</Code> and <Code>1.25</Code>. Compare sizes from <Code>16px</Code>
				to <Code>64px</Code> below, and adjust the stroke to keep the icon balanced with nearby text. The SVG scales its
				strokes along with the artwork, so doubling the size also doubles the visible stroke width when{' '}
				<Code>stroke</Code> stays the same.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-icon--default"
				components={[
					{
						label: 'Sizes and stroke weights',
						component: <PreviewSizes />,
						code: undefined,
					},
				]}
			/>
			<H3>Naming convention</H3>
			<P>
				Icons are grouped by concept and use <Code>catalog.icon-name</Code> notation, such as <Code>basic.heart</Code>.
				Some have a separate filled variant, such as <Code>media.play-filled</Code>. Suffixes vary between{' '}
				<Code>-fill</Code> and <Code>-filled</Code>; copy the exact name from the catalog below.
			</P>
			<H3>Coloring</H3>
			<P>
				Set <Code>strokeColor</Code> to color the artwork: it controls outlines and solid filled shapes. It accepts
				Slice color tokens, such as <Code>core-icon-primary</Code>, or CSS colors such as hex values and{' '}
				<Code>var()</Code>. Token colors follow the active theme.
			</P>
			<CodeBlock language="tsx" filename="Icons.tsx" code={iconStylesCode.trim()} />
			<P>
				Choose <Code>media.play</Code> for an outline or <Code>media.play-filled</Code> for a solid shape. Both use{' '}
				<Code>size</Code> and <Code>strokeColor</Code>; <Code>stroke</Code> changes outlined paths, not solid filled
				geometry. The separate <Code>dualTone</Code> prop controls an optional fill layer on icons that provide one; it
				does not replace selecting a filled variant by name.
			</P>
			<H2 id="icon-catalog">Full icon catalog</H2>
			<P>
				Browse icons by category. Hover over an icon to see its name, or select it to copy the name for use with the{' '}
				<Code>name</Code> prop.
			</P>
			<AllIcons />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Icons' },
	{ id: 'grid-sizing', title: 'Grid & sizing' },
	{ id: 'icon-catalog', title: 'Full icon catalog', items: trackedIconGGroupItems() },
];
export default IconsDoc;

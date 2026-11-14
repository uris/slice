import { GradientCanvas } from '@/components/GradientCanvas/GradientCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, H1, H2, P, SpacerM } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import roundedCornersShape from '../../../../../assets/colors/corners_btn_test.svg';
import pillShape from '../../../../../assets/colors/pill-shape.svg';
import squareShape from '../../../../../assets/colors/square-shape.svg';
import { CornerTokensTable, cornerRows, pill, square } from './CornerTokensTable';

export function CornersDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Corners & Shapes</H1>
			<P clipWidth>
				Corner styles help define the character of your UI, from soft, rounded surfaces to pills and sharp edges. Use
				Slice’s corner tokens to keep buttons, fields, and containers visually consistent.
			</P>
			<H2 id="rounded-corners">Rounded corners</H2>
			<P>
				Choose from six rounded corner sizes, from <Code>corner-xs</Code> at 4px to <Code>corner-xxl</Code> at 32px. For
				nested shapes, reduce the inner radius by the gap between the edges to keep the curves concentric. Using the
				same radius on both shapes can make that gap look uneven.
			</P>
			<GradientCanvas
				caption={'Concentric rounded corners'}
				height={350}
				imageSrc={roundedCornersShape}
				imageDescription={'Concentric rounded corners with a consistent gap between inner and outer shapes'}
			/>
			<P>
				In CSS, apply a token with <Code>border-radius: var(--corner-m)</Code> within your theme scope. The table below
				lists the available rounded values.
			</P>
			<SpacerM />
			<TipBox inline noBorder>
				Select a row in any table to copy its token name and pixel value to the clipboard.
			</TipBox>
			<CornerTokensTable
				id={'rounded-corner-tokens-table'}
				name={'Rounded corner tokens'}
				tableData={cornerRows}
				caption={'Rounded corners'}
			/>
			<H2 id="pill-shape">Pill shape</H2>
			<P>
				Use <Code>corner-round</Code> for fully rounded ends. Its 1000px radius is clamped by the browser to fit the
				element: a wide button becomes a pill, while an element with equal width and height becomes a circle.
			</P>
			<GradientCanvas
				caption={'Pill shape'}
				height={350}
				imageSrc={pillShape}
				imageDescription={'Pill shapes with fully rounded ends'}
			/>
			<CornerTokensTable
				id={'pill-corners'}
				name={'Pill shape corners'}
				tableData={pill}
				caption={'Pill shape corners'}
			/>
			<H2 id="sharp-edge">Sharp edges</H2>
			<P>
				Use <Code>corner-none</Code> to remove rounding and create crisp, square corners. This sets the radius to zero
				without changing the element’s width or height, so it works for both squares and rectangles.
			</P>
			<GradientCanvas
				caption={'Sharp edge'}
				height={350}
				imageSrc={squareShape}
				imageDescription={'Square and rectangle shapes'}
			/>
			<CornerTokensTable id={'square-corners'} name={'Square corners'} tableData={square} caption={'Square corners'} />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Corners & Shapes' },
	{
		id: 'rounded-corners',
		title: 'Rounded corners',
		items: [{ id: 'rounded-corner-tokens-table', title: 'Rounded corner tokens', code: true }],
	},
	{ id: 'pill-shape', title: 'Pill shape', items: [{ id: 'pill-corners', title: 'Pill shape corners', code: true }] },
	{
		id: 'sharp-edge',
		title: 'Sharp edges',
		items: [{ id: 'square-corners', title: 'Square corners', code: true }],
	},
];
export default CornersDoc;

import { GradientCanvas } from '@/components/GradientCanvas/GradientCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import roundedCornersShape from '../../../../../assets/colors/corners_btn_test.svg';

export function MotionDoc() {
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
export default MotionDoc;

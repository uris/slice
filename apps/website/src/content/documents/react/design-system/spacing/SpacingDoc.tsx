import { GradientCanvas } from '@/components/GradientCanvas/GradientCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import spacingGrid from '../../../../../assets/colors/spacing-grid-test4.svg';
import { SpacingTokensTable } from './SpacingTokensTable';

export function SpacingDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Spacing</H1>
			<P clipWidth>
				Consistent spacing helps people scan content and understand which elements belong together. Use Slice’s spacing
				grid to create a clear rhythm across padding, gaps, and layouts.
			</P>
			<H2 id="spacing-rhythm">The 2× rhythm</H2>
			<P>
				Most steps in Slice’s spacing grid double in size: <Code>2px</Code>, <Code>4px</Code>, <Code>8px</Code>,{' '}
				<Code>16px</Code>, <Code>32px</Code>, <Code>64px</Code>, and <Code>128px</Code>.
			</P>
			<P>
				The <Code>spacing-l</Code> token adds <Code>24px</Code> between <Code>16px</Code> and <Code>32px</Code>, giving
				you a smaller step where doubling would leave too large a gap.
			</P>
			<GradientCanvas
				caption={'2× spacing rhythm'}
				height={350}
				imageSrc={spacingGrid}
				imageDescription={'Spacing grid showing steps that double in size, with an additional 24px step'}
			/>
			<H2 id="guidance">Guidance</H2>
			<H3>Build a consistent rhythm</H3>
			<P>
				Use the same spacing for the same relationships throughout your app. Repeated gaps between labels and fields,
				items in a list, or sections on a page help people recognize familiar patterns. Choose from the spacing grid and
				reuse those choices across similar layouts.
			</P>
			<H3>Group related content</H3>
			<P>
				Keep related elements closer together and leave more space between groups. These differences let people perceive
				a page as smaller, meaningful chunks. A label, its field, and its supporting text should read as one group
				before the eye moves to the next.
			</P>
			<H3>Make hierarchy visible</H3>
			<P>
				Use larger gaps to mark section boundaries and smaller gaps within each section. Keep headings closer to the
				content they introduce, with more space separating them from the preceding group. As layouts become denser or
				adapt to smaller screens, preserve these relative differences so the hierarchy remains clear.
			</P>
			<H2 id="spacing-tokens">Spacing tokens</H2>
			<P>
				Use these tokens in CSS, for example <Code>gap: var(--spacing-m)</Code>. The table lists their default values in
				pixels. Click a row to copy its token name.
			</P>
			<SpacingTokensTable />
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Spacing' },
	{ id: 'spacing-rhythm', title: 'The 2× rhythm' },
	{ id: 'guidance', title: 'Guidance' },
	{ id: 'spacing-tokens', title: 'Spacing tokens' },
];
export default SpacingDoc;

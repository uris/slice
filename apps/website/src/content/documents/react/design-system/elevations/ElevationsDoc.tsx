import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, H1, H2, H3, P } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { ElevationAnimation, ElevationComparisonPreview } from './ElevationsPreview';
import { ElevationLevelsTable } from './ElevationsTable';
import { elevationAnimationCode, elevationClassCode, elevationComparisonCode, elevationVariableCode } from './code';

export function ElevationsDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Elevations</H1>
			<P clipWidth>
				Elevation uses shadows to suggest how far a surface sits above its surroundings. It helps people distinguish
				page content from floating controls, menus, and dialogs, making your app’s hierarchy easier to understand.
			</P>
			<H2 id="understanding-elevation">Understanding Slice Elevations</H2>
			<P>
				Slice provides six elevation levels, from <Code>0</Code> to <Code>5</Code>. Level <Code>0</Code> is flat, with
				no shadow. Higher levels create a stronger sense of lift through larger, more pronounced shadows.
			</P>
			<P>
				Components that own a surface accept an <Code>elevation</Code> prop, such as <Code>{'elevation={3}'}</Code>. A
				menu or dialog can appear raised while its contents remain flat. Elevation changes the shadow; it does not
				change which element appears in front of another.
			</P>
			<ElevationLevelsTable />
			<H2 id="using-elevation">Using elevation</H2>
			<H3>CSS variables</H3>
			<P>
				Use <Code>--elevation-0</Code> through <Code>--elevation-5</Code> with <Code>box-shadow</Code> in your own
				styles. This example raises a panel by one level on hover.
			</P>
			<CodeBlock language="css" filename="Panel.css" code={elevationVariableCode.trim()} />
			<H3>Class names</H3>
			<P>
				Apply <Code>elevation-0</Code> through <Code>elevation-5</Code> directly to an element. Level <Code>0</Code>{' '}
				removes its shadow. These classes only set <Code>box-shadow</Code>; surface colors, borders, and stacking order
				remain separate.
			</P>
			<CodeBlock language="tsx" filename="Surfaces.tsx" code={elevationClassCode.trim()} />
			<P>
				For Slice components that expose an <Code>elevation</Code> prop, use that prop to choose their shadow. An inline{' '}
				<Code>boxShadow</Code> style takes precedence over a utility class.
			</P>
			<H2 id="guidance">Guidance</H2>
			<P>
				Start with a mostly flat page and add elevation where a surface needs to stand apart. A floating toolbar, open
				menu, or dialog can use depth to show its relationship to the content beneath it. Choose the lowest level that
				makes that relationship clear.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexbox--default"
				components={[
					{
						label: 'Flat and elevated surfaces',
						component: <ElevationComparisonPreview />,
						code: { code: elevationComparisonCode.trim(), filename: 'ElevationComparison.tsx' },
					},
				]}
			/>
			<P>
				When animating between elevations, take into account surrounding content and add position effects as necessary
				to reinforce elevation. The example below slightly scales and shifts each element on the y axis to re-enforce
				elevation on hover.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexbox--default"
				components={[
					{
						label: 'Animating Elevation',
						component: <ElevationAnimation />,
						code: { code: elevationAnimationCode.trim(), filename: 'ElevationAnimation.tsx' },
					},
				]}
			/>
			<P>
				Keep surfaces with the same role at the same level across your app. Reserve stronger shadows for surfaces that
				need greater separation, so the hierarchy stays easy to read. Use clear wording and appropriate status colors to
				communicate urgency, keeping elevation tied to the surface’s position.
			</P>
			<P>
				Elevate a surface as a whole. A raised panel already separates its buttons, fields, and content from the
				background; adding a shadow to every child creates competing layers. Give raised surfaces enough room for their
				shadows to remain visible.
			</P>
			<P>
				Check the result in both light and dark themes. Combine shadows with distinct surface colors and borders where
				needed, and keep labels, focus indicators, and interaction states clear. People should be able to understand the
				UI even when a shadow is subtle or difficult to see.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Elevations' },
	{
		id: 'understanding-elevation',
		title: 'Understanding Slice Elevations',
		items: [{ id: 'elevation-levels', title: 'Elevation levels' }],
	},
	{ id: 'using-elevation', title: 'Using elevation' },
	{ id: 'guidance', title: 'Guidance' },
];

export default ElevationsDoc;

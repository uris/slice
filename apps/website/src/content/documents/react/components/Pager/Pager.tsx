import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { PagerPreview } from './PagerPreview';
import { controlledCode, opacityCode, scalingCode, transitionCode, usageCode, windowCode } from './code';

export function PagerDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Pager component</H1>
			<P clipWidth>
				Give each page a place. Pager uses compact dots to show the current page, with distance scaling and a sliding
				window for longer collections.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-pager--default"
				components={[
					{ label: 'Default pager', component: <PagerPreview /> },
					{ label: 'No scaling', component: <PagerPreview scaleFactor={1} /> },
					{
						label: 'Progressive pages (20 pages)',
						component: <PagerPreview pages={20} maxVisiblePages={5} opacityScales />,
					},
				]}
			/>
			<TipBox inline noBorder marginBottom={false} title="Tip:">
				The arrows are demo controls, separate from Pager. Use them to see how scaling and sliding respond to selection
				changes, whether triggered by interacting directly with individual pager items or an external trigger.
			</TipBox>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Pass <Code>pages</Code> for the total number of pages. Pager manages its selection unless you provide{' '}
				<Code>selectedIndex</Code>.
			</P>
			<CodeBlock filename="PagerExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Control the selected page</H3>
			<P>
				Use <Code>selectedIndex</Code> and <Code>onChange</Code> to keep the dots in sync with your content. Indices
				start at zero.
			</P>
			<CodeBlock filename="ControlledPager.tsx" language="tsx" code={controlledCode.trim()} />
			<H3>Scale dots by distance</H3>
			<P>
				<Code>scale</Code> sets the selected dot's scale. Each step away multiplies it by <Code>scaleFactor</Code>,
				stopping at <Code>minScale</Code>. For equal-sized dots, set <Code>scaleFactor</Code> to 1.
			</P>
			<CodeBlock filename="ScaledPager.tsx" language="tsx" code={scalingCode.trim()} />
			<H3>Fade dots by distance</H3>
			<P>
				Enable <Code>opacityScales</Code> to fade dots by the same distance factor as their size. The selected dot
				remains fully opaque.
			</P>
			<CodeBlock filename="FadingPager.tsx" language="tsx" code={opacityCode.trim()} />
			<H3>Reveal more pages</H3>
			<P>
				Set <Code>maxVisiblePages</Code> to keep a long pager compact. With five visible dots,{' '}
				<Code>{'showMoreOn={4}'}</Code>
				shifts forward when selection reaches the fourth dot. Moving backward mirrors that trigger to the second dot.
				Each triggered shift brings in enough pages to center the selection, or only the remaining pages near either
				end. Sliding is enabled for five or more total pages.
			</P>
			<CodeBlock filename="SlidingPager.tsx" language="tsx" code={windowCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				The window slides within a fixed mask. Dot scaling changes the visible circles without moving their button
				positions. A triggered shift centers the selected dot when enough pages remain; even-sized windows use the right
				of the two middle positions. Only the visible window and its outgoing animation are rendered.
			</P>
			<P>
				Re-selecting the current page does not emit <Code>onChange</Code>. External selection or page-count changes
				update the display without emitting it. At the beginning and end, the window stops at the available pages.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				Each dot is a native button named for its page, such as “Page 2 of 8”. The selected button exposes{' '}
				<Code>aria-current="page"</Code>. Use <Code>aria-label</Code> to give the group a specific name.
			</P>
			<P>
				Tab moves through visible pages; Enter or Space selects one. Keyboard focus has an inset indicator, and outgoing
				dots are hidden from assistive technology and cannot be activated. Selection stays focusable as its window
				moves.
			</P>
			<P>
				Sliding, scaling, opacity, and color changes use Slice's <Code openURL="/docs/react/motion/">Water</Code>{' '}
				motion. Reduced-motion preferences make those changes immediate, including when the preference changes during an
				animation.
			</P>
			<H2 id={'props'}>Props</H2>
			<Definition id={'color'}>
				<Prop>color</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>Color of unselected dots. Accepts a theme token or CSS color.</P>
			<Definition id={'colorHover'}>
				<Prop>colorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>Color of an unselected dot on hover. Accepts a theme token or CSS color.</P>
			<Definition id={'colorOn'}>
				<Prop>colorOn</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>Color of the selected dot, including on hover. Accepts a theme token or CSS color.</P>
			<Definition id={'defaultSelectedIndex'}>
				<Prop>defaultSelectedIndex</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Initial page for uncontrolled use. Indices start at zero; later changes do not reset the selection.</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>Gap between dot positions in pixels. Negative values become zero; non-finite values use 8.</P>
			<Definition id={'maxVisiblePages'}>
				<Prop>maxVisiblePages</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Maximum number of dot positions in the masked window. Omit to show all pages. Pagers with fewer than five total
				pages always show every page. Positive fractions use whole pages, with a minimum of one; invalid or nonpositive
				values show all pages.
			</P>
			<Definition id={'minScale'}>
				<Prop>minScale</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.5'}</DefaultVal>
			</Definition>
			<P>
				Smallest dot scale. Positive values are capped at scale; invalid or nonpositive values use 0.5, also capped at
				scale.
			</P>
			<Definition id={'opacityScales'}>
				<Prop>opacityScales</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Fade dots by <Code>scaleFactor</Code> for each page away from selection. The selected dot stays fully opaque;
				fading continues after the size reaches <Code>minScale</Code>. Button positions and keyboard focus indicators
				remain unchanged.
			</P>
			<Definition id={'pages'}>
				<Prop>pages</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'2'}</DefaultVal>
			</Definition>
			<P>Total page count. Fractions use whole pages; negative and non-finite values produce an empty pager.</P>
			<Definition id={'scale'}>
				<Prop>scale</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>
				Scale of the selected dot, relative to size. Invalid or nonpositive values use 1. Dot positions reserve this
				maximum size, keeping spacing steady.
			</P>
			<Definition id={'scaleFactor'}>
				<Prop>scaleFactor</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.8'}</DefaultVal>
			</Definition>
			<P>
				Multiplier for each page of distance from the selection. Values are clamped between 0 and 1; non-finite values
				use 0.8. Use 1 for equally sized dots.
			</P>
			<Definition id={'selectedIndex'}>
				<Prop>selectedIndex</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Controlled page index, starting at zero. Update it through onChange. Indices are rounded down and clamped to
				available pages; non-finite values use zero.
			</P>
			<Definition id={'showMoreOn'}>
				<Prop>showMoreOn</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				One-based visible-dot position that triggers a window shift, mirrored when moving backward. Each shift centers
				the selected dot where possible, stopping at the available pages. Use a whole number from 1 up to one less than
				the visible count. Omit or pass an invalid value to trigger at the second-to-last dot moving forward and the
				second dot moving backward. Sliding requires at least five total pages and has no effect when all pages fit.
			</P>
			<Definition id={'size'}>
				<Prop>size</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'10'}</DefaultVal>
			</Definition>
			<P>Base dot diameter in pixels, before scaling. Invalid or nonpositive values use 10.</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other attributes apply to the outer group. Use aria-label to name the pager. className is appended; style is
				merged. Internal geometry and color variables take priority. Children are not supported.
			</P>
			<H2 id={'motion'}>Motion</H2>
			<P>
				<Code>transition</Code> configures sliding, scaling, opacity, and color changes with Slice’s{' '}
				<Code openURL="/docs/react/motion/">Water</Code> motion as the default.
			</P>
			<CodeBlock filename="PagerTransition.tsx" language="tsx" code={transitionCode.trim()} />
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion transition settings merged with Slice’s <Code>Water</Code> transition. Reduced-motion preferences make
				all changes immediate.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(index: number) => void'}</TypeDef>
			</Definition>
			<P>
				Runs once when a different page is activated, with its zero-based index. In controlled use, update selectedIndex
				in this handler.
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Standard events apply to the outer group. The component's onChange is a page-selection callback, not a native
				change event. Motion gestures are not part of the public API.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{
		id: 'title',
		title: 'Pager component',
	},
	{
		id: 'usage',
		title: 'Usage',
	},
	{
		id: 'behavior',
		title: 'Behavior',
	},
	{
		id: 'accessibility',
		title: 'Accessibility',
	},
	{
		id: 'props',
		title: 'Props',
		items: [
			{
				id: 'color',
				title: 'color',
				code: true,
			},
			{
				id: 'colorHover',
				title: 'colorHover',
				code: true,
			},
			{
				id: 'colorOn',
				title: 'colorOn',
				code: true,
			},
			{
				id: 'defaultSelectedIndex',
				title: 'defaultSelectedIndex',
				code: true,
			},
			{
				id: 'gap',
				title: 'gap',
				code: true,
			},
			{
				id: 'maxVisiblePages',
				title: 'maxVisiblePages',
				code: true,
			},
			{
				id: 'minScale',
				title: 'minScale',
				code: true,
			},
			{ id: 'opacityScales', title: 'opacityScales', code: true },
			{
				id: 'pages',
				title: 'pages',
				code: true,
			},
			{
				id: 'scale',
				title: 'scale',
				code: true,
			},
			{
				id: 'scaleFactor',
				title: 'scaleFactor',
				code: true,
			},
			{
				id: 'selectedIndex',
				title: 'selectedIndex',
				code: true,
			},
			{
				id: 'showMoreOn',
				title: 'showMoreOn',
				code: true,
			},
			{
				id: 'size',
				title: 'size',
				code: true,
			},
			{
				id: 'divAttributes',
				title: '...divAttributes',
				code: true,
			},
		],
	},
	{ id: 'motion', title: 'Motion', items: [{ id: 'transition', title: 'transition', code: true }] },
	{
		id: 'events',
		title: 'Events',
		items: [
			{
				id: 'onChange',
				title: 'onChange',
				code: true,
			},
			{
				id: 'nativeEvents',
				title: '...divEvents',
				code: true,
			},
		],
	},
];

export default PagerDoc;

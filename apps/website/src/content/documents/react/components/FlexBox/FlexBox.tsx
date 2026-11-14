import { CodeBlock } from '@/components/CodeBlock/CodeBlock';
import { ComponentCanvas, type ComponentCanvasItem } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { PresetPreview } from './Preview';
import { motionCode, presetCode } from './code';

const getPresets = () => {
	const options: ComponentCanvasItem[] = [];
	for (const value of Object.values(Preset)) {
		if (value === Preset.Window) continue;
		const label = value.toString()[0].toUpperCase() + value.toString().slice(1);
		const preview = {
			label: `Preset: ${label}`,
			component: <PresetPreview preset={value} />,
			code: { code: presetCode(value).trim() },
		};
		options.push(preview);
	}
	return options;
};

export default function FlexBoxDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id="title">FlexBox component</H1>
			<P clipWidth>
				Arrange content with an intuitive layout system. FlexBox wraps a flex container with typically used layout
				presets.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Start with a <Code>preset</Code>, then override the layout props you need.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexbox--default"
				components={getPresets()}
			/>
			<P>
				<strong>
					<em>Shrinking Logic:</em>
				</strong>{' '}
				By default, all presets set <Code>flex-shrink</Code> to <Code>0</Code> on direct children, opting them out of
				automatic shrinking along the main axis (width in rows, height in columns). Use <Code>shrinkChildren</Code> to
				allow shrinking, or override an individual child with inline flex styles.
			</P>
			<P>
				<strong>
					<em>Fill Logic:</em>
				</strong>{' '}
				By default, all "fill" based presets attempt to stretch their box to maximum height and width (setting{' '}
				<Code>width & height</Code> to <Code>100%</Code> and <Code>flex</Code> to <Code>1</Code>). Growing fills
				remaining space along the parent’s main axis; percentage sizing on the other axis still depends on the parent’s
				size.
			</P>
			<P>
				<strong>
					<em>Between Logic:</em>
				</strong>{' '}
				By default, all "between" based presets attempt to stretch their flex direction box to maximum length (setting{' '}
				<Code>width | height</Code> to <Code>100%</Code>) placing equal space between items.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				Explicit layout props override the selected preset; <Code>style</Code> overrides generated styles. Presets
				generally clip overflow. <Code>Preset.FillScroll</Code> enables vertical scrolling, while{' '}
				<Code>Preset.Draggable</Code> leaves overflow visible.
			</P>
			<P>
				Size shorthands: <Code>fill</Code> uses 100%, <Code>fit</Code> and <Code>auto</Code> use auto sizing, and{' '}
				<Code>viewport</Code> uses the viewport dimension. <Code>grow</Code> unsets the dimension; set <Code>flex</Code>{' '}
				separately to grow as a flex item.
			</P>
			<P>
				<Code>Preset.Row</Code> and <Code>Preset.Column</Code> use automatic sizing.
				<Code>Preset.RowBetween</Code> fills the width; <Code>Preset.ColumnBetween</Code> fills the height.
				<Code>Preset.FillStart</Code>, <Code>Preset.FillCenter</Code>, and <Code>Preset.FillEnd</Code>
				align a column’s children left, center, or right while keeping them at the top.
				<Code>Preset.FillCenterMiddle</Code> centers on both axes. <Code>Preset.FillWrap</Code> fills the available
				space with a wrapping row; items and wrapped rows stay at the top. <Code>Preset.Window</Code> fills the
				viewport.
				<Code>Preset.Draggable</Code> uses automatic width and full height.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				FlexBox is a layout div with no built-in action or keyboard behavior. Keep content in logical DOM order;{' '}
				<Code>reverse</Code> changes only visual order. Add appropriate semantics to the content it contains.
			</P>
			<P>
				Reduced motion disables entrance, exit, layout, and gesture animations. Declarative target updates apply
				immediately, including custom variant timing.
			</P>
			<H2 id="props">Props</H2>
			<Definition id="absolute">
				<Prop>absolute</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Positions the container absolutely with all four insets at zero. Overrides width, height, and flex; use a
				positioned parent.
			</P>
			<Definition id="align">
				<Prop>align</Prop>
				<TypeDef>{"'start' | 'center' | 'end'"}</TypeDef>
				<DefaultVal>{'start'}</DefaultVal>
			</Definition>
			<P>Cross-axis alignment. Row presets default to center; explicit values override the preset.</P>
			<Definition id="background">
				<Prop>background</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>Container background. Accepts a theme token or CSS background value.</P>
			<Definition id="border">
				<Prop>border</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>CSS border shorthand.</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Container corner radius. Numbers are pixels.</P>
			<Definition id="centerSelf">
				<Prop>centerSelf</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Centers the container horizontally using margin: 0 auto, overriding the margin prop.</P>
			<Definition id="children">
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Content arranged by the container.</P>
			<Definition id="direction">
				<Prop>direction</Prop>
				<TypeDef>{"'row' | 'column'"}</TypeDef>
				<DefaultVal>{'column'}</DefaultVal>
			</Definition>
			<P>Main-axis direction. Row, row-between, and window presets default to row.</P>
			<Definition id="flex">
				<Prop>flex</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				CSS flex shorthand as a number. Fill presets default to <Code>1</Code>; other presets leave it unset. An
				explicit value overrides the parent’s child grow and shrink settings.
			</P>
			<Definition id="gap">
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Space between children in pixels. Zero is applied explicitly.</P>
			<Definition id="growChildren">
				<Prop>growChildren</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Allows direct children to grow along the main axis. Omission leaves their own grow styles unchanged; false sets
				growth to zero. Inline child flex styles take precedence.
			</P>
			<Definition id="height">
				<Prop>height</Prop>
				<TypeDef>{'number | Size | string'}</TypeDef>
				<DefaultVal>{'fit'}</DefaultVal>
			</Definition>
			<P>
				Container height. Supports pixels, CSS lengths, and the Size shorthands described under Behavior; presets can
				change this default.
			</P>
			<Definition id="justify">
				<Prop>justify</Prop>
				<TypeDef>{"'start' | 'top' | 'center' | 'end' | 'bottom' | 'between'"}</TypeDef>
				<DefaultVal>{'start'}</DefaultVal>
			</Definition>
			<P>
				Main-axis alignment. Top/bottom alias start/end; between uses space-between. The row-between preset defaults to
				between.
			</P>
			<Definition id="margin">
				<Prop>margin</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Outer margin in pixels, CSS shorthand, or dash-separated numbers such as <Code>8-16</Code>.{' '}
				<Code>centerSelf</Code> takes precedence.
			</P>
			<Definition id="maxWidth">
				<Prop>maxWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Maximum width in pixels or a CSS length. Zero is applied explicitly.</P>
			<Definition id="overflow">
				<Prop>overflow</Prop>
				<TypeDef>{"React.CSSProperties['overflow']"}</TypeDef>
				<DefaultVal>{'preset-dependent'}</DefaultVal>
			</Definition>
			<P>
				CSS overflow shorthand. Overrides preset overflow axes; explicit <Code>scrollX</Code> and <Code>scrollY</Code>{' '}
				override the corresponding axis.
			</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Inner spacing in pixels, CSS shorthand, or dash-separated numbers. <Code>padding="8-8-8-0"</Code> sets top,
				right, bottom, and left to 8px, 8px, 8px, and 0px. Explicit values, including zero, take precedence over the{' '}
				<Code>scrollBox</Code> inset.
			</P>
			<Definition id="preset">
				<Prop>preset</Prop>
				<TypeDef>{'Preset'}</TypeDef>
				<DefaultVal>{'Preset.Default'}</DefaultVal>
			</Definition>
			<P>Layout shortcut. Explicit size, direction, alignment, and scroll props override the selected preset.</P>
			<Definition id="reverse">
				<Prop>reverse</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Reverses visual order along the main axis. DOM and keyboard order remain unchanged.</P>
			<Definition id="scrollBox">
				<Prop>scrollBox</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Adds spacing-xs right padding when padding is omitted. Does not enable scrolling by itself.</P>
			<Definition id="scrollHandle">
				<Prop>scrollHandle</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'scroll-bar'}</DefaultVal>
			</Definition>
			<P>Scrollbar thumb color.</P>
			<Definition id="scrollHandleHover">
				<Prop>scrollHandleHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'scroll-bar-hover'}</DefaultVal>
			</Definition>
			<P>Scrollbar thumb color on hover.</P>
			<Definition id="scrollX">
				<Prop>scrollX</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>True enables automatic horizontal scrolling; false hides overflow. Omission uses the preset.</P>
			<Definition id="scrollY">
				<Prop>scrollY</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>True enables automatic vertical scrolling; false hides overflow. Omission uses the preset.</P>
			<Definition id="shrinkChildren">
				<Prop>shrinkChildren</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Allows direct children to shrink along the main axis. All presets default to false. Applies to plain elements
				and nested FlexBoxes; inline child flex styles take precedence.
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'number | Size | string'}</TypeDef>
				<DefaultVal>{'fill'}</DefaultVal>
			</Definition>
			<P>Container width. Supports pixels, CSS lengths, and Size shorthands; presets can change this default.</P>
			<Definition id="wrap">
				<Prop>wrap</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Allows children to wrap onto additional lines.</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{"HTMLMotionProps<'div'>"}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other native div and Motion attributes apply to the root. <Code>className</Code> is forwarded; style overrides
				generated layout styles. Explicit <Code>style.overflow</Code> takes precedence over preset axes.
			</P>
			<H2 id="motion">Motion</H2>
			<P>
				FlexBox exposes Motion’s native animation props directly. Use <Code>initial</Code>, <Code>animate</Code>, and{' '}
				<Code>exit</Code> for declarative states; partial <Code>transition</Code> settings are merged with Water.
			</P>
			<CodeBlock language="tsx" code={motionCode.trim()} />
			<Definition id="animate">
				<Prop>animate</Prop>
				<TypeDef>{'boolean | TargetAndTransition | VariantLabels'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Declarative target or variant labels. Updates apply immediately under reduced motion.</P>
			<Definition id="exit">
				<Prop>exit</Prop>
				<TypeDef>{'TargetAndTransition | VariantLabels'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Exit target for use with AnimatePresence. Disabled under reduced motion.</P>
			<Definition id="initial">
				<Prop>initial</Prop>
				<TypeDef>{'boolean | Target | VariantLabels'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Initial target or variant labels. False skips entrance animation. Disabled under reduced motion.</P>
			<Definition id="layout">
				<Prop>layout</Prop>
				<TypeDef>{"HTMLMotionProps<'div'>['layout']"}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Enables Motion layout animation. Disabled under reduced motion.</P>
			<Definition id="layoutId">
				<Prop>layoutId</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Shared layout identifier. Disabled under reduced motion.</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'theme Water'}</DefaultVal>
			</Definition>
			<P>
				Timing merged with the theme’s Water defaults. Reduced motion overrides custom durations, delays, and repeats.
			</P>
			<Definition id="variants">
				<Prop>variants</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Named static targets or resolver functions. Custom variant timing respects reduced motion.</P>
			<H2 id="events">Events</H2>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{"HTMLMotionProps<'div'>"}</TypeDef>
			</Definition>
			<P>
				Native div and Motion event callbacks apply to the root. Motion’s gesture and animation callbacks use Motion
				event signatures.
			</P>
			<H2 id="ref">Ref</H2>
			<P>
				The forwarded ref points to the root <Code>HTMLDivElement</Code>.
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'FlexBox component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'absolute', title: 'absolute', code: true },
			{ id: 'align', title: 'align', code: true },
			{ id: 'background', title: 'background', code: true },
			{ id: 'border', title: 'border', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'centerSelf', title: 'centerSelf', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'direction', title: 'direction', code: true },
			{ id: 'flex', title: 'flex', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'growChildren', title: 'growChildren', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'justify', title: 'justify', code: true },
			{ id: 'margin', title: 'margin', code: true },
			{ id: 'maxWidth', title: 'maxWidth', code: true },
			{ id: 'overflow', title: 'overflow', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'preset', title: 'preset', code: true },
			{ id: 'reverse', title: 'reverse', code: true },
			{ id: 'scrollBox', title: 'scrollBox', code: true },
			{ id: 'scrollHandle', title: 'scrollHandle', code: true },
			{ id: 'scrollHandleHover', title: 'scrollHandleHover', code: true },
			{ id: 'scrollX', title: 'scrollX', code: true },
			{ id: 'scrollY', title: 'scrollY', code: true },
			{ id: 'shrinkChildren', title: 'shrinkChildren', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'wrap', title: 'wrap', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'animate', title: 'animate', code: true },
			{ id: 'exit', title: 'exit', code: true },
			{ id: 'initial', title: 'initial', code: true },
			{ id: 'layout', title: 'layout', code: true },
			{ id: 'layoutId', title: 'layoutId', code: true },
			{ id: 'transition', title: 'transition', code: true },
			{ id: 'variants', title: 'variants', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
	{ id: 'ref', title: 'Ref' },
];

import { CodeBlock } from '@/components/CodeBlock/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { ColumnPreview, RowPreview, ScrollPreview } from './Preview';
import { columnCode, motionCode, rowCode, scrollCode } from './code';
export default function FlexDivDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id="title">FlexDiv component</H1>
			<P>
				Deprecated. Use <Code openURL="/docs/react/flex-box/">FlexBox</Code> instead. FlexDiv is the same component,
				with the same props, defaults, and forwarded ref.
			</P>
			<P clipWidth>
				Arrange content with flex layouts, spacing, scrolling, and reusable presets in a single container.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Start with a <Code>preset</Code>, then override the layout props you need.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexdiv--default"
				components={[
					{ label: 'Row', component: <RowPreview />, code: rowCode.trim() },
					{ label: 'Column', component: <ColumnPreview />, code: columnCode.trim() },
				]}
			/>
			<H3>Scrolling</H3>
			<P>
				Give scrolling containers a bounded height. Children that must retain their height can use{' '}
				<Code>flexShrink: 0</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-flexdiv--default"
				components={[{ label: 'Scrollable column', component: <ScrollPreview />, code: scrollCode.trim() }]}
			/>
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
				<Code>Preset.Row</Code> and <Code>Preset.RowBetween</Code> arrange a full-width row; <Code>Preset.Column</Code>{' '}
				and <Code>Preset.Default</Code> arrange a full-width column. <Code>Preset.FillStart</Code> and{' '}
				<Code>Preset.FillCenter</Code> fill both dimensions. <Code>Preset.Window</Code> fills the viewport.{' '}
				<Code>Preset.Draggable</Code> uses automatic width and full height.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				FlexDiv is a layout div with no built-in action or keyboard behavior. Keep content in logical DOM order;{' '}
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
			<P>CSS flex shorthand as a number. Use flex={1} when the container should grow as a flex item.</P>
			<Definition id="gap">
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Space between children in pixels. Zero is applied explicitly.</P>
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
				Outer margin in pixels or CSS shorthand. <Code>centerSelf</Code> takes precedence.
			</P>
			<Definition id="maxWidth">
				<Prop>maxWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Maximum width in pixels or a CSS length. Zero is applied explicitly.</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Inner spacing in pixels or CSS shorthand. Explicit values, including zero, take precedence over the{' '}
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
				FlexDiv exposes Motion’s native animation props directly. Use <Code>initial</Code>, <Code>animate</Code>, and{' '}
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
	{ id: 'title', title: 'FlexDiv component' },
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
			{ id: 'height', title: 'height', code: true },
			{ id: 'justify', title: 'justify', code: true },
			{ id: 'margin', title: 'margin', code: true },
			{ id: 'maxWidth', title: 'maxWidth', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'preset', title: 'preset', code: true },
			{ id: 'reverse', title: 'reverse', code: true },
			{ id: 'scrollBox', title: 'scrollBox', code: true },
			{ id: 'scrollHandle', title: 'scrollHandle', code: true },
			{ id: 'scrollHandleHover', title: 'scrollHandleHover', code: true },
			{ id: 'scrollX', title: 'scrollX', code: true },
			{ id: 'scrollY', title: 'scrollY', code: true },
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

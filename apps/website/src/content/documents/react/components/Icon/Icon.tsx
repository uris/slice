import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset, SliceIcons } from '@apple-pie/slice';
import { IconColorsPreview, IconGroupPreview, IconSizesPreview } from './Preview';
import { colorsCode, galleryCode, sizesCode } from './code';

export default function IconDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id="title">Icon component</H1>
			<P clipWidth>
				Render a Slice icon as a single SVG, with theme colors, adjustable strokes, and optional direct interaction.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Choose a <Code>name</Code> from the <Code openURL="/docs/react/icons/">icon catalog</Code>. Solid variants are
				separate names, such as <Code>media.play-filled</Code>.
			</P>
			<H3>Browse icons</H3>
			<TipBox inline noBorder>
				Browse Slice's icon catalog. Hover or focus an icon to see its name - clicking copies the name to the clipboard.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-icon--default"
				components={Object.entries(SliceIcons).map(([group, icons]) => ({
					label: group,
					component: <IconGroupPreview icons={Object.values(icons)} />,
					code: galleryCode.replace('SliceIcons.basic', `SliceIcons.${group}`).trim(),
				}))}
			/>

			<H3>Apply colors</H3>
			<P>
				Each icon can be colored using <Code>strokeColor</Code> and passing in any HTML / CSS color definitions along
				with a Slice <Code>ColorValue</Code> token.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-icon--default"
				components={[{ label: 'Core ramp colors', component: <IconColorsPreview />, code: colorsCode.trim() }]}
			/>
			<H3>Sizes and strokes</H3>
			<P>
				Provide a custom size with <Code>size</Code> and a custom line thickness with <Code>stroke</Code>. Columns below
				show <Code>16</Code>, <Code>24</Code>, and <Code>32</Code> pixel sizes. Rows use stroke weights <Code>1</Code>,{' '}
				<Code>1.5</Code>, and <Code>2</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-icon--default"
				components={[
					{
						label: 'Sizes and stroke weights',
						component: <IconSizesPreview />,
						code: sizesCode.trim(),
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Supplying <Code>onClick</Code> makes the SVG interactive without adding wrapper elements. <Code>pointer</Code>{' '}
				controls the cursor. <Code>toggle</Code> selects alternate artwork where available; your application owns its
				state. Unknown names render nothing.
			</P>
			<P>
				<Code>disabled</Code> dims the icon and prevents activation. Optional translucent <Code>fill</Code> depends on
				the artwork; it is separate from a solid icon variant.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Static icons expose an image with <Code>iconName</Code>, or the icon identifier as a fallback. Use{' '}
				<Code>decorative</Code> when nearby text already provides the meaning.
			</P>
			<P>
				Clickable icons expose a button named by <Code>actionName</Code>, falling back to the icon identifier. Tab
				focuses enabled actions; Enter activates on key press and Space on release. Focus has a visible outline. Color
				transitions are disabled under reduced motion.
			</P>
			<H2 id="props">Props</H2>
			<P>All props are optional. Color props accept theme tokens or CSS colors.</P>
			<Definition id="actionName">
				<Prop>actionName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Accessible name for a clickable icon. Falls back to the icon identifier followed by “icon”.</P>
			<Definition id="coverUp">
				<Prop>coverUp</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'current theme surface'}</DefaultVal>
			</Definition>
			<P>Background color used by artwork that masks another path. Only applies to artwork that supports it.</P>
			<Definition id="decorative">
				<Prop>decorative</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Hides a static icon from assistive technology. Clickable icons remain exposed.</P>
			<Definition id="disabled">
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Dims the icon, removes it from the tab order, and blocks activation.</P>
			<Definition id="fill">
				<Prop>fill</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Enables optional translucent fill where the artwork supports it. Solid artwork uses <Code>strokeColor</Code>{' '}
				directly and does not require fill.
			</P>
			<Definition id="fillOpacity">
				<Prop>fillOpacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.125 light / 0.2 dark'}</DefaultVal>
			</Definition>
			<P>
				Opacity of the optional fill when enabled. Finite values are clamped to 0–1; explicit zero is respected.
				Currently used by ai.sparkle.
			</P>
			<Definition id="iconName">
				<Prop>iconName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Accessible name for a static icon. Falls back to the icon identifier followed by “icon”.</P>
			<Definition id="name">
				<Prop>name</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'basic.home'}</DefaultVal>
			</Definition>
			<P>
				Registered icon identifier. Use a string or the exported <Code>SliceIcons</Code> constants; see the icon
				catalog.
			</P>
			<Definition id="pointer">
				<Prop>pointer</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Shows a pointer cursor when enabled. Keyboard focus depends on <Code>onClick</Code>, not this flag.
			</P>
			<Definition id="size">
				<Prop>size</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>Width and height in pixels. Artwork uses a 20-by-20 viewBox.</P>
			<Definition id="stroke">
				<Prop>stroke</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1.25'}</DefaultVal>
			</Definition>
			<P>Stroke width in artwork units. Solid artwork is unaffected.</P>
			<Definition id="strokeColor">
				<Prop>strokeColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'current theme icon color'}</DefaultVal>
			</Definition>
			<P>Color of strokes and solid artwork. Accepts theme tokens or CSS colors.</P>
			<Definition id="toggle">
				<Prop>toggle</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Uses the alternate artwork when one is registered; otherwise keeps the normal artwork. It does not manage state
				or imply a pressed state.
			</P>
			<Definition id="svgAttributes">
				<Prop>...svgAttributes</Prop>
				<TypeDef>{"Omit<React.SVGAttributes<SVGSVGElement>, keyof React.AriaAttributes | 'role'>"}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Native SVG attributes apply to the root. Accessible semantics, dimensions, and keyboard focus are managed by
				Icon. Use <Code>iconName</Code>, <Code>actionName</Code>, and <Code>decorative</Code> for accessibility.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>{'(event: React.MouseEvent<SVGElement, MouseEvent>) => void'}</TypeDef>
			</Definition>
			<P>Runs for pointer and keyboard activation with a real click event. Disabled icons do not call it.</P>
			<Definition id="nativeEvents">
				<Method>...svgEvents</Method>
				<TypeDef>{'React.DOMAttributes<SVGSVGElement>'}</TypeDef>
			</Definition>
			<P>
				Native SVG events apply to the root. Keyboard handlers run before built-in activation; calling{' '}
				<Code>preventDefault()</Code> cancels that activation.
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Icon component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'actionName', title: 'actionName', code: true },
			{ id: 'coverUp', title: 'coverUp', code: true },
			{ id: 'decorative', title: 'decorative', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'fill', title: 'fill', code: true },
			{ id: 'fillOpacity', title: 'fillOpacity', code: true },
			{ id: 'iconName', title: 'iconName', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'pointer', title: 'pointer', code: true },
			{ id: 'size', title: 'size', code: true },
			{ id: 'stroke', title: 'stroke', code: true },
			{ id: 'strokeColor', title: 'strokeColor', code: true },
			{ id: 'toggle', title: 'toggle', code: true },
			{ id: 'svgAttributes', title: '...svgAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'nativeEvents', title: '...svgEvents', code: true },
		],
	},
];

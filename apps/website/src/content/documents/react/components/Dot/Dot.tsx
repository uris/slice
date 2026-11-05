import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { DotPreview } from './DotPreview';
import { example1Code, motionCode, usageCode } from './code';

export function DotDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Dot component</H1>
			<P clipWidth>
				Add a small signal for new activity or status. Dot can sit beside content or attach to the corner of a
				positioned container.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-dot--default"
				components={[{ label: 'Dot', component: <DotPreview /> }]}
			/>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Set <Code>show</Code> to render the dot. Use inline positioning when it should occupy space beside other
				content.
			</P>
			<CodeBlock filename="DotExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Attach to a corner</H3>
			<P>
				Use a positioned parent for corner placement. <Code>rightOffset</Code> and <Code>topOffset</Code> are pixel
				distances from that parent.
			</P>
			<CodeBlock filename="DotExample1.tsx" language="tsx" code={example1Code.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				<Code>show</Code>=false removes the dot after its exit animation. Corner positioning is absolute and needs a
				positioned ancestor. Inline positioning reserves space in the content flow.
			</P>
			<P>
				<Code>color</Code> overrides the named <Code>state</Code>. The colored circle uses <Code>size</Code>. The
				configured border currently has a rendering issue; do not rely on it for spacing.
			</P>
			<P>
				An internal <Code>AnimatePresence</Code> handles removal. The initial mounted dot does not play its entrance
				animation; later <Code>show</Code> changes can animate it.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The default root is a polite status with the fixed label “Blue dot indicating active or new”. Override
				aria-label to describe the actual <Code>state</Code>, especially for non-blue dots.
			</P>
			<P>
				For decorative dots, set aria-hidden=true and provide the status in nearby text. Do not rely on{' '}
				<Code>color</Code> alone to convey meaning. When reduced motion is enabled, the dot shows and hides immediately
				without animation, including custom delays and repeats.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'border'}>
				<Prop>border</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'3'}</DefaultVal>
			</Definition>
			<P>
				Intended border width in pixels, using core-surface-primary. The current stylesheet has a border shorthand
				issue, so this border may not render.
			</P>
			<Definition id={'color'}>
				<Prop>color</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Explicit dot <Code>color</Code>. Takes priority over <Code>state</Code>.
			</P>
			<Definition id={'position'}>
				<Prop>position</Prop>
				<TypeDef>{"'inline' | 'corner'"}</TypeDef>
				<DefaultVal>{'corner'}</DefaultVal>
			</Definition>
			<P>corner uses absolute positioning; inline participates in the content flow.</P>
			<Definition id={'rightOffset'}>
				<Prop>rightOffset</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'2'}</DefaultVal>
			</Definition>
			<P>Distance from the right edge in corner mode, in pixels. Ignored in inline mode.</P>
			<Definition id={'show'}>
				<Prop>show</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Controls whether the dot is present, with exit animation before removal.</P>
			<Definition id={'size'}>
				<Prop>size</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>Colored circle diameter in pixels.</P>
			<Definition id={'state'}>
				<Prop>state</Prop>
				<TypeDef>{"'red' | 'yellow' | 'green' | 'blue' | 'grey'"}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Named <Code>color</Code> preset. red=feedback-warning, yellow=feedback-attention, green=feedback-positive,
				blue=core-gp-logo-primary, grey=core-text-secondary. Without <Code>state</Code>, uses blue.
			</P>
			<Definition id={'topOffset'}>
				<Prop>topOffset</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'2'}</DefaultVal>
			</Definition>
			<P>Distance from the top edge in corner mode, in pixels. Ignored in inline mode.</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other attributes apply to the root. className is appended; style is merged. Component layout and{' '}
				<Code>color</Code> styles take priority over overlapping style fields. Children are not rendered; the internal
				dot content is retained.
			</P>
			<H2 id={'motion-section'}>Motion</H2>
			<P>
				<Code>transition</Code> and <Code>motionValues</Code> define animations with Slice’s{' '}
				<Code openURL="/docs/react/motion/">Water</Code> motion as the default.
			</P>
			<CodeBlock filename="DotMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id={'motionValues'}>
				<Prop>motionValues</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion Variants merged with the default initial, animate, and exit opacity definitions. Matching names replace
				the corresponding variant.
			</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion <Code>transition</Code> settings are merged with Slice’s <Code openURL="/docs/react/motion/">Water</Code>{' '}
				transition.
			</P>
			<H2 id={'events'}>Events</H2>

			<Definition id={'nativeEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Dot has no component-specific callbacks or gestures. Standard div interaction handlers apply to the visible
				element.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Dot component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'border', title: 'border', code: true },
			{ id: 'color', title: 'color', code: true },
			{ id: 'position', title: 'position', code: true },
			{ id: 'rightOffset', title: 'rightOffset', code: true },
			{ id: 'show', title: 'show', code: true },
			{ id: 'size', title: 'size', code: true },
			{ id: 'state', title: 'state', code: true },
			{ id: 'topOffset', title: 'topOffset', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'motion-section',
		title: 'Motion',
		items: [
			{ id: 'motionValues', title: 'motionValues', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [{ id: 'nativeEvents', title: '...divEvents', code: true }],
	},
];

export default DotDoc;

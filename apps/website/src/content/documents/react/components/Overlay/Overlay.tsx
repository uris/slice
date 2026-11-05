import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { OverlayPreview } from './OverlayPreview';
import { motionCode, usageCode } from './code';

export function OverlayDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Overlay component</H1>
			<P clipWidth>Catch background clicks while a menu or dialog is open, with a clear or dimmed backdrop.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-overlay--default"
				components={[{ label: 'Overlay', component: <OverlayPreview opacity={0.75} /> }]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				{'Control '}
				<Code>{'show'}</Code>
				{' from your app and use a native event such as '}
				<Code>{'onClick'}</Code>
				{' or '}
				<Code>{'onPointerDown'}</Code>
				{' to dismiss the layer. Set '}
				<Code>{'opacity'}</Code>
				{' for a dimmed backdrop, or leave it at zero for a clear pointer-catching layer.'}
			</P>
			<CodeBlock filename="OverlayExample.tsx" language="tsx" code={usageCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{
					'By default, the layer covers the viewport and intercepts pointer input even when its backdrop is fully transparent. Opacity affects only the backdrop, so children keep their own appearance.'
				}
			</P>
			<P>
				{'Child events bubble normally unless a child calls '}
				<Code>{'stopPropagation()'}</Code>
				{'. Stop the event used by the dismissal handler: stopping '}
				<Code>{'onPointerDown'}</Code>
				{' does not also stop a later '}
				<Code>{'onClick'}</Code>
				{'.'}
			</P>
			<P>
				{
					'The component does not dismiss itself or prevent browser context menus automatically. Your handlers decide when to close, prevent the default action, or stop propagation. With pointer events enabled, the layer continues intercepting pointers during exit until it is removed.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'The visual backdrop is hidden from assistive technology; foreground children remain available. Overlay does not assign a dialog or menu role to its children.'
				}
			</P>
			<P>
				{
					'Your app manages foreground naming, keyboard behavior, Escape dismissal, focus, and any background scroll or keyboard locking. Reduced-motion preferences bypass backdrop animation, including custom delays, repeats, and transforms when the preference changes during an animation.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional.</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'rgb(0,0,0)'}</DefaultVal>
			</Definition>
			<P>{'Backdrop color. Accepts Slice tokens or CSS colors.'}</P>
			<Definition id="children">
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Foreground content inside the layer. Backdrop opacity and animation do not dim these children.'}</P>
			<Definition id="opacity">
				<Prop>opacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				{
					'Backdrop opacity from zero to one. Zero is visually clear and still intercepts pointers. Values are clamped to that range; nonfinite values use zero.'
				}
			</P>
			<Definition id="pointerEvents">
				<Prop>pointerEvents</Prop>
				<TypeDef>{"'auto' | 'none'"}</TypeDef>
				<DefaultVal>auto</DefaultVal>
			</Definition>
			<P>
				Set <Code>pointerEvents="none"</Code> to let pointers pass through the entire layer, including its children.
				This does not disable keyboard focus or keyboard interaction.
			</P>
			<Definition id="position">
				<Prop>position</Prop>
				<TypeDef>{"'fixed' | 'absolute'"}</TypeDef>
				<DefaultVal>fixed</DefaultVal>
			</Definition>
			<P>
				Use <Code>fixed</Code> to cover the viewport or <Code>absolute</Code> inside a positioned container, such as a
				parent with <Code>position: relative</Code>.
			</P>
			<CodeBlock
				filename="ContainerOverlay.tsx"
				language="tsx"
				code={'<div style={{ position: "relative" }}>\n  <Overlay show position="absolute" opacity={0.35} />\n</div>'}
			/>
			<Definition id="show">
				<Prop>show</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Shows the controlled layer. Your app changes this value to dismiss it.'}</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				{'Native attributes and handlers apply to the interaction div. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{
					' is merged; positioning and pointer handling follow their component props. Component CSS variables take priority. Roles and raw ARIA attributes are excluded; supply semantics on your foreground content.'
				}
			</P>
			<H2 id="motion">Motion</H2>
			<P>
				<Code>transition</Code> and <Code>motionValues</Code> define backdrop animations with Slice’s{' '}
				<Code openURL="/docs/react/motion/">Water</Code> transition as the default.
			</P>
			<CodeBlock filename="OverlayMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id="motionValues">
				<Prop>motionValues</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'Opacity 0 → opacity → 0'}</DefaultVal>
			</Definition>
			<P>
				{'Motion variants merged into the backdrop’s '}
				<Code>{'initial'}</Code>
				{', '}
				<Code>{'animate'}</Code>
				{', and '}
				<Code>{'exit'}</Code>
				{
					' states. Partial object overrides retain omitted defaults. Foreground children are separate from this animation.'
				}
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Water'}</DefaultVal>
			</Definition>
			<P>
				{
					'Timing and easing settings merged with Slice’s Water transition. Reduced-motion preferences bypass custom variants and timing.'
				}
			</P>
			<H2 id="events">Events</H2>
			<P>No component-specific callbacks.</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Use native click, pointer, keyboard, and context-menu handlers with their normal React event payloads. Child '
				}
				<Code>{'stopPropagation()'}</Code>
				{
					' controls whether the matching handler on the layer runs. Motion gesture or animation-lifecycle callbacks are not exposed by the backdrop.'
				}
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Overlay component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'opacity', title: 'opacity', code: true },
			{ id: 'pointerEvents', title: 'pointerEvents', code: true },
			{ id: 'position', title: 'position', code: true },
			{ id: 'show', title: 'show', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'motionValues', title: 'motionValues', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
];
export default OverlayDoc;

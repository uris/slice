import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { OverlayPreview } from './OverlayPreview';
import { foregroundCode, usageCode } from './code';
export function OverlayDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Overlay component</H1>
			<P clipWidth>{'Dim the background and give a focused task room to stand out.'}</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-overlay--default"
				components={[
					{ label: 'Light backdrop', component: <OverlayPreview /> },
					{ label: 'Dark backdrop', component: <OverlayPreview opacity={0.7} /> },
				]}
			/>
			<TipBox inline noBorder title="Tip:">
				{
					'The preview contains the backdrop inside the canvas. Click it to dismiss, then use Show overlay to reopen it.'
				}
			</TipBox>
			<H2 id="usage">Usage</H2>
			<P>
				{'Control '}
				<Code>{'show'}</Code>
				{' from your app and use '}
				<Code>{'onClick'}</Code>
				{' to dismiss the backdrop.'}
			</P>
			<P>
				{'Use a foreground panel such as '}
				<Code openURL="/docs/react/modal/">Modal</Code>
				{'.'}
			</P>
			<CodeBlock filename="OverlayExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Keep foreground content separate</H3>
			<P>
				{
					'Opacity applies to the overlay and its children. Render a foreground panel as a sibling so its content stays fully opaque.'
				}
			</P>
			<CodeBlock filename="foregroundCode.tsx" language="tsx" code={foregroundCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'The overlay is viewport-fixed whenever it is shown. '}
				<Code>{'global'}</Code>
				{' changes click handling, not positioning.'}
			</P>
			<P>
				{''}
				<Code>{'type="clear"'}</Code>
				{' forces opacity to zero, including when '}
				<Code>{'opacity'}</Code>
				{' is supplied; the invisible layer still receives pointer input.'}
			</P>
			<P>
				{
					'The default context-menu handler prevents the browser menu. Native context-menu overrides are forwarded separately.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'The backdrop is a plain div, without dialog semantics or keyboard dismissal. Supply an accessible foreground dialog and manage focus, Escape, and background interaction in your app.'
				}
			</P>
			<P>
				{
					'Its transition currently uses fixed easing and timing rather than Slice’s Water defaults. Reduced-motion preferences are not handled by the component yet.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>{'All component props are optional. Color props accept Slice tokens or CSS colors.'}</P>
			<Definition id="children">
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Content inside the backdrop. It shares the backdrop’s opacity.'}</P>
			<Definition id="color">
				<Prop>color</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'rgb(0,0,0)'}</DefaultVal>
			</Definition>
			<P>{'Backdrop background color. Accepts Slice color tokens or CSS colors.'}</P>
			<Definition id="global">
				<Prop>global</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'When active, clicks call '}
				<Code>{'toggleOverlay(false)'}</Code>
				{' before '}
				<Code>{'onClick'}</Code>
				{'. It does not choose between local and viewport positioning.'}
			</P>
			<Definition id="opacity">
				<Prop>opacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.8 for dark; 0 for clear'}</DefaultVal>
			</Definition>
			<P>
				{'Opacity for '}
				<Code>{'type="dark"'}</Code>
				{'. Clear overlays always use zero.'}
			</P>
			<Definition id="overlay">
				<Prop>overlay</Prop>
				<TypeDef>{'any'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Declared and consumed by the component, but currently unused.'}</P>
			<Definition id="show">
				<Prop>show</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Controls whether the backdrop is rendered.'}</P>
			<Definition id="type">
				<Prop>type</Prop>
				<TypeDef>{"'clear' | 'dark'"}</TypeDef>
				<DefaultVal>{'clear'}</DefaultVal>
			</Definition>
			<P>{'Choose an invisible pointer-catching layer or a dimmed background.'}</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				{'Native attributes apply to the Motion div. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{
					' is merged; component color variables take priority. Native handlers are forwarded, but incidental Motion gestures are not part of the documented API.'
				}
			</P>
			<H2 id="motion">Motion</H2>
			<P>
				{
					'These props configure the internal Motion wrapper. Current defaults use fixed timing rather than Slice’s Water transition.'
				}
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{"{ ease: 'easeOut', duration: 0.25 }"}</DefaultVal>
			</Definition>
			<P>
				{
					'Motion timing settings for opacity. A supplied object replaces the default; it is not currently merged with Water.'
				}
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs after a backdrop click. It receives no native event argument. When '}
				<Code>{'global'}</Code>
				{' is true, '}
				<Code>{'toggleOverlay(false)'}</Code>
				{' runs first.'}
			</P>
			<Definition id="toggleOverlay">
				<Method>toggleOverlay</Method>
				<TypeDef>{'(state: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				{'Called with '}
				<Code>{'false'}</Code>
				{' on clicks when '}
				<Code>{'global'}</Code>
				{' is true. Your app owns the state change.'}
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Other native div handlers are forwarded. The component replaces its click handler with the callback contract above.'
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
			{ id: 'children', title: 'children', code: true },
			{ id: 'color', title: 'color', code: true },
			{ id: 'global', title: 'global', code: true },
			{ id: 'opacity', title: 'opacity', code: true },
			{ id: 'overlay', title: 'overlay', code: true },
			{ id: 'show', title: 'show', code: true },
			{ id: 'type', title: 'type', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'motion', title: 'Motion', items: [{ id: 'transition', title: 'transition', code: true }] },
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'toggleOverlay', title: 'toggleOverlay', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default OverlayDoc;

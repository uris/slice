import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { TipPreview } from './TipPreview';
import { positionedCode, tipCode, usageCode } from './code';
export function TipDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Tip component</H1>
			<P clipWidth>{'Add a short hint beside an action without pulling people away from their work.'}</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tip--demo"
				components={[
					{ label: 'A short hint', component: <TipPreview /> },
					{ label: 'Hover or focus', component: <TipPreview interactive /> },
				]}
			/>
			<TipBox inline noBorder title="Tip:">
				{
					'In the interactive example, hover or focus Project details to show the hint. Preview coordinates are local to the canvas.'
				}
			</TipBox>
			<H2 id="usage">Usage</H2>
			<P>
				{'Provide the hint through '}
				<Code>{'tip.payload.label'}</Code>
				{' and position it with '}
				<Code>{'coords'}</Code>
				{'. The current visibility logic requires both coordinates to be greater than zero.'}
			</P>
			<CodeBlock filename="TipExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Position beside a control</H3>
			<P>
				{'Use '}
				<Code>{'useToolTip'}</Code>
				{
					' to calculate viewport coordinates from tooltip metadata and a measured tooltip ref. The triggering control supplies the metadata.'
				}
			</P>
			<CodeBlock filename="positionedCode.tsx" language="tsx" code={positionedCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'Changing '}
				<Code>{'coords'}</Code>
				{
					' restarts the show-delay and hide-delay sequence. The tooltip hides after its timer expires, even if the trigger is still hovered.'
				}
			</P>
			<P>
				{
					'The wrapper stays mounted while hidden. Coordinates drive visibility; a label without positive coordinates does not show the tooltip.'
				}
			</P>
			<P>
				{
					'Fade timing is fixed internally. Hiding changes visibility immediately, and subsequent reveals do not consistently restart the fade.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'The current component does not add tooltip semantics, an association with its trigger, or Escape dismissal. Provide an equivalent accessible description through application-owned controls and markup.'
				}
			</P>
			<P>
				{
					'Hover alone is insufficient for keyboard users. The interactive preview supplies focus/blur activation in its own wiring; this is not built into Tip. Reduced-motion preferences are not currently observed.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>{'All component props are optional. Color props accept Slice tokens or CSS colors.'}</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Tooltip background.'}</P>
			<Definition id="border">
				<Prop>border</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows a 1px border.'}</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Tooltip border color.'}</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'radius, then corner-xs (4px)'}</DefaultVal>
			</Definition>
			<P>
				{'Corner radius. Takes precedence over the existing '}
				<Code>{'radius'}</Code>
				{' fallback.'}
			</P>
			<Definition id="color">
				<Prop>color</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Existing fallback for '}
				<Code>{'textColor'}</Code>
				{'. The current stylesheet does not apply the resulting text-color variable.'}
			</P>
			<Definition id="coords">
				<Prop>coords</Prop>
				<TypeDef>{'{ x: number; y: number }'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Viewport coordinates in pixels. Both values must currently be positive to show the tooltip; zero or negative coordinates hide it.'
				}
			</P>
			<Definition id="hideDelay">
				<Prop>hideDelay</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'2500'}</DefaultVal>
			</Definition>
			<P>{'Milliseconds the tooltip remains visible after the show delay.'}</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4px 8px'}</DefaultVal>
			</Definition>
			<P>{'Tooltip padding, in pixels or CSS units. Explicit zero is supported.'}</P>
			<Definition id="radius">
				<Prop>radius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-xs (4px)'}</DefaultVal>
			</Definition>
			<P>
				{'Existing corner-radius fallback when '}
				<Code>{'borderRadius'}</Code>
				{' is omitted.'}
			</P>
			<Definition id="showDelay">
				<Prop>showDelay</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'500'}</DefaultVal>
			</Definition>
			<P>{'Milliseconds to wait after valid coordinates arrive.'}</P>
			<Definition id="textColor">
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{
					'Sets the tooltip text-color variable, but the current stylesheet does not read that variable. This needs a component fix.'
				}
			</P>
			<Definition id="textSize">
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'s'}</DefaultVal>
			</Definition>
			<P>{'Typography size.'}</P>
			<Definition id="tip">
				<Prop>tip</Prop>
				<TypeDef>{'ToolTip | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Tooltip metadata. Only '}
				<Code>{'payload.label'}</Code>
				{' is rendered by Tip; positioning metadata is consumed by the external helper, and '}
				<Code>{'payload.duration'}</Code>
				{' does not replace '}
				<Code>{'hideDelay'}</Code>
				{'.'}
			</P>
			<CodeBlock filename="ToolTip.ts" language="typescript" code={tipCode.trim()} />
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{"HTMLMotionProps<'div'>"}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				{'Attributes apply to the persistent Motion wrapper. '}
				<Code>{'className'}</Code>
				{' is appended; component styles control coordinates and visibility. Children are supplied by '}
				<Code>{'tip.payload.label'}</Code>
				{'. Incidental Motion gestures are not a documented Tip feature.'}
			</P>
			<H2 id="events">Events</H2>
			<P>No component-specific callbacks.</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{"HTMLMotionProps<'div'>"}</TypeDef>
			</Definition>
			<P>
				{
					'Native wrapper handlers are forwarded. No component-specific callbacks or intentional drag gestures are implemented.'
				}
			</P>
			<H2 id="ref">Ref</H2>
			<Definition id="componentRef">
				<Prop>ref</Prop>
				<TypeDef>{'React.Ref<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'The forwarded ref points to the persistent tooltip div, including while hidden. The positioning helper uses it for measurement.'
				}
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Tip component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'border', title: 'border', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'color', title: 'color', code: true },
			{ id: 'coords', title: 'coords', code: true },
			{ id: 'hideDelay', title: 'hideDelay', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'radius', title: 'radius', code: true },
			{ id: 'showDelay', title: 'showDelay', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'tip', title: 'tip', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
	{ id: 'ref', title: 'Ref', items: [{ id: 'componentRef', title: 'ref', code: true }] },
];
export default TipDoc;

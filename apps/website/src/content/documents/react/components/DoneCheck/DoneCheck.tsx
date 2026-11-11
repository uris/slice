import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { DoneCheckExample } from './Preview';
import { usageCode } from './code';

export default function DoneCheckDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">DoneCheck component</H1>
			<P clipWidth>Show a completion checkmark with an optional scale animation.</P>
			<H2 id="usage">Usage</H2>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-donecheck--default"
				components={[
					{
						label: 'Basic usage',
						component: <DoneCheckExample />,
						code: usageCode,
						codeFilename: 'DoneCheckExample.tsx',
						hasRefresh: true,
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				The check animates on mount by default, with no <Code>delay</Code>. Setting <Code>play</Code> to false shows the
				completed check immediately; it does not hide or pause it. Changing <Code>play</Code> from false to true replays
				the entrance. Timing values are in seconds.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The root is a polite status named by <Code>statusLabel</Code>, falling back to “Completed” for an empty label.
				Set <Code>decorative</Code> when nearby text already conveys completion. The inner icon is hidden from assistive
				technology. Reduced motion shows the check immediately, ignoring animation <Code>delay</Code>. Applications
				should announce changing operation results in their own live text; the visual animation alone does not guarantee
				an announcement.
			</P>
			<H2 id="props">Props</H2>
			<Definition id="color">
				<Prop>color</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>feedback-positive</DefaultVal>
			</Definition>
			<P>
				Checkmark <Code>color</Code>, accepting a Slice theme token or CSS <Code>color</Code>.
			</P>
			<Definition id="decorative">
				<Prop>decorative</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>false</DefaultVal>
			</Definition>
			<P>Hides the entire check from assistive technology.</P>
			<Definition id="delay">
				<Prop>delay</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>0</DefaultVal>
			</Definition>
			<P>Delay before the entrance, in seconds.</P>
			<Definition id="duration">
				<Prop>duration</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>1</DefaultVal>
			</Definition>
			<P>
				Entrance <Code>duration</Code> in seconds. Zero or negative values show the check immediately.
			</P>
			<Definition id="play">
				<Prop>play</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>true</DefaultVal>
			</Definition>
			<P>Enables the entrance animation.</P>
			<Definition id="size">
				<Prop>size</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>88</DefaultVal>
			</Definition>
			<P>Reserved square dimensions in pixels.</P>
			<Definition id="statusLabel">
				<Prop>statusLabel</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>Completed</DefaultVal>
			</Definition>
			<P>Accessible status name.</P>
			<Definition id="stroke">
				<Prop>stroke</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>1.5</DefaultVal>
			</Definition>
			<P>Stroke width in the icon’s 20-unit SVG coordinate system.</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Native attributes apply to the root div. <Code>className</Code> is appended and <Code>style</Code> is merged;
				component dimensions take priority. Children are not supported. Status semantics are managed by{' '}
				<Code>statusLabel</Code> and <Code>decorative</Code>.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="didEnd">
				<Method>didEnd</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>Runs when the scale transition finishes. It does not run for skipped or cancelled transitions.</P>
			<Definition id="didStart">
				<Method>didStart</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs when the scale transition starts, after its <Code>delay</Code>. It does not run when animation is skipped.
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>Standard div event handlers apply to the root.</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DoneCheck component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'color', title: 'color', code: true },
			{ id: 'decorative', title: 'decorative', code: true },
			{ id: 'delay', title: 'delay', code: true },
			{ id: 'duration', title: 'duration', code: true },
			{ id: 'play', title: 'play', code: true },
			{ id: 'size', title: 'size', code: true },
			{ id: 'statusLabel', title: 'statusLabel', code: true },
			{ id: 'stroke', title: 'stroke', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'didEnd', title: 'didEnd', code: true },
			{ id: 'didStart', title: 'didStart', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];

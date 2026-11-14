import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { AppearancePreview, LabelPreview, LoadingPreview, OverlayPreview } from './ProgressIndicatorPreview';
import { appearanceCode, labelCode, motionCode, overlayCode, timedCode, usageCode } from './code';

const indicatorProps = [
	{
		name: 'color',
		type: 'ColorValue',
		defaultValue: 'core-text-primary',
		description: 'Spinner stroke color. Accepts Slice tokens or CSS colors.',
	},
	{
		name: 'decorative',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Suppresses the loading announcement when the parent already supplies status text or semantics.',
	},
	{
		name: 'displayLabel',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Shows label text in a span beside the spinner. Hidden by default; does not change announcements.',
	},
	{
		name: 'duration',
		type: 'number',
		defaultValue: 'undefined',
		description:
			'Playback limit in seconds. Zero stops immediately; omitted, negative, or non-finite values have no limit. Expiry keeps the indicator visible. Very large values are capped to the browser timer limit.',
	},
	{
		name: 'inline',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Places the spinner in normal flow. Otherwise the wrapper fills its positioned parent.',
	},
	{
		name: 'inset',
		type: 'boolean',
		defaultValue: 'true',
		description: 'Keeps the arc inset from the SVG edge. False expands the radius to account for the stroke width.',
	},
	{
		name: 'label',
		type: 'string',
		defaultValue: 'Loading',
		description:
			'Text for the status announcement and optional visible label. Empty labels use Loading; decorative suppresses only the announcement.',
	},
	{
		name: 'labelPosition',
		type: "'left' | 'right' | 'top' | 'bottom'",
		defaultValue: 'right',
		description: 'Position of the visible label relative to the spinner. Applies only when displayLabel is true.',
	},
	{
		name: 'secondsPerSpin',
		type: 'number',
		defaultValue: '1',
		description:
			'Seconds per revolution. Smaller positive values spin faster. Non-positive or non-finite values use 1 second.',
	},
	{
		name: 'show',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Shows or removes the indicator with an opacity transition.',
	},
	{
		name: 'size',
		type: 'number | string',
		defaultValue: '20',
		description:
			'SVG width and height. Positive finite numbers use pixels; CSS length strings pass through. Invalid numbers or empty strings use 20px.',
	},
	{
		name: 'stroke',
		type: 'number',
		defaultValue: '1.5',
		description:
			'Stroke width in the 20 × 20 SVG coordinate system, clamped to 0–10. Negative or non-finite values use 1.5.',
	},
	{
		name: 'textColor',
		type: 'ColorValue',
		defaultValue: 'core-text-primary',
		description: 'Visible label color, independent of the spinner color.',
	},
	{
		name: 'textSize',
		type: "'xs' | 's' | 'm' | 'l' | 'xl'",
		defaultValue: 'm',
		description: 'Visible label body typography size.',
	},
	{
		name: 'divAttributes',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		defaultValue: 'undefined',
		description:
			'Native attributes target the wrapper, not the SVG. Classes are appended and styles merged; positioning variables are managed internally.',
	},
];

export function ProgressIndicatorDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ProgressIndicator component</H1>
			<P clipWidth>Show that work is in progress when its completion percentage is unknown.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Connect <Code>show</Code> to your loading state to show a simple loading spinner.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-progressindicator--default"
				components={[
					{
						label: 'Spinner only',
						component: <LoadingPreview />,
						code: { code: usageCode.trim(), filename: 'FileLoading.tsx' },
					},
				]}
			/>
			<H3>Display a label</H3>
			<P>
				By default, only the spinner is visible. Set <Code>displayLabel</Code> to show <Code>label</Code> as text.
				Choose <Code>labelPosition</Code> left, right, top, or bottom; the default is right.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-progressindicator--label-positions"
				components={[
					{
						label: 'Visible label positions',
						component: <LabelPreview />,
						code: { code: labelCode.trim(), filename: 'LabeledProgress.tsx' },
					},
				]}
			/>
			<H3>Center over a region</H3>
			<P>
				Without <Code>inline</Code>, the wrapper fills a positioned parent and centers the spinner.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-progressindicator--default"
				components={[
					{
						label: 'Positioned region',
						component: <OverlayPreview />,
						code: { code: overlayCode.trim(), filename: 'LoadingRegion.tsx' },
					},
				]}
			/>
			<H3>Adjust the appearance</H3>
			<P>
				Set <Code>size</Code>, <Code>stroke</Code>, and <Code>color</Code> for your context. <Code>secondsPerSpin</Code>{' '}
				controls speed; <Code>{'inset = {false}'}</Code> lets the arc reach the SVG edge.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-progressindicator--default"
				components={[
					{
						label: 'Larger, faster spinner',
						component: <AppearancePreview />,
						code: { code: appearanceCode.trim(), filename: 'SpinnerAppearance.tsx' },
					},
				]}
			/>
			<H3>Limit playback</H3>
			<P>
				<Code>duration</Code> stops playback once without hiding the indicator or completing application work. Toggle{' '}
				<Code>show</Code> off and on to start another cycle.
			</P>
			<CodeBlock language="tsx" code={timedCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				<Code>show</Code> controls presence and starts a playback cycle. <Code>duration</Code> limits that cycle in
				seconds; expiry leaves a static indicator visible. Hiding stops an active cycle once.
			</P>
			<P>
				Callback changes do not reset timers. Changing <Code>duration</Code> during active playback restarts its
				deadline; changing it after expiry does not restart playback. Unmount cancels timers without firing{' '}
				<Code>onStop</Code>.
			</P>
			<P>
				Reduced-motion preferences are observed live: the loading arc remains static and presence transitions are
				immediate. Playback timing and callbacks still run, independent of animation.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				By default, a persistent <Code>role="status"</Code> region announces <Code>label</Code> when shown. Use a
				task-specific label such as <Code>label="Uploading report.pdf"</Code>. The SVG and optional visible label are
				decorative to accessibility APIs; the status region announces the label once.
			</P>
			<P>
				Set <Code>decorative</Code> when a parent already provides loading text or semantics, as in the first example.
				Use <Code>aria-busy</Code> on the region being updated. This is indeterminate loading feedback, without a
				percentage or <Code>progressbar</Code> value.
			</P>
			<H2 id="props">Props</H2>
			<P>All props are optional.</P>
			{indicatorProps.map(({ name, type, defaultValue, description }) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Prop>{name === 'divAttributes' ? '...divAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
			<H2 id="motion">Motion</H2>
			<Definition id="motionValues">
				<Prop>motionValues</Prop>
				<TypeDef>Variants</TypeDef>
				<DefaultVal>opacity 0 → 1 → 0</DefaultVal>
			</Definition>
			<P>
				Merges <Code>initial</Code>, <Code>animate</Code>, and <Code>exit</Code> states for the wrapper. Rotation
				remains controlled by <Code>secondsPerSpin</Code>.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>Transition</TypeDef>
				<DefaultVal>Water theme transition</DefaultVal>
			</Definition>
			<P>
				Presence timing and easing. Reduced motion overrides custom movement and animation delays, including during
				exit.
			</P>
			<CodeBlock language="tsx" code={motionCode.trim()} />
			<H2 id="events">Events</H2>
			<Definition id="onStart">
				<Method>onStart</Method>
				<TypeDef>() =&gt; void</TypeDef>
			</Definition>
			<P>
				Runs once when a shown playback cycle starts, including under reduced motion. It is not an entry-animation
				completion event.
			</P>
			<Definition id="onStop">
				<Method>onStop</Method>
				<TypeDef>() =&gt; void</TypeDef>
			</Definition>
			<P>
				Runs once when an active cycle is hidden or its duration expires. Initially hidden mounts and unmounts do not
				fire it. It is not an exit-animation completion event.
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>React.HTMLAttributes&lt;HTMLDivElement&gt;</TypeDef>
			</Definition>
			<P>
				Native events apply to the visual wrapper; content, focusability, ARIA semantics, drag, and animation-start
				handlers are managed or excluded.
			</P>
			<H2 id="ref">Ref</H2>
			<Definition id="componentRef">
				<Prop>ref</Prop>
				<TypeDef>React.Ref&lt;HTMLDivElement&gt;</TypeDef>
			</Definition>
			<P>Targets the visual wrapper while mounted. It becomes null after exit completes.</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'ProgressIndicator component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: indicatorProps.map(({ name }) => ({
			id: name,
			title: name === 'divAttributes' ? '...divAttributes' : name,
			code: true,
		})),
	},
	{ id: 'motion', title: 'Motion', items: ['motionValues', 'transition'].map((id) => ({ id, title: id, code: true })) },
	{
		id: 'events',
		title: 'Events',
		items: ['onStart', 'onStop', 'nativeEvents'].map((id) => ({
			id,
			title: id === 'nativeEvents' ? '...divEvents' : id,
			code: true,
		})),
	},
	{ id: 'ref', title: 'Ref', items: [{ id: 'componentRef', title: 'ref', code: true }] },
];
export default ProgressIndicatorDoc;

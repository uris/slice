import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { AudioLevelPreview } from './Preview';
import { usageCode } from './code';

export default function AudioLevelDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id="title">AudioLevel component</H1>
			<P clipWidth>Show live audio volume as a row of bars for microphone checks, recording UI, and input activity.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Pass an audio stream or track to <Code>audioStream</Code> and enable <Code>playing</Code>. This example uses{' '}
				<Code>useMicrophone(false)</Code> to request an unmuted microphone.
			</P>
			<TipBox inline noBorder>
				Allow microphone access and speak to see the live meter respond.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-audiolevel--demo"
				components={[{ label: 'Live microphone', component: <AudioLevelPreview />, code: usageCode.trim() }]}
			/>

			<H2 id="behavior">Behavior</H2>
			<P>
				Bars light from left to right as volume rises. The more the number of bars the smoother the animation feels.{' '}
				<Code>intensity</Code> adjusts sensitivity; lower <Code>peakIntensity</Code> for a stronger response to quiet
				sounds. This measures volume, not speech or calibrated decibels.
			</P>
			<P>
				Pausing, removing the source, or ending its audio tracks returns the meter to <Code>minActiveBars</Code>. Audio
				setup failures also leave it at rest. Your application handles microphone permission, playback, and stopping
				source tracks; <Code>playing</Code> only controls analysis.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Decorative by default. Set <Code>levelName</Code> to expose a named meter with a value from zero to{' '}
				<Code>barCount</Code>, representing lit bars. It has no keyboard interaction or live announcements. Provide text
				separately when users need recording or connection status.
			</P>
			<P>Discrete level updates remain visible under reduced motion; decorative CSS transitions are disabled.</P>
			<H2 id="props">Props</H2>
			<P>All props are optional.</P>
			<Definition id="audioStream">
				<Prop>audioStream</Prop>
				<TypeDef>{'MediaStream | MediaStreamTrack | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Audio source to measure. Omit it or pass null to show the resting level.</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary-tint'}</DefaultVal>
			</Definition>
			<P>Color of unlit bars. Accepts a theme token or CSS color.</P>
			<Definition id="backgroundColorActive">
				<Prop>backgroundColorActive</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-positive'}</DefaultVal>
			</Definition>
			<P>Color of lit bars. Accepts a theme token or CSS color.</P>
			<Definition id="barCount">
				<Prop>barCount</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'5'}</DefaultVal>
			</Definition>
			<P>Total number of bars. Floored and clamped to 1–1000; non-finite values use 5.</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>Border color of each bar.</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>Corner radius of the whole meter. Numbers are pixels; strings accept CSS lengths.</P>
			<Definition id="borderWidth">
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Border width of each bar in pixels.</P>
			<Definition id="gap">
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Space between bars in pixels.</P>
			<Definition id="height">
				<Prop>height</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>Height of the meter and its bars in pixels.</P>
			<Definition id="intensity">
				<Prop>intensity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'3.5'}</DefaultVal>
			</Definition>
			<P>
				Audio sensitivity multiplier. Higher values light more bars at the same volume. Must be positive and finite;
				invalid values use the analyser default of 2.2.
			</P>
			<Definition id="levelName">
				<Prop>levelName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Accessible name for the meter. Omit or leave blank to keep the visualization decorative.</P>
			<Definition id="minActiveBars">
				<Prop>minActiveBars</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Number of bars that remain lit at rest. Floored and clamped to 0–<Code>barCount</Code>; non-finite values use 0.
			</P>
			<Definition id="peakIntensity">
				<Prop>peakIntensity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.5'}</DefaultVal>
			</Definition>
			<P>
				Audio level treated as a full response after applying intensity. Lower values reach full bars sooner. Must be
				positive and finite; invalid values use the analyser default of 0.2.
			</P>
			<Definition id="playing">
				<Prop>playing</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Enables analysis when a live audio source is present. False resets the meter to its resting level without
				stopping the source.
			</P>
			<Definition id="releasePerSeconds">
				<Prop>releasePerSeconds</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1.5'}</DefaultVal>
			</Definition>
			<P>
				How quickly the level falls as audio gets quieter, in normalized intensity units per second. Must be positive
				and finite; invalid values use 1.5.
			</P>
			<Definition id="risePerSeconds">
				<Prop>risePerSeconds</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>
				How quickly the level rises as audio gets louder, in normalized intensity units per second. Must be positive and
				finite; invalid values use 4.
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100'}</DefaultVal>
			</Definition>
			<P>Total meter width. Numbers are pixels; strings accept CSS lengths or percentages.</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{"Omit<React.HTMLAttributes<HTMLDivElement>, keyof React.AriaAttributes | 'role'>"}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Native div attributes apply to the root, including <Code>id</Code>, <Code>className</Code>, and{' '}
				<Code>style</Code>. Use <Code>levelName</Code> for accessible semantics. Children are generated internally.
			</P>
			<H2 id="events">Events</H2>
			<P>AudioLevel has no custom event callbacks.</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>Standard div event handlers apply to the root.</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'AudioLevel component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'audioStream', title: 'audioStream', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorActive', title: 'backgroundColorActive', code: true },
			{ id: 'barCount', title: 'barCount', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'intensity', title: 'intensity', code: true },
			{ id: 'levelName', title: 'levelName', code: true },
			{ id: 'minActiveBars', title: 'minActiveBars', code: true },
			{ id: 'peakIntensity', title: 'peakIntensity', code: true },
			{ id: 'playing', title: 'playing', code: true },
			{ id: 'releasePerSeconds', title: 'releasePerSeconds', code: true },
			{ id: 'risePerSeconds', title: 'risePerSeconds', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'events', title: 'Events', items: [{ id: 'nativeEvents', title: '...divEvents', code: true }] },
];

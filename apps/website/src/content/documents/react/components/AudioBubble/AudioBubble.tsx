import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { AudioBubblePreview, AudioBubblePreviewProvider } from './AudioBubblePreview';
import { glowCode, pausedCode, responseCode, statusCode, usageCode } from './code';

export function AudioBubbleDoc() {
	return (
		<AudioBubblePreviewProvider>
			<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
				<Path />
				<H1 id={'title'}>AudioBubble component</H1>
				<P clipWidth>
					Bring live audio into view. AudioBubble is a responsive circle for voice interfaces and speaking indicators,
					with a soft glow that fits your theme.
				</P>
				<TipBox inline>
					To make examples live, allow microphone access to this page and watch the animation playout as microphone
					sound levels change.
				</TipBox>
				<H2 id="usage">Usage</H2>
				<P>
					These examples use the microphone to create an audio stream. You can pass any audio stream or track to the
					components' <Code>audioStream</Code>; <Code>playing</Code> controls visualization (not the sound source).
				</P>
				<ComponentCanvas
					storybookUrl="https://react.slice-uikit.com/?path=/story/components-audiobubble--demo"
					components={[
						{ label: 'Live microphone', component: <AudioBubblePreview />, code: usageCode.trim() },
						{ label: 'Paused', component: <AudioBubblePreview variant="paused" />, code: pausedCode.trim() },
					]}
				/>

				<H3>Tune the response</H3>
				<P>
					Use <Code>maxScale</Code> to limit growth and <Code>intensity</Code> to adjust sensitivity. Lower{' '}
					<Code>peakIntensity</Code> for a stronger response to quiet sounds.
				</P>
				<ComponentCanvas
					storybookUrl="https://react.slice-uikit.com/?path=/story/components-audiobubble--demo"
					components={[
						{
							label: 'Response',
							component: <AudioBubblePreview variant="response" />,
							code: responseCode.trim(),
						},
					]}
				/>
				<H3>Style the glow</H3>
				<P>
					Set the circle and glow colors, then adjust the blur with <Code>glowSize</Code>. Use{' '}
					<Code>{'glow={false}'}</Code> to remove the glow.
				</P>
				<ComponentCanvas
					storybookUrl="https://react.slice-uikit.com/?path=/story/components-audiobubble--demo"
					components={[
						{
							label: 'Glow',
							component: <AudioBubblePreview variant="glow" />,
							code: glowCode.trim(),
						},
					]}
				/>
				<H2 id={'behavior'}>Behavior</H2>
				<P>
					The bubble grows between <Code>minScale</Code> and <Code>maxScale</Code> as the audio gets louder, then
					settles as the level drops. It measures volume rather than detecting speech.
				</P>
				<P>
					Without a source, or when <Code>playing</Code> is false, it returns to <Code>minScale</Code>. Your application
					handles microphone access, playback, and stopping the source tracks.
				</P>
				<P>
					Leave room for growth and glow: scaling does not move surrounding content. With the defaults, a 64-pixel
					circle can grow to 192 pixels across.
				</P>
				<H2 id={'accessibility'}>Accessibility</H2>
				<P>
					AudioBubble is decorative by default: it sets <Code>aria-hidden="true"</Code>. Provide a text status alongside
					it. Override with <Code>{'aria-hidden={false}'}</Code> and appropriate semantics if the visualization itself
					must be exposed. The component has no built-in label, keyboard behavior, or announcements.
				</P>
				<P>
					Reduced-motion preferences keep the bubble at its resting size and suspend analysis. Keep a text status
					available alongside it.
				</P>
				<ComponentCanvas
					storybookUrl="https://react.slice-uikit.com/?path=/story/components-audiobubble--demo"
					components={[
						{
							label: 'Accessible status',
							component: <AudioBubblePreview variant="status" />,
							code: statusCode.trim(),
						},
					]}
				/>
				<H2 id={'props'}>Props</H2>
				<P>All props are optional. Color props accept Slice theme tokens or CSS colors.</P>
				<Definition id={'audioStream'}>
					<Prop>audioStream</Prop>
					<TypeDef>{'MediaStream | MediaStreamTrack | null'}</TypeDef>
					<DefaultVal>{'undefined'}</DefaultVal>
				</Definition>
				<P>Audio stream or track to visualize. Omit it or pass null to keep the bubble at rest.</P>
				<Definition id={'backgroundColor'}>
					<Prop>backgroundColor</Prop>
					<TypeDef>{'ColorValue'}</TypeDef>
					<DefaultVal>{'core-text-primary'}</DefaultVal>
				</Definition>
				<P>Fill color of the circle.</P>
				<Definition id={'glow'}>
					<Prop>glow</Prop>
					<TypeDef>{'boolean'}</TypeDef>
					<DefaultVal>{'true'}</DefaultVal>
				</Definition>
				<P>Shows the glow around the circle, including when animation is paused.</P>
				<Definition id={'glowColor'}>
					<Prop>glowColor</Prop>
					<TypeDef>{'ColorValue'}</TypeDef>
					<DefaultVal>{'core-text-primary at 10% opacity'}</DefaultVal>
				</Definition>
				<P>Color of the glow shadow.</P>
				<Definition id={'glowOffset'}>
					<Prop>glowOffset</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'18'}</DefaultVal>
				</Definition>
				<P>
					Vertical glow offset in pixels. Positive values move it down; negative values move it up. Use 0 to center it.
				</P>
				<Definition id={'glowSize'}>
					<Prop>glowSize</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'48'}</DefaultVal>
				</Definition>
				<P>Glow blur radius in pixels. Larger values create a softer, wider glow.</P>
				<Definition id={'intensity'}>
					<Prop>intensity</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'2.2'}</DefaultVal>
				</Definition>
				<P>Audio sensitivity multiplier. Higher values produce a stronger response.</P>
				<Definition id={'maxScale'}>
					<Prop>maxScale</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'3'}</DefaultVal>
				</Definition>
				<P>Largest scale at full response. Keep it at or above minScale.</P>
				<Definition id={'minScale'}>
					<Prop>minScale</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'1'}</DefaultVal>
				</Definition>
				<P>Resting scale. A value of 1 keeps the circle at its base size.</P>
				<Definition id={'peakIntensity'}>
					<Prop>peakIntensity</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'0.5'}</DefaultVal>
				</Definition>
				<P>
					Audio level treated as a full response after applying intensity. Lower values reach maxScale sooner. Must be
					positive.
				</P>
				<Definition id={'playing'}>
					<Prop>playing</Prop>
					<TypeDef>{'boolean'}</TypeDef>
					<DefaultVal>{'false'}</DefaultVal>
				</Definition>
				<P>
					Enables animation when a source is present. Set to false to return to minScale without stopping the source.
				</P>
				<Definition id={'releasePerSeconds'}>
					<Prop>releasePerSeconds</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'1.5'}</DefaultVal>
				</Definition>
				<P>How quickly the bubble settles after the audio gets quieter. Higher values settle faster.</P>
				<Definition id={'risePerSeconds'}>
					<Prop>risePerSeconds</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'4'}</DefaultVal>
				</Definition>
				<P>How quickly the bubble grows as the audio gets louder. Higher values react faster.</P>
				<Definition id={'size'}>
					<Prop>size</Prop>
					<TypeDef>{'number'}</TypeDef>
					<DefaultVal>{'64'}</DefaultVal>
				</Definition>
				<P>Base width and height of the circle in pixels, before scaling.</P>
				<Definition id={'divAttributes'}>
					<Prop>...divAttributes</Prop>
					<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
					<DefaultVal>{'undefined'}</DefaultVal>
				</Definition>
				<P>
					Native div attributes pass through to the wrapper, including id, className, style, data-* and aria-*. Children
					are not rendered.
				</P>
				<H2 id={'events'}>Events</H2>
				<P>AudioBubble has no custom event callbacks.</P>
				<Definition id={'divEvents'}>
					<Method>...divEvents</Method>
					<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
				</Definition>
				<P>
					Native React handlers such as <Code>onClick</Code>, <Code>onMouseEnter</Code>, and <Code>onMouseLeave</Code>
					pass through to the wrapper and receive the standard React event.
				</P>
			</FlexBox>
		</AudioBubblePreviewProvider>
	);
}

export const audioBubbleTrackedItems: TrackedItem[] = [
	{ id: 'title', title: 'AudioBubble component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'audioStream', title: 'audioStream', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'glow', title: 'glow', code: true },
			{ id: 'glowColor', title: 'glowColor', code: true },
			{ id: 'glowOffset', title: 'glowOffset', code: true },
			{ id: 'glowSize', title: 'glowSize', code: true },
			{ id: 'intensity', title: 'intensity', code: true },
			{ id: 'maxScale', title: 'maxScale', code: true },
			{ id: 'minScale', title: 'minScale', code: true },
			{ id: 'peakIntensity', title: 'peakIntensity', code: true },
			{ id: 'playing', title: 'playing', code: true },
			{ id: 'releasePerSeconds', title: 'releasePerSeconds', code: true },
			{ id: 'risePerSeconds', title: 'risePerSeconds', code: true },
			{ id: 'size', title: 'size', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [{ id: 'divEvents', title: '...divEvents', code: true }],
	},
];

export default AudioBubbleDoc;
export { audioBubbleTrackedItems as trackedItems };

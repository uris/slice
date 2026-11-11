import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { CustomVideoPreview, DefaultVideoPreview, NativeVideoPreview, SimpleVideoPreview } from './VideoPreview';
import { customCode, defaultUsageCode, nativeCode, playingCode, refCode, renderControlsCode, usageCode } from './code';

export default function VideoDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Video component</H1>
			<P clipWidth>Play video with compact overlay controls, browser controls, or your own playback UI.</P>
			<H2 id="usage">Usage</H2>

			<P>
				Pass a video URL to <Code>src</Code> and the video plays with default basic controls that appear and disappear
				on hover.
			</P>
			<TipBox noMargin noBorder inline>
				Although the videos below have an audio track, all videos start muted for privacy. Your app fully controls the
				volume start state of each video.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-video--default"
				components={[
					{
						label: 'Default',
						component: <DefaultVideoPreview />,
						code: defaultUsageCode.trim(),
						codeFilename: 'VideoExample.tsx',
						hasRefresh: true,
					},
				]}
			/>
			<P>
				Set controls selectively using <Code>customControls</Code>. For example, to show only the central play/pause
				action, set <Code>{'customControls={{play: true}}'}</Code>.
			</P>
			<TipBox inline noBorder>
				Move the pointer over the video or focus its controls to reveal them.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-video--default"
				components={[
					{
						label: 'Play only',
						component: <SimpleVideoPreview />,
						code: usageCode.trim(),
						codeFilename: 'VideoExample.tsx',
						hasRefresh: true,
					},
				]}
			/>
			<H3>Use browser controls</H3>
			<P>
				Set <Code>controls="default"</Code> to use the browser’s player controls. Add a matching WebVTT file through{' '}
				<Code>captionsSrc</Code> when captions are available.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-video--native-controls"
				components={[
					{
						label: 'Browser controls',
						component: <NativeVideoPreview />,
						code: nativeCode.trim(),
						codeFilename: 'NativeControls.tsx',
						hasRefresh: true,
					},
				]}
			/>
			<H3>Provide your own controls</H3>
			<P>
				With <Code>controls="custom"</Code>, pass a function to build Video's children from your own controls. The
				function provides access to state and callbacks that allow you to control all aspects of playback:{' '}
				<Code>playing</Code>, <Code>muted</Code>, <Code>progress</Code>, <Code>volume</Code>,<Code>canSeek</Code>,{' '}
				<Code>togglePlay</Code>
				<Code>toggleMute</Code>, <Code>setProgress</Code>, <Code>setVolume</Code>
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-video--custom-controls-children"
				components={[
					{
						label: 'Custom controls',
						component: <CustomVideoPreview />,
						code: customCode.trim(),
						codeFilename: 'CustomPlayer.tsx',
						hasRefresh: true,
					},
				]}
			/>
			<H3>Request playback from application state</H3>
			<P>
				<Code>shouldPlay</Code> is application state. Changing <Code>playing</Code> requests play or pause; an unchanged
				value does not prevent people from using the controls. Browsers can block autoplay, particularly with sound
				enabled.
			</P>
			<CodeBlock filename="PlaybackState.tsx" language="tsx" code={playingCode} />
			<P>
				For an overlay player opened from application actions, use{' '}
				<Code openURL="/docs/react/video-controller/">VideoController</Code>.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				Known Safari issue: mouse clicks on playback controls may stop working after pausing in fullscreen, including
				with native browser controls. This browser issue is being investigated separately.
			</P>
			<P>
				Controls hide after two seconds without pointer activity or when the pointer leaves. They remain visible while
				keyboard focus is inside the player. Scrubbing pauses playback and resumes it only if it was playing before the
				interaction; seeking is disabled until a finite duration is known.
			</P>
			<P>
				The loading indicator remains until the browser reports <Code>canplay</Code> and reappears during buffering. A
				loading error replaces it with an alert. Changing <Code>src</Code> creates a fresh player, resets its state, and
				replaces the native element exposed by the ref.
			</P>
			<P>
				The close action calls <Code>onQuit</Code>; it does not remove the component. It appears within the simple
				progress bar, so enable both <Code>customControls.quit</Code> and <Code>customControls.progress</Code>.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Use <Code>videoName</Code> to describe the content. Playback, volume, fullscreen, and captions controls have
				accessible names and support keyboard use. Custom controls need their own names and keyboard behavior.
			</P>
			<P>
				Provide accurate captions for spoken content and appropriate transcripts or audio descriptions when the content
				requires them. The player supports one captions track; its toggle is available in simple mode when{' '}
				<Code>captionsSrc</Code> is set. Muted playback is the default.
			</P>
			<P>
				Reduced motion disables the control-visibility fade. It does not pause the video; people can pause playback
				using the controls.
			</P>
			<H2 id="props">Props</H2>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>
				Background behind the video, visible when the content does not fill its frame. Accepts a Slice color token or
				CSS color.
			</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>
				Wrapper border color. Set <Code>borderWidth</Code> to make the border visible.
			</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--corner-s)'}</DefaultVal>
			</Definition>
			<P>Wrapper corner radius. Numbers use pixels; CSS lengths and theme variables are supported.</P>
			<Definition id="borderWidth">
				<Prop>borderWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Wrapper border <Code>width</Code>. Numbers use pixels; CSS lengths are supported.
			</P>
			<Definition id="captionsDefault">
				<Prop>captionsDefault</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Initial captions visibility. Used when the player mounts; later changes to this default do not control the
				selected track.
			</P>
			<Definition id="captionsLabel">
				<Prop>captionsLabel</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Captions'}</DefaultVal>
			</Definition>
			<P>Name of the captions track in the browser’s track menu.</P>
			<Definition id="captionsLanguage">
				<Prop>captionsLanguage</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'en'}</DefaultVal>
			</Definition>
			<P>Language tag for the captions track, such as en or fr.</P>
			<Definition id="captionsSrc">
				<Prop>captionsSrc</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				URL of a WebVTT captions file. Adds one captions track and enables the simple controls captions toggle unless
				disabled.
			</P>
			<Definition id="children">
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode | ((controls: VideoControlsContext) => React.ReactNode)'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				A node or render function for custom overlay content, rendered only with <Code>controls</Code>="custom" when{' '}
				<Code>customControls</Code> is omitted. Supplying <Code>children</Code> in simple mode suppresses its built-in
				controls; reserve <Code>children</Code> for custom mode.
			</P>
			<Definition id="controls">
				<Prop>controls</Prop>
				<TypeDef>{"'default' | 'simple' | 'custom' | 'none'"}</TypeDef>
				<DefaultVal>{'simple'}</DefaultVal>
			</Definition>
			<P>
				simple uses Slice <Code>controls</Code>; default uses browser <Code>controls</Code>; custom renders{' '}
				<Code>children</Code> over the video; none renders neither control set. An explicit <Code>customControls</Code>{' '}
				object takes precedence over every mode and over <Code>children</Code>.
			</P>
			<Definition id="customControls">
				<Prop>customControls</Prop>
				<TypeDef>{'CustomVideoControls'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				An explicit object starts with all flags off and enables only flags set to <Code>true</Code>. For example,{' '}
				<Code>{'{ play: true }'}</Code> shows only play/pause, and <Code>{'{}'}</Code> shows no controls. It overrides{' '}
				<Code>controls</Code> and <Code>children</Code>. Without this prop, <Code>simple</Code> enables progress,
				volume, fullscreen, and available captions. <Code>play</Code> adds the large central <Code>play</Code>
				/pause action; progress adds the seek bar and its <Code>play</Code>/pause button; <Code>volume</Code> adds{' '}
				<Code>mute</Code> and <Code>volume</Code>; <Code>fullscreen</Code> adds <Code>fullscreen</Code>
				captions adds a captions toggle when <Code>captionsSrc</Code> is supplied. quit adds a close action inside the
				progress bar, requires progress, and calls <Code>onQuit</Code> without removing the video.
			</P>
			<Definition id="height">
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>
				Wrapper <Code>height</Code>. Numbers use pixels; CSS lengths are supported.
			</P>
			<Definition id="loop">
				<Prop>loop</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Restarts playback automatically when the media reaches its end.</P>
			<Definition id="muted">
				<Prop>muted</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Sets the media’s <Code>muted</Code> state. Changing <Code>volume</Code> does not unmute the player.
			</P>
			<Definition id="objectFit">
				<Prop>objectFit</Prop>
				<TypeDef>{"'fill' | 'contain' | 'cover' | 'none' | 'scale-down'"}</TypeDef>
				<DefaultVal>{'contain'}</DefaultVal>
			</Definition>
			<P>Fits the video within its frame. contain preserves the whole image; cover fills the frame and may crop it.</P>
			<Definition id="playing">
				<Prop>playing</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Requests playback or pause on mount and when this value changes. When omitted, <Code>controls</Code> and ref
				methods manage playback. An unchanged value does not undo user actions.
			</P>
			<Definition id="playRate">
				<Prop>playRate</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>Playback speed, clamped to 0.5–3. Nonfinite values fall back to 1.</P>
			<Definition id="playsInline">
				<Prop>playsInline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Requests inline playback on supporting mobile browsers instead of automatic native <Code>fullscreen</Code>.
			</P>
			<Definition id="poster">
				<Prop>poster</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Image URL displayed before video frames are available.</P>
			<Definition id="showProgressIndicator">
				<Prop>showProgressIndicator</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Shows loading feedback until <Code>canplay</Code> and during later <Code>waiting</Code> events. Errors show an
				alert instead.
			</P>
			<Definition id="src">
				<Prop>src</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				<Code>Video</Code> URL. Changing it mounts a fresh player and resets playback, progress, and captions state.
				Without a source, the loading indicator remains until disabled or media becomes ready.
			</P>
			<Definition id="videoAttributes">
				<Prop>videoAttributes</Prop>
				<TypeDef>{'VideoProps["videoAttributes"]'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Unmanaged native video attributes, such as <Code>preload</Code> and <Code>crossOrigin</Code>, apply to the inner
				video element. <Code>className</Code> is appended and <Code>style</Code> targets that element. Managed playback
				attributes, accessible naming, and media events use the component’s own props.
			</P>
			<Definition id="videoName">
				<Prop>videoName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Video'}</DefaultVal>
			</Definition>
			<P>
				Accessible name for the video. Blank names fall back to <Code>Video</Code>.
			</P>
			<Definition id="volume">
				<Prop>volume</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>
				Media <Code>volume</Code> from 0 to 1. Out-of-range values are clamped; nonfinite values fall back to 1.
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>
				Wrapper <Code>width</Code>. Numbers use pixels; CSS lengths are supported.
			</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other native attributes apply to the root div. <Code>className</Code> is appended and <Code>style</Code> is
				merged after component styles. Pointer and focus handlers are composed with the built-in visibility behavior.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onCanPlay">
				<Method>onCanPlay</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs when the browser reports that playback can begin. This is separate from its estimate that the entire video
				can <Code>play</Code> without buffering.
			</P>
			<Definition id="onCanPlayThrough">
				<Method>onCanPlayThrough</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>Runs when the browser estimates that playback can finish without further buffering.</P>
			<Definition id="onEnd">
				<Method>onEnd</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs on the native <Code>ended</Code> event. Native <Code>loop</Code> playback normally does not emit it.
			</P>
			<Definition id="onError">
				<Method>onError</Method>
				<TypeDef>{'(error: MediaError | null) => void'}</TypeDef>
			</Definition>
			<P>
				Runs on a native media error and receives the current media error, or <Code>null</Code> when none is available.
			</P>
			<Definition id="onFullScreenChange">
				<Method>onFullScreenChange</Method>
				<TypeDef>{'(fullScreen: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				Reports whether this player wrapper is the browser’s <Code>fullscreen</Code> element when{' '}
				<Code>fullscreen</Code> changes.
			</P>
			<Definition id="onLoadedFrameData">
				<Method>onLoadedFrameData</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs when the first current frame is loaded. It does not imply that playback has started or can continue without
				buffering.
			</P>
			<Definition id="onLoadMetaData">
				<Method>onLoadMetaData</Method>
				<TypeDef>{'(duration: number) => void'}</TypeDef>
			</Definition>
			<P>
				Receives duration in seconds when metadata loads. Live or unknown-duration sources can report infinity or{' '}
				<Code>NaN</Code>.
			</P>
			<Definition id="onLoadProgress">
				<Method>onLoadProgress</Method>
				<TypeDef>{'(progress: number) => void'}</TypeDef>
			</Definition>
			<P>
				Receives the end of the last buffered range divided by a finite duration, clamped to 0–1. No value is emitted
				until a valid duration and buffered range exist.
			</P>
			<Definition id="onPause">
				<Method>onPause</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>Runs on a native pause event, including the temporary pause used for scrubbing.</P>
			<Definition id="onPlay">
				<Method>onPlay</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs on a native <Code>play</Code> event. Use ref.<Code>play</Code>() when the caller needs a promise for
				successful playback.
			</P>
			<Definition id="onPlaybackRateChange">
				<Method>onPlaybackRateChange</Method>
				<TypeDef>{'(rate: number) => void'}</TypeDef>
			</Definition>
			<P>
				Receives the media playback rate on a native <Code>ratechange</Code> event.
			</P>
			<Definition id="onPlayStateChange">
				<Method>onPlayStateChange</Method>
				<TypeDef>{'(state: PlayState) => void'}</TypeDef>
			</Definition>
			<P>
				Reports changes among <Code>playing</Code>, paused, stopped, and <Code>ended</Code>. stopped represents the
				initial/reset state or a paused video at the beginning.
			</P>
			<Definition id="onProgress">
				<Method>onProgress</Method>
				<TypeDef>{'(progress: number) => void'}</TypeDef>
			</Definition>
			<P>
				Receives changed playback fractions from 0 to 1 on time updates. An unknown or nonfinite duration produces 0.
			</P>
			<Definition id="onQuit">
				<Method>onQuit</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>Runs when the simple controls close button is activated. The application owns dismissal.</P>
			<Definition id="onVolumeChange">
				<Method>onVolumeChange</Method>
				<TypeDef>{'(volume: number) => void'}</TypeDef>
			</Definition>
			<P>
				Receives the current numeric <Code>volume</Code> on native <Code>volumechange</Code> events, including{' '}
				<Code>mute</Code> changes. Muting preserves the numeric <Code>volume</Code>; read <Code>videoElement</Code>.
				<Code>muted</Code> if that distinction is needed.
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Other native div event handlers apply to the wrapper. Media callbacks above observe the inner video instead.
			</P>
			<H2 id="render-controls">Custom control render function</H2>
			<P>
				The function receives a <Code>VideoControlsContext</Code> on each render. State follows native media events,
				including changes made through browser controls or ref methods. The existing node-based <Code>children</Code>{' '}
				API remains available.
			</P>
			<CodeBlock filename="VideoControlsContext.ts" language="tsx" code={renderControlsCode} />
			<P>
				<Code>togglePlay</Code> starts or pauses playback; <Code>play</Code> always requests playback, and{' '}
				<Code>pause</Code> pauses without rewinding. Catch rejected promises from playback and fullscreen requests.{' '}
				<Code>toggleMute</Code> changes mute without changing numeric volume.
			</P>
			<P>
				<Code>setProgress</Code> seeks to a fraction from 0 to 1 and preserves the current playback state. It ignores
				nonfinite values and unavailable durations. Disable seeking while <Code>canSeek</Code> is false.{' '}
				<Code>setVolume</Code> clamps values to 0–1, uses 1 for nonfinite values, and does not unmute.{' '}
				<Code>toggleFullscreen</Code> enters or exits the player wrapper’s fullscreen mode.
			</P>
			<H2 id="ref">Ref</H2>
			<P>
				The ref exposes a <Code>VideoElement</Code> handle, rather than the DOM node itself. Use its methods for
				playback, sound, speed, and fullscreen; catch rejected playback and fullscreen requests.
			</P>
			<CodeBlock filename="ReplayVideo.tsx" language="tsx" code={refCode} />
			<Definition id="fullscreen">
				<Method>fullscreen</Method>
				<TypeDef>{'(state: boolean) => Promise<void>'}</TypeDef>
			</Definition>
			<P>
				Enters or exits <Code>fullscreen</Code> for the wrapper, keeping custom <Code>controls</Code> available. The
				browser may require a user gesture or reject an unsupported request.
			</P>
			<Definition id="mute">
				<Method>mute</Method>
				<TypeDef>{'(mute: boolean) => void'}</TypeDef>
			</Definition>
			<P>
				Sets the <Code>muted</Code> state without changing numeric <Code>volume</Code>.
			</P>
			<Definition id="play">
				<Method>play</Method>
				<TypeDef>{'() => Promise<void>'}</TypeDef>
			</Definition>
			<P>Starts playback. Resolves when the browser starts playback and rejects blocked or interrupted requests.</P>
			<Definition id="playbackRate">
				<Method>playbackRate</Method>
				<TypeDef>{'(rate: number) => void'}</TypeDef>
			</Definition>
			<P>Sets speed, clamped to 0.5–3; nonfinite values use 1.</P>
			<Definition id="restart">
				<Method>restart</Method>
				<TypeDef>{'() => Promise<void>'}</TypeDef>
			</Definition>
			<P>Pauses, seeks to the beginning, and starts playback. Returns the playback result, including rejection.</P>
			<Definition id="setVolume">
				<Method>setVolume</Method>
				<TypeDef>{'(volume: number) => void'}</TypeDef>
			</Definition>
			<P>
				Sets numeric <Code>volume</Code>, clamped to 0–1; nonfinite values use 1. Does not unmute.
			</P>
			<Definition id="stop">
				<Method>stop</Method>
				<TypeDef>{'() => Promise<void>'}</TypeDef>
			</Definition>
			<P>Pauses at the current position. It does not rewind.</P>
			<Definition id="videoElement">
				<Prop>videoElement</Prop>
				<TypeDef>{'HTMLVideoElement | undefined'}</TypeDef>
			</Definition>
			<P>
				Getter for the current native video element. A source change replaces it; read the getter again instead of
				caching the old element.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Video component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'captionsDefault', title: 'captionsDefault', code: true },
			{ id: 'captionsLabel', title: 'captionsLabel', code: true },
			{ id: 'captionsLanguage', title: 'captionsLanguage', code: true },
			{ id: 'captionsSrc', title: 'captionsSrc', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'controls', title: 'controls', code: true },
			{ id: 'customControls', title: 'customControls', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'loop', title: 'loop', code: true },
			{ id: 'muted', title: 'muted', code: true },
			{ id: 'objectFit', title: 'objectFit', code: true },
			{ id: 'playing', title: 'playing', code: true },
			{ id: 'playRate', title: 'playRate', code: true },
			{ id: 'playsInline', title: 'playsInline', code: true },
			{ id: 'poster', title: 'poster', code: true },
			{ id: 'showProgressIndicator', title: 'showProgressIndicator', code: true },
			{ id: 'src', title: 'src', code: true },
			{ id: 'videoAttributes', title: 'videoAttributes', code: true },
			{ id: 'videoName', title: 'videoName', code: true },
			{ id: 'volume', title: 'volume', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onCanPlay', title: 'onCanPlay', code: true },
			{ id: 'onCanPlayThrough', title: 'onCanPlayThrough', code: true },
			{ id: 'onEnd', title: 'onEnd', code: true },
			{ id: 'onError', title: 'onError', code: true },
			{ id: 'onFullScreenChange', title: 'onFullScreenChange', code: true },
			{ id: 'onLoadedFrameData', title: 'onLoadedFrameData', code: true },
			{ id: 'onLoadMetaData', title: 'onLoadMetaData', code: true },
			{ id: 'onLoadProgress', title: 'onLoadProgress', code: true },
			{ id: 'onPause', title: 'onPause', code: true },
			{ id: 'onPlay', title: 'onPlay', code: true },
			{ id: 'onPlaybackRateChange', title: 'onPlaybackRateChange', code: true },
			{ id: 'onPlayStateChange', title: 'onPlayStateChange', code: true },
			{ id: 'onProgress', title: 'onProgress', code: true },
			{ id: 'onQuit', title: 'onQuit', code: true },
			{ id: 'onVolumeChange', title: 'onVolumeChange', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
	{ id: 'render-controls', title: 'Custom control render function' },
	{
		id: 'ref',
		title: 'Ref',
		items: [
			{ id: 'fullscreen', title: 'fullscreen', code: true },
			{ id: 'mute', title: 'mute', code: true },
			{ id: 'play', title: 'play', code: true },
			{ id: 'playbackRate', title: 'playbackRate', code: true },
			{ id: 'restart', title: 'restart', code: true },
			{ id: 'setVolume', title: 'setVolume', code: true },
			{ id: 'stop', title: 'stop', code: true },
			{ id: 'videoElement', title: 'videoElement', code: true },
		],
	},
];

import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { CameraActionsPreview, CameraControlsPreview, CameraPreview, CameraWithVideoPreview } from './Preview';
import { controlsCode, optionalActionsCode, showOnStart, usageCode } from './code';

export default function CameraDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id="title">Camera component</H1>
			<P clipWidth>
				Preview live camera video, toggle the microphone, and capture still frames with built-in controls or your own
				actions.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				This example starts with video off and requests video only. However, by default, <Code>Camera</Code> starts
				automatically and requests both camera and microphone access.
			</P>
			<TipBox inline noBorder>
				Use the camera button to turn video on (and request camera access). Use the Photo button to capture or clear a
				still preview.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-camera--demo"
				components={[
					{ label: 'Camera preview', component: <CameraPreview />, code: { code: usageCode.trim() }, hasRefresh: true },
				]}
			/>

			<H3>Start with video and microphone on</H3>
			<P>
				Select Show Camera to run the demo. Controls start hidden and appear on hover when{' '}
				<Code>autoHideControlBar</Code> is set to <Code>true</Code>
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-camera--imperative-ref-controls"
				components={[
					{
						label: 'Automatic capture',
						component: <CameraWithVideoPreview />,
						code: { code: showOnStart.trim() },
						hasRefresh: true,
					},
				]}
			/>

			<H3>Optional profile and settings actions</H3>
			<P>
				Profile and settings buttons are hidden by default. Set <Code>showProfileButton</Code> or{' '}
				<Code>showSettingsButton</Code> to <Code>true</Code> to show either action. Use <Code>onChangeProfile</Code> and{' '}
				<Code>onChangeSettings</Code> to open your application’s UI.
			</P>
			<ComponentCanvas
				components={[
					{
						label: 'Optional actions',
						component: <CameraActionsPreview />,
						code: { code: optionalActionsCode.trim() },
						hasRefresh: true,
					},
				]}
			/>
			<H3>Use your own layout and controls</H3>
			<P>
				Set <Code>{'showControlBar={false}'}</Code> and attach a <Code>CameraElement</Code> ref. Ref's are the optimal
				way to access raw audio and video streams without interfering with react's UI rendering. Ref methods return
				errors as values; check <Code>result instanceof Error</Code> when your application needs to handle a failure.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-camera--imperative-ref-controls"
				components={[
					{
						label: 'Ref controls',
						component: <CameraControlsPreview />,
						code: { code: controlsCode.trim() },
						hasRefresh: true,
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Turning video off disables its track; it does not stop the stream. Muting the microphone also disables its
				track. Call <Code>stopCamera()</Code> to release capture. Unmounting, replacing devices, and failed attachment
				release Camera’s owned tracks automatically.
			</P>
			<P>
				Device IDs are preferences: unavailable devices can fall back to defaults. If microphone acquisition fails,
				video-only capture can still succeed. <Code>playLocalAudio</Code> controls speaker monitoring separately from
				microphone capture.
			</P>
			<P>
				Snapshots are synchronous PNG blobs. <Code>pipSnapshot</Code> shows the most recent frame inside the component;{' '}
				<Code>onSnapshot</Code> receives it for saving or uploading. The control bar’s profile and settings actions
				delegate their UI to your callbacks.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The toolbar uses native buttons with accessible names and disabled states. Tab moves between enabled actions;
				Enter or Space activates them. Focus reveals and keeps the auto-hidden toolbar visible.{' '}
				<Code>showControlBar={false}</Code> removes those buttons.
			</P>
			<P>
				Decorative transitions respect reduced motion. For custom controls, provide clear action labels and expose any
				recording or connection status your application needs; Camera does not create a live status announcement.
			</P>
			<H2 id="props">Props</H2>
			<P>All props are optional.</P>
			<Definition id="audio">
				<Prop>audio</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>Requests microphone input alongside video and shows the microphone control. False requests video only.</P>
			<Definition id="autoHideControlBar">
				<Prop>autoHideControlBar</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Hides the control bar after three seconds without pointer activity. Keyboard focus keeps it visible;{' '}
				<Code>false</Code> leaves it visible.
			</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>Frame background, including when video is off. Accepts a Slice color token or CSS color.</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-primary'}</DefaultVal>
			</Definition>
			<P>Frame border color. Accepts a Slice color token or CSS color.</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--corner-xxl)'}</DefaultVal>
			</Definition>
			<P>Frame corner radius. Numbers are pixels; strings are CSS lengths.</P>
			<Definition id="borderWidth">
				<Prop>borderWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>Solid frame border width. Numbers are pixels; strings are CSS lengths.</P>
			<Definition id="height">
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>
				Frame <Code>height</Code> in pixels or a CSS length.
			</P>
			<Definition id="noVideoPoster">
				<Prop>noVideoPoster</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'default poster'}</DefaultVal>
			</Definition>
			<P>
				Content shown while video is off or unsupported. The default shows <Code>userProfile</Code> when provided,
				otherwise “Video is off”.
			</P>
			<Definition id="pipSnapshot">
				<Prop>pipSnapshot</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Shows the captured still as a small overlay with a clear action. This is an in-component preview, not browser
				picture-in-picture.
			</P>
			<Definition id="playLocalAudio">
				<Prop>playLocalAudio</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Plays captured <Code>audio</Code> through local speakers when enabled. Leave <Code>false</Code> to avoid local
				microphone monitoring; this does not mute the captured track.
			</P>
			<Definition id="sessionSettings">
				<Prop>sessionSettings</Prop>
				<TypeDef>{'Settings'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Preferred device IDs: <Code>micDeviceId</Code> and <Code>videoDeviceId</Code>, both optional strings. Updating
				them replaces active or pending capture while preserving video-off and microphone mute choices. Missing devices
				can fall back to browser defaults.
			</P>
			<Definition id="showControlBar">
				<Prop>showControlBar</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>Renders the built-in control bar. False removes it entirely; control capture through the ref instead.</P>
			<Definition id="showProfileButton">
				<Prop>showProfileButton</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Shows the profile action when explicitly set to <Code>true</Code>. Requires <Code>showControlBar</Code>.
			</P>
			<Definition id="showSettingsButton">
				<Prop>showSettingsButton</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Shows the settings action when explicitly set to <Code>true</Code>. Requires <Code>showControlBar</Code>.
			</P>
			<Definition id="startAudioMuted">
				<Prop>startAudioMuted</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Initial microphone mute state for a capture session. Muting disables the <Code>audio</Code> track; it does not
				stop it. Changing this prop does not override an existing session’s mute choice.
			</P>
			<Definition id="startCameraOff">
				<Prop>startCameraOff</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Starts without requesting media when <Code>true</Code>. The camera button or <Code>startCamera()</Code> can
				start it manually. Changing to <Code>true</Code> stops capture; changing to <Code>false</Code> starts it.
			</P>
			<Definition id="userProfile">
				<Prop>userProfile</Prop>
				<TypeDef>{'UserProfile'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Profile metadata for the default poster and profile action: <Code>name</Code>, <Code>email</Code>, and{' '}
				<Code>avatar</Code> are optional strings.
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>
				Frame <Code>width</Code> in pixels or a CSS length.
			</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Native attributes apply to the root div. <Code>className</Code> is forwarded and <Code>style</Code> overrides
				generated styles. Pointer and focus handlers run alongside the control-bar behavior; <Code>children</Code> are
				managed internally.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onChangeProfile">
				<Method>onChangeProfile</Method>
				<TypeDef>{'(profile?: UserProfile) => void'}</TypeDef>
			</Definition>
			<P>Runs when User Info is activated. Your application supplies the profile UI.</P>
			<Definition id="onChangeSettings">
				<Method>onChangeSettings</Method>
				<TypeDef>{'(settings?: Settings, devices?: MediaDeviceInfo[] | Error) => void'}</TypeDef>
			</Definition>
			<P>
				Runs when Settings is activated with the current settings and cached devices. Enumeration runs in the
				background, so the list may initially be empty. Supply your own settings UI and pass updated IDs through{' '}
				<Code>sessionSettings</Code>.
			</P>
			<Definition id="onNoAudio">
				<Method>onNoAudio</Method>
				<TypeDef>{'(reason: Error) => void'}</TypeDef>
			</Definition>
			<P>
				Reports missing microphone input or an acquisition failure. Video may still start through the video-only
				fallback.
			</P>
			<Definition id="onNoVideo">
				<Method>onNoVideo</Method>
				<TypeDef>{'(reason: Error) => void'}</TypeDef>
			</Definition>
			<P>Reports unsupported camera APIs or failure to acquire or attach usable video.</P>
			<Definition id="onSnapshot">
				<Method>onSnapshot</Method>
				<TypeDef>{'(blob: Blob | undefined) => void'}</TypeDef>
			</Definition>
			<P>
				Runs synchronously after a snapshot attempt, with a PNG <Code>Blob</Code> or <Code>undefined</Code> when no
				frame can be captured. Clearing an existing preview does not call it.
			</P>
			<Definition id="onVideoStream">
				<Method>onVideoStream</Method>
				<TypeDef>{'(stream: MediaStream) => void'}</TypeDef>
			</Definition>
			<P>
				Runs when a newly acquired stream is ready, before device enumeration finishes. The stream belongs to Camera and
				its tracks are stopped on stop, replacement, or unmount.
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>Standard div event handlers apply to the root. The built-in controls use their own native button behavior.</P>
			<H2 id="ref">Ref</H2>
			<P>
				The ref exposes <Code>CameraElement</Code>. Methods are present once the handle is attached; media elements and
				tracks can be <Code>undefined</Code> before capture or after stopping. Synchronous methods return their result
				or an <Code>Error</Code>; asynchronous methods resolve to that union.
			</P>
			<Definition id="audioTrack">
				<Method>audioTrack</Method>
				<TypeDef>{'MediaStreamTrack | undefined'}</TypeDef>
			</Definition>
			<P>Current microphone track, when available.</P>
			<Definition id="container">
				<Method>container</Method>
				<TypeDef>{'HTMLDivElement | undefined'}</TypeDef>
			</Definition>
			<P>The root frame element.</P>
			<Definition id="devices">
				<Method>devices</Method>
				<TypeDef>{'() => Promise<MediaDeviceInfo[] | Error>'}</TypeDef>
			</Definition>
			<P>
				Requests a fresh device list independently of the cached list. Resolves to an <Code>Error</Code> if enumeration
				fails.
			</P>
			<Definition id="disableVideo">
				<Method>disableVideo</Method>
				<TypeDef>{'() => boolean | Error'}</TypeDef>
			</Definition>
			<P>Disables the current video track while keeping the stream and microphone alive.</P>
			<Definition id="enableVideo">
				<Method>enableVideo</Method>
				<TypeDef>{'() => MediaStream | Error'}</TypeDef>
			</Definition>
			<P>
				Enables an existing live video track without acquiring a new stream. Returns an <Code>Error</Code> if no live
				video track is available.
			</P>
			<Definition id="muteMic">
				<Method>muteMic</Method>
				<TypeDef>{'() => boolean | Error'}</TypeDef>
			</Definition>
			<P>Disables the current microphone track without stopping it.</P>
			<Definition id="snapshot">
				<Method>snapshot</Method>
				<TypeDef>{'(options?: CameraSnapshotOptions) => Blob | undefined'}</TypeDef>
			</Definition>
			<P>
				Captures the current frame synchronously as a PNG. Options: <Code>width</Code> and <Code>height</Code> override
				output dimensions; <Code>toggle</Code> clears an existing preview instead of taking another image. Without
				dimensions, capture uses the source frame size.
			</P>
			<Definition id="startCamera">
				<Method>startCamera</Method>
				<TypeDef>{'() => Promise<MediaStream | Error>'}</TypeDef>
			</Definition>
			<P>
				Acquires capture or re-enables existing live video. Concurrent calls share a request. Resolves to an{' '}
				<Code>Error</Code> on failure or cancellation.
			</P>
			<Definition id="stopCamera">
				<Method>stopCamera</Method>
				<TypeDef>{'() => Promise<boolean | Error>'}</TypeDef>
			</Definition>
			<P>
				Cancels pending acquisition, stops owned tracks, and clears the attached stream. Returns an <Code>Error</Code>{' '}
				when there is no stream or pending request to stop.
			</P>
			<Definition id="stream">
				<Method>stream</Method>
				<TypeDef>{'MediaStream | undefined'}</TypeDef>
			</Definition>
			<P>
				Current owned stream. It can be attached while playback is still being prepared; use <Code>onVideoStream</Code>{' '}
				or await <Code>startCamera()</Code> for readiness.
			</P>
			<Definition id="toggleMic">
				<Method>toggleMic</Method>
				<TypeDef>{'() => boolean | Error'}</TypeDef>
			</Definition>
			<P>Toggles the current live microphone track’s enabled state.</P>
			<Definition id="toggleVideo">
				<Method>toggleVideo</Method>
				<TypeDef>{'() => Promise<MediaStream | boolean | Error>'}</TypeDef>
			</Definition>
			<P>Toggles existing live video. Starts capture if no live video track remains.</P>
			<Definition id="unmuteMic">
				<Method>unmuteMic</Method>
				<TypeDef>{'() => boolean | Error'}</TypeDef>
			</Definition>
			<P>Enables the current live microphone track.</P>
			<Definition id="video">
				<Method>video</Method>
				<TypeDef>{'HTMLVideoElement | undefined'}</TypeDef>
			</Definition>
			<P>The internal preview element, when mounted.</P>
			<Definition id="videoTrack">
				<Method>videoTrack</Method>
				<TypeDef>{'MediaStreamTrack | undefined'}</TypeDef>
			</Definition>
			<P>Current video track, when available.</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Camera component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'audio', title: 'audio', code: true },
			{ id: 'autoHideControlBar', title: 'autoHideControlBar', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'noVideoPoster', title: 'noVideoPoster', code: true },
			{ id: 'pipSnapshot', title: 'pipSnapshot', code: true },
			{ id: 'playLocalAudio', title: 'playLocalAudio', code: true },
			{ id: 'sessionSettings', title: 'sessionSettings', code: true },
			{ id: 'showControlBar', title: 'showControlBar', code: true },
			{ id: 'showProfileButton', title: 'showProfileButton', code: true },
			{ id: 'showSettingsButton', title: 'showSettingsButton', code: true },
			{ id: 'startAudioMuted', title: 'startAudioMuted', code: true },
			{ id: 'startCameraOff', title: 'startCameraOff', code: true },
			{ id: 'userProfile', title: 'userProfile', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChangeProfile', title: 'onChangeProfile', code: true },
			{ id: 'onChangeSettings', title: 'onChangeSettings', code: true },
			{ id: 'onNoAudio', title: 'onNoAudio', code: true },
			{ id: 'onNoVideo', title: 'onNoVideo', code: true },
			{ id: 'onSnapshot', title: 'onSnapshot', code: true },
			{ id: 'onVideoStream', title: 'onVideoStream', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
	{
		id: 'ref',
		title: 'Ref',
		items: [
			{ id: 'audioTrack', title: 'audioTrack', code: true },
			{ id: 'container', title: 'container', code: true },
			{ id: 'devices', title: 'devices', code: true },
			{ id: 'disableVideo', title: 'disableVideo', code: true },
			{ id: 'enableVideo', title: 'enableVideo', code: true },
			{ id: 'muteMic', title: 'muteMic', code: true },
			{ id: 'snapshot', title: 'snapshot', code: true },
			{ id: 'startCamera', title: 'startCamera', code: true },
			{ id: 'stopCamera', title: 'stopCamera', code: true },
			{ id: 'stream', title: 'stream', code: true },
			{ id: 'toggleMic', title: 'toggleMic', code: true },
			{ id: 'toggleVideo', title: 'toggleVideo', code: true },
			{ id: 'unmuteMic', title: 'unmuteMic', code: true },
			{ id: 'video', title: 'video', code: true },
			{ id: 'videoTrack', title: 'videoTrack', code: true },
		],
	},
];

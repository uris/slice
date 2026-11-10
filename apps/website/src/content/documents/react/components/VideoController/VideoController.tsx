import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { VideoControllerPreview } from './VideoControllerPreview';
import { clearCode, usageCode } from './code';

export default function VideoControllerDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">VideoController component</H1>
			<P clipWidth>Open a video in a movable modal player from anywhere in your application.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Mount one <Code>VideoController</Code> within your theme provider, outside containers that clip or transform
				fixed layers. Call <Code>videoActions.show</Code> with a component and its <Code>VideoProps</Code>. Use{' '}
				<Code openURL="/docs/react/video/">Video</Code> for the standard player.
			</P>
			<TipBox inline noBorder>
				Open the video, drag the Move video handle, then close it with Escape, the close action, or the backdrop.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-videocontroller--default"
				components={[
					{
						label: 'Overlay video player',
						component: <VideoControllerPreview />,
						code: usageCode.trim(),
						codeFilename: 'VideoExample.tsx',
						hasRefresh: true,
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				While loading or buffering, playback controls, close buttons, and the drag handle are hidden. Only the loading
				indicator is shown when enabled. Escape and backdrop clicks still dismiss the player. The configured controls
				return when the player reports <Code>canplay</Code>.
			</P>
			<P>
				The shared store holds one <Code>VideoDescriptor</Code> or <Code>null</Code>. A descriptor contains{' '}
				<Code>component: React.ComponentType&lt;VideoProps&gt;</Code>, optional <Code>props: VideoProps</Code>, and
				optional <Code>id: string</Code>.
			</P>
			<P>
				A new descriptor replaces the current player and resets its position. Passing the same descriptor object again
				does nothing; create a new object to reopen it. The optional <Code>id</Code> does not preserve the old player
				instance.
			</P>
			<P>
				Playback pauses as dismissal begins. The dialog becomes inert while its exit animation finishes. A stale close
				action cannot clear a newer video. A custom player must apply the supplied <Code>VideoProps</Code>, including{' '}
				<Code>onQuit</Code> and media callbacks, for controller integration.
			</P>
			<P>
				An explicit controller <Code>customControls</Code> replaces the descriptor’s entire selection. Omitted flags are
				off; without either selection, the player uses its configured mode. Its <Code>showProgressIndicator</Code> takes
				precedence; its <Code>borderRadius</Code> falls back to the descriptor’s radius, then <Code>corner-m</Code>.
			</P>
			<P>
				Safari may stop delivering mouse clicks to controls after pausing in fullscreen, including with native controls.
				This known browser issue is tracked separately.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The player is a named modal dialog. Opening moves focus inside, traps Tab navigation, makes surrounding content
				inert, and locks page scrolling. Dismissal restores focus to the opener when it is still available.
			</P>
			<P>
				Escape dismisses the player. With <Code>draggable</Code> enabled, focus the <Code>Move video</Code> handle and
				use arrow keys to move by up to 10 pixels within its bounds. Provide captions and a descriptive{' '}
				<Code>videoName</Code> through the descriptor’s <Code>props</Code>.
			</P>
			<H2 id="props">Props</H2>
			<Definition id="animate">
				<Prop>animate</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{"'animate'"}</DefaultVal>
			</Definition>
			<P>
				Name of the visible state in <Code>variants</Code>.
			</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'Video radius or corner-m'}</DefaultVal>
			</Definition>
			<P>
				Overrides the player’s <Code>borderRadius</Code>. Numbers are pixels; strings accept CSS lengths or tokens.
			</P>
			<Definition id="customControls">
				<Prop>customControls</Prop>
				<TypeDef>{'CustomVideoControls'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Replaces the descriptor’s entire <Code>customControls</Code> selection. Only flags set to <Code>true</Code> are
				enabled, taking precedence over the player’s control mode. The <Code>quit</Code> setting manages the close
				control separately.
			</P>
			<Definition id="dialogName">
				<Prop>dialogName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{"'Video player'"}</DefaultVal>
			</Definition>
			<P>
				Accessible name of the dialog. Empty names fall back to <Code>Video player</Code>.
			</P>
			<Definition id="dragConstraintsRef">
				<Prop>dragConstraintsRef</Prop>
				<TypeDef>{'React.RefObject<HTMLElement | null>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Bounds for dragging and arrow-key movement. Omit it to use the controller’s viewport host.</P>
			<Definition id="draggable">
				<Prop>draggable</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Shows a separate <Code>Move video</Code> handle. Dragging the video itself does not move the dialog.
			</P>
			<Definition id="dragIcon">
				<Prop>dragIcon</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{"'basic.menu'"}</DefaultVal>
			</Definition>
			<P>
				Icon displayed in the drag handle once the player is ready. Its accessible name remains <Code>Move video</Code>.
			</P>
			<Definition id="exit">
				<Prop>exit</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{"'exit'"}</DefaultVal>
			</Definition>
			<P>
				Name of the leaving state in <Code>variants</Code>.
			</P>
			<Definition id="initial">
				<Prop>initial</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{"'initial'"}</DefaultVal>
			</Definition>
			<P>
				Name of the starting state in <Code>variants</Code>.
			</P>
			<Definition id="overlayColor">
				<Prop>overlayColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{"'rgb(0,0,0)'"}</DefaultVal>
			</Definition>
			<P>Backdrop color; accepts theme color names and CSS colors.</P>
			<Definition id="overlayOpacity">
				<Prop>overlayOpacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.7'}</DefaultVal>
			</Definition>
			<P>
				Opacity of the backdrop, clamped to the range from 0 to 1 by <Code>Overlay</Code>.
			</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{"'var(--spacing-xxl)'"}</DefaultVal>
			</Definition>
			<P>Left and right inset of the player. Numbers are pixels; strings accept CSS lengths or spacing tokens.</P>
			<Definition id="quit">
				<Prop>quit</Prop>
				<TypeDef>{"'inside' | 'outside' | 'none'"}</TypeDef>
				<DefaultVal>{"'inside'"}</DefaultVal>
			</Definition>
			<P>
				<Code>inside</Code> uses the player’s progress-bar close action when available, with an outside fallback when
				that control cannot render. <Code>outside</Code> shows a separate close button once ready.
				<Code>none</Code> hides close buttons. All close buttons remain hidden during loading and errors; Escape and
				backdrop dismissal remain available.
			</P>
			<Definition id="showProgressIndicator">
				<Prop>showProgressIndicator</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>Overrides the player’s loading-indicator setting.</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Theme Water timing'}</DefaultVal>
			</Definition>
			<P>Motion timing for entry and exit. Explicit values override theme Water defaults.</P>
			<Definition id="variants">
				<Prop>variants</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'Opacity 0 \u2192 1 \u2192 0'}</DefaultVal>
			</Definition>
			<P>
				Motion states for entry, visibility, and exit. Pair custom state names with <Code>initial</Code>,{' '}
				<Code>animate</Code>, and <Code>exit</Code>. Reduced motion skips these animations.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onQuit">
				<Method>onQuit</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs after dismissal through Escape, the backdrop, or a close action. The descriptor’s <Code>props.onQuit</Code>{' '}
				runs first, then the controller’s callback. Programmatic clearing and replacement do not call either callback.
				Other media events belong in the descriptor’s <Code>props</Code>.
			</P>
			<P>
				<Code>VideoController</Code> does not forward arbitrary DOM attributes or events.
			</P>
			<H2 id="store">Store actions</H2>
			<Definition id="show">
				<Method>videoActions.show</Method>
				<TypeDef>{'(video: VideoDescriptor | null) => void'}</TypeDef>
			</Definition>
			<P>
				Opens or replaces the active video. Passing <Code>null</Code> clears it. Import from{' '}
				<Code>@apple-pie/slice/stores/video</Code>; <Code>useVideoActions</Code> exposes the same actions in React.
			</P>
			<Definition id="clear">
				<Method>videoActions.clear</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Dismisses the current video programmatically without running <Code>onQuit</Code>.
			</P>
			<CodeBlock filename="CloseVideo.ts" language="tsx" code={clearCode.trim()} />
			<P>
				<Code>useVideo</Code> subscribes to the active descriptor; <Code>getVideo</Code> reads it without subscribing.
				Both return <Code>VideoDescriptor | null</Code>.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'VideoController component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{ id: 'props', title: 'Props' },
	{ id: 'animate', title: 'animate', code: true },
	{ id: 'borderRadius', title: 'borderRadius', code: true },
	{ id: 'customControls', title: 'customControls', code: true },
	{ id: 'dialogName', title: 'dialogName', code: true },
	{ id: 'dragConstraintsRef', title: 'dragConstraintsRef', code: true },
	{ id: 'draggable', title: 'draggable', code: true },
	{ id: 'dragIcon', title: 'dragIcon', code: true },
	{ id: 'exit', title: 'exit', code: true },
	{ id: 'initial', title: 'initial', code: true },
	{ id: 'overlayColor', title: 'overlayColor', code: true },
	{ id: 'overlayOpacity', title: 'overlayOpacity', code: true },
	{ id: 'padding', title: 'padding', code: true },
	{ id: 'quit', title: 'quit', code: true },
	{ id: 'showProgressIndicator', title: 'showProgressIndicator', code: true },
	{ id: 'transition', title: 'transition', code: true },
	{ id: 'variants', title: 'variants', code: true },
	{ id: 'events', title: 'Events' },
	{ id: 'onQuit', title: 'onQuit', code: true },
	{ id: 'store', title: 'Store actions' },
	{ id: 'show', title: 'videoActions.show', code: true },
	{ id: 'clear', title: 'videoActions.clear', code: true },
];

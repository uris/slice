import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset, ToastType } from '@apple-pie/slice';
import { ToastPreview } from './ToastPreview';
import { errorCode, parentCode, persistentCode, successCode, usageCode, warningCode } from './code';
export function ToastDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Toast component</H1>
			<P clipWidth>{'Confirm a result or share a brief update while people stay with their current task.'}</P>
			<H2 id="usage">Usage</H2>
			<P>
				{'Pass a '}
				<Code>{'message'}</Code>
				{' to show a notification. A fresh React '}
				<Code>{'key'}</Code>
				{' gives each notification its own lifecycle, including when the same message is shown again.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-toast--demo"
				components={[
					{
						label: 'Basic usage',
						component: <ToastPreview type={ToastType.Success} timed />,
						code: usageCode.trim(),
						codeFilename: 'ToastExample.tsx',
					},
				]}
			/>
			<TipBox inline noBorder title="Tip:">
				{
					'Use Show toast to replay a notification. In the timed example, hover or focus the notification to pause dismissal.'
				}
			</TipBox>
			<H3>Keep a notification visible</H3>
			<P>
				{'Use '}
				<Code>{'duration="Infinite"'}</Code>
				{' for a persistent notification. '}
				<Code>{'progress'}</Code>
				{' controls the working indicator.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-toast--demo"
				components={[
					{
						label: 'Keep a notification visible',
						component: <ToastPreview progress />,
						code: persistentCode.trim(),
						codeFilename: 'persistentCode.tsx',
					},
				]}
			/>
			<H3>Position inside a container</H3>
			<P>
				{'Use '}
				<Code>{'container="parent"'}</Code>
				{' inside a positioned element. Otherwise the notification is fixed to the viewport.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-toast--demo"
				components={[
					{
						label: 'Position inside a container',
						component: <ToastPreview timed position="top" />,
						code: parentCode.trim(),
						codeFilename: 'parentCode.tsx',
					},
				]}
			/>
			<H3>Choose a notification type</H3>
			<P>
				Use <Code>type</Code> to distinguish a result, warning, or error.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-toast--demo"
				components={[
					{ label: 'Success', component: <ToastPreview type={ToastType.Success} />, code: successCode.trim() },
					{ label: 'Warning', component: <ToastPreview type={ToastType.Warning} />, code: warningCode.trim() },
					{ label: 'Error', component: <ToastPreview type={ToastType.Error} />, code: errorCode.trim() },
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				{'A message is scheduled after '}
				<Code>{'showDelay'}</Code>
				{', then remains visible for '}
				<Code>{'duration'}</Code>
				{'. Changing only '}
				<Code>{'notifId'}</Code>
				{' does not restart the message timer; use a fresh component key for a new notification.'}
			</P>
			<P>
				{
					'Hover or focus clears the dismissal timer. Leaving or blurring restarts the full duration, rather than the remaining time. Simultaneous hover/focus handling needs refinement.'
				}
			</P>
			<P>
				{'Persistent notifications show a dismiss control even when '}
				<Code>{'close'}</Code>
				{' is false. Without an explicit '}
				<Code>{'progress'}</Code>
				{', persistent notifications also show the progress indicator.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'The message uses a polite status live region. Dismissal supports pointer and keyboard activation, although its current implementation uses a div with button semantics rather than a native button.'
				}
			</P>
			<P>
				{
					'Messages disappear automatically unless persistent. Hover/focus pauses the timer, but overlapping interaction states and repeated updates need review. Motion is currently fixed internally and does not observe reduced-motion preferences.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>{'All component props are optional.'}</P>
			<Definition id="border">
				<Prop>border</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows the notification border.'}</P>
			<Definition id="close">
				<Prop>close</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows the dismiss control for timed notifications. Persistent notifications always show it.'}</P>
			<Definition id="container">
				<Prop>container</Prop>
				<TypeDef>{"'window' | 'parent'"}</TypeDef>
				<DefaultVal>{'window'}</DefaultVal>
			</Definition>
			<P>{'Use fixed viewport positioning or absolute positioning inside a positioned parent.'}</P>
			<Definition id="duration">
				<Prop>duration</Prop>
				<TypeDef>{"number | 'Infinite'"}</TypeDef>
				<DefaultVal>{'5000'}</DefaultVal>
			</Definition>
			<P>
				{
					'Visible duration in milliseconds, after the show delay. The current persistent sentinel is the capitalized string '
				}
				<Code>{'Infinite'}</Code>
				{'.'}
			</P>
			<Definition id="message">
				<Prop>message</Prop>
				<TypeDef>{'string | null'}</TypeDef>
				<DefaultVal>{'null'}</DefaultVal>
			</Definition>
			<P>{'Text to display. Null or an empty string clears the content.'}</P>
			<Definition id="notifId">
				<Prop>notifId</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Identity used as the animated wrapper’s key. It does not independently reschedule visibility.'}</P>
			<Definition id="offset">
				<Prop>offset</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'24'}</DefaultVal>
			</Definition>
			<P>{'Distance from the selected top or bottom edge in pixels.'}</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'8px 16px; close edge 12px'}</DefaultVal>
			</Definition>
			<P>
				{
					'Notification padding. With the close control enabled, the built-in right inset is reduced by 4px. Explicit values, including zero, are used as provided.'
				}
			</P>
			<Definition id="position">
				<Prop>position</Prop>
				<TypeDef>{"'top' | 'bottom'"}</TypeDef>
				<DefaultVal>{'bottom'}</DefaultVal>
			</Definition>
			<P>{'Edge used for entry, placement, and exit.'}</P>
			<Definition id="progress">
				<Prop>progress</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true for Infinite; false otherwise'}</DefaultVal>
			</Definition>
			<P>{'Shows the progress indicator. An explicit value overrides the duration-based default.'}</P>
			<Definition id="radius">
				<Prop>radius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-m (8px)'}</DefaultVal>
			</Definition>
			<P>{'Notification corner radius. This is the current public name.'}</P>
			<Definition id="showDelay">
				<Prop>showDelay</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Milliseconds to wait before setting the notification content.'}</P>
			<Definition id="textSize">
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Notification typography size.'}</P>
			<Definition id="type">
				<Prop>type</Prop>
				<TypeDef>{'ToastType'}</TypeDef>
				<DefaultVal>{'ToastType.Info'}</DefaultVal>
			</Definition>
			<P>
				{'Color treatment: '}
				<Code>{'Info'}</Code>
				{', '}
				<Code>{'Success'}</Code>
				{', '}
				<Code>{'Warning'}</Code>
				{', or '}
				<Code>{'Error'}</Code>
				{'.'}
			</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{"HTMLMotionProps<'div'>"}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				{'Attributes apply to the visible Motion wrapper. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{
					' is merged. Content and animation states are component-managed; incidental Motion gestures are not part of the documented API.'
				}
			</P>
			<H2 id="events">Events</H2>
			<Definition id="didHide">
				<Method>didHide</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>{'Runs after the notification’s exit animation completes. It receives no dismissal reason or payload.'}</P>
			<Definition id="onShow">
				<Method>onShow</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>{'Declared in the public type but not called by the current implementation.'}</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{"HTMLMotionProps<'div'>"}</TypeDef>
			</Definition>
			<P>
				{
					'Other wrapper events are forwarded. Mouse-enter/leave and focus/blur are reserved for the internal timer behavior.'
				}
			</P>
			<H2 id="ref">Ref</H2>
			<Definition id="componentRef">
				<Prop>ref</Prop>
				<TypeDef>{'React.Ref<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>{'The forwarded ref points to the visible notification div and becomes null when it unmounts.'}</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Toast component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'border', title: 'border', code: true },
			{ id: 'close', title: 'close', code: true },
			{ id: 'container', title: 'container', code: true },
			{ id: 'duration', title: 'duration', code: true },
			{ id: 'message', title: 'message', code: true },
			{ id: 'notifId', title: 'notifId', code: true },
			{ id: 'offset', title: 'offset', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'position', title: 'position', code: true },
			{ id: 'progress', title: 'progress', code: true },
			{ id: 'radius', title: 'radius', code: true },
			{ id: 'showDelay', title: 'showDelay', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'type', title: 'type', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'didHide', title: 'didHide', code: true },
			{ id: 'onShow', title: 'onShow', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
	{ id: 'ref', title: 'Ref', items: [{ id: 'componentRef', title: 'ref', code: true }] },
];
export default ToastDoc;

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset, ToastType } from '@apple-pie/slice';
import { Fragment } from 'react';
import { ToastPreview } from './ToastPreview';
import {
	actionCode,
	errorCode,
	motionCode,
	parentCode,
	persistentCode,
	storeCode,
	successCode,
	usageCode,
	warningCode,
} from './code';

const toastProps = [
	{ name: 'border', type: 'boolean', defaultValue: 'true', description: 'Shows the notification border.' },
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: 'corner-m (8px)',
		description: 'Corner radius. Numbers use pixels; CSS lengths pass through.',
	},
	{
		name: 'close',
		type: 'boolean',
		defaultValue: 'true',
		description: 'Shows a native dismiss button, independently of duration and progress.',
	},
	{
		name: 'closeLabel',
		type: 'string',
		defaultValue: 'Dismiss notification',
		description: 'Accessible dismiss button label. Empty labels use the default.',
	},
	{
		name: 'container',
		type: "'window' | 'parent'",
		defaultValue: 'window',
		description: 'Uses fixed viewport positioning or absolute positioning inside a positioned parent.',
	},
	{
		name: 'data',
		type: 'T',
		defaultValue: 'undefined',
		description:
			'Application payload passed to onClick. Its shape is inferred from this value or supplied as Toast<T>.',
	},
	{
		name: 'duration',
		type: "number | 'infinite'",
		defaultValue: '5000',
		description:
			'Visible duration in milliseconds. Infinite disables automatic dismissal. Changing this value restarts the lifetime while preserving an interaction pause.',
	},
	{
		name: 'message',
		type: 'string | null',
		defaultValue: 'null',
		description: 'Notification text. Null or an empty string clears the current notification.',
	},
	{
		name: 'notificationId',
		type: 'string',
		defaultValue: 'undefined',
		description:
			'A new ID starts a new notification, even when the message is identical. The optional store generates IDs automatically.',
	},
	{
		name: 'offset',
		type: 'number',
		defaultValue: '24',
		description: 'Inset from the selected edge and minimum horizontal clearance, in pixels.',
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '8px 16px; close edge 12px',
		description: 'Inner spacing. Explicit values, including zero, are used as supplied.',
	},
	{
		name: 'position',
		type: "'top' | 'bottom'",
		defaultValue: 'bottom',
		description: 'Edge used for placement and default entry/exit direction.',
	},
	{
		name: 'progress',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Shows a working indicator independently of duration. Reduced motion uses a static indicator.',
	},
	{
		name: 'showDelay',
		type: 'number',
		defaultValue: '0',
		description:
			'Delay before showing a new notification, in milliseconds. Changes reschedule a pending show without replaying visible content.',
	},
	{ name: 'textSize', type: "'xs' | 's' | 'm' | 'l' | 'xl'", defaultValue: 'm', description: 'Body typography size.' },
	{
		name: 'type',
		type: "ToastType | 'info' | 'success' | 'warning' | 'error'",
		defaultValue: 'info',
		description: 'Notification color treatment.',
	},
	{
		name: 'urgency',
		type: "'polite' | 'assertive'",
		defaultValue: 'polite',
		description: 'Announcement priority. Use assertive for updates that require immediate attention.',
	},
	{
		name: 'divAttributes',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		defaultValue: 'undefined',
		description:
			'Native attributes apply to the visible wrapper. Class names are appended and styles are merged. Content, ARIA semantics, animation states, and native drag/animation-start handlers are component-managed.',
	},
];

export function ToastDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Toast component</H1>
			<P clipWidth>{'Confirm a result or share a brief update while people stay with their current task.'}</P>
			<H2 id="usage">Usage</H2>
			<P>
				Pass a <Code>message</Code> to show a notification. Change <Code>notificationId</Code> to replay the same text
				without remounting the component.
			</P>
			<TipBox inline noBorder>
				{
					'Use Show toast to replay a notification. In the timed example, hover or focus the notification to pause dismissal.'
				}
			</TipBox>
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
			<H3>Keep a notification visible</H3>
			<P>
				{'Use '}
				<Code>{'duration="infinite"'}</Code>
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
				A new <Code>message</Code> or <Code>notificationId</Code> starts a notification after <Code>showDelay</Code>.
				Hover and focus pause the remaining duration; dismissal resumes only after both end.
			</P>
			<P>
				<Code>duration="infinite"</Code>, <Code>close</Code>, and <Code>progress</Code> are independent. Long messages
				wrap within the viewport or parent.
			</P>
			<H3>Compose with the toast store</H3>
			<P>
				The optional store holds one notification. Each push generates a fresh ID unless supplied. Spread its value
				directly into <Code>Toast</Code> and pass <Code>toastActions.clear</Code> to <Code>onHide</Code>; identity
				checks keep an older exit from clearing a newer notification. Queuing and stacking are application decisions.
			</P>
			<CodeBlock code={storeCode.trim()} language="tsx" />
			<H3>Attach an action</H3>
			<P>
				Attach a typed <Code>data</Code> payload and handle <Code>onClick(event, data)</Code>. The data type is
				inferred, or can be supplied explicitly as <Code>Toast&lt;T&gt;</Code>. The optional shared store accepts typed
				payloads and handlers directly.
			</P>
			<CodeBlock code={actionCode.trim()} language="tsx" />
			<H2 id="accessibility">Accessibility</H2>
			<P>
				A persistent live region announces updates politely by default. <Code>urgency="assertive"</Code> uses an alert.
				The dismiss button supports Enter and Space and has a visible keyboard focus indicator. Notifications do not
				take focus automatically.
			</P>
			<P>
				Hover or keyboard focus pauses automatic dismissal. Dismissing from inside the notification restores the
				previously focused element when available. Reduced-motion preferences are observed live: movement, fading,
				custom delays, and indicator rotation stop.
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional.</P>
			{toastProps.map(({ name, type, defaultValue, description }) => (
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
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Overrides the <Code>initial</Code>, <Code>animate</Code>, and <Code>exit</Code> states. Defaults fade and move
				8px from the selected edge.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>Transition</TypeDef>
				<DefaultVal>Water theme transition</DefaultVal>
			</Definition>
			<P>
				Overrides the theme motion transition. Reduced-motion preferences override both motion props with immediate,
				static states.
			</P>
			<CodeBlock code={motionCode.trim()} language="tsx" />
			<H2 id="events">Events</H2>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>(event: React.MouseEvent&lt;HTMLDivElement&gt;, data: T | undefined) =&gt; void</TypeDef>
			</Definition>
			<P>
				Runs on pointer activation or Enter/Space on the toast action button. Receives the wrapper click event and
				current <Code>data</Code>. Data is undefined when omitted. The dismiss button does not trigger this callback.
				Activation does not dismiss automatically; the application controls the action.
			</P>
			<Definition id="onHide">
				<Method>onHide</Method>
				<TypeDef>(info: ToastHideInfo) =&gt; void</TypeDef>
			</Definition>
			<P>
				Runs once after exit completes, with the original <Code>notificationId</Code>, <Code>message</Code>, and{' '}
				<Code>reason</Code>: <Code>timeout</Code>, <Code>dismiss</Code>, <Code>cleared</Code>, or <Code>replaced</Code>.
				Each notification retains its callback. Unmounting cancels timers without calling it.
			</P>
			<Definition id="onShow">
				<Method>onShow</Method>
				<TypeDef>(info: ToastInfo) =&gt; void</TypeDef>
			</Definition>
			<P>
				Runs once when the notification becomes visible after its show delay. Receives its <Code>notificationId</Code>{' '}
				and <Code>message</Code>.
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>React.HTMLAttributes&lt;HTMLDivElement&gt;</TypeDef>
			</Definition>
			<P>
				Native mouse-enter/leave and focus/blur handlers run alongside the internal pause behavior. Drag and
				animation-start handlers are excluded from the native event surface.
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
		items: toastProps.map(({ name }) => ({
			id: name,
			title: name === 'divAttributes' ? '...divAttributes' : name,
			code: true,
		})),
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'motionValues', title: 'motionValues', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: ['onClick', 'onHide', 'onShow', 'nativeEvents'].map((id) => ({
			id,
			title: id === 'nativeEvents' ? '...divEvents' : id,
			code: true,
		})),
	},
	{ id: 'ref', title: 'Ref', items: [{ id: 'componentRef', title: 'ref', code: true }] },
];
export default ToastDoc;

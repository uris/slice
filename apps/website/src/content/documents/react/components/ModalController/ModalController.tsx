import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ModalControllerPreview } from './ModalControllerPreview';
import { motionCode, responseCode, usageCode } from './code';
export function ModalControllerDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ModalController component</H1>
			<P clipWidth>{'Open a dialog from application code and collect its result through one shared host.'}</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-modalcontroller--default"
				components={[{ label: 'Open a dialog', component: <ModalControllerPreview /> }]}
			/>
			<TipBox inline noBorder title="Tip:">
				{
					'Open the dialog and use its action or close controls. This preview keeps it inside the canvas; app dialogs normally use the viewport.'
				}
			</TipBox>
			<H2 id="usage">Usage</H2>
			<P>
				{'Mount one controller for the app’s modal store. Pass a component to '}
				<Code>{'modalActions.show'}</Code>
				{
					'; the controller supplies its close, resolve, reject, and drag callbacks. Use a client component when server rendering with frameworks such as Next.js.'
				}
			</P>
			<P>
				{'The companion panel is '}
				<Code openURL="/docs/react/modal/">Modal</Code>
				{'.'}
			</P>
			<CodeBlock filename="ModalControllerExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Wait for a response</H3>
			<P>
				{'Use '}
				<Code>{'modalActions.modalResponse<T>'}</Code>
				{' when application logic needs a result. Match '}
				<Code>{'T'}</Code>
				{' to the values supplied by the dialog’s actions and handle rejection on cancellation or dismissal.'}
			</P>
			<CodeBlock filename="responseCode.tsx" language="tsx" code={responseCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{
					'The store holds one active modal. Showing another replaces it and rejects any pending response for the previous dialog.'
				}
			</P>
			<P>
				{
					'The controller calls callbacks supplied in the descriptor before settling the store response. Resolve and reject clear the active modal; close calls the store’s dismissal path.'
				}
			</P>
			<P>
				{
					'The title/footer pointer callback starts dragging when wired to a panel. The fullscreen presentation layer is fixed; the controller does not create a portal.'
				}
			</P>
			<P>
				Title-bar dragging moved the dialog in Chromium but did not move it in the WebKit preview. Cross-browser drag
				behavior needs review.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'Dialog naming, focus containment/restoration, initial focus, Escape handling, and background inertness are not currently implemented by this host. Supply those behaviors in the app until the controller is reviewed.'
				}
			</P>
			<P>
				{
					'Backdrop dismissal is configured through the overlay, but the fullscreen modal container can intercept pointer input before it reaches that backdrop. Use the panel’s explicit close/action controls.'
				}
			</P>
			<P>{'The current animation and drag behavior do not observe reduced-motion preferences.'}</P>
			<H2 id="props">Props</H2>
			<P>{'All component props are optional. Color props accept Slice tokens or CSS colors.'}</P>
			<Definition id="dragConstraintsRef">
				<Prop>dragConstraintsRef</Prop>
				<TypeDef>{'React.RefObject<HTMLElement | null>'}</TypeDef>
				<DefaultVal>{'internal container ref'}</DefaultVal>
			</Definition>
			<P>{'Element used as the drag boundary. Without it, the fixed controller container provides the constraint.'}</P>
			<Definition id="draggable">
				<Prop>draggable</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Enables Motion dragging, started through the callback supplied to the displayed component.'}</P>
			<Definition id="overlayColor">
				<Prop>overlayColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'rgb(0,0,0)'}</DefaultVal>
			</Definition>
			<P>{'Backdrop background color.'}</P>
			<Definition id="overlayOpacity">
				<Prop>overlayOpacity</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0.7'}</DefaultVal>
			</Definition>
			<P>{'Backdrop opacity.'}</P>
			<H2 id="motion">Motion</H2>
			<P>
				{
					'These props configure the internal Motion wrapper. Current defaults use fixed timing rather than Slice’s Water transition.'
				}
			</P>
			<CodeBlock filename="DialogMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id="animate">
				<Prop>animate</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'animate'}</DefaultVal>
			</Definition>
			<P>
				{'Name of the visible state in '}
				<Code>{'variants'}</Code>
				{'.'}
			</P>
			<Definition id="exit">
				<Prop>exit</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'exit'}</DefaultVal>
			</Definition>
			<P>{'Name of the exit state.'}</P>
			<Definition id="initial">
				<Prop>initial</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'initial'}</DefaultVal>
			</Definition>
			<P>{'Name of the entry state. The current type accepts a string rather than Motion’s full initial-value API.'}</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{"{ ease: 'easeOut', duration: 0.25, delay: 0.1 }"}</DefaultVal>
			</Definition>
			<P>
				{
					'Timing applied to the dialog wrapper. Supplied settings replace the default object and do not currently configure the backdrop transition.'
				}
			</P>
			<Definition id="variants">
				<Prop>variants</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'initial/exit: opacity 0, y 20; animate: opacity 1, y 0'}</DefaultVal>
			</Definition>
			<P>
				{
					'Animation states for the dialog wrapper. A supplied object replaces the defaults. This component intentionally uses Motion’s native '
				}
				<Code>{'variants'}</Code>
				{' API.'}
			</P>
			<H2 id="events">Events</H2>
			<P>No component-specific callbacks.</P>
			<P>
				{
					'Native div attributes and events are not forwarded by this controller. Lifecycle callbacks belong to the displayed modal component and its descriptor.'
				}
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'ModalController component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'dragConstraintsRef', title: 'dragConstraintsRef', code: true },
			{ id: 'draggable', title: 'draggable', code: true },
			{ id: 'overlayColor', title: 'overlayColor', code: true },
			{ id: 'overlayOpacity', title: 'overlayOpacity', code: true },
		],
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'animate', title: 'animate', code: true },
			{ id: 'exit', title: 'exit', code: true },
			{ id: 'initial', title: 'initial', code: true },
			{ id: 'transition', title: 'transition', code: true },
			{ id: 'variants', title: 'variants', code: true },
		],
	},
	{ id: 'events', title: 'Events' },
];
export default ModalControllerDoc;

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { ModalControllerPreview } from './ModalControllerPreview';
import { motionCode, responseCode, usageCode } from './code';

export function ModalControllerDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ModalController component</H1>
			<P clipWidth>{'Open a dialog from application code and collect its result through one shared host.'}</P>
			<H2 id="usage">Usage</H2>
			<P>
				Use the controller to mount a single <Code openURL="/docs/react/dialog-box/">DialogBox</Code> manager across
				your app. Then pass instances to the controller using its <Code>{'modalActions.show'}</Code> - the controller
				supplies its close, resolve, reject, and drag callbacks.
			</P>
			<TipBox inline noBorder>
				{'Open the dialog, drag it using the title bar, then try its action, close button, backdrop, or Escape.'}
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-modalcontroller--default"
				components={[
					{
						label: 'Basic usage',
						component: <ModalControllerPreview />,
						code: { code: usageCode.trim(), filename: 'ModalControllerExample.tsx' },
					},
				]}
			/>
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
					'The store holds one active modal. Showing another replaces it and rejects the previous pending response. Each presentation starts fresh, even when descriptor IDs are reused or omitted.'
				}
			</P>
			<P>
				{
					'Callbacks belong to the exact stored instance. Retained callbacks from a replaced or closed dialog cannot settle or dismiss its replacement. The controller settles the store before calling descriptor callbacks, so a throwing callback cannot leave the modal pending.'
				}
			</P>
			<P>
				{
					'The title/footer pointer callback starts dragging when enabled; action and close controls do not start a drag. Exiting panels are inert and no longer handle focus or Escape. The presentation is fixed; the controller does not create a portal.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				<Code openURL="/docs/react/dialog-box/">DialogBox</Code> supplies dialog naming and heading association. This
				host moves focus inside, contains keyboard focus, handles Escape, makes background content inert, and locks page
				scrolling. Focus and the previous scrolling state are restored when the active panel is dismissed; replacements
				receive their own initial focus.
			</P>
			<P>
				Click outside the panel to dismiss it. Reduced-motion preferences bypass panel and backdrop transitions,
				including variant-level delays and live changes during exit. Dragging remains a direct pointer interaction.
			</P>
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
			<P>{'These props configure the internal Motion wrapper with Slice’s Water transition as the default.'}</P>
			<CodeBlock filename="DialogMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id="motionValues">
				<Prop>motionValues</Prop>
				<TypeDef>Variants</TypeDef>
				<DefaultVal>initial/exit: opacity 0, y 20; animate: opacity 1, y 0</DefaultVal>
			</Definition>
			<P>
				Overrides the <Code>initial</Code>, <Code>animate</Code>, and <Code>exit</Code> states. Partial state values
				merge with the defaults, matching <Code>PopMenu</Code>. Reduced motion overrides custom movement, fading, and
				delays.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Water'}</DefaultVal>
			</Definition>
			<P>{'Timing merged with Slice’s Water transition for both the dialog wrapper and backdrop.'}</P>
			<H2 id="events">Events</H2>
			<P>No component-specific callbacks.</P>
			<P>
				{
					'Native div attributes and events are not forwarded by this controller. Lifecycle callbacks belong to the displayed modal component and its descriptor.'
				}
			</P>
		</FlexBox>
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
			{ id: 'motionValues', title: 'motionValues', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{ id: 'events', title: 'Events' },
];
export default ModalControllerDoc;

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ModalPreview } from './ModalPreview';
import { actionCode, scrollingCode, usageCode } from './code';
export function ModalDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Modal component</H1>
			<P clipWidth>{'Bring a decision, its context, and the next action into one compact panel.'}</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-modal--default"
				components={[
					{ label: 'Confirm an action', component: <ModalPreview /> },
					{ label: 'Scrolling content', component: <ModalPreview scroll /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				{'Render the panel when your app needs it, then close it from the action callbacks. '}
				<Code>{'Modal<T>'}</Code>
				{' shares the action value type with its callbacks; '}
				<Code>{'T'}</Code>
				{' defaults to '}
				<Code>{'string'}</Code>
				{'.'}
			</P>
			<P>
				{'For store-driven presentation and responses, use '}
				<Code openURL="/docs/react/modal-controller/">ModalController</Code>
				{'.'}
			</P>
			<CodeBlock filename="ModalExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Make room for longer content</H3>
			<P>
				{'Set '}
				<Code>{'maxHeight'}</Code>
				{' to limit the panel. Its content area scrolls while the title and actions remain in place.'}
			</P>
			<CodeBlock filename="scrollingCode.tsx" language="tsx" code={scrollingCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'Actions call '}
				<Code>{'onAction'}</Code>
				{' first. An action without '}
				<Code>{'promise'}</Code>
				{', or with '}
				<Code>{'promise="resolve"'}</Code>
				{', then calls '}
				<Code>{'onResolve'}</Code>
				{'. A reject action calls '}
				<Code>{'onReject'}</Code>
				{' with an Error whose cause is the action value.'}
			</P>
			<P>
				{'The close control calls '}
				<Code>{'onReject'}</Code>
				{' followed by '}
				<Code>{'onClose'}</Code>
				{'. The panel does not hide itself; your state or a controller removes it.'}
			</P>
			<P>
				{'When content is detected as scrolling, '}
				<Code>{'autoBorderBottom'}</Code>
				{' can add a divider above the actions. Scroll detection currently runs when content or '}
				<Code>{'maxHeight'}</Code>
				{' changes, rather than observing every resize.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{
					'This is a panel rather than a complete accessible dialog workflow. It does not supply dialog naming, focus containment, initial focus, Escape dismissal, or focus restoration. Provide that behavior in the surrounding application.'
				}
			</P>
			<P>
				{
					'Actions and the close affordance use buttons. Give every action a meaningful label, especially icon-only actions. The title and decorative icons still need semantic review.'
				}
			</P>
			<P>
				{
					'The panel has no built-in Motion transition; animation and reduced-motion behavior belong to its presenting layer.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>{'All component props are optional. Color props accept Slice tokens or CSS colors.'}</P>
			<Definition id="actions">
				<Prop>actions</Prop>
				<TypeDef>{'ModalAction<T>[]'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Action buttons shown in the footer. Actions default to the right; '}
				<Code>{'position'}</Code>
				{' can move them left. '}
				<Code>{'primary'}</Code>
				{' selects the solid button treatment. '}
				<Code>{'promise'}</Code>
				{' chooses the resolve or reject path.'}
			</P>
			<CodeBlock filename="ModalAction.ts" language="typescript" code={actionCode.trim()} />
			<Definition id="actionsBorderColor">
				<Prop>actionsBorderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Divider color above the footer.'}</P>
			<Definition id="actionsBorderWidth">
				<Prop>actionsBorderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Footer divider width in pixels. Automatic scrolling treatment can add a 1px divider when this is zero.'}</P>
			<Definition id="autoBorderBottom">
				<Prop>autoBorderBottom</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Enables automatic footer separation and extra content-bottom space when scrolling is detected.'}</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Panel background.'}</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Outer border color.'}</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-m (8px)'}</DefaultVal>
			</Definition>
			<P>{'Outer corner radius.'}</P>
			<Definition id="borderWidth">
				<Prop>borderWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>{'Outer border width in pixels or CSS units.'}</P>
			<Definition id="children">
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Content rendered in the scrollable body.'}</P>
			<Definition id="close">
				<Prop>close</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Shows the close button in the title area.'}</P>
			<Definition id="contentTextSize">
				<Prop>contentTextSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Typography size for body content.'}</P>
			<Definition id="maxHeight">
				<Prop>maxHeight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'400'}</DefaultVal>
			</Definition>
			<P>{'Maximum panel height in pixels or CSS units.'}</P>
			<Definition id="maxWidth">
				<Prop>maxWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'400'}</DefaultVal>
			</Definition>
			<P>{'Maximum panel width.'}</P>
			<Definition id="minHeight">
				<Prop>minHeight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'200'}</DefaultVal>
			</Definition>
			<P>{'Minimum panel height.'}</P>
			<Definition id="minWidth">
				<Prop>minWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'300'}</DefaultVal>
			</Definition>
			<P>{'Minimum panel width. Lower it for narrower layouts.'}</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'16px 24px'}</DefaultVal>
			</Definition>
			<P>
				{
					'Header/footer padding and body side insets. Body top padding is zero; bottom padding is calculated from scrolling and '
				}
				<Code>{'autoBorderBottom'}</Code>
				{'.'}
			</P>
			<Definition id="scrollHandleColor">
				<Prop>scrollHandleColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Content scrollbar thumb color.'}</P>
			<Definition id="scrollHandleColorHover">
				<Prop>scrollHandleColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Scrollbar thumb color on hover.'}</P>
			<Definition id="prop-title">
				<Prop>title</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Title-area text. The title area also appears when '}
				<Code>{'close'}</Code>
				{' is enabled.'}
			</P>
			<Definition id="titleBorderColor">
				<Prop>titleBorderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Divider color beneath the title area.'}</P>
			<Definition id="titleBorderWidth">
				<Prop>titleBorderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Title divider width in pixels.'}</P>
			<Definition id="titleColor">
				<Prop>titleColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-special'}</DefaultVal>
			</Definition>
			<P>{'Title text color.'}</P>
			<Definition id="titleIcon">
				<Prop>titleIcon</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Icon before the title.'}</P>
			<Definition id="titleIconFill">
				<Prop>titleIconFill</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Requests the filled title icon treatment.'}</P>
			<Definition id="titleTextSize">
				<Prop>titleTextSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'l'}</DefaultVal>
			</Definition>
			<P>{'Title-area typography size.'}</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				{'Native attributes apply to the outer panel div. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged. The current public type uses '}
				<Code>{'HTMLElement'}</Code>
				{'; dialog semantics are not supplied automatically.'}
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onAction">
				<Method>onAction</Method>
				<TypeDef>{'(value?: T) => void'}</TypeDef>
			</Definition>
			<P>{'Runs for an action before its resolve or reject callback.'}</P>
			<Definition id="onClose">
				<Method>onClose</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs after '}
				<Code>{'onReject'}</Code>
				{' when the close button is activated.'}
			</P>
			<Definition id="onDragPointerDown">
				<Method>onDragPointerDown</Method>
				<TypeDef>{'(event: React.PointerEvent<any>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Receives pointer-down from the title and footer drag surfaces. A controller can use it to start dragging.'}
			</P>
			<Definition id="onReject">
				<Method>onReject</Method>
				<TypeDef>{'(value?: Error) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs for a reject action or the close button. Action errors carry the action value in '}
				<Code>{'cause'}</Code>
				{'.'}
			</P>
			<Definition id="onResolve">
				<Method>onResolve</Method>
				<TypeDef>{'(value?: T) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs for resolve actions, including actions without an explicit '}
				<Code>{'promise'}</Code>
				{' value.'}
			</P>
			<Definition id="onToolTip">
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>{'Receives tooltip metadata from the action and close buttons; your app displays the tooltip.'}</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Other native handlers apply to the outer panel. The drag callback above is intentional and uses the title/footer surfaces.'
				}
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Modal component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'actions', title: 'actions', code: true },
			{ id: 'actionsBorderColor', title: 'actionsBorderColor', code: true },
			{ id: 'actionsBorderWidth', title: 'actionsBorderWidth', code: true },
			{ id: 'autoBorderBottom', title: 'autoBorderBottom', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'close', title: 'close', code: true },
			{ id: 'contentTextSize', title: 'contentTextSize', code: true },
			{ id: 'maxHeight', title: 'maxHeight', code: true },
			{ id: 'maxWidth', title: 'maxWidth', code: true },
			{ id: 'minHeight', title: 'minHeight', code: true },
			{ id: 'minWidth', title: 'minWidth', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'scrollHandleColor', title: 'scrollHandleColor', code: true },
			{ id: 'scrollHandleColorHover', title: 'scrollHandleColorHover', code: true },
			{ id: 'prop-title', title: 'title', code: true },
			{ id: 'titleBorderColor', title: 'titleBorderColor', code: true },
			{ id: 'titleBorderWidth', title: 'titleBorderWidth', code: true },
			{ id: 'titleColor', title: 'titleColor', code: true },
			{ id: 'titleIcon', title: 'titleIcon', code: true },
			{ id: 'titleIconFill', title: 'titleIconFill', code: true },
			{ id: 'titleTextSize', title: 'titleTextSize', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onAction', title: 'onAction', code: true },
			{ id: 'onClose', title: 'onClose', code: true },
			{ id: 'onDragPointerDown', title: 'onDragPointerDown', code: true },
			{ id: 'onReject', title: 'onReject', code: true },
			{ id: 'onResolve', title: 'onResolve', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default ModalDoc;

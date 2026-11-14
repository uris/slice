import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { DialogBoxPreview } from './DialogBoxPreview';
import { actionCode, scrollingCode, sharedActionsCode, shorthandCode, usageCode } from './code';
export function DialogBoxDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">DialogBox component</H1>
			<P clipWidth>{'Bring a decision, its context, and the next action into one compact panel.'}</P>
			{/* Published Storybook still uses Modal; update the URL after the DialogBox story is deployed. */}
			<H2 id="usage">Usage</H2>
			<P>
				{'Render the panel when your app needs it, then close it from the action callbacks. '}
				<Code>{'DialogBox<T>'}</Code>
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
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-modal--default"
				components={[
					{
						label: 'Basic usage',
						component: <DialogBoxPreview />,
						code: { code: usageCode.trim(), filename: 'DialogBoxExample.tsx' },
					},
				]}
			/>
			<H3>Use props instead</H3>
			<P>
				For a concise alternative, provide <Code>title</Code> and <Code>actions</Code> and use ordinary children for the
				body.
			</P>
			<CodeBlock filename="DialogBoxPropsExample.tsx" language="tsx" code={shorthandCode.trim()} />
			<H3>Share dialog actions</H3>
			<P>
				Call <Code>useDialogBox&lt;T&gt;()</Code> from a component rendered inside the dialog. Match <Code>T</Code> to
				the parent’s value type; it defaults to <Code>string</Code>. The controls call the parent’s callbacks and work
				with standalone state or <Code>ModalController</Code>.
			</P>
			<CodeBlock filename="ArchiveActions.tsx" language="tsx" code={sharedActionsCode.trim()} />
			<H3>Make room for longer content</H3>
			<P>
				{'Set '}
				<Code>{'maxHeight'}</Code>
				{' to limit the panel. Its content area scrolls while the title and actions remain in place.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-modal--default"
				components={[
					{
						label: 'Make room for longer content',
						component: <DialogBoxPreview scroll />,
						code: { code: scrollingCode.trim(), filename: 'scrollingCode.tsx' },
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				{'The actions array calls '}
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
				The close control calls <Code>onClose</Code>. Your state or a controller removes the panel. Set an action’s{' '}
				<Code>promise="none"</Code> when it should call only <Code>onAction</Code>.
			</P>
			<P>
				The content area responds to content and container size changes. Overflow adds a 1px solid{' '}
				<Code>core-fill-primary</Code> bottom border to the header and top border to the footer by default.{' '}
				<Code>autoBorderBottom</Code> controls the automatic footer divider. The header and footer keep{' '}
				<Code>backgroundColor</Code> while scrolling, matching the content unless their colors are explicitly set.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				<Code>DialogBox</Code> supplies <Code>role="dialog"</Code> and associates its visible heading with the panel.
				Use <Code>dialogName</Code> for a more specific accessible name or when there is no title; the fallback is{' '}
				<Code>Dialog</Code>. Title icons are decorative.
			</P>
			<P>
				<Code openURL="/docs/react/modal-controller/">ModalController</Code> makes the panel modal: it moves focus
				inside, contains keyboard focus, handles Escape, blocks background interaction, locks scrolling, and restores
				focus after closing. When presenting the panel yourself, your host owns those behaviors. Only a modal host
				supplies <Code>aria-modal</Code>.
			</P>
			<P>
				Give actions meaningful labels, or use the action’s tooltip as its accessible name when displaying only an icon.
				The panel has no built-in animation; transitions and reduced-motion handling belong to its presenting layer.
			</P>

			<H2 id="sections">Sections</H2>
			<P>
				Each section is optional and may appear once. Fragments, arrays, and conditional children are supported; the
				parent always places sections in header, body, and footer order. Inside a section, use ordinary React content.
			</P>
			<P>
				When any section is present, all direct content must use these sections. Duplicate sections, unsupported direct
				children, and competing <Code>title</Code>/<Code>DialogBox.Title</Code> or <Code>actions</Code>/
				<Code>DialogBox.Actions</Code> definitions throw clear errors. Sections cannot render outside their direct
				parent or through a custom wrapper.
			</P>
			<Definition id="section-actions">
				<Prop>DialogBox.Actions</Prop>
				<TypeDef>DialogBoxSectionProps</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Accepts <Code>children?: React.ReactNode</Code>. Places controls in the footer with the panel’s padding,
				wrapping, and divider treatment. Controls align right and retain their own handlers; labels and positions never
				imply an action.
			</P>
			<Definition id="section-content">
				<Prop>DialogBox.Content</Prop>
				<TypeDef>DialogBoxSectionProps</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Accepts <Code>children?: React.ReactNode</Code>. Places content in the scrolling body while the title and
				actions stay in place. Body text defaults to <Code>core-text-primary</Code>.
			</P>
			<Definition id="section-title">
				<Prop>DialogBox.Title</Prop>
				<TypeDef>DialogBoxSectionProps</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Accepts <Code>children?: React.ReactNode</Code>. Places text or inline content in the panel’s heading and
				supplies its naming association. Use <Code>dialogName</Code> to override the accessible name.
			</P>
			<H2 id="props">Props</H2>
			<P>{'All component props are optional. Color props accept Slice tokens or CSS colors.'}</P>
			<Definition id="actions">
				<Prop>actions</Prop>
				<TypeDef>{'DialogBoxAction<T>[]'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Action buttons shown in the footer. Actions default to the right; '}
				<Code>{'position'}</Code>
				{' can move them left. '}
				<Code>{'primary'}</Code>
				{' selects the solid button treatment. '}
				<Code>{'promise'}</Code>
				{' chooses the resolve, reject, or action-only path. Disabled and working actions do not run callbacks.'}
			</P>
			<CodeBlock filename="DialogBoxAction.ts" language="typescript" code={actionCode.trim()} />
			<Definition id="actionsBackgroundColor">
				<Prop>actionsBackgroundColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>backgroundColor</DefaultVal>
			</Definition>
			<P>
				Footer background. Defaults to <Code>backgroundColor</Code>, including while scrolling. Explicit colors apply in
				both states.
			</P>
			<Definition id="actionsBorderColor">
				<Prop>actionsBorderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-primary'}</DefaultVal>
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
			<P>{'Adds a footer divider when scrolling is detected and the explicit divider width is zero.'}</P>
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
			<P>{'Structural sections, or ordinary body content when using the props alternative.'}</P>
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
			<Definition id="dialogName">
				<Prop>dialogName</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Accessible name for the dialog. Overrides the visible title’s naming association; without either, the name is{' '}
				<Code>Dialog</Code>.
			</P>
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
			<P>
				An explicit minimum width is honored even when it exceeds the parent or viewport. When omitted, the 300px
				default is capped to the available parent width.
			</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'16px 24px'}</DefaultVal>
			</Definition>
			<P>
				Padding shared by the header, body, and footer. Numbers become pixels; CSS shorthand and expressions are
				preserved. When omitted, header bottom padding is 4px while the body scrolls and zero otherwise. Explicit
				padding, including zero, takes precedence.
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
			<Definition id="titleBackgroundColor">
				<Prop>titleBackgroundColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>backgroundColor</DefaultVal>
			</Definition>
			<P>
				Header background. Defaults to <Code>backgroundColor</Code>, including while scrolling. Explicit colors apply in
				both states.
			</P>
			<Definition id="titleBorderColor">
				<Prop>titleBorderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-primary'}</DefaultVal>
			</Definition>
			<P>{'Divider color beneath the title area.'}</P>
			<Definition id="titleBorderWidth">
				<Prop>titleBorderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1 while scrolling; otherwise 0'}</DefaultVal>
			</Definition>
			<P>
				<>
					Bottom divider width in pixels. Defaults to 1 when the body overflows, otherwise 0. Set{' '}
					<Code>{'titleBorderWidth={0}'}</Code> to disable the automatic header divider.
				</>
			</P>
			<Definition id="titleIcon">
				<Prop>titleIcon</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Icon before the title.'}</P>
			<Definition id="titleIconDualTone">
				<Prop>titleIconDualTone</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>{'Requests the optional dual-tone title icon treatment.'}</P>
			<Definition id="titleTextColor">
				<Prop>titleTextColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-special'}</DefaultVal>
			</Definition>
			<P>{'Title text color.'}</P>
			<Definition id="titleTextSize">
				<Prop>titleTextSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'l'}</DefaultVal>
			</Definition>
			<P>{'Title-area typography size.'}</P>
			<Definition id="divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				{'Native attributes apply to the outer panel div. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged. Roles and raw ARIA attributes are excluded; use '}
				<Code>dialogName</Code>
				{' for naming.'}
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onAction">
				<Method>onAction</Method>
				<TypeDef>{'(value?: T) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Runs for an actions-array entry before its resolve or reject callback. Custom buttons and shared controls do not call it automatically.'
				}
			</P>
			<Definition id="onClose">
				<Method>onClose</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs when the close button is activated. Rejection uses '}
				<Code>onReject</Code>
				{' separately.'}
			</P>
			<Definition id="onDragPointerDown">
				<Method>onDragPointerDown</Method>
				<TypeDef>{'(event: React.PointerEvent<HTMLDivElement>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Receives pointer-down from the title and footer drag surfaces. A controller can use it to start dragging.'}
			</P>
			<Definition id="onReject">
				<Method>onReject</Method>
				<TypeDef>{'(value?: Error) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs for a reject action. Action errors carry the action value in '}
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
			<H2 id="use-dialog-box">Shared actions</H2>
			<P>
				<Code>useDialogBox&lt;T = string&gt;()</Code> takes no parameters and returns stable controls while the parent’s
				callbacks remain unchanged. It must run in a descendant of <Code>DialogBox</Code>; calling it outside a dialog
				throws an error. These controls request callbacks; they do not remove a standalone panel themselves.
			</P>
			<Definition id="control-close">
				<Method>close</Method>
				<TypeDef>() =&gt; void</TypeDef>
			</Definition>
			<P>
				Calls the parent’s <Code>onClose</Code>. A modal host dismisses through its close callback.
			</P>
			<Definition id="control-reject">
				<Method>reject</Method>
				<TypeDef>(error?: Error) =&gt; void</TypeDef>
			</Definition>
			<P>
				Calls <Code>onReject</Code> with the supplied error. A modal host rejects the pending response and dismisses the
				panel.
			</P>
			<Definition id="control-resolve">
				<Method>resolve</Method>
				<TypeDef>(value?: T) =&gt; void</TypeDef>
			</Definition>
			<P>
				Calls <Code>onResolve</Code> with the supplied value. A modal host resolves the pending response and dismisses
				the panel.
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DialogBox component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'sections',
		title: 'Sections',
		items: [
			{ id: 'section-actions', title: 'DialogBox.Actions', code: true },
			{ id: 'section-content', title: 'DialogBox.Content', code: true },
			{ id: 'section-title', title: 'DialogBox.Title', code: true },
		],
	},
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'actions', title: 'actions', code: true },
			{ id: 'actionsBackgroundColor', title: 'actionsBackgroundColor', code: true },
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
			{ id: 'dialogName', title: 'dialogName', code: true },
			{ id: 'maxHeight', title: 'maxHeight', code: true },
			{ id: 'maxWidth', title: 'maxWidth', code: true },
			{ id: 'minHeight', title: 'minHeight', code: true },
			{ id: 'minWidth', title: 'minWidth', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'scrollHandleColor', title: 'scrollHandleColor', code: true },
			{ id: 'scrollHandleColorHover', title: 'scrollHandleColorHover', code: true },
			{ id: 'prop-title', title: 'title', code: true },
			{ id: 'titleBackgroundColor', title: 'titleBackgroundColor', code: true },
			{ id: 'titleBorderColor', title: 'titleBorderColor', code: true },
			{ id: 'titleBorderWidth', title: 'titleBorderWidth', code: true },
			{ id: 'titleIcon', title: 'titleIcon', code: true },
			{ id: 'titleIconDualTone', title: 'titleIconDualTone', code: true },
			{ id: 'titleTextColor', title: 'titleTextColor', code: true },
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
	{
		id: 'use-dialog-box',
		title: 'Shared actions',
		items: [
			{ id: 'control-close', title: 'close', code: true },
			{ id: 'control-reject', title: 'reject', code: true },
			{ id: 'control-resolve', title: 'resolve', code: true },
		],
	},
];
export default DialogBoxDoc;

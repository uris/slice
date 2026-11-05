import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { TabPreview } from './TabPreview';
import { customCode, extrasCode, panelsCode, usageCode } from './code';
export function TabDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Tab component</H1>
			<P clipWidth>
				Give each view a clear place in your navigation. Tab pairs a label with an optional icon and count, while TabBar
				manages the selection.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tab--default"
				components={[
					{ label: 'Text tab', component: <TabPreview /> },
					{ label: 'Icon and count', component: <TabPreview variant="extras" /> },
					{ label: 'Custom content', component: <TabPreview variant="custom" /> },
					{ label: 'Disabled choice', component: <TabPreview variant="disabled" /> },
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place Tab inside <Code openURL="/docs/react/tab-bar/">TabBar</Code> and give each choice a unique value. The
				group handles selection, keyboard navigation, and the underline.
			</P>
			<CodeBlock filename="TabExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Add an icon and count</H3>
			<CodeBlock filename="TabDetails.tsx" language="tsx" code={extrasCode.trim()} />
			<H3>Use custom content</H3>
			<P>Use children when the label needs richer content. A supplied label takes priority.</P>
			<CodeBlock filename="TabContent.tsx" language="tsx" code={customCode.trim()} />
			<H3>Connect a panel</H3>
			<P>
				Set id on the tab and panelId to the content it controls. Use the group’s selected value to show the matching
				panel.
			</P>
			<CodeBlock filename="TabPanels.tsx" language="tsx" code={panelsCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				Tab must be rendered within TabBar. It inherits selection, spacing, typography, and icon sizing from the group.
				Use the group’s onChange to switch views.
			</P>
			<P>
				Values identify choices independently of their position. Prefer stable strings or numbers. A disabled tab cannot
				be activated, and a disabled group disables every tab.
			</P>
			<P>
				Tabs size to their content by default and clip overflow within their bounds. Selection keeps the same font
				weight; the group controls underline animation.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Tab renders a native button with tab semantics. Its label or children provide the accessible name, and its
				selected and disabled states are managed internally. Icons are decorative.
			</P>
			<P>
				The group handles keyboard navigation and skips disabled choices. Use id and panelId to link a tab to an
				application-rendered panel. Give the panel role="tabpanel" and aria-labelledby pointing to the tab’s id.
			</P>
			<P>Reduced-motion preferences disable color transitions and the group’s underline movement.</P>
			<H2 id="props">Props</H2>
			<P>value is required. All other Tab props are optional. Configure shared sizing and appearance on TabBar.</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Custom label content when label is not supplied.'}</P>
			<Definition id={'count'}>
				<Prop>count</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Optional count badge. Zero hides the badge.'}</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Disables this choice. Keyboard navigation skips it; a disabled group cannot be overridden by a child.'}</P>
			<Definition id={'icon'}>
				<Prop>icon</Prop>
				<TypeDef>{'string | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Optional decorative icon before the label.'}</P>
			<Definition id={'id'}>
				<Prop>id</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'generated'}</DefaultVal>
			</Definition>
			<P>{'ID of the tab button. Supply a stable ID when a panel references it through aria-labelledby.'}</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Tab text. Takes priority over children; the fallback is Tab.'}</P>
			<Definition id={'panelId'}>
				<Prop>panelId</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'ID of the corresponding panel, used as the button’s aria-controls. Your application renders the panel.'}</P>
			<Definition id={'toolTip'}>
				<Prop>toolTip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Tooltip text sent to the group’s onToolTip callback. Your application displays the tooltip.'}</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'T'}</TypeDef>
				<DefaultVal>{'required'}</DefaultVal>
			</Definition>
			<P>
				{
					'Unique, non-null identity for this tab. Prefer stable strings or numbers. Object values are matched by reference.'
				}
			</P>
			<Definition id={'buttonAttributes'}>
				<Prop>...buttonAttributes</Prop>
				<TypeDef>{'React.ButtonHTMLAttributes<HTMLButtonElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Other native button attributes and events apply to this tab. Selection, disabled state, role, type, ARIA attributes, and tab order are managed by the group. onClick and onKeyDown run before group handling; preventDefault cancels it.'
				}
			</P>

			<H2 id="events">Events</H2>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>{'React.MouseEventHandler<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Runs before the group’s selection handling. Call preventDefault to cancel activation. Use TabBar’s onChange for
				the selected value and metadata.
			</P>
			<Definition id="onKeyDown">
				<Method>onKeyDown</Method>
				<TypeDef>{'React.KeyboardEventHandler<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>Runs before group keyboard navigation. Call preventDefault to handle a key yourself.</P>
			<Definition id="nativeEvents">
				<Method>...buttonEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Other native handlers apply to the tab button. The toolTip prop supplies hover data to TabBar’s onToolTip
				callback. There are no incidental Motion drag or animation callbacks.
			</P>
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Tab component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'children', title: 'children', code: true },
			{ id: 'count', title: 'count', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'icon', title: 'icon', code: true },
			{ id: 'id', title: 'id', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'panelId', title: 'panelId', code: true },
			{ id: 'toolTip', title: 'toolTip', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'buttonAttributes', title: '...buttonAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onKeyDown', title: 'onKeyDown', code: true },
			{ id: 'nativeEvents', title: '...buttonEvents', code: true },
		],
	},
];
export default TabDoc;

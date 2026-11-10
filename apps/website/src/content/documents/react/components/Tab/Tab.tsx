import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { TabColorExample } from './UsagePreviews';
import { TabCustomExample, TabExtrasExample, TabUsageExample } from './UsagePreviews';
import { colorsCode } from './code';
import { customCode, extrasCode, panelsCode, usageCode } from './code';
export function TabDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Tab component</H1>
			<P clipWidth>
				Give each view a clear place in your navigation. Tab pairs a label with an optional icon and count, while TabBar
				manages the selection.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place Tab inside <Code openURL="/docs/react/tab-bar/">TabBar</Code> and give each choice a unique value. The
				group handles selection, keyboard navigation, and the underline.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tab--default"
				components={[
					{
						label: 'Basic usage',
						component: <TabUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'TabExample.tsx',
					},
				]}
			/>
			<H3>Add an icon and count</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tab--default"
				components={[
					{
						label: 'Add an icon and count',
						component: <TabExtrasExample />,
						code: extrasCode.trim(),
						codeFilename: 'TabDetails.tsx',
					},
				]}
			/>
			<H3>Use custom content</H3>
			<P>Use children when the label needs richer content. A supplied label takes priority.</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tab--default"
				components={[
					{
						label: 'Use custom content',
						component: <TabCustomExample />,
						code: customCode.trim(),
						codeFilename: 'TabContent.tsx',
					},
				]}
			/>
			<H3>Connect a panel</H3>
			<P>
				Set id on the tab and panelId to the content it controls. Use the group’s selected value to show the matching
				panel.
			</P>
			<CodeBlock filename="TabPanels.tsx" language="tsx" code={panelsCode.trim()} />
			<H3>Override selected colors</H3>
			<P>
				Individual tabs inherit group colors. Selected text, icon, and underline overrides take precedence over the
				accent.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-tab--default"
				components={[{ label: 'Override selected colors', component: <TabColorExample />, code: colorsCode.trim() }]}
			/>
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
			<P>
				Color props accept Slice theme tokens or CSS colors and inherit from <Code>TabBar</Code> when omitted. Explicit
				selected colors, including inherited ones, take precedence over <Code>accentColor</Code>.
			</P>
			<Definition id={'accentColor'}>
				<Prop>accentColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Fallback color for selected text, icons, and the moving underline. Explicit selected-color props take
				precedence.
			</P>
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
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>Icon color for unselected tabs. Defaults to the tab’s text color.</P>
			<Definition id={'iconColorSelected'}>
				<Prop>iconColorSelected</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Selected icon color. Takes precedence over <Code>accentColor</Code>; without either, icons follow the selected
				text color.
			</P>
			<Definition id="iconSize">
				<Prop>iconSize</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>TabBar iconSize (20px by default)</DefaultVal>
			</Definition>
			<P>Overrides the inherited icon size for this tab, in pixels. Also supported on TabBar options.</P>
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
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Text color for unselected tabs. Defaults to <Code>core-text-primary</Code>.
			</P>
			<Definition id={'textColorSelected'}>
				<Prop>textColorSelected</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Selected text color. Takes precedence over <Code>accentColor</Code>; without either, uses{' '}
				<Code>core-text-special</Code>.
			</P>
			<Definition id={'toolTip'}>
				<Prop>toolTip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Tooltip text sent to the group’s onToolTip callback. Your application displays the tooltip.'}</P>
			<Definition id={'underlineColor'}>
				<Prop>underlineColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Baseline color beneath the tabs. Overrides TabBar’s <Code>borderColor</Code>. A Tab override applies while that
				tab is selected.
			</P>
			<Definition id={'underlineSelectedColor'}>
				<Prop>underlineSelectedColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Moving selected-underline color. Takes precedence over <Code>accentColor</Code>; without either, uses{' '}
				<Code>core-text-special</Code>.
			</P>
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
		</FlexBox>
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
			{ id: 'accentColor', title: 'accentColor', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'count', title: 'count', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'icon', title: 'icon', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'id', title: 'id', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'panelId', title: 'panelId', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorSelected', title: 'textColorSelected', code: true },
			{ id: 'toolTip', title: 'toolTip', code: true },
			{ id: 'underlineColor', title: 'underlineColor', code: true },
			{ id: 'underlineSelectedColor', title: 'underlineSelectedColor', code: true },
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

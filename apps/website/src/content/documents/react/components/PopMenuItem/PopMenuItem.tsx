import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import {
	CustomContentPreview,
	IconsPreview,
	LabelsPreview,
	SubmenusPreview,
	TogglesPreview,
} from './PopMenuItemPreview';
import { customCode, iconsCode, submenuCode, toggleCode, usageCode } from './code';

const props = [
	{
		name: 'autoDismiss',
		type: 'boolean',
		defaultValue: 'true for actions; false for toggles/submenus',
		description: (
			<>{'Explicitly override whether a click closes all menus. The item callback runs before automatic dismissal.'}</>
		),
	},
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-surface-secondary)',
		description: <>{'Content background color.'}</>,
	},
	{
		name: 'backgroundColorHover',
		type: 'ColorValue',
		defaultValue: 'var(--core-fill-secondary)',
		description: <>{'Content background on pointer hover.'}</>,
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				{
					'Custom children replace the built-in label, icons, shortcut, and submenu indicator. The row wrapper retains its background, hover highlight, padding, and text colors. Do not place interactive controls inside the button.'
				}
			</>
		),
	},
	{
		name: 'dismissAll',
		type: '() => void',
		defaultValue: 'provided by parent',
		description: (
			<>
				{
					'Closure for dismissing the root menu. The parent supplies it to connected items and includes it in click metadata.'
				}
			</>
		),
	},
	{
		name: 'gap',
		type: 'number | string',
		defaultValue: '24',
		description: <>{'Space between leading content and trailing indicators. Numbers use pixels.'}</>,
	},
	{ name: 'icon', type: 'SliceIcon', defaultValue: 'undefined', description: <>{'Leading icon name.'}</> },
	{
		name: 'iconColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-text-primary)',
		description: <>{'Leading icon stroke color.'}</>,
	},
	{
		name: 'iconColorHover',
		type: 'ColorValue',
		defaultValue: 'var(--core-text-primary)',
		description: <>{'Leading icon stroke color during hover.'}</>,
	},
	{
		name: 'iconGap',
		type: 'number',
		defaultValue: '6',
		description: <>{'Space in pixels between the leading icon and label.'}</>,
	},
	{
		name: 'iconSize',
		type: 'number',
		defaultValue: '16',
		description: <>{'Leading icon size in pixels. Toggle and submenu icons currently remain 20px.'}</>,
	},
	{
		name: 'id',
		type: 'string',
		defaultValue: 'generated DOM ID',
		description: (
			<>
				A supplied identifier is used for the native button ID, event metadata, and the final naming fallback. Without
				one, only the DOM ID is generated.
			</>
		),
	},
	{
		name: 'label',
		type: 'string',
		defaultValue: 'undefined',
		description: <>{'Visible item text and event metadata.'}</>,
	},
	{
		name: 'level',
		type: 'number',
		defaultValue: 'unused',
		description: (
			<>
				{'Accepted by the item type but not used by its current renderer. Set nesting on '}
				<Code>{'PopMenu'}</Code>
				{'.'}
			</>
		),
	},
	{
		name: 'name',
		type: 'string',
		defaultValue: 'label, then id',
		description: (
			<>
				Accessible item name when it differs from the visible <Code>label</Code>. Without metadata, custom content
				supplies the natural name; an empty default item uses <Code>Menu item</Code>.
			</>
		),
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '3px 4px',
		description: <>{'Padding applied to both the button and its content wrapper.'}</>,
	},
	{
		name: 'shortcut',
		type: 'string',
		defaultValue: 'undefined',
		description: <>{'Trailing shortcut hint. Display only; it does not register a keyboard shortcut.'}</>,
	},
	{
		name: 'subMenu',
		type: '(props: PopMenuSubMenuProps) => React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				{'Render a separate menu with '}
				<Code>{'{ caller, level, dismissAll }'}</Code>
				{'. Forward these to its '}
				<Code>{'PopMenu'}</Code>
				{'. The parent owns and positions the open child branch.'}
			</>
		),
	},
	{
		name: 'subMenuIcon',
		type: 'SliceIcon',
		defaultValue: 'arrows.chevron-right',
		description: <>{'Trailing submenu indicator.'}</>,
	},
	{
		name: 'textColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-text-primary)',
		description: <>{'Item text color.'}</>,
	},
	{
		name: 'textColorHover',
		type: 'ColorValue',
		defaultValue: 'var(--core-text-primary)',
		description: <>{'Item text color during hover.'}</>,
	},
	{
		name: 'textSize',
		type: 'FixedSize',
		defaultValue: 'm',
		description: (
			<>
				{'Label typography: '}
				<Code>{'xs'}</Code>
				{', '}
				<Code>{'s'}</Code>
				{', '}
				<Code>{'m'}</Code>
				{', '}
				<Code>{'l'}</Code>
				{', or '}
				<Code>{'xl'}</Code>
				{'.'}
			</>
		),
	},
	{
		name: 'toggle',
		type: 'boolean',
		defaultValue: 'false',
		description: (
			<>
				{'Marks an item as a toggle. Click metadata contains the requested next '}
				<Code>{'toggled'}</Code>
				{' value.'}
			</>
		),
	},
	{
		name: 'toggled',
		type: 'boolean',
		defaultValue: 'false',
		description: (
			<>{'Controlled toggle state. Update it from the click payload; the item does not change it internally.'}</>
		),
	},
	{
		name: 'toggleIcon',
		type: 'SliceIcon',
		defaultValue: 'basic.check',
		description: (
			<>
				{'Indicator shown when both '}
				<Code>{'toggle'}</Code>
				{' and '}
				<Code>{'toggled'}</Code>
				{' are true.'}
			</>
		),
	},
	{
		name: '...buttonAttributes',
		type: 'HTML button attributes',
		defaultValue: 'not forwarded',
		description: (
			<>
				{
					'The public type accepts native button attributes, but the current renderer does not forward arbitrary attributes, '
				}
				<Code>{'disabled'}</Code>
				{', '}
				<Code>{'style'}</Code>
				{', or '}
				<Code>{'className'}</Code>
				{'.'}
			</>
		),
	},
];

export default function PopMenuItemDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PopMenuItem component</H1>
			<P clipWidth>Compose an action, a controlled toggle, or custom row content inside a contextual menu.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Place items inside <Code openURL="/docs/react/pop-menu/">PopMenu</Code>, directly or through{' '}
				<Code openURL="/docs/react/pop-menu-group/">PopMenuGroup</Code>. The parent connects their clicks to submenu
				ownership and dismissal.
			</P>
			<TipBox inline noBorder>
				Ordinary items default to <Code>{'autoDismiss={true}'}</Code> so the item click runs, then all menus close
				automatically. Set <Code>{'autoDismiss={false}'}</Code> to keep the menu open (you'll need to dismiss menu
				yourself).
			</TipBox>
			<ComponentCanvas
				components={[
					{
						label: 'Labels only',
						component: <LabelsPreview />,
						code: usageCode.trim(),
						codeFilename: 'MenuItems.tsx',
					},
				]}
			/>
			<H3>With icons</H3>
			<P>Give each item its own leading icon for greater option clarity.</P>
			<ComponentCanvas
				components={[
					{
						label: 'With icons',
						component: <IconsPreview />,
						code: iconsCode.trim(),
						codeFilename: 'MenuItems.tsx',
					},
				]}
			/>
			<H3>Using toggles</H3>
			<P>
				Items clicks can set or unset a toggle. Click events emit the state but it's up to your app to control the
				active state.
			</P>
			<TipBox inline noBorder noMargin>
				Click the "Auto Save" option to toggle the option on / off. Toggles set <Code>{'autoDismiss'}</Code> to false by
				default. Override this to dismiss menus automatically when clicking on toggles
			</TipBox>
			<ComponentCanvas
				components={[
					{
						label: 'Using toggles',
						component: <TogglesPreview />,
						code: toggleCode.trim(),
						codeFilename: 'MenuItems.tsx',
					},
				]}
			/>

			<H3>Adding child options to an item</H3>
			<P>
				Use subMenu to render a child menu connected to an item. Remember that you need to forward the caller (item),
				level, and dismissAll props to the child menu. There is no limit to nesting item sub menus.
			</P>
			<ComponentCanvas
				offsetBottom={false}
				components={[
					{
						label: 'With subitems',
						component: <SubmenusPreview />,
						code: submenuCode.trim(),
						codeFilename: 'MenuItems.tsx',
					},
				]}
			/>
			<TipBox inline noBorder noMargin={false}>
				Submenu openers default to <Code>{'autoDismiss={false}'}</Code>, keeping the parent and child visible.
			</TipBox>
			<H3>Compose custom content</H3>
			<P>
				Pass custom <Code>children</Code> for the row contents. Keep <Code>id</Code> and <Code>label</Code> on the item
				for event metadata. The standard wrapper still provides highlighting, padding, and text colors.
			</P>
			<ComponentCanvas
				components={[
					{
						label: 'Custom color items',
						component: <CustomContentPreview />,
						code: customCode.trim(),
						codeFilename: 'ColorItems.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Inside a connected menu, actions invoke their callback and then dismiss all menus. Toggle and submenu items stay
				open by default. Set <Code>autoDismiss</Code> to override either default. An async callback is started but not
				awaited.
			</P>
			<P>
				Item clicks close the current child branch of their containing menu. A submenu opener replaces that branch with
				a fresh menu. Clicks stop propagation so selecting an item does not also trigger the window's outside-click
				listener.
			</P>
			<P>
				Custom children replace the built-in label, icons, shortcut, and indicators, not the styled row wrapper. A
				shortcut is only a visual hint; it does not register a keyboard binding. Outside a parent menu, callbacks are
				explicit and no menu lifecycle is provided automatically.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Items are native buttons. Their accessible name uses <Code>name</Code>, then <Code>label</Code>, then a supplied{' '}
				<Code>id</Code>. Without those, custom content supplies its natural name; an empty default item uses{' '}
				<Code>Menu item</Code>. Omitted DOM IDs are generated.
			</P>
			<P>
				Built-in icons are decorative. Hide custom decorative circles from assistive technology with{' '}
				<Code>aria-hidden</Code> and retain a visible text label. Do not nest interactive controls inside an item
				button.
			</P>
			<P>
				Native keyboard activation works, but menu-item roles, arrow-key navigation, Escape handling, focus transfer,
				and toggle state announcements are not currently managed. See the parent{' '}
				<Code openURL="/docs/react/pop-menu/#accessibility">accessibility guidance</Code> for menu animation and
				integration responsibilities.
			</P>

			<H2 id="props">Props</H2>
			{props.map((entry) => (
				<Fragment key={entry.name}>
					<Definition id={`prop-${entry.name.replace('...', '')}`}>
						<Prop>{entry.name}</Prop>
						<TypeDef>{entry.type}</TypeDef>
						<DefaultVal>{entry.defaultValue}</DefaultVal>
					</Definition>
					<P>{entry.description}</P>
				</Fragment>
			))}

			<H2 id="events">Events</H2>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>{'(event: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => void'}</TypeDef>
			</Definition>
			<P>
				Runs before connected group and parent callbacks. The payload contains <Code>id</Code>, <Code>label</Code>, and{' '}
				<Code>dismissAll</Code>. Toggles add <Code>toggle</Code> and the next <Code>toggled</Code> value; submenu
				openers add <Code>subMenu</Code>. An explicit <Code>autoDismiss</Code> override is also included.
			</P>
			<Definition id="onHover">
				<Method>onHover</Method>
				<TypeDef>
					{'(event: React.MouseEvent<HTMLButtonElement>, item: { id?: string; label?: string }) => void'}
				</TypeDef>
			</Definition>
			<P>
				Runs on pointer entry, not leave, before connected group and parent hover callbacks. Arbitrary native button
				events are not forwarded by the current renderer.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'PopMenuItem component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: props.map(({ name }) => ({ id: `prop-${name.replace('...', '')}`, title: name, code: true })),
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onHover', title: 'onHover', code: true },
		],
	},
];

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { PopMenuPreview } from './PopMenuPreview';
import { actionsCode, motionCode, optionsCode, portalCode, usageCode } from './code';

const menuProps = [
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-surface-secondary)',
		description: (
			<>
				{'Menu background. Use a CSS color or a '}
				<Code>{'var(--\u2026)'}</Code>
				{' expression.'}
			</>
		),
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-fill-primary)',
		description: <>{'Outline color.'}</>,
	},
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: 'var(--corner-l)',
		description: <>{'Corner radius. Numbers use pixels; CSS lengths and theme variables pass through.'}</>,
	},
	{
		name: 'borderWidth',
		type: 'number',
		defaultValue: '1',
		description: <>{'Outline width in pixels. Zero hides it.'}</>,
	},
	{
		name: 'caller',
		type: 'HTMLElement',
		defaultValue: 'undefined',
		description: (
			<>
				{'Anchor element. Capture '}
				<Code>{'event.currentTarget'}</Code>
				{' in the handler; do not save the event object. The menu remains hidden without a measurable caller.'}
			</>
		),
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				{'Composed content takes precedence over '}
				<Code>{'options'}</Code>
				{'. '}
				<Code>{'PopMenuItem'}</Code>
				{', '}
				<Code>{'PopMenuGroup'}</Code>
				{', including those inside custom wrappers and fragments, connect through context without forwarding handlers.'}
			</>
		),
	},
	{
		name: 'dismissAll',
		type: '() => void',
		defaultValue: 'onDismiss fallback',
		description: (
			<>
				{
					'Root-owned callback that closes the whole menu chain. Forward it through submenus. The application usually clears the caller or removes the root menu.'
				}
			</>
		),
	},
	{
		name: 'gap',
		type: 'number',
		defaultValue: '2; -24 for level > 0',
		description: (
			<>
				{'Gap in pixels. For '}
				<Code>{'right'}</Code> or <Code>left</Code>
				{', it shifts horizontally only. Negative values overlap the caller; submenu defaults overlap by 24px.'}
			</>
		),
	},
	{
		name: 'id',
		type: 'string',
		defaultValue: 'generated unique ID',
		description: (
			<>
				Root element ID. A supplied <Code>id</Code> also supplies the accessible-name fallback when <Code>name</Code> is
				absent.
			</>
		),
	},
	{
		name: 'level',
		type: 'number',
		defaultValue: '0',
		description: <>{'Nesting level. Submenus receive the containing level plus one and stack above it.'}</>,
	},
	{
		name: 'minWidth',
		type: 'number',
		defaultValue: 'undefined',
		description: <>{'Minimum width in pixels. Avoid a minimum wider than the available viewport.'}</>,
	},

	{
		name: 'name',
		type: 'string',
		defaultValue: 'id, then Pop Menu',
		description: (
			<>
				Accessible menu name. Blank names use a supplied <Code>id</Code>, then <Code>Pop Menu</Code>.
			</>
		),
	},
	{
		name: 'offset',
		type: "'top' | 'bottom' | 'right' | 'left'",
		defaultValue: 'bottom; right for level > 0',
		description: (
			<>
				{
					'Placement relative to the caller. Top/bottom switch sides when the other side fits the full menu. Side placements align to the caller top and can flip horizontally before viewport clamping. Right starts at its right edge plus '
				}
				<Code>{'gap'}</Code>
				{'.'}
			</>
		),
	},
	{
		name: 'options',
		type: 'PropMenuEntry<T>[]',
		defaultValue: 'undefined',
		description: (
			<>
				{'Entries can be individual items or groups with '}
				<Code>{'title'}</Code>
				{' and '}
				<Code>{'items'}</Code>
				{'. Grouped and ungrouped items share one active submenu.'}
			</>
		),
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '4px 2px',
		description: <>{'Menu wrapper padding. Numbers use pixels; CSS shorthand values pass through.'}</>,
	},

	{
		name: 'portalContainer',
		type: "'auto' | HTMLElement | false",
		defaultValue: 'auto; inherited by submenus',
		description: (
			<>
				Automatic hosts are shared within the nearest theme/dialog scope, shadow root, or document body and removed
				after their last owner unmounts. Pass an element to choose an application-owned host, or <Code>false</Code> to
				render in place. Submenus inherit the resolved host or inline mode unless explicitly overridden.
			</>
		),
	},

	{
		name: '...divAttributes',
		type: 'HTML div and Motion attributes',
		defaultValue: '\u2014',
		description: (
			<>
				{'Attributes and '}
				<Code>{'className'}</Code>
				{' apply to the wrapper. '}
				<Code>{'style'}</Code>
				{
					' is merged before internal appearance and positioning styles. Internal scroll and animation handlers are managed by the component.'
				}
			</>
		),
	},
];
export default function PopMenuDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PopMenu component</H1>
			<P clipWidth>Keep contextual actions beside their caller, with grouped items, toggles, and nested menus.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Compose <Code openURL="/docs/react/pop-menu-item/">PopMenuItem</Code> and{' '}
				<Code openURL="/docs/react/pop-menu-group/">PopMenuGroup</Code> inside a menu. Keep its caller in state and
				clear it from <Code>dismissAll</Code> and <Code>onDismiss</Code>.
			</P>
			<TipBox inline noBorder>
				Open the menu, try Colors, or toggle Auto Save. Actions close the menu; toggles keep it open.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-popmenu--default"
				components={[
					{
						label: 'Grouped actions and submenus',
						component: <PopMenuPreview />,
						code: { code: usageCode.trim(), filename: 'ProjectActions.tsx' },
					},
				]}
			/>
			<H3>Use an options array</H3>
			<P>
				Pass <Code>options</Code> instead of composed children. Entries can be items or groups. <Code>children</Code>{' '}
				takes precedence when both are supplied.
			</P>
			<CodeBlock filename="Options.tsx" language="tsx" code={optionsCode.trim()} />
			<H3>Attach item actions and data</H3>
			<P>
				Each item accepts <Code>onClick(event, item)</Code> and optional <Code>data</Code>. The callback details carry{' '}
				<Code>data?: T</Code> unchanged through the item, its groups, and the menu. Use item callbacks for actions and{' '}
				<Code>onClickItem</Code> for shared handling. This works in root <Code>options</Code>, grouped{' '}
				<Code>items</Code>, and composed children.
			</P>
			<P>
				<Code>T</Code> is inferred from the options array. A shared <Code>PropMenuEntry&lt;T&gt;[]</Code> type gives
				descriptors and their callbacks the same payload shape. With composed children, specify{' '}
				<Code>PopMenu&lt;T&gt;</Code> and <Code>PopMenuGroup&lt;T&gt;</Code> when their shared handlers need typed data;
				keep the payload shape consistent throughout that menu. Nested menus have their own callback and payload scope.
			</P>
			<CodeBlock filename="DocumentMenu.tsx" language="tsx" code={actionsCode.trim()} />

			<P>
				For toggle, custom-content, and submenu usage, see <Code openURL="/docs/react/pop-menu-item/">PopMenuItem</Code>
				. For titled and untitled sections, see <Code openURL="/docs/react/pop-menu-group/">PopMenuGroup</Code>.
			</P>
			<P>
				For an app-wide host, use <Code openURL="/docs/react/pop-menu-controller/">PopMenuController</Code>.
			</P>
			<H2 id="behavior">Behavior</H2>
			<P>
				Each menu owns one active child branch. Clicking a sibling closes that branch; clicking a submenu opener creates
				a fresh branch. Toggle and submenu items stay open by default. Other items invoke the app callback, then call{' '}
				<Code>dismissAll</Code>. Override this with <Code>autoDismiss</Code>.
			</P>
			<P>
				Menus calculate their position when the caller or placement props change. Top and bottom placement can flip to
				fit; side placements can flip horizontally before clamping to the viewport. Oversized menus scroll. Dynamic menu
				content is not remeasured automatically.
			</P>
			<P>
				Clicks on items stop propagation. Menu padding, group titles, and portaled descendant menus count as inside the
				menu branch. Outside clicks, window resizing, and scrolling outside the branch start dismissal. The menu keeps
				its position through its exit animation before calling <Code>onDismiss</Code>. Explicit root removal and store
				clearing unmount immediately.
			</P>
			<P>
				Items and groups connect through context, including inside custom wrappers. Callback order is item, containing
				groups from inner to outer, then menu. Each submenu establishes its own callback scope. Supply unique, stable
				<Code>id</Code> values for dynamic options, groups, and grouped items; entries without IDs use their position as
				a fallback for static lists. Duplicate labels and untitled groups are supported.
			</P>
			<H3>Choose a portal host</H3>
			<P>
				<Code>portalContainer="auto"</Code> creates a shared host in the nearest theme or dialog scope, falling back to
				the caller's shadow root or document body. Submenus inherit it, even through custom wrappers. Provide Slice
				styles inside a shadow root. Automatic placement can still inherit ancestor clipping and stacking contexts; pass
				an <Code>HTMLElement</Code> outside those constraints when you need a specific overlay layer. The application
				owns that host's theme, stacking, and lifetime. Use <Code>{'portalContainer={false}'}</Code> to render the
				entire menu branch in place.
			</P>
			<CodeBlock filename="Portal.tsx" language="tsx" code={portalCode.trim()} />
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The wrapper renders <Code>role="menu"</Code> and derives its accessible name from <Code>name</Code>, then a
				supplied <Code>id</Code>, then <Code>Pop Menu</Code>. Its DOM ID is generated when omitted. Explicit wrapper
				ARIA overrides remain available but are not needed for ordinary examples.
			</P>
			<P>
				Opening focuses the first enabled item. Up/Down move between items, Home/End move to the first/last item, and
				Right opens a submenu. Escape closes the current menu and restores focus to its opener; Left does the same
				inside a submenu. Tab and Shift+Tab close the menu chain and move beyond its root trigger. Enter and Space
				activate items. Focus outlines use <Code>:focus-visible</Code> for keyboard interaction. Disabled items are
				skipped. Custom button children must not contain nested interactive controls.
			</P>
			<P>
				The menu observes <Code>prefers-reduced-motion</Code>, including live changes. With reduced motion enabled,
				menus and submenus appear and dismiss immediately, bypassing custom motion values and transition delays. The
				closed or exiting wrapper is <Code>inert</Code>.
			</P>
			<H2 id="props">Props</H2>
			{menuProps.map((entry) => (
				<Fragment key={entry.name}>
					<Definition id={entry.name === '...divAttributes' ? 'divAttributes' : entry.name}>
						<Prop>{entry.name}</Prop>
						<TypeDef>{entry.type}</TypeDef>
						<DefaultVal>{entry.defaultValue}</DefaultVal>
					</Definition>
					<P>{entry.description}</P>
				</Fragment>
			))}
			<H2 id="motion">Motion</H2>
			<P>
				<Code>transition</Code> and <Code>motionValues</Code> configure the menu animation with Slice’s{' '}
				<Code openURL="/docs/react/motion/">Water</Code> transition as the default.
			</P>
			<CodeBlock filename="PopMenuMotion.tsx" language="tsx" code={motionCode.trim()} />
			<Definition id="motionValues">
				<Prop>motionValues</Prop>
				<TypeDef>Variants</TypeDef>
				<DefaultVal>initial/exit: y 5, opacity 0; animate: y 0, opacity 1</DefaultVal>
			</Definition>
			<P>
				Partial overrides merge into the built-in <Code>initial</Code>, <Code>animate</Code>, and <Code>exit</Code>
				states, retaining omitted defaults. The menu holds its resolved position during a local exit and calls{' '}
				<Code>onDismiss</Code> when that animation completes. Removing the root menu immediately bypasses its exit.
			</P>
			<Definition id="transition">
				<Prop>transition</Prop>
				<TypeDef>Transition</TypeDef>
				<DefaultVal>Water</DefaultVal>
			</Definition>
			<P>
				Timing and easing settings merge with the theme’s Water transition. Reduced-motion preferences override custom
				motion values and timing, including delays, so opening and dismissal remain immediate.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onClickItem">
				<Method>onClickItem</Method>
				<TypeDef>{'(event: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo<T>) => void'}</TypeDef>
			</Definition>
			<P>
				Runs after an item click and before automatic dismissal. Metadata includes <Code>id</Code>, <Code>label</Code>,
				and <Code>dismissAll</Code>, plus optional <Code>data</Code> of shape <Code>T</Code>; toggle items add{' '}
				<Code>toggle</Code> and the next <Code>toggled</Code> value. Submenu openers add their <Code>subMenu</Code>{' '}
				renderer. An explicit <Code>autoDismiss</Code> override is also included. Async handlers are not awaited.
			</P>
			<Definition id="onDismiss">
				<Method>onDismiss</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs when the local exit completes. Also serves as the fallback root dismissal callback if{' '}
				<Code>dismissAll</Code> is absent.
			</P>
			<Definition id="onHoverItem">
				<Method>onHoverItem</Method>
				<TypeDef>
					{'(event: React.MouseEvent<HTMLButtonElement>, item: { id?: string; label?: string }) => void'}
				</TypeDef>
			</Definition>
			<P>
				Runs on pointer entry, not pointer leave. Item <Code>onClick</Code>/<Code>onHover</Code> callbacks run first,
				followed by group callbacks and then the parent callback.
			</P>
			<Definition id="divEvents">
				<Method>...divEvents</Method>
				<TypeDef>HTML div events</TypeDef>
			</Definition>
			<P>
				Native wrapper events pass through except internally managed scroll and animation handlers. Item clicks stop
				propagation. Native item events are documented on{' '}
				<Code openURL="/docs/react/pop-menu-item/#events">PopMenuItem</Code>. A consumer <Code>onKeyDown</Code> can call{' '}
				<Code>preventDefault()</Code> to cancel built-in navigation.
			</P>
		</FlexBox>
	);
}

const entries = (rows: { name: string }[], prefix = '') =>
	rows.map(({ name }) => ({
		id: prefix + name.replace('...', ''),
		title: name,
		code: true,
	}));
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'PopMenu component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{ id: 'props', title: 'Props', items: entries(menuProps) },
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
		items: ['onClickItem', 'onDismiss', 'onHoverItem', 'divEvents'].map((id) => ({
			id,
			title: id === 'divEvents' ? '...divEvents' : id,
			code: true,
		})),
	},
];

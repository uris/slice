import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { PopMenuPreview } from './PopMenuPreview';
import { motionCode, optionsCode, portalCode, usageCode } from './code';
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
				{'. Direct '}
				<Code>{'PopMenuItem'}</Code>
				{', '}
				<Code>{'PopMenuGroup'}</Code>
				{
					', fragments, and conditional children are connected to the parent handlers. Other custom children render unchanged.'
				}
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
				<Code>{'right'}</Code>
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
				Accessible menu name and generated-key prefix. Blank names use a supplied <Code>id</Code>, then{' '}
				<Code>Pop Menu</Code>.
			</>
		),
	},
	{
		name: 'offset',
		type: "'top' | 'bottom' | 'right'",
		defaultValue: 'bottom; right for level > 0',
		description: (
			<>
				{
					'Placement relative to the caller. Top/bottom switch sides when the other side fits the full menu. Right aligns to the caller top and starts at its right edge plus '
				}
				<Code>{'gap'}</Code>
				{'.'}
			</>
		),
	},
	{
		name: 'options',
		type: 'PropMenuEntry[]',
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
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PopMenu component</H1>
			<P clipWidth>Keep contextual actions beside their caller, with grouped items, toggles, and nested menus.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Compose <Code openURL="/docs/react/pop-menu-item/">PopMenuItem</Code> and{' '}
				<Code openURL="/docs/react/pop-menu-group/">PopMenuGroup</Code> inside a menu. Keep its caller in state and
				clear it from <Code>dismissAll</Code> and <Code>onDismiss</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-popmenu--default"
				components={[
					{
						label: 'Grouped actions and submenus',
						component: <PopMenuPreview />,
						code: usageCode.trim(),
						codeFilename: 'ProjectActions.tsx',
					},
				]}
			/>
			<TipBox inline noBorder title="Tip:">
				Open the menu, try Colors, or toggle Auto Save. Actions close the menu; toggles keep it open.
			</TipBox>
			<H3>Use an options array</H3>
			<P>
				Pass <Code>options</Code> instead of composed children. Entries can be items or groups. <Code>children</Code>{' '}
				takes precedence when both are supplied.
			</P>
			<CodeBlock filename="Options.tsx" language="tsx" code={optionsCode.trim()} />
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
				fit; right placement is clamped inside the viewport. Oversized menus scroll. Dynamic menu content is not
				remeasured automatically.
			</P>
			<P>
				Clicks on items do not bubble to the global dismissal listener. Other clicks, window resizing, and scrolling
				outside the menu start dismissal. The menu keeps its position through its exit animation before calling{' '}
				<Code>onDismiss</Code>. Explicit root removal and store clearing unmount immediately.
			</P>
			<H3>When a portal is useful</H3>
			<P>
				Render the menu normally in most layouts. If a transformed ancestor changes its fixed-position reference or a
				container clips it, use <Code>createPortal</Code> to render outside that container. Choose an untransformed{' '}
				<Code>menuHost</Code> within your theme scope so the menu keeps its theme variables.
			</P>
			<CodeBlock filename="Portal.tsx" language="tsx" code={portalCode.trim()} />
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The wrapper renders <Code>role="menu"</Code> and derives its accessible name from <Code>name</Code>, then a
				supplied <Code>id</Code>, then <Code>Pop Menu</Code>. Its DOM ID is generated when omitted. Explicit wrapper
				ARIA overrides remain available but are not needed for ordinary examples.
			</P>
			<P>
				The current component does not implement menu-item roles, arrow-key navigation, Escape dismissal, or opening and
				restoring focus. Native buttons retain their normal keyboard activation. Custom button children must not contain
				nested interactive controls.
			</P>
			<P>
				The current animation does not automatically honor reduced-motion preferences. Supply an immediate{' '}
				<Code>transition</Code> when your application detects that preference. The closed or exiting wrapper is{' '}
				<Code>inert</Code>.
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
				Timing and easing settings merge with the theme’s Water transition. Reduced-motion preferences are not detected
				automatically; supply an immediate transition when your application detects that preference.
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onClickItem">
				<Method>onClickItem</Method>
				<TypeDef>{'(event: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => void'}</TypeDef>
			</Definition>
			<P>
				Runs after an item click and before automatic dismissal. Metadata includes <Code>id</Code>, <Code>label</Code>,
				and <Code>dismissAll</Code>; toggle items add <Code>toggle</Code> and the next <Code>toggled</Code> value.
				Submenu openers add their <Code>subMenu</Code> renderer. An explicit <Code>autoDismiss</Code> override is also
				included. Async handlers are not awaited.
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
				propagation. Arbitrary native item button events are not forwarded by the current item renderer.
			</P>
		</FlexDiv>
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

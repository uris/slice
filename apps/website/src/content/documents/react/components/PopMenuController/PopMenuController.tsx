import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, Definition, H1, H2, H3, Method, P, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { PopMenuControllerPreview } from './PopMenuControllerPreview';
import { clearCode, composedCode, usageCode } from './code';

export default function PopMenuControllerDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PopMenuController component</H1>
			<P clipWidth>Open one contextual menu from application code, using either props or a composed menu control.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Mount one <Code>PopMenuController</Code> within your theme provider. Push a menu with{' '}
				<Code>popMenuActions.push</Code>, capturing the button element inside its click handler.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-popmenucontroller--default"
				components={[
					{
						label: 'Props and composed menus',
						component: <PopMenuControllerPreview />,
						code: usageCode.trim(),
						codeFilename: 'AppActions.tsx',
					},
				]}
			/>
			<TipBox inline noBorder title="Tip:">
				Open either menu, then select an action or click elsewhere to dismiss it.
			</TipBox>
			<H3>Push a composed menu</H3>
			<P>
				A composed control must forward <Code>caller</Code>, <Code>onDismiss</Code>, and <Code>dismissAll</Code> to its{' '}
				<Code openURL="/docs/react/pop-menu/">PopMenu</Code>. The controller supplies dismissal callbacks that clear the
				store.
			</P>
			<CodeBlock filename="ProjectMenu.tsx" language="tsx" code={composedCode.trim()} />
			<H3>Clear the menu</H3>
			<CodeBlock filename="ClearMenu.ts" language="tsx" code={clearCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				The store holds one <Code>PushedPopMenu</Code> or <Code>null</Code>. A value is either <Code>PopMenuProps</Code>{' '}
				or <Code>React.ReactElement&lt;PopMenuProps&gt;</Code>. Pushing another value replaces the active menu; pushing
				the same value again still creates a fresh menu instance.
			</P>
			<P>
				The controller constructs <Code>PopMenu</Code> from props or renders the composed control with its dismissal
				callbacks. It preserves callbacks supplied with the menu. If an old callback pushes a replacement, the old menu
				cannot clear the newer one.
			</P>
			<P>
				Item auto-dismiss and submenu <Code>dismissAll</Code> clear the root store. Outside clicks follow the menu's
				exit animation before clearing. Explicit <Code>clear()</Code> and <Code>push(null)</Code> unmount immediately.
				Clearing the root also removes its submenu branches.
			</P>
			<P>
				Mount only one controller for this global store. Unmounting a controller does not clear the store automatically;
				clear a menu owned by a view when that view is removed. Keep confirmations and other follow-up UI outside the
				menu subtree.
			</P>
			<P>
				Render the controller normally in most layouts. If an ancestor transforms or clips its menus, see the optional{' '}
				<Code openURL="/docs/react/pop-menu/#behavior">portal example</Code>.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The controller adds no wrapper, focus behavior, or keyboard handling. Naming, menu semantics, and the current
				keyboard and reduced-motion limitations are described on <Code openURL="/docs/react/pop-menu/">PopMenu</Code>.
				Set <Code>name</Code> in the pushed props or composed control. The menu derives its accessible label from that
				name, with its usual ID and default fallbacks.
			</P>
			<H2 id="props">Props</H2>
			<P>None. Configure the pushed menu instead. The controller does not accept or forward native attributes.</P>
			<H2 id="events">Events</H2>
			<P>
				No controller-specific events. The pushed menu's <Code>onDismiss</Code> and <Code>dismissAll</Code> callbacks
				run before the controller clears the current store entry.
			</P>
			<H2 id="store">Store API</H2>
			<P>
				Import these helpers from <Code>@apple-pie/slice/stores/popMenu</Code>. React hooks and imperative actions
				follow the same single-value pattern as the tooltip store.
			</P>
			<Definition id="clear">
				<Method>popMenuActions.clear</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Set the active menu to <Code>null</Code> immediately.
			</P>
			<Definition id="getPopMenu">
				<Method>getPopMenu</Method>
				<TypeDef>{'() => PushedPopMenu | null'}</TypeDef>
			</Definition>
			<P>Read the current value outside React without subscribing.</P>
			<Definition id="push">
				<Method>popMenuActions.push</Method>
				<TypeDef>{'(menu: PushedPopMenu | null) => void'}</TypeDef>
			</Definition>
			<P>
				Replace the active menu. Pass <Code>null</Code> to clear. The store does not queue menus or capture event
				objects.
			</P>
			<Definition id="usePopMenu">
				<Method>usePopMenu</Method>
				<TypeDef>{'() => PushedPopMenu | null'}</TypeDef>
			</Definition>
			<P>Subscribe to the active menu value.</P>
			<Definition id="usePopMenuActions">
				<Method>usePopMenuActions</Method>
				<TypeDef>{'() => { push, clear }'}</TypeDef>
			</Definition>
			<P>Select the stable action object from a React component.</P>
			<Definition id="usePopMenuStore">
				<Method>usePopMenuStore</Method>
				<TypeDef>Zustand hook</TypeDef>
			</Definition>
			<P>
				Access the full store, including <Code>popMenu</Code>, the instance <Code>version</Code>, and{' '}
				<Code>actions</Code>. Prefer the focused selector hooks for ordinary consumers.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'PopMenuController component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{ id: 'props', title: 'Props' },
	{ id: 'events', title: 'Events' },
	{
		id: 'store',
		title: 'Store API',
		items: [
			{ id: 'clear', title: 'popMenuActions.clear', code: true },
			{ id: 'getPopMenu', title: 'getPopMenu', code: true },
			{ id: 'push', title: 'popMenuActions.push', code: true },
			{ id: 'usePopMenu', title: 'usePopMenu', code: true },
			{ id: 'usePopMenuActions', title: 'usePopMenuActions', code: true },
			{ id: 'usePopMenuStore', title: 'usePopMenuStore', code: true },
		],
	},
];

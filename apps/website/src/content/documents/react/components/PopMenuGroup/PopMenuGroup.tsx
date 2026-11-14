import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { PopMenuGroupPreview } from './PopMenuGroupPreview';
import { optionsCode, styleCode, usageCode } from './code';

const props = [
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-fill-primary)',
		description: <>{'Top separator color. The first rendered group omits the separator.'}</>,
	},
	{
		name: 'borderWidth',
		type: 'number | string',
		defaultValue: '1',
		description: <>{'Separator width. Numbers use pixels; zero hides it.'}</>,
	},
	{
		name: 'children',
		type: 'React.ReactNode',
		defaultValue: 'undefined',
		description: (
			<>
				{'Composed items take precedence over '}
				<Code>{'items'}</Code>
				{'. Groups add no independent submenu or dismissal state.'}
			</>
		),
	},
	{
		name: 'dismissAll',
		type: '() => void',
		defaultValue: 'provided by parent',
		description: (
			<>
				Fallback root dismissal callback for descendants when no containing menu provides one. Items receive the
				resolved closure in click metadata.
			</>
		),
	},
	{
		name: 'gap',
		type: 'number | string',
		defaultValue: 'var(--spacing-xxs)',
		description: (
			<>
				{
					'Vertical margins and top padding for an untitled group. The first group has no top margin; a group that is the final child has no bottom margin.'
				}
			</>
		),
	},
	{
		name: 'id',
		type: 'string',
		defaultValue: 'generated unique ID',
		description: (
			<>
				Wrapper ID. Title IDs derive from it; a supplied ID is also a naming fallback for an untitled, unnamed group and
				the key for a group descriptor. Use stable, document-unique IDs when groups can move or change.
			</>
		),
	},
	{
		name: 'items',
		type: 'PopMenuItemBase<T>[]',
		defaultValue: 'undefined',
		description: (
			<>
				{
					'Item descriptors rendered with their callbacks and parent menu behavior. Supply stable item IDs for dynamic lists; missing IDs use positions for static lists. Duplicate labels are supported.'
				}
			</>
		),
	},
	{
		name: 'name',
		type: 'string',
		defaultValue: 'title, then id, then Menu group',
		description: (
			<>
				Optional accessible name that overrides the visible title for naming. Without it, a title labels the wrapper
				through its generated title ID.
			</>
		),
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '8px 10px 0, using spacing tokens',
		description: <>{'Title padding. The first group title always has zero top padding.'}</>,
	},
	{
		name: 'textColor',
		type: 'ColorValue',
		defaultValue: 'var(--core-text-secondary)',
		description: <>{'Title color. Group colors accept Slice tokens or CSS colors.'}</>,
	},
	{
		name: 'textColorHover',
		type: 'ColorValue',
		defaultValue: 'textColor',
		description: <>{'Title color during pointer hover.'}</>,
	},
	{ name: 'textSize', type: 'FixedSize', defaultValue: 's', description: <>{'Title typography size.'}</> },
	{
		name: 'title',
		type: 'string',
		defaultValue: 'undefined',
		description: <>{'Optional title above the items. Also labels the wrapper group.'}</>,
	},
	{
		name: '...divAttributes',
		type: 'HTML div attributes',
		defaultValue: '\u2014',
		description: (
			<>
				{'Apply to the group wrapper. '}
				<Code>{'className'}</Code>
				{' is appended, and '}
				<Code>{'style'}</Code>
				{' can override its CSS variables.'}
			</>
		),
	},
];

export default function PopMenuGroupDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PopMenuGroup component</H1>
			<P clipWidth>Organize related menu actions with an optional title and separators between sections.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Wrap <Code openURL="/docs/react/pop-menu-item/">PopMenuItem</Code> children inside a group, then place the group
				inside <Code openURL="/docs/react/pop-menu/">PopMenu</Code>. Omit <Code>title</Code> for an untitled section.
			</P>
			<TipBox inline noBorder>
				Open the menu to compare the titled first section with the untitled section below it.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-popmenu--grouped"
				components={[
					{
						label: 'Titled and untitled groups',
						component: <PopMenuGroupPreview />,
						code: { code: usageCode.trim(), filename: 'GroupedActions.tsx' },
					},
				]}
			/>
			<H3>Use item descriptors</H3>
			<P>
				Pass <Code>items</Code> when the row contents do not need JSX. Composed <Code>children</Code> take precedence
				when both are supplied. The parent also accepts group descriptors in its <Code>options</Code> array.
			</P>
			<CodeBlock filename="GroupItems.tsx" language="tsx" code={optionsCode.trim()} />
			<H3>Style the section</H3>
			<P>
				Title styling is separate from item styling. Use <Code>borderWidth</Code> to hide a separator or{' '}
				<Code>gap</Code> to adjust section spacing.
			</P>
			<CodeBlock filename="GroupStyle.tsx" language="tsx" code={styleCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				A group is a visual wrapper. It does not own an active submenu or perform its own automatic dismissal. All
				connected groups share their parent menu's one child branch, so an item in another group can close that branch.
			</P>
			<P>
				The first rendered group has no top separator or top margin, even if ungrouped items precede it. Its title also
				has no top padding. A group that is the menu's final child has no bottom margin. Untitled groups receive top
				padding from <Code>gap</Code>.
			</P>
			<P>
				Inside <Code>PopMenu</Code>, items and groups connect automatically through context, including inside custom
				wrappers and fragments. Authored order is preserved. Standalone groups require explicit callbacks and do not
				create a popup. Callbacks run from the item through its containing groups, then the menu.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The wrapper uses <Code>role="group"</Code>. A supplied <Code>name</Code> provides its accessible name; otherwise
				a visible <Code>title</Code> labels it through a generated title ID and <Code>aria-labelledby</Code>. Untitled
				groups fall back to a supplied <Code>id</Code> or <Code>Menu group</Code>.
			</P>
			<P>
				Groups do not add keyboard or focus behavior. Their titles and borders are non-interactive. Item semantics and
				keyboard limitations are documented on{' '}
				<Code openURL="/docs/react/pop-menu-item/#accessibility">PopMenuItem</Code>.
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
			<P>
				Item <Code>onClick</Code> callbacks run before the group, then the menu, followed by automatic dismissal. All
				receive the same details, including optional <Code>data?: T</Code>. Infer <Code>T</Code> from <Code>items</Code>
				, or specify <Code>PopMenuGroup&lt;T&gt;</Code> for composed children with a shared payload shape. Disabled
				items do not emit callbacks.
			</P>
			<Definition id="onClickItem">
				<Method>onClickItem</Method>
				<TypeDef>{'(event: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo<T>) => void'}</TypeDef>
			</Definition>
			<P>
				Receives connected item clicks after the item's own callback and before the parent menu callback and automatic
				dismissal. The payload and toggle/submenu fields match{' '}
				<Code openURL="/docs/react/pop-menu-item/#onClick">PopMenuItem.onClick</Code>.
			</P>
			<Definition id="onHoverItem">
				<Method>onHoverItem</Method>
				<TypeDef>
					{'(event: React.MouseEvent<HTMLButtonElement>, item: { id?: string; label?: string }) => void'}
				</TypeDef>
			</Definition>
			<P>Receives pointer entry from connected items after the item's callback and before the parent hover callback.</P>
			<Definition id="divEvents">
				<Method>...divEvents</Method>
				<TypeDef>HTML div events</TypeDef>
			</Definition>
			<P>
				Native events apply to the group wrapper. Item click events stop propagation, so use <Code>onClickItem</Code>{' '}
				for row actions.
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'PopMenuGroup component' },
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
			{ id: 'onClickItem', title: 'onClickItem', code: true },
			{ id: 'onHoverItem', title: 'onHoverItem', code: true },
			{ id: 'divEvents', title: '...divEvents', code: true },
		],
	},
];

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { MoreAvatarsPreview } from './AvatarGroupPreview';
import {
	AvatarGroupColorsExample,
	AvatarGroupSpacingExample,
	AvatarGroupTypographyExample,
	AvatarGroupUsageExample,
} from './UsagePreviews';
import {
	accessibilityCode,
	childrenCode,
	colorsCode,
	lazyLoadCode,
	moreCode,
	recordCode,
	spacingCode,
	tooltipCode,
	typographyCode,
	usageCode,
} from './code';

export function AvatarGroupDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>AvatarGroup component</H1>
			<P clipWidth>
				Bring a team into view. AvatarGroup gathers profile photos and initials into a compact row for collaborators,
				assignees, and participants.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Pass an <Code>avatars</Code> array to render a row of <Code openURL="/docs/react/avatar/">Avatar</Code>{' '}
				components.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatargroup--default"
				components={[
					{
						label: 'Basic usage',
						component: <AvatarGroupUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'AvatarGroupExample.tsx',
					},
				]}
			/>
			<H3>Compose individual avatars</H3>
			<P>
				Add <Code openURL="/docs/react/avatar/">Avatar</Code> children when each person needs custom props or an action.
				Child props override group defaults, and children replace the <Code>avatars</Code> array when both are supplied.
			</P>
			<CodeBlock filename="AvatarGroupChildren.tsx" language="tsx" code={childrenCode.trim()} />
			<H3>Limit the number of Avatars to display</H3>
			<P>
				Set <Code>limit</Code> to the number of people you want visible. With 15 people and <Code>{'limit={5}'}</Code>,
				five avatars appear followed by <Code>+10</Code>. Use <Code>onMore</Code> to handle displaying all avatars in
				your app.
			</P>
			<TipBox inline noBorder>
				Select the overflow avatar to see the full team.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatargroup--default"
				components={[{ label: 'Overflow avatars', component: <MoreAvatarsPreview />, code: moreCode.trim() }]}
			/>
			<H3>Adjust the spacing</H3>
			<P>
				Set <Code>overlap</Code> to zero and add a <Code>gap</Code> for a separated row. Increase overlap for a tighter
				stack.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatargroup--default"
				components={[
					{
						label: 'Adjust the spacing',
						component: <AvatarGroupSpacingExample />,
						code: spacingCode.trim(),
						codeFilename: 'AvatarGroupSpacing.tsx',
					},
				]}
			/>
			<H3>Style individual people</H3>
			<P>
				Set text and background colors on each record. Use <Code>backgroundColor</Code> on the group for a shared
				fallback, including the overflow avatar. Group appearance settings provide defaults; explicit props on Avatar
				children override them.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatargroup--default"
				components={[
					{
						label: 'Style individual people',
						component: <AvatarGroupColorsExample />,
						code: colorsCode.trim(),
						codeFilename: 'AvatarGroupColors.tsx',
					},
				]}
			/>
			<H3>Load photos as needed</H3>
			<P>
				Enable <Code>lazyLoad</Code> for groups in long lists. The browser defers photos until they approach the
				viewport.
			</P>
			<CodeBlock filename="AvatarGroupLoading.tsx" language="tsx" code={lazyLoadCode.trim()} />
			<H3>Size the initials</H3>
			<P>
				Use <Code>textSize</Code> to set the initials independently of the avatar dimensions.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatargroup--default"
				components={[
					{
						label: 'Size the initials',
						component: <AvatarGroupTypographyExample />,
						code: typographyCode.trim(),
						codeFilename: 'AvatarGroupTypography.tsx',
					},
				]}
			/>
			<H3>Connect a tooltip</H3>
			<P>
				Use <Code>onToolTip</Code> to connect your tooltip UI. Your handler receives the person’s label and avatar ref
				on hover, and <Code>null</Code> when the tooltip should close.
			</P>
			<CodeBlock filename="AvatarGroupTooltip.tsx" language="tsx" code={tooltipCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Avatars stay in their supplied order, with later items drawn over earlier ones where they overlap. The group
				stays in one row without wrapping.
			</P>
			<P>
				Each record’s first and last names form its display name. Photos and initials follow Avatar’s display behavior,
				with the email as an identity fallback. The outer ring keeps overlapping faces distinct.
			</P>
			<P>
				Give each record a unique, stable <Code>id</Code> to preserve its avatar when people reorder. Records without an
				ID use an email-and-index fallback. Create a new array when updating people.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				The wrapper supplies <Code>role="group"</Code> and uses <Code>groupName</Code> for its accessible label,
				defaulting to <Code>people</Code>. Each avatar has its own role and label based on its name or email.
			</P>
			<CodeBlock filename="AvatarGroupAccessibility.tsx" language="tsx" code={accessibilityCode.trim()} />
			<P>
				Supply Avatar children with onClick handlers when each person needs a profile action. Those avatars support
				keyboard activation with Enter and Space. Keep essential names available as text rather than relying on hover
				tooltips alone.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>
				All props are optional. Color props accept Slice theme tokens or CSS colors. Defaults include the effective
				colors and border width inherited by each avatar.
			</P>
			<Definition id={'avatars'}>
				<Prop>avatars</Prop>
				<TypeDef>{'AvatarInfo[] | null'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>People to display, in order, when children is undefined. An empty array or null renders an empty group.</P>
			<P>
				Each <Code>AvatarInfo</Code> record accepts the optional fields below. Pass a URL in <Code>image</Code> to show
				a photo. The optional <Code>id</Code> is used for rendering identity and is not forwarded to the DOM.
			</P>
			<CodeBlock filename="AvatarInfo.ts" language="typescript" code={recordCode.trim()} />
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Default fill for avatars without their own background color, including the overflow avatar. Individual records
				and Avatar children override this value. When undefined, Avatar uses its normal theme fallback. This prop does
				not color the group container.
			</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>Inner border color for every avatar.</P>
			<Definition id={'borderColorHover'}>
				<Prop>borderColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-special'}</DefaultVal>
			</Definition>
			<P>Inner border color on hover. Set a positive borderWidth to make it visible.</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Inner border width in pixels. When omitted, each avatar keeps its own border width or the <Code>Avatar</Code>{' '}
				default of <Code>0</Code>. Explicit child values override the group.
			</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>React.ReactNode</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Avatar children replace the avatars array whenever children is defined, including null or an empty array. Group
				appearance props supply defaults; explicitly defined child props override them. Fragments and components that
				render avatars inherit these defaults too.
			</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Extra space between avatar wrappers in pixels. Combines with overlap; use overlap set to 0 for a separated row.
			</P>
			<Definition id={'groupName'}>
				<Prop>groupName</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>people</DefaultVal>
			</Definition>
			<P>
				Accessible label for the group. Surrounding whitespace is trimmed; omitted or blank names use{' '}
				<Code>people</Code>.
			</P>
			<Definition id={'lazyLoad'}>
				<Prop>lazyLoad</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>false</DefaultVal>
			</Definition>
			<P>
				Enables native browser lazy loading for every photo. Initials remain visible until a photo loads, and on
				failure.
			</P>
			<Definition id={'limit'}>
				<Prop>limit</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Maximum number of people shown. With 15 people and a limit of 5, the group renders five avatars followed by a
				matching <Code>+10</Code> avatar. Omit this prop to show everyone. Zero shows only the overflow avatar; finite
				values are rounded down and clamped to zero, and non-finite values mean unlimited.
			</P>
			<P>
				For children, fragments and arrays are flattened and empty nodes are ignored. Each remaining child counts as one
				slot. Supply one Avatar per slot; the group cannot count avatars inside a custom component.
			</P>
			<Definition id={'margin'}>
				<Prop>margin</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Margin around the group in pixels.</P>
			<Definition id={'outerBorderColor'}>
				<Prop>outerBorderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary'}</DefaultVal>
			</Definition>
			<P>Outer ring color. Match it to the surrounding surface to separate overlapping photos and initials.</P>
			<Definition id={'outerBorderWidth'}>
				<Prop>outerBorderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'3'}</DefaultVal>
			</Definition>
			<P>Outer ring width in pixels, included in each avatar’s size.</P>
			<Definition id={'overlap'}>
				<Prop>overlap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>How far each avatar overlaps the previous one, in pixels. Values at or below 0 disable overlap.</P>
			<Definition id={'size'}>
				<Prop>size</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'40'}</DefaultVal>
			</Definition>
			<P>Width and height of each avatar in pixels, including its borders.</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>m</DefaultVal>
			</Definition>
			<P>Theme typography size for the initials in every avatar.</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Native div attributes pass through to the group wrapper, including id, className, style, and data-*. Role and
				ARIA attributes are managed internally. These attributes do not apply to individual avatars. Supply Avatar
				children to render individual people.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onMore'}>
				<Method>onMore</Method>
				<TypeDef>{'(details: AvatarGroupMore) => void'}</TypeDef>
			</Definition>
			<P>
				Runs when the overflow avatar is clicked or activated with Enter or Space. The payload contains
				<Code>more</Code> (hidden items), <Code>all</Code> (every item), and <Code>source</Code> (<Code>'avatars'</Code>{' '}
				or <Code>'children'</Code>). Both lists preserve input order and exclude the generated overflow avatar. Array
				input returns the original AvatarInfo records; children input returns flattened React nodes with their props,
				handlers, and info intact.
			</P>
			<P>
				Without this callback the overflow avatar is informational and is not keyboard-focusable. Native click events
				bubble to the group as usual.
			</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				Receives a tooltip object with <Code>payload.label</Code>, the child avatar’s <Code>ref</Code>, and the pointer{' '}
				<Code>event</Code> on hover. Receives <Code>null</Code> on leave. A child’s onToolTip overrides this default
				callback. The group does not render a tooltip.
			</P>
			<Definition id={'divEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Native React event handlers pass through to the group wrapper and receive the standard event. They do not
				receive an avatar record or Avatar’s generic <Code>info</Code> argument. Child handlers retain their own info
				and run before the container’s bubbling handlers. Call event.stopPropagation() in a child handler to prevent
				bubbling to the container.
			</P>
		</FlexDiv>
	);
}

export const avatarGroupTrackedItems: TrackedItem[] = [
	{ id: 'title', title: 'AvatarGroup component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'avatars', title: 'avatars', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderColorHover', title: 'borderColorHover', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'groupName', title: 'groupName', code: true },
			{ id: 'lazyLoad', title: 'lazyLoad', code: true },
			{ id: 'limit', title: 'limit', code: true },
			{ id: 'margin', title: 'margin', code: true },
			{ id: 'outerBorderColor', title: 'outerBorderColor', code: true },
			{ id: 'outerBorderWidth', title: 'outerBorderWidth', code: true },
			{ id: 'overlap', title: 'overlap', code: true },
			{ id: 'size', title: 'size', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onMore', title: 'onMore', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'divEvents', title: '...divEvents', code: true },
		],
	},
];

export { AvatarGroupDoc as default, avatarGroupTrackedItems as trackedItems };

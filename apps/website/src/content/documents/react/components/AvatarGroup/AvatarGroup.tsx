import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { AvatarGroup, FlexDiv, Preset } from '@apple-pie/slice';
import {
	accessibilityCode,
	colorsCode,
	lazyLoadCode,
	recordCode,
	spacingCode,
	tooltipCode,
	typographyCode,
	usageCode,
} from './code';
import { participants } from './data';

export function AvatarGroupDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>AvatarGroup component</H1>
			<P clipWidth>
				Bring a team into view. AvatarGroup gathers profile photos and initials into a compact row for collaborators,
				assignees, and participants.
			</P>
			<ComponentCanvas
				name={'AvatarGroup'}
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-avatargroup--default"
				components={
					<AvatarGroup
						avatars={participants}
						size={40}
						borderWidth={0}
						outerBorderColor="core-surface-primary-tint"
						role="group"
						aria-label="Project collaborators"
					/>
				}
			/>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Pass an <Code>avatars</Code> array to render a row of <Code openURL="/docs/react/avatar/">Avatar</Code>{' '}
				components.
			</P>
			<CodeBlock filename="AvatarGroupExample.tsx" language="tsx" code={usageCode.trim()} />
			<H3>Adjust the spacing</H3>
			<P>
				Set <Code>overlap</Code> to zero and add a <Code>gap</Code> for a separated row. Increase overlap for a tighter
				stack.
			</P>
			<CodeBlock filename="AvatarGroupSpacing.tsx" language="tsx" code={spacingCode.trim()} />
			<H3>Style individual people</H3>
			<P>Set text and background colors on each record. Border settings apply to the whole group.</P>
			<CodeBlock filename="AvatarGroupColors.tsx" language="tsx" code={colorsCode.trim()} />
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
			<CodeBlock filename="AvatarGroupTypography.tsx" language="tsx" code={typographyCode.trim()} />
			<H3>Connect a tooltip</H3>
			<P>
				Use <Code>onToolTip</Code> to connect your tooltip UI. Your handler receives the person’s label and avatar ref
				on hover, and <Code>null</Code> when the tooltip should close.
			</P>
			<CodeBlock filename="AvatarGroupTooltip.tsx" language="tsx" code={tooltipCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Avatars stay in array order, with later items drawn over earlier ones where they overlap. All records are shown
				in one row; there is no automatic overflow count or wrapping.
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
				Each avatar has an image role and a label based on its name or email. Give the group an overall label when its
				purpose adds useful context.
			</P>
			<CodeBlock filename="AvatarGroupAccessibility.tsx" language="tsx" code={accessibilityCode.trim()} />
			<P>
				The group does not make individual avatars clickable or keyboard-focusable. Use separate Avatar components when
				each person needs a profile action. Keep essential names available as text rather than relying on hover tooltips
				alone.
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
			<P>People to display, in order. An empty array or null renders an empty group.</P>
			<P>
				Each <Code>AvatarInfo</Code> record accepts the optional fields below. Pass a URL in <Code>image</Code> to show
				a photo. The optional <Code>id</Code> is used for rendering identity and is not forwarded to the DOM.
			</P>
			<CodeBlock filename="AvatarInfo.ts" language="typescript" code={recordCode.trim()} />
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
				<DefaultVal>{'3'}</DefaultVal>
			</Definition>
			<P>Inner border width in pixels for every avatar.</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				Extra space between avatar wrappers in pixels. Combines with overlap; use overlap set to 0 for a separated row.
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
				<DefaultVal>{'32'}</DefaultVal>
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
				Native div attributes pass through to the group wrapper, including id, className, style, data-* and aria-*. They
				do not apply to individual avatars. Children are not rendered.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				Receives a tooltip object with <Code>payload.label</Code>, the child avatar’s <Code>ref</Code>, and the pointer{' '}
				<Code>event</Code> on hover. Receives <Code>null</Code> on leave. The group does not render a tooltip.
			</P>
			<Definition id={'divEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Native React event handlers pass through to the group wrapper and receive the standard event. They do not
				receive an avatar record or Avatar’s generic <Code>info</Code> argument.
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
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderColorHover', title: 'borderColorHover', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'lazyLoad', title: 'lazyLoad', code: true },
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
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'divEvents', title: '...divEvents', code: true },
		],
	},
];

export { AvatarGroupDoc as default, avatarGroupTrackedItems as trackedItems };

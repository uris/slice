import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ChipRemoveExample, ChipSelectionExample, ChipStylingExample, ChipUsageExample } from './UsagePreviews';
import { actionCode, removeCode, selectionCode, stylingCode, tooltipCode, usageCode } from './code';

export function ChipDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id={'title'}>Chip component</H1>
			<P clipWidth>
				Give tags and compact actions a clear shape. Chip combines text, an optional icon, and colors that fit your UI.
			</P>
			<H2 id={'usage'}>Usage</H2>
			<P>
				Set <Code>label</Code> for text, or omit it and pass children for custom content.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-chip--default"
				components={[
					{
						label: 'Basic usage',
						component: <ChipUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'ChipExample.tsx',
					},
				]}
			/>
			<H3>Add an action</H3>
			<P>
				Provide <Code>onClick</Code> to make the chip a native button and handle the action in your app.
			</P>
			<CodeBlock filename="ActionChip.tsx" language="tsx" code={actionCode.trim()} />
			<H3>Select a chip</H3>
			<P>
				Pass <Code>selected</Code> and update it in <Code>onClick</Code>. A changing label resizes smoothly with Water
				motion.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-chip--default"
				components={[
					{
						label: 'Select a chip',
						component: <ChipSelectionExample />,
						code: selectionCode.trim(),
						codeFilename: 'SelectableChip.tsx',
					},
				]}
			/>
			<H3>Allow removal</H3>
			<P>
				Provide <Code>onRemove</Code> to show a separate remove button. Your handler removes the chip from your app’s
				state.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-chip--default"
				components={[
					{
						label: 'Allow removal',
						component: <ChipRemoveExample />,
						code: removeCode.trim(),
						codeFilename: 'RemovableChip.tsx',
					},
				]}
			/>
			<H3>Adjust appearance and spacing</H3>
			<P>
				Use <Code>textSize</Code> for typography and <Code>padding</Code> for spacing, including CSS shorthands such as
				<Code>"4px 8px"</Code>. Individual padding sides override that value.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-chip--default"
				components={[
					{
						label: 'Adjust appearance and spacing',
						component: <ChipStylingExample />,
						code: stylingCode.trim(),
						codeFilename: 'StyledChip.tsx',
					},
				]}
			/>
			<H3>Connect a tooltip</H3>
			<P>
				Provide text and connect <Code>onToolTip</Code> to your tooltip UI.
			</P>
			<CodeBlock filename="ChipTooltip.tsx" language="tsx" code={tooltipCode.trim()} />
			<H2 id={'behavior'}>Behavior</H2>
			<P>
				Without onClick, the chip’s content is static. With onClick, it becomes a native button. Selection and removal
				are controlled by your app.
			</P>
			<P>
				Default padding is reduced on icon edges to account for space inside SVGs, including the remove icon. Explicit
				padding values override this adjustment.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				Action and remove buttons support Enter and Space, a visible keyboard focus indicator, and native disabled
				behavior. Their text supplies the accessible name; give icon-only buttons an <Code>aria-label</Code>. Icons are
				decorative and do not add tab stops.
			</P>
			<P>
				Selected action buttons expose aria-pressed. Removal is a separate sibling button, so it never activates the
				main action. Static content has no button role or automatic tab stop. After removing a focused chip, your app
				should move focus to a useful nearby control.
			</P>
			<P>
				Color and layout transitions use Water motion. These and exit transitions are disabled when the user prefers
				reduced motion.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent'}</DefaultVal>
			</Definition>
			<P>Chip background.</P>
			<Definition id={'backgroundColorHover'}>
				<Prop>backgroundColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'click-dependent'}</DefaultVal>
			</Definition>
			<P>
				Hover and keyboard-focus background. Static chips keep backgroundColor; clickable chips use
				core-surface-secondary. Disabled chips keep backgroundColor.
			</P>
			<Definition id={'backgroundColorSelected'}>
				<Prop>backgroundColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>Selected background. Takes priority over hover; disabled chips keep backgroundColor.</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>Normal border color.</P>
			<Definition id={'borderColorDisabled'}>
				<Prop>borderColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>Border color while disabled, including hover.</P>
			<Definition id={'borderColorHover'}>
				<Prop>borderColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'click-dependent'}</DefaultVal>
			</Definition>
			<P>
				Hover and keyboard-focus border color. Static chips keep borderColor; clickable chips use core-text-special.
			</P>
			<Definition id={'borderColorSelected'}>
				<Prop>borderColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-special'}</DefaultVal>
			</Definition>
			<P>Selected border color. Disabled chips use borderColorDisabled.</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-m'}</DefaultVal>
			</Definition>
			<P>Corner radius. Numbers are pixels; strings accept CSS values.</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>Border width in pixels.</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Content when label is absent. Numeric content such as 0 is supported.</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Applies disabled colors and blocks the click callback. All action and remove buttons use native disabled
				behavior and leave the tab order.
			</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>Space between the icon and text in pixels.</P>
			<Definition id={'icon'}>
				<Prop>icon</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Slice icon name. Omit for text only.</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>Icon color. Disabled chips use core-text-disabled.</P>
			<Definition id={'iconColorHover'}>
				<Prop>iconColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'click-dependent'}</DefaultVal>
			</Definition>
			<P>
				Hover and keyboard-focus icon color. Static chips keep iconColor; clickable chips use core-text-special.
				Disabled chips use core-text-disabled.
			</P>
			<Definition id={'iconColorSelected'}>
				<Prop>iconColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-special'}</DefaultVal>
			</Definition>
			<P>Selected icon color. Disabled chips use core-text-disabled.</P>
			<Definition id={'iconPosition'}>
				<Prop>iconPosition</Prop>
				<TypeDef>{"'left' | 'right'"}</TypeDef>
				<DefaultVal>{'left'}</DefaultVal>
			</Definition>
			<P>Places the icon before or after the content.</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>Icon width and height in pixels.</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Primary text. Replaces children whenever supplied, including an empty string.</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Padding shorthand. Numbers use pixels; strings accept CSS lengths, theme tokens, and one to four values.
				Individual side props take priority. When omitted, spacing follows textSize with optical adjustment at icon
				edges, including the remove icon.
			</P>
			<Definition id={'paddingBottom'}>
				<Prop>paddingBottom</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Bottom padding as a pixel number or CSS length. Overrides padding for this side.</P>
			<Definition id={'paddingLeft'}>
				<Prop>paddingLeft</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Left padding as a pixel number or CSS length. Overrides padding for this side.</P>
			<Definition id={'paddingRight'}>
				<Prop>paddingRight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Right padding as a pixel number or CSS length. Overrides padding for this side.</P>
			<Definition id={'paddingTop'}>
				<Prop>paddingTop</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Top padding as a pixel number or CSS length. Overrides padding for this side.</P>
			<Definition id={'removeLabel'}>
				<Prop>removeLabel</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'derived from label'}</DefaultVal>
			</Definition>
			<P>
				Accessible name of the remove button. Defaults to Remove followed by the text label, or Remove chip when there
				is no plain-text label.
			</P>
			<Definition id={'selected'}>
				<Prop>selected</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Controlled selection state. Clickable chips expose aria-pressed when supplied. Update selected in onClick; Chip
				does not toggle it internally.
			</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>Primary text color. Disabled chips use core-text-disabled.</P>
			<Definition id={'textColorHover'}>
				<Prop>textColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'click-dependent'}</DefaultVal>
			</Definition>
			<P>
				Hover and keyboard-focus text color. Static chips keep textColor; clickable chips use core-text-special.
				Disabled chips use core-text-disabled.
			</P>
			<Definition id={'textColorSelected'}>
				<Prop>textColorSelected</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-special'}</DefaultVal>
			</Definition>
			<P>Selected text color. Disabled chips use core-text-disabled.</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>Theme typography size for label or children. Also sets the default padding.</P>
			<Definition id={'tooltip'}>
				<Prop>tooltip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Text sent to onToolTip on hover or focus. Your application renders the tooltip.</P>
			<Definition id={'elementAttributes'}>
				<Prop>...elementAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement> | React.ButtonHTMLAttributes<HTMLButtonElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				With onClick, native button attributes apply to the main action; otherwise div attributes apply to the static
				content. className and style apply to the outer layout wrapper. Button attributes such as type and form require
				onClick.
			</P>

			<H2 id={'motion'}>Motion</H2>
			<P>
				Chip uses <Code openURL="https://motion.dev/">Motion</Code> layout animation on a <Code>motion.div</Code>{' '}
				wrapper to resize smoothly when its label changes.
			</P>
			<P>
				Chip manages removal presence internally; no parent presence wrapper is needed. Pressing remove fades the chip
				out and scales it to 0.9, then calls <Code>onRemove</Code> once. Exiting chips cannot receive input and are
				hidden from assistive technology. Reduced motion removes them immediately.
			</P>

			<Definition id={'layout'}>
				<Prop>layout</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'selected is supplied'}</DefaultVal>
			</Definition>
			<P>
				Enables Motion layout animation for size changes. Automatically enabled when selected is supplied; set false to
				disable, or true for other content changes.
			</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'150ms, Water easing'}</DefaultVal>
			</Definition>
			<P>
				Motion layout and exit transition options. Defaults to 150ms with the theme’s Water easing. Does not change CSS
				color transitions.
			</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'React.MouseEventHandler<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Creates the main native button and handles pointer or keyboard activation. Chip does not change selected
				automatically. Disabled chips do not call it.
			</P>
			<Definition id={'onRemove'}>
				<Method>onRemove</Method>
				<TypeDef>{'React.MouseEventHandler<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Shows the remove button and handles its activation. Exits the chip, then calls this callback once. Does not call
				onClick. Disabled chips do not call it.
			</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				Receives tooltip text and the root ref on hover or focus. A mouse event is included for hover only. null
				dismisses the tooltip after activation or when both hover and focus have left.
			</P>
			<Definition id={'elementEvents'}>
				<Method>...elementEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement> | React.DOMAttributes<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Native events apply to the main button or static content, according to onClick. Mouse and focus handlers compose
				with tooltip behavior; native keyboard handlers pass through. Preventing default on mouse enter or focus
				suppresses its tooltip request.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Chip component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorHover', title: 'backgroundColorHover', code: true },
			{ id: 'backgroundColorSelected', title: 'backgroundColorSelected', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderColorDisabled', title: 'borderColorDisabled', code: true },
			{ id: 'borderColorHover', title: 'borderColorHover', code: true },
			{ id: 'borderColorSelected', title: 'borderColorSelected', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'icon', title: 'icon', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconColorHover', title: 'iconColorHover', code: true },
			{ id: 'iconColorSelected', title: 'iconColorSelected', code: true },
			{ id: 'iconPosition', title: 'iconPosition', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'label', title: 'label', code: true },

			{ id: 'padding', title: 'padding', code: true },
			{ id: 'paddingBottom', title: 'paddingBottom', code: true },
			{ id: 'paddingLeft', title: 'paddingLeft', code: true },
			{ id: 'paddingRight', title: 'paddingRight', code: true },
			{ id: 'paddingTop', title: 'paddingTop', code: true },
			{ id: 'removeLabel', title: 'removeLabel', code: true },
			{ id: 'selected', title: 'selected', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorHover', title: 'textColorHover', code: true },
			{ id: 'textColorSelected', title: 'textColorSelected', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'tooltip', title: 'tooltip', code: true },

			{ id: 'elementAttributes', title: '...elementAttributes', code: true },
		],
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'layout', title: 'layout', code: true },
			{ id: 'transition', title: 'transition', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onRemove', title: 'onRemove', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'elementEvents', title: '...elementEvents', code: true },
		],
	},
];

export default ChipDoc;

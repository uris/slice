import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	ButtonActionPreview,
	ButtonChildrenPreview,
	ButtonFormPreview,
	ButtonMotionPreview,
	ButtonPreview,
	ButtonProgressPreview,
	ButtonRefPreview,
	ButtonTooltipPreview,
	ButtonWorkingPreview,
} from './ButtonPreview';
import {
	childrenCode,
	disabledCode,
	formCode,
	iconOnlyCode,
	iconsCode,
	motionCode,
	outlineCode,
	progressCode,
	refCode,
	solidCode,
	stylingCode,
	textCode,
	tooltipCode,
	usageCode,
	workingCode,
} from './code';

export function ButtonDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id={'title'}>Button component</H1>
			<P clipWidth>Make the next step clear. Button brings labels, icons, and busy states to the actions in your UI.</P>
			<H2 id={'usage'}>Usage</H2>
			<H3>Basic use of variants</H3>
			<P>
				Use <Code>solid</Code> for emphasis, <Code>outline</Code> for a bordered action, or <Code>text</Code> for a
				quieter option.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[
					{
						label: 'Solid',
						component: <ButtonPreview label="Solid" variant="solid" />,
						code: { code: solidCode.trim() },
					},
					{
						label: 'Outline',
						component: <ButtonPreview label="Outline" variant="outline" />,
						code: { code: outlineCode.trim() },
					},
					{
						label: 'Text',
						component: <ButtonPreview label="Text Button" variant="text" />,
						code: { code: textCode.trim() },
					},
				]}
			/>
			<H3>Handle actions</H3>
			<P>
				Set a <Code>label</Code> and connect <Code>onClick</Code> to your application action.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[{ label: 'Handle actions', component: <ButtonActionPreview />, code: { code: usageCode.trim() } }]}
			/>

			<H3>Add icons</H3>
			<P>
				Place an icon on either side of the label. Give icon-only actions an <Code>aria-label</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[
					{
						label: 'Icon beside a label',
						component: <ButtonPreview label="Continue" iconRight="arrows.arrow-right" />,
						code: { code: iconsCode.trim() },
					},
					{
						label: 'Icon only',
						component: <ButtonPreview iconLeft="basic.cross" round aria-label="Quit" />,
						code: { code: iconOnlyCode.trim() },
					},
				]}
			/>

			<H3>Custom content</H3>
			<P>
				Use <Code>children</Code> for an avatar and text or another custom composition. Set{' '}
				<Code>buttonSize="auto"</Code> to fit the content, with 6px top and bottom padding. Children form a centered
				flex row; <Code>gap</Code> defaults to 4px and accepts 0. Use padding props or a wrapper for additional spacing.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--auto-children"
				components={[
					{ label: 'Custom content', component: <ButtonChildrenPreview />, code: { code: childrenCode.trim() } },
				]}
			/>
			<H3>Disable an action</H3>
			<P>
				Set <Code>disabled</Code> while an action is unavailable. Disabled buttons cannot be activated by mouse or
				keyboard.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[
					{
						label: 'Disabled',
						component: <ButtonPreview label="Continue" disabled />,
						code: { code: disabledCode.trim() },
					},
				]}
			/>
			<H3>Adjust size and color</H3>
			<P>
				Use <Code>buttonSize</Code> for layout, <Code>textSize</Code> for typography, and <Code>width="fill"</Code> to
				fill the parent.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[
					{
						label: 'Size and color',
						component: (
							<div style={{ width: 320, maxWidth: '100%' }}>
								<ButtonPreview
									label="Continue"
									variant="solid"
									buttonSize="l"
									textSize="l"
									backgroundColor="#2563eb"
									textColor="#ffffff"
									width="fill"
								/>
							</div>
						),
						code: { code: stylingCode.trim() },
					},
				]}
			/>

			<H3>Show real work in progress</H3>
			<P>
				Pass your application’s async <Code>saveChanges</Code> function to this example. Set <Code>working</Code> while
				the request runs, then clear it when the request finishes.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[{ label: 'Working', component: <ButtonWorkingPreview />, code: { code: workingCode.trim() } }]}
			/>

			<H3>Delay an action</H3>
			<P>
				Use <Code>progress</Code> with a <Code>duration</Code> for a timed delay before the callback runs. This timer
				does not track a real operation; use <Code>working</Code> for requests and form submissions.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[
					{ label: 'Delayed action', component: <ButtonProgressPreview />, code: { code: progressCode.trim() } },
				]}
			/>

			<H3>Submit a form</H3>
			<P>
				Native form attributes pass through. The default type is button, so set <Code>type="submit"</Code> explicitly.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[{ label: 'Form submission', component: <ButtonFormPreview />, code: { code: formCode.trim() } }]}
			/>

			<H3>Connect a tooltip</H3>
			<P>
				Provide the tooltip text and connect <Code>onToolTip</Code> to your tooltip UI.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[{ label: 'Tooltip', component: <ButtonTooltipPreview />, code: { code: tooltipCode.trim() } }]}
			/>

			<H2 id={'behavior'}>Behavior</H2>
			<P>
				<Code>children</Code> take priority over <Code>label</Code>. Icons are decorative and do not add tab stops. The
				optional count uses <Code openURL="/docs/react/badge/">Badge</Code> and hides zero or invalid values.
			</P>
			<P>
				Both native <Code>disabled</Code> and <Code>state="disabled"</Code> block activation. Busy buttons also block
				repeated actions and hide the count and dot until they return to normal.
			</P>
			<P>
				Controlled <Code>working</Code> shows the spinner until your application clears it, without firing another
				click. Timed progress waits for its duration, then calls <Code>onClick</Code> once with <Code>undefined</Code>.
				Disabling the button or unmounting it cancels that pending action.
			</P>
			<P>
				Timed progress suppresses immediate form submission and does not submit a form or follow a link on completion.
				For form work, use the form’s submit handler and a controlled working state.
			</P>
			<P>
				The link prop opens a URL through window.open after an ordinary click callback. It remains a button rather than
				a native anchor. Use an anchor when you need ordinary link behavior such as opening a context menu.
			</P>
			<H2 id={'accessibility'}>Accessibility</H2>
			<P>
				Button uses a native button with Enter and Space activation and a visible keyboard focus ring. Icon-only actions
				need a descriptive aria-label; tooltip text is not an accessible label.
			</P>
			<P>
				Busy state sets aria-busy and disables activation. The action label stays available to assistive technology even
				when a centered spinner replaces it visually. Provide separate status or error feedback for the result of an
				operation.
			</P>
			<P>
				Button respects <Code>prefers-reduced-motion: reduce</Code> automatically, including live preference changes.
				Custom variants resolve to their target state immediately, without delays or repeats; entrance, exit, and hover
				transitions are skipped. The button stays mounted so keyboard focus is preserved.
			</P>
			<H2 id={'props'}>Props</H2>
			<P>
				All component props are optional. Color props accept Slice theme tokens or CSS colors. Defaults below include
				effective variant and theme values.
			</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'variant background'}</DefaultVal>
			</Definition>
			<P>
				Background color in normal and hover states. Overrides the preset for every variant; fill takes priority while
				enabled.
			</P>
			<Definition id={'backgroundColorDisabled'}>
				<Prop>backgroundColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'variant disabled background'}</DefaultVal>
			</Definition>
			<P>Background color when disabled. Independent of backgroundColor.</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>ColorValue</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Overrides the border color for every variant, size, and state, including hover and disabled. When omitted, the
				variant’s color applies.
			</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'corner-round'}</DefaultVal>
			</Definition>
			<P>Corner radius. Numbers use pixels; strings accept CSS lengths.</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Overrides the border width for every variant and size. Numbers use pixels; strings accept CSS lengths. Explicit
				zero removes the border. When omitted, the variant’s width applies.
			</P>
			<Definition id={'buttonSize'}>
				<Prop>buttonSize</Prop>
				<TypeDef>{"'auto' | 's' | 'm' | 'l' | 'xl' | number"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				Shared frame sizes: s=24, m=36, l=44, and xl=56px. A positive number sets a pixel height; auto fits the content
				and padding. Typography is controlled separately by textSize.
			</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Custom content in a vertically centered flex row. Takes priority over label; keep it noninteractive. Use
				buttonSize="auto" to fit taller children.
			</P>
			<Definition id={'count'}>
				<Prop>count</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Optional count badge. Zero and invalid numbers are hidden; numbers above 99 show 99+. Hidden while busy.</P>
			<Definition id={'destructive'}>
				<Prop>destructive</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Uses the warning color preset for destructive actions. Explicit color overrides still apply.</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Native disabled state. Blocks pointer, keyboard, ref, and trigger activation. Also cancels a pending timed
				action.
			</P>
			<Definition id={'duration'}>
				<Prop>duration</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Timed progress delay in seconds. Requires progress and a positive, finite value. Has no effect on controlled
				working state.
			</P>
			<Definition id={'fill'}>
				<Prop>fill</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Uses core-surface-primary for the enabled background, ahead of variant and backgroundColor. This controls the
				fill color, not width.
			</P>
			<Definition id="gap">
				<Prop>gap</Prop>
				<TypeDef>number</TypeDef>
				<DefaultVal>4</DefaultVal>
			</Definition>
			<P>Spacing in pixels between icons and content, and between children. Use 0 for no gap.</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'variant icon color'}</DefaultVal>
			</Definition>
			<P>Color of both icons. Overrides the preset in all states.</P>
			<Definition id={'iconDualTone'}>
				<Prop>iconDualTone</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Enables the optional translucent layer on icons that support dual tone.</P>
			<Definition id={'iconLeft'}>
				<Prop>iconLeft</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Registered icon name displayed before the label.</P>
			<Definition id={'iconRight'}>
				<Prop>iconRight</Prop>
				<TypeDef>{'SliceIcon'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Registered icon name displayed after the label.</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>Icon and spinner size in pixels.</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Visible action label when children is not supplied.</P>
			<Definition id={'link'}>
				<Prop>link</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				URL opened after a normal activation with window.open. onClick can cancel navigation with
				event.preventDefault(). Timed progress does not navigate on completion.
			</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>number | string</TypeDef>
				<DefaultVal>automatic</DefaultVal>
			</Definition>
			<P>
				Overrides padding on all sides. Children and auto-sized buttons default to 6px vertically; labels in fixed
				frames use zero vertical padding. Regular horizontal padding is 12px, reduced by 4px on icon edges. Text buttons
				use 4px horizontally; round buttons center their content. Individual side props take precedence.
			</P>
			<Definition id="paddingBottom">
				<Prop>paddingBottom</Prop>
				<TypeDef>number | string</TypeDef>
				<DefaultVal>automatic</DefaultVal>
			</Definition>
			<P>Bottom padding; overrides padding.</P>
			<Definition id={'paddingLeft'}>
				<Prop>paddingLeft</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'automatic'}</DefaultVal>
			</Definition>
			<P>Left padding, overriding the shared optical defaults and padding. Numbers are pixels.</P>
			<Definition id={'paddingRight'}>
				<Prop>paddingRight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'automatic'}</DefaultVal>
			</Definition>
			<P>Right padding, overriding the shared optical defaults and padding. Numbers are pixels.</P>
			<Definition id="paddingTop">
				<Prop>paddingTop</Prop>
				<TypeDef>number | string</TypeDef>
				<DefaultVal>automatic</DefaultVal>
			</Definition>
			<P>Top padding; overrides padding.</P>
			<Definition id={'progress'}>
				<Prop>progress</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Enables delayed activation when duration is positive and finite. The spinner runs first, then onClick receives
				undefined once. Without a valid duration, activation is immediate.
			</P>
			<Definition id={'round'}>
				<Prop>round</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Makes the default-width button circular. Intended for icon-only actions with an accessible label.</P>
			<Definition id={'showDot'}>
				<Prop>showDot</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Shows a status dot. Hidden while busy.</P>
			<Definition id={'state'}>
				<Prop>state</Prop>
				<TypeDef>{"'normal' | 'hover' | 'disabled'"}</TypeDef>
				<DefaultVal>{'normal'}</DefaultVal>
			</Definition>
			<P>
				Forces the hover or disabled presentation. Use disabled for ordinary application disabling; either disabled
				mechanism blocks activation.
			</P>
			<Definition id={'target'}>
				<Prop>target</Prop>
				<TypeDef>{"'_blank' | '_self' | '_parent' | '_top'"}</TypeDef>
				<DefaultVal>{'_self'}</DefaultVal>
			</Definition>
			<P>Window target used with link.</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'variant text color'}</DefaultVal>
			</Definition>
			<P>Text color in normal and hover states. Disabled text retains the disabled preset.</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>Theme typography size for the label or children.</P>
			<Definition id={'tooltip'}>
				<Prop>tooltip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Label sent to onToolTip on hover or focus. The component does not display a tooltip by itself.</P>
			<Definition id={'trigger'}>
				<Prop>trigger</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Requests one activation when it becomes true, including an initially true value. Reset to false before
				triggering again. Requests made while disabled or busy are ignored, not queued.
			</P>
			<Definition id={'type'}>
				<Prop>type</Prop>
				<TypeDef>{"'button' | 'submit' | 'reset'"}</TypeDef>
				<DefaultVal>{'button'}</DefaultVal>
			</Definition>
			<P>Native form behavior. Use submit or reset inside a form; the default avoids accidental submission.</P>
			<Definition id={'underline'}>
				<Prop>underline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Underlines the label on hover and keyboard focus.</P>
			<Definition id={'variant'}>
				<Prop>variant</Prop>
				<TypeDef>{"'solid' | 'outline' | 'text'"}</TypeDef>
				<DefaultVal>{'outline'}</DefaultVal>
			</Definition>
			<P>
				Visual preset. Solid emphasizes the action, outline adds a border, and text uses a transparent background unless
				overridden.
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'min-content'}</DefaultVal>
			</Definition>
			<P>
				CSS width, or fill to take the available parent width. Min-content sizes to the content; the label truncates
				when constrained.
			</P>
			<Definition id={'working'}>
				<Prop>working</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				Controlled busy state. Shows a spinner and blocks repeated activation until false. Changing this prop does not
				call onClick or determine whether an operation succeeded.
			</P>
			<Definition id={'buttonAttributes'}>
				<Prop>...buttonAttributes</Prop>
				<TypeDef>{'React.ButtonHTMLAttributes<HTMLButtonElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Other native attributes pass through, including form, name, value, title, data-* and aria-*. className is
				appended and style is merged; component styles take priority for the properties they manage. Disabled and busy
				attributes remain consistent with the component state.
			</P>
			<H2 id={'motion'}>Motion</H2>
			<P>
				Button uses <Code openURL="https://motion.dev/">Motion</Code>’s <Code>motion.button</Code>. The animation props
				below configure that element. Reduced-motion preferences take priority over custom animation timing.
			</P>
			<P>
				Define named <Code>variants</Code> and select them with <Code>initial</Code> and <Code>animate</Code>. Exit
				animations also need an <Code>AnimatePresence</Code> parent.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[{ label: 'Animation', component: <ButtonMotionPreview />, code: { code: motionCode.trim() } }]}
			/>
			<Definition id={'animate'}>
				<Prop>animate</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Named Motion variant to animate toward. Define the values in variants.</P>
			<Definition id={'exit'}>
				<Prop>exit</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Named Motion variant for exit animation. Requires an <Code>AnimatePresence</Code> parent to animate removal.
			</P>
			<Definition id={'initial'}>
				<Prop>initial</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Named Motion variant used for the initial appearance.</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Motion transition options. Duration here is measured in seconds and controls animation, independently of the
				progress delay.
			</P>
			<Definition id={'variants'}>
				<Prop>variants</Prop>
				<TypeDef>{'Variants'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Named Motion animation definitions used by initial, animate, and exit.</P>
			<H2 id={'events'}>Events</H2>
			<Definition id={'onAnimationStart'}>
				<Method>onAnimationStart</Method>
				<TypeDef>{"HTMLMotionProps<'button'>['onAnimationStart']"}</TypeDef>
			</Definition>
			<P>Motion animation-start callback. Receives an animation definition, not a native AnimationEvent.</P>
			<Definition id={'onClick'}>
				<Method>onClick</Method>
				<TypeDef>{'(event: React.MouseEvent<HTMLButtonElement> | undefined) => void'}</TypeDef>
			</Definition>
			<P>
				Receives the click event for normal pointer or keyboard activation. Receives undefined for ref/trigger
				activation and after timed progress. Controlled working does not emit a completion click.
			</P>
			<Definition id={'onToolTip'}>
				<Method>onToolTip</Method>
				<TypeDef>{'(tip: ToolTip | null) => void'}</TypeDef>
			</Definition>
			<P>
				Receives type, payload.label, and the button ref on hover or focus. Hover also includes the pointer event. Null
				clears the tooltip after hover and focus end, or on activation.
			</P>
			<Definition id={'buttonEvents'}>
				<Method>...buttonEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLButtonElement>'}</TypeDef>
			</Definition>
			<P>
				Other native handlers pass through. onMouseEnter, onMouseLeave, onFocus, and onBlur run alongside internal hover
				and tooltip behavior. The animation callback above uses Motion’s signature.
			</P>
			<H2 id={'ref'}>Ref</H2>
			<P>
				The ref exposes <Code>ButtonHandle</Code>, not the DOM button. In a client component, use the handle when a
				separate control needs to activate the same action.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-button--default"
				components={[
					{ label: 'Activate through a ref', component: <ButtonRefPreview />, code: { code: refCode.trim() } },
				]}
			/>
			<Definition id={'triggerClick'}>
				<Method>triggerClick</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				Runs the same activation path with no mouse event. Honors disabled and busy state, link behavior, and timed
				progress. It does not focus the button or perform native submit/reset behavior.
			</P>
		</FlexBox>
	);
}

export const buttonTrackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Button component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorDisabled', title: 'backgroundColorDisabled', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'buttonSize', title: 'buttonSize', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'count', title: 'count', code: true },
			{ id: 'destructive', title: 'destructive', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'duration', title: 'duration', code: true },
			{ id: 'fill', title: 'fill', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconDualTone', title: 'iconDualTone', code: true },
			{ id: 'iconLeft', title: 'iconLeft', code: true },
			{ id: 'iconRight', title: 'iconRight', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'link', title: 'link', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'paddingBottom', title: 'paddingBottom', code: true },
			{ id: 'paddingLeft', title: 'paddingLeft', code: true },
			{ id: 'paddingRight', title: 'paddingRight', code: true },
			{ id: 'paddingTop', title: 'paddingTop', code: true },
			{ id: 'progress', title: 'progress', code: true },
			{ id: 'round', title: 'round', code: true },
			{ id: 'showDot', title: 'showDot', code: true },
			{ id: 'state', title: 'state', code: true },
			{ id: 'target', title: 'target', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'tooltip', title: 'tooltip', code: true },
			{ id: 'trigger', title: 'trigger', code: true },
			{ id: 'type', title: 'type', code: true },
			{ id: 'underline', title: 'underline', code: true },
			{ id: 'variant', title: 'variant', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'working', title: 'working', code: true },
			{ id: 'buttonAttributes', title: '...buttonAttributes', code: true },
		],
	},
	{
		id: 'motion',
		title: 'Motion',
		items: [
			{ id: 'animate', title: 'animate', code: true },
			{ id: 'exit', title: 'exit', code: true },
			{ id: 'initial', title: 'initial', code: true },
			{ id: 'transition', title: 'transition', code: true },
			{ id: 'variants', title: 'variants', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onAnimationStart', title: 'onAnimationStart', code: true },
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'buttonEvents', title: '...buttonEvents', code: true },
		],
	},
	{ id: 'ref', title: 'Ref', items: [{ id: 'triggerClick', title: 'triggerClick', code: true }] },
];

export { ButtonDoc as default, buttonTrackedItems as trackedItems };

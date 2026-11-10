import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	DropDownGuidanceExample,
	DropDownLabelsExample,
	DropDownUnderlineExample,
	DropDownUsageExample,
} from './UsagePreviews';
import { controlledCode, guidanceCode, labelsCode, optionsCode, typedCode, underlineCode, usageCode } from './code';

export function DropDownDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">DropDown component</H1>
			<P clipWidth>
				{
					'Keep a short list of choices easy to scan and select, with native keyboard interaction and typed option data.'
				}
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				{'Compose native '}
				<Code>{'option'}</Code>
				{' elements and give the field a meaningful '}
				<Code>{'name'}</Code>
				{'. Use '}
				<Code>{'onChange'}</Code>
				{' to receive the selected value and option data.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-dropdown--default"
				components={[
					{
						label: 'Basic usage',
						component: <DropDownUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'DropDownExample1.tsx',
					},
				]}
			/>
			<H3>Use options</H3>
			<P>
				{'Pass an '}
				<Code>{'options'}</Code>
				{' array as an alternative to composition. Both forms use the same selection, form, and label behavior.'}
			</P>
			<CodeBlock filename="DropDownExample2.tsx" language="tsx" code={optionsCode.trim()} />
			<H3>Position the label</H3>
			<P>
				{'Use '}
				<Code>{'variant'}</Code>
				{' to place the label. '}
				<Code>{'behavior="appear"'}</Code>
				{' animates stacked labels when a choice is selected.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-dropdown--default"
				components={[
					{
						label: 'Position the label',
						component: <DropDownLabelsExample />,
						code: labelsCode.trim(),
						codeFilename: 'DropDownExample3.tsx',
					},
				]}
			/>
			<H3>Underline border style</H3>
			<P>
				{'Use '}
				<Code>{'borderStyle'}</Code>
				{' to control weather to show a complete border or simply an underline accent.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-dropdown--default"
				components={[
					{
						label: 'Border style underline',
						component: <DropDownUnderlineExample />,
						code: underlineCode.trim(),
						codeFilename: 'DropDownExample.tsx',
					},
				]}
			/>
			<H3>Control selection</H3>
			<P>
				{'Use '}
				<Code>{'value'}</Code>
				{' with '}
				<Code>{'onChange'}</Code>
				{' for application state, or '}
				<Code>{'defaultValue'}</Code>
				{' for local selection. Use a client component when server rendering with frameworks such as Next.js.'}
			</P>
			<CodeBlock filename="DropDownExample4.tsx" language="tsx" code={controlledCode.trim()} />
			<H3>Use typed values</H3>
			<P>
				{'Match equivalent object values through a stable '}
				<Code>{'valueKey'}</Code>
				{'. The callback receives the original typed value and option.'}
			</P>
			<CodeBlock filename="DropDownExample5.tsx" language="tsx" code={typedCode.trim()} />
			<H3>Add field guidance</H3>
			<P>
				{'Provide a '}
				<Code>{'tip'}</Code>
				{' for normal use and an '}
				<Code>{'errorMessage'}</Code>
				{' for validation feedback.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-dropdown--default"
				components={[
					{
						label: 'Add field guidance',
						component: <DropDownGuidanceExample />,
						code: guidanceCode.trim(),
						codeFilename: 'DropDownExample6.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				{'A leading '}
				<Code>{'--'}</Code>
				{
					' remains visible in the option menu and is hidden on the closed face. That option stays selectable so users can return to it.'
				}
			</P>
			<P>
				{
					'Selection follows the value when options move. If the selected value disappears, the old label is cleared rather than left on screen.'
				}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'The visible '}
				<Code>{'label'}</Code>
				{' is associated with the native select. Use '}
				<Code>{'inputName'}</Code>
				{' for a more specific accessible name; without a label, it falls back to '}
				<Code>{'name'}</Code>
				{', then '}
				<Code>{'Select an option'}</Code>
				{'.'}
			</P>
			<P>
				{'The native select retains platform keyboard interaction. Focus uses '}
				<Code>{'borderColorFocused'}</Code>
				{
					'; the chevron and mirrored selection text are decorative. Disabled state blocks interaction; error state marks the select invalid.'
				}
			</P>
			<P>
				{'The visible '}
				<Code>{'tip'}</Code>
				{' or '}
				<Code>{'errorMessage'}</Code>
				{' supplies the accessible description. Supporting text uses the field’s horizontal inset and a '}
				<Code>{'4px'}</Code>
				{' top gap.'}
			</P>
			<P>
				{'Reduced-motion preferences disable border, background, and label transitions. With '}
				<Code>{'behavior="appear"'}</Code>
				{
					', the stacked label stays above the selection and the original prompt remains below, including live preference changes.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'transparent for underline; core-surface-secondary otherwise'}</DefaultVal>
			</Definition>
			<P>{'Field background. An explicit color overrides the border-style default.'}</P>
			<Definition id={'prop-behavior'}>
				<Prop>behavior</Prop>
				<TypeDef>{"'persistent' | 'appear'"}</TypeDef>
				<DefaultVal>{'persistent'}</DefaultVal>
			</Definition>
			<P>
				{'Label behavior for the stacked variant. '}
				<Code>{'appear'}</Code>
				{
					' uses the label in the empty selection position, then animates it above a selected answer. Simple and outlined labels stay persistent. Reduced-motion preferences use the persistent layout.'
				}
			</P>
			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Border color while not focused, disabled, or in an error state.'}</P>
			<Definition id={'borderColorDisabled'}>
				<Prop>borderColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Border color while disabled.'}</P>
			<Definition id={'borderColorError'}>
				<Prop>borderColorError</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>
				{'Border color when '}
				<Code>{'error'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{', unless disabled. Applies equally to box and underline styles.'}
			</P>
			<Definition id={'borderColorFocused'}>
				<Prop>borderColorFocused</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-link-primary'}</DefaultVal>
			</Definition>
			<P>{'Border color while focused, unless disabled or in an error state.'}</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Corner radius in box mode. Other border styles use zero radius.'}</P>
			<Definition id={'borderStyle'}>
				<Prop>borderStyle</Prop>
				<TypeDef>{"'box' | 'underline' | 'none'"}</TypeDef>
				<DefaultVal>{'box'}</DefaultVal>
			</Definition>
			<P>
				{
					'Choose a full box, bottom line, or no border. Box and underline modes share default padding. Borderless mode defaults to bottom padding only; explicit padding remains exact.'
				}
			</P>
			<Definition id={'borderWidth'}>
				<Prop>borderWidth</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'1'}</DefaultVal>
			</Definition>
			<P>{'Border thickness in pixels, including an explicit zero.'}</P>
			<Definition id={'children'}>
				<Prop>children</Prop>
				<TypeDef>{'React.ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native '}
				<Code>{'option'}</Code>
				{' elements as an alternative to '}
				<Code>{'options'}</Code>
				{
					'. Fragments, arrays, and conditional entries are supported; other elements, custom components, and non-whitespace text are rejected. Values are strings, with option text as the fallback when '
				}
				<Code>{'value'}</Code>
				{' is omitted. Numeric native values become strings. Use '}
				<Code>{'value'}</Code>
				{' or '}
				<Code>{'defaultValue'}</Code>
				{' on DropDown rather than '}
				<Code>{'selected'}</Code>
				{' on an option. Option content must be plain text; native attributes such as '}
				<Code>{'disabled'}</Code>
				{', '}
				<Code>{'hidden'}</Code>
				{', '}
				<Code>{'label'}</Code>
				{', and '}
				<Code>{'title'}</Code>
				{' are preserved.'}
			</P>
			<Definition id={'defaultValue'}>
				<Prop>defaultValue</Prop>
				<TypeDef>{'T | null'}</TypeDef>
				<DefaultVal>{'first option value'}</DefaultVal>
			</Definition>
			<P>
				{'Initial selection for local editing. Native form reset restores it without emitting '}
				<Code>{'onChange'}</Code>
				{'. Use '}
				<Code>{'null'}</Code>
				{' for no selected option.'}
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Disables the native select, blocking pointer and keyboard changes and excluding it from native form data.'}
			</P>
			<Definition id={'error'}>
				<Prop>error</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Marks the select invalid, applies '}
				<Code>{'borderColorError'}</Code>
				{', and replaces '}
				<Code>{'tip'}</Code>
				{' with '}
				<Code>{'errorMessage'}</Code>
				{'. Validation remains application-owned.'}
			</P>
			<Definition id={'errorMessage'}>
				<Prop>errorMessage</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Text beneath the field when '}
				<Code>{'error'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{'. Empty or whitespace-only text is hidden, without falling back to '}
				<Code>{'tip'}</Code>
				{'.'}
			</P>
			<Definition id={'gap'}>
				<Prop>gap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>{'Spacing between the inline label, selected text, and chevron, in pixels.'}</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>{'Field height including padding and borders. Numbers become pixels; CSS strings pass through.'}</P>
			<Definition id={'iconColor'}>
				<Prop>iconColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Chevron color, replaced by '}
				<Code>{'textColorDisabled'}</Code>
				{' while disabled.'}
			</P>
			<Definition id={'iconSize'}>
				<Prop>iconSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'20'}</DefaultVal>
			</Definition>
			<P>{'Chevron width and height in pixels.'}</P>
			<Definition id={'inline'}>
				<Prop>inline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Uses inline-flex layout with a '}
				<Code>{'spacing-xs'}</Code>
				{' margin on each side.'}
			</P>
			<Definition id={'inputAttributes'}>
				<Prop>inputAttributes</Prop>
				<TypeDef>{"DropDownProps<T>['inputAttributes']"}</TypeDef>
				<DefaultVal>{'{}'}</DefaultVal>
			</Definition>
			<P>
				{'Native select settings such as '}
				<Code>{'required'}</Code>
				{', '}
				<Code>{'autoComplete'}</Code>
				{', and '}
				<Code>{'form'}</Code>
				{
					', plus native focus and keyboard handlers. Autocomplete follows the browser/form default unless specified. Managed values, names, styling, callbacks, multiple selection, and raw ARIA are excluded.'
				}
			</P>
			<Definition id={'inputId'}>
				<Prop>inputId</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'generated'}</DefaultVal>
			</Definition>
			<P>{'Native select ID, associated automatically with the visible label.'}</P>
			<Definition id={'inputName'}>
				<Prop>inputName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'label, name, then Select an option'}</DefaultVal>
			</Definition>
			<P>
				{'Accessible-name override. Native form naming uses the separate '}
				<Code>{'name'}</Code>
				{' prop.'}
			</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Associated visible label positioned by '}
				<Code>{'variant'}</Code>
				{'. Inline labels have a decorative divider before the value. Empty text is hidden.'}
			</P>
			<Definition id={'labelBackgroundColor'}>
				<Prop>labelBackgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Backing color for the outlined label. The label uses '}
				<Code>{'4px'}</Code>
				{' side padding, '}
				<Code>{'2px'}</Code>
				{' top padding, and a '}
				<Code>{'1em'}</Code>
				{' line height. Ignored by other variants.'}
			</P>
			<Definition id={'labelColor'}>
				<Prop>labelColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Visible label color, replaced by '}
				<Code>{'textColorDisabled'}</Code>
				{' while disabled.'}
			</P>
			<Definition id={'labelSize'}>
				<Prop>labelSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				{'Simple label typography size. Other variants use '}
				<Code>{'stackedLabelTextSize'}</Code>
				{'.'}
			</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Native form field name. Supply a meaningful name for form data and browser guidance.'}</P>
			<Definition id={'options'}>
				<Prop>options</Prop>
				<TypeDef>{'DropDownOption<T>[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>
				{'Choices with a required '}
				<Code>{'value'}</Code>
				{' and optional '}
				<Code>{'label'}</Code>
				{', '}
				<Code>{'alt'}</Code>
				{', '}
				<Code>{'formValue'}</Code>
				{', and '}
				<Code>{'disabled'}</Code>
				{'. Labels are displayed in the menu; '}
				<Code>{'alt'}</Code>
				{
					' is application metadata and is not used for matching. Use unique values and native form values. Primitive values serialize directly; object values use '
				}
				<Code>{'valueKey'}</Code>
				{' when available, otherwise the option index. Supply '}
				<Code>{'formValue'}</Code>
				{
					' to explicitly control form serialization. Disabled options cannot be selected by the user. Use the array form for typed object values and application metadata. Supply either array options or children; mixing them is rejected.'
				}
			</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'automatic spacing tokens'}</DefaultVal>
			</Definition>
			<P>
				{'Field padding shorthand. Simple and stacked box/underline fields use '}
				<Code>{'8px'}</Code>
				{' vertically, '}
				<Code>{'16px'}</Code>
				{' left, and '}
				<Code>{'12px'}</Code>
				{' right. Outlined box/underline fields use '}
				<Code>{'8px'}</Code>
				{' plus half the label font size on top, '}
				<Code>{'16px'}</Code>
				{' sides, and '}
				<Code>{'8px'}</Code>
				{
					' bottom. Borderless mode defaults to bottom padding only. Explicit values are exact; individual side props take precedence.'
				}
			</P>
			<Definition id={'paddingBottom'}>
				<Prop>paddingBottom</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'spacing-s'}</DefaultVal>
			</Definition>
			<P>
				{'Bottom padding, '}
				<Code>{'8px'}</Code>
				{
					' by default in all border modes. Numbers become pixels; CSS values and zero are exact. Overrides that side of '
				}
				<Code>{'padding'}</Code>
				{'.'}
			</P>
			<Definition id={'paddingLeft'}>
				<Prop>paddingLeft</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'16px in box/underline modes; otherwise 0'}</DefaultVal>
			</Definition>
			<P>
				{'Left padding. Explicit values override that side of '}
				<Code>{'padding'}</Code>
				{'.'}
			</P>
			<Definition id={'paddingRight'}>
				<Prop>paddingRight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'12px in simple/stacked box/underline modes; 16px outlined; otherwise 0'}</DefaultVal>
			</Definition>
			<P>
				{
					'Right padding. Simple and stacked fields compensate for the chevron’s internal space. Explicit values override that side of '
				}
				<Code>{'padding'}</Code>
				{'.'}
			</P>
			<Definition id={'paddingTop'}>
				<Prop>paddingTop</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'8px in box/underline modes; outlined adds half the label font size; otherwise 0'}</DefaultVal>
			</Definition>
			<P>
				{'Top padding. Explicit values override that side of '}
				<Code>{'padding'}</Code>
				{'.'}
			</P>
			<Definition id={'placeholder'}>
				<Prop>placeholder</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>inferred from first option</DefaultVal>
			</Definition>
			<P>
				The first option is treated as a prompt by default only when its value is an empty string. Set <Code>true</Code>{' '}
				to mark a nonempty first option as a prompt, or <Code>false</Code> to treat every option as a real selection.
				This flag does not insert an option. Real selections use <Code>textColor</Code>; prompts use{' '}
				<Code>textColorPlaceholder</Code>.
			</P>
			<Definition id={'stackedGap'}>
				<Prop>stackedGap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'2'}</DefaultVal>
			</Definition>
			<P>
				{'Space in pixels between a stacked label and value. The space remains reserved with '}
				<Code>{'behavior="appear"'}</Code>
				{', keeping field height stable.'}
			</P>
			<Definition id={'stackedLabelTextSize'}>
				<Prop>stackedLabelTextSize</Prop>
				<TypeDef>{'keyof Type'}</TypeDef>
				<DefaultVal>{'body-xs-regular'}</DefaultVal>
			</Definition>
			<P>{'Slice typography preset for stacked and outlined labels.'}</P>
			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Selected text color. Error state does not recolor the value.'}</P>
			<Definition id={'textColorDisabled'}>
				<Prop>textColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Text, label, and chevron color while disabled.'}</P>
			<Definition id={'textColorError'}>
				<Prop>textColorError</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>{'Error message text color. Does not recolor the selected value.'}</P>
			<Definition id={'textColorPlaceholder'}>
				<Prop>textColorPlaceholder</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-tertiary'}</DefaultVal>
			</Definition>
			<P>
				{'First-option or unmatched-selection text color when '}
				<Code>{'placeholder'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{'.'}
			</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Typography size of the label and selected text.'}</P>
			<Definition id={'tip'}>
				<Prop>tip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Helpful text beneath the field when '}
				<Code>{'error'}</Code>
				{' is '}
				<Code>{'false'}</Code>
				{'. Empty or whitespace-only text is hidden.'}
			</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'T | null'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Controlled selection. Changes request a new value through '}
				<Code>{'onChange'}</Code>
				{'; update this prop to accept them. '}
				<Code>{'null'}</Code>
				{' or an unmatched value leaves no option selected instead of retaining a stale choice.'}
			</P>
			<Definition id={'valueKey'}>
				<Prop>valueKey</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Stable object field used to match equivalent values, such as '}
				<Code>{'id'}</Code>
				{'. Without it, object values match by reference. Labels and '}
				<Code>{'alt'}</Code>
				{' text are not guessed as values. Primitive key values also supply native form values unless '}
				<Code>{'formValue'}</Code>
				{' is provided.'}
			</P>
			<Definition id={'variant'}>
				<Prop>variant</Prop>
				<TypeDef>{"'simple' | 'stacked' | 'outlined'"}</TypeDef>
				<DefaultVal>{'simple'}</DefaultVal>
			</Definition>
			<P>
				{'Label placement: beside the value, above it, or on the field outline. Independent of '}
				<Code>{'borderStyle'}</Code>
				{'.'}
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>{'Field width, including padding and borders.'}</P>
			<Definition id={'spanAttributes'}>
				<Prop>...spanAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLSpanElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Other native attributes and handlers apply to the outer span. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged. Raw ARIA is managed internally.'}
			</P>
			<H2 id="events">Events</H2>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: T, option: DropDownOption<T>, index: number) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Requests the selected value and provides normalized option data plus its current index. One native selection change emits one callback. Prop changes and native form reset do not emit it.'
				}
			</P>
			<Definition id={'nativeEvents'}>
				<Method>...spanEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLSpanElement>'}</TypeDef>
			</Definition>
			<P>
				{'Other native handlers apply to the outer span. Use '}
				<Code>{'inputAttributes'}</Code>
				{
					' for native select keyboard/focus handlers. No Motion gesture or animation lifecycle events are part of the documented API.'
				}
			</P>
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DropDown component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'prop-behavior', title: 'behavior', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderColorDisabled', title: 'borderColorDisabled', code: true },
			{ id: 'borderColorError', title: 'borderColorError', code: true },
			{ id: 'borderColorFocused', title: 'borderColorFocused', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderStyle', title: 'borderStyle', code: true },
			{ id: 'borderWidth', title: 'borderWidth', code: true },
			{ id: 'children', title: 'children', code: true },
			{ id: 'defaultValue', title: 'defaultValue', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'error', title: 'error', code: true },
			{ id: 'errorMessage', title: 'errorMessage', code: true },
			{ id: 'gap', title: 'gap', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'iconColor', title: 'iconColor', code: true },
			{ id: 'iconSize', title: 'iconSize', code: true },
			{ id: 'inline', title: 'inline', code: true },
			{ id: 'inputAttributes', title: 'inputAttributes', code: true },
			{ id: 'inputId', title: 'inputId', code: true },
			{ id: 'inputName', title: 'inputName', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'labelBackgroundColor', title: 'labelBackgroundColor', code: true },
			{ id: 'labelColor', title: 'labelColor', code: true },
			{ id: 'labelSize', title: 'labelSize', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'options', title: 'options', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'paddingBottom', title: 'paddingBottom', code: true },
			{ id: 'paddingLeft', title: 'paddingLeft', code: true },
			{ id: 'paddingRight', title: 'paddingRight', code: true },
			{ id: 'paddingTop', title: 'paddingTop', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'stackedGap', title: 'stackedGap', code: true },
			{ id: 'stackedLabelTextSize', title: 'stackedLabelTextSize', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorDisabled', title: 'textColorDisabled', code: true },
			{ id: 'textColorError', title: 'textColorError', code: true },
			{ id: 'textColorPlaceholder', title: 'textColorPlaceholder', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'tip', title: 'tip', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'valueKey', title: 'valueKey', code: true },
			{ id: 'variant', title: 'variant', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'spanAttributes', title: '...spanAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'nativeEvents', title: '...spanEvents', code: true },
		],
	},
];
export default DropDownDoc;

import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import {
	TextFieldActionExample,
	TextFieldErrorExample,
	TextFieldIconUsageExample,
	TextFieldLabelsExample,
	TextFieldPasswordExample,
	TextFieldUnderlineExample,
	TextFieldUsageExample,
} from './UsagePreviews';
import {
	actionCode,
	controlledCode,
	errorCode,
	labelsCode,
	passwordCode,
	underlineCode,
	usageCode,
	usageCodeIcon,
} from './code';

export function TextFieldDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">TextField component</H1>
			<P clipWidth>
				{'Capture a short answer, search query, or password with a field that keeps useful actions close to the text.'}
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				{'Give the input a meaningful '}
				<Code>{'name'}</Code>
				{', then use '}
				<Code>{'onChange'}</Code>
				{' to receive edits.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textfield--default"
				components={[
					{
						label: 'Basic usage',
						component: <TextFieldUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'TextFieldExample.tsx',
					},
					{
						label: 'With Icon',
						component: <TextFieldIconUsageExample />,
						code: usageCodeIcon.trim(),
						codeFilename: 'TextFieldExample.tsx',
					},
				]}
			/>
			<TipBox title={'Tip:'} inline noBorder>
				Enter text to try the field and its clear action.
			</TipBox>
			<H3>Position the label</H3>
			<P>
				Use <Code>variant</Code> for <Code>simple</Code>, <Code>stacked</Code>, or <Code>outlined</Code> placement.{' '}
				<Code>behavior="appear"</Code> animates stacked labels when text is entered.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textfield--default"
				components={[
					{
						label: 'Position the label',
						component: <TextFieldLabelsExample />,
						code: labelsCode.trim(),
						codeFilename: 'TextFieldLabels.tsx',
					},
				]}
			/>
			<H3>Underline border style</H3>
			<P>
				{'Use '}
				<Code>{'borderStyle'}</Code>
				{
					' to choose a complete border or an underline. Underline borders default to zero corner radius and a transparent background; explicit radius and background colors take precedence.'
				}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textfield--default"
				components={[
					{
						label: 'Underline border style',
						component: <TextFieldUnderlineExample />,
						code: underlineCode.trim(),
						codeFilename: 'TextFieldLabels.tsx',
					},
				]}
			/>
			<H3>Password input</H3>
			<P>
				{'Use '}
				<Code>{'inputType'}</Code>
				{' for a password field. '}
				<Code>{'showPasswordToggle'}</Code>
				{' controls its visibility action.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textfield--default"
				components={[
					{
						label: 'Password input',
						component: <TextFieldPasswordExample />,
						code: passwordCode.trim(),
						codeFilename: 'TextFieldExample2.tsx',
					},
				]}
			/>
			<H3>Control the value</H3>
			<P>
				{'Keep text in application state with '}
				<Code>{'value'}</Code>
				{' and '}
				<Code>{'onChange'}</Code>
				{'. Use a client component when server rendering with frameworks such as Next.js.'}
			</P>
			<CodeBlock filename="TextFieldExample2.tsx" language="tsx" code={controlledCode.trim()} />
			<H3>Add an action</H3>
			<P>
				{'Use '}
				<Code>{'actionLabel'}</Code>
				{' to name the optional action and handle it through '}
				<Code>{'onAction'}</Code>
				{'.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textfield--default"
				components={[
					{
						label: 'Add an action',
						component: <TextFieldActionExample />,
						code: actionCode.trim(),
						codeFilename: 'TextFieldExample2.tsx',
					},
				]}
			/>
			<H3>Show validation feedback</H3>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textfield--default"
				components={[{ label: 'Invalid field', component: <TextFieldErrorExample />, code: errorCode.trim() }]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				With <Code>behavior="appear"</Code>, typing moves the label above the value; clearing returns it to the
				placeholder position. Focus alone does not move it, and the field keeps the same height.
			</P>
			<P>
				With <Code>onSubmit</Code>, Enter submits once and blurs the input. Without it, the surrounding form handles
				submission. <Code>onKeyDown</Code> can cancel submission; Enter used to confirm composed text does not submit.
			</P>
			<P>
				Native form reset restores <Code>defaultValue</Code> in uncontrolled fields. For controlled fields, reset the
				application's <Code>value</Code> state.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'The native input is associated with its visible '}
				<Code>{'label'}</Code>
				{'. Use '}
				<Code>{'inputName'}</Code>
				{' for a more specific accessible name; without a label, it falls back to '}
				<Code>{'name'}</Code>
				{' and then '}
				<Code>{'Text input'}</Code>
				{'. ARIA attributes are managed internally.'}
			</P>
			<P>
				{'Disabled state covers the input and every auxiliary action. '}
				<Code>{'readOnly'}</Code>
				{
					' keeps the input focusable for copying while blocking edits, clearing, and the action button; password visibility can still be changed.'
				}
			</P>
			<P>
				{
					'Icons are decorative. The clear control is not focusable while hidden or empty. The password action switches between '
				}
				<Code>{'Show password'}</Code>
				{' and '}
				<Code>{'Hide password'}</Code>
				{'. Error state marks the input invalid.'}
			</P>
			<P>
				{'Reduced-motion preferences use the persistent stacked layout even when '}
				<Code>{'behavior="appear"'}</Code>
				{
					' is requested: the label stays above the value and the original placeholder remains below when empty. Color transitions and action fading also stop, including live changes; keyboard focus is retained.'
				}
			</P>
			<P>
				The visible <Code>tip</Code> or <Code>errorMessage</Code> is connected to the input as its accessible
				description.
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id={'actionButton'}>
				<Prop>actionButton</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Shows an optional action button using '}
				<Code>{'actionLabel'}</Code>
				{'. Handle activation through '}
				<Code>{'onAction'}</Code>
				{'.'}
			</P>
			<Definition id={'actionLabel'}>
				<Prop>actionLabel</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Action'}</DefaultVal>
			</Definition>
			<P>
				{'Visible action text. Omitted or blank labels use '}
				<Code>{'Action'}</Code>
				{'.'}
			</P>
			<Definition id={'backgroundColorBlurred'}>
				<Prop>backgroundColorBlurred</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>style-dependent</DefaultVal>
			</Definition>
			<P>
				Background when not focused. Underline borders default to <Code>transparent</Code>; other styles use{' '}
				<Code>core-surface-secondary</Code>. An explicit color overrides the default. <Code>inline</Code> removes it.
			</P>
			<Definition id={'backgroundColorFocused'}>
				<Prop>backgroundColorFocused</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>style-dependent</DefaultVal>
			</Definition>
			<P>
				Background when focused. Underline borders default to <Code>transparent</Code>; other styles use{' '}
				<Code>core-surface-secondary</Code>. An explicit color overrides the default. <Code>inline</Code> removes it.
			</P>
			<Definition id={'prop-behavior'}>
				<Prop>behavior</Prop>
				<TypeDef>{"'persistent' | 'appear'"}</TypeDef>
				<DefaultVal>{'persistent'}</DefaultVal>
			</Definition>
			<P>
				{'Applies only to '}
				<Code>{'stacked'}</Code>
				{'. '}
				<Code>{'persistent'}</Code>
				{' keeps the label above the input, with the placeholder below when empty. '}
				<Code>{'appear'}</Code>
				{
					' uses the label as the empty-field placeholder, then moves it into position when a value exists. Reduced motion uses the persistent layout.'
				}
			</P>
			<Definition id={'borderColorBlurred'}>
				<Prop>borderColorBlurred</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>{'Border color when the input is not focused.'}</P>
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
				{'; takes priority over focus.'}
			</P>
			<Definition id={'borderColorFocused'}>
				<Prop>borderColorFocused</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-link-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Border color while focused, unless '}
				<Code>{'error'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{'.'}
			</P>
			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>style-dependent</DefaultVal>
			</Definition>
			<P>
				{
					'Corner radius. Defaults to 0 for underline borders, otherwise 8px. Explicit values take precedence. Numbers are pixels; strings accept CSS radii.'
				}
			</P>
			<Definition id={'borderStyle'}>
				<Prop>borderStyle</Prop>
				<TypeDef>{"'box' | 'underline' | 'none'"}</TypeDef>
				<DefaultVal>{'box'}</DefaultVal>
			</Definition>
			<P>{'Chooses a full outline, underline, or no border.'}</P>
			<Definition id={'clearBlurs'}>
				<Prop>clearBlurs</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				<Code>{'true'}</Code>
				{' blurs the input after requesting a clear. '}
				<Code>{'false'}</Code>
				{' keeps or restores input focus.'}
			</P>
			<Definition id={'clearButton'}>
				<Prop>clearButton</Prop>
				<TypeDef>{'{ size?: number } | null'}</TypeDef>
				<DefaultVal>{'{ size: 20 }'}</DefaultVal>
			</Definition>
			<P>
				{'Size of the clear icon and its reserved slot in pixels. Use '}
				<Code>{'null'}</Code>
				{' to remove the control. It is visible only when the field contains text and focus is within the field.'}
			</P>
			<Definition id={'defaultValue'}>
				<Prop>defaultValue</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'empty string'}</DefaultVal>
			</Definition>
			<P>
				{'Initial text for an uncontrolled field. Native form reset restores this initial value without emitting '}
				<Code>{'onChange'}</Code>
				{'.'}
			</P>
			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Disables the input, clear control, action button, and password-visibility control.'}</P>
			<Definition id={'error'}>
				<Prop>error</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Applies error border styling. Validation remains application-owned.'}</P>
			<Definition id={'errorMessage'}>
				<Prop>errorMessage</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Text shown beneath the field when <Code>error</Code> is <Code>true</Code>. Empty or whitespace-only text is
				hidden; <Code>tip</Code> stays hidden in an error state.
			</P>
			<Definition id={'focused'}>
				<Prop>focused</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Optional focus request. Changes to '}
				<Code>{'true'}</Code>
				{' focus the enabled input; changes to '}
				<Code>{'false'}</Code>
				{' blur it. Omit it for ordinary user-driven focus.'}
			</P>
			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>{'Wrapper height in pixels or CSS units.'}</P>
			<Definition id={'iconLeft'}>
				<Prop>iconLeft</Prop>
				<TypeDef>{'{ name?: string; size?: number; color?: ColorValue }'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Optional leading icon configuration. '}
				<Code>{'size'}</Code>
				{' is pixels; '}
				<Code>{'color'}</Code>
				{' accepts tokens or CSS colors.'}
			</P>
			<Definition id={'inline'}>
				<Prop>inline</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Removes the field background; border configuration remains active.'}</P>
			<Definition id={'inputAttributes'}>
				<Prop>inputAttributes</Prop>
				<TypeDef>{"TextFieldProps['inputAttributes']"}</TypeDef>
				<DefaultVal>{'{}'}</DefaultVal>
			</Definition>
			<P>
				{'Native input settings such as '}
				<Code>{'autoComplete'}</Code>
				{', '}
				<Code>{'inputMode'}</Code>
				{', '}
				<Code>{'required'}</Code>
				{', '}
				<Code>{'minLength'}</Code>
				{', '}
				<Code>{'pattern'}</Code>
				{', and '}
				<Code>{'form'}</Code>
				{
					'. Managed values, events, identifiers, styling, and raw ARIA attributes are excluded; use the named component props instead.'
				}
			</P>
			<P>
				Autocomplete follows the browser or form default. Set <Code>{"inputAttributes={{ autoComplete: 'off' }}"}</Code>{' '}
				to request no suggestions, or use a token such as <Code>given-name</Code> to guide autofill.
			</P>
			<Definition id={'inputId'}>
				<Prop>inputId</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'generated'}</DefaultVal>
			</Definition>
			<P>{'ID of the native input. The visible label targets this ID automatically.'}</P>
			<Definition id={'inputName'}>
				<Prop>inputName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'label, name, or Text input'}</DefaultVal>
			</Definition>
			<P>
				{'Optional accessible-name override. Without it, the associated '}
				<Code>{'label'}</Code>
				{' names the input; an unlabeled input uses '}
				<Code>{'name'}</Code>
				{' or '}
				<Code>{'Text input'}</Code>
				{'.'}
			</P>
			<Definition id={'inputType'}>
				<Prop>inputType</Prop>
				<TypeDef>{"'text' | 'password'"}</TypeDef>
				<DefaultVal>{'text'}</DefaultVal>
			</Definition>
			<P>
				{'Native input type. Password inputs include a visibility control unless '}
				<Code>{'showPasswordToggle'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{'.'}
			</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Visible label, associated with the native input. Inline labels have a decorative divider before the value. Whitespace-only labels are omitted.'
				}
			</P>
			<Definition id={'labelBackgroundColor'}>
				<Prop>labelBackgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Backing color for the '}
				<Code>{'outlined'}</Code>
				{
					' label, with 4px side padding, 2px top padding, and a 1em line height. Other variants keep the label background transparent and ignore this prop.'
				}
			</P>
			<Definition id={'labelColor'}>
				<Prop>labelColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>
				{'Visible label color. '}
				<Code>{'textColorDisabled'}</Code>
				{' takes precedence when disabled.'}
			</P>
			<Definition id={'labelSize'}>
				<Prop>labelSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>
				{'Typography size of the simple variant’s label. Stacked and outlined labels use '}
				<Code>{'stackedLabelTextSize'}</Code>
				{'.'}
			</P>
			<Definition id={'maxLength'}>
				<Prop>maxLength</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Maximum length accepted by the native input.'}</P>
			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native form field name. Also supplies the accessible-name fallback when neither '}
				<Code>{'label'}</Code>
				{' nor '}
				<Code>{'inputName'}</Code>
				{' is provided.'}
			</P>
			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'automatic spacing tokens'}</DefaultVal>
			</Definition>
			<P>
				Outlined fields default to <Code>8px</Code> plus half the label font size on both top and bottom, keeping the
				value centered, with <Code>16px</Code> side padding. Other variants use <Code>spacing-s</Code> vertically and{' '}
				<Code>spacing-m</Code> horizontally, with a <Code>spacing-xs</Code> reduction at icon edges. Explicit{' '}
				<Code>padding</Code>, including zero, is applied exactly.
			</P>
			<Definition id={'placeholder'}>
				<Prop>placeholder</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'placeholder'}</DefaultVal>
			</Definition>
			<P>{'Hint shown while the field is empty.'}</P>
			<Definition id={'readOnly'}>
				<Prop>readOnly</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Prevents editing while retaining focus and text selection.'}</P>
			<Definition id={'showPasswordToggle'}>
				<Prop>showPasswordToggle</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Shows the password visibility action when '}
				<Code>{'inputType'}</Code>
				{' is '}
				<Code>{'password'}</Code>
				{'. The control is disabled while the field is empty.'}
			</P>
			<Definition id={'stackedGap'}>
				<Prop>stackedGap</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'2'}</DefaultVal>
			</Definition>
			<P>
				{'Gap between a stacked label and the value or placeholder, in pixels. Negative values are clamped to zero.'}
			</P>
			<Definition id={'stackedLabelTextSize'}>
				<Prop>stackedLabelTextSize</Prop>
				<TypeDef>{'keyof Type'}</TypeDef>
				<DefaultVal>{'body-xs-regular'}</DefaultVal>
			</Definition>
			<P>
				{'Slice typography preset for '}
				<Code>{'stacked'}</Code>
				{' and '}
				<Code>{'outlined'}</Code>
				{' labels, such as '}
				<Code>{'body-xs-regular'}</Code>
				{' or '}
				<Code>{'body-s-medium'}</Code>
				{'. Simple labels use '}
				<Code>{'labelSize'}</Code>
				{'.'}
			</P>
			<Definition id={'textAlign'}>
				<Prop>textAlign</Prop>
				<TypeDef>{"'left' | 'center'"}</TypeDef>
				<DefaultVal>{'left'}</DefaultVal>
			</Definition>
			<P>{'Horizontal alignment inside the input.'}</P>
			<Definition id={'textColorBlurred'}>
				<Prop>textColorBlurred</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Input text color when not focused or disabled, including error states.'}</P>
			<Definition id={'textColorDisabled'}>
				<Prop>textColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Text color of the input and visible label while disabled.'}</P>
			<Definition id={'textColorError'}>
				<Prop>textColorError</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>Error message text color; the input value keeps its normal color.</P>
			<Definition id={'textColorFocused'}>
				<Prop>textColorFocused</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Input text color while focused, unless disabled. Error state does not change the value color.'}</P>
			<Definition id={'textColorPlaceholder'}>
				<Prop>textColorPlaceholder</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Placeholder text color.'}</P>
			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Typography size of the native input text.'}</P>

			<Definition id={'tip'}>
				<Prop>tip</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Helpful text beneath the field when <Code>error</Code> is <Code>false</Code>. Empty or whitespace-only text is
				hidden.
			</P>
			<Definition id={'value'}>
				<Prop>value</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Controlled text. The field reports edits through '}
				<Code>{'onChange'}</Code>
				{' and waits for the parent to update this value.'}
			</P>
			<Definition id={'variant'}>
				<Prop>variant</Prop>
				<TypeDef>{"'simple' | 'stacked' | 'outlined'"}</TypeDef>
				<DefaultVal>{'simple'}</DefaultVal>
			</Definition>
			<P>
				{'Label layout. '}
				<Code>{'simple'}</Code>
				{' places it beside the value; '}
				<Code>{'stacked'}</Code>
				{' places it above; '}
				<Code>{'outlined'}</Code>
				{
					' places it on the top border. Stacked and outlined labels align with the value, including when a leading icon is present.'
				}
			</P>
			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>
				{'Wrapper width in pixels or CSS units. '}
				<Code>{'auto'}</Code>
				{' uses content sizing where the browser supports it.'}
			</P>
			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Native attributes and handlers apply to the outer wrapper, not the inner control. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged; component CSS variables take priority.'}
			</P>
			<H2 id="motion">Motion</H2>
			<P>
				The action fade uses Slice’s <Code openURL="/docs/react/motion/">Water</Code> transition.
			</P>
			<Definition id={'transition'}>
				<Prop>transition</Prop>
				<TypeDef>{'Transition'}</TypeDef>
				<DefaultVal>{'Slice’s Water transition'}</DefaultVal>
			</Definition>
			<P>
				{
					'Timing for the optional action button’s show/hide fade. Settings are merged with Slice’s Water transition; reduced-motion preferences take priority.'
				}
			</P>
			<H2 id="events">Events</H2>
			<Definition id={'onAction'}>
				<Method>onAction</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs when the nonempty, editable field’s action button is activated. Keep text in application state through '}
				<Code>{'onChange'}</Code>
				{' when the action needs it.'}
			</P>
			<Definition id={'onBlur'}>
				<Method>onBlur</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>{'Reports the input’s current value once when it loses focus, including the blur after Enter submission.'}</P>
			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{'Reports edits and clear requests. Controlled fields keep displaying their current '}
				<Code>{'value'}</Code>
				{' until it is updated. Initialization, prop updates, and form reset do not emit this callback.'}
			</P>
			<Definition id={'onClear'}>
				<Method>onClear</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs once after a valid clear request and the empty-string '}
				<Code>{'onChange'}</Code>
				{' callback.'}
			</P>
			<Definition id={'onFocus'}>
				<Method>onFocus</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>{'Reports the current value on native input focus.'}</P>
			<Definition id={'onKeyDown'}>
				<Method>onKeyDown</Method>
				<TypeDef>{'(event: React.KeyboardEvent<HTMLInputElement>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs before built-in keyboard handling. Call '}
				<Code>{'preventDefault'}</Code>
				{' to cancel Enter submission and blur.'}
			</P>
			<Definition id={'onPaste'}>
				<Method>onPaste</Method>
				<TypeDef>{'(event: React.ClipboardEvent<HTMLInputElement>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Receives paste events while editing is allowed. Call '}
				<Code>{'preventDefault'}</Code>
				{' to replace native paste behavior.'}
			</P>
			<Definition id={'onSubmit'}>
				<Method>onSubmit</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Runs on Enter, outside IME composition. When supplied, it prevents implicit form submission, then the input blurs. Without it, native form behavior remains available.'
				}
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				Other native handlers apply to the outer wrapper. No Motion gesture or animation lifecycle callbacks are part of
				the documented component API.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'TextField component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'actionButton', title: 'actionButton', code: true },
			{ id: 'actionLabel', title: 'actionLabel', code: true },
			{ id: 'backgroundColorBlurred', title: 'backgroundColorBlurred', code: true },
			{ id: 'backgroundColorFocused', title: 'backgroundColorFocused', code: true },
			{ id: 'prop-behavior', title: 'behavior', code: true },
			{ id: 'borderColorBlurred', title: 'borderColorBlurred', code: true },
			{ id: 'borderColorError', title: 'borderColorError', code: true },
			{ id: 'borderColorFocused', title: 'borderColorFocused', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderStyle', title: 'borderStyle', code: true },
			{ id: 'clearBlurs', title: 'clearBlurs', code: true },
			{ id: 'clearButton', title: 'clearButton', code: true },
			{ id: 'defaultValue', title: 'defaultValue', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'error', title: 'error', code: true },
			{ id: 'errorMessage', title: 'errorMessage', code: true },
			{ id: 'focused', title: 'focused', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'iconLeft', title: 'iconLeft', code: true },
			{ id: 'inline', title: 'inline', code: true },
			{ id: 'inputAttributes', title: 'inputAttributes', code: true },
			{ id: 'inputId', title: 'inputId', code: true },
			{ id: 'inputName', title: 'inputName', code: true },
			{ id: 'inputType', title: 'inputType', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'labelBackgroundColor', title: 'labelBackgroundColor', code: true },
			{ id: 'labelColor', title: 'labelColor', code: true },
			{ id: 'labelSize', title: 'labelSize', code: true },
			{ id: 'maxLength', title: 'maxLength', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'readOnly', title: 'readOnly', code: true },
			{ id: 'showPasswordToggle', title: 'showPasswordToggle', code: true },
			{ id: 'stackedGap', title: 'stackedGap', code: true },
			{ id: 'stackedLabelTextSize', title: 'stackedLabelTextSize', code: true },
			{ id: 'textAlign', title: 'textAlign', code: true },
			{ id: 'textColorBlurred', title: 'textColorBlurred', code: true },
			{ id: 'textColorDisabled', title: 'textColorDisabled', code: true },
			{ id: 'textColorError', title: 'textColorError', code: true },
			{ id: 'textColorFocused', title: 'textColorFocused', code: true },
			{ id: 'textColorPlaceholder', title: 'textColorPlaceholder', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'tip', title: 'tip', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'variant', title: 'variant', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{ id: 'motion', title: 'Motion', items: [{ id: 'transition', title: 'transition', code: true }] },
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onAction', title: 'onAction', code: true },
			{ id: 'onBlur', title: 'onBlur', code: true },
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onClear', title: 'onClear', code: true },
			{ id: 'onFocus', title: 'onFocus', code: true },
			{ id: 'onKeyDown', title: 'onKeyDown', code: true },
			{ id: 'onPaste', title: 'onPaste', code: true },
			{ id: 'onSubmit', title: 'onSubmit', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default TextFieldDoc;

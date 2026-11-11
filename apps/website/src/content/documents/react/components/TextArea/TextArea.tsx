import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import {
	TextAreaGuidanceExample,
	TextAreaSizingExample,
	TextAreaSubmitExample,
	TextAreaUsageExample,
} from './UsagePreviews';
import { controlledCode, guidanceCode, sizingCode, submitCode, usageCode } from './code';
export function TextAreaDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">TextArea component</H1>
			<P clipWidth>{'Make room for notes, comments, and longer messages, with content that can grow as you write.'}</P>
			<H2 id="usage">Usage</H2>
			<P>
				For short, single-line answers, use <Code openURL="/docs/react/textfield/">TextField</Code>.
			</P>
			<P>
				{'Give the field a '}
				<Code>{'label'}</Code>
				{' and a meaningful '}
				<Code>{'name'}</Code>
				{', then receive edits through '}
				<Code>{'onChange'}</Code>
				{'.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textarea--default"
				components={[
					{
						label: 'Basic usage',
						component: <TextAreaUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'TextAreaExample1.tsx',
					},
				]}
			/>
			<H3>Control the value</H3>
			<P>
				{'Use '}
				<Code>{'value'}</Code>
				{' with '}
				<Code>{'onChange'}</Code>
				{' for application state, or '}
				<Code>{'defaultValue'}</Code>
				{' for local editing. Use a client component when server rendering with frameworks such as Next.js.'}
			</P>
			<CodeBlock filename="TextAreaExample2.tsx" language="tsx" code={controlledCode.trim()} />
			<H3>Choose a height</H3>
			<P>
				{'Limit growing content with '}
				<Code>{'maxHeight'}</Code>
				{', set a fixed '}
				<Code>{'height'}</Code>
				{', or turn off '}
				<Code>{'autoGrow'}</Code>
				{' to allow native resizing.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textarea--default"
				components={[
					{
						label: 'Choose a height',
						component: <TextAreaSizingExample />,
						code: sizingCode.trim(),
						codeFilename: 'TextAreaExample3.tsx',
					},
				]}
			/>
			<H3>Send a message</H3>
			<P>
				{'Use '}
				<Code>{'showSendButton'}</Code>
				{' for a send action and '}
				<Code>{'returnSubmits'}</Code>
				{' for Enter submission.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textarea--default"
				components={[
					{
						label: 'Send a message',
						component: <TextAreaSubmitExample />,
						code: submitCode.trim(),
						codeFilename: 'TextAreaExample4.tsx',
					},
				]}
			/>
			<H3>Add field guidance</H3>
			<P>
				{'Provide a '}
				<Code>{'tip'}</Code>
				{' for normal editing and an '}
				<Code>{'errorMessage'}</Code>
				{' for validation feedback.'}
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-textarea--default"
				components={[
					{
						label: 'Add field guidance',
						component: <TextAreaGuidanceExample />,
						code: guidanceCode.trim(),
						codeFilename: 'TextAreaExample5.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				{'With '}
				<Code>{'returnSubmits'}</Code>
				{', Shift+Enter inserts a newline. Enter used to confirm composed text does not submit, and '}
				<Code>{'onKeyDown'}</Code>
				{' can cancel submission.'}
			</P>
			<P>{'Sending keeps focus in the textarea. Empty or whitespace-only messages cannot be sent.'}</P>
			<P>
				{'Native form reset restores '}
				<Code>{'defaultValue'}</Code>
				{' in local fields. For controlled fields, reset the application’s '}
				<Code>{'value'}</Code>
				{' state.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'The visible '}
				<Code>{'label'}</Code>
				{' is associated with the native textarea. Use '}
				<Code>{'inputName'}</Code>
				{' for a more specific accessible name; without a label, it falls back to '}
				<Code>{'name'}</Code>
				{', then '}
				<Code>{'Text input'}</Code>
				{'.'}
			</P>
			<P>
				{'The visible '}
				<Code>{'tip'}</Code>
				{' or '}
				<Code>{'errorMessage'}</Code>
				{
					' supplies the accessible description. Error state marks the textarea invalid. The value keeps its normal color.'
				}
			</P>
			<P>
				{'The send action is a native button named by '}
				<Code>{'sendActionName'}</Code>
				{'. Disabled fields prevent editing and sending; '}
				<Code>{'readOnly'}</Code>
				{' retains focus and text selection while preventing changes.'}
			</P>
			<P>
				{
					'Reduced-motion preferences disable color and focus transitions. Auto-grow follows content directly without a height animation.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>All component props are optional. Color props accept Slice theme tokens or CSS colors.</P>
			<Definition id="allowEmptySubmit">
				<Prop>allowEmptySubmit</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>false</DefaultVal>
			</Definition>
			<P>
				Allows submission of empty text when a composed control has associated content, such as file attachments.
				Editing and onSubmit requirements still apply.
			</P>
			<Definition id={'autoGrow'}>
				<Prop>autoGrow</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Grows and shrinks with content when '}
				<Code>{'height'}</Code>
				{' is '}
				<Code>{'auto'}</Code>
				{'. '}
				<Code>{'rows'}</Code>
				{' sets the starting height; '}
				<Code>{'maxHeight'}</Code>
				{' caps growth. Native resizing is disabled while growing.'}
			</P>

			<Definition id={'backgroundColor'}>
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Field background.'}</P>

			<Definition id={'borderColor'}>
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-primary'}</DefaultVal>
			</Definition>
			<P>{'Outline color while not focused or in an error state.'}</P>

			<Definition id={'borderColorError'}>
				<Prop>borderColorError</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>
				{'Outline color when '}
				<Code>{'error'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{', including while focused.'}
			</P>

			<Definition id={'borderColorFocused'}>
				<Prop>borderColorFocused</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-fill-secondary'}</DefaultVal>
			</Definition>
			<P>
				{'Outline color while focused, unless '}
				<Code>{'error'}</Code>
				{' is '}
				<Code>{'true'}</Code>
				{'.'}
			</P>

			<Definition id={'borderRadius'}>
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'12'}</DefaultVal>
			</Definition>
			<P>{'Field corner radius. Numbers are pixels; CSS values pass through.'}</P>

			<Definition id={'borderStyle'}>
				<Prop>borderStyle</Prop>
				<TypeDef>{"'box' | 'underline' | 'none'"}</TypeDef>
				<DefaultVal>{'box'}</DefaultVal>
			</Definition>
			<P>{'Choose a full outline, bottom line, or no outline.'}</P>

			<Definition id={'defaultValue'}>
				<Prop>defaultValue</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'empty string'}</DefaultVal>
			</Definition>
			<P>
				{'Initial text for local editing. Native form reset restores this initial value without emitting '}
				<Code>{'onChange'}</Code>
				{'.'}
			</P>

			<Definition id={'disabled'}>
				<Prop>disabled</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Disables the textarea and send button.'}</P>

			<Definition id={'error'}>
				<Prop>error</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Applies the error outline and displays '}
				<Code>{'errorMessage'}</Code>
				{' instead of '}
				<Code>{'tip'}</Code>
				{'. The value keeps its normal text color. Validation remains application-owned.'}
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

			<Definition id={'focused'}>
				<Prop>focused</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Optional focus request. Changes to '}
				<Code>{'true'}</Code>
				{' focus the enabled textarea; changes to '}
				<Code>{'false'}</Code>
				{' blur it. Omit for ordinary user-driven focus.'}
			</P>

			<Definition id={'height'}>
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>
				{'Field height, including padding and send space. An explicit height takes precedence over '}
				<Code>{'autoGrow'}</Code>
				{' and disables native resizing. Overflow scrolls inside the textarea.'}
			</P>

			<Definition id={'inputAttributes'}>
				<Prop>inputAttributes</Prop>
				<TypeDef>{"TextAreaProps['inputAttributes']"}</TypeDef>
				<DefaultVal>{'{}'}</DefaultVal>
			</Definition>
			<P>
				{'Native settings such as '}
				<Code>{'autoComplete'}</Code>
				{', '}
				<Code>{'spellCheck'}</Code>
				{', '}
				<Code>{'required'}</Code>
				{', '}
				<Code>{'minLength'}</Code>
				{', '}
				<Code>{'wrap'}</Code>
				{', and '}
				<Code>{'form'}</Code>
				{'. Autocomplete follows the browser or form default; use '}
				<Code>{"autoComplete: 'off'"}</Code>
				{' to request no suggestions. Managed values, identifiers, styling, callbacks, and raw ARIA are excluded.'}
			</P>

			<Definition id={'inputId'}>
				<Prop>inputId</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'generated'}</DefaultVal>
			</Definition>
			<P>{'Native textarea ID. The visible label targets it automatically.'}</P>

			<Definition id={'inputName'}>
				<Prop>inputName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'label, name, then Text input'}</DefaultVal>
			</Definition>
			<P>
				{'Accessible-name override. Native form naming uses the separate '}
				<Code>{'name'}</Code>
				{' prop.'}
			</P>

			<Definition id="inputRef">
				<Prop>inputRef</Prop>
				<TypeDef>React.Ref&lt;HTMLTextAreaElement&gt;</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Native editor ref for imperative focus and composition with related controls. Internal measurement continues to
				use the same element.
			</P>
			<Definition id={'label'}>
				<Prop>label</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Visible label above the field, associated with the textarea. Its horizontal inset matches the value and supporting text. Empty text is hidden.'
				}
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
			<P>{'Typography size of the visible label.'}</P>

			<Definition id={'maxHeight'}>
				<Prop>maxHeight</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'none'}</DefaultVal>
			</Definition>
			<P>
				{'Maximum field height, including padding and send space. Content scrolls when the field reaches this limit.'}
			</P>

			<Definition id={'maxLength'}>
				<Prop>maxLength</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Maximum length accepted by the native textarea.'}</P>

			<Definition id={'minWidth'}>
				<Prop>minWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Minimum component width. Numbers are pixels; CSS strings remain intact.'}</P>

			<Definition id={'name'}>
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>{'Native form field name. Provide a meaningful name for form data and browser guidance.'}</P>

			<Definition id={'padding'}>
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-m) var(--spacing-s) var(--spacing-m) var(--spacing-m)'}</DefaultVal>
			</Definition>
			<P>
				{'Field padding, '}
				<Code>{'16px'}</Code>
				{' on the top, bottom, and left; '}
				<Code>{'8px'}</Code>
				{
					' on the right for scrollbar clearance. Explicit numbers and CSS shorthands, including zero, are exact. Supporting text uses the same horizontal inset and '
				}
				<Code>{'4px'}</Code>
				{' top padding.'}
			</P>

			<Definition id={'placeholder'}>
				<Prop>placeholder</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Enter text here...'}</DefaultVal>
			</Definition>
			<P>
				{'Hint while empty. Supply a label or '}
				<Code>{'inputName'}</Code>
				{' to describe the field.'}
			</P>

			<Definition id={'readOnly'}>
				<Prop>readOnly</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>{'Keeps the value focusable and selectable while blocking edits and submission.'}</P>

			<Definition id={'resizable'}>
				<Prop>resizable</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Allows native vertical resizing when '}
				<Code>{'autoGrow'}</Code>
				{' is '}
				<Code>{'false'}</Code>
				{' and '}
				<Code>{'height'}</Code>
				{' is '}
				<Code>{'auto'}</Code>
				{'. Otherwise the resize handle is hidden.'}
			</P>

			<Definition id={'returnSubmits'}>
				<Prop>returnSubmits</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Plain Enter calls '}
				<Code>{'onSubmit'}</Code>
				{' instead of inserting a newline. Shift+Enter remains a newline. Without '}
				<Code>{'onSubmit'}</Code>
				{', Enter retains normal textarea behavior.'}
			</P>

			<Definition id={'rows'}>
				<Prop>rows</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>
				{
					'Starting line count, also the minimum content height during auto-grow. Values are rounded down and clamped to at least one.'
				}
			</P>

			<Definition id={'sendActionName'}>
				<Prop>sendActionName</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Send'}</DefaultVal>
			</Definition>
			<P>
				{'Accessible action name for the send button. Empty text falls back to '}
				<Code>{'Send'}</Code>
				{'.'}
			</P>

			<Definition id={'sendOffset'}>
				<Prop>sendOffset</Prop>
				<TypeDef>{'{ bottom: number; right: number }'}</TypeDef>
				<DefaultVal>{'{ bottom: 10, right: 10 }'}</DefaultVal>
			</Definition>
			<P>
				{
					'Send-button offsets from the field edges, in pixels. Space beneath the text keeps the button clear of the value.'
				}
			</P>

			<Definition id={'sendSize'}>
				<Prop>sendSize</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'36'}</DefaultVal>
			</Definition>
			<P>{'Send-button width and height in pixels.'}</P>

			<Definition id={'showSendButton'}>
				<Prop>showSendButton</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{
					'Shows a native send button. It is disabled for empty or whitespace-only text, disabled/read-only fields, or when no '
				}
				<Code>{'onSubmit'}</Code>
				{' is provided.'}
			</P>

			<Definition id={'submitClears'}>
				<Prop>submitClears</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				{'Requests an empty value after submission through '}
				<Code>{'onChange'}</Code>
				{'. Local fields clear immediately; controlled fields wait for the parent to update '}
				<Code>{'value'}</Code>
				{'.'}
			</P>

			<Definition id={'textColor'}>
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-primary'}</DefaultVal>
			</Definition>
			<P>{'Value color, including during errors.'}</P>

			<Definition id={'textColorDisabled'}>
				<Prop>textColorDisabled</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Value and label color while disabled.'}</P>

			<Definition id={'textColorError'}>
				<Prop>textColorError</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'feedback-warning'}</DefaultVal>
			</Definition>
			<P>{'Error message color. Does not recolor the value.'}</P>

			<Definition id={'textColorPlaceholder'}>
				<Prop>textColorPlaceholder</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-disabled'}</DefaultVal>
			</Definition>
			<P>{'Placeholder color.'}</P>

			<Definition id={'textSize'}>
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'m'}</DefaultVal>
			</Definition>
			<P>{'Textarea typography size. Auto-grow remeasures when it changes.'}</P>

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
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Controlled text. Edits and submission clearing are requests through '}
				<Code>{'onChange'}</Code>
				{'; update this prop to display the new text.'}
			</P>

			<Definition id={'width'}>
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>{'Component width, including label and supporting text. Numbers are pixels; CSS strings pass through.'}</P>

			<Definition id={'divAttributes'}>
				<Prop>...divAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLDivElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'Other native attributes and handlers apply to the field wrapper. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged. Raw ARIA and managed callbacks are excluded; use the named props instead.'}
			</P>

			<H2 id="events">Events</H2>
			<Definition id={'onBlur'}>
				<Method>onBlur</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Reports the current textarea value when the textarea loses focus. Focus changes on the send button do not masquerade as textarea events.'
				}
			</P>

			<Definition id={'onChange'}>
				<Method>onChange</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{'Reports edits and an empty string when '}
				<Code>{'submitClears'}</Code>
				{' requests clearing. Prop changes and native form reset do not emit it.'}
			</P>

			<Definition id={'onFocus'}>
				<Method>onFocus</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>{'Reports the current value when the textarea receives focus.'}</P>

			<Definition id={'onKeyDown'}>
				<Method>onKeyDown</Method>
				<TypeDef>{'(event: React.KeyboardEvent<HTMLTextAreaElement>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Runs before built-in Enter submission. Call '}
				<Code>{'preventDefault()'}</Code>
				{' to cancel it.'}
			</P>

			<Definition id={'onPaste'}>
				<Method>onPaste</Method>
				<TypeDef>{'(event: React.ClipboardEvent<HTMLTextAreaElement>) => void'}</TypeDef>
			</Definition>
			<P>
				{'Native paste event while editable. Call '}
				<Code>{'preventDefault()'}</Code>
				{' to replace or block pasted text.'}
			</P>

			<Definition id={'onSubmit'}>
				<Method>onSubmit</Method>
				<TypeDef>{'(value: string) => void'}</TypeDef>
			</Definition>
			<P>
				{'Reports nonempty text from the send button or plain Enter with '}
				<Code>{'returnSubmits'}</Code>
				{'. After sending, focus stays in or returns to the textarea.'}
			</P>

			<Definition id={'nativeEvents'}>
				<Method>...divEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLDivElement>'}</TypeDef>
			</Definition>
			<P>
				{
					'Other native handlers apply to the field wrapper. No Motion gesture or animation lifecycle callbacks are part of the documented API.'
				}
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'TextArea component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'allowEmptySubmit', title: 'allowEmptySubmit', code: true },
			{ id: 'autoGrow', title: 'autoGrow', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderColorError', title: 'borderColorError', code: true },
			{ id: 'borderColorFocused', title: 'borderColorFocused', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderStyle', title: 'borderStyle', code: true },
			{ id: 'defaultValue', title: 'defaultValue', code: true },
			{ id: 'disabled', title: 'disabled', code: true },
			{ id: 'error', title: 'error', code: true },
			{ id: 'errorMessage', title: 'errorMessage', code: true },
			{ id: 'focused', title: 'focused', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'inputAttributes', title: 'inputAttributes', code: true },
			{ id: 'inputId', title: 'inputId', code: true },
			{ id: 'inputName', title: 'inputName', code: true },
			{ id: 'inputRef', title: 'inputRef', code: true },
			{ id: 'label', title: 'label', code: true },
			{ id: 'labelColor', title: 'labelColor', code: true },
			{ id: 'labelSize', title: 'labelSize', code: true },
			{ id: 'maxHeight', title: 'maxHeight', code: true },
			{ id: 'maxLength', title: 'maxLength', code: true },
			{ id: 'minWidth', title: 'minWidth', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'readOnly', title: 'readOnly', code: true },
			{ id: 'resizable', title: 'resizable', code: true },
			{ id: 'returnSubmits', title: 'returnSubmits', code: true },
			{ id: 'rows', title: 'rows', code: true },
			{ id: 'sendActionName', title: 'sendActionName', code: true },
			{ id: 'sendOffset', title: 'sendOffset', code: true },
			{ id: 'sendSize', title: 'sendSize', code: true },
			{ id: 'showSendButton', title: 'showSendButton', code: true },
			{ id: 'submitClears', title: 'submitClears', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorDisabled', title: 'textColorDisabled', code: true },
			{ id: 'textColorError', title: 'textColorError', code: true },
			{ id: 'textColorPlaceholder', title: 'textColorPlaceholder', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'tip', title: 'tip', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'divAttributes', title: '...divAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onBlur', title: 'onBlur', code: true },
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onFocus', title: 'onFocus', code: true },
			{ id: 'onKeyDown', title: 'onKeyDown', code: true },
			{ id: 'onPaste', title: 'onPaste', code: true },
			{ id: 'onSubmit', title: 'onSubmit', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default TextAreaDoc;

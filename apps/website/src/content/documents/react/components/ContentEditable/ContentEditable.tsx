import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { ContentEditableClampExample, ContentEditableUsageExample } from './UsagePreviews';
import { activationCode, clampCode, persistenceCode, usageCode } from './code';

export function ContentEditableDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">ContentEditable component</H1>
			<P clipWidth>Edit titles and labels in place, keeping quick changes close to the content.</P>
			<H2 id="usage">Usage</H2>
			<P>
				{
					'Content wrapped in the component inherits the surrounding typography but can also apply its own styling. Your apps controls '
				}
				<Code>{'isEditable'}</Code>
				{'making its content editable. Exiting saves changed text through '}
				<Code>{'onCommit'}</Code>.
			</P>
			<TipBox inline noBorder>
				Click the title to directly focus and edit content, then click away or press Enter to save; Escape cancels.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-contenteditable--default"
				components={[
					{
						label: 'Basic usage',
						component: <ContentEditableUsageExample />,
						code: usageCode.trim(),
						codeFilename: 'ProjectTitle.tsx',
					},
				]}
			/>
			<H3>Clamp overflowing text to one line</H3>
			<P>
				Set <Code>{'clamp={1}'}</Code> and constrain <Code>width</Code> to show long text on one line with an ellipsis.
				Editing reveals the full text; finishing restores the clamp.
			</P>
			<TipBox inline noBorder>
				Click the title to edit the full text. Press Enter to save or Escape to cancel.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-contenteditable--default"
				components={[
					{
						label: 'One-line overflow',
						component: <ContentEditableClampExample />,
						code: clampCode.trim(),
						codeFilename: 'ClampedTitle.tsx',
					},
				]}
			/>
			<H3>Choose how editing starts</H3>
			<P>
				{'Use '}
				<Code>{'onClick'}</Code>
				{', or a separate edit trigger. ContentEditable does not choose the activation gesture.'}
			</P>
			<CodeBlock filename="StartEditing.tsx" language="tsx" code={activationCode.trim()} />
			<H3>Save changes asynchronously</H3>
			<P>
				{'Update '}
				<Code>{'value'}</Code>
				{' immediately in '}
				<Code>{'onCommit'}</Code>
				{
					', then persist it. Keep saving feedback, errors, and rollback in your app. Prevent overlapping saves or handle their ordering when the same item can be edited again before a request finishes.'
				}
			</P>
			<CodeBlock filename="SaveTitle.tsx" language="tsx" code={persistenceCode.trim()} />
			<H2 id="behavior">Behavior</H2>
			<P>
				{'Pass plain text through '}
				<Code>value</Code>
				{' or '}
				<Code>defaultValue</Code>
				{'. '}
				<Code>children</Code>
				{' and rich HTML are not supported.'}
			</P>
			<P>
				{'Each edit session keeps its own draft. External '}
				<Code>{'value'}</Code>
				{
					' changes wait until the session ends. Escape restores the latest committed value; finishing a changed draft passes both the new text and the value from the start of the session to '
				}
				<Code>{'onCommit'}</Code>
				{'.'}
			</P>
			<P>
				{
					'Paste inserts plain text, with line breaks and tabs replaced by spaces. Angle brackets remain literal text. Use '
				}
				<Code openURL="/docs/react/textfield/">TextField</Code>
				{' for form inputs; ContentEditable does not submit or serialize form data.'}
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				{'Static content remains selectable text. Editing exposes a single-line textbox named by '}
				<Code>{'name'}</Code>
				{', with '}
				<Code>{'Editable text'}</Code>
				{' as the fallback. Enter and F2 request editing through '}
				<Code>onEditStart</Code>
				{' when the surface has keyboard focus.'}
			</P>
			<P>
				{
					'Enter finishes editing and Escape cancels. Composition input can finish before Enter commits. Reduced-motion preferences disable the background transition.'
				}
			</P>
			<H2 id="props">Props</H2>
			<P>All props are optional. Colors accept Slice theme tokens or CSS colors.</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>{'Background while editing. Static text has a transparent background.'}</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'4'}</DefaultVal>
			</Definition>
			<P>{'Corner radius in pixels or CSS units.'}</P>
			<Definition id="clamp">
				<Prop>clamp</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>
				{'Maximum displayed lines outside edit mode. Text wraps without a limit by default. Use '}
				<Code>{'clamp={1}'}</Code>
				{' for a single displayed line. Editing removes the clamp. Nonpositive or nonfinite values disable clamping.'}
			</P>
			<Definition id="defaultValue">
				<Prop>defaultValue</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'empty string'}</DefaultVal>
			</Definition>
			<P>
				{'Initial text when '}
				<Code>{'value'}</Code>
				{' is omitted. Commits update the local value.'}
			</P>
			<Definition id="isEditable">
				<Prop>isEditable</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{'Starts and focuses an edit session when set to '}
				<Code>{'true'}</Code>
				{'. Your app controls activation and resets it to '}
				<Code>{'false'}</Code>
				{' in '}
				<Code>{'onEditEnd'}</Code>
				{'. Setting it to '}
				<Code>{'false'}</Code>
				{' during editing finishes and commits any changes.'}
			</P>
			<Definition id="name">
				<Prop>name</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Editable text'}</DefaultVal>
			</Definition>
			<P>{'Accessible name while editing. Blank names use the fallback.'}</P>
			<Definition id="padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>{'Uniform pixel padding or a CSS padding value. Explicit values are used as provided.'}</P>
			<Definition id="placeholder">
				<Prop>placeholder</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Untitled'}</DefaultVal>
			</Definition>
			<P>{'Visual hint for empty text. It is never inserted into the value or saved.'}</P>
			<Definition id="selectOnEdit">
				<Prop>selectOnEdit</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>
				{
					'Selects all text when editing starts. Otherwise, preserves an existing caret inside the text or places it at the end.'
				}
			</P>
			<Definition id="textAlign">
				<Prop>textAlign</Prop>
				<TypeDef>{"'left' | 'center' | 'right'"}</TypeDef>
				<DefaultVal>{'left'}</DefaultVal>
			</Definition>
			<P>{'Horizontal text alignment.'}</P>
			<Definition id="textColor">
				<Prop>textColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'inherit'}</DefaultVal>
			</Definition>
			<P>{'Text color. Inherits surrounding text color when omitted.'}</P>
			<Definition id="textColorPlaceholder">
				<Prop>textColorPlaceholder</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-text-tertiary'}</DefaultVal>
			</Definition>
			<P>{'Color of the empty-text hint.'}</P>
			<Definition id="textSize">
				<Prop>textSize</Prop>
				<TypeDef>{"'xs' | 's' | 'm' | 'l' | 'xl'"}</TypeDef>
				<DefaultVal>{'inherit'}</DefaultVal>
			</Definition>
			<P>{'Slice body text size. Inherits surrounding typography when omitted.'}</P>
			<Definition id="value">
				<Prop>value</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{
					'Committed display value. Updates are deferred during an active edit so they do not replace the draft or move the caret. Update this in '
				}
				<Code>{'onCommit'}</Code>
				{', rather than on each keystroke.'}
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>
				{
					'Sizes to its text by default, constrained to the available width. Set a pixel or CSS width when a specific size is needed.'
				}
			</P>
			<Definition id="spanAttributes">
				<Prop>...spanAttributes</Prop>
				<TypeDef>{'React.HTMLAttributes<HTMLSpanElement>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				{'The root is a '}
				<Code>span</Code>
				{', suitable inside headings and paragraphs. Native attributes apply directly to it. '}
				<Code>{'className'}</Code>
				{' is appended and '}
				<Code>{'style'}</Code>
				{' is merged. Component-owned content, editability, and ARIA attributes are excluded; use '}
				<Code>{'name'}</Code>
				{' for its accessible label.'}
			</P>
			<H2 id="events">Events</H2>
			<Definition id="onChange">
				<Method>onChange</Method>
				<TypeDef>{'(draft: string) => void'}</TypeDef>
			</Definition>
			<P>{'Reports draft changes without committing. Clearing text reports an empty string.'}</P>
			<Definition id="onCommit">
				<Method>onCommit</Method>
				<TypeDef>{'(value: string, previousValue: string) => void'}</TypeDef>
			</Definition>
			<P>
				{
					'Runs once when changed text is committed through blur, Enter, or external edit-mode exit. Does not run for unchanged text or Escape.'
				}
			</P>
			<Definition id="onEditEnd">
				<Method>onEditEnd</Method>
				<TypeDef>{"(reason: 'blur' | 'enter' | 'escape' | 'external') => void"}</TypeDef>
			</Definition>
			<P>
				{
					'Runs whenever an edit session ends, including cancellation or unchanged text. Use it to exit edit mode. The reason type is exported as '
				}
				<Code>{'ContentEditableEditEndReason'}</Code>
				{'.'}
			</P>
			<Definition id="onEditStart">
				<Method>onEditStart</Method>
				<TypeDef>{'() => void'}</TypeDef>
			</Definition>
			<P>
				{'Requests editing when Enter or F2 is pressed outside edit mode. Set '}
				<Code>isEditable</Code>
				{' to true in this callback. The surface defaults to '}
				<Code>{'tabIndex={0}'}</Code>
				{
					' when editing or when this callback is supplied. An explicit tabIndex overrides this. Composition input and prevented key events do not activate editing.'
				}
			</P>
			<Definition id="nativeEvents">
				<Method>...spanEvents</Method>
				<TypeDef>{'React.DOMAttributes<HTMLSpanElement>'}</TypeDef>
			</Definition>
			<P>
				{'Native events such as '}
				<Code>{'onClick'}</Code>
				{', '}
				<Code>{'onDoubleClick'}</Code>
				{', '}
				<Code>{'onFocus'}</Code>
				{', '}
				<Code>{'onBlur'}</Code>
				{', '}
				<Code>{'onKeyDown'}</Code>
				{', and '}
				<Code>{'onPaste'}</Code>
				{' receive their normal React events. Clicks bubble normally. Preventing the default in '}
				<Code>{'onKeyDown'}</Code>
				{' or '}
				<Code>{'onPaste'}</Code>
				{' skips the corresponding internal action.'}
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'ContentEditable component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'clamp', title: 'clamp', code: true },
			{ id: 'defaultValue', title: 'defaultValue', code: true },
			{ id: 'isEditable', title: 'isEditable', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'padding', title: 'padding', code: true },
			{ id: 'placeholder', title: 'placeholder', code: true },
			{ id: 'selectOnEdit', title: 'selectOnEdit', code: true },
			{ id: 'textAlign', title: 'textAlign', code: true },
			{ id: 'textColor', title: 'textColor', code: true },
			{ id: 'textColorPlaceholder', title: 'textColorPlaceholder', code: true },
			{ id: 'textSize', title: 'textSize', code: true },
			{ id: 'value', title: 'value', code: true },
			{ id: 'width', title: 'width', code: true },
			{ id: 'spanAttributes', title: '...spanAttributes', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onCommit', title: 'onCommit', code: true },
			{ id: 'onEditEnd', title: 'onEditEnd', code: true },
			{ id: 'onEditStart', title: 'onEditStart', code: true },
			{ id: 'nativeEvents', title: '...spanEvents', code: true },
		],
	},
];
export default ContentEditableDoc;

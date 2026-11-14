import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { ModelsPromptPreview, PastePromptPreview, PromptPreview, WorkingPreview } from './PromptInputPreview';
import { actionsCode, modelsCode, usageCode, workingCode } from './code';

const promptProps = [
	{
		name: 'acceptedTypes',
		type: 'string[]',
		defaultValue: 'allTypes',
		description:
			'Allowed file extensions or MIME tokens, using the same normalization and validation as UploadArea. Converted text pastes must also match these rules.',
	},
	{
		name: 'attachActionName',
		type: 'string',
		defaultValue: 'Attach files',
		description: 'Accessible name and tooltip for the attach action.',
	},
	{ name: 'attachButton', type: 'boolean', defaultValue: 'true', description: 'Shows the native file-picker action.' },
	{
		name: 'attachments',
		type: 'FileItem[]',
		defaultValue: 'undefined',
		description:
			'Controlled attachments. Pass onAttachmentsChange to update them; otherwise attachment mutations are disabled.',
	},
	{
		name: 'attachmentsDisabled',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Disables file addition and removal. Text editing and inline paste remain available.',
	},
	{
		name: 'borderAnimate',
		type: 'boolean',
		defaultValue: 'true',
		description: 'Allows the gradient border to rotate while working; reduced motion overrides it.',
	},
	{
		name: 'borderColor',
		type: 'ColorValue',
		defaultValue: 'theme border or gradient',
		description: 'Idle composer border. Supports Slice tokens or CSS colors.',
	},
	{
		name: 'borderColorFocused',
		type: 'ColorValue',
		defaultValue: 'current border',
		description: 'Border while any composer control has focus; also highlights a working solid border.',
	},
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: '8',
		description: 'Outer corner radius. Numbers use pixels; the inner radius accounts for borderWidth.',
	},
	{
		name: 'borderStyle',
		type: "'solid' | 'gradient' | 'none'",
		defaultValue: 'gradient',
		description: 'Composer border treatment.',
	},
	{
		name: 'borderWidth',
		type: 'number',
		defaultValue: '1',
		description: 'Border width in pixels. Negative values clamp to zero; nonfinite values use 1.',
	},
	{
		name: 'children',
		type: 'ReactNode | ((actions: PromptActions) => ReactNode)',
		defaultValue: 'undefined',
		description:
			'Custom action-bar controls. Ordinary children retain their native interaction. A render function receives editor state and commands; see the shape below.',
	},
	{
		name: 'defaultAttachments',
		type: 'FileItem[]',
		defaultValue: '[]',
		description: 'Initial attachments when attachments is omitted.',
	},
	{
		name: 'defaultValue',
		type: 'string',
		defaultValue: "''",
		description: 'Initial editor text when value is omitted.',
	},
	{
		name: 'disabled',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Disables editing, file mutations, submit, and stop.',
	},
	{
		name: 'enterSubmits',
		type: 'boolean',
		defaultValue: 'true',
		description:
			'Submits unmodified Enter when eligible. Shift/modifier Enter and IME composition retain TextArea behavior; held Enter does not repeat-submit.',
	},
	{
		name: 'fileListProps',
		type: 'UploadAreaProps["fileListProps"]',
		defaultValue: 'undefined',
		description:
			'FileList presentation options, including attachment cards and card size. PromptInput owns files, removal, and tooltip callbacks.',
	},
	{
		name: 'focused',
		type: 'boolean',
		defaultValue: 'undefined',
		description: 'Optional TextArea focus request. Omit to let normal browser interaction own focus.',
	},
	{
		name: 'inputName',
		type: 'string',
		defaultValue: 'Message',
		description: 'Accessible editor name; TextArea provides a unique input ID.',
	},
	{
		name: 'maxHeight',
		type: 'number | string',
		defaultValue: '400',
		description:
			'Maximum editor height. TextArea auto-growth scrolls within this limit, keeping the action bar available. Numbers use pixels; CSS strings are supported.',
	},
	{
		name: 'maxLength',
		type: 'number',
		defaultValue: 'undefined',
		description:
			'Native text length limit, also applied to custom paste insertion. textAreaProps.maxLength can override it.',
	},
	{
		name: 'maxWidth',
		type: 'number | string',
		defaultValue: 'undefined',
		description: 'Maximum composer width; numbers use pixels.',
	},
	{
		name: 'minWidth',
		type: 'number | string',
		defaultValue: '0',
		description: 'Minimum composer width; numbers use pixels.',
	},
	{
		name: 'multiple',
		type: 'boolean',
		defaultValue: 'true',
		description:
			'Appends accepted files. False replaces attachments with the first accepted file and rejects excess matches.',
	},
	{
		name: 'pasteAttachmentThreshold',
		type: 'number',
		defaultValue: 'undefined',
		description:
			'Opt-in plain-text paste limit, measured with JavaScript string.length. Text longer than the limit becomes Pasted-text.txt; equal or shorter content stays inline. Negative or nonfinite limits disable conversion.',
	},
	{ name: 'placeholder', type: 'string', defaultValue: 'Ask me anything ...', description: 'Idle editor placeholder.' },
	{
		name: 'placeholderWorking',
		type: 'string',
		defaultValue: 'Working ...',
		description: 'Placeholder while working.',
	},
	{
		name: 'readOnly',
		type: 'boolean',
		defaultValue: 'false',
		description:
			'Prevents text and attachment changes and submission. An explicitly enabled stop action remains available.',
	},
	{
		name: 'sendActionName',
		type: 'string',
		defaultValue: 'Send message',
		description: 'Accessible name and tooltip for send.',
	},
	{ name: 'sendButton', type: 'boolean', defaultValue: 'true', description: 'Shows the send/stop action.' },
	{
		name: 'stopActionName',
		type: 'string',
		defaultValue: 'Stop generating',
		description: 'Accessible name and tooltip for stop.',
	},
	{
		name: 'stopEnabled',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Routes the action button to onStop. Enter in the editor does not stop generation.',
	},
	{
		name: 'submitClears',
		type: 'boolean',
		defaultValue: 'true',
		description: 'Clears text after submission. Attachments remain owned by the application or local attachment state.',
	},
	{
		name: 'submitWorking',
		type: 'boolean',
		defaultValue: 'false',
		description:
			'While working, blocks submission and displays Button progress. The editor stays editable unless disabled/readOnly.',
	},
	{
		name: 'textAreaProps',
		type: 'PromptTextAreaProps',
		defaultValue: 'undefined',
		description:
			'TextArea presentation, naming, guidance, native inputAttributes, and sizing options. Owned value, refs, state, callbacks, and submit controls cannot be replaced.',
	},
	{
		name: 'textSize',
		type: "'xs' | 's' | 'm' | 'l' | 'xl'",
		defaultValue: 'm',
		description: 'Editor text size; may be overridden in textAreaProps.',
	},
	{
		name: 'toolbarGap',
		type: 'number',
		defaultValue: '8',
		description: 'Space between custom and attach actions in pixels.',
	},
	{
		name: 'value',
		type: 'string',
		defaultValue: 'undefined',
		description: 'Controlled editor text. Pass onChange to update it; omission enables local text state.',
	},
	{ name: 'width', type: 'number | string', defaultValue: '100%', description: 'Composer width; numbers use pixels.' },
	{
		name: 'working',
		type: 'boolean',
		defaultValue: 'false',
		description:
			'Working border/placeholder state. Pair with submitWorking to block sends or stopEnabled to expose stop.',
	},
	{
		name: 'divAttributes',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		defaultValue: 'undefined',
		description:
			'Native wrapper attributes, className, style, and events. A forwarded ref targets the outer div. Editor key/paste and value/focus callbacks use the dedicated events below.',
	},
];
const promptEvents = [
	{
		name: 'onAttachmentsChange',
		type: '(attachments: FileItem[]) => void',
		description:
			'Complete next attachment array after file selection, drop, paste conversion, or removal. Pass a file-array state setter directly.',
	},
	{
		name: 'onBlur',
		type: '(value: string, attachments: FileItem[]) => void',
		description: 'Runs for a native editor blur, once per focus transition.',
	},
	{
		name: 'onChange',
		type: '(value: string, attachments: FileItem[]) => void',
		description:
			'Runs for text edits and attachment changes. A string state setter can be assigned directly; the second argument supplies current attachments.',
	},
	{
		name: 'onFocus',
		type: '(value: string, attachments: FileItem[]) => void',
		description: 'Runs for a native editor focus, once per transition.',
	},
	{
		name: 'onKeyDown',
		type: '(event: React.KeyboardEvent<HTMLTextAreaElement>) => void',
		description: 'Runs before editor key handling. preventDefault cancels the corresponding internal behavior.',
	},
	{
		name: 'onPaste',
		type: '(event: React.ClipboardEvent<HTMLTextAreaElement>) => void',
		description: 'Runs before threshold conversion. preventDefault lets the application handle the paste itself.',
	},
	{
		name: 'onReject',
		type: '(files: UploadFileRejection[]) => void',
		description:
			'Rejected file/reason pairs, using UploadArea\u2019s type and multiple reasons. Visible rejection feedback is automatic.',
	},
	{
		name: 'onStop',
		type: '() => void',
		description: 'Explicit stop action. The application updates working/stopEnabled; editor focus is restored.',
	},
	{
		name: 'onSubmit',
		type: '(value: string, attachments: FileItem[]) => void',
		description:
			'Ready prompt submission from the native action, Enter, or an action command. Requires trimmed text or ready attachments; uploading/error attachments block it. The application owns async work.',
	},
	{
		name: 'onToolTip',
		type: '(tip: ToolTip | null) => void',
		description: 'Shared Button/IconButton and FileList tooltips, directly composable with an app-wide Tip handler.',
	},
	{
		name: 'nativeEvents',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		description: 'Other native DOM events apply to the outer wrapper.',
	},
];
const actionsType =
	'type PromptActions = {\n  value: string;\n  attachments: FileItem[];\n  canSubmit: boolean;\n  canAttach: boolean;\n  disabled: boolean; // editing actions are unavailable\n  focus(): void;\n  submit(): void;\n  stop(): void;\n  openFilePicker(): void;\n  addFiles(files: File[]): boolean;\n  pasteText(text: string): void;\n};';

export function PromptInputDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">PromptInput component</H1>
			<P>
				An AI-ready text box for adding messaging to your app. Combine prompts, file attachments, model selection, and
				send/stop controls in one customizable composer.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Connect your message and attachment state, then use <Code>onSubmit</Code> to send them to your model. Add
				controls such as model selection to the actions bar to fit your AI experience.
			</P>
			<TipBox inline noMargin noBorder>
				Drop files anywhere in the composer or use the attach button to add them to your message.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-promptinput--default"
				components={[
					{
						label: 'Message composer',
						component: <PromptPreview />,
						code: { code: usageCode.trim(), filename: 'MessageComposer.tsx' },
					},
				]}
			/>
			<H3>Paste long text as an attachment</H3>
			<P>
				Use <Code>pasteAttachmentThreshold</Code> to convert pasted text into an attachment, leaving the message space
				uncluttered.
			</P>
			<TipBox inline noMargin noBorder>
				Copy this paragraph and paste it into the field below. Text longer than 200 characters becomes a removable text
				attachment, keeping the message short. Shorter text stays in the editor at the cursor, ready for you to edit or
				send with your other files.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-promptinput--composed-actions"
				components={[
					{
						label: 'Paste and attachments',
						component: <PastePromptPreview />,
						code: { code: actionsCode.trim(), filename: 'PasteComposer.tsx' },
					},
				]}
			/>
			<H3>Compose a custom action bar with additional selection options</H3>
			<P>
				Add a <Code>Button</Code> and <Code>PopMenu</Code> to the actions bar. The selected model and voice options
				belongs to your application.
			</P>
			<ComponentCanvas
				components={[
					{
						label: 'Models menu',
						component: <ModelsPromptPreview />,
						code: { code: modelsCode.trim(), filename: 'ModelsComposer.tsx' },
					},
				]}
			/>
			<H3>Stop work</H3>
			<P>
				The application owns asynchronous work. Set <Code>working</Code> and <Code>stopEnabled</Code> while a response
				is being generated, then update those flags in <Code>onStop</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-promptinput--working"
				components={[
					{
						label: 'Working composer',
						component: <WorkingPreview />,
						code: { code: workingCode.trim(), filename: 'WorkingPrompt.tsx' },
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Text and attachments may be controlled independently or initialized with their default props. A controlled value
				updates only when its owner updates the prop. Controlled attachments require <Code>onAttachmentsChange</Code>{' '}
				for mutation.
			</P>
			<P>
				Submission requires trimmed text or at least one attachment, with no uploading/error attachments.{' '}
				<Code>submitWorking</Code> blocks sends while working; stop is an explicit action. Submission clears text by
				default and keeps editor focus. Applications decide when to clear attachments and how to handle async failures.
			</P>
			<P>
				Drop files anywhere in the composer to add attachments. Drops use <Code>acceptedTypes</Code>,{' '}
				<Code>multiple</Code>, and <Code>onReject</Code> just like the picker. Attachment restrictions also apply to
				drops; text dragging keeps its native behavior. Call <Code>preventDefault()</Code> in <Code>onDrop</Code> to
				handle a drop yourself. Your application owns uploading the attached files.
			</P>
			<P>
				<Code>pasteAttachmentThreshold</Code> is opt-in. Oversized plain text goes through the shared file validator as{' '}
				<Code>Pasted-text.txt</Code>; a rejected conversion leaves the editor unchanged and reports an error. When
				attachment mutation is disabled, paste stays inline and respects the text length limit.
			</P>
			<P>
				Custom <Code>pasteText</Code> commands preserve the selection/caret and use the latest committed state,
				including after an asynchronous clipboard read. <Code>addFiles</Code> uses the same validation and
				append/replace semantics as the built-in picker.
			</P>
			<P>
				Clicking an empty part of the composer focuses the editor. Buttons and other interactive controls retain their
				own focus; selecting text does not move focus. <Code>textAreaProps</Code> and <Code>fileListProps</Code>{' '}
				configure the shared controls directly. Use <Code>borderColorFocused</Code> in place of the former{' '}
				<Code>borderColorOn</Code>.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				TextArea supplies a named editor, unique IDs, measured auto-growth, IME handling, and Shift+Enter behavior.
				Send, stop, and attach are named native actions with keyboard focus feedback. Enter submits when eligible;
				composing or modified Enter retains editor behavior.
			</P>
			<P>
				FileList supplies named removal, progress, and error feedback. File rejection is announced through an alert. The
				border respects reduced motion, including live preference changes; shared controls keep their existing motion
				behavior.
			</P>
			<H2 id="props">Props</H2>
			{promptProps.map(({ name, type, defaultValue, description }) => (
				<Fragment key={name}>
					<Definition id={`prop-${name}`}>
						<Prop>{name === 'divAttributes' ? '...divAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
					{name === 'children' && <CodeBlock language="typescript" code={actionsType} />}
				</Fragment>
			))}
			<H2 id="events">Events</H2>
			{promptEvents.map(({ name, type, description }) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Method>{name === 'nativeEvents' ? '...divEvents' : name}</Method>
						<TypeDef>{type}</TypeDef>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
		</FlexBox>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'PromptInput component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: promptProps.map(({ name }) => ({
			id: `prop-${name}`,
			title: name === 'divAttributes' ? '...divAttributes' : name,
			code: true,
		})),
	},
	{
		id: 'events',
		title: 'Events',
		items: promptEvents.map(({ name }) => ({
			id: name,
			title: name === 'nativeEvents' ? '...divEvents' : name,
			code: true,
		})),
	},
];
export default PromptInputDoc;

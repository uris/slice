import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { AttachmentFilesPreview, BusyPreview, UploadPreview } from './UploadAreaPreview';
import { attachmentsCode, busyCode, usageCode } from './code';
const areaProps = [
	{
		name: 'acceptedTypes',
		type: 'string[]',
		defaultValue: 'allTypes',
		description:
			'Allowed extensions or MIME tokens. Bare extensions such as pdf normalize to .pdf; matching is case-insensitive. Extension rules use File.name, while explicit MIME rules use File.type. An empty array accepts all types.',
	},
	{
		name: 'actionName',
		type: 'string',
		defaultValue: 'title or Upload files',
		description: 'Accessible name for the native picker button.',
	},
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'core-surface-secondary',
		description: 'Idle background color.',
	},
	{
		name: 'backgroundColorHover',
		type: 'ColorValue',
		defaultValue: 'core-surface-special',
		description: 'Background during an active file drag.',
	},
	{
		name: 'borderColor',
		type: 'ColorValue | null',
		defaultValue: 'core-outline-primary',
		description: 'Idle border color.',
	},
	{
		name: 'borderColorHover',
		type: 'ColorValue | null',
		defaultValue: 'core-outline-special',
		description: 'Border color while dragging or busy.',
	},
	{
		name: 'borderRadius',
		type: 'number | string',
		defaultValue: 'corner-m (8px)',
		description: 'Corner radius; numbers use pixels.',
	},
	{ name: 'borderStyle', type: 'string', defaultValue: 'dashed', description: 'CSS border style.' },
	{ name: 'borderWidth', type: 'number', defaultValue: '1', description: 'Border width in pixels.' },
	{
		name: 'busy',
		type: 'boolean',
		defaultValue: 'false',
		description:
			'Blocks selection and removal, shows busyMessage, and announces upload activity. Does not initiate uploads.',
	},
	{
		name: 'busyMessage',
		type: 'string',
		defaultValue: 'Uploading in progress',
		description: 'Visible message and status announcement while busy.',
	},
	{
		name: 'canRemove',
		type: 'boolean',
		defaultValue: 'true',
		description: 'Shows removal controls when enabled, the item is not uploading, and onFilesChange is connected.',
	},
	{
		name: 'disabled',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Blocks picker, drop, input selection, and removal without showing an upload status.',
	},
	{
		name: 'fileListProps',
		type: "Omit<FileListProps, 'files' | 'onChange' | 'canRemove' | 'onToolTip'>",
		defaultValue: 'undefined',
		description:
			'Presentation options passed directly to the embedded FileList, including variant, attachmentSize, spacing, and listName. Attachment cards default to a wrapping row; compact files default to a column. UploadArea manages the data and interaction callbacks.',
	},
	{
		name: 'files',
		type: 'FileItem[]',
		defaultValue: '[]',
		description:
			'Controlled attachments. Each item supports id, file, uploading, progress (0\u2013100 percent), and error. Selection and removal report the complete next array through onFilesChange.',
	},
	{ name: 'height', type: 'number | string', defaultValue: 'auto', description: 'Area height; numbers use pixels.' },
	{
		name: 'icon',
		type: 'SliceIcon',
		defaultValue: 'documents.file-upload',
		description: 'Decorative artwork above the title.',
	},
	{ name: 'iconColor', type: 'ColorValue', defaultValue: 'core-text-primary', description: 'Idle icon stroke color.' },
	{
		name: 'iconColorHover',
		type: 'ColorValue',
		defaultValue: 'core-text-special',
		description: 'Icon stroke color during a file drag.',
	},
	{
		name: 'iconSize',
		type: 'number',
		defaultValue: '24',
		description:
			'Leading icon size in pixels. Embedded compact rows default to 24px file icons; attachment cards inherit the Attachment default.',
	},
	{
		name: 'message',
		type: 'string',
		defaultValue: 'Drag and drop files here or click to upload',
		description: 'Idle message describing file selection.',
	},
	{
		name: 'multiple',
		type: 'boolean',
		defaultValue: 'true',
		description:
			'Accepts all matching files and appends them to files. When false, accepts the first matching file, replaces the selection, and rejects extra matches with reason multiple. Applies equally to picker and drop.',
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: 'spacing-xl (32px)',
		description: 'Area padding. Numbers use pixels; CSS shorthand and zero apply exactly.',
	},
	{
		name: 'showProgress',
		type: 'boolean',
		defaultValue: 'true',
		description: 'Shows the decorative spinner beside busyMessage while busy.',
	},
	{
		name: 'textSize',
		type: "'xs' | 's' | 'm' | 'l' | 'xl'",
		defaultValue: 'm',
		description: 'Message text size; the title uses large bold text.',
	},
	{
		name: 'title',
		type: 'string',
		defaultValue: 'Upload Files',
		description: 'Visible title and default accessible name.',
	},
	{ name: 'width', type: 'number | string', defaultValue: '100%', description: 'Area width; numbers use pixels.' },
	{
		name: 'divAttributes',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		defaultValue: 'undefined',
		description:
			'Native attributes, className, style, and events apply to the outer div. Internal layout variables take precedence over matching style properties. Children and managed role/busy/disabled attributes are excluded. A forwarded ref targets this div.',
	},
];
export function UploadAreaDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">UploadArea component</H1>
			<P>Choose or drop files, validate the selection, and display upload feedback with an attached file list.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Keep a <Code>FileItem[]</Code> in state and pass its setter directly to <Code>onFilesChange</Code>. It receives
				the next array after selection or removal. Use <Code>onUpload</Code> to start your application’s upload work for
				newly accepted files.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-uploadarea--controlled"
				components={[
					{
						label: 'Choose files',
						component: <UploadPreview />,
						code: { code: usageCode.trim(), filename: 'Attachments.tsx' },
					},
				]}
			/>
			<H3>Display attachment cards</H3>
			<P>
				Set <Code>fileListProps.variant</Code> to <Code>attachments</Code> to show the files as cards. The same FileList
				options control card size and layout.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-uploadarea--attachment-cards"
				components={[
					{
						label: 'Attachment cards',
						component: <AttachmentFilesPreview />,
						code: { code: attachmentsCode.trim(), filename: 'UploadAttachments.tsx' },
					},
				]}
			/>

			<H3>Show upload feedback</H3>
			<P>
				Set <Code>busy</Code> while uploading. Individual file entries can carry progress percentages and errors. Use{' '}
				<Code>disabled</Code> to block interaction without presenting an upload state.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-uploadarea--busy"
				components={[
					{
						label: 'Uploading',
						component: <BusyPreview />,
						code: { code: busyCode.trim(), filename: 'UploadFeedback.tsx' },
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Picker and drop use the same validation. Matching files append in multiple mode; single mode replaces the
				selection with the first match. Empty selections do nothing. Existing attachments remain usable while idle, and
				a fully rejected selection leaves them unchanged.
			</P>
			<P>
				Rejected files are listed in an accessible message and reported through <Code>onReject</Code>. Extensions match{' '}
				<Code>File.name</Code> rather than MIME type. Explicit MIME types and <Code>image/*</Code>, <Code>audio/*</Code>
				, or <Code>video/*</Code> match <Code>File.type</Code>. Application-specific upload constraints remain the
				application’s responsibility.
			</P>
			<P>
				Selections create stable IDs for new attachments and preserve existing FileItem objects when appending. The
				component does not upload files or store the controlled array. When both callbacks are supplied,{' '}
				<Code>onFilesChange</Code> runs before <Code>onUpload</Code>; do not append the same files again in the upload
				callback.
			</P>
			<P>
				Public presets are <Code>imageTypes</Code>, <Code>videoTypes</Code>, <Code>documentTypes</Code>,{' '}
				<Code>audioTypes</Code>, <Code>textTypes</Code>, and their combined <Code>allTypes</Code>. Preset extensions are
				normalized internally. Shared color props accept Slice tokens or CSS colors.
			</P>
			<P>
				Use <Code>borderWidth</Code> and <Code>borderRadius</Code>; the former <Code>border</Code> and{' '}
				<Code>radius</Code> aliases have been removed. Explicit padding applies exactly, including zero.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				A native picker button supports Enter and Space, uses <Code>actionName</Code> or the visible title, and displays
				a keyboard-only focus outline. Busy and disabled states affect the trigger and removal actions without disabling
				the ancestor of the file list.
			</P>
			<P>
				Busy activity is announced through a polite status region, and rejected files through an alert. Artwork and
				spinners are decorative. FileList supplies named removal controls, accessible progress, and error alerts;
				removing the last file returns focus to the picker button.
			</P>
			<P>
				The busy spinner respects reduced motion, including live preference changes. Drag highlighting resets when
				interaction becomes unavailable or a drag is cancelled.
			</P>
			<H2 id="props">Props</H2>
			{areaProps.map(({ name, type, defaultValue, description }) => (
				<Fragment key={name}>
					<Definition id={`prop-${name}`}>
						<Prop>{name === 'divAttributes' ? '...divAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
			<H2 id="events">Events</H2>
			<Definition id="onFilesChange">
				<Method>onFilesChange</Method>
				<TypeDef>(files: FileItem[]) =&gt; void</TypeDef>
			</Definition>
			<P>
				Receives the complete next attachment array after accepted selection or removal. Connect a state setter
				directly. This is the same shape used by FileList and PromptInput attachments.
			</P>
			<Definition id="onReject">
				<Method>onReject</Method>
				<TypeDef>(files: UploadFileRejection[]) =&gt; void</TypeDef>
			</Definition>
			<P>
				Receives rejected files from either entry path. Each entry has a <Code>file: File</Code> and{' '}
				<Code>reason: 'type' | 'multiple'</Code>. Rejection feedback is displayed automatically; the callback can add
				application-specific handling.
			</P>
			<Definition id="onToolTip">
				<Method>onToolTip</Method>
				<TypeDef>(tip: ToolTip | null) =&gt; void</TypeDef>
			</Definition>
			<P>Forwards FileList remove-action tooltips to the application’s shared Tip handler.</P>
			<Definition id="onUpload">
				<Method>onUpload</Method>
				<TypeDef>(files: File[]) =&gt; void</TypeDef>
			</Definition>
			<P>Receives only newly accepted files for upload work. Empty or fully rejected selections do not call it.</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>React.HTMLAttributes&lt;HTMLDivElement&gt;</TypeDef>
			</Definition>
			<P>
				Native events apply to the wrapper. Drag handlers compose with internal behavior; preventDefault in onDragEnter
				or onDrop cancels that event’s internal handling. Use onClickCapture to cancel picker activation. Cleanup still
				clears drag highlighting.
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'UploadArea component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: areaProps.map(({ name }) => ({
			id: `prop-${name}`,
			title: name === 'divAttributes' ? '...divAttributes' : name,
			code: true,
		})),
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onFilesChange', title: 'onFilesChange', code: true },
			{ id: 'onReject', title: 'onReject', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'onUpload', title: 'onUpload', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default UploadAreaDoc;

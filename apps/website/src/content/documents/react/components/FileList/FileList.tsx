import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexBox, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { AttachmentCardsPreview, AttachmentsPreview, UploadStatesPreview } from './FileListPreview';
import { cardsCode, statesCode, usageCode } from './code';

const listProps = [
	{
		name: 'attachmentSize',
		type: "'xs' | 's' | 'm' | 'l' | 'xl'",
		defaultValue: 'm',
		description: (
			<>
				Card width and preview height for <Code>variant="attachments"</Code>: 80, 140, 160, 200, or 240 pixels.
			</>
		),
	},
	{
		name: 'backgroundColor',
		type: 'ColorValue',
		defaultValue: 'core-surface-secondary',
		description: 'Compact progress fill or attachment-card background. Accepts Slice color tokens or CSS colors.',
	},
	{
		name: 'canRemove',
		type: 'boolean',
		defaultValue: 'true',
		description:
			'Shows removal controls for files that are not uploading. Pair with onChange to update the controlled array.',
	},
	{
		name: 'direction',
		type: "'row' | 'column'",
		defaultValue: 'row',
		description: 'Rows wrap items. Columns stack compact rows at full width and cards at their natural width.',
	},
	{
		name: 'files',
		type: 'File[] | FileItem[]',
		defaultValue: '[]',
		description: (
			<>
				Raw files render without upload progress or errors in either variant. A <Code>FileItem</Code> has{' '}
				<Code>id?: string</Code>, <Code>file: File | string</Code>, <Code>uploading?: boolean</Code>,{' '}
				<Code>progress?: number</Code>, and <Code>error?: string</Code>. Use unique IDs when recreating attachment
				objects. Compact rows retain filename extensions; cards omit the final extension.
			</>
		),
	},
	{ name: 'gap', type: 'number', defaultValue: '10', description: 'Space between attachments in pixels.' },
	{
		name: 'iconSize',
		type: 'number',
		defaultValue: '24 in list; 48 in attachments',
		description: 'Width and height of each file icon in pixels.',
	},
	{ name: 'listName', type: 'string', defaultValue: 'Files', description: 'Accessible name for the attachment list.' },
	{
		name: 'maxWidth',
		type: 'number | string',
		defaultValue: 'undefined',
		description:
			'Maximum item width. Compact column rows use 100% regardless of this value; cards respect it in both directions. Numbers use pixels.',
	},
	{
		name: 'minWidth',
		type: 'number | string',
		defaultValue: 'undefined',
		description:
			'Minimum item width. Compact column rows default to 100%; cards keep their natural width unless constrained. Numbers use pixels.',
	},
	{
		name: 'padding',
		type: 'number | string',
		defaultValue: '6px in list; 0 4px in attachments',
		description:
			'Padding within compact rows or the information rows of cards. Numbers use pixels; CSS shorthands and zero are preserved.',
	},
	{
		name: 'textSize',
		type: "'xs' | 's' | 'm' | 'l' | 'xl'",
		defaultValue: 's',
		description: 'Filename text size. Error text uses the smaller status style.',
	},
	{
		name: 'variant',
		type: "'list' | 'attachments'",
		defaultValue: 'list',
		description: 'Choose compact file rows or thumbnail cards.',
	},
	{
		name: 'divAttributes',
		type: 'React.HTMLAttributes<HTMLDivElement>',
		defaultValue: 'undefined',
		description:
			'Native attributes, className, style, and DOM events apply to the outer wrapper. Internal layout variables take precedence over matching style properties. Children are not rendered. A forwarded ref targets the wrapper div; list semantics and focus behavior are managed internally.',
	},
];
export function FileListDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">FileList component</H1>
			<P>Display files as compact rows or thumbnail cards, with upload feedback and removal controls.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Pass raw <Code>File[]</Code> for files without upload status, or <Code>FileItem[]</Code> to include progress and
				errors. Keep the array in state and pass its setter directly to <Code>onChange</Code>. The shared{' '}
				<Code>FileItem[]</Code> shape also works with UploadArea and PromptInput.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-filelist--default"
				components={[
					{
						label: 'Compact file rows',
						component: <AttachmentsPreview />,
						code: usageCode.trim(),
						codeFilename: 'Attachments.tsx',
					},
				]}
			/>
			<H3>Display attachment cards</H3>
			<P>
				Set <Code>variant="attachments"</Code> to render each file with{' '}
				<Code openURL="/docs/react/attachment/">Attachment</Code>. Keep the same <Code>files</Code> and{' '}
				<Code>onChange</Code>; use <Code>attachmentSize</Code> for card dimensions.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-filelist--attachments"
				components={[
					{
						label: 'Attachment cards',
						component: <AttachmentCardsPreview />,
						code: cardsCode.trim(),
						codeFilename: 'AttachmentCards.tsx',
					},
				]}
			/>
			<H3>Show upload feedback</H3>
			<P>
				Set each item’s <Code>uploading</Code>, <Code>progress</Code>, and <Code>error</Code> from your upload process.
				Use <Code>{'canRemove={false}'}</Code> for a read-only list.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-filelist--default"
				components={[
					{
						label: 'Upload states',
						component: <UploadStatesPreview />,
						code: statesCode.trim(),
						codeFilename: 'UploadStates.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Removal calls <Code>onChange</Code> with a filtered array; the component does not keep its own files or upload
				them. Uploading files hide the remove control and show a spinner; failed cards remain removable even if their
				upload flag has not yet been cleared. Errors are visible alerts; compact rows also show a warning border.
			</P>
			<P>
				<Code>progress</Code> is a percentage from 0 to 100, rounded and clamped. For example, 1 means 1% and 40 means
				40%. Missing or nonfinite progress is indeterminate while uploading; completed items default to a full
				background in compact rows. Cards show the percentage at <Code>attachmentSize="m"</Code>, <Code>"l"</Code>, or{' '}
				<Code>"xl"</Code>. The spinner and upload label remain visible at every size.
			</P>
			<P>
				Use a unique <Code>id</Code> to preserve identity through immutable updates and duplicate filenames. Without
				IDs, retained attachment objects (or the same File object) keep their identity. Recreating objects without IDs
				can remount rows.
			</P>
			<P>
				File icons use the shared extension resolver. Row layout wraps items; column layout stacks them. Compact columns
				fill the available width, while cards keep their natural width. Long filenames truncate, and padding overrides
				apply exactly, including zero.
			</P>
			<P>
				Connect <Code>onToolTip</Code> to your application’s shared Tip handler to show the remove tooltip on hover or
				focus. The website previews use the layout’s existing Tip.
			</P>
			<P>
				Cards preview browser image and text files, display an extension-free filename, and format known sizes with
				1024-based units such as <Code>5.5 mb</Code>. Cards sized <Code>xs</Code> or <Code>s</Code> show only the file
				type; larger cards also show file size. Filename strings have no measured size and use a file-type icon.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The wrapper and attachments expose list semantics. File icons are decorative. Uploading files have named
				progress bars with numeric values when known, and errors are announced with the filename. The spinner does not
				duplicate these announcements.
			</P>
			<P>
				Native remove buttons have filename-specific names, keyboard-only focus outlines, and standard Enter/Space
				behavior. Removal moves keyboard focus to the next available action, the previous action, or the empty list.
				Progress transitions and spinner motion respect reduced motion.
			</P>
			<H2 id="props">Props</H2>
			{listProps.map(({ name, type, defaultValue, description }) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Prop>{name === 'divAttributes' ? '...divAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
			<H2 id="events">Events</H2>
			<Definition id="onChange">
				<Method>onChange</Method>
				<TypeDef>(files: T[]) =&gt; void</TypeDef>
			</Definition>
			<P>
				Receives the remaining attachments after removal, preserving their original objects and order. Pass a state
				setter directly. <Code>T</Code> is inferred from <Code>files</Code> and extends <Code>File | FileItem</Code>; a{' '}
				<Code>File[]</Code> input receives a <Code>File[]</Code> callback payload.
			</P>
			<Definition id="onToolTip">
				<Method>onToolTip</Method>
				<TypeDef>(tip: ToolTip | null) =&gt; void</TypeDef>
			</Definition>
			<P>
				Receives a filename-specific tooltip on hover or focus, and null when both end, on removal, or when the trigger
				unmounts.
			</P>
			<Definition id="nativeEvents">
				<Method>...divEvents</Method>
				<TypeDef>React.HTMLAttributes&lt;HTMLDivElement&gt;</TypeDef>
			</Definition>
			<P>Other DOM events are forwarded to the outer wrapper.</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'FileList component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: listProps.map(({ name }) => ({
			id: name,
			title: name === 'divAttributes' ? '...divAttributes' : name,
			code: true,
		})),
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onChange', title: 'onChange', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
			{ id: 'nativeEvents', title: '...divEvents', code: true },
		],
	},
];
export default FileListDoc;

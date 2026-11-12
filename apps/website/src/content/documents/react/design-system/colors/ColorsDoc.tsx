import {CodeBlock} from '@/components/CodeBlock';
import {ComponentCanvas} from '@/components/ComponetCanvas/ComponentCanvas';
import type {TrackedItem} from '@/components/OnThisPage/OnThisPage';
import {Path} from '@/components/Path/Path';
import {TipBox} from '@/components/TipBox/TipBox';
import {Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef} from '@/components/Type/Type';
import {FlexBox, Preset} from '@apple-pie/slice';
import {Fragment} from 'react';
import {
    AttachmentSizePreview,
    ImageAttachmentPreview,
    PdfAttachmentPreview,
    RemovableAttachmentPreview,
    TextAttachmentPreview,
    UploadAttachmentPreview,
    UploadErrorPreview,
} from '../../components/Attachment/AttachmentPreview';
import {
    actionsCode,
    errorCode,
    imageCode,
    indeterminateCode,
    pdfCode,
    removalCode,
    sizesCode,
    textCode,
    uploadCode,
} from '../../components/Attachment/code';

const attachmentProps = [
    {
        name: 'attachmentName',
        type: 'string',
        defaultValue: 'filename or Attachment',
        description:
            'Accessible name for the card. Blank values use the displayed filename, then the generic attachment name.',
    },
    {
        name: 'backgroundColor',
        type: 'ColorValue',
        defaultValue: 'core-surface-secondary',
        description: 'Card and canvas background. Text and file-icon previews use the primary surface background.',
    },
    {
        name: 'borderColor',
        type: 'ColorValue',
        defaultValue: 'core-outline-primary',
        description: 'Outer card border color.',
    },
    {
        name: 'borderRadius',
        type: 'number | string',
        defaultValue: '16',
        description: (
            <>
                Outer corner radius. Numbers use pixels; the canvas radius is inset by <Code>spacing-xs</Code> and does
                not fall
                below zero.
            </>
        ),
    },
    {
        name: 'borderStyle',
        type: "React.CSSProperties['borderStyle']",
        defaultValue: 'solid',
        description: 'Outer border style.',
    },
    {name: 'borderWidth', type: 'number', defaultValue: '1', description: 'Outer border width in pixels.'},
    {
        name: 'canRemove',
        type: 'boolean',
        defaultValue: 'onRemove provided',
        description: 'Shows the remove button only when a removal handler is supplied. False hides it.',
    },
    {
        name: 'content',
        type: 'File | FileItem | string',
        defaultValue: 'undefined',
        description: (
            <>
                A raw browser <Code>File</Code>, a <Code>FileItem</Code> containing a file or filename, or clipboard
                text. Raw
                files show previews and metadata without upload status. Use <Code>FileItem</Code> to add upload progress
                or
                errors. Missing content leaves the preview empty.
            </>
        ),
    },
    {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the open and remove actions. The card remains visible.',
    },
    {
        name: 'height',
        type: 'number | string',
        defaultValue: 'derived from size',
        description: 'Preview height only; filename and status rows add to the total card height. Numbers use pixels.',
    },
    {
        name: 'iconGap',
        type: 'number',
        defaultValue: '4',
        description: 'Spacing in the file metadata or upload row, in pixels.',
    },
    {
        name: 'iconSize',
        type: 'number',
        defaultValue: '48',
        description: 'Size of the fallback file-type icon in pixels.',
    },
    {
        name: 'openLabel',
        type: 'string',
        defaultValue: 'Open <original filename>',
        description: 'Accessible name for the optional preview action. Blank values use the contextual default.',
    },
    {
        name: 'padding',
        type: 'number | string',
        defaultValue: '0 var(--spacing-xs)',
        description: 'Exact padding for each information row. Numbers use pixels; CSS shorthands and zero are preserved.',
    },
    {
        name: 'removeLabel',
        type: 'string',
        defaultValue: 'Remove <original filename>',
        description: 'Accessible name for the remove action. Blank values use the contextual default.',
    },
    {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l' | 'xl'",
        defaultValue: 'm',
        description:
            'Card width and preview height: 100, 125, 140, 160, or 180 pixels. Explicit dimensions override each axis.',
    },
    {name: 'textColor', type: 'ColorValue', defaultValue: 'core-text-primary', description: 'Filename color.'},
    {
        name: 'textColorLight',
        type: 'ColorValue',
        defaultValue: 'core-text-secondary',
        description: 'Metadata, upload label, percentage, and spinner color.',
    },
    {
        name: 'textSize',
        type: "'xs' | 's' | 'm' | 'l' | 'xl'",
        defaultValue: 's',
        description: 'Theme body-text size for the filename and information row.',
    },
    {name: 'thumbColor', type: 'ColorValue', defaultValue: 'core-text-primary', description: 'Text preview color.'},
    {
        name: 'thumbPadding',
        type: 'number | string',
        defaultValue: 'var(--spacing-m)',
        description:
            'Exact padding inside text and file-icon previews. Numbers use pixels; CSS strings and zero are supported.',
    },
    {name: 'thumbTextSize', type: 'number', defaultValue: '10', description: 'Text preview font size in pixels.'},
    {
        name: 'width',
        type: 'number | string',
        defaultValue: 'derived from size',
        description: 'Card width. Numbers use pixels; CSS lengths are supported.',
    },
    {
        name: 'divAttributes',
        type: 'React.HTMLAttributes<HTMLDivElement>',
        defaultValue: 'undefined',
        description:
            'Native attributes, class names, styles, and DOM events target the outer card. Inline styles take precedence. Group semantics and ARIA are managed internally; children are not accepted. There is no forwarded ref.',
    },
];

export function AttachmentDoc() {
    return (
        <FlexBox preset={Preset.Column} maxWidth={680} style={{minWidth: 420}}>
            <Path/>
            <H1 id="title">Attachment component</H1>
            <P clipWidth>
                Preview an attached image, clipboard text, or document in a card with its filename and upload status.
            </P>
            <H2 id="usage">Usage</H2>
            <P>
                Pass a raw <Code>File</Code> as <Code>content</Code>, or a string for clipboard text.
                Use <Code>FileItem</Code>
                when you need upload progress or errors. Browser images use a visual preview; other files use their type
                icon.
            </P>
            <ComponentCanvas
                storybookUrl="https://react.slice-uikit.com/?path=/story/components-attachment--text-thumbnail"
                components={[
                    {
                        label: 'Image file',
                        component: <ImageAttachmentPreview/>,
                        code: imageCode.trim(),
                        codeFilename: 'ImageAttachment.tsx',
                    },
                    {
                        label: 'Clipboard text',
                        component: <TextAttachmentPreview/>,
                        code: textCode.trim(),
                        codeFilename: 'TextAttachment.tsx',
                    },
                    {
                        label: 'PDF file',
                        component: <PdfAttachmentPreview/>,
                        code: pdfCode.trim(),
                        codeFilename: 'PdfAttachment.tsx',
                    },
                ]}
            />
            <H3>Sizes</H3>
            <ComponentCanvas
                storybookUrl="https://react.slice-uikit.com/?path=/story/components-attachment--sizes"
                components={[false, true].flatMap((uploading) =>
                    (['xs', 's', 'm', 'l', 'xl'] as const).map((size) => ({
                        label: uploading ? `${size} · Uploading` : size,
                        component: <AttachmentSizePreview size={size} uploading={uploading}/>,
                        code: sizesCode.trim(),
                    })),
                )}
            />
            <H3>Show upload progress</H3>
            <P>
                Update <Code>FileItem.uploading</Code> and <Code>FileItem.progress</Code> from your upload process. The
                spinner
                and label appear at every size. Sizes <Code>m</Code>, <Code>l</Code>, and <Code>xl</Code> also show the
                percentage on the right.
            </P>
            <ComponentCanvas
                storybookUrl="https://react.slice-uikit.com/?path=/story/components-attachment--uploading"
                components={[
                    {label: 'Known progress', component: <UploadAttachmentPreview/>, code: uploadCode.trim()},
                    {label: 'Upload failed', component: <UploadErrorPreview/>, code: errorCode.trim()},
                    {
                        label: 'Unknown progress',
                        component: <UploadAttachmentPreview indeterminate/>,
                        code: indeterminateCode.trim(),
                    },
                ]}
            />
            <H3>Remove or open an attachment</H3>
            <P>
                Handle <Code>onRemove</Code> in your application state. Use <Code>onOpen</Code> when the preview should
                open a
                file; <Code>openFile</Code> and <Code>removeFile</Code> below represent application functions.
            </P>
            <TipBox inline noBorder>
                Hover or focus the card to reveal its remove button. Dismiss it, then reload the page to reset this
                example.
            </TipBox>
            <ComponentCanvas
                storybookUrl="https://react.slice-uikit.com/?path=/story/components-attachment--controlled-removal"
                components={[
                    {
                        label: 'Controlled removal',
                        component: <RemovableAttachmentPreview/>,
                        code: removalCode.trim(),
                        codeFilename: 'RemovableAttachment.tsx',
                    },
                ]}
            />
            <CodeBlock code={actionsCode.trim()}/>
            <H2 id="behavior">Behavior</H2>
            <P>
                Filenames omit the final extension. Multi-part names retain earlier extensions,
                so <Code>archive.tar.gz</Code>{' '}
                displays as <Code>archive.tar</Code>. Strings display as <Code>Clipboard content</Code>, with the first
                250
                characters in the preview. Text files show the same excerpt while keeping their own filename and size.
            </P>
            <P>
                File sizes use 1024-based units, with at most one decimal place: <Code>5 k</Code>, <Code>5 mb</Code>,
                or{' '}
                <Code>5.5 mb</Code>. Cards sized <Code>xs</Code> or <Code>s</Code> show only the file type;
                <Code>m</Code>, <Code>l</Code>, and <Code>xl</Code> also show file size. The accessible description
                retains the
                size at every card size. A filename string has no size because it contains no file data.
            </P>
            <P>
                While <Code>uploading</Code> is true, the upload row replaces file type and size. Progress is rounded
                and
                clamped to 0–100; missing or nonfinite values omit the percentage. Set <Code>uploading</Code> to false
                to
                restore metadata. The percentage sits outside the animated indicator so updates preserve the spinner.
            </P>
            <P>
                The component does not upload, open, download, or remove files itself. A standalone card leaves removal
                available during upload when a removal handler is supplied, unless you hide it
                with <Code>canRemove</Code>.
                <Code>FileItem.error</Code> replaces the preview with an accessible error message, taking precedence
                over upload
                progress. Long messages scroll inside the fixed preview area, keeping the filename and card dimensions
                stable.
                The preview's open action is hidden while an error is shown.
            </P>
            <P>
                For multiple files, <Code>FileList</Code> with <Code>variant="attachments"</Code> adds wrapping, upload
                errors,
                controlled removal, and focus management. Errors stay inside each card’s preview area. The same{' '}
                <Code>File[]</Code> or <Code>FileItem[]</Code> data works with the list; each item can also be passed to
                an
                individual card. Color props accept Slice theme tokens or CSS colors.
            </P>
            <P>
                Images load lazily and stay behind a preview loader until decoded. Text previews show the loader while
                their
                excerpt is read. Failed previews fall back to the file-type icon. Preview loading is separate from
                upload
                progress.
            </P>
            <H2 id="accessibility">Accessibility</H2>
            <P>
                The card is a named group. <Code>attachmentName</Code> overrides the displayed filename, with{' '}
                <Code>Attachment</Code> as the empty-content fallback. Its description includes file type, size, and the
                text
                excerpt when present; decorative previews do not duplicate those details.
            </P>
            <P>
                Open and remove actions are native buttons with Enter/Space activation and visible keyboard focus. Their
                default
                names include the original filename and extension; customize them with <Code>openLabel</Code> and{' '}
                <Code>removeLabel</Code>. Without <Code>onOpen</Code>, the preview is passive.
            </P>
            <P>
                Uploading exposes a named progress bar and its numeric value when known. The spinner respects reduced
                motion. On
                touch devices the remove control remains visible. After removing a standalone card, move focus to the
                next
                attachment or upload control.
            </P>
            <H2 id="props">Props</H2>
            {attachmentProps.map(({name, type, defaultValue, description}) => (
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
            <Definition id="onOpen">
                <Method>onOpen</Method>
                <TypeDef>React.MouseEventHandler&lt;HTMLButtonElement&gt;</TypeDef>
            </Definition>
            <P>
                Adds a button over the preview and receives its click event. Keyboard activation uses the same callback;
                disabled actions do not activate.
            </P>
            <Definition id="onRemove">
                <Method>onRemove</Method>
                <TypeDef>React.MouseEventHandler&lt;HTMLButtonElement&gt;</TypeDef>
            </Definition>
            <P>
                Receives the remove button click. Update your file list or state here. Open and remove clicks stop
                propagation
                to the wrapper.
            </P>
            <Definition id="onToolTip">
                <Method>onToolTip</Method>
                <TypeDef>(tip: ToolTip | null) =&gt; void</TypeDef>
            </Definition>
            <P>
                Connects the remove button to the shared tooltip handler, using its contextual action name. The preview
                uses the
                website’s existing Tip.
            </P>
            <Definition id="nativeEvents">
                <Method>...divEvents</Method>
                <TypeDef>React.HTMLAttributes&lt;HTMLDivElement&gt;</TypeDef>
            </Definition>
            <P>
                Other native events target the outer card. A wrapper click handler alone does not make the preview a
                keyboard
                action; use <Code>onOpen</Code> for that behavior.
            </P>
        </FlexBox>
    );
}

export const trackedItems: TrackedItem[] = [
    {id: 'title', title: 'Attachment component'},
    {id: 'usage', title: 'Usage'},
    {id: 'behavior', title: 'Behavior'},
    {id: 'accessibility', title: 'Accessibility'},
    {
        id: 'props',
        title: 'Props',
        items: attachmentProps.map(({name}) => ({
            id: name,
            title: name === 'divAttributes' ? '...divAttributes' : name,
            code: true,
        })),
    },
    {
        id: 'events',
        title: 'Events',
        items: ['onOpen', 'onRemove', 'onToolTip', 'nativeEvents'].map((id) => ({
            id,
            title: id === 'nativeEvents' ? '...divEvents' : id,
            code: true,
        })),
    },
];
export default AttachmentDoc;

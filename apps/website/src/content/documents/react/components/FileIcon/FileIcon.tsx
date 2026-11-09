import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { CategoriesPreview, FilePreview, SizesPreview } from './FileIconPreview';
import { categoriesCode, sizesCode, usageCode } from './code';

const iconProps = [
	{
		name: 'decorative',
		type: 'boolean',
		defaultValue: 'false',
		description:
			'Hides a passive icon from accessibility APIs when adjacent text already names the file. Clickable icons always remain accessible.',
	},
	{
		name: 'disabled',
		type: 'boolean',
		defaultValue: 'false',
		description:
			'Dims the icon to 50% opacity and blocks activation. Interactive icons leave the tab order and expose aria-disabled.',
	},
	{
		name: 'filename',
		type: 'string | File',
		defaultValue: 'undefined',
		description:
			'Infers artwork from the filename extension or File.name, case-insensitively. MIME type is ignored. Missing and unknown extensions resolve to other.',
	},
	{
		name: 'label',
		type: 'string',
		defaultValue: 'undefined',
		description:
			'Accessible name for the image or action. Takes precedence over aria-label; otherwise a category description is used.',
	},
	{
		name: 'pointer',
		type: 'boolean',
		defaultValue: 'onClick provided',
		description: 'Controls the pointer cursor only. Setting false does not remove keyboard access from an action.',
	},
	{
		name: 'size',
		type: 'number',
		defaultValue: '24',
		description: 'SVG width and height in pixels. Nonfinite or nonpositive sizes fall back to 24.',
	},
	{
		name: 'type',
		type: 'FileIconType',
		defaultValue: 'inferred or other',
		description:
			'Explicit category override. FileIconTypes lists all supported categories; unknown runtime values fall back to other.',
	},
	{
		name: 'svgAttributes',
		type: 'React.SVGAttributes<SVGSVGElement>',
		defaultValue: 'undefined',
		description:
			'Native SVG attributes, className, style, and events are forwarded. Interaction semantics and disabled opacity are managed internally. A ref targets the SVGSVGElement.',
	},
];

export function FileIconDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">FileIcon component</H1>
			<P clipWidth>Identify documents, images, and media with themed file-type artwork.</P>
			<H2 id="usage">Usage</H2>
			<P>
				Pass <Code>filename</Code> as a string or File, then place the icon beside the filename. Hide it from
				accessibility APIs when the text already provides the same information.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-fileicon--default"
				components={[
					{
						label: 'File with an icon',
						component: <FilePreview />,
						code: usageCode.trim(),
						codeFilename: 'ReportFile.tsx',
					},
				]}
			/>
			<H3>Choose a file category</H3>
			<P>
				Available types are <Code>pdf</Code>, <Code>text</Code>, <Code>sheet</Code>, <Code>preso</Code>, <Code>md</Code>
				, <Code>code</Code>, <Code>image</Code>, <Code>audio</Code>, <Code>video</Code>, and <Code>other</Code>.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-fileicon--default"
				components={[
					{
						label: 'File categories',
						component: <CategoriesPreview />,
						code: categoriesCode.trim(),
						codeFilename: 'FileCategories.tsx',
					},
				]}
			/>
			<H3>Set the size</H3>
			<P>
				<Code>size</Code> scales the fixed 20 × 20 artwork uniformly. Colors follow the active light or dark theme;
				there is no dedicated color prop.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-fileicon--default"
				components={[
					{
						label: 'Icon sizes',
						component: <SizesPreview />,
						code: sizesCode.trim(),
						codeFilename: 'FileSizes.tsx',
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				<Code>type</Code> overrides <Code>filename</Code>. Without an override, the extension selects artwork; missing
				or unknown extensions use <Code>other</Code>. Resolution uses <Code>File.name</Code>, never MIME type.
			</P>
			<P>
				The exported <Code>resolveFileIconType(filename)</Code> utility performs the same resolution independently and
				returns a <Code>FileIconType</Code> that can be passed directly to <Code>type</Code>.
			</P>
			<P>
				Supplying <Code>onClick</Code> makes the SVG an action with Enter and Space activation. <Code>pointer</Code>{' '}
				controls only the cursor. Enter activates on keydown; Space activates on release, and blur cancels a pending
				Space activation.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				Passive icons have an image role and a category name. Use <Code>decorative</Code> beside equivalent text, or{' '}
				<Code>label</Code> for a meaningful standalone name. Actions should have a task-specific label.
			</P>
			<P>
				Interactive icons have a visible keyboard focus outline. Disabled actions cannot activate and are removed from
				the tab order. For a larger file action, compose a decorative icon inside a Slice Button as above.
			</P>
			<H2 id="props">Props</H2>
			<P>All props are optional.</P>
			{iconProps.map(({ name, type, defaultValue, description }) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Prop>{name === 'svgAttributes' ? '...svgAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
			<H2 id="events">Events</H2>
			<Definition id="onClick">
				<Method>onClick</Method>
				<TypeDef>(event: React.MouseEvent&lt;SVGSVGElement&gt;) =&gt; void</TypeDef>
			</Definition>
			<P>
				Receives a click event for pointer and keyboard activation. Keyboard clicks have <Code>detail: 0</Code>.
				Disabled icons do not call it.
			</P>
			<Definition id="nativeEvents">
				<Method>...svgEvents</Method>
				<TypeDef>React.SVGAttributes&lt;SVGSVGElement&gt;</TypeDef>
			</Definition>
			<P>
				Native handlers are composed with internal behavior. Calling <Code>preventDefault()</Code> in{' '}
				<Code>onKeyDown</Code> or <Code>onKeyUp</Code> cancels the corresponding keyboard activation.
			</P>
		</FlexDiv>
	);
}

export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'FileIcon component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: iconProps.map(({ name }) => ({
			id: name,
			title: name === 'svgAttributes' ? '...svgAttributes' : name,
			code: true,
		})),
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'nativeEvents', title: '...svgEvents', code: true },
		],
	},
];
export default FileIconDoc;

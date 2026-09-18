import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import {
	runUploadAreaBusyGuardsPlay,
	runUploadAreaDragWithoutFilesPlay,
	runUploadAreaKeyboardAndFileInputPlay,
	runUploadAreaNestedDragDepthPlay,
	runUploadAreaPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';
import { UploadArea } from './UploadArea';
import { allTypes } from './_types';

const uploadFiles = [
	{ file: 'document.doc' },
	{ file: 'spreadsheet.xls', uploading: true, progress: 0 },
	{ file: 'markdown.md', uploading: true, progress: 0.82 },
	{ file: 'pdf.pdf', error: 'Upload failed' },
];

const meta: Meta<typeof UploadArea> = {
	title: 'Components/UploadArea',
	component: UploadArea,
	args: {
		icon: 'upload',
		iconColor: undefined,
		iconColorHover: undefined,
		width: '100%',
		height: 'auto',
		title: 'Upload Files',
		message: 'Drag and drop files here or click to upload',
		busyMessage: 'Uploading in progress',
		iconSize: 24,
		textSize: 'm',
		border: 1,
		borderStyle: 'dashed',
		borderColor: undefined,
		borderColorHover: undefined,
		radius: 8,
		padding: 32,
		acceptedTypes: allTypes,
		multiple: true,
		busy: false,
		canRemove: false,
		files: [],
		showProgress: false,
		onUpload: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof UploadArea> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				<UploadArea {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runUploadAreaPlay({ canvasElement, args });
	},
};

export const Busy: StoryObj<typeof UploadArea> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				<UploadArea {...args} files={uploadFiles} busy={true} />
			</FlexDiv>
		);
	},
};

// *** TESTS ONLY *** //
export const KeyboardAndFileInputActivation: StoryObj<typeof UploadArea> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				<UploadArea {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runUploadAreaKeyboardAndFileInputPlay({ canvasElement, args });
	},
};

export const BusyGuards: StoryObj<typeof UploadArea> = {
	tags: ['tests'],
	args: { busy: true, showProgress: true },
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				<UploadArea {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runUploadAreaBusyGuardsPlay({ canvasElement, args });
	},
};

export const DragWithoutFiles: StoryObj<typeof UploadArea> = {
	tags: ['tests'],
	render: (args) => {
		// `acceptedTypes` is a destructured default parameter in UploadArea.tsx
		// (`acceptedTypes = allTypes`), so passing `undefined` - whether via
		// Storybook's own args merge (which also doesn't let an explicit
		// undefined override a defined meta default) or directly here - is
		// indistinguishable from omitting the prop entirely; the component's
		// own default reinstates `allTypes` either way. `null` is the only
		// falsy value that actually bypasses a default parameter.
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				<UploadArea {...args} acceptedTypes={null as unknown as string[]} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runUploadAreaDragWithoutFilesPlay({ canvasElement, args });
	},
};

export const NestedDragDepth: StoryObj<typeof UploadArea> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				<UploadArea {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runUploadAreaNestedDragDepthPlay({ canvasElement });
	},
};

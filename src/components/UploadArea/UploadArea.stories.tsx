import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
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
		bgColor: undefined,
		bgColorHover: undefined,
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

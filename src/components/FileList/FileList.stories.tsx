import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { fn } from 'storybook/test';
import { FileList } from './FileList';

const meta: Meta<typeof FileList> = {
	title: 'Components/FileList',
	component: FileList,
	args: {
		files: [
			{ file: 'document.doc' },
			{ file: 'presentation.ppt' },
			{ file: 'spreadsheet.xls', uploading: true, progress: 0.35 },
			{ file: 'image.png' },
			{ file: 'markdown.md', uploading: true, progress: 0.82 },
			{ file: 'pdf.pdf', error: 'Upload failed' },
			{ file: 'video.mp4' },
			{ file: 'audio.mp3' },
		],
		textSize: 's',
		maxWidth: undefined,
		minWidth: undefined,
		direction: 'row',
		padding: undefined,
		gap: 8,
		iconSize: 24,
		onChange: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof FileList> = {
	render: (args) => {
		return (
			<FlexDiv
				justify={'center'}
				align={'center'}
				padding={'0px 64px'}
				style={{ overflow: 'hidden' }}
				width={'fill'}
				height={'viewport'}
			>
				<FileList {...args} />
			</FlexDiv>
		);
	},
};

import { Attachment } from '../../src/components/Attachment';
/**
 * Centralized benchmark configurations
 * Import configs directly without executing bench() calls
 */

import React from 'react';
import {
	Avatar,
	AvatarGroup,
	Badge,
	AudioBubble,
	Camera,
	CheckBox,
	ContentEditable,
	DoneCheck,
	Dot,
	DraggablePanel,
	DropDown,
	ErrorSummary,
	FileIcon,
	FlexBox,
	Icon,
	IconButton,
	AudioLevel,
	DialogBox,
	ModalController,
	PopMenuController,
	PopMenuGroup,
	Overlay,
	Pager,
	ProgressIndicator,
	RadioButton,
	RadioButtonList,
	Slider,
	Spacer,
	Switch,
	TabBar,
	Tab,
	TextArea,
	TextField,
	Tip,
	Toast,
	ToggleButton,
	UploadArea,
	Video,
	VideoController,
	Button,
	ButtonBar,
	Chip,
	DataTable,
	createColumnHelper,
} from '../../src';
import { videoActions } from '../../src/stores/video';
import { modalActions } from '../../src/stores/modal';
import { FileList } from '../../src/components/FileList';
import { PromptInput } from '../../src/components/PromptInput/PromptInput';
import { fireEvent } from '@testing-library/react';
import {
	measureMountTime,
	measureRerenderTime,
	measureMemoryDelta,
	measureEventResponseTime,
	type ComponentBenchmarkConfig,
} from '../utils/benchmark';

export const avatarConfig: ComponentBenchmarkConfig = {
	componentName: 'Avatar',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Avatar name="John Doe" size={34} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Avatar name="John Doe" size={34} />,
					(container) => {
						container.rerender(<Avatar name="Jane Smith" size={34} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Avatar name="John Doe" />, 10),
		},
	],
};

const mockAvatars = [
	{ first: 'John', last: 'Doe', email: 'john@example.com' },
	{ first: 'Jane', last: 'Smith', email: 'jane@example.com' },
	{ first: 'Bob', last: 'Johnson', email: 'bob@example.com' },
];

const mockErrors = [
	{ id: '1', title: '1', message: ['one'] },
	{ id: '2', title: '2', message: ['one', 'two'] },
	{ id: '3', title: '3', message: ['one'] },
];

export const avatarGroupConfig: ComponentBenchmarkConfig = {
	componentName: 'AvatarGroup',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<AvatarGroup avatars={mockAvatars} />, 50),
		},
  {
   name: 'Children Mount Time',
   type: 'mount',
   fn: () => measureMountTime(<AvatarGroup>{mockAvatars.map((avatar) => <Avatar key={avatar.email} name={`${avatar.first} ${avatar.last}`} />)}</AvatarGroup>, 50),
  },
  {
   name: 'Limited Mount Time',
   type: 'mount',
   fn: () => measureMountTime(<AvatarGroup avatars={mockAvatars} limit={1} backgroundColor="core-surface-tertiary" onMore={() => {}} />, 50),
  },
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<AvatarGroup avatars={mockAvatars} />,
					(container) => {
						const updatedAvatars = [
							...mockAvatars,
							{ first: 'New', last: 'User', email: 'new@example.com' },
						];
						container.rerender(<AvatarGroup avatars={updatedAvatars} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<AvatarGroup avatars={mockAvatars} />, 10),
		},
	],
};

export const badgeConfig: ComponentBenchmarkConfig = {
	componentName: 'Badge',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Badge count={5} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Badge count={5} />,
					(container) => {
						container.rerender(<Badge count={99} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Badge count={42} />, 10),
		},
	],
};

export const audioBubbleConfig: ComponentBenchmarkConfig = {
	componentName: 'AudioBubble',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<AudioBubble size={64} playing={false} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<AudioBubble size={64} playing={false} />,
					(container) => {
						container.rerender(<AudioBubble size={72} playing={false} glow={false} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<AudioBubble size={64} />, 10),
		},
	],
};

export const cameraConfig: ComponentBenchmarkConfig = {
	componentName: 'Camera',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Camera
						width={320}
						height={240}
						startCameraOff
						userProfile={{ first: 'Jane', last: 'Appleseed' }}
					/>,
					25,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Camera
						width={320}
						height={240}
						startCameraOff
						userProfile={{ first: 'Jane', last: 'Appleseed' }}
					/>,
					(container) => {
						container.rerender(
							<Camera
								width={360}
								height={280}
								startCameraOff
								showControlBar={false}
								userProfile={{ first: 'John', last: 'Doe' }}
							/>,
						);
					},
					25,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<Camera width={320} height={240} startCameraOff pipSnapshot={false} />,
					10,
				),
		},
	],
};

export const checkBoxConfig: ComponentBenchmarkConfig = {
	componentName: 'CheckBox',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<CheckBox />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<CheckBox checked={false} />,
					(container) => {
						container.rerender(<CheckBox checked={true} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<CheckBox onChange={() => {}} />,
					(container) => {
						const checkbox = container.container.querySelector('[class*="wrapper"]');
						if (checkbox) fireEvent.click(checkbox);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<CheckBox label="Test" checked />, 10),
		},
	],
};

export const flexBoxConfig: ComponentBenchmarkConfig = {
	componentName: 'FlexBox',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<FlexBox>
						<div>Child 1</div>
						<div>Child 2</div>
					</FlexBox>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<FlexBox direction="column">
						<div>Child 1</div>
						<div>Child 2</div>
					</FlexBox>,
					(container) => {
						container.rerender(
							<FlexBox direction="row">
								<div>Child 1</div>
								<div>Child 2</div>
							</FlexBox>,
						);
					},
					50,
				),
		},
	],
};

export const audioLevelConfig: ComponentBenchmarkConfig = {
	componentName: 'AudioLevel',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<AudioLevel width={120} height={6} playing={false} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<AudioLevel width={120} height={6} playing={false} />,
					(container) => {
						container.rerender(
							<AudioLevel width={140} height={8} playing={false} barCount={8} />,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<AudioLevel width={120} height={6} />, 10),
		},
	],
};

export const dialogBoxConfig: ComponentBenchmarkConfig = {
	componentName: 'DialogBox',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
                    <DialogBox>
                        <DialogBox.Title>Benchmark DialogBox</DialogBox.Title>
                        <DialogBox.Content><div>DialogBox body content</div></DialogBox.Content>
                        <DialogBox.Actions><Button label="Confirm" /></DialogBox.Actions>
					</DialogBox>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DialogBox
						title="Benchmark DialogBox"
						actions={[{ id: 'confirm', label: 'Confirm', primary: true }]}
					>
						<div>DialogBox body content</div>
					</DialogBox>,
					(container) => {
						container.rerender(
							<DialogBox
								title="Updated DialogBox"
								actions={[
									{ id: 'cancel', label: 'Cancel' },
									{ id: 'confirm', label: 'Confirm', primary: true },
								]}
							>
								<div>Updated modal body content</div>
							</DialogBox>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<DialogBox title="Benchmark DialogBox">
						<div>DialogBox body content</div>
					</DialogBox>,
					10,
				),
		},
	],
};

export const popMenuGroupConfig: ComponentBenchmarkConfig = {
	componentName: 'PopMenuGroup',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<PopMenuGroup title="Actions" items={[{ label: 'Edit' }]} />, 50),
		},
		{
			name: 'Typed item action',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<PopMenuGroup
						title="Documents"
						items={[
							{
								id: 'open',
								label: 'Open document',
								data: { documentId: 'doc-42' },
								onClick: (_event, item) => {
									void item.data?.documentId;
								},
							},
						]}
						onClickItem={(_event, item) => {
							void item.data?.documentId;
						}}
					/>,
					(container) => fireEvent.click(container.getByRole('menuitem', { name: 'Open document' })),
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<PopMenuGroup title="Actions" items={[{ label: 'Edit' }]} />, 10),
		},
	],
};

export const popMenuControllerConfig: ComponentBenchmarkConfig = {
	componentName: 'PopMenuController',
	tests: [
		{ name: 'Mount Time', type: 'mount', fn: () => measureMountTime(<PopMenuController />, 50) },
		{ name: 'Memory', type: 'memory', fn: () => measureMemoryDelta(<PopMenuController />, 10) },
	],
};

function ModalReplacementBenchmark() {
	React.useEffect(() => {
		modalActions.show({
			component: DialogBox,
			id: 'benchmark',
			props: {
				title: 'First dialog',
				children: (
					<button
						type="button"
						onClick={() =>
							modalActions.show({ component: DialogBox, id: 'benchmark', props: { title: 'Next dialog' } })
						}
					>
						Replace benchmark dialog
					</button>
				),
			},
		});
		return () => modalActions.clear();
	}, []);
	return <ModalController draggable={false} transition={{ duration: 0 }} />;
}

export const modalControllerConfig: ComponentBenchmarkConfig = {
	componentName: 'ModalController',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<ModalController draggable={false} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ModalController draggable={false} overlayOpacity={0.5} />,
					(container) => {
						container.rerender(<ModalController draggable={true} overlayOpacity={0.8} />);
					},
					50,
				),
		},
		{
			name: 'Replace active dialog',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<ModalReplacementBenchmark />,
					(container) => fireEvent.click(container.getByRole('button', { name: 'Replace benchmark dialog' })),
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<ModalController draggable={false} />, 10),
		},
	],
};

export const toggleButtonConfig: ComponentBenchmarkConfig = {
	componentName: 'ToggleButton',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<ToggleButton label="Toggle" icon="basic.check" selected={false} />,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ToggleButton label="Toggle" icon="basic.check" selected={false} />,
					(container) => {
						container.rerender(
							<ToggleButton label="Toggle On" icon="basic.check" selected={true} />,
						);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<ToggleButton label="Toggle" icon="basic.check" onChange={() => {}} />,
					(container) => {
						const button = container.container.querySelector('button');
						if (button) fireEvent.click(button);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<ToggleButton label="Toggle" icon="basic.check" selected={false} />,
					10,
				),
		},
	],
};

export const uploadAreaConfig: ComponentBenchmarkConfig = {
	componentName: 'UploadArea',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<UploadArea
						title="Upload Files"
						message="Drop files here"
						acceptedTypes={['pdf', 'image/*']}
						showProgress={false}
					/>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<UploadArea
						title="Upload Files"
						message="Drop files here"
						acceptedTypes={['pdf', 'image/*']}
						showProgress={false}
					/>,
					(container) => {
						container.rerender(
							<UploadArea
								title="Upload Images"
								fileListProps={{ variant: 'attachments', attachmentSize: 's' }}
								message="Click to upload"
								busy
								files={[{ id: 'report', file: 'report.pdf', uploading: true, progress: 45 }]}
								multiple={false}
								showProgress={false}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<UploadArea title="Upload Files" message="Drop files here" acceptedTypes={['pdf', 'image/*']} />,
					10,
				),
		},
	],
};
function VideoControllerBenchmark({ padding = 64 }: { padding?: number }) {
	React.useEffect(() => {
		videoActions.show({ component: Video, props: { width: 320, height: 180, playing: false } });
		return () => videoActions.clear();
	}, []);
	return <VideoController draggable={false} padding={padding} transition={{ duration: 0 }} />;
}
export const videoControllerConfig: ComponentBenchmarkConfig = {
	componentName: 'VideoController',
	tests: [
		{ name: 'Mount Time', type: 'mount', fn: () => measureMountTime(<VideoControllerBenchmark />, 10) },
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<VideoControllerBenchmark />,
					(container) => {
						container.rerender(<VideoControllerBenchmark padding={32} />);
					},
					10,
				),
		},
	],
};

export const videoConfig: ComponentBenchmarkConfig = {
	componentName: 'Video',
	tests: [
		{
			name: 'Render Function Controls',
			type: 'mount',
			fn: () => measureMountTime(<Video controls="custom" showProgressIndicator={false}>{({playing, toggleMute}) => <Button onClick={toggleMute}>{playing ? 'Playing' : 'Paused'}</Button>}</Video>, 25),
		},
		{
			name: 'Explicit Play Only',
			type: 'mount',
			fn: () => measureMountTime(<Video width={320} height={180} controls="default" customControls={{ play: true }} showProgressIndicator={false} />, 25),
		},
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Video
						src="https://example.com/video.mp4"
						width={320}
						height={180}
						controls="simple"
						muted
					/>,
					25,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Video
						src="https://example.com/video.mp4"
						width={320}
						height={180}
						controls="simple"
						muted
						playing={false}
					/>,
					(container) => {
						container.rerender(
							<Video
								src="https://example.com/video.mp4"
								width={360}
								height={200}
								controls="simple"
								muted={false}
								playing={true}
								objectFit="cover"
							/>,
						);
					},
					25,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<Video
						src="https://example.com/video.mp4"
						width={320}
						height={180}
						controls="none"
						muted
					/>,
					10,
				),
		},
	],
};

export const iconConfig: ComponentBenchmarkConfig = {
	componentName: 'Icon',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Icon name="basic.home" size={22} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Icon name="basic.home" size={22} />,
					(container) => {
						container.rerender(<Icon name="basic.search" size={22} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Icon name="basic.home" />, 10),
		},
	],
};

export const fileIconConfig: ComponentBenchmarkConfig = {
	componentName: 'FileIcon',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<FileIcon filename="report.PDF" size={24} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<FileIcon filename="report.PDF" size={24} />,
					(container) => {
						container.rerender(<FileIcon filename="report.XLSX" size={24} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<FileIcon filename="photo.webp" size={24} />, 10),
		},
	],
};

export const attachmentConfig: ComponentBenchmarkConfig = {
	componentName: 'Attachment',
	tests: [
		{
			name: 'Upload Error',
			type: 'mount',
			fn: () => measureMountTime(<Attachment content={{file: 'report.pdf', error: 'Upload failed. Please try again.'}} />, 50),
		},
		{
			name: 'Text Preview Setup',
			type: 'mount',
			fn: () => measureMountTime(
				<Attachment content={{file: new File(['Preview text for an uploaded document.'], 'notes.txt', {type: 'text/plain'})}} />,
				50,
			),
		},
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Attachment content="Clipboard preview" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () => measureRerenderTime(
				<Attachment content={{file: 'report.pdf', uploading: true, progress: 25}} />,
				(container) => {
					container.rerender(<Attachment content={{file: 'report.pdf', uploading: true, progress: 75}} />);
				},
				50,
			),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Attachment content="Clipboard preview" />, 10),
		},
	],
};

export const fileListConfig: ComponentBenchmarkConfig = {
	componentName: 'FileList',
	tests: [
        {
            name: 'Raw Files',
            type: 'mount',
            fn: () => measureMountTime(<FileList files={[new File(['pdf'], 'report.pdf')]} />, 50),
        },
		{
			name: 'Attachment Cards',
			type: 'mount',
			fn: () => measureMountTime(
				<FileList variant="attachments" files={[{id: 'report', file: 'report.pdf'}, {id: 'upload', file: 'notes.md', uploading: true, progress: 45}]} />,
				50,
			),
		},
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<FileList files={[{ id: 'document', file: 'document.pdf' }, { id: 'notes', file: 'notes.txt' }]} />,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<FileList files={[{ id: 'document', file: 'document.pdf' }, { id: 'notes', file: 'notes.txt' }]} />,
					(container) => {
						container.rerender(
							<FileList
								files={[
									{ id: 'document', file: 'document.pdf', uploading: true, progress: 50 },
									{ id: 'notes', file: 'notes.txt', error: 'Upload failed' },
								]}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<FileList files={[{ id: 'document', file: 'document.pdf' }, { id: 'notes', file: 'notes.txt' }]} />,
					10,
				),
		},
	],
};

export const switchConfig: ComponentBenchmarkConfig = {
	componentName: 'Switch',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Switch />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Switch checked={false} />,
					(container) => {
						container.rerender(<Switch checked={true} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Switch onChange={() => {}} />,
					(container) => {
						const switchEl = container.container.querySelector('[class*="wrapper"]');
						if (switchEl) fireEvent.click(switchEl);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Switch state />, 10),
		},
	],
};

export const textFieldConfig: ComponentBenchmarkConfig = {
	componentName: 'TextField',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<TextField />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<TextField value="Initial" />,
					(container) => {
						container.rerender(<TextField value="Updated text" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<TextField onFocus={() => {}} />,
					(container) => {
						const input = container.container.querySelector('input');
						if (input) fireEvent.focus(input);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<TextField value="Test" />, 10),
		},
	],
};

export const buttonConfig: ComponentBenchmarkConfig = {
	componentName: 'Button',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Button label="Click Me" />, 50),
		},
		{
			name: 'State Change Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Button label="Button" state="normal" />,
					(container) => {
						container.rerender(<Button label="Button" state="disabled" />);
					},
					50,
				),
		},
		{
			name: 'Click Event',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Button label="Click" onClick={() => {}} />,
					(container) => {
						const button = container.container.querySelector('[class*="button"]');
						if (button) fireEvent.click(button);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(<Button label="Test" iconLeft="basic.check" count={5} />, 10),
		},
	],
};

const mockButtons = [
	{ icon: 'basic.check', tip: 'check' },
	{ icon: 'close', tip: 'close' },
	{ icon: 'trash', tip: 'delete' },
];

export const buttonBarConfig: ComponentBenchmarkConfig = {
	componentName: 'ButtonBar',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<ButtonBar buttons={mockButtons} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ButtonBar buttons={mockButtons} />,
					(container) => {
						const updatedButtons = [...mockButtons, { icon: 'basic.plus', tip:'plus' }];
						container.rerender(<ButtonBar buttons={updatedButtons} buttonSize="l" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<ButtonBar buttons={mockButtons} onChange={() => {}} />,
					(container) => {
						const button = container.container.querySelector('button');
						if (button) fireEvent.click(button);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<ButtonBar buttons={mockButtons} />, 10),
		},
	],
};

export const chipConfig: ComponentBenchmarkConfig = {
	componentName: 'Chip',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Chip label="Chip" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Chip label="Initial" />,
					(container) => {
						container.rerender(<Chip label="Updated" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Chip label="Chip" onRemove={() => {}} />,
					(container) => {
						const chip = container.getByRole('button', { name: 'Remove Chip' });
						if (chip) fireEvent.click(chip);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Chip label="Chip" icon="basic.check" />, 10),
		},
	],
};

export const contentEditableConfig: ComponentBenchmarkConfig = {
	componentName: 'ContentEditable',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<p>Project: <ContentEditable value="Test" /></p>, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<div style={{ display: 'flex', flexDirection: 'column', width: 360 }}>
						<ContentEditable value="Short title" />
					</div>,
					(container) => {
						container.rerender(
							<div style={{ display: 'flex', flexDirection: 'column', width: 360 }}>
								<ContentEditable value="A longer project title that wraps within the available space" />
							</div>,
						);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<ContentEditable isEditable value="Test" onFocus={() => {}} />,
					(container) => {
						const input = container.container.querySelector('[role="textbox"]');
						if (input) fireEvent.focus(input);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<ContentEditable value="Test Input" isEditable />, 10),
		},
	],
};

export const dotConfig: ComponentBenchmarkConfig = {
	componentName: 'Dot',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Dot state={"green"} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Dot state={"green"} />,
					(container) => {
						container.rerender(<Dot state={"blue"} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Dot size={10} state={"green"} />, 10),
		},
	],
};

export const draggablePanelConfig: ComponentBenchmarkConfig = {
	componentName: 'DraggablePanel',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<DraggablePanel drags="right" isClosed={false} sizeConstraints={{min:100, max:0.9, initial:250}}>
						<div>Panel Content</div>
					</DraggablePanel>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DraggablePanel drags="right" isClosed={false} sizeConstraints={{min:100, max:0.9, initial:250}}>
						<div>Content</div>
					</DraggablePanel>,
					(container) => {
						container.rerender(
							<DraggablePanel drags="right" isClosed={true} sizeConstraints={{min:100, max:0.9, initial:250}}>
								<div>Content</div>
							</DraggablePanel>,
						);
					},
					50,
				),
		},
        {
            name: 'Event Response',
            type: 'event',
            fn: () => measureEventResponseTime(
                <DraggablePanel isClosed={false} sizeConstraints={{initial:250,min:100,max:500}} />,
                (container) => {
                    const rail = container.container.querySelector('[role="separator"]');
                    if (rail) fireEvent.keyDown(rail, {key:'ArrowRight'});
                },
                50,
            ),
        },
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<DraggablePanel drags="right" isClosed={false} sizeConstraints={{min:100, max:0.9, initial:250}}>
						<div>Panel Content</div>
					</DraggablePanel>,
					10,
				),
		},
	],
};

const mockDropDownOptions = [
	{ label: 'Option 1', value: '1' },
	{ label: 'Option 2', value: '2' },
	{ label: 'Option 3', value: '3' },
];

export const dropDownConfig: ComponentBenchmarkConfig = {
	componentName: 'DropDown',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<DropDown options={mockDropDownOptions} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DropDown options={mockDropDownOptions} value="1" />,
					(container) => {
						container.rerender(<DropDown options={mockDropDownOptions} value="2" />);
					},
					50,
				),
		},
		{
			name: 'Appearing label selection',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DropDown options={mockDropDownOptions} value="1" label="Status" variant="stacked" behavior="appear" />,
					(container) => container.rerender(<DropDown options={mockDropDownOptions} value="2" label="Status" variant="stacked" behavior="appear" />),
					50,
				),
		},
		{
			name: 'Native option composition',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<DropDown name="status" inputName="Status">
						<option value="">-- Choose a status</option>
						<option value="active">In progress</option>
						<option value="complete">Complete</option>
					</DropDown>,
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<DropDown options={mockDropDownOptions} onChange={() => {}} />,
					(container) => {
						const select = container.container.querySelector('select');
						if (select) fireEvent.change(select, { target: { value: '2' } });
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<DropDown options={mockDropDownOptions} />, 10),
		},
	],
};

type MockDataTableRow = {
	id: string;
	name: string;
	age: number;
	amount: number;
};

const mockDataTableRows: MockDataTableRow[] = Array.from({ length: 10 }, (_, i) => ({
	id: `row-${i}`,
	name: `Person ${i}`,
	age: 20 + i,
	amount: 1000 * (i + 1),
}));

const mockDataTableColumnHelper = createColumnHelper<MockDataTableRow>();
const mockDataTableColumns = [
	mockDataTableColumnHelper.accessor((row) => row.name, {
		id: 'name',
		title: 'Name',
	}),
	mockDataTableColumnHelper.accessor((row) => row.age, {
		id: 'age',
		title: 'Age',
		align: 'end',
	}),
	mockDataTableColumnHelper.accessor((row) => row.amount, {
		id: 'amount',
		title: 'Amount',
		align: 'end',
		renderCell: ({ value }) => <span>${value.toLocaleString()}</span>,
	}),
];

export const dataTableConfig: ComponentBenchmarkConfig = {
	componentName: 'DataTable',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<DataTable
						columnDefinitions={mockDataTableColumns}
						tableData={mockDataTableRows}
						getRowId={(row) => row.id}
                        onRowClick={() => {}}
					/>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DataTable
						columnDefinitions={mockDataTableColumns}
						tableData={mockDataTableRows}
						getRowId={(row) => row.id}
                        onRowClick={() => {}}
					/>,
					(container) => {
						container.rerender(
							<DataTable
								columnDefinitions={mockDataTableColumns}
								tableData={[...mockDataTableRows].reverse()}
								getRowId={(row) => row.id}
                        onRowClick={() => {}}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<DataTable
						columnDefinitions={mockDataTableColumns}
						tableData={mockDataTableRows}
						getRowId={(row) => row.id}
                        onRowClick={() => {}}
					/>,
					10,
				),
		},
	],
};

export const errorSummaryConfig: ComponentBenchmarkConfig = {
	componentName: 'ErrorSummary',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<ErrorSummary entries={mockErrors} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ErrorSummary entries={[]} />,
					(container) => {
						container.rerender(
							<ErrorSummary
								entries={[...mockErrors, { id: '4', title: 'Another field needs attention', message: ['Add a value to continue.'], fieldName: 'project' }]}
								motionValues={{ initial: { y: -8 }, animate: { y: 0 }, exit: { y: -8 } }}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<ErrorSummary entries={mockErrors} />, 10),
		},
	],
};

export const iconButtonConfig: ComponentBenchmarkConfig = {
	componentName: 'IconButton',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<IconButton actionName="Confirm" icon="basic.check" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<IconButton actionName="Confirm" icon="basic.check" />,
					(container) => {
						container.rerender(<IconButton actionName="Close" icon="basic.cross" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<IconButton actionName="Save" icon="save" onClick={() => {}} />,
					(container) => {
						const button = container.container.querySelector('button');
						if (button) fireEvent.click(button);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<IconButton actionName="Confirm" icon="basic.check" />, 10),
		},
	],
};

export const promptInputConfig: ComponentBenchmarkConfig = {
	componentName: 'PromptInput',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(<PromptInput value="Test prompt" onSubmit={() => {}} pasteAttachmentThreshold={1000} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<PromptInput value="Initial prompt" onSubmit={() => {}} />,
					(container) => {
						container.rerender(
							<PromptInput
								value="Updated prompt"
								working
								stopEnabled
								pasteAttachmentThreshold={1000}
								attachments={[{ id: 'report', file: 'report.pdf' }]}
								fileListProps={{ variant: 'attachments', attachmentSize: 's' }}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<PromptInput value="Memory benchmark prompt" />, 10),
		},
	],
};
export const overlayConfig: ComponentBenchmarkConfig = {
	componentName: 'Overlay',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Overlay show opacity={0} transition={{ duration: 0 }} />,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Overlay show={false} />,
					(container) => {
						container.rerender(
							<Overlay show opacity={0.5} transition={{ duration: 0 }} />,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<Overlay show opacity={0} transition={{ duration: 0 }} />,
					10,
				),
		},
	],
};

export const pagerConfig: ComponentBenchmarkConfig = {
	componentName: 'Pager',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Pager pages={15} selectedIndex={1} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Pager pages={15} selectedIndex={1} />,
					(container) => {
						container.rerender(<Pager pages={15} selectedIndex={10} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Pager pages={15} selectedIndex={1} onChange={() => {}} />,
					(container) => {
						const nextButton = container.container.querySelector('button[aria-label="Page 3 of 15"]');
						if (nextButton) fireEvent.click(nextButton);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Pager pages={15} selectedIndex={1} />, 10),
		},
	],
};

export const doneCheckConfig: ComponentBenchmarkConfig = {
	componentName: 'DoneCheck',
	tests: [
		{ name: 'Mount Time', type: 'mount', fn: () => measureMountTime(<DoneCheck play={false} />, 50) },
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DoneCheck play={false} size={24} />,
					(container) => {
						container.rerender(<DoneCheck play={false} size={48} statusLabel="Saved" />);
					},
					50,
				),
		},
	],
};

export const progressConfig: ComponentBenchmarkConfig = {
	componentName: 'ProgressIndicator',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<ProgressIndicator show inline decorative size={20} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ProgressIndicator
						show
						inline
						decorative
						displayLabel
						label="Loading files"
						labelPosition="left"
						size={20}
					/>,
					(container) => {
						container.rerender(
							<ProgressIndicator
								show
								inline
								decorative
								displayLabel
								label="Loading files"
								labelPosition="right"
								size={64}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<ProgressIndicator show inline decorative size={20} />, 10),
		},
	],
};

export const radioButtonConfig: ComponentBenchmarkConfig = {
	componentName: 'RadioButton',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<RadioButton label="Option" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<RadioButton label="Option" checked={false} />,
					(container) => {
						container.rerender(<RadioButton label="Option" checked={true} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<RadioButton label="Option" onChange={() => {}} />,
					(container) => {
						const radio = container.container.querySelector('[class*="wrapper"]');
						if (radio) fireEvent.click(radio);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<RadioButton label="Option" />, 10),
		},
	],
};

const mockRadios = [{label:'Monthly',value:'monthly'},{label:'Annual',value:'annual'}];
export const radioButtonListConfig: ComponentBenchmarkConfig = {
	componentName: 'RadioButtonList',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<RadioButtonList options={mockRadios} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<RadioButtonList options={mockRadios} value="monthly" />,
					(container) => {
						container.rerender(<RadioButtonList options={mockRadios} value="annual" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<RadioButtonList options={mockRadios} onChange={() => {}} />,
					(container) => {
						const firstRadio = container.container.querySelector('input[type="radio"]');
						if (firstRadio) fireEvent.click(firstRadio);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<RadioButtonList options={mockRadios} />, 10),
		},
	],
};

export const sliderConfig: ComponentBenchmarkConfig = {
	componentName: 'Slider',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Slider value={50} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Slider value={25} />,
					(container) => {
						container.rerender(<Slider value={75} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Slider onChange={() => {}} />,
					(container) => {
						const slider = container.container.querySelector('input[type="range"]');
						if (slider) fireEvent.input(slider, { target: { value: '50' } });
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Slider value={50} />, 10),
		},
	],
};

export const spacerConfig: ComponentBenchmarkConfig = {
	componentName: 'Spacer',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Spacer />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Spacer size={10} />,
					(container) => {
						container.rerender(<Spacer size={30} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Spacer size={20} />, 10),
		},
	],
};

const mockTabBarTabs = [
	{ label: 'Tab 1', value: '1' },
	{ label: 'Tab 2', value: '2' },
	{ label: 'Tab 3', value: '3' },
];

function TabBenchmark({ label = 'Details' }: { label?: string }) {
	return <TabBar tabBarName="Benchmark views" defaultValue="overview"><Tab value="overview" label="Overview" /><Tab value="details" label={label} /></TabBar>;
}
export const tabConfig: ComponentBenchmarkConfig = {
	componentName: 'Tab',
	tests: [
		{ name: 'Mount Time', type: 'mount', fn: () => measureMountTime(<TabBenchmark />, 50) },
		{ name: 'Re-render', type: 'rerender', fn: () => measureRerenderTime(<TabBenchmark />, container => container.rerender(<TabBenchmark label="Updated details" />), 50) },
		{ name: 'Event Response', type: 'event', fn: () => measureEventResponseTime(<TabBenchmark />, container => { const tab = container.container.querySelectorAll('[role="tab"]')[1]; if (tab) fireEvent.click(tab); }, 50) },
		{ name: 'Memory', type: 'memory', fn: () => measureMemoryDelta(<TabBenchmark />, 10) },
	],
};

export const tabBarConfig: ComponentBenchmarkConfig = {
	componentName: 'TabBar',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<TabBar options={mockTabBarTabs} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<TabBar options={mockTabBarTabs} value="1" />,
					(container) => {
						container.rerender(<TabBar options={mockTabBarTabs} value="2" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<TabBar options={mockTabBarTabs} onChange={() => {}} />,
					(container) => {
						const tab = container.container.querySelector('[role="tab"]');
						if (tab) fireEvent.click(tab);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<TabBar options={mockTabBarTabs} />, 10),
		},
	],
};

export const textAreaConfig: ComponentBenchmarkConfig = {
	componentName: 'TextArea',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<TextArea />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<TextArea value="Initial text" />,
					(container) => {
						container.rerender(<TextArea value="Updated text content" />);
					},
					50,
				),
		},
		{
			name: 'Capped auto-grow',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<TextArea value="Short note" rows={2} maxHeight={200} />,
					(container) => container.rerender(<TextArea value={'Longer note\n'.repeat(20)} rows={2} maxHeight={200} />),
					50,
				),
		},
		{
			name: 'Fixed height with send action',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<TextArea height={180} showSendButton defaultValue="Ready to send" onSubmit={() => {}} />,
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<TextArea onFocus={() => {}} />,
					(container) => {
						const textarea = container.container.querySelector('textarea');
						if (textarea) fireEvent.focus(textarea);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<TextArea value="Test content" />, 10),
		},
	],
};

export const tipConfig: ComponentBenchmarkConfig = {
	componentName: 'Tip',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Tip
						tip={{ payload: { label: 'Helpful tip' } }}
						coords={{ x: 120, y: 80 }}
						showDelay={60000}
						hideDelay={5000}
					/>,
					50,
				),
		},
		{
			name: 'Replace pending request',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Tip
						tip={{ payload: { label: 'Initial tip' } }}
						coords={{ x: 120, y: 80 }}
						showDelay={60000}
						hideDelay={5000}
					/>,
					(container) => {
						container.rerender(
							<Tip
								tip={{ payload: { label: 'Updated tip content' } }}
								coords={{ x: 180, y: 100 }}
								showDelay={60000}
								hideDelay={5000}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Cancel pending tip on click',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Tip tip={{ payload: { label: 'Pending tip' } }} coords={{ x: 0, y: 0 }} showDelay={60000} />,
					() => fireEvent.click(document.body),
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<Tip
						tip={{ payload: { label: 'Memory tip' } }}
						coords={{ x: 100, y: 60 }}
						showDelay={60000}
						hideDelay={5000}
					/>,
					10,
				),
		},
	],
};

export const toastConfig: ComponentBenchmarkConfig = {
	componentName: 'Toast',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Toast
						message="Saved successfully"
						type="success"
						showDelay={60000}
						duration={5000}
					/>,
					50,
				),
		},
		{
			name: 'Repeat notification identity',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Toast
						message="Saved"
						notificationId="first"
						data={{ documentId: 'first' }}
						onClick={() => {}}
						type="info"
						showDelay={60000}
						duration={5000}
					/>,
					(container) => {
						container.rerender(
							<Toast
								message="Saved"
								notificationId="second"
								data={{ documentId: 'second' }}
								onClick={() => {}}
								type="error"
								showDelay={60000}
								duration={5000}
							/>,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () =>
				measureMemoryDelta(
					<Toast
						message="Memory benchmark"
						type="info"
						showDelay={60000}
						duration={5000}
					/>,
					10,
				),
		},
	],
};

// Export all configs as an array
export const allBenchmarkConfigs = [
	avatarConfig,
	avatarGroupConfig,
	audioBubbleConfig,
	badgeConfig,
	cameraConfig,
	checkBoxConfig,
	contentEditableConfig,
	dotConfig,
	draggablePanelConfig,
	dropDownConfig,
	dataTableConfig,
	errorSummaryConfig,
	fileIconConfig,
	fileListConfig,
	attachmentConfig,
	flexBoxConfig,
	iconConfig,
	iconButtonConfig,
	audioLevelConfig,
	dialogBoxConfig,
	modalControllerConfig,
	popMenuControllerConfig,
	popMenuGroupConfig,
	promptInputConfig,
	overlayConfig,
	pagerConfig,
	doneCheckConfig,
	progressConfig,
	radioButtonConfig,
	radioButtonListConfig,
	sliderConfig,
	spacerConfig,
	switchConfig,
	tabConfig,
	tabBarConfig,
	textAreaConfig,
	tipConfig,
	toastConfig,
	textFieldConfig,
	buttonConfig,
	buttonBarConfig,
	chipConfig,
	toggleButtonConfig,
	uploadAreaConfig,
	videoConfig,
	videoControllerConfig,
];

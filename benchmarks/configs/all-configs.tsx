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
	DivInput,
	Dot,
	DraggablePanel,
	DropDown,
	ErrorSummary,
	FileIcon,
	FlexDiv,
	Grouper,
	Icon,
	IconButton,
	Level,
	Modal,
	ModalController,
	Overlay,
	Pager,
	ProgressIndicator,
	RadioButton,
	RadioButtonList,
	Slider,
	Spacer,
	Switch,
	TabBar,
	TextArea,
	TextField,
	Tip,
	Toast,
	ToggleButton,
	UploadArea,
	Video,
	Button,
	ButtonBar,
	Chip,
	Label,
	DataTable,
	createColumnHelper,
} from '../../src';
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
			fn: () => measureMountTime(<Avatar first="John" last="Doe" size={34} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Avatar first="John" last="Doe" size={34} />,
					(container) => {
						container.rerender(<Avatar first="Jane" last="Smith" size={34} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Avatar first="John" last="Doe" />, 10),
		},
	],
};

const mockAvatars = [
	{ first: 'John', last: 'Doe', email: 'john@example.com' },
	{ first: 'Jane', last: 'Smith', email: 'jane@example.com' },
	{ first: 'Bob', last: 'Johnson', email: 'bob@example.com' },
];

const mockErrors = [
	{ id: '1', title: '1', bullets: ['one'] },
	{ id: '2', title: '2', bullets: ['one', 'two'] },
	{ id: '3', title: '3', bullets: ['one'] },
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

export const flexDivConfig: ComponentBenchmarkConfig = {
	componentName: 'FlexDiv',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<FlexDiv>
						<div>Child 1</div>
						<div>Child 2</div>
					</FlexDiv>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<FlexDiv direction="column">
						<div>Child 1</div>
						<div>Child 2</div>
					</FlexDiv>,
					(container) => {
						container.rerender(
							<FlexDiv direction="row">
								<div>Child 1</div>
								<div>Child 2</div>
							</FlexDiv>,
						);
					},
					50,
				),
		},
	],
};

export const levelConfig: ComponentBenchmarkConfig = {
	componentName: 'Level',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Level width={120} height={6} playing={false} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Level width={120} height={6} playing={false} />,
					(container) => {
						container.rerender(
							<Level width={140} height={8} playing={false} maxIntensity={8} />,
						);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Level width={120} height={6} />, 10),
		},
	],
};

export const modalConfig: ComponentBenchmarkConfig = {
	componentName: 'Modal',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Modal
						title="Benchmark Modal"
						actions={[{ id: 'confirm', label: 'Confirm', primary: true }]}
					>
						<div>Modal body content</div>
					</Modal>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Modal
						title="Benchmark Modal"
						actions={[{ id: 'confirm', label: 'Confirm', primary: true }]}
					>
						<div>Modal body content</div>
					</Modal>,
					(container) => {
						container.rerender(
							<Modal
								title="Updated Modal"
								actions={[
									{ id: 'cancel', label: 'Cancel' },
									{ id: 'confirm', label: 'Confirm', primary: true },
								]}
							>
								<div>Updated modal body content</div>
							</Modal>,
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
					<Modal title="Benchmark Modal">
						<div>Modal body content</div>
					</Modal>,
					10,
				),
		},
	],
};

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
						container.rerender(
							<ModalController draggable={true} overlayOpacity={0.8} />,
						);
					},
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
					<ToggleButton label="Toggle" icon="check" selected={false} />,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ToggleButton label="Toggle" icon="check" selected={false} />,
					(container) => {
						container.rerender(
							<ToggleButton label="Toggle On" icon="check" selected={true} />,
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
					<ToggleButton label="Toggle" icon="check" onChange={() => {}} />,
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
					<ToggleButton label="Toggle" icon="check" selected={false} />,
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
						showProgress={false}
					/>,
					(container) => {
						container.rerender(
							<UploadArea
								title="Upload Images"
								message="Click to upload"
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
					<UploadArea title="Upload Files" message="Drop files here" />,
					10,
				),
		},
	],
};

export const videoConfig: ComponentBenchmarkConfig = {
	componentName: 'Video',
	tests: [
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
			fn: () => measureMountTime(<Icon name="home" size={22} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Icon name="home" size={22} />,
					(container) => {
						container.rerender(<Icon name="search" size={22} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Icon name="home" />, 10),
		},
	],
};

export const fileIconConfig: ComponentBenchmarkConfig = {
	componentName: 'FileIcon',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<FileIcon name="pdf" size={24} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<FileIcon name="pdf" size={24} />,
					(container) => {
						container.rerender(<FileIcon name="sheet" size={24} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<FileIcon name="image" size={24} />, 10),
		},
	],
};

export const fileListConfig: ComponentBenchmarkConfig = {
	componentName: 'FileList',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<FileList files={[{ file: 'document.pdf' }, { file: 'notes.txt' }]} />,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<FileList files={[{ file: 'document.pdf' }, { file: 'notes.txt' }]} />,
					(container) => {
						container.rerender(
							<FileList
								files={[
									{ file: 'document.pdf', uploading: true, progress: 0.5 },
									{ file: 'notes.txt', error: 'Upload failed' },
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
					<FileList files={[{ file: 'document.pdf' }, { file: 'notes.txt' }]} />,
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
					<Switch state={false} />,
					(container) => {
						container.rerender(<Switch state={true} />);
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
				measureMemoryDelta(<Button label="Test" iconLeft="check" count={5} />, 10),
		},
	],
};

const mockButtons = [
	{ label: 'Save', icon: 'check', tip: 'check' },
	{ label: 'Cancel', icon: 'close', tip: 'close' },
	{ label: 'Delete', icon: 'trash', tip: 'delete' },
];

export const buttonBarConfig: ComponentBenchmarkConfig = {
	componentName: 'ButtonBar',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<ButtonBar options={mockButtons} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ButtonBar options={mockButtons} />,
					(container) => {
						const updatedButtons = [...mockButtons, { label: 'New', icon: 'plus', tip:'plus' }];
						container.rerender(<ButtonBar options={updatedButtons} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<ButtonBar options={mockButtons} onChange={() => {}} />,
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
			fn: () => measureMemoryDelta(<ButtonBar options={mockButtons} />, 10),
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
					<Chip label="Chip" onClick={() => {}} />,
					(container) => {
						const chip = container.container.querySelector('[class*="chip"]');
						if (chip) fireEvent.click(chip);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Chip label="Chip" icon="check" />, 10),
		},
	],
};

export const labelConfig: ComponentBenchmarkConfig = {
	componentName: 'Label',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<Label label="Label" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Label label="Initial" />,
					(container) => {
						container.rerender(<Label label="Updated Label Text" />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Label label="Test Label" />, 10),
		},
	],
};

export const divInputConfig: ComponentBenchmarkConfig = {
	componentName: 'DivInput',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<DivInput isEditable value="Test" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<DivInput isEditable value="Initial" />,
					(container) => {
						container.rerender(<DivInput isEditable value="Updated" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<DivInput isEditable value="Test" onFocus={() => {}} />,
					(container) => {
						const input = container.container.querySelector('[class*="input"]');
						if (input) fireEvent.focus(input);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<DivInput value="Test Input" isEditable />, 10),
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
					<DraggablePanel dragsRight={true} isClosed={false} sizeConstraints={{min:100, max:0.9, initial:250}}>
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
					<DraggablePanel dragsRight={true} isClosed={false} sizeConstraints={{min:100, max:0.9, initial:250}}>
						<div>Content</div>
					</DraggablePanel>,
					(container) => {
						container.rerender(
							<DraggablePanel dragsRight={true} isClosed={true} sizeConstraints={{min:100, max:0.9, initial:250}}>
								<div>Content</div>
							</DraggablePanel>,
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
					<DraggablePanel dragsRight={true} isClosed={false} sizeConstraints={{min:100, max:0.9, initial:250}}>
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
					<DropDown options={mockDropDownOptions} selectedValue="1" />,
					(container) => {
						container.rerender(<DropDown options={mockDropDownOptions} selectedValue="2" />);
					},
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
						const dropdown = container.container.querySelector('[class*="wrapper"]');
						if (dropdown) fireEvent.click(dropdown);
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
					/>,
					(container) => {
						container.rerender(
							<DataTable
								columnDefinitions={mockDataTableColumns}
								tableData={[...mockDataTableRows].reverse()}
								getRowId={(row) => row.id}
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
						container.rerender(<ErrorSummary entries={[...mockErrors, {id:"4", title:"1", bullets:["bullet"]}]}/>);
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

export const grouperConfig: ComponentBenchmarkConfig = {
	componentName: 'Grouper',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () =>
				measureMountTime(
					<Grouper title={"title1"} open={false}/>,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Grouper title={"title1"} open={false} />,
					(container) => {
						container.rerender(
							<Grouper title={"title1"} open={true} />,
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
					<Grouper title={"title1"} open={false} />,
					10,
				),
		},
	],
};

export const iconButtonConfig: ComponentBenchmarkConfig = {
	componentName: 'IconButton',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<IconButton icon="check" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<IconButton icon="check" />,
					(container) => {
						container.rerender(<IconButton icon="close" />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<IconButton icon="save" onClick={() => {}} />,
					(container) => {
						const button = container.container.querySelector('[class*="wrapper"]');
						if (button) fireEvent.click(button);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<IconButton icon="check" />, 10),
		},
	],
};

export const promptInputConfig: ComponentBenchmarkConfig = {
	componentName: 'PromptInput',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<PromptInput value="Test prompt" />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<PromptInput value="Initial prompt" />,
					(container) => {
						container.rerender(
							<PromptInput value="Updated prompt" working={true} />,
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
					<PromptInput value="Memory benchmark prompt" />,
					10,
				),
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
					<Overlay overlay={false} />,
					50,
				),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Overlay overlay={false} />,
					(container) => {
						container.rerender(
							<Overlay overlay={true} />,
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
					<Overlay overlay={false} />,
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
			fn: () => measureMountTime(<Pager pages={15} index={1} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Pager pages={15} index={1} />,
					(container) => {
						container.rerender(<Pager pages={15} index={10} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<Pager pages={15} index={1} onChange={() => {}} />,
					(container) => {
						const nextButton = container.container.querySelector('[aria-label*="next"], [class*="next"]');
						if (nextButton) fireEvent.click(nextButton);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<Pager pages={15} index={1}  />, 10),
		},
	],
};

export const progressConfig: ComponentBenchmarkConfig = {
	componentName: 'Progress',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<ProgressIndicator size={20} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<ProgressIndicator size={20} />,
					(container) => {
						container.rerender(<ProgressIndicator size={64} />);
					},
					50,
				),
		},
		{
			name: 'Memory',
			type: 'memory',
			fn: () => measureMemoryDelta(<ProgressIndicator size={20} />, 10),
		},
	],
};

export const radioButtonConfig: ComponentBenchmarkConfig = {
	componentName: 'RadioButton',
	tests: [
		{
			name: 'Mount Time',
			type: 'mount',
			fn: () => measureMountTime(<RadioButton option={{title:"title", icon:"home"}} />, 50),
		},
		{
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<RadioButton  option={{title:"title", icon:"home"}} selected={false} />,
					(container) => {
						container.rerender(<RadioButton option={{title:"title", icon:"home"}} selected={true} />);
					},
					50,
				),
		},
		{
			name: 'Event Response',
			type: 'event',
			fn: () =>
				measureEventResponseTime(
					<RadioButton option={{title:"title", icon:"home"}} onChange={() => {}} />,
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
			fn: () => measureMemoryDelta(<RadioButton option={{title:"title", icon:"home"}} />, 10),
		},
	],
};

const mockRadios = [
	{title:"Title1", icon:"home"},
	{title:"Title2", icon:"home"},
]
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
					<RadioButtonList options={mockRadios} selectedIndexes={[0]} />,
					(container) => {
						container.rerender(<RadioButtonList options={mockRadios} selectedIndexes={[1]} />);
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
						const firstRadio = container.container.querySelector('[class*="wrapper"]');
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
						const slider = container.container.querySelector('[class*="wrapper"]');
						if (slider) fireEvent.mouseDown(slider, { clientX: 50 });
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
					<TabBar options={mockTabBarTabs} selectedValue="1" />,
					(container) => {
						container.rerender(<TabBar options={mockTabBarTabs} selectedValue="2" />);
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
			name: 'Re-render',
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
			name: 'Re-render',
			type: 'rerender',
			fn: () =>
				measureRerenderTime(
					<Toast
						message="Saving..."
						type="info"
						showDelay={60000}
						duration={5000}
					/>,
					(container) => {
						container.rerender(
							<Toast
								message="Save failed"
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
	divInputConfig,
	dotConfig,
	draggablePanelConfig,
	dropDownConfig,
	dataTableConfig,
	errorSummaryConfig,
	fileIconConfig,
	fileListConfig,
	flexDivConfig,
	grouperConfig,
	iconConfig,
	iconButtonConfig,
	levelConfig,
	modalConfig,
	modalControllerConfig,
	promptInputConfig,
	overlayConfig,
	pagerConfig,
	progressConfig,
	radioButtonConfig,
	radioButtonListConfig,
	sliderConfig,
	spacerConfig,
	switchConfig,
	tabBarConfig,
	textAreaConfig,
	tipConfig,
	toastConfig,
	textFieldConfig,
	buttonConfig,
	buttonBarConfig,
	chipConfig,
	labelConfig,
	toggleButtonConfig,
	uploadAreaConfig,
	videoConfig,
];

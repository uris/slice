import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AvatarInfo } from 'src/components/AvatarGroup';
import { AvatarGroup } from 'src/components/AvatarGroup';
import { FlexDiv } from 'src/components/FlexDiv';
import {
	runAvatarGroupCustomClassPlay,
	runAvatarGroupNoAvatarsPlay,
	runAvatarGroupNullableSpacingPlay,
	runAvatarGroupPlay,
	runAvatarGroupWithoutHandlerPlay,
} from 'src/components/playHelpers';

const avatars: AvatarInfo[] = [
	{
		first: 'John',
		last: 'Appleseed',
		image: 'https://www.slice-uikit.com/public/images/profile-male-02.jpg',
		email: 'johna@email.com',
	},
	{
		first: 'Jane',
		last: 'Appleseed',
		image: '',
		email: 'jane@email.com',
	},
];

const meta: Meta<typeof AvatarGroup> = {
	title: 'Components/AvatarGroup',
	component: AvatarGroup,
	args: {
		avatars: avatars,
		size: 38,
		borderSize: 1,
		overlap: 8,
	},
};

export default meta;

export const Default: StoryObj<typeof AvatarGroup> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<AvatarGroup {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runAvatarGroupPlay({ canvasElement, args });
	},
};

export const WithoutToolTipHandler: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onToolTip: undefined,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runAvatarGroupWithoutHandlerPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		...meta.args,
		className: 'story-avatargroup-class',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runAvatarGroupCustomClassPlay({ canvasElement });
	},
};

export const NullableSpacing: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		...meta.args,
		gap: null as unknown as number,
		margin: null as unknown as number,
		overlap: 0,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runAvatarGroupNullableSpacingPlay({ canvasElement });
	},
};

export const NoAvatars: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		...meta.args,
		avatars: null as unknown as AvatarInfo[],
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runAvatarGroupNoAvatarsPlay({ canvasElement });
	},
};

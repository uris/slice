import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from 'src/components/Avatar';
import { FlexDiv } from 'src/components/FlexDiv';
import { hexToRgb } from 'src/utils/functions/misc';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta: Meta<typeof Avatar> = {
	title: 'Components/Avatar',
	component: Avatar,
	args: {
		name: 'John Doe',
		email: 'john.doe@example.com',
		image: 'https://www.slice-uikit.com/public/images/profile-male-02.jpg',
		borderSize: 1,
		borderColor: undefined,
		borderColorHover: undefined,
		outerBorderSize: undefined,
		outerBorderColor: undefined,
		bgColor: undefined,
		fontSize: undefined,
		onClick: fn(),
		onKeyDown: fn(),
		onToolTip: fn(),
		tabIndex: 0,
	},
};

export default meta;

export const Demo: StoryObj<typeof Avatar> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Avatar {...args} />
			</FlexDiv>
		);
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);

		// get avatar element
		const avatar = canvas.getByRole('button');
		await expect(avatar).toBeInTheDocument();

		// test for background image
		if (args.image) {
			await expect(avatar).toHaveStyle({
				backgroundImage: `"url(' + ${args.image} + ')"`,
			});
		}

		// test click event
		await userEvent.click(avatar);
		await expect(args.onClick).toHaveBeenCalled();

		// hover event
		await userEvent.hover(avatar);
		await expect(args.onToolTip).toHaveBeenCalled();

		// leave event
		await userEvent.unhover(avatar);
		await expect(args.onToolTip).toHaveBeenCalled();

		// key event
		await userEvent.keyboard(' ');
		await expect(args.onKeyDown).toHaveBeenCalled();

		// no border by default
		await expect(avatar).toHaveStyle({
			borderWidth: 0,
		});
	},
};

export const InteractiveWithInitials: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		image: undefined,
		borderSize: 2,
		fontSize: 15,
		size: 38,
	},
	render: (args) => {
		return (
			<FlexDiv justify={'center'} align={'center'} padding={64}>
				<Avatar {...args} />
			</FlexDiv>
		);
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const interactive = args.onClick;

		if (interactive) {
			// get avatar element
			const avatar = canvas.getByRole('button');
			await expect(avatar).toBeInTheDocument();

			// test for initials
			if (args.name) {
				await expect(avatar).toHaveTextContent(args.name.charAt(0));
			}

			// border color
			await userEvent.unhover(avatar);
			await expect(avatar).toHaveStyle({
				borderColor: undefined,
			});

			// text size
			await expect(avatar).toHaveStyle({ fontSize: args.fontSize });

			// avatar size
			await expect(avatar).toHaveStyle({
				height: `${args.size}px`,
				width: `${args.size}px`,
			});
		}
	},
};

export const AutoSizingInitials: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		image: undefined,
		size: 128,
		frame: 128,
		fontSize: 'auto',
	},
	render: (args) => {
		return (
			<FlexDiv justify={'center'} align={'center'} padding={64}>
				<Avatar {...args} />
			</FlexDiv>
		);
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const interactive = args.onClick;

		if (interactive) {
			// get avatar element
			const avatar = canvas.getByRole('button');
			await expect(avatar).toBeInTheDocument();

			// text size
			await expect(avatar).toHaveStyle({ fontSize: '"24px"' });
		}
	},
};

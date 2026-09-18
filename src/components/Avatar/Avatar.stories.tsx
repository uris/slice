import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from 'src/components/Avatar';
import { FlexDiv } from 'src/components/FlexDiv';
import { hexToRgb } from 'src/utils/functions/misc';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

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

export const WithoutToolTipHandler: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onToolTip: undefined,
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// no onToolTip passed, exercising the default-arg no-op
		await userEvent.hover(avatar);
		await userEvent.unhover(avatar);
		await expect(avatar).toBeInTheDocument();
	},
};

export const CustomClassName: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		className: 'story-avatar-class',
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// exercises the wrapper's `className ? ... : ''` true branch
		await expect(avatar).toHaveClass('story-avatar-class');
	},
};

export const NoNameNoEmail: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		name: undefined,
		email: undefined,
		image: undefined,
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// initials' `if (!name && !email) return '';` true branch, and the
		// tooltip payload / aria-label's trailing `?? ''` / `?? 'Unknown
		// User'` fallbacks
		await expect(avatar).toHaveAttribute('aria-label', 'User Avatar - Unknown User');
		await userEvent.hover(avatar);
		await userEvent.unhover(avatar);
	},
};

export const EmailOnlyInitials: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		name: undefined,
		email: 'solo@example.com',
		image: undefined,
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// name falsy exercises initials' `if (name)` false branch, falling
		// through to `if (email) return email.charAt(0);`, and the tooltip
		// payload / aria-label's middle `?? email` branch
		await expect(avatar).toHaveTextContent('s');
		await expect(avatar).toHaveAttribute('aria-label', 'User Avatar - solo@example.com');
		await userEvent.hover(avatar);
		await userEvent.unhover(avatar);
	},
};

export const SingleWordName: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		name: 'Cher',
		image: undefined,
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// a single-word name exercises `if (parts.length > 1)`'s false branch
		// and the `last ? last.charAt(0) : ''` fallback
		await expect(avatar).toHaveTextContent('C');
	},
};

export const NoOnClickKeyDown: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onClick: undefined,
	},
	render: Demo.render,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('img');
		// onClick unset exercises handleKeyDown's `if (!onClick || ...)
		// return;` true branch - onKeyDown itself still fires first
		fireEvent.keyDown(avatar, { key: 'Enter' });
		await expect(args.onKeyDown).toHaveBeenCalled();
	},
};

export const NumericFontSizeWithLayout: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		image: undefined,
		size: 64,
		frame: 64,
		fontSize: 0.6,
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// a numeric fontSize <= 1, with a real (nonzero) rendered height,
		// exercises `if (typeof fontSize === 'number') size = fontSize;`'s
		// true branch instead of the 0.5 default
		await expect(avatar).toBeInTheDocument();
	},
};

export const ZeroSizeAutoFontSize: StoryObj<typeof Avatar> = {
	tags: ['tests'],
	args: {
		...meta.args,
		image: undefined,
		size: 0,
		frame: 0,
		fontSize: 'auto',
	},
	render: Demo.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button');
		// a zero-size avatar renders with zero offsetHeight, exercising the
		// font-size sync effect's `if (!parentHeight)` true branch
		await expect(avatar).toBeInTheDocument();
	},
};

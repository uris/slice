import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexBox } from 'src/components/FlexBox';
import { Icon, SliceIcons } from 'src/components/Icon';
import { runIconPlay } from 'src/components/playHelpers';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

const iconCategories = Object.values(SliceIcons);
const icons = iconCategories.flatMap((category) => Object.values(category));
const meta: Meta<typeof Icon> = {
	title: 'Components/Icon',
	component: Icon,
	argTypes: {
		name: {
			control: { type: 'select' }, // Dropdown selection
			options: icons, // Enum values as options
		},
	},
	args: {
		name: 'basic.home',
		size: 20,
		stroke: 1.25,
		strokeColor: 'var(--core-icon-primary)',
		toggle: false,
		pointer: true,
		disabled: false,
		onClick: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Icon> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<Icon {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runIconPlay({ canvasElement, args });
	},
};

export const FilledMoreIcons: StoryObj<typeof Icon> = {
	tags: ['tests'],
	render: () => (
		<FlexBox gap={16}>
			<Icon name={SliceIcons.basic.moreHorizFill} size={20} strokeColor="#123456" pointer={false} />
			<Icon name={SliceIcons.basic.moreVertFill} size={20} strokeColor="#123456" pointer={false} />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, width, height] of [
			['basic.more-horiz-fill', 15, 2.5],
			['basic.more-vert-fill', 2.5, 15],
		] as const) {
			const icon = canvas.getByRole('img', { name: `${name} icon` });
			const path = icon.querySelector('path') as SVGPathElement;
			await expect(path).toHaveAttribute('fill', '#123456');
			await expect(path).not.toHaveAttribute('stroke');
			const bounds = path.getBBox();
			await expect(bounds.width).toBe(width);
			await expect(bounds.height).toBe(height);
		}
	},
};

export const DirectActivation: StoryObj<typeof Icon> = {
	tags: ['tests'],
	args: { onClick: fn(), pointer: false, actionName: 'Play video' },
	render: (args) => <Icon {...args} />,
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button', { name: 'Play video' });
		await userEvent.click(icon);
		icon.focus();
		await userEvent.keyboard('{Enter}');
		fireEvent.keyDown(icon, { key: ' ' });
		expect(args.onClick).toHaveBeenCalledTimes(2);
		fireEvent.keyUp(icon, { key: ' ' });
		expect(args.onClick).toHaveBeenCalledTimes(3);
		expect(args.onClick).toHaveBeenLastCalledWith(
			expect.objectContaining({ type: 'click', target: icon, nativeEvent: expect.objectContaining({ type: 'click' }) }),
		);
		expect(icon).toHaveAttribute('tabindex', '0');
	},
};
export const DisabledActivation: StoryObj<typeof Icon> = {
	tags: ['tests'],
	args: { disabled: true, onClick: fn(), actionName: 'Disabled action' },
	render: (args) => <Icon {...args} />,
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button', { name: 'Disabled action' });
		await userEvent.click(icon);
		fireEvent.keyDown(icon, { key: 'Enter' });
		fireEvent.keyDown(icon, { key: ' ' });
		fireEvent.keyUp(icon, { key: ' ' });
		expect(args.onClick).not.toHaveBeenCalled();
		expect(icon).toHaveAttribute('aria-disabled', 'true');
		expect(icon).toHaveAttribute('tabindex', '-1');
	},
};
export const StaticAndDecorative: StoryObj<typeof Icon> = {
	tags: ['tests'],
	render: () => (
		<>
			<Icon pointer iconName="Home" />
			<Icon decorative data-testid="decorative-icon" />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('img', { name: 'Home' })).toHaveAttribute('tabindex', '-1');
		expect(canvas.getByTestId('decorative-icon')).toHaveAttribute('aria-hidden', 'true');
	},
};
export const ZeroFillOpacity: StoryObj<typeof Icon> = {
	tags: ['tests'],
	render: () => <Icon name="ai.sparkle" fill fillOpacity={0} />,
	play: async ({ canvasElement }) => {
		const icon = within(canvasElement).getByRole('img');
		expect(icon.querySelector('[fill-opacity]')).toHaveAttribute('fill-opacity', '0');
	},
};
export const CancelledKeyboardActivation: StoryObj<typeof Icon> = {
	tags: ['tests'],
	args: { onClick: fn(), onKeyDown: (event) => event.preventDefault() },
	render: (args) => <Icon {...args} />,
	play: async ({ canvasElement, args }) => {
		const icon = within(canvasElement).getByRole('button');
		icon.focus();
		await userEvent.keyboard('{Enter} ');
		expect(args.onClick).not.toHaveBeenCalled();
	},
};

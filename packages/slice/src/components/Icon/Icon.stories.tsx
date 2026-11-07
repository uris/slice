import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { Icon, SliceIcons } from 'src/components/Icon';
import { runIconPlay } from 'src/components/playHelpers';
import { expect, fn, userEvent, within } from 'storybook/test';

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
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Icon {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runIconPlay({ canvasElement, args });
	},
};

export const FilledMoreIcons: StoryObj<typeof Icon> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv gap={16}>
			<Icon name={SliceIcons.basic.moreHorizFill} size={20} strokeColor="#123456" pointer={false} />
			<Icon name={SliceIcons.basic.moreVertFill} size={20} strokeColor="#123456" pointer={false} />
		</FlexDiv>
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

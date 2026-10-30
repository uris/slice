import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Overlay } from 'src/components/Overlay/Overlay';
import { runOverlayOpacityVariantsPlay, runOverlayPlay } from 'src/components/playHelpers';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

const meta: Meta<typeof Overlay> = {
	title: 'Components/Overlay',
	component: Overlay,
	argTypes: {
		color: { type: 'string', control: 'text' },
	},
	args: {
		opacity: 1,
		show: true,
		color: '#00000080',
		type: 'dark',
		global: false,
		overlay: undefined,
		onClick: fn(),
		toggleOverlay: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Overlay> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Overlay {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runOverlayPlay({ canvasElement, args });
	},
};

export const GlobalOverlay: StoryObj<typeof Overlay> = {
	args: {
		...meta.args,
		global: true,
		overlay: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runOverlayPlay({ canvasElement, args });
	},
};

export const HiddenGlobal: StoryObj<typeof Overlay> = {
	args: {
		...meta.args,
		global: true,
		show: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const overlay = canvasElement.querySelector('[class*="overlay"]');
		await expect(overlay).not.toBeInTheDocument();
	},
};

export const OpacityVariants: StoryObj<typeof Overlay> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv direction={'column'} gap={24}>
			<Overlay className="clear-overlay" show type="clear" opacity={1} transition={{ duration: 0 }} />
			<Overlay className="dark-default-overlay" show type="dark" transition={{ duration: 0 }} />
			<Overlay className="dark-explicit-overlay" show type="dark" opacity={0.3} transition={{ duration: 0 }} />
		</FlexDiv>
	),
	play: runOverlayOpacityVariantsPlay,
};

export const DefaultClickHandlers: StoryObj<typeof Overlay> = {
	tags: ['tests'],
	args: { show: true, global: true, onClick: undefined, toggleOverlay: undefined, color: null as unknown as string },
	render: (args) => <Overlay {...args} data-testid="default-overlay" />,
	play: async ({ canvasElement }) => {
		const overlay = within(canvasElement).getByTestId('default-overlay');
		await userEvent.click(overlay);
		await expect(overlay).toBeInTheDocument();
		await expect(overlay.style.getPropertyValue('--overlay-color')).toBe('rgb(0,0,0)');
		await expect(fireEvent.contextMenu(overlay)).toBe(false);
	},
};

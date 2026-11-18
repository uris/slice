import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import image from '../../../../../apps/website/public/images/flowers-sunflower.png';
import { Avatar } from '../Avatar';
import { FlexBox, Preset } from '../FlexBox';
import { Icon } from '../Icon';
import { SliceIcons } from '../Icon/_types';
import { InfoBox } from './InfoBox';
import { InfoBoxAction } from './InfoBoxAction';
import { InfoBoxContent } from './InfoBoxContent';
import { InfoBoxImage } from './InfoBoxImage';
import { InfoBoxTitle } from './InfoBoxTitle';

const meta = {
	title: 'Components/InfoBox',
	component: InfoBox,
	subcomponents: { InfoBoxTitle, InfoBoxContent, InfoBoxImage, InfoBoxAction },
	parameters: { layout: 'fullscreen' },
	decorators: [
		(Story) => (
			<FlexBox preset={Preset.FillCenterMiddle} width="fill" height="viewport">
				<Story />
			</FlexBox>
		),
	],
	args: { maxWidth: '75%', onPress: fn() },
} satisfies Meta<typeof InfoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<InfoBox {...args}>
			<InfoBoxImage>
				<Avatar name={'John Wick'} backgroundColor={'var(--core-text-dark)'} textColor={'var(--core-text-light)'} />
			</InfoBoxImage>
			<InfoBoxTitle title="John Wick" />
			<InfoBoxContent text="View John Wick's profile." />
			<InfoBoxAction>
				<Icon name={SliceIcons.arrows.chevronRight} aria-hidden="true" />
			</InfoBoxAction>
		</InfoBox>
	),
};

export const ActionButton: Story = {
	render: (args) => (
		<InfoBox {...args} onPress={undefined}>
			<InfoBoxImage>
				<Avatar name={'John Wick'} backgroundColor={'var(--core-text-dark)'} textColor={'var(--core-text-light)'} />
			</InfoBoxImage>
			<InfoBoxTitle title="John Wick" />
			<InfoBoxContent text="View John Wick's profile." />
			<InfoBoxAction button={{ label: 'View', variant: 'secondary' }} />
		</InfoBox>
	),
};

export const NoContent: Story = {
	render: (args) => (
		<InfoBox {...args} onPress={undefined}>
			<InfoBoxImage>
				<Avatar name={'John Wick'} backgroundColor={'var(--core-text-dark)'} textColor={'var(--core-text-light)'} />
			</InfoBoxImage>
			<InfoBoxTitle title="John Wick" />
			<InfoBoxAction button={{ label: 'Profile Details', variant: 'outline' }} />
		</InfoBox>
	),
};

export const SimpleInfoBox: Story = {
	render: (args) => (
		<InfoBox {...args} onPress={undefined}>
			<InfoBoxTitle title="Discover the new features" />
			<InfoBoxContent text="Over 100 features added." />
			<InfoBoxAction button={{ label: 'View', variant: 'outline' }} />
		</InfoBox>
	),
};

export const SuperSimpleInfoBox: Story = {
	render: (args) => (
		<InfoBox {...args}>
			<InfoBoxImage iconName={'alerts.alert-circle'} />
			<InfoBoxTitle title="Oops. Someting went wrong ..." />
			<InfoBoxAction>
				<Icon name={'arrows.chevron-right'} size={20} strokeWidth={1.5} />
			</InfoBoxAction>
		</InfoBox>
	),
};

export const PressInteractions: Story = {
	tags: ['tests'],
	args: { id: 'profile-row', name: 'profile', onPress: fn(), onClick: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: /John Wick/ });
		await userEvent.tab();
		await expect(button).toHaveFocus();
		await expect(getComputedStyle(button).outlineStyle).toBe('solid');
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');
		await userEvent.click(button);
		await expect(args.onPress).toHaveBeenCalledTimes(3);
		await expect(args.onClick).toHaveBeenCalledTimes(3);
		await expect(args.onPress).toHaveBeenLastCalledWith(
			expect.objectContaining({ type: 'click' }),
			'profile',
			'profile-row',
		);
	},
};

export const IndependentActions: Story = {
	tags: ['tests'],
	args: { onPress: fn(), onClick: fn() },
	render: (args) => (
		<InfoBox {...args}>
			<InfoBoxTitle title="Profile" />
			<InfoBoxAction button={{ label: 'Edit profile', onClick: actionClick }} />
		</InfoBox>
	),
	play: async ({ canvasElement, args }) => {
		actionClick.mockClear();
		const canvas = within(canvasElement);
		const row = canvas.getByRole('button', { name: 'Profile' });
		const action = canvas.getByRole('button', { name: 'Edit profile' });
		await expect(row.contains(action)).toBe(false);
		await userEvent.click(action);
		await expect(actionClick).toHaveBeenCalledTimes(1);
		await expect(args.onPress).not.toHaveBeenCalled();
		await expect(args.onClick).not.toHaveBeenCalled();
		await userEvent.click(row);
		await expect(args.onPress).toHaveBeenCalledTimes(1);
	},
};
const actionClick = fn();

export const DisabledPress: Story = {
	tags: ['tests'],
	args: { disabled: true, onPress: fn() },
	render: IndependentActions.render,
	play: async ({ canvasElement, args }) => {
		actionClick.mockClear();
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Profile' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('button', { name: 'Profile' }));
		await expect(args.onPress).not.toHaveBeenCalled();
		await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
		await expect(actionClick).toHaveBeenCalledTimes(1);
	},
};

export const PreventDefaultCancelsPress: Story = {
	tags: ['tests'],
	args: { onClick: fn((event) => event.preventDefault()), onPress: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: /John Wick/ }));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(args.onPress).not.toHaveBeenCalled();
	},
};

export const StaticSurface: Story = {
	tags: ['tests'],
	render: () => (
		<InfoBox role="group" aria-label="Static profile" backgroundColor="#123456">
			<InfoBoxTitle title="Profile" />
		</InfoBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
		const surface = canvas.getByRole('group', { name: 'Static profile' });
		await userEvent.hover(surface);
		await expect(getComputedStyle(surface).backgroundColor).toBe('rgb(18, 52, 86)');
	},
};

export const UnorderedSectionsAndFragments: Story = {
	tags: ['tests'],
	render: () => (
		<InfoBox>
			<>
				<InfoBoxAction data-testid="action">
					<span>New</span>
				</InfoBoxAction>
				<InfoBoxContent data-testid="content" text="Description" />
				<>
					<InfoBoxTitle data-testid="title" title="Profile" />
					<InfoBoxImage data-testid="image" iconName="basic.home" iconStrokeWidth={2} />
				</>
			</>
		</InfoBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [first, second] of [
			['image', 'title'],
			['title', 'content'],
			['content', 'action'],
		]) {
			await expect(
				canvas.getByTestId(first).compareDocumentPosition(canvas.getByTestId(second)) &
					Node.DOCUMENT_POSITION_FOLLOWING,
			).toBeTruthy();
		}
		await expect(canvas.getByTestId('image').querySelector('[stroke-width]')).toHaveAttribute('stroke-width', '2');
	},
};

export const ImageAndNativeProps: Story = {
	tags: ['tests'],
	render: () => (
		<InfoBox role="group" aria-label="Photo profile" className="custom-info" style={{ width: 240 }}>
			<InfoBoxImage src={image} alt="Profile photograph" width={32} height={32} />
		</InfoBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('img', { name: 'Profile photograph' })).toBeVisible();
		await expect(canvas.getByRole('group', { name: 'Photo profile' })).toHaveClass('custom-info');
		await expect(canvas.getByRole('group', { name: 'Photo profile' })).toHaveStyle({ width: '240px' });
		await expect(canvasElement.querySelector('[class*="content-wrapper"]')).not.toBeInTheDocument();
	},
};

export const LongTextTruncation: Story = {
	tags: ['tests'],
	render: () => (
		<InfoBox style={{ width: 220 }}>
			<InfoBoxTitle title="An exceptionally long profile title that should be truncated" />
			<InfoBoxContent text="A longer description that must stay inside this narrow information box" />
		</InfoBox>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const text of [/An exceptionally/, /A longer description/]) {
			const element = canvas.getByText(text);
			await expect(element.scrollWidth).toBeGreaterThan(element.clientWidth);
			await expect(getComputedStyle(element).textOverflow).toBe('ellipsis');
		}
	},
};

export const ExplicitHoverToken: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<span data-testid="expected-hover" style={{ display: 'none', backgroundColor: 'var(--core-fill-primary)' }} />
			<InfoBox role="group" aria-label="Hover surface" backgroundColorHover="core-fill-primary">
				<InfoBoxTitle title="Profile" />
			</InfoBox>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const surface = canvas.getByRole('group', { name: 'Hover surface' });
		await expect(surface.style.getPropertyValue('--info-box-background-color-hover')).toBe('var(--core-fill-primary)');
		surface.style.transition = 'none';
		surface.style.backgroundColor = surface.style.getPropertyValue('--info-box-background-color-hover');
		await expect(getComputedStyle(surface).backgroundColor).toBe(
			getComputedStyle(canvas.getByTestId('expected-hover')).backgroundColor,
		);
	},
};

export const HoverTintFollowsTheme: Story = {
	tags: ['tests'],
	render: (args) => (
		<InfoBox {...args} role="group" aria-label="Theme surface">
			<InfoBoxTitle title="Profile" />
		</InfoBox>
	),
	play: async ({ canvasElement }) => {
		const surface = within(canvasElement).getByRole('group', { name: 'Theme surface' });
		const previous = document.documentElement.dataset.sliceTheme;
		try {
			for (const [theme, expected] of [
				['lightMode', 'color-mix(in srgb, var(--core-surface-primary) 95%, black)'],
				['darkMode', 'color-mix(in srgb, var(--core-surface-primary) 98%, white)'],
			]) {
				document.documentElement.dataset.sliceTheme = theme;
				await waitFor(() => expect(surface.style.getPropertyValue('--info-box-background-color-hover')).toBe(expected));
			}
		} finally {
			if (previous === undefined) delete document.documentElement.dataset.sliceTheme;
			else document.documentElement.dataset.sliceTheme = previous;
		}
	},
};

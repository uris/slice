import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { Avatar } from 'src/components/Avatar';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';

const photo = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80"><rect width="160" height="80" fill="#2670cc"/></svg>')}`;
const brokenPhoto = 'data:image/png;base64,broken';
const meta: Meta<typeof Avatar> = {
	title: 'Components/Avatar',
	component: Avatar,
	args: { name: 'Jane Smith' },
	render: (args) => <Avatar {...args} />,
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Demo: Story = {
	args: { size: 48, textSize: 'l', backgroundColor: 'array-sky-label', borderWidth: 1 },
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img', { name: 'User Avatar - Jane Smith' });
		await expect(avatar).toHaveTextContent('JS');
		await expect(avatar).not.toHaveAttribute('tabindex');
	},
};

export const KeyboardActivation: Story = {
	tags: ['tests'],
	args: { onClick: fn(), onKeyDown: fn() },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		await userEvent.tab();
		await expect(avatar).toHaveFocus();
		await expect(getComputedStyle(avatar).outlineStyle).toBe('solid');
		await expect(getComputedStyle(avatar).outlineWidth).toBe('2px');
		await userEvent.keyboard('{Enter} ');
		await expect(args.onClick).toHaveBeenCalledTimes(2);
		await expect(args.onKeyDown).toHaveBeenCalledTimes(2);
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'click' }), undefined);
	},
};

export const PointerActivation: Story = {
	tags: ['tests'],
	args: { onClick: fn(), 'aria-label': "Open Jane's profile" },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: "Open Jane's profile" }));
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const CancelKeyboardActivation: Story = {
	tags: ['tests'],
	args: { onClick: fn(), onKeyDown: fn((event) => event.preventDefault()) },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		avatar.focus();
		await userEvent.keyboard('{Enter} ');
		await expect(args.onKeyDown).toHaveBeenCalledTimes(2);
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const IgnoreRepeatedAndUnrelatedKeys: Story = {
	tags: ['tests'],
	args: { onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		fireEvent.keyDown(avatar, { key: 'Enter', repeat: true });
		fireEvent.keyDown(avatar, { key: 'ArrowDown' });
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const NonInteractiveKeyboard: Story = {
	tags: ['tests'],
	args: { onKeyDown: fn(), tabIndex: 3 },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('img');
		fireEvent.keyDown(avatar, { key: 'Enter' });
		await expect(args.onKeyDown).toHaveBeenCalledTimes(1);
		await expect(avatar).not.toHaveAttribute('tabindex');
	},
};

export const CustomTabIndex: Story = {
	tags: ['tests'],
	args: { onClick: fn(), tabIndex: -1 },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button')).toHaveAttribute('tabindex', '-1');
	},
};

export const TooltipAndNativeEvents: Story = {
	tags: ['tests'],
	args: { onToolTip: fn(), onMouseEnter: fn(), onMouseLeave: fn(), onFocus: fn(), onBlur: fn(), onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		await userEvent.hover(avatar);
		await expect(args.onMouseEnter).toHaveBeenCalledTimes(1);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({
				payload: { label: 'Jane Smith' },
				ref: expect.objectContaining({ current: avatar }),
				event: expect.anything(),
			}),
			undefined,
		);
		await userEvent.unhover(avatar);
		await expect(args.onMouseLeave).toHaveBeenCalledTimes(1);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null, undefined);
		avatar.focus();
		await expect(args.onFocus).toHaveBeenCalledTimes(1);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Jane Smith' } }),
			undefined,
		);
		avatar.blur();
		await expect(args.onBlur).toHaveBeenCalledTimes(1);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null, undefined);
	},
};

export const TooltipRemainsWhileFocusedOrHovered: Story = {
	tags: ['tests'],
	args: { onToolTip: fn(), onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		avatar.focus();
		await userEvent.hover(avatar);
		avatar.blur();
		await expect(args.onToolTip).not.toHaveBeenLastCalledWith(null, undefined);
		avatar.focus();
		await userEvent.unhover(avatar);
		await expect(args.onToolTip).not.toHaveBeenLastCalledWith(null, undefined);
		avatar.blur();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null, undefined);
	},
};

export const NormalizedName: Story = {
	tags: ['tests'],
	args: { name: '  Jane\tMary   Smith  ', email: 'other@example.com', onToolTip: fn() },
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('img');
		await expect(avatar).toHaveTextContent('JS');
		await userEvent.hover(avatar);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Jane\tMary   Smith' } }),
			undefined,
		);
	},
};

export const EmailFallback: Story = {
	tags: ['tests'],
	args: { name: '   ', email: '  solo@example.com  ' },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('img', { name: 'User Avatar - solo@example.com' })).toHaveTextContent(
			's',
		);
	},
};

export const SingleWordName: Story = {
	tags: ['tests'],
	args: { name: 'Cher' },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('img')).toHaveTextContent('C');
	},
};

export const NoIdentity: Story = {
	tags: ['tests'],
	args: { name: undefined },
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img', { name: 'User Avatar - Unknown User' });
		await expect(avatar).toHaveTextContent('');
		await expect(avatar.querySelector('img')).toBeNull();
	},
};

export const ImageCoverage: Story = {
	tags: ['tests'],
	args: { image: photo, size: 80, borderWidth: 2, outerBorderWidth: 3 },
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img');
		const image = avatar.querySelector('img') as HTMLImageElement;
		await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
		await expect(image).toHaveAttribute('loading', 'eager');
		await expect(image.naturalWidth).toBe(160);
		await expect(avatar).not.toHaveTextContent('JS');
		await expect(getComputedStyle(image).objectFit).toBe('cover');
		await expect(getComputedStyle(image).objectPosition).toBe('50% 50%');
		await expect(avatar.getBoundingClientRect().width).toBe(80);
		await expect(avatar.getBoundingClientRect().height).toBe(80);
		await expect(getComputedStyle(avatar).borderTopWidth).toBe('3px');
		await expect(getComputedStyle(image.parentElement as HTMLElement).borderTopWidth).toBe('2px');
	},
};

export const FailedImage: Story = {
	tags: ['tests'],
	args: { image: brokenPhoto },
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img');
		const image = avatar.querySelector('img') as HTMLImageElement;
		await waitFor(() => expect(image.complete).toBe(true));
		await expect(image.naturalWidth).toBe(0);
		await expect(getComputedStyle(image.parentElement as HTMLElement).backgroundClip).toBe('border-box');
		await expect(image).toHaveStyle({ opacity: '0' });
		await expect(avatar).toHaveTextContent('JS');
	},
};

export const LazyImage: Story = {
	tags: ['tests'],
	args: { image: '/public/images/profile-male-02.jpg?avatar-lazy', lazyLoad: true },
	render: (args) => (
		<div style={{ paddingTop: 10000 }}>
			<Avatar {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img');
		const image = avatar.querySelector('img') as HTMLImageElement;
		await expect(image).toHaveAttribute('loading', 'lazy');
		await expect(avatar).toHaveTextContent('JS');
		avatar.scrollIntoView();
		await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
		await expect(avatar).not.toHaveTextContent('JS');
	},
};

export const ChangingImageSource: Story = {
	tags: ['tests'],
	render: function SourceExample(args) {
		const [image, setImage] = useState(photo);
		return (
			<>
				<Avatar {...args} image={image} />
				<button type="button" onClick={() => setImage(brokenPhoto)}>
					Break photo
				</button>
				<button type="button" onClick={() => setImage(photo)}>
					Restore photo
				</button>
				<button type="button" onClick={() => setImage('')}>
					Remove photo
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('img');
		await waitFor(() => expect(avatar).not.toHaveTextContent('JS'));
		await userEvent.click(canvas.getByRole('button', { name: 'Break photo' }));
		await expect(avatar).toHaveTextContent('JS');
		await userEvent.click(canvas.getByRole('button', { name: 'Restore photo' }));
		await waitFor(() => expect(avatar).not.toHaveTextContent('JS'));
		await userEvent.click(canvas.getByRole('button', { name: 'Remove photo' }));
		await expect(avatar).toHaveTextContent('JS');
		await expect(avatar.querySelector('img')).toBeNull();
	},
};

export const TypographyTokens: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{(['xs', 's', 'm', 'l', 'xl'] as const).map((textSize) => (
				<Avatar {...args} key={textSize} textSize={textSize} aria-label={textSize} />
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		for (const size of ['xs', 's', 'm', 'l', 'xl']) {
			const avatar = within(canvasElement).getByRole('img', { name: size });
			const expectedSize = getComputedStyle(avatar).getPropertyValue(`--font-size-${size}`).trim();
			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			const pixels = Number.parseFloat(expectedSize) * (expectedSize.endsWith('rem') ? rem : 1);
			await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).fontSize).toBe(`${pixels}px`);
		}
	},
};

export const ResizingAndNativeAttributes: Story = {
	tags: ['tests'],
	render: function SizeExample(args) {
		const [size, setSize] = useState<number | string>(34);
		return (
			<>
				<Avatar {...args} size={size} className="custom-avatar" style={{ margin: 4 }} data-testid="profile" />
				<button type="button" onClick={() => setSize('5rem')}>
					Resize
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('img');
		await expect(avatar.getBoundingClientRect().width).toBe(34);
		const textSize = getComputedStyle(avatar.firstElementChild as HTMLElement).fontSize;
		await expect(avatar).toHaveClass('custom-avatar');
		await expect(avatar).toHaveAttribute('data-testid', 'profile');
		await expect(avatar).toHaveStyle({ margin: '4px' });
		await userEvent.click(canvas.getByRole('button', { name: 'Resize' }));
		const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
		await expect(avatar.getBoundingClientRect().width).toBe(5 * rem);
		await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).fontSize).toBe(textSize);
	},
};

export const AlreadyLoadedImageHydration: Story = {
	tags: ['tests'],
	render: () => <div data-testid="hydration-container" />,
	play: async ({ canvasElement }) => {
		const container = within(canvasElement).getByTestId('hydration-container');
		const component = <Avatar name="Jane Smith" image={photo} />;
		container.innerHTML = renderToString(component);
		const image = container.querySelector('img') as HTMLImageElement;
		// Finish loading before hydration, so React cannot rely on receiving onLoad.
		await image.decode();
		await expect(image).toHaveAttribute('data-loaded', 'false');
		const root = hydrateRoot(container, component);
		try {
			await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
			await expect(image).toHaveStyle({ opacity: '1' });
			await expect(container).not.toHaveTextContent('JS');
		} finally {
			root.unmount();
		}
	},
};

export const TransparentImageBorder: Story = {
	tags: ['tests'],
	args: {
		image: photo,
		size: 64,
		borderWidth: 4,
		borderColor: 'transparent',
		borderColorHover: '#ff0000',
		backgroundColor: '#00ff00',
	},
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img');
		const image = avatar.querySelector('img') as HTMLImageElement;
		const frame = image.parentElement as HTMLElement;
		await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
		await expect(getComputedStyle(frame).borderTopColor).toBe('rgba(0, 0, 0, 0)');
		await expect(getComputedStyle(frame).backgroundClip).toBe('padding-box');
		fireEvent.error(image);
		await expect(avatar).toHaveTextContent('JS');
		await expect(getComputedStyle(frame).backgroundClip).toBe('border-box');
	},
};

const userInfo = { id: 'user-42', name: 'Jane Smith' };
type UserInfo = typeof userInfo;
type UserStory = StoryObj<typeof Avatar<UserInfo>>;

export const TypedInfoActivation: UserStory = {
	tags: ['tests'],
	args: { info: userInfo, onClick: fn(), onKeyDown: fn() },
	render: (args) => (
		<Avatar
			{...args}
			info={userInfo}
			onClick={(event, info) => {
				// info is inferred from the prop; currentTarget retains its HTMLDivElement type.
				event.currentTarget.dataset.userId = info?.id;
				args.onClick?.(event, info);
			}}
		/>
	),
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		await userEvent.click(avatar);
		await userEvent.keyboard('{Enter} ');
		await expect(args.onClick).toHaveBeenCalledTimes(3);
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'click' }), userInfo);
		await expect(args.onKeyDown).toHaveBeenLastCalledWith(expect.objectContaining({ key: ' ' }), userInfo);
		await expect(avatar).toHaveAttribute('data-user-id', userInfo.id);
		await expect(avatar).not.toHaveAttribute('info');
		await expect(avatar).not.toHaveAttribute('data-info');
	},
};

export const TypedInfoTooltipAndFocus: UserStory = {
	tags: ['tests'],
	args: {
		info: userInfo,
		onClick: fn(),
		onToolTip: fn(),
		onFocus: fn(),
		onBlur: fn(),
		onMouseEnter: fn(),
		onMouseLeave: fn(),
	},
	render: (args) => <Avatar<UserInfo> {...args} />,
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		await userEvent.hover(avatar);
		await expect(args.onMouseEnter).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'mouseenter' }), userInfo);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Jane Smith' } }),
			userInfo,
		);
		await userEvent.unhover(avatar);
		await expect(args.onMouseLeave).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'mouseleave' }), userInfo);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null, userInfo);
		avatar.focus();
		await expect(args.onFocus).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'focus' }), userInfo);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Jane Smith' } }),
			userInfo,
		);
		avatar.blur();
		await expect(args.onBlur).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'blur' }), userInfo);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null, userInfo);
	},
};

export const TypedInfoNativeEvents: UserStory = {
	tags: ['tests'],
	args: {
		info: userInfo,
		onClick: fn(),
		onClickCapture: fn(),
		onPointerDown: fn(),
		onContextMenu: fn(),
		onKeyUp: fn(),
		onMouseDown: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		await userEvent.click(avatar);
		await expect(args.onClickCapture).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'click' }), userInfo);
		await expect(args.onPointerDown).toHaveBeenLastCalledWith(
			expect.objectContaining({ type: 'pointerdown' }),
			userInfo,
		);
		await expect(args.onMouseDown).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'mousedown' }), userInfo);
		fireEvent.contextMenu(avatar);
		await expect(args.onContextMenu).toHaveBeenLastCalledWith(
			expect.objectContaining({ type: 'contextmenu' }),
			userInfo,
		);
		fireEvent.keyUp(avatar, { key: 'Escape' });
		await expect(args.onKeyUp).toHaveBeenLastCalledWith(expect.objectContaining({ key: 'Escape' }), userInfo);
	},
};

export const UpdatedInfo: Story = {
	tags: ['tests'],
	args: { onClick: fn(), onClickCapture: fn(), onToolTip: fn() },
	render: function InfoExample(args) {
		const [info, setInfo] = useState<UserInfo | undefined>(userInfo);
		return (
			<>
				<Avatar {...args} info={info} />
				<button type="button" onClick={() => setInfo({ id: 'user-99', name: 'Other User' })}>
					Change info
				</button>
				<button type="button" onClick={() => setInfo(undefined)}>
					Clear info
				</button>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const avatar = canvas.getByRole('button', { name: 'User Avatar - Jane Smith' });
		await userEvent.click(avatar);
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.anything(), userInfo);
		await userEvent.click(canvas.getByRole('button', { name: 'Change info' }));
		await userEvent.click(avatar);
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.anything(), { id: 'user-99', name: 'Other User' });
		await expect(args.onClickCapture).toHaveBeenLastCalledWith(expect.anything(), {
			id: 'user-99',
			name: 'Other User',
		});
		await expect(args.onToolTip).toHaveBeenLastCalledWith(expect.anything(), { id: 'user-99', name: 'Other User' });
		await userEvent.click(canvas.getByRole('button', { name: 'Clear info' }));
		await userEvent.click(avatar);
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.anything(), undefined);
	},
};

export const FalsyInfo: Story = {
	tags: ['tests'],
	args: { info: 0, onClick: fn(), onClickCapture: fn() },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button'));
		await expect(args.onClick).toHaveBeenLastCalledWith(expect.anything(), 0);
		await expect(args.onClickCapture).toHaveBeenLastCalledWith(expect.anything(), 0);
	},
};

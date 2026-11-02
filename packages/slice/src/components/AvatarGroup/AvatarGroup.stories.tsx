import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

const avatars: AvatarInfo[] = [
	{
		id: 'john',
		first: 'John',
		last: 'Appleseed',
		image: '/public/images/profile-male-02.jpg',
		email: 'johna@email.com',
	},
	{
		id: 'jane',
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
		borderWidth: 1,
		overlap: 8,
	},
};

export default meta;

export const Default: StoryObj<typeof AvatarGroup> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<AvatarGroup {...args} data-testid="avatar-group" />
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

export const NormalizedBordersAndColors: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		avatars: [{ first: 'Jane', last: 'Smith', textColor: '#ffffff', backgroundColor: '#2563eb' }],
		borderWidth: 2,
		borderColor: '#ff0000',
		outerBorderWidth: 4,
		outerBorderColor: '#00ff00',
		size: 48,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img', { name: 'User Avatar - Jane Smith' });
		const frame = avatar.firstElementChild as HTMLElement;
		await expect(getComputedStyle(avatar).borderTopWidth).toBe('4px');
		await expect(getComputedStyle(avatar).borderTopColor).toBe('rgb(0, 255, 0)');
		await expect(getComputedStyle(frame).borderTopWidth).toBe('2px');
		await expect(getComputedStyle(frame).borderTopColor).toBe('rgb(255, 0, 0)');
		await expect(getComputedStyle(frame).color).toBe('rgb(255, 255, 255)');
		await expect(getComputedStyle(frame).backgroundColor).toBe('rgb(37, 99, 235)');
		await expect(avatar.getBoundingClientRect().width).toBe(48);
	},
};

export const DefaultBorderWidths: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { borderWidth: undefined, avatars: [{ first: 'Jane' }] },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img');
		await expect(getComputedStyle(avatar).borderTopWidth).toBe('3px');
		await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).borderTopWidth).toBe('3px');
	},
};

export const UpdatedPeople: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: function PeopleExample(args) {
		const [people, setPeople] = useState<AvatarInfo[]>([{ first: 'Jane', last: 'Smith' }]);
		return (
			<>
				<AvatarGroup {...args} avatars={people} />
				<button
					type="button"
					onClick={() =>
						setPeople([{ first: 'Morgan', last: 'Chen', textColor: '#ffffff', backgroundColor: '#2563eb' }])
					}
				>
					Update people
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('img', { name: 'User Avatar - Jane Smith' })).toHaveTextContent('JS');
		await userEvent.click(canvas.getByRole('button', { name: 'Update people' }));
		const avatar = canvas.getByRole('img', { name: 'User Avatar - Morgan Chen' });
		await expect(avatar).toHaveTextContent('MC');
		await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).color).toBe('rgb(255, 255, 255)');
		await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).backgroundColor).toBe('rgb(37, 99, 235)');
		await expect(canvas.queryByRole('img', { name: 'User Avatar - Jane Smith' })).toBeNull();
	},
};

export const ChildTooltip: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { avatars: [{ first: 'Jane', last: 'Smith' }], onToolTip: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('img');
		await userEvent.hover(avatar);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Jane Smith' }, ref: expect.objectContaining({ current: avatar }) }),
			undefined,
		);
		await userEvent.unhover(avatar);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null, undefined);
	},
};

export const SeparatedAvatars: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { avatars: [{ first: 'Jane' }, { first: 'Morgan' }], size: 40, overlap: -8, gap: 8 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const avatars = within(canvasElement).getAllByRole('img');
		await expect(avatars[1].getBoundingClientRect().left - avatars[0].getBoundingClientRect().left).toBe(48);
	},
};

const groupPhoto = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#2563eb"/></svg>')}`;

export const StableRecordIdentity: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: function ReorderExample(args) {
		const [people, setPeople] = useState<AvatarInfo[]>([
			{ id: 0, first: 'Jane', last: 'Smith', email: 'jane@example.com', image: groupPhoto },
			{ id: 'morgan', first: 'Morgan', last: 'Chen' },
		]);
		return (
			<>
				<AvatarGroup {...args} avatars={people} />
				<button
					type="button"
					onClick={() =>
						setPeople((previous) =>
							previous
								.map((person) => (person.id === 0 ? { ...person, email: 'updated@example.com' } : person))
								.reverse(),
						)
					}
				>
					Reorder people
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const jane = canvas.getByRole('img', { name: 'User Avatar - Jane Smith' });
		const morgan = canvas.getByRole('img', { name: 'User Avatar - Morgan Chen' });
		const image = jane.querySelector('img') as HTMLImageElement;
		await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
		await userEvent.click(canvas.getByRole('button', { name: 'Reorder people' }));
		await expect(canvas.getAllByRole('img')[0]).toBe(morgan);
		await expect(canvas.getByRole('img', { name: 'User Avatar - Jane Smith' })).toBe(jane);
		await expect(jane.querySelector('img')).toBe(image);
		await expect(image).toHaveAttribute('data-loaded', 'true');
		await expect(jane).not.toHaveAttribute('id');
	},
};

export const LazyLoadingPhotos: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		avatars: [{ id: 'jane', first: 'Jane', image: '/public/images/profile-male-02.jpg?avatar-group-lazy' }],
		lazyLoad: true,
	},
	render: (args) => (
		<div style={{ paddingTop: 10000 }}>
			<AvatarGroup {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const avatar = within(canvasElement).getByRole('img');
		const image = avatar.querySelector('img') as HTMLImageElement;
		await expect(image).toHaveAttribute('loading', 'lazy');
		await expect(avatar).toHaveTextContent('J');
		avatar.scrollIntoView();
		await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
		await expect(avatar).not.toHaveTextContent('J');
	},
};

export const EagerLoadingByDefault: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { avatars: [{ id: 'jane', first: 'Jane', image: groupPhoto }] },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const image = within(canvasElement).getByRole('img').querySelector('img') as HTMLImageElement;
		await expect(image).toHaveAttribute('loading', 'eager');
		await waitFor(() => expect(image).toHaveAttribute('data-loaded', 'true'));
	},
};

const typographyPeople: AvatarInfo[] = [
	{ id: 'jane', first: 'Jane' },
	{ id: 'morgan', first: 'Morgan' },
];

export const UpdatingTypography: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: function TypographyExample(args) {
		const [textSize, setTextSize] = useState<'s' | 'xl'>('s');
		return (
			<>
				<AvatarGroup {...args} avatars={typographyPeople} size={48} textSize={textSize} />
				<button type="button" onClick={() => setTextSize('xl')}>
					Change typography
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatars = canvas.getAllByRole('img');
		const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
		const expectedSize = (token: string) => {
			const value = getComputedStyle(avatars[0]).getPropertyValue(`--font-size-${token}`).trim();
			return `${Number.parseFloat(value) * (value.endsWith('rem') ? rem : 1)}px`;
		};
		for (const avatar of avatars)
			await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).fontSize).toBe(expectedSize('s'));
		await userEvent.click(canvas.getByRole('button', { name: 'Change typography' }));
		for (const avatar of avatars) {
			await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).fontSize).toBe(expectedSize('xl'));
			await expect(avatar.getBoundingClientRect().width).toBe(48);
		}
	},
};

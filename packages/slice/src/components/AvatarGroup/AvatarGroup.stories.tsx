import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, useState } from 'react';
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
import { Avatar } from '../Avatar';

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

export const DefaultSizeFromRecords: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: () => <AvatarGroup avatars={[{ first: 'Jane' }, { first: 'Morgan' }, { first: 'Alex' }]} limit={2} />,
	play: async ({ canvasElement }) => {
		const avatars = within(canvasElement).getAllByRole('img');
		await expect(avatars).toHaveLength(3);
		for (const avatar of avatars) {
			await expect(avatar.getBoundingClientRect().width).toBe(40);
			await expect(avatar.getBoundingClientRect().height).toBe(40);
		}
	},
};

export const DefaultSizeFromChildren: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: () => (
		<AvatarGroup size={undefined}>
			<Avatar name="Jane" />
			<Avatar name="Morgan" size={undefined} />
			<Avatar name="Alex" size={56} />
		</AvatarGroup>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const name of ['Jane', 'Morgan', 'Alex']) {
			const avatar = canvas.getByRole('img', { name: `User Avatar - ${name}` });
			const expectedSize = name === 'Alex' ? 56 : 40;
			await expect(avatar.getBoundingClientRect().width).toBe(expectedSize);
			await expect(avatar.getBoundingClientRect().height).toBe(expectedSize);
		}
	},
};

export const AccessibleGroupName: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: () => (
		<>
			<AvatarGroup avatars={[{ first: 'Jane' }]} />
			<AvatarGroup groupName="  Project collaborators  ">
				<Avatar name="Morgan" />
			</AvatarGroup>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('group', { name: 'people' })).toBeVisible();
		const custom = canvas.getByRole('group', { name: 'Project collaborators' });
		await expect(within(custom).getByRole('img', { name: 'User Avatar - Morgan' })).toBeVisible();
		await expect(custom).not.toHaveAttribute('groupName');
	},
};

export const ManagedGroupSemantics: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: () => {
		const raw = { role: 'presentation', 'aria-label': 'Override', 'aria-labelledby': 'external', 'aria-hidden': true };
		return <AvatarGroup {...raw} groupName="   " avatars={[{ first: 'Jane' }]} data-testid="managed-group" />;
	},
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'people' });
		await expect(group).toHaveAttribute('data-testid', 'managed-group');
		await expect(group).not.toHaveAttribute('aria-labelledby');
		await expect(group).not.toHaveAttribute('aria-hidden');
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
	render: () => (
		<AvatarGroup>
			<Avatar name="Default border" />
			<Avatar name="Custom border" borderWidth={1} />
		</AvatarGroup>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, borderWidth] of [
			['Default border', '0px'],
			['Custom border', '1px'],
		]) {
			const avatar = canvas.getByRole('img', { name: `User Avatar - ${name}` });
			await expect(getComputedStyle(avatar).borderTopWidth).toBe('3px');
			await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).borderTopWidth).toBe(borderWidth);
		}
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

export const Children: StoryObj<typeof AvatarGroup> = {
	render: (args) => (
		<AvatarGroup {...args} size={48} borderWidth={2}>
			<>
				<Avatar name="Child Jane" />
				<Avatar name="Child John" size={60} borderWidth={0} />
			</>
		</AvatarGroup>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const jane = canvas.getByRole('img', { name: 'User Avatar - Child Jane' });
		const john = canvas.getByRole('img', { name: 'User Avatar - Child John' });
		await expect(canvas.getAllByRole('img')).toHaveLength(2);
		await expect(jane.getBoundingClientRect().width).toBe(48);
		await expect(john.getBoundingClientRect().width).toBe(60);
		await expect(getComputedStyle(jane.firstElementChild as HTMLElement).borderTopWidth).toBe('2px');
		await expect(getComputedStyle(john.firstElementChild as HTMLElement).borderTopWidth).toBe('0px');
		await expect(john.parentElement?.getBoundingClientRect().left).toBe(
			(jane.parentElement as HTMLElement).getBoundingClientRect().right - 8,
		);
	},
};

export const EmptyChildrenOverrideArray: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: (args) => (
		<>
			<AvatarGroup {...args}>{null}</AvatarGroup>
			<AvatarGroup {...args}>{[]}</AvatarGroup>
		</>
	),
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryAllByRole('img')).toHaveLength(0);
	},
};

export const ChildEventsBubble: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { onClick: fn() },
	render: (args) => (
		<AvatarGroup {...args}>
			<Avatar
				name="Open profile"
				info={{ id: 'jane' }}
				onClick={(event, info) => {
					event.currentTarget.dataset.person = info?.id;
				}}
			/>
		</AvatarGroup>
	),
	play: async ({ canvasElement, args }) => {
		const avatar = within(canvasElement).getByRole('button');
		await userEvent.click(avatar);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(avatar).toHaveAttribute('data-person', 'jane');
		avatar.focus();
		await userEvent.keyboard('{Enter}');
		await expect(args.onClick).toHaveBeenCalledTimes(2);
	},
};

export const ChildStopsPropagation: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { onClick: fn() },
	render: (args) => (
		<AvatarGroup {...args}>
			<Avatar name="Private action" onClick={(event) => event.stopPropagation()} />
		</AvatarGroup>
	),
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button'));
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const ChildTooltipOverridesDefault: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { onToolTip: fn() },
	render: (args) => {
		const [label, setLabel] = useState('');
		return (
			<>
				<AvatarGroup {...args}>
					<Avatar name="Own tooltip" onToolTip={(tip) => setLabel(tip ? 'Own tooltip' : '')} />
					<Avatar name="Group tooltip" />
				</AvatarGroup>
				<output aria-label="Tooltip label">{label}</output>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const own = canvas.getByRole('img', { name: 'User Avatar - Own tooltip' });
		await userEvent.hover(own);
		await expect(canvas.getByLabelText('Tooltip label')).toHaveTextContent('Own tooltip');
		await userEvent.unhover(own);
		await expect(canvas.getByLabelText('Tooltip label')).toHaveTextContent('');
		await expect(args.onToolTip).not.toHaveBeenCalled();
		await userEvent.hover(canvas.getByRole('img', { name: 'User Avatar - Group tooltip' }));
		await expect(args.onToolTip).toHaveBeenCalledWith(
			expect.objectContaining({ payload: { label: 'Group tooltip' } }),
			undefined,
		);
	},
};

const overflowPeople: AvatarInfo[] = Array.from({ length: 15 }, (_, index) => ({
	id: index,
	first: `Person ${index + 1}`,
}));

export const Limited: StoryObj<typeof AvatarGroup> = {
	args: { avatars: overflowPeople, limit: 5, size: 48, onMore: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole('img')).toHaveLength(5);
		await expect(canvas.queryByRole('img', { name: 'User Avatar - Person 6' })).not.toBeInTheDocument();
		const more = canvas.getByRole('button', { name: '10 more avatars' });
		await expect(more).toHaveTextContent('+10');
		await expect(more.getBoundingClientRect().width).toBe(48);
		await userEvent.click(more);
		await expect(args.onMore).toHaveBeenCalledTimes(1);
		await expect(args.onMore).toHaveBeenCalledWith({
			source: 'avatars',
			more: overflowPeople.slice(5),
			all: overflowPeople,
		});
	},
};

export const MoreKeyboardActivation: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { avatars: overflowPeople, limit: 5, onMore: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const more = within(canvasElement).getByRole('button', { name: '10 more avatars' });
		const frame = more.firstElementChild as HTMLElement;
		const background = getComputedStyle(frame).backgroundColor;
		more.focus();
		await expect(getComputedStyle(frame).backgroundColor).toBe(background);
		await userEvent.keyboard('{Enter}');
		await expect(args.onMore).toHaveBeenCalledTimes(1);
		await userEvent.keyboard(' ');
		await expect(args.onMore).toHaveBeenCalledTimes(2);
	},
};

export const LimitedChildren: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { limit: 1, onMore: fn() },
	render: (args) => (
		<AvatarGroup {...args}>
			{false}
			{null}
			<>
				<Avatar key="jane" name="Visible Jane" info={{ id: 'jane' }} />
				<Fragment key="nested">
					<Avatar key="john" name="Hidden John" info={{ id: 'john' }} />
				</Fragment>
			</>
			<Avatar key="morgan" name="Hidden Morgan" info={{ id: 'morgan' }} />
		</AvatarGroup>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole('img')).toHaveLength(1);
		await expect(canvas.getByRole('img')).toHaveAccessibleName('User Avatar - Visible Jane');
		await expect(canvas.queryByRole('img', { name: 'User Avatar - Hidden John' })).not.toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: '2 more avatars' }));
		await expect(args.onMore).toHaveBeenCalledWith({
			source: 'children',
			more: [
				expect.objectContaining({ props: expect.objectContaining({ name: 'Hidden John', info: { id: 'john' } }) }),
				expect.objectContaining({ props: expect.objectContaining({ name: 'Hidden Morgan' }) }),
			],
			all: [
				expect.objectContaining({ props: expect.objectContaining({ name: 'Visible Jane' }) }),
				expect.objectContaining({ props: expect.objectContaining({ name: 'Hidden John' }) }),
				expect.objectContaining({ props: expect.objectContaining({ name: 'Hidden Morgan' }) }),
			],
		});
	},
};

export const MoreWithoutHandler: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { avatars: overflowPeople, limit: 5, onMore: undefined, onToolTip: fn() },
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const more = canvas.getByRole('img', { name: '10 more avatars' });
		await expect(more).toHaveTextContent('+10');
		await expect(more).not.toHaveAttribute('tabindex');
		const label = more.querySelector('span') as HTMLElement;
		await expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(
			(more.firstElementChild as HTMLElement).clientWidth,
		);
		await userEvent.hover(more);
		await expect(args.onToolTip).toHaveBeenCalledWith(
			expect.objectContaining({ payload: { label: '10 more avatars' } }),
			undefined,
		);
		await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
	},
};

export const LimitBoundaries: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: () => (
		<>
			<AvatarGroup data-testid="zero" avatars={avatars} limit={0} />
			<AvatarGroup data-testid="negative" avatars={avatars} limit={-1} />
			<AvatarGroup data-testid="fraction" avatars={avatars} limit={1.9} />
			<AvatarGroup data-testid="equal" avatars={avatars} limit={2} />
			<AvatarGroup data-testid="large" avatars={avatars} limit={10} />
			<AvatarGroup data-testid="nan" avatars={avatars} limit={Number.NaN} />
			<AvatarGroup data-testid="infinite" avatars={avatars} limit={Number.POSITIVE_INFINITY} />
			<AvatarGroup data-testid="empty" avatars={[]} limit={0} />
			<AvatarGroup data-testid="null" avatars={avatars} limit={0}>
				{null}
			</AvatarGroup>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const name of ['zero', 'negative']) {
			const group = within(canvas.getByTestId(name));
			await expect(group.getAllByRole('img')).toHaveLength(1);
			await expect(group.getByRole('img')).toHaveTextContent('+2');
		}
		await expect(within(canvas.getByTestId('fraction')).getByRole('img', { name: '1 more avatar' })).toHaveTextContent(
			'+1',
		);
		for (const name of ['equal', 'large', 'nan', 'infinite']) {
			const group = within(canvas.getByTestId(name));
			await expect(group.getAllByRole('img')).toHaveLength(2);
			await expect(group.queryByText(/^\+/)).not.toBeInTheDocument();
		}
		for (const name of ['empty', 'null'])
			await expect(within(canvas.getByTestId(name)).queryAllByRole('img')).toHaveLength(0);
	},
};

export const UpdatingLimitAndPeople: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: { onMore: fn() },
	render: (args) => {
		const [updated, setUpdated] = useState(false);
		return (
			<>
				<AvatarGroup
					{...args}
					avatars={updated ? overflowPeople.slice(0, 8) : overflowPeople}
					limit={updated ? 2 : 5}
				/>
				<button type="button" onClick={() => setUpdated(true)}>
					Update people
				</button>
			</>
		);
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Update people' }));
		await expect(canvas.getAllByRole('img')).toHaveLength(2);
		await userEvent.click(canvas.getByRole('button', { name: '6 more avatars' }));
		await expect(args.onMore).toHaveBeenCalledTimes(1);
		await expect(args.onMore).toHaveBeenCalledWith({
			source: 'avatars',
			more: overflowPeople.slice(2, 8),
			all: overflowPeople.slice(0, 8),
		});
	},
};

export const BackgroundColorDefaults: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	args: {
		avatars: [{ first: 'Inherited' }, { first: 'Custom', backgroundColor: '#ff0000' }, { first: 'Hidden' }],
		backgroundColor: '#2563eb',
		limit: 2,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const name of ['User Avatar - Inherited', '1 more avatar']) {
			const avatar = canvas.getByRole('img', { name });
			await expect(getComputedStyle(avatar.firstElementChild as HTMLElement).backgroundColor).toBe('rgb(37, 99, 235)');
		}
		await expect(
			getComputedStyle(canvas.getByRole('img', { name: 'User Avatar - Custom' }).firstElementChild as HTMLElement)
				.backgroundColor,
		).toBe('rgb(255, 0, 0)');
		await expect(getComputedStyle(canvas.getByTestId('avatar-group')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
	},
};

export const UpdatingChildBackgroundDefault: StoryObj<typeof AvatarGroup> = {
	tags: ['tests'],
	render: (args) => {
		const [color, setColor] = useState<string | undefined>('#2563eb');
		return (
			<>
				<AvatarGroup {...args} backgroundColor={color} limit={2}>
					<Avatar name="Inherited" backgroundColor={undefined} />
					<Avatar name="Transparent" backgroundColor="transparent" />
					<Avatar name="Hidden" />
				</AvatarGroup>
				<button type="button" onClick={() => setColor(undefined)}>
					Clear group color
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const inherited = canvas.getByRole('img', { name: 'User Avatar - Inherited' }).firstElementChild as HTMLElement;
		const overflow = canvas.getByRole('img', { name: '1 more avatar' }).firstElementChild as HTMLElement;
		const transparent = canvas.getByRole('img', { name: 'User Avatar - Transparent' }).firstElementChild as HTMLElement;
		await expect(getComputedStyle(inherited).backgroundColor).toBe('rgb(37, 99, 235)');
		await expect(getComputedStyle(overflow).backgroundColor).toBe('rgb(37, 99, 235)');
		await expect(getComputedStyle(transparent).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		await userEvent.click(canvas.getByRole('button', { name: 'Clear group color' }));
		await expect(getComputedStyle(inherited).getPropertyValue('--avatar-bg-color').trim()).toBe(
			getComputedStyle(inherited).getPropertyValue('--core-surface-secondary').trim(),
		);
		await expect(getComputedStyle(inherited).backgroundColor).toBe(getComputedStyle(overflow).backgroundColor);
		await expect(getComputedStyle(transparent).backgroundColor).toBe('rgba(0, 0, 0, 0)');
	},
};

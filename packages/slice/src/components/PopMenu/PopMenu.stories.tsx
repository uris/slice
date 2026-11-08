import type { Meta, StoryObj } from '@storybook/react';
import { Fragment, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { FlexDiv } from '../FlexDiv';
import { PopMenu } from './PopMenu';
import { PopMenuGroup } from './PopMenuGroup';
import { PopMenuItem } from './PopMenuItem';
import type { PopMenuProps, PopMenuSubMenuProps } from './_types';

function ColorsMenu({ caller, level, dismissAll }: PopMenuSubMenuProps) {
	return (
		<PopMenu caller={caller} level={level} dismissAll={dismissAll} options={[{ label: 'Red' }, { label: 'Blue' }]} />
	);
}

const colorsSubMenu = (props: PopMenuSubMenuProps) => <ColorsMenu {...props} />;

function Preview(args: PopMenuProps) {
	const [caller, setCaller] = useState<HTMLElement | undefined>(undefined);

	return (
		<FlexDiv absolute gap={24} justify={'center'} align={'center'}>
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Button 1
			</button>
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Button 2
			</button>
			{caller && <PopMenu {...args} caller={caller} onDismiss={() => setCaller(undefined)} />}
		</FlexDiv>
	);
}

const meta = {
	title: 'Components/PopMenu',
	component: PopMenu,
	parameters: { layout: 'fullscreen' },
	args: {
		offset: 'bottom',
		gap: 8,
		minWidth: 200,
		options: [
			{ label: 'Edit', icon: 'editor.edit', shortcut: '\u2318+E' },
			{
				label: 'Colors ...',
				subMenu: colorsSubMenu,
			},
			{ label: 'Archived', icon: 'basic.archive', toggle: true, toggled: true },
		],
	},
	argTypes: {
		caller: { control: false },
		offset: { control: 'inline-radio', options: ['top', 'bottom', 'right'] },
		gap: { control: { type: 'number', min: 0 } },
	},
	render: (args) => <Preview {...args} />,
} satisfies Meta<typeof PopMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: StoryObj<typeof PopMenu> = {
	render: (args) => {
		return <Preview {...args} />;
	},
};

export const ItemEvents: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ id: 'edit', label: 'Edit', autoDismiss: false },
			{ id: 'enable', label: 'Enable', toggle: true, toggled: false },
			{ id: 'disable', label: 'Disable', toggle: true, toggled: true },
			{ id: 'colors', label: 'Colors', subMenu: colorsSubMenu },
		],
		onClickItem: fn(),
		onHoverItem: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const item = await canvas.findByRole('button', { name: 'Edit' });
		await waitFor(() => expect(item.closest('[role="menu"]')).not.toHaveAttribute('inert'));
		await userEvent.hover(item);
		await expect(args.onHoverItem).toHaveBeenCalledWith(expect.anything(), { id: 'edit', label: 'Edit' });
		await userEvent.click(item);
		await expect(args.onClickItem).toHaveBeenCalledTimes(1);
		await expect(args.onClickItem).toHaveBeenCalledWith(expect.anything(), {
			id: 'edit',
			label: 'Edit',
			autoDismiss: false,
			dismissAll: expect.any(Function),
		});
		await userEvent.click(canvas.getByRole('button', { name: 'Enable' }));
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), {
			id: 'enable',
			label: 'Enable',
			dismissAll: expect.any(Function),
			toggle: true,
			toggled: true,
		});
		await userEvent.click(canvas.getByRole('button', { name: /^Disable/ }));
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), {
			id: 'disable',
			label: 'Disable',
			dismissAll: expect.any(Function),
			toggle: true,
			toggled: false,
		});
		await userEvent.click(canvas.getByRole('button', { name: /^Colors/ }));
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), {
			id: 'colors',
			label: 'Colors',
			subMenu: colorsSubMenu,
			dismissAll: expect.any(Function),
		});
	},
};

export const Submenu: Story = {
	args: {
		level: 2,
		options: [{ label: 'Colors', subMenu: colorsSubMenu }],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const caller = await canvas.findByRole('button', { name: /^Colors/ });
		const parent = caller.closest('[role="menu"]');
		await waitFor(() => expect(parent).not.toHaveAttribute('inert'));
		await userEvent.click(caller);
		const red = await page.findByRole('button', { name: 'Red' });
		const submenu = red.closest('[role="menu"]') as HTMLElement;
		await waitFor(() => expect(submenu).not.toHaveAttribute('inert'));
		await expect(submenu).toBeVisible();
		await expect(submenu.style.getPropertyValue('--pop-top')).toBeTruthy();
		await expect(Number(submenu.style.zIndex)).toBeGreaterThan(Number((parent as HTMLElement).style.zIndex));
		await expect((parent as HTMLElement).style.zIndex).toBe('12');
		await expect(submenu.style.zIndex).toBe('13');
		await userEvent.click(red);
		await waitFor(() => expect(page.queryByRole('button', { name: 'Red' })).not.toBeInTheDocument());
		await waitFor(() => expect(canvas.queryByRole('button', { name: /^Colors/ })).not.toBeInTheDocument());
	},
};

function DismissAllPreview() {
	const [caller, setCaller] = useState<HTMLElement>();
	const [confirming, setConfirming] = useState(false);
	const dismissAll = () => setCaller(undefined);

	return (
		<FlexDiv absolute justify="center" align="center">
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Open actions
			</button>
			{caller && (
				<PopMenu
					caller={caller}
					dismissAll={dismissAll}
					options={[
						{
							label: 'More actions',
							subMenu: (submenuProps) => (
								<PopMenu
									{...submenuProps}
									options={[
										{
											label: 'Danger zone',
											subMenu: (nestedProps) => (
												<PopMenu
													{...nestedProps}
													options={[{ label: 'Delete' }]}
													onClickItem={(_event, item) => {
														item.dismissAll();
														setConfirming(true);
													}}
												/>
											),
										},
									]}
								/>
							),
						},
					]}
				/>
			)}
			{confirming && (
				<div role="dialog" aria-label="Confirm deletion">
					<p>Delete this item?</p>
					<button type="button" onClick={() => setConfirming(false)}>
						Cancel
					</button>
				</div>
			)}
		</FlexDiv>
	);
}

export const DismissAll: Story = {
	render: () => <DismissAllPreview />,
	play: async ({ canvasElement }) => {
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(page.getByRole('button', { name: 'Open actions' }));
		await userEvent.click(await page.findByRole('button', { name: /^More actions/ }));
		await userEvent.click(await page.findByRole('button', { name: /^Danger zone/ }));
		await userEvent.click(await page.findByRole('button', { name: 'Delete' }));
		await expect(page.getByRole('dialog', { name: 'Confirm deletion' })).toBeVisible();
		await expect(page.queryAllByRole('menu')).toHaveLength(0);
		await userEvent.click(page.getByRole('button', { name: 'Cancel' }));
	},
};

export const ReplaceSubmenuBranch: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ label: 'Edit', autoDismiss: false },
			{
				label: 'Colors',
				subMenu: (props) => (
					<PopMenu
						{...props}
						options={[
							{ label: 'Red' },
							{
								label: 'Shades',
								subMenu: (nestedProps) => <PopMenu {...nestedProps} options={[{ label: 'Dark red' }]} />,
							},
						]}
					/>
				),
			},
		],
	},
	play: async ({ canvasElement }) => {
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(page.getByRole('button', { name: 'Button 1' }));
		const colors = await page.findByRole('button', { name: /^Colors/ });
		const parent = colors.closest('[role="menu"]');
		await userEvent.click(colors);
		await userEvent.click(await page.findByRole('button', { name: /^Shades/ }));
		await waitFor(() => expect(page.getByRole('button', { name: 'Dark red' })).toBeVisible());

		// Clicking the same opener replaces its old branch, including descendants.
		await userEvent.click(colors);
		await expect(page.queryByRole('button', { name: 'Dark red' })).not.toBeInTheDocument();
		await waitFor(() => expect(page.getByRole('button', { name: 'Red' })).toBeVisible());
		await userEvent.click(await page.findByRole('button', { name: /^Shades/ }));
		await waitFor(() => expect(page.getByRole('button', { name: 'Dark red' })).toBeVisible());

		// A sibling action removes the entire child branch and retains the parent.
		await userEvent.click(page.getByRole('button', { name: 'Edit' }));
		await expect(page.queryByRole('button', { name: 'Red' })).not.toBeInTheDocument();
		await expect(page.queryByRole('button', { name: 'Dark red' })).not.toBeInTheDocument();
		await expect(parent).not.toHaveAttribute('inert');
		await userEvent.click(colors);
		await waitFor(() => expect(page.getByRole('button', { name: 'Red' })).toBeVisible());
	},
};

export const AutoDismiss: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ label: 'Keep open', autoDismiss: false },
			{ label: 'Toggle', toggle: true },
			{ label: 'Toggle and close', toggle: true, autoDismiss: true },
			{ label: 'Action' },
		],
		onClickItem: fn((event) => {
			// The app receives the click while the menu is still active.
			expect(event.currentTarget.closest('[role="menu"]')).not.toHaveAttribute('inert');
		}),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const open = canvas.getByRole('button', { name: 'Button 1' });
		await userEvent.click(open);
		await userEvent.click(await canvas.findByRole('button', { name: 'Keep open' }));
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle' }));
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle and close' }));
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
		await userEvent.click(open);
		await userEvent.click(await canvas.findByRole('button', { name: 'Action' }));
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
		await expect(args.onClickItem).toHaveBeenCalledTimes(4);
	},
};

export const Grouped: Story = {
	args: {
		options: [
			{ title: 'Appearance', textSize: 's', items: [{ id: 'colors', label: 'Colors', subMenu: colorsSubMenu }] },
			{
				title: 'Actions',
				items: [
					{ id: 'archived', label: 'Archived', toggle: true },
					{ id: 'edit', label: 'Edit' },
				],
			},
		],
		onClickItem: fn(),
		onHoverItem: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const appearance = await canvas.findByRole('group', { name: 'Appearance' });
		const actions = canvas.getByRole('group', { name: 'Actions' });
		await expect(getComputedStyle(appearance).borderTopWidth).toBe('0px');
		await expect(getComputedStyle(appearance).marginTop).toBe('0px');
		await expect(getComputedStyle(canvas.getByText('Appearance')).paddingTop).toBe('0px');
		await expect(getComputedStyle(actions).borderTopWidth).toBe('1px');
		await expect(getComputedStyle(actions).marginBottom).toBe('0px');
		await expect(getComputedStyle(canvas.getByText('Actions')).paddingTop).toBe('8px');
		await expect(getComputedStyle(canvas.getByText('Actions')).paddingLeft).toBe('10px');
		await userEvent.click(within(appearance).getByRole('button', { name: /^Colors/ }));
		await waitFor(() => expect(page.getByRole('button', { name: 'Red' })).toBeVisible());
		const toggle = within(actions).getByRole('button', { name: 'Archived' });
		await userEvent.hover(toggle);
		await expect(args.onHoverItem).toHaveBeenCalledWith(expect.anything(), { id: 'archived', label: 'Archived' });
		await userEvent.click(toggle);
		await expect(args.onClickItem).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				id: 'archived',
				toggle: true,
				toggled: true,
			}),
		);
		await expect(page.queryByRole('button', { name: 'Red' })).not.toBeInTheDocument();
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(within(actions).getByRole('button', { name: 'Edit' }));
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ id: 'edit' }));
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

const composedGroupClick = fn();
const composedItemClick = fn();

export const ComposedGroups: Story = {
	args: {
		options: undefined,
		children: (
			<>
				<PopMenuGroup title="Appearance" borderWidth={0} items={[{ label: 'Colors', subMenu: colorsSubMenu }]} />
				<PopMenuGroup title="Actions" onClickItem={composedGroupClick}>
					<Fragment key="action-items">
						<PopMenuItem id="keep" label="Keep open" autoDismiss={false} onClick={composedItemClick} />
					</Fragment>
				</PopMenuGroup>
				<PopMenuGroup>
					<PopMenuItem label="Close" />
				</PopMenuGroup>
			</>
		),
		onClickItem: fn(),
	},
	play: async ({ canvasElement, args }) => {
		composedGroupClick.mockClear();
		composedItemClick.mockClear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const appearance = await canvas.findByRole('group', { name: 'Appearance' });
		await expect(getComputedStyle(appearance).borderTopWidth).toBe('0px');
		await userEvent.click(within(appearance).getByRole('button', { name: /^Colors/ }));
		await waitFor(() => expect(page.getByRole('button', { name: 'Red' })).toBeVisible());
		await userEvent.click(canvas.getByRole('button', { name: 'Keep open' }));
		await expect(composedGroupClick).toHaveBeenCalledTimes(1);
		await expect(composedItemClick).toHaveBeenCalledTimes(1);
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ id: 'keep' }));
		await expect(page.queryByRole('button', { name: 'Red' })).not.toBeInTheDocument();
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const GroupSpacing: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ label: 'Before groups', autoDismiss: false },
			{ title: 'First group', items: [{ label: 'First action' }] },
			{
				title: 'Custom spacing',
				padding: '12px 16px 4px',
				gap: 6,
				borderWidth: 2,
				borderColor: '#123456',
				items: [{ label: 'Second action' }],
			},
			{ items: [{ label: 'Untitled action' }] },
			{ title: 'Zero spacing', padding: 0, gap: 0, borderWidth: 0, items: [{ label: 'Last action' }] },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const first = await canvas.findByRole('group', { name: 'First group' });
		// Ordinary items preceding the first group do not change first-group rules.
		await expect(getComputedStyle(first).borderTopWidth).toBe('0px');
		await expect(getComputedStyle(first).marginTop).toBe('0px');
		await expect(getComputedStyle(canvas.getByText('First group')).paddingTop).toBe('0px');

		const custom = canvas.getByRole('group', { name: 'Custom spacing' });
		const titleStyle = getComputedStyle(canvas.getByText('Custom spacing'));
		await expect(titleStyle.paddingTop).toBe('12px');
		await expect(titleStyle.paddingRight).toBe('16px');
		await expect(titleStyle.paddingBottom).toBe('4px');
		await expect(getComputedStyle(custom).marginTop).toBe('6px');
		await expect(getComputedStyle(custom).marginBottom).toBe('6px');
		await expect(getComputedStyle(custom).borderTopWidth).toBe('2px');
		await expect(getComputedStyle(custom).borderTopColor).toBe('rgb(18, 52, 86)');

		const untitled = canvas.getByRole('button', { name: 'Untitled action' }).closest('[role="group"]') as HTMLElement;
		await expect(getComputedStyle(untitled).paddingTop).toBe('2px');
		await expect(untitled).not.toHaveAttribute('aria-labelledby');
		const last = canvas.getByRole('group', { name: 'Zero spacing' });
		await expect(getComputedStyle(last).borderTopWidth).toBe('0px');
		await expect(getComputedStyle(last).marginTop).toBe('0px');
		await expect(getComputedStyle(last).marginBottom).toBe('0px');
		await expect(getComputedStyle(canvas.getByText('Zero spacing')).paddingTop).toBe('0px');
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const CustomContentHover: Story = {
	tags: ['tests'],
	args: {
		options: undefined,
		children: (
			<PopMenuItem
				id="custom"
				label="Custom option"
				autoDismiss={false}
				backgroundColor="#ffffff"
				backgroundColorHover="#123456"
				textColor="#112233"
				textColorHover="#ffffff"
				padding={6}
			>
				<span>Custom option</span>
			</PopMenuItem>
		),
		onClickItem: fn(),
		onHoverItem: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const button = await canvas.findByRole('button', { name: 'Custom option' });
		const content = within(button).getByText('Custom option');
		const row = button.firstElementChild as HTMLElement;
		await expect(getComputedStyle(row).backgroundColor).toBe('rgb(255, 255, 255)');
		await expect(getComputedStyle(content).color).toBe('rgb(17, 34, 51)');
		await expect(getComputedStyle(row).padding).toBe('6px');
		await userEvent.hover(content);
		const { MODE } = (import.meta as ImportMeta & { env: { MODE: string } }).env;
		if (MODE === 'test') {
			// CSS :hover needs a real pointer; synthetic events only exercise callbacks.
			const { userEvent: pointer } = await import('vitest/browser');
			await pointer.hover(content);
			await expect(getComputedStyle(row).backgroundColor).toBe('rgb(18, 52, 86)');
			await expect(getComputedStyle(content).color).toBe('rgb(255, 255, 255)');
			await pointer.unhover(content);
		}
		await expect(args.onHoverItem).toHaveBeenCalledWith(expect.anything(), { id: 'custom', label: 'Custom option' });
		await userEvent.click(content);
		await expect(args.onClickItem).toHaveBeenCalledTimes(1);
		await expect(args.onClickItem).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ id: 'custom', label: 'Custom option' }),
		);
		await userEvent.unhover(content);
		await expect(getComputedStyle(row).backgroundColor).toBe('rgb(255, 255, 255)');
		await expect(getComputedStyle(content).color).toBe('rgb(17, 34, 51)');
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const AccessibleNames: Story = {
	tags: ['tests'],
	args: {
		name: 'Project actions',
		id: 'project-actions',
		options: undefined,
		children: (
			<>
				<PopMenuGroup title="Actions">
					<PopMenuItem id="edit-action" label="Edit" icon="editor.edit" />
					<PopMenuItem label="Save" name="Save changes" />
					<PopMenuItem id="id-only">
						<span>Custom text</span>
					</PopMenuItem>
					<PopMenuItem>
						<span>Natural custom name</span>
					</PopMenuItem>
					<PopMenuItem />
				</PopMenuGroup>
				<PopMenuGroup title="Visible title" name="Named section" />
				<PopMenuGroup id="untitled-section" />
				<PopMenuGroup title="  " id="blank-title-section" />
				<PopMenuGroup />
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const menu = await canvas.findByRole('menu', { name: 'Project actions' });
		await expect(menu).toHaveAttribute('id', 'project-actions');
		await expect(menu).not.toHaveAttribute('aria-labelledby');
		await expect(canvas.getByRole('button', { name: 'Edit' })).toHaveAttribute('id', 'edit-action');
		await expect(canvas.getByRole('button', { name: 'Edit' }).querySelector('[aria-hidden="true"]')).not.toBeNull();
		await expect(canvas.getByRole('button', { name: 'Save changes' })).toHaveTextContent('Save');
		await expect(canvas.getByRole('button', { name: 'id-only' })).toHaveTextContent('Custom text');
		await expect(canvas.getByRole('button', { name: 'Natural custom name' })).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: 'Menu item' })).toBeInTheDocument();
		const group = canvas.getByRole('group', { name: 'Actions' });
		const titleId = group.getAttribute('aria-labelledby');
		await expect(canvasElement.ownerDocument.getElementById(titleId ?? '')).toHaveTextContent('Actions');
		await expect(canvas.getByRole('group', { name: 'Named section' })).toHaveTextContent('Visible title');
		await expect(canvas.getByRole('group', { name: 'untitled-section' })).toHaveAttribute('id', 'untitled-section');
		await expect(canvas.getByRole('group', { name: 'Menu group' })).toBeInTheDocument();
		await expect(canvas.getByRole('group', { name: 'blank-title-section' })).not.toHaveAttribute('aria-labelledby');
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const MenuIdNameFallback: Story = {
	tags: ['tests'],
	args: { name: '  ', id: 'fallback-menu' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		await canvas.findByRole('menu', { name: 'fallback-menu' });
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const MenuDefaultName: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		await canvas.findByRole('menu', { name: 'Pop Menu' });
		await userEvent.click(canvasElement);
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

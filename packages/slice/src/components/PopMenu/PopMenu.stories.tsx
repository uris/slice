import type { Meta, StoryObj } from '@storybook/react';
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import type { KeyboardShortcut } from '../../hooks/useKeyboardShortcuts/useKeyboardShortcuts';
import { resolveShortcut } from '../../utils/functions/resolveShortcut';
import { FlexBox } from '../FlexBox';
import { PopMenu } from './PopMenu';
import { PopMenuGroup } from './PopMenuGroup';
import { PopMenuItem } from './PopMenuItem';
import type {
	PopMenuItemGroupProps,
	PopMenuItemProps,
	PopMenuProps,
	PopMenuSubMenuProps,
	PropMenuEntry,
} from './_types';

function ColorsMenu({ caller, level, dismissAll }: PopMenuSubMenuProps) {
	return (
		<PopMenu caller={caller} level={level} dismissAll={dismissAll} options={[{ label: 'Red' }, { label: 'Blue' }]} />
	);
}

const colorsSubMenu = (props: PopMenuSubMenuProps) => <ColorsMenu {...props} />;

function Preview(args: PopMenuProps) {
	const [caller, setCaller] = useState<HTMLElement | undefined>(undefined);

	return (
		<FlexBox absolute gap={24} justify={'center'} align={'center'}>
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Button 1
			</button>
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Button 2
			</button>
			{caller && <PopMenu {...args} caller={caller} onDismiss={() => setCaller(undefined)} />}
		</FlexBox>
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
			{ label: 'Edit', icon: 'editor.edit', shortcut: { name: 'Edit', key: 'e', metaPressed: true } },
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
		const item = await canvas.findByRole('menuitem', { name: 'Edit' });
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
		await userEvent.click(canvas.getByRole('menuitemcheckbox', { name: 'Enable' }));
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), {
			id: 'enable',
			label: 'Enable',
			dismissAll: expect.any(Function),
			toggle: true,
			toggled: true,
		});
		await userEvent.click(canvas.getByRole('menuitemcheckbox', { name: /^Disable/ }));
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), {
			id: 'disable',
			label: 'Disable',
			dismissAll: expect.any(Function),
			toggle: true,
			toggled: false,
		});
		await userEvent.click(canvas.getByRole('menuitem', { name: /^Colors/ }));
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
		const caller = await canvas.findByRole('menuitem', { name: /^Colors/ });
		const parent = caller.closest('[role="menu"]');
		await waitFor(() => expect(parent).not.toHaveAttribute('inert'));
		await userEvent.click(caller);
		const red = await page.findByRole('menuitem', { name: 'Red' });
		const submenu = red.closest('[role="menu"]') as HTMLElement;
		await waitFor(() => expect(submenu).not.toHaveAttribute('inert'));
		await expect(submenu).toBeVisible();
		await expect(submenu.style.getPropertyValue('--pop-top')).toBeTruthy();
		await expect(Number(submenu.style.zIndex)).toBeGreaterThan(Number((parent as HTMLElement).style.zIndex));
		await expect((parent as HTMLElement).style.zIndex).toBe('12');
		await expect(submenu.style.zIndex).toBe('13');
		await userEvent.click(red);
		await waitFor(() => expect(page.queryByRole('menuitem', { name: 'Red' })).not.toBeInTheDocument());
		await waitFor(() => expect(canvas.queryByRole('menuitem', { name: /^Colors/ })).not.toBeInTheDocument());
	},
};

function DismissAllPreview() {
	const [caller, setCaller] = useState<HTMLElement>();
	const [confirming, setConfirming] = useState(false);
	const dismissAll = () => setCaller(undefined);

	return (
		<FlexBox absolute justify="center" align="center">
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
		</FlexBox>
	);
}

export const DismissAll: Story = {
	render: () => <DismissAllPreview />,
	play: async ({ canvasElement }) => {
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(page.getByRole('button', { name: 'Open actions' }));
		await userEvent.click(await page.findByRole('menuitem', { name: /^More actions/ }));
		await userEvent.click(await page.findByRole('menuitem', { name: /^Danger zone/ }));
		await userEvent.click(await page.findByRole('menuitem', { name: 'Delete' }));
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
		const colors = await page.findByRole('menuitem', { name: /^Colors/ });
		const parent = colors.closest('[role="menu"]');
		await userEvent.click(colors);
		await userEvent.click(await page.findByRole('menuitem', { name: /^Shades/ }));
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Dark red' })).toBeVisible());

		// Clicking the same opener replaces its old branch, including descendants.
		await userEvent.click(colors);
		await expect(page.queryByRole('menuitem', { name: 'Dark red' })).not.toBeInTheDocument();
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Red' })).toBeVisible());
		await userEvent.click(await page.findByRole('menuitem', { name: /^Shades/ }));
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Dark red' })).toBeVisible());

		// A sibling action removes the entire child branch and retains the parent.
		await userEvent.click(page.getByRole('menuitem', { name: 'Edit' }));
		await expect(page.queryByRole('menuitem', { name: 'Red' })).not.toBeInTheDocument();
		await expect(page.queryByRole('menuitem', { name: 'Dark red' })).not.toBeInTheDocument();
		await expect(parent).not.toHaveAttribute('inert');
		await userEvent.click(colors);
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Red' })).toBeVisible());
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
		await userEvent.click(await canvas.findByRole('menuitem', { name: 'Keep open' }));
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(canvas.getByRole('menuitemcheckbox', { name: 'Toggle' }));
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(canvas.getByRole('menuitemcheckbox', { name: 'Toggle and close' }));
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
		await userEvent.click(open);
		await userEvent.click(await canvas.findByRole('menuitem', { name: 'Action' }));
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
		await userEvent.click(within(appearance).getByRole('menuitem', { name: /^Colors/ }));
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Red' })).toBeVisible());
		const toggle = within(actions).getByRole('menuitemcheckbox', { name: 'Archived' });
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
		await expect(page.queryByRole('menuitem', { name: 'Red' })).not.toBeInTheDocument();
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(within(actions).getByRole('menuitem', { name: 'Edit' }));
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
		await userEvent.click(within(appearance).getByRole('menuitem', { name: /^Colors/ }));
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Red' })).toBeVisible());
		await userEvent.click(canvas.getByRole('menuitem', { name: 'Keep open' }));
		await expect(composedGroupClick).toHaveBeenCalledTimes(1);
		await expect(composedItemClick).toHaveBeenCalledTimes(1);
		await expect(args.onClickItem).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ id: 'keep' }));
		await expect(page.queryByRole('menuitem', { name: 'Red' })).not.toBeInTheDocument();
		await expect(canvas.getByRole('menu')).not.toHaveAttribute('inert');
		await userEvent.click(canvas.getByRole('menuitem', { name: 'Close' }));
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

		const untitled = canvas.getByRole('menuitem', { name: 'Untitled action' }).closest('[role="group"]') as HTMLElement;
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
		const button = await canvas.findByRole('menuitem', { name: 'Custom option' });
		button.blur();
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
		button.blur();
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
		await expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('id', 'edit-action');
		await expect(canvas.getByRole('menuitem', { name: 'Edit' }).querySelector('[aria-hidden="true"]')).not.toBeNull();
		await expect(canvas.getByRole('menuitem', { name: 'Save changes' })).toHaveTextContent('Save');
		await expect(canvas.getByRole('menuitem', { name: 'id-only' })).toHaveTextContent('Custom text');
		await expect(canvas.getByRole('menuitem', { name: 'Natural custom name' })).toBeInTheDocument();
		await expect(canvas.getByRole('menuitem', { name: 'Menu item' })).toBeInTheDocument();
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

export const KeyboardNavigation: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ label: 'First', autoDismiss: false },
			{ label: 'Colors', subMenu: colorsSubMenu },
			{ label: 'Checked', toggle: true, toggled: true },
		],
	},
	play: async ({ canvasElement }) => {
		const page = within(canvasElement.ownerDocument.body);
		const trigger = page.getByRole('button', { name: 'Button 1' });
		await userEvent.click(trigger);
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'First' })).toHaveFocus());
		await userEvent.keyboard('{ArrowDown}{ArrowRight}');
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Red' })).toHaveFocus());
		await expect(page.getByRole('menuitem', { name: 'Colors' })).toHaveAttribute('aria-expanded', 'true');
		const submenu = page.getByRole('menuitem', { name: 'Red' }).closest('[role="menu"]') as HTMLElement;
		submenu.dispatchEvent(new Event('scroll'));
		await userEvent.click(submenu);
		await expect(page.getAllByRole('menu')).toHaveLength(2);
		page.getByRole('menuitem', { name: 'Red' }).focus();
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Colors' })).toHaveFocus());
		await waitFor(() =>
			expect(page.getByRole('menuitem', { name: 'Colors' })).toHaveAttribute('aria-expanded', 'false'),
		);
		await userEvent.keyboard('{End}');
		await expect(page.getByRole('menuitemcheckbox', { name: 'Checked' })).toHaveFocus();
		await expect(page.getByRole('menuitemcheckbox', { name: 'Checked' })).toHaveAttribute('aria-checked', 'true');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(trigger).toHaveFocus());
	},
};

export const ItemAttributes: Story = {
	tags: ['tests'],
	args: {
		options: undefined,
		children: (
			<PopMenuGroup title="Actions">
				<PopMenuItem label="Unavailable" disabled onClick={fn()} />
				<PopMenuItem
					label="Custom"
					aria-label="Custom action"
					className="custom-action"
					style={{ opacity: 0.9 }}
					autoDismiss={false}
				/>
			</PopMenuGroup>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const disabled = await canvas.findByRole('menuitem', { name: 'Unavailable' });
		await expect(disabled).toBeDisabled();
		const custom = canvas.getByRole('menuitem', { name: 'Custom action' });
		await expect(custom).toHaveClass('custom-action');
		await expect(custom).toHaveStyle({ opacity: '0.9' });
		await userEvent.click(canvas.getByText('Actions'));
		await expect(canvas.getByRole('menu')).toBeVisible();
	},
};

export const TabLeavesMenu: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
		await userEvent.tab();
		await expect(canvas.getByRole('button', { name: 'Button 2' })).toHaveFocus();
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const DisabledColors: Story = {
	tags: ['tests'],
	args: {
		options: undefined,
		children: (
			<PopMenuGroup
				title="Actions"
				items={[
					{
						label: 'Disabled action',
						disabled: true,
						icon: 'editor.edit',
						shortcut: '⌘E',
						textColorDisabled: '#123456',
						iconColorDisabled: '#654321',
						textColorHover: '#ff0000',
						iconColorHover: '#ff0000',
						backgroundColor: '#ffffff',
						backgroundColorHover: '#ff0000',
					},
				]}
			/>
		),
		onClickItem: fn(),
		onHoverItem: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const item = await canvas.findByRole('menuitem', { name: 'Disabled action' });
		await expect(item).toBeDisabled();
		const row = item.firstElementChild as HTMLElement;
		await userEvent.hover(item);
		const { MODE } = (import.meta as ImportMeta & { env: { MODE: string } }).env;
		if (MODE === 'test') {
			const { userEvent: pointer } = await import('vitest/browser');
			await pointer.hover(item);
		}
		await expect(getComputedStyle(row).color).toBe('rgb(18, 52, 86)');
		await expect(getComputedStyle(row).backgroundColor).toBe('rgb(255, 255, 255)');
		await expect(getComputedStyle(canvas.getByText('⌘E')).color).toBe('rgb(18, 52, 86)');
		await expect(getComputedStyle(item.querySelector('svg [stroke]') as SVGElement).stroke).toBe('rgb(101, 67, 33)');
		await userEvent.click(item);
		await expect(args.onClickItem).not.toHaveBeenCalled();
		await expect(args.onHoverItem).not.toHaveBeenCalled();
	},
};

export const IconCssStates: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ label: 'Edit', icon: 'editor.edit', iconColor: '#123456', iconColorHover: '#654321', autoDismiss: false },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const item = await canvas.findByRole('menuitem', { name: 'Edit' });
		const icon = item.querySelector('svg [stroke]') as SVGElement;
		item.blur();
		const { MODE } = (import.meta as ImportMeta & { env: { MODE: string } }).env;
		if (MODE === 'test') {
			const { userEvent: pointer } = await import('vitest/browser');
			await pointer.hover(item);
			await waitFor(() => expect(getComputedStyle(icon).stroke).toBe('rgb(101, 67, 33)'));
			await pointer.unhover(item);
			await waitFor(() => expect(getComputedStyle(icon).stroke).toBe('rgb(18, 52, 86)'));
		}
		canvas.getByRole('button', { name: 'Button 1' }).focus();
		await userEvent.keyboard('{ArrowDown}');
		item.focus();
		await expect(item.matches(':focus-visible')).toBe(true);
		await waitFor(() => expect(getComputedStyle(icon).stroke).toBe('rgb(101, 67, 33)'));
	},
};

function StableKeysPreview() {
	const [reversed, setReversed] = useState(false);
	const items = [
		{ id: 'stable-group-a', label: 'Grouped duplicate', autoDismiss: false },
		{ id: 'stable-group-b', label: 'Grouped duplicate', autoDismiss: false },
	];
	const options: PropMenuEntry<DocumentActionData>[] = [
		{ id: 'stable-a', label: reversed ? 'Renamed' : 'Duplicate', autoDismiss: false },
		{ id: 'stable-b', label: 'Duplicate', autoDismiss: false },
		{ id: 'stable-group', title: reversed ? 'Renamed group' : 'Group', items: reversed ? [...items].reverse() : items },
	];
	return <Preview options={reversed ? [...options].reverse() : options} onClickItem={() => setReversed(true)} />;
}

export const StableEntryIdentity: Story = {
	tags: ['tests'],
	render: () => <StableKeysPreview />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const roots = await canvas.findAllByRole('menuitem', { name: 'Duplicate' });
		const group = canvas.getByRole('group', { name: 'Group' });
		const grouped = within(group).getAllByRole('menuitem', { name: 'Grouped duplicate' });
		await userEvent.click(roots[0]);
		await expect(canvas.getByRole('menuitem', { name: 'Renamed' })).toBe(roots[0]);
		await expect(canvas.getByRole('menuitem', { name: 'Duplicate' })).toBe(roots[1]);
		await expect(canvas.getByRole('group', { name: 'Renamed group' })).toBe(group);
		const reordered = within(group).getAllByRole('menuitem', { name: 'Grouped duplicate' });
		await expect(reordered).toEqual([grouped[1], grouped[0]]);
		await expect(roots[0]).toHaveFocus();
	},
};

export const DuplicateLabelsWithoutIds: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ label: 'Duplicate' },
			{ label: 'Duplicate' },
			{ items: [{ label: 'Grouped duplicate' }, { label: 'Grouped duplicate' }] },
			{ items: [{ label: 'Other group' }] },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		await expect(await canvas.findAllByRole('menuitem', { name: 'Duplicate' })).toHaveLength(2);
		await expect(canvas.getAllByRole('group', { name: 'Menu group' })).toHaveLength(2);
		await expect(canvas.getAllByRole('menuitem', { name: 'Grouped duplicate' })).toHaveLength(2);
	},
};

function PortalPreview({ mode }: { mode: 'auto' | 'custom' | 'inline' | 'dialog' }) {
	const [caller, setCaller] = useState<HTMLElement>();
	const [target, setTarget] = useState<HTMLDivElement | null>(null);
	const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
	useEffect(() => {
		if (mode !== 'dialog' || !dialog) return;
		dialog.showModal();
		return () => dialog.close();
	}, [mode, dialog]);
	const getPortalContainer = () => {
		if (mode === 'inline') return false;
		if (mode === 'custom') return target ?? undefined;
		return 'auto' as const;
	};
	const content = (
		<div data-slice-theme-scope style={{ color: 'rgb(12, 34, 56)' }}>
			<div ref={setTarget} aria-label="Custom portal host" />
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Open portal menu
			</button>
			{caller && (
				<PopMenu
					caller={caller}
					portalContainer={getPortalContainer()}
					onDismiss={() => setCaller(undefined)}
					options={[{ label: 'Colors', subMenu: colorsSubMenu }]}
				/>
			)}
		</div>
	);
	if (mode === 'dialog')
		return (
			<dialog ref={setDialog} aria-label="Portal dialog">
				{content}
			</dialog>
		);
	return content;
}

async function checkPortalBranch(canvasElement: HTMLElement, mode: 'auto' | 'custom' | 'inline' | 'dialog') {
	const canvas = within(canvasElement);
	const page = within(canvasElement.ownerDocument.body);
	await userEvent.click(canvas.getByRole('button', { name: 'Open portal menu' }));
	const opener = await page.findByRole('menuitem', { name: 'Colors' });
	const menu = opener.closest('[role="menu"]') as HTMLElement;
	const host = menu.parentElement;
	if (mode === 'inline') await expect(host).not.toHaveAttribute('data-slice-pop-menu-host');
	else if (mode === 'custom') await expect(host).toHaveAttribute('aria-label', 'Custom portal host');
	else await expect(host).toHaveAttribute('data-slice-pop-menu-host');
	if (mode === 'dialog') await expect(menu.closest('dialog')).toBe(canvas.getByRole('dialog'));
	await expect(getComputedStyle(menu).color).toBe('rgb(12, 34, 56)');
	await userEvent.click(opener);
	const red = await page.findByRole('menuitem', { name: 'Red' });
	await expect(red.closest('[role="menu"]')?.parentElement).toBe(host);
	await userEvent.keyboard('{Escape}');
	await waitFor(() => expect(opener).toHaveFocus());
	await userEvent.keyboard('{Escape}');
	await waitFor(() => expect(page.queryByRole('menuitem', { name: 'Colors' })).not.toBeInTheDocument());
	if (mode === 'auto' || mode === 'dialog') await expect(host).not.toBeInTheDocument();
	else await expect(host).toBeInTheDocument();
}

export const AutomaticPortal: Story = {
	tags: ['tests'],
	render: () => <PortalPreview mode="auto" />,
	play: async ({ canvasElement }) => checkPortalBranch(canvasElement, 'auto'),
};
export const CustomPortal: Story = {
	tags: ['tests'],
	render: () => <PortalPreview mode="custom" />,
	play: async ({ canvasElement }) => checkPortalBranch(canvasElement, 'custom'),
};
export const InlinePortal: Story = {
	tags: ['tests'],
	render: () => <PortalPreview mode="inline" />,
	play: async ({ canvasElement }) => checkPortalBranch(canvasElement, 'inline'),
};
export const DialogPortal: Story = {
	tags: ['tests'],
	render: () => <PortalPreview mode="dialog" />,
	play: async ({ canvasElement }) => checkPortalBranch(canvasElement, 'dialog'),
};

function ShadowPortalPreview() {
	const [root, setRoot] = useState<ShadowRoot>();
	return (
		<>
			<div
				ref={(element) => {
					if (!element || element.shadowRoot) return;
					const shadow = element.attachShadow({ mode: 'open' });
					// Shadow consumers provide their own stylesheet scope.
					for (const stylesheet of Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')))
						shadow.appendChild(stylesheet.cloneNode(true));
					setRoot(shadow);
				}}
			/>
			{root && createPortal(<PortalPreview mode="auto" />, root)}
		</>
	);
}

export const ShadowPortal: Story = {
	tags: ['tests'],
	render: () => <ShadowPortalPreview />,
	play: async ({ canvasElement }) => {
		const host = Array.from(canvasElement.querySelectorAll('div')).find((element) => element.shadowRoot);
		if (!host?.shadowRoot) throw new Error('Missing shadow fixture');
		const shadow = host.shadowRoot;
		const scope = within(shadow as unknown as HTMLElement);
		await userEvent.click(scope.getByRole('button', { name: 'Open portal menu' }));
		const opener = await scope.findByRole('menuitem', { name: 'Colors' });
		const menu = opener.closest('[role="menu"]') as HTMLElement;
		await expect(menu.getRootNode()).toBe(shadow);
		await userEvent.click(opener);
		const red = await scope.findByRole('menuitem', { name: 'Red' });
		await expect(red.closest('[role="menu"]')?.parentElement).toBe(menu.parentElement);
		(red.closest('[role="menu"]') as HTMLElement).click();
		await expect(scope.getAllByRole('menu')).toHaveLength(2);
		await userEvent.click(red);
		await waitFor(() => expect(scope.queryAllByRole('menu')).toHaveLength(0));
	},
};

function WrappedItem(props: PopMenuItemProps) {
	return (
		<div style={{ width: '100%' }}>
			<PopMenuItem {...props} />
		</div>
	);
}
function WrappedGroup(props: PopMenuItemGroupProps) {
	return <PopMenuGroup {...props} />;
}
const wrappedClickOrder: string[] = [];
const wrappedHoverOrder: string[] = [];

export const WrappedCallbacks: Story = {
	tags: ['tests'],
	args: {
		options: undefined,
		children: (
			<WrappedGroup
				title="Wrapped actions"
				onClickItem={() => wrappedClickOrder.push('group')}
				onHoverItem={() => wrappedHoverOrder.push('group')}
			>
				<WrappedItem
					label="Wrapped action"
					autoDismiss={false}
					onClick={() => wrappedClickOrder.push('item')}
					onHover={() => wrappedHoverOrder.push('item')}
				/>
			</WrappedGroup>
		),
		onClickItem: () => wrappedClickOrder.push('menu'),
		onHoverItem: () => wrappedHoverOrder.push('menu'),
	},
	play: async ({ canvasElement }) => {
		wrappedClickOrder.length = 0;
		wrappedHoverOrder.length = 0;
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const item = await canvas.findByRole('menuitem', { name: 'Wrapped action' });
		await userEvent.hover(item);
		await expect(wrappedHoverOrder).toEqual(['item', 'group', 'menu']);
		await userEvent.click(item);
		await expect(wrappedClickOrder).toEqual(['item', 'group', 'menu']);
		await expect(canvas.getByRole('menu')).toBeVisible();
	},
};

export const WrappedSubmenu: Story = {
	tags: ['tests'],
	args: {
		options: undefined,
		children: (
			<WrappedGroup title="Wrapped actions">
				<WrappedItem label="Wrapped colors" subMenu={colorsSubMenu} />
			</WrappedGroup>
		),
		onClickItem: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const opener = await canvas.findByRole('menuitem', { name: 'Wrapped colors' });
		await waitFor(() => expect(opener).toHaveFocus());
		await userEvent.keyboard('{ArrowRight}');
		const red = await page.findByRole('menuitem', { name: 'Red' });
		await expect(opener).toHaveAttribute('aria-expanded', 'true');
		await userEvent.click(red);
		await waitFor(() => expect(page.queryAllByRole('menu')).toHaveLength(0));
		await expect(args.onClickItem).toHaveBeenCalledTimes(1);
	},
};

function ResolvedShortcutPreview() {
	const shortcut: KeyboardShortcut = { key: 'k', name: 'Quick open', metaPressed: true, shiftPressed: true };
	return <Preview options={[{ label: shortcut.name, shortcut }]} />;
}

export const ResolvedShortcut: Story = {
	tags: ['tests'],
	render: () => <ResolvedShortcutPreview />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Button 1' }));
		const item = await canvas.findByRole('menuitem', { name: 'Quick open' });
		await expect(item).toHaveTextContent(
			resolveShortcut({ key: 'k', name: 'Quick open', metaPressed: true, shiftPressed: true }),
		);
	},
};

function mockMotionPreference(initial: boolean) {
	const original = window.matchMedia.bind(window);
	let reduced = initial;
	const listeners = new Set<EventListener>();
	const query = {
		get matches() {
			return reduced;
		},
		media: '(prefers-reduced-motion: reduce)',
		onchange: null,
		addEventListener: (_type: string, listener: EventListener) => listeners.add(listener),
		removeEventListener: (_type: string, listener: EventListener) => listeners.delete(listener),
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => true,
	} as MediaQueryList;
	const mock = spyOn(window, 'matchMedia').mockImplementation((value) =>
		value === query.media ? query : original(value),
	);
	return {
		set: (value: boolean) => {
			reduced = value;
			for (const listener of listeners) listener(new Event('change'));
		},
		restore: () => mock.mockRestore(),
	};
}
function ReducedMotionPreview(args: PopMenuProps) {
	const [caller, setCaller] = useState<HTMLElement>();
	return (
		<>
			<button type="button" onClick={(event) => setCaller(event.currentTarget)}>
				Open reduced menu
			</button>
			{caller && (
				<PopMenu
					{...args}
					caller={caller}
					onDismiss={() => {
						args.onDismiss?.();
						setCaller(undefined);
					}}
				/>
			)}
		</>
	);
}
export const ReducedMotion: Story = {
	tags: ['tests'],
	beforeEach: () => {
		const preference = mockMotionPreference(true);
		return preference.restore;
	},
	args: {
		options: [{ label: 'Colors', subMenu: colorsSubMenu }],
		transition: { duration: 10, delay: 10 },
		motionValues: {
			initial: { x: -100, opacity: 0 },
			animate: { x: 100, opacity: 1, transition: { duration: 10, delay: 10 } },
			exit: { x: -100, opacity: 0 },
		},
		onDismiss: fn(),
	},
	render: (args) => <ReducedMotionPreview {...args} />,
	play: async ({ canvasElement, args }) => {
		const page = within(canvasElement.ownerDocument.body);
		const trigger = page.getByRole('button', { name: 'Open reduced menu' });
		await userEvent.click(trigger);
		const colors = await page.findByRole('menuitem', { name: 'Colors' });
		await waitFor(() => expect(colors).toHaveFocus(), { timeout: 500 });
		const menu = colors.closest('[role="menu"]') as HTMLElement;
		await expect(getComputedStyle(menu).opacity).toBe('1');
		await expect(getComputedStyle(menu).transform).toBe('none');
		await userEvent.keyboard('{ArrowRight}');
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Red' })).toHaveFocus(), { timeout: 500 });
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(page.queryByRole('menuitem', { name: 'Red' })).not.toBeInTheDocument(), {
			timeout: 500,
		});
		await expect(colors).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(page.queryByRole('menu')).not.toBeInTheDocument(), { timeout: 500 });
		await expect(args.onDismiss).toHaveBeenCalledTimes(1);
		await expect(trigger).toHaveFocus();
	},
};
let changeMotionPreference: ((value: boolean) => void) | undefined;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	beforeEach: () => {
		const preference = mockMotionPreference(false);
		changeMotionPreference = preference.set;
		return () => {
			changeMotionPreference = undefined;
			preference.restore();
		};
	},
	args: { options: [{ label: 'Edit' }], transition: { duration: 10, delay: 10 }, onDismiss: fn() },
	render: (args) => <ReducedMotionPreview {...args} />,
	play: async ({ canvasElement, args }) => {
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(page.getByRole('button', { name: 'Open reduced menu' }));
		const item = await page.findByRole('menuitem', { name: 'Edit' });
		changeMotionPreference?.(true);
		await waitFor(() => expect(getComputedStyle(item.closest('[role="menu"]') as HTMLElement).opacity).toBe('1'), {
			timeout: 500,
		});
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(page.queryByRole('menu')).not.toBeInTheDocument(), { timeout: 500 });
		await expect(args.onDismiss).toHaveBeenCalledTimes(1);
	},
};

interface DocumentActionData {
	documentId: string;
}
function PayloadMenu({ composed = false }: { composed?: boolean }) {
	const [caller, setCaller] = useState<HTMLButtonElement>();
	const [events, setEvents] = useState<string[]>([]);
	const report = (level: string, documentId?: string) =>
		setEvents((previous) => [...previous, `${level}:${documentId ?? ''}`]);
	const close = () => {
		report('dismiss');
		setCaller(undefined);
	};
	const options: PropMenuEntry<DocumentActionData>[] = [
		{
			id: 'direct',
			label: 'Open document',
			data: { documentId: 'doc-42' },
			onClick: (event, item) => {
				report(event.currentTarget.tagName, item.data?.documentId);
			},
		},
		{
			id: 'documents',
			title: 'Documents',
			onClickItem: (_event, item) => report('group', item.data?.documentId),
			items: [
				{
					id: 'grouped',
					label: 'Open grouped document',
					data: { documentId: 'doc-99' },
					onClick: (_event, item) => report('item', item.data?.documentId),
				},
			],
		},
	];
	return (
		<>
			<button
				type="button"
				onClick={(event) => {
					setEvents([]);
					setCaller(event.currentTarget);
				}}
			>
				Open typed menu
			</button>
			<output aria-label="Callback order">{events.join(',')}</output>
			{caller && (
				<PopMenu
					caller={caller}
					name="Document actions"
					transition={{ duration: 0 }}
					options={composed ? undefined : options}
					onDismiss={close}
					onClickItem={(_event, item) => report('menu', item.data?.documentId)}
				>
					{composed ? (
						<PopMenuGroup<DocumentActionData>
							title="Documents"
							onClickItem={(_event, item) => report('group', item.data?.documentId)}
						>
							<PopMenuItem
								label="Open composed document"
								data={{ documentId: 'doc-77' }}
								onClick={(event, item) => {
									report(event.currentTarget.tagName, item.data?.documentId);
								}}
							/>
						</PopMenuGroup>
					) : undefined}
				</PopMenu>
			)}
		</>
	);
}
export const OptionCallbacksWithData: Story = {
	tags: ['tests'],
	render: () => <PayloadMenu />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open typed menu' }));
		const direct = await canvas.findByRole('menuitem', { name: 'Open document' });
		await expect(direct).not.toHaveAttribute('data');
		await userEvent.click(direct);
		await waitFor(() =>
			expect(canvas.getByLabelText('Callback order')).toHaveTextContent('BUTTON:doc-42,menu:doc-42,dismiss:'),
		);
		await userEvent.click(canvas.getByRole('button', { name: 'Open typed menu' }));
		const grouped = await canvas.findByRole('menuitem', { name: 'Open grouped document' });
		grouped.focus();
		await userEvent.keyboard('{Enter}');
		await waitFor(() =>
			expect(canvas.getByLabelText('Callback order')).toHaveTextContent(
				'item:doc-99,group:doc-99,menu:doc-99,dismiss:',
			),
		);
	},
};
export const ComposedCallbacksWithData: Story = {
	tags: ['tests'],
	render: () => <PayloadMenu composed />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open typed menu' }));
		await userEvent.click(await canvas.findByRole('menuitem', { name: 'Open composed document' }));
		await waitFor(() =>
			expect(canvas.getByLabelText('Callback order')).toHaveTextContent(
				'BUTTON:doc-77,group:doc-77,menu:doc-77,dismiss:',
			),
		);
	},
};

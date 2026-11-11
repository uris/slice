import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { getPopMenu, popMenuActions } from '../../stores/popMenu';
import { PopMenu, type PopMenuProps } from '../PopMenu';
import { PopMenuController } from './PopMenuController';

function ComposedMenu(props: PopMenuProps) {
	return <PopMenu {...props} options={[{ label: 'Composed action' }]} />;
}

function Preview() {
	return (
		<div data-testid="popmenu-preview" style={{ padding: 48, minHeight: '70vh' }}>
			<button
				type="button"
				onClick={(event) =>
					popMenuActions.push({
						caller: event.currentTarget,
						name: 'Actions',
						options: [{ label: 'Edit' }, { label: 'Archive', toggle: true }],
					})
				}
			>
				Props menu
			</button>
			<button type="button" onClick={(event) => popMenuActions.push(<ComposedMenu caller={event.currentTarget} />)}>
				Composed menu
			</button>
			<button type="button" onClick={() => popMenuActions.clear()}>
				Clear menu
			</button>
			<PopMenuController />
		</div>
	);
}

const meta = {
	title: 'Components/PopMenuController',
	component: PopMenuController,
	render: () => <Preview />,
} satisfies Meta<typeof PopMenuController>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await expect(page.queryByRole('menu')).not.toBeInTheDocument();
		const trigger = canvas.getByRole('button', { name: 'Props menu' });
		// Finish any scroll needed to reach the trigger before scroll-to-dismiss is installed.
		trigger.scrollIntoView({ block: 'nearest' });
		await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
		await userEvent.click(trigger);
		const menu = await page.findByRole('menu', { name: 'Actions' });
		await waitFor(() => {
			expect(menu).not.toHaveAttribute('inert');
			expect(getComputedStyle(menu).pointerEvents).toBe('auto');
		});
		// The automatic portal is outside the preview, so canvas-scoped queries cannot find it.
		expect(canvas.getByTestId('popmenu-preview')).not.toContainElement(menu);
		await userEvent.click(within(menu).getByRole('menuitem', { name: 'Edit' }));
		await waitFor(() => expect(getPopMenu()).toBeNull());
	},
};

export const Composed: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Composed menu' }));
		await userEvent.click(await page.findByRole('menuitem', { name: 'Composed action' }));
		await waitFor(() => expect(getPopMenu()).toBeNull());
	},
};

export const OutsideDismiss: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		const onDismiss = fn();
		popMenuActions.push(
			<PopMenu
				caller={canvas.getByRole('button', { name: 'Props menu' })}
				options={[{ label: 'Edit' }]}
				onDismiss={onDismiss}
			/>,
		);
		await page.findByRole('menuitem', { name: 'Edit' });
		await userEvent.click(canvasElement);
		await waitFor(() => expect(getPopMenu()).toBeNull());
		await expect(onDismiss).toHaveBeenCalledTimes(1);
	},
};

export const ReplacementSurvivesOldDismiss: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		const caller = canvas.getByRole('button', { name: 'Props menu' });
		popMenuActions.push({
			caller,
			options: [{ label: 'Replace' }],
			onClickItem: () => {
				popMenuActions.push({ caller, options: [{ label: 'Replacement' }] });
			},
		});
		await userEvent.click(await page.findByRole('menuitem', { name: 'Replace' }));
		await waitFor(() => expect(page.getByRole('menuitem', { name: 'Replacement' })).toBeVisible());
		await expect(page.queryByRole('menuitem', { name: 'Replace' })).not.toBeInTheDocument();
		popMenuActions.clear();
	},
};

export const ClearAndPushNull: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		await userEvent.click(canvas.getByRole('button', { name: 'Props menu' }));
		await page.findByRole('menuitem', { name: 'Edit' });
		popMenuActions.push(null);
		await waitFor(() => expect(page.queryByRole('menu')).not.toBeInTheDocument());
		await userEvent.click(canvas.getByRole('button', { name: 'Composed menu' }));
		await page.findByRole('menuitem', { name: 'Composed action' });
		popMenuActions.clear();
		await waitFor(() => expect(page.queryByRole('menu')).not.toBeInTheDocument());
	},
};

export const SubmenuDismissAll: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		const dismissAll = fn();
		popMenuActions.push({
			caller: canvas.getByRole('button', { name: 'Props menu' }),
			dismissAll,
			options: [{ label: 'Colors', subMenu: (props) => <PopMenu {...props} options={[{ label: 'Red' }]} /> }],
		});
		await userEvent.click(await page.findByRole('menuitem', { name: /^Colors/ }));
		await userEvent.click(await page.findByRole('menuitem', { name: 'Red' }));
		await waitFor(() => expect(getPopMenu()).toBeNull());
		await expect(dismissAll).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(page.queryByRole('menuitem', { name: 'Red' })).not.toBeInTheDocument());
	},
};

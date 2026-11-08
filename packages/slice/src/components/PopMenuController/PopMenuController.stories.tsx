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
		<div style={{ padding: 48, minHeight: '70vh' }}>
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
		await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Props menu' }));
		const edit = await canvas.findByRole('button', { name: 'Edit' });
		await userEvent.click(edit);
		await waitFor(() => expect(getPopMenu()).toBeNull());
	},
};

export const Composed: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Composed menu' }));
		await userEvent.click(await canvas.findByRole('button', { name: 'Composed action' }));
		await waitFor(() => expect(getPopMenu()).toBeNull());
	},
};

export const OutsideDismiss: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		const onDismiss = fn();
		popMenuActions.push(
			<PopMenu
				caller={canvas.getByRole('button', { name: 'Props menu' })}
				options={[{ label: 'Edit' }]}
				onDismiss={onDismiss}
			/>,
		);
		await canvas.findByRole('button', { name: 'Edit' });
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
		const caller = canvas.getByRole('button', { name: 'Props menu' });
		popMenuActions.push({
			caller,
			options: [{ label: 'Replace' }],
			onClickItem: () => {
				popMenuActions.push({ caller, options: [{ label: 'Replacement' }] });
			},
		});
		await userEvent.click(await canvas.findByRole('button', { name: 'Replace' }));
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Replacement' })).toBeVisible());
		await expect(canvas.queryByRole('button', { name: 'Replace' })).not.toBeInTheDocument();
		popMenuActions.clear();
	},
};

export const ClearAndPushNull: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		popMenuActions.clear();
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Props menu' }));
		await canvas.findByRole('button', { name: 'Edit' });
		popMenuActions.push(null);
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
		await userEvent.click(canvas.getByRole('button', { name: 'Composed menu' }));
		await canvas.findByRole('button', { name: 'Composed action' });
		popMenuActions.clear();
		await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
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
		await userEvent.click(await canvas.findByRole('button', { name: /^Colors/ }));
		await userEvent.click(await page.findByRole('button', { name: 'Red' }));
		await waitFor(() => expect(getPopMenu()).toBeNull());
		await expect(dismissAll).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(page.queryByRole('button', { name: 'Red' })).not.toBeInTheDocument());
	},
};

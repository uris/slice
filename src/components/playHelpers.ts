import { expect, fireEvent, userEvent, within } from 'storybook/test';

type PlayContext<TArgs = unknown> = {
	args: TArgs;
	canvasElement: HTMLElement;
};

function asArgs(args: unknown): Record<string, unknown> {
	return (args ?? {}) as Record<string, unknown>;
}

function isFn(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === 'function';
}

function getOverlay(canvasElement: HTMLElement): HTMLElement | null {
	return canvasElement.querySelector('[class*="overlay"]') as HTMLElement | null;
}

async function expectCanvas(canvasElement: HTMLElement) {
	await expect(canvasElement).toBeInTheDocument();
	await expect(canvasElement.childElementCount).toBeGreaterThan(0);
}

export async function runAvatarGroupPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const avatars = canvas.getAllByLabelText(/User Avatar -/i);
	const storyArgs = asArgs(args);
	const expected = Array.isArray(storyArgs.avatars) ? storyArgs.avatars.length : avatars.length;
	await expect(avatars).toHaveLength(expected);
}

export async function runBadgePlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const badge = canvas.getByRole('status');
	await expect(badge).toBeInTheDocument();
	const count = asArgs(args).count;
	if (typeof count === 'number') {
		await expect(badge).toHaveTextContent(String(count));
	}
}

export async function runCheckBoxPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const checkbox = canvas.getByRole('checkbox');
	await expect(checkbox).toHaveAttribute('aria-checked', String(storyArgs.checked ?? false));
	await userEvent.click(checkbox);
	await userEvent.keyboard('{Space}');
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runDivInputPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const textbox = canvas.getByRole('textbox');
	await userEvent.click(textbox);
	await userEvent.type(textbox, 'abc');
	await userEvent.paste('pasted');
	await userEvent.keyboard('{Enter}');
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
}

export async function runDotPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const dot = canvas.getByRole('status');
	await expect(dot).toHaveAttribute('aria-label', expect.stringContaining('dot'));
}

export async function runDraggablePanelPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const handle = Array.from(canvasElement.querySelectorAll('div')).find((node) => {
		const el = node as HTMLElement;
		return el.style.cursor === 'col-resize';
	}) as HTMLElement | undefined;
	if (handle) {
		fireEvent.mouseDown(handle, { clientX: 120 });
		fireEvent.mouseMove(document.documentElement, { clientX: 180 });
		fireEvent.mouseUp(document.documentElement, { clientX: 180 });
	}
	if (isFn(storyArgs.onResizeStart)) {
		await expect(storyArgs.onResizeStart).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onResize)) {
		await expect(storyArgs.onResize).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onResizeEnd)) {
		await expect(storyArgs.onResizeEnd).toHaveBeenCalled();
	}
}

export async function runDropDownPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const select = canvas.getByRole('combobox');
	const options = select.querySelectorAll('option');
	if (options.length > 1) {
		await userEvent.selectOptions(select, options[1]);
	}
	if (isFn(storyArgs.onFocus)) {
		await expect(storyArgs.onFocus).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onValidate) && storyArgs.value === '') {
		await expect(storyArgs.onValidate).toHaveBeenCalled();
	}
}

export async function runErrorSummaryPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const entries = Array.isArray(storyArgs.entries) ? storyArgs.entries : [];

	for (const entry of entries) {
		if (
			entry &&
			typeof entry === 'object' &&
			'title' in entry &&
			typeof (entry as { title?: unknown }).title === 'string'
		) {
			const title = (entry as { title: string }).title;
			await expect(canvas.getByText((content) => content.includes(title))).toBeInTheDocument();
		}
	}
}

export async function runFlexDivPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	await expect(canvasElement.querySelector('div')).toBeInTheDocument();
}

export async function runGrouperPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const title = storyArgs.title;
	if (typeof title === 'string') {
		const group = canvas.getByText(title);
		await userEvent.click(group);
		await userEvent.keyboard('{Enter}');
	}
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runIconPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvas.getByRole('img');
	await userEvent.click(icon);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
}

export async function runIconButtonPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');
	await userEvent.click(button);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
}

export async function runLogosPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await expect(canvas.getByRole('img')).toBeInTheDocument();
}

export async function runOverlayPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const overlay = getOverlay(canvasElement);
	if (isFn(storyArgs.onClick) && storyArgs.show && overlay) {
		await fireEvent.click(overlay);
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
	if (storyArgs.global === true && isFn(storyArgs.toggleOverlay) && overlay) {
		await fireEvent.click(overlay);
		await expect(storyArgs.toggleOverlay).toHaveBeenCalledWith(false);
	}
}

export async function runPagerPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const bullets = canvasElement.querySelectorAll('input[type="button"]');
	await expect(bullets.length).toBeGreaterThan(0);
	const target = bullets.length > 1 ? bullets[1] : bullets[0];
	await userEvent.click(target as HTMLElement);
	fireEvent.keyDown(target, { key: 'Enter' });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runProgressIndicatorPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await expect(canvas.getByRole('img', { name: /Loading spinner/i })).toBeInTheDocument();
}

export async function runRadioButtonPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const optionLabel = storyArgs.label ?? undefined;
	if (typeof optionLabel === 'string') {
		await userEvent.click(canvas.getByText(optionLabel));
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runRadioButtonListPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	await userEvent.click(canvas.getByText('Option 1'));
	await userEvent.click(canvas.getByText('Option 2'));
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runSliderPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');
	if (slider) {
		fireEvent.mouseDown(slider, { clientX: 20 });
		fireEvent.mouseMove(document.documentElement, { clientX: 60 });
		fireEvent.mouseUp(document.documentElement, { clientX: 60 });
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onDragChange)) {
		await expect(storyArgs.onDragChange).toHaveBeenCalled();
	}
}

export async function runSpacerPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const spacer = canvasElement.querySelector('[style*="min-height"]') as HTMLElement | null;
	await expect(spacer).toBeInTheDocument();
	if (spacer && typeof storyArgs.size === 'number') {
		await expect(spacer).toHaveStyle({ minHeight: `${storyArgs.size}px` });
	}
}

export async function runSwitchPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const el = canvasElement.querySelector('[style*="--switch-width"]') as HTMLElement | null;
	if (el) {
		await userEvent.click(el);
		await userEvent.click(el);
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runTabBarPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	await userEvent.click(canvas.getByRole('tab', { name: /dark/i }));
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onTabChange)) {
		await expect(storyArgs.onTabChange).toHaveBeenCalled();
	}
	if (storyArgs.hasClose && isFn(storyArgs.onClose)) {
		const buttons = canvas.getAllByRole('button');
		await userEvent.click(buttons[buttons.length - 1]);
		await expect(storyArgs.onClose).toHaveBeenCalled();
	}
}

export async function runTextAreaPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const input = canvas.getByRole('textbox');
	await userEvent.click(input);
	await userEvent.type(input, 'abc');
	await userEvent.tab();
	if (isFn(storyArgs.onFocus)) {
		await expect(storyArgs.onFocus).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onBlur)) {
		await expect(storyArgs.onBlur).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (storyArgs.returnSubmits === true) {
		await userEvent.type(input, '{enter}');
		if (isFn(storyArgs.onSubmit)) {
			await expect(storyArgs.onSubmit).toHaveBeenCalled();
		}
	}
}

export async function runTextFieldPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const input = canvasElement.querySelector('input') as HTMLInputElement | null;
	await expect(input).toBeInTheDocument();
	if (!input) return;
	await userEvent.click(input);
	await userEvent.type(input, 'a');
	await userEvent.tab();
	await userEvent.click(input);
	await userEvent.type(input, 'bc');
	await userEvent.keyboard('{Enter}');
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onFocus)) {
		await expect(storyArgs.onFocus).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onBlur)) {
		await expect(storyArgs.onBlur).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onValidate) && storyArgs.value === '') {
		await expect(storyArgs.onValidate).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
	if (storyArgs.actionButton === true) {
		await userEvent.click(canvas.getByText('Translate'));
		if (isFn(storyArgs.onAction)) {
			await expect(storyArgs.onAction).toHaveBeenCalled();
		}
	}
	if (storyArgs.inputType === 'password') {
		await userEvent.click(canvas.getByRole('button', { name: /view icon/i }));
	}
}

export async function runButtonPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	await userEvent.click(canvas.getByRole('button'));
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
}

export async function runButtonBarPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const buttons = canvas.getAllByRole('button');
	if (buttons.length > 0) {
		await userEvent.hover(buttons[0] as HTMLElement);
		await userEvent.click(buttons[0] as HTMLElement);
	}
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).toHaveBeenCalled();
	}
}

export async function runCardPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	await userEvent.click(canvas.getByText('Upload or drop'));
	if (isFn(storyArgs.onCommand)) {
		await expect(storyArgs.onCommand).toHaveBeenCalled();
	}
}

export async function runChipPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const chipLabel =
		typeof storyArgs.children === 'string' || typeof storyArgs.children === 'number'
			? String(storyArgs.children)
			: typeof storyArgs.label === 'string' || typeof storyArgs.label === 'number'
				? String(storyArgs.label)
				: null;
	if (!chipLabel) return;
	const chip = canvas.getByText(chipLabel);
	await userEvent.hover(chip);
	await userEvent.click(chip);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).toHaveBeenCalled();
	}
}

export async function runUIFileIconPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvas.getByRole('img');
	await userEvent.click(icon);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
}

export async function runLabelPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const labelText =
		typeof storyArgs.children === 'string' || typeof storyArgs.children === 'number'
			? String(storyArgs.children)
			: typeof storyArgs.label === 'string'
				? storyArgs.label
				: null;

	if (!labelText) return;

	const label = canvas.getByText(labelText);
	await expect(label).toBeInTheDocument();

	if (isFn(storyArgs.onClick)) {
		await userEvent.click(label);
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
}

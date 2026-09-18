import { expect, fireEvent, spyOn, userEvent, waitFor, within } from 'storybook/test';

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

// read a storybook/test `fn()` mock's call count without widening `isFn`'s
// return type (a plain function signature) to include vitest's `Mock` shape
function mockCallCount(value: unknown): number {
	if (isFn(value) && 'mock' in value) {
		return (value as unknown as { mock: { calls: unknown[] } }).mock.calls.length;
	}
	return 0;
}

function getOverlay(canvasElement: HTMLElement): HTMLElement | null {
	return canvasElement.querySelector('[class*="overlay"]') as HTMLElement | null;
}

async function expectCanvas(canvasElement: HTMLElement) {
	await expect(canvasElement).toBeInTheDocument();
	await expect(canvasElement.childElementCount).toBeGreaterThan(0);
}

export function createFakeAudioOnlyStream(): MediaStream {
	const audioContext = new AudioContext();
	const destination = audioContext.createMediaStreamDestination();
	const oscillator = audioContext.createOscillator();
	oscillator.connect(destination);
	oscillator.start();
	return destination.stream;
}

export async function runAudioBubbleDemoPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// the Demo story drives audioStream from a real useMicrophone() call, which
	// has no device/permission in this headless browser - that's a genuine pass
	// through the "no stream" branch (setScale(minScale) + early return), left
	// alone. The stream-present branches are covered by
	// runAudioBubbleStreamLifecyclePlay's synthetic MediaStream instead.
	await expect(canvasElement.querySelector('[class*="bubble"]')).toBeInTheDocument();
}

export async function runAudioBubbleStreamLifecyclePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// providing a real (synthetic) stream exercises the visualizer construction
	// + start() path, instead of the "no stream" early return the Demo story
	// hits via its real (permission-less) getUserMedia call
	await userEvent.click(canvas.getByRole('button', { name: /start stream/i }));
	await waitFor(() => expect(canvasElement.querySelector('[class*="bubble"]')).toBeInTheDocument());

	// toggling `playing` off then on exercises the second effect's stop()/
	// start() branches
	await userEvent.click(canvas.getByRole('button', { name: /toggle playing/i }));
	await userEvent.click(canvas.getByRole('button', { name: /toggle playing/i }));

	// removing the stream exercises the cleanup path (dispose + ref reset) and
	// the first effect's "!audioStream" branch a second time, now transitioning
	// away from an active visualizer instead of never having had one
	await userEvent.click(canvas.getByRole('button', { name: /stop stream/i }));
}

export async function runAvatarGroupPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const avatars = canvas.getAllByLabelText(/User Avatar -/i);
	const storyArgs = asArgs(args);
	const expected = Array.isArray(storyArgs.avatars) ? storyArgs.avatars.length : avatars.length;
	await expect(avatars).toHaveLength(expected);
}

export async function runAvatarGroupWithoutHandlerPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// no onToolTip passed, exercising the default-arg no-op; just needs to
	// render without crashing
	await expect(canvasElement.querySelectorAll('[class*="avatar"]').length).toBeGreaterThan(0);
}

export async function runAvatarGroupCustomClassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// exercises the wrapper's `className ? ... : ''` true branch
	const wrapper = canvasElement.firstElementChild as HTMLElement | null;
	await expect(wrapper).toHaveClass('story-avatargroup-class');
}

export async function runAvatarGroupNullableSpacingPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// gap/margin forced to `null` (not `undefined`, which the destructured
	// defaults already absorb) exercises cssVars' `?? 0` fallbacks; overlap<=0
	// exercises the `overlap > 0 ? -overlap : 0` false branch
	const wrapper = canvasElement.firstElementChild as HTMLElement | null;
	await expect(wrapper?.style.getPropertyValue('--ag-gap')).toBe('0px');
	await expect(wrapper?.style.getPropertyValue('--ag-margin')).toBe('0px');
	await expect(wrapper?.style.getPropertyValue('--ag-overlap')).toBe('0px');
}

export async function runAvatarGroupNoAvatarsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// avatars forced to a falsy value (`null`, distinct from the default `[]`)
	// exercises renderedAvatars' `if (!avatars) return null;` true branch
	await expect(canvasElement.querySelectorAll('[class*="avatar"]').length).toBe(0);
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

export async function runDivInputWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	// no onChange/onSubmit/onFocus/onBlur/onDblClick/onClick passed, so this
	// exercises every default-arg no-op (`() => null`) branch; the assertions
	// below just confirm none of them throw when actually invoked.
	await userEvent.click(textbox);
	await userEvent.type(textbox, 'abc');
	fireEvent.doubleClick(textbox);
	await userEvent.keyboard('{Enter}');
	await userEvent.tab();
}

export async function runDivInputCustomClassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	// exercises the wrapper's `className ? ... : ''` true branch
	await expect(textbox.parentElement).toHaveClass('story-custom-class');
}

export async function runDivInputEmptyPlaceholderPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	// placeholder='' exercises the placeholder-tracking effect's `if
	// (placeholder)` false branch. Typing then clearing all text lands
	// handleSetValue in the `stripped.length === 0 && placeholder && ...`
	// chain with placeholder falsy, falling through to the trailing else
	// branch and its `textString || ''` fallback (textString is '').
	await userEvent.click(textbox);
	await userEvent.type(textbox, 'abc');
	await userEvent.clear(textbox);
}

export async function runDivInputClearWithPlaceholderPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	// placeholder stays truthy (default), so typing then clearing all text
	// takes the full `stripped.length === 0 && placeholder && ref.current`
	// AND-chain true, restoring the placeholder text and cursor.
	await userEvent.click(textbox);
	await userEvent.type(textbox, 'abc');
	await userEvent.clear(textbox);
}

export async function runDivInputAngleBracketBlockedPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	await userEvent.click(textbox);
	// exercises handleKeyDown's `e.key === '<' || e.key === '>'` block
	fireEvent.keyDown(textbox, { key: '<' });
	fireEvent.keyDown(textbox, { key: '>' });
}

export async function runDivInputPasteGuardsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	await userEvent.click(textbox);

	// no clipboardData at all -> handlePaste's `!e.clipboardData` true branch
	fireEvent.paste(textbox);

	// clipboardData present but with no text/plain payload -> `!textData`
	// true branch
	const emptyTransfer = new DataTransfer();
	fireEvent.paste(textbox, { clipboardData: emptyTransfer });

	// a real text payload but no active selection range -> `!selection?.
	// rangeCount` true branch
	globalThis.getSelection()?.removeAllRanges();
	const textTransfer = new DataTransfer();
	textTransfer.setData('text/plain', 'pasted text');
	fireEvent.paste(textbox, { clipboardData: textTransfer });
}

export async function runDivInputNullableStyleDefaultsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// unfocused, with padding/textAlign/clamp/backgroundColor all forced to
	// `null` (not `undefined`, since JS default-parameter values only trigger
	// on `undefined`) to exercise cssVars' `?? fallback` expressions on their
	// not-focused side.
	await expect(canvasElement.querySelector('[role="textbox"]')).toBeInTheDocument();
}

export async function runDivInputNullableBackgroundWhileFocusedPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// focus=true with backgroundColor=null exercises the
	// `isEditable && isFocused` true side of the wrapper-background `??`
	// fallback, which every other story leaves on its false (unfocused) side.
	await expect(canvasElement.querySelector('[role="textbox"]')).toBeInTheDocument();
}

export async function runDivInputNumericWidthPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// width as a number exercises setWidth's `typeof width === 'string'`
	// false branch (`${width}px`), instead of the string 'auto' every other
	// story uses.
	await expect(canvasElement.querySelector('[role="textbox"]')).toBeInTheDocument();
}

export async function runDivInputNullableValuePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// value forced to `null` exercises the render's `{value ?? placeholder}`
	// fallback, distinct from the `value === ''` branch used to seed
	// `innerText`/effects elsewhere in the component.
	const canvas = within(canvasElement);
	const textbox = canvas.getByRole('textbox');
	await expect(textbox).toHaveTextContent('Placeholder');
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
	const select = canvas.getByRole('combobox') as HTMLSelectElement;
	const options = Array.from(select.querySelectorAll('option'));

	// native change to a different option - handleChange's `index !== i` is
	// true, so onChange/onOption fire
	await userEvent.selectOptions(select, '2');
	if (isFn(storyArgs.onChange)) {
		await waitFor(() => expect(storyArgs.onChange).toHaveBeenCalledTimes(1));
	}
	if (isFn(storyArgs.onOption)) {
		await waitFor(() => expect(storyArgs.onOption).toHaveBeenCalledTimes(1));
	}

	// each <option> also wires a direct onMouseUp handler straight to
	// handleChange, independent of the native change event - firing it again
	// for the option that's already selected hits the `index !== i` false
	// (no-op) branch instead
	if (options[2]) fireEvent.mouseUp(options[2]);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalledTimes(1);
	}

	// and firing it for a genuinely different option exercises the same
	// onMouseUp wiring on the true branch too
	if (options[1]) fireEvent.mouseUp(options[1]);
	if (isFn(storyArgs.onChange)) {
		await waitFor(() => expect(storyArgs.onChange).toHaveBeenCalledTimes(2));
	}
}

export async function runDropDownDisplayTextPlay(
	{ canvasElement }: { canvasElement: HTMLElement },
	expectedText: string,
) {
	await expectCanvas(canvasElement);
	// the same text also exists inside the native <select>'s <option> elements,
	// so a canvas-wide getByText match is ambiguous - the visible face text has
	// no better accessible hook (it's a plain presentational span mirroring the
	// native select's value), so scope to it by class name instead
	const faceText = canvasElement.querySelector('[class*="faceText"]');
	await waitFor(() => expect(faceText).toHaveTextContent(expectedText));
}

export async function runDropDownRendersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await expect(canvas.getByRole('combobox')).toBeInTheDocument();
}

export async function runDropDownDisabledMouseDownPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const select = canvas.getByRole('combobox');
	// the select never gets a native `disabled` attribute (disabling is done via
	// preventDefault on mousedown so the custom face/border styling stays
	// consistent) - firing mousedown directly exercises that guard
	fireEvent.mouseDown(select);
	await expect(select).toBeInTheDocument();
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

export async function runGrouperWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// no onChange/onClick passed, so this exercises both default-arg no-ops
	const button = canvas.getByRole('button');
	await userEvent.click(button);
}

export async function runGrouperCustomClassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button');
	// exercises the `className ? ... : ''` true branch
	await expect(button).toHaveClass('story-grouper-class');
}

export async function runGrouperToggleDisabledPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');
	// toggle=false exercises handleToggle's `if (!toggle) return;` true branch
	await userEvent.click(button);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).not.toHaveBeenCalled();
	}
}

export async function runGrouperUnframedPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// unframed=true exercises cssVars' `unframed ? 'auto' : ...` true branch
	await expect(button?.style.getPropertyValue('--grouper-height')).toBe('auto');
}

export async function runGrouperNoBorderPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// border left at its falsy default (0) exercises `border ? ... : '0'`'s
	// false branch, which every other story leaves untaken since they all
	// pass a truthy border
	await expect(button?.style.getPropertyValue('--grouper-border')).toBe('0');
}

export async function runGrouperFilterBadgePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// showFilterBadge=true exercises the `showFilterBadge && <Icon .../>`
	// true branch
	await expect(canvasElement.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
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

export async function runIconButtonWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const button = canvas.getByRole('button');
	// no onClick/onToolTip passed, exercising both default-arg no-ops
	await userEvent.click(button);
}

export async function runIconButtonCustomClassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button');
	// exercises the wrapper's `className ? ... : ''` true branch
	await expect(button).toHaveClass('story-iconbutton-class');
}

export async function runIconButtonDisabledPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');
	// disabled=true exercises handleClick's `if (disabled) return;` true
	// branch, plus every disabled-gated ternary in cssVars/opacity
	await userEvent.click(button);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}
}

export async function runIconButtonHoverLeaveWithTooltipPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');
	// a real mouseleave (unhover) - nothing in this file previously fired
	// one - exercises handleMouseLeave's `if (tooltip)` true branch
	await userEvent.hover(button);
	await userEvent.unhover(button);
	if (isFn(storyArgs.onToolTip)) {
		await waitFor(() => expect(storyArgs.onToolTip).toHaveBeenCalledWith(null));
	}
}

export async function runIconButtonHoverLeaveWithoutTooltipPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const button = canvas.getByRole('button');
	// tooltip left unset - exercises handleMouseLeave's `if (tooltip)` false
	// branch
	await userEvent.hover(button);
	await userEvent.unhover(button);
	await expect(button).toBeInTheDocument();
}

export async function runIconButtonNoHoverEffectPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// hover=false exercises bgHoverColor's `if (hover)` false branch, and
	// reaches its trailing `backgroundColor ?? 'transparent'` with a real
	// (truthy) backgroundColor
	await expect(button).toBeInTheDocument();
}

export async function runIconButtonNullColorsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// backgroundColor/iconColor forced to `null` (not `undefined`, which the
	// destructured defaults already absorb), with hover=false, exercises
	// bgColorNormal's, bgHoverColor's, and setIconColor's `?? fallback`
	// branches
	await expect(button?.style.getPropertyValue('--ib-bg-color')).toBe('var(--core-surface-secondary)');
}

export async function runIconButtonNoRoundNoBorderRadiusPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// round=false exercises `round ? '100%' : ...`'s false branch; borderRadius
	// forced to `null` exercises the nested `borderRadius ?? 0` fallback
	await expect(button?.style.getPropertyValue('--ib-border-radius')).toBe('0px');
}

export async function runIconButtonBorderedPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// border=true exercises `border ? '1px' : 0`'s true branch, which every
	// other story leaves at the default false
	await expect(button?.style.getPropertyValue('--ib-border')).toBe('1px');
}

export async function runIconButtonInvalidSizePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// buttonSize forced to a falsy value exercises size's `if (!buttonSize)
	// return frameSize;` true branch
	await expect(canvasElement.querySelector('button')).toBeInTheDocument();
}

export async function runIconButtonSmallSizePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// buttonSize='s' exercises the `buttonSize === 's'` true branch
	await expect(button?.style.getPropertyValue('--ib-button-size')).toBe('24px');
}

export async function runIconButtonUnmatchedSizePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const button = canvasElement.querySelector('button') as HTMLElement | null;
	// buttonSize set to a value matching none of 's'/'m'/'l'/'xl' exercises
	// the final `if (buttonSize === 'xl')`'s false branch, leaving `size`
	// undefined and exercising `${size ?? 0}px`'s fallback
	await expect(button?.style.getPropertyValue('--ib-button-size')).toBe('0px');
}

export async function runIconButtonLabelAndCountPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// label set exercises `label && <div>...</div>`'s true branch; a nonzero
	// count exercises `count !== 0 && <div>...</div>`'s true branch
	await expect(canvas.getByText('Label text')).toBeInTheDocument();
	await expect(canvas.getByText('5')).toBeInTheDocument();
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

export async function runRadioButtonWithoutHandlerPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// no onChange provided - exercises its default no-op parameter branch
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const button = canvas.getByRole('radio');
	await userEvent.click(button);
}

export async function runRadioButtonNoDeselectPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// selected + deselect=false - clicking an already-selected option must be a
	// no-op, exercising handleChange's `isSelected && !deselect` true branch
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('radio');
	await userEvent.click(button);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).not.toHaveBeenCalled();
	}
}

export async function runRadioButtonNoLabelPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// no `label` prop - exercises setAriaLabel's fallback chain (string
	// children, or the final 'Radio Button' default) and `{label ?? children}`
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('radio');
	await userEvent.click(button);
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

export async function runSliderWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// no onChange/onDragChange provided - exercises both handlers' default
	// no-op parameter branches. A throw here would mean the defaults weren't
	// applied.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const slider = canvas.getByRole('slider');
	fireEvent.mouseDown(slider, { clientX: 20 });
	fireEvent.mouseMove(document.documentElement, { clientX: 60 });
	fireEvent.mouseUp(document.documentElement, { clientX: 60 });
}

export async function runSliderKeyboardPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// exercises handleKeyDown's PageUp/PageDown/Home/End cases plus the
	// default (unhandled key) case, whose nextValue stays null and returns
	// early without notifying either callback.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');
	slider.focus();

	fireEvent.keyDown(slider, { key: 'End' });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenLastCalledWith(100, 1);
	}

	fireEvent.keyDown(slider, { key: 'Home' });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenLastCalledWith(0, 0);
	}

	const callsBeforePage = mockCallCount(storyArgs.onChange);
	fireEvent.keyDown(slider, { key: 'PageUp' });
	fireEvent.keyDown(slider, { key: 'PageDown' });
	if (isFn(storyArgs.onChange)) {
		await expect(mockCallCount(storyArgs.onChange)).toBeGreaterThan(callsBeforePage);
	}

	// an unhandled key falls through to the switch's default case and returns
	// before ever calling either callback again
	const callsBeforeUnhandled = mockCallCount(storyArgs.onChange);
	fireEvent.keyDown(slider, { key: 'Escape' });
	if (isFn(storyArgs.onChange)) {
		await expect(mockCallCount(storyArgs.onChange)).toBe(callsBeforeUnhandled);
	}
}

export async function runSliderDisabledPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// disabled - exercises handleMouseMove/handleKeyDown/handleMouseDown's
	// `if (disabled) return;` guards taking their true branch
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');
	slider.focus();
	fireEvent.keyDown(slider, { key: 'End' });
	fireEvent.mouseDown(slider, { clientX: 20 });
	fireEvent.mouseMove(document.documentElement, { clientX: 60 });
	fireEvent.mouseUp(document.documentElement, { clientX: 60 });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).not.toHaveBeenCalled();
	}
	if (isFn(storyArgs.onDragChange)) {
		await expect(storyArgs.onDragChange).not.toHaveBeenCalled();
	}
}

export async function runSliderEdgeDragPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// drag far past both edges of the track - exercises updateSlider's
	// `pos > sliderWidth` and `pos < 0` clamping branches
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');

	fireEvent.mouseDown(slider, { clientX: 0 });
	fireEvent.mouseMove(document.documentElement, { clientX: 100000 });
	fireEvent.mouseUp(document.documentElement, { clientX: 100000 });

	fireEvent.mouseDown(slider, { clientX: 0 });
	fireEvent.mouseMove(document.documentElement, { clientX: -100000 });
	fireEvent.mouseUp(document.documentElement, { clientX: -100000 });

	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runSliderCollapsedRangePlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// scaleMin === scaleMax - exercises stepIncrement's and valueToPercent's
	// `range <= 0` guards
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');
	slider.focus();
	fireEvent.keyDown(slider, { key: 'ArrowRight' });
	fireEvent.mouseDown(slider, { clientX: 20 });
	fireEvent.mouseMove(document.documentElement, { clientX: 60 });
	fireEvent.mouseUp(document.documentElement, { clientX: 60 });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
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

	const darkTab = canvas.getByRole('tab', { name: /dark/i });
	const lightTab = canvas.getByRole('tab', { name: /light/i });

	await userEvent.click(darkTab);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onTabChange)) {
		await expect(storyArgs.onTabChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onToolTip)) {
		// handleOptionClick clears any active tooltip before switching tabs
		await expect(storyArgs.onToolTip).toHaveBeenCalledWith(null);
	}

	// keyboard navigation: every handled key, wrapping in both directions, plus
	// one unhandled key that hits the switch's default (nextIndex stays null,
	// so handleOptionKeyDown returns before calling handleOptionClick/focusOption)
	lightTab.focus();
	await userEvent.keyboard('{ArrowRight}');
	await waitFor(() => expect(document.activeElement).toBe(darkTab));
	await userEvent.keyboard('{ArrowRight}');
	await waitFor(() => expect(document.activeElement).toBe(lightTab));
	await userEvent.keyboard('{ArrowLeft}');
	await waitFor(() => expect(document.activeElement).toBe(darkTab));
	await userEvent.keyboard('{ArrowUp}');
	await waitFor(() => expect(document.activeElement).toBe(lightTab));
	await userEvent.keyboard('{ArrowDown}');
	await waitFor(() => expect(document.activeElement).toBe(darkTab));
	await userEvent.keyboard('{Home}');
	await waitFor(() => expect(document.activeElement).toBe(lightTab));
	await userEvent.keyboard('{End}');
	await waitFor(() => expect(document.activeElement).toBe(darkTab));
	await userEvent.keyboard('a');
	await waitFor(() => expect(document.activeElement).toBe(darkTab));

	if (storyArgs.hasClose && isFn(storyArgs.onClose)) {
		const buttons = canvas.getAllByRole('button');
		await userEvent.click(buttons[buttons.length - 1]);
		await expect(storyArgs.onClose).toHaveBeenCalled();
	}
}

export async function runTabBarRendersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await expect(canvas.getAllByRole('tab').length).toBeGreaterThan(0);
}

export async function runTabBarSelectedValueNoMatchPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// selectedValue matches nothing, so the sync effect falls back to `selected`
	// (index 1 / Dark) instead of leaving index at 0
	const darkTab = canvas.getByRole('tab', { name: /dark/i });
	await waitFor(() => expect(darkTab).toHaveAttribute('aria-selected', 'true'));
}

export async function runTabBarTooltipAndCountPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const lightTab = canvas.getByRole('tab', { name: /light/i });
	const darkTab = canvas.getByRole('tab', { name: /dark/i });

	// hovering an option with a toolTip fires onToolTip with the tip payload;
	// leaving it clears it back to null
	await userEvent.hover(lightTab);
	if (isFn(storyArgs.onToolTip)) {
		await waitFor(() => expect(storyArgs.onToolTip).toHaveBeenCalled());
	}
	await userEvent.unhover(lightTab);
	if (isFn(storyArgs.onToolTip)) {
		await waitFor(() => expect(storyArgs.onToolTip).toHaveBeenCalledWith(null));
	}

	// the Dark option has no toolTip - hovering still clears any active
	// tooltip unconditionally, but leaving it exercises handleMouseLeave's
	// `if (toolTip)` false branch (no further onToolTip call from the leave)
	await userEvent.hover(darkTab);
	const callsAfterHover = mockCallCount(storyArgs.onToolTip);
	await userEvent.unhover(darkTab);
	await new Promise((resolve) => setTimeout(resolve, 10));
	await expect(mockCallCount(storyArgs.onToolTip)).toBe(callsAfterHover);

	// a nonzero count renders the Badge
	await expect(canvas.getByText('3')).toBeInTheDocument();
}

export async function runTabBarWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// no onChange/onTabChange/onClose/onToolTip passed, exercising every
	// default-arg no-op
	const tabs = canvas.getAllByRole('tab');
	await userEvent.click(tabs[tabs.length - 1]);
}

export async function runTabBarCustomClassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// exercises the wrapper's `className ? ... : ''` true branch
	await expect(canvasElement.querySelector('[role="tablist"]')).toHaveClass('story-tabbar-class');
}

export async function runTabBarNoBorderPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const wrapper = canvasElement.querySelector('[role="tablist"]') as HTMLElement | null;
	// border=false exercises `border ? '1px' : '0'`'s false branch
	await expect(wrapper?.style.getPropertyValue('--tab-bar-border-bottom')).toBe('0');
}

export async function runTabBarCompactWidthPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// tabWidth='compact' exercises setTabWidth's `tabWidth === 'compact'`
	// true branch, which every other story leaves at the default 'fill'
	await expect(canvasElement.querySelectorAll('[role="tab"]').length).toBeGreaterThan(0);
}

export async function runTabBarNumericWidthPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// a numeric tabWidth (neither 'compact' nor 'fill') exercises both
	// setTabWidth's and setTabFlex's trailing else branches
	const tab = canvasElement.querySelector('[role="tab"]') as HTMLElement | null;
	await expect(tab?.style.getPropertyValue('--tab-bar-option-width')).toBe('120px');
	await expect(tab?.style.getPropertyValue('--tab-bar-option-flex')).toBe('unset');
}

export async function runTabBarNullIconGapPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const tab = canvasElement.querySelector('[role="tab"]') as HTMLElement | null;
	// iconGap forced to `null` (not `undefined`, which the destructured
	// default already absorbs) exercises Option's `iconGap ?? 0` fallback
	await expect(tab?.style.getPropertyValue('--tab-bar-option-gap')).toBe('0px');
}

export async function runTabBarMemoComparatorFullPassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// toggling a TabBar-level prop that ISN'T one of Option's own
	// React.memo-compared fields (iconFill) still forces renderedOptions to
	// recompute (it's in that useMemo's deps) and pass fresh Option elements
	// down - since none of the *compared* fields actually changed, Option's
	// custom comparator walks its entire `&&` chain and returns true,
	// exercising every one of its branches in a single pass.
	const toggle = canvas.getByRole('button', { name: /toggle icon fill/i });
	await userEvent.click(toggle);
	await expect(canvas.getAllByRole('tab').length).toBeGreaterThan(0);
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

export async function runTextAreaWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// no onChange/onFocus/onBlur/onSubmit/onKeyDown provided - exercises all
	// five handlers' default no-op parameter branches
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const input = canvas.getByRole('textbox');
	await userEvent.click(input);
	await userEvent.type(input, 'abc{enter}');
	await userEvent.tab();
}

export async function runTextAreaSendButtonPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// exercises handleSubmit via the send button's onMouseDown, and (with the
	// default submitClears=true) its `if (submitClears) setText('')` true branch
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const input = canvas.getByRole('textbox') as HTMLTextAreaElement;
	const sendButton = canvasElement.querySelector('[class*="send"]') as HTMLElement | null;
	await expect(sendButton).toBeInTheDocument();
	if (sendButton) {
		fireEvent.mouseDown(sendButton);
	}
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
	await expect(input.value).toBe('');
}

export async function runTextAreaNoClearOnSubmitPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// submitClears=false - exercises `if (submitClears) setText('')`'s false
	// branch: the text must survive a submit
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const input = canvas.getByRole('textbox') as HTMLTextAreaElement;
	await userEvent.click(input);
	await userEvent.type(input, 'keep me');
	const sendButton = canvasElement.querySelector('[class*="send"]') as HTMLElement | null;
	if (sendButton) {
		fireEvent.mouseDown(sendButton);
	}
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
	await expect(input.value).toContain('keep me');
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

export async function runButtonBarNoTogglePlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// toggle={false}: clicking still calls onClick, but selection/onChange must
	// be skipped entirely - exercises handleClick's and buttonClass's `toggle`
	// guards taking their false path, plus hovering a non-early-returning
	// button exercises iconColor's `isHovered` branch.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const buttons = canvas.getAllByRole('button');
	await userEvent.hover(buttons[0] as HTMLElement);
	await userEvent.click(buttons[0] as HTMLElement);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).not.toHaveBeenCalled();
	}
}

export async function runButtonBarWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// no onClick/onChange/onToolTip provided - exercises the three handlers'
	// default-parameter no-op branches. If the defaults weren't applied,
	// hovering/clicking would throw instead of completing.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const buttons = canvas.getAllByRole('button');
	await userEvent.hover(buttons[0] as HTMLElement);
	await userEvent.click(buttons[0] as HTMLElement);
}

export async function runButtonBarCustomClassPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// exercises `className ? ... : ''`'s true branch
	await runButtonBarPlay({ args, canvasElement });
	const wrapper = canvasElement.querySelector('div');
	await expect(wrapper?.className).toContain('bb-custom-class');
}

export async function runButtonBarSizeEdgeCasesPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// a falsy buttonSize (falls back to frameSize) and a value outside the
	// 's' | 'm' | 'l' | 'xl' union (falls through every check to an implicit
	// undefined) can both still occur at runtime from untyped/JS callers -
	// this only needs to confirm the component renders without throwing for
	// either, since the interesting behavior is the useMemo branch taken.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const buttons = canvas.getAllByRole('button');
	await expect(buttons.length).toBeGreaterThan(0);
}

export async function runButtonBarMissingTipPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// a button whose `tip` is missing at runtime (bypassing BarButton's typed
	// `tip: string`) - exercises `toolTip ?? 'Button'`'s fallback branch
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const buttons = canvas.getAllByRole('button');
	await userEvent.hover(buttons[0] as HTMLElement);
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).toHaveBeenCalledWith(expect.objectContaining({ payload: { label: 'Button' } }));
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

export async function runModalControllerPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// light default-story pass: open the dialog and verify its actions render,
	// without resolving/rejecting it (and therefore without needing to mock
	// window.alert here at all). The three settle paths below each get their
	// own isolated story instead.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	const dialogTitle = await canvas.findByText('Continue?');
	await expect(dialogTitle).toBeInTheDocument();
	await expect(canvas.getByRole('button', { name: /yes/i })).toBeInTheDocument();
	await expect(canvas.getByRole('button', { name: /no/i })).toBeInTheDocument();
}

export async function runModalControllerResolveViaPrimaryActionPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// the demo calls window.alert() once the modal promise settles — mock it
	// so a real alert() doesn't block this run
	const alertSpy = spyOn(window, 'alert').mockImplementation(() => undefined);

	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	const dialogTitle = await canvas.findByText('Continue?');
	await expect(canvas.getByRole('button', { name: /no/i })).toBeInTheDocument();
	// Modal's title bar (the onPointerDown/drag-start target) is the title
	// text's grandparent — walk the DOM directly rather than guess at a
	// hashed CSS module class name — to also exercise onDragPointerDown
	const titleBar = dialogTitle.parentElement?.parentElement;
	if (titleBar) {
		fireEvent.pointerDown(titleBar);
	}
	await userEvent.click(canvas.getByRole('button', { name: /yes/i }));
	await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

	alertSpy.mockRestore();
}

export async function runModalControllerRejectViaCloseButtonPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const alertSpy = spyOn(window, 'alert').mockImplementation(() => undefined);

	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	await canvas.findByText('Continue?');
	await userEvent.click(canvas.getByRole('button', { name: /close/i }));
	await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

	alertSpy.mockRestore();
}

export async function runModalControllerDismissViaBackdropPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const alertSpy = spyOn(window, 'alert').mockImplementation(() => undefined);

	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	await canvas.findByText('Continue?');
	const overlay = getOverlay(canvasElement);
	if (overlay) {
		await userEvent.click(overlay);
	}
	await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

	alertSpy.mockRestore();
}

export async function runModalControllerNotDraggablePlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// draggable={false} - exercises the four `draggable ? ... : undefined`
	// ternaries' false branches. Just open and resolve normally; dragability
	// itself isn't independently observable through the DOM here.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const alertSpy = spyOn(window, 'alert').mockImplementation(() => undefined);

	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	await canvas.findByText('Continue?');
	await userEvent.click(canvas.getByRole('button', { name: /yes/i }));
	await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

	alertSpy.mockRestore();
}

export async function runModalControllerResolveWithoutCallbacksPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// modalProps has no onResolve/onDragPointerDown - exercises both
	// `typeof modalProps?.onResolve/onDragPointerDown === 'function'` false
	// branches (the pass-through call is skipped, but resolve()/controls.start()
	// still run directly)
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const alertSpy = spyOn(window, 'alert').mockImplementation(() => undefined);

	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	const dialogTitle = await canvas.findByText('Continue?');
	const titleBar = dialogTitle.parentElement?.parentElement;
	if (titleBar) {
		fireEvent.pointerDown(titleBar);
	}
	await userEvent.click(canvas.getByRole('button', { name: /yes/i }));
	await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

	alertSpy.mockRestore();
}

export async function runModalControllerRejectWithoutCallbacksPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// modalProps has no onReject/onClose - the close button's handler calls
	// both internally, exercising both `typeof modalProps?.onReject/onClose
	// === 'function'` false branches in one interaction
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const alertSpy = spyOn(window, 'alert').mockImplementation(() => undefined);

	await userEvent.click(canvas.getByRole('button', { name: /continue/i }));
	await canvas.findByText('Continue?');
	await userEvent.click(canvas.getByRole('button', { name: /close/i }));
	await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

	alertSpy.mockRestore();
}

export async function runToastInfoPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await userEvent.click(canvas.getByRole('button', { name: /info toast/i }));
	await expect(await canvas.findByText('Thank you for clicking!')).toBeInTheDocument();
	await userEvent.click(canvas.getByRole('button', { name: /dismiss message/i }));
}

export async function runToastSuccessHoverPausePlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await userEvent.click(canvas.getByRole('button', { name: /success toast/i }));
	const successMessage = await canvas.findByText('Saved successfully');
	await expect(successMessage).toBeInTheDocument();
	// hovering pauses, then un-hovering resumes, the auto-hide timer
	const wrapper = successMessage.closest('[role="status"]')?.parentElement ?? successMessage;
	fireEvent.mouseEnter(wrapper);
	fireEvent.mouseLeave(wrapper);
	await userEvent.click(canvas.getByRole('button', { name: /dismiss message/i }));
}

export async function runToastWarningKeyboardDismissPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await userEvent.click(canvas.getByRole('button', { name: /warning toast/i }));
	await expect(await canvas.findByText('Careful now')).toBeInTheDocument();
	// dismissed via the keyboard rather than a click
	canvas.getByRole('button', { name: /dismiss message/i }).focus();
	await userEvent.keyboard('{Enter}');
}

export async function runToastErrorInfiniteDurationPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// Infinite duration renders the progress-indicator branch and never
	// auto-hides on its own, so dismiss it explicitly afterward
	await userEvent.click(canvas.getByRole('button', { name: /error toast/i }));
	await expect(await canvas.findByText('Something failed')).toBeInTheDocument();
	await userEvent.click(canvas.getByRole('button', { name: /dismiss message/i }));
}

export async function runToastCustomClassPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const status = await canvas.findByRole('status');
	// exercises the wrapper's `className ? ... : ''` true branch, composed
	// into classNames via filterClasses
	await expect(status.parentElement).toHaveClass('story-toast-class');
}

export async function runToastWithoutDidHidePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// no didHide passed at all, so this exercises the default `() => null`
	// parameter; the toast's own short duration drives it through
	// AnimatePresence's exit + onExitComplete without anything external
	// listening for it
	await canvas.findByText('Bye for now');
	await waitFor(() => expect(canvas.queryByText('Bye for now')).not.toBeInTheDocument(), { timeout: 3000 });
}

export async function runToastNoBorderNoClosePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const status = await canvas.findByRole('status');
	const wrapper = status.parentElement as HTMLElement;
	// close=false exercises defaultPadding's `close ? ... : '10px 16px'`
	// false branch and hides the dismiss affordance; border=false exercises
	// cssVars' `border ? ... : 'unset'` false branch
	await expect(wrapper.style.getPropertyValue('--toast-border')).toBe('unset');
	await expect(canvas.queryByRole('button', { name: /dismiss message/i })).not.toBeInTheDocument();
}

export async function runToastContainerParentPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const status = await canvas.findByRole('status');
	const wrapper = status.parentElement as HTMLElement;
	// container='parent' exercises `container === 'window' ? 'fixed' :
	// 'absolute'`'s false branch
	await expect(wrapper.style.getPropertyValue('--toast-position')).toBe('absolute');
}

export async function runToastPositionTopPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// position='top' exercises both position-based ternaries' false branch
	// (every other story leaves position at its 'bottom' default)
	await canvas.findByRole('status');
}

export async function runToastExplicitProgressPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await canvas.findByRole('status');
	// progress explicitly set (rather than left `undefined`, which every
	// other story does) exercises showProgress's `if (progress !==
	// undefined) return progress;` true branch
	await expect(canvasElement.querySelector('[class*="progress"]')).toBeInTheDocument();
}

export async function runUploadAreaPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const dropzone = canvas.getByRole('button', { name: /click to upload files/i });
	const file = new File(['contents'], 'example.txt', { type: 'text/plain' });
	const dataTransfer = new DataTransfer();
	dataTransfer.items.add(file);

	// exercise the drag-and-drop path only; clicking the dropzone itself opens
	// the hidden native file input, which would block a real browser test run.
	fireEvent.dragEnter(dropzone, { dataTransfer });
	fireEvent.dragLeave(dropzone, { dataTransfer });
	fireEvent.dragEnter(dropzone, { dataTransfer });
	fireEvent.drop(dropzone, { dataTransfer });

	const storyArgs = asArgs(args);
	if (isFn(storyArgs.onUpload)) {
		await expect(storyArgs.onUpload).toHaveBeenCalled();
	}
}

export async function runPromptInputPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textarea = canvas.getByRole('textbox');
	await userEvent.click(textarea);
	await userEvent.type(textarea, 'Hello there');

	const storyArgs = asArgs(args);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onFocus)) {
		await expect(storyArgs.onFocus).toHaveBeenCalled();
	}

	// click the round attach button — it's a no-op beyond stopping propagation,
	// but it's a real branch (handleClickAttach) that a text-only pass never hits
	const attachButton = canvas.getAllByRole('button')[0];
	if (attachButton) {
		await userEvent.click(attachButton);
	}

	await userEvent.keyboard('{Enter}');
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
	// submitClears defaults to true, so submitting also blurs the textarea
	if (isFn(storyArgs.onBlur)) {
		await expect(storyArgs.onBlur).toHaveBeenCalled();
	}
}

export async function runPromptInputAttachmentsPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);

	// remove one attachment to exercise handleAttachmentsChange
	const removeButtons = canvas.getAllByRole('button', { name: /remove file/i });
	await userEvent.click(removeButtons[0]);
	if (isFn(storyArgs.onAttachmentsChange)) {
		await expect(storyArgs.onAttachmentsChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}

	// submit the pre-filled prompt via the keyboard
	const textarea = canvas.getByRole('textbox');
	await userEvent.click(textarea);
	await userEvent.keyboard('{Enter}');
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
}

export async function runPromptInputWorkingPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);

	// stopEnabled routes the send button through handleStop instead of handleSubmit
	const buttons = canvas.getAllByRole('button');
	const stopButton = buttons[buttons.length - 1];
	if (stopButton) {
		await userEvent.click(stopButton);
	}
	if (isFn(storyArgs.onStop)) {
		await expect(storyArgs.onStop).toHaveBeenCalled();
	}
}

export async function runPromptInputRendersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	await expect(canvasElement.querySelector('[role="textbox"]')).toBeInTheDocument();
}

export async function runPromptInputFocusedOnMountPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const textarea = canvas.getByRole('textbox');
	// focused=true (a real boolean, not the nullish default) drives the
	// mount-sync effect's `if (focused)` true branch, which calls .focus()
	await waitFor(() => expect(document.activeElement).toBe(textarea));
}

export async function runPromptInputSubmitBlockedPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const textarea = canvas.getByRole('textbox');
	await userEvent.click(textarea);
	await userEvent.type(textarea, 'Hello there');
	await userEvent.keyboard('{Enter}');
	// stopEnabled / (working && submitWorking) short-circuit handleSubmit
	// before onSubmit is ever invoked
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).not.toHaveBeenCalled();
	}
}

export async function runPromptInputEmptySubmitNoopPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const textarea = canvas.getByRole('textbox');
	await userEvent.click(textarea);
	await userEvent.keyboard('{Enter}');
	// handleSubmit's `if (currentValue)` guard skips everything when the
	// textarea is empty
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).not.toHaveBeenCalled();
	}
}

export async function runPromptInputSubmitWithoutClearingPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const textarea = canvas.getByRole('textbox') as HTMLTextAreaElement;
	await userEvent.click(textarea);
	await userEvent.type(textarea, 'Hello there');
	await userEvent.keyboard('{Enter}');
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalledWith('Hello there', expect.anything());
	}
	// submitClears=false takes handleSubmit's `if (submitClears)` false
	// branch, so the textarea keeps its value and handleBlur is called with
	// the original text instead of ''
	if (isFn(storyArgs.onBlur)) {
		await expect(storyArgs.onBlur).toHaveBeenCalledWith('Hello there', expect.anything());
	}
}

export async function runPromptInputClickToSubmitPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const textarea = canvas.getByRole('textbox');
	await userEvent.click(textarea);
	await userEvent.type(textarea, 'Hello there');
	// stopEnabled=false, so clicking the send button (last button) routes
	// handleClickSend's ternary through handleSubmit instead of handleStop
	const buttons = canvas.getAllByRole('button');
	await userEvent.click(buttons[buttons.length - 1]);
	if (isFn(storyArgs.onSubmit)) {
		await expect(storyArgs.onSubmit).toHaveBeenCalled();
	}
}

export async function runPromptInputAttachmentsDisabledPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const buttons = canvas.getAllByRole('button');
	// attachmentsDisabled=true exercises attachState's `if
	// (!attachmentsDisabled)` false branch
	await expect(buttons[0]).toBeDisabled();
}

export async function runPromptInputHideToolbarPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// no children, attachButton, or sendButton -> the toolbar wrapper's
	// `(children || attachButton || sendButton) &&` guard is false
	await expect(canvas.queryAllByRole('button')).toHaveLength(0);
}

// build a real, live MediaStream (canvas video track + synthesized audio
// track) so Camera's success path — attachStreamToVideo, syncMediaState,
// enable/disableVideo, mute/unmuteMic, takeSnapshot — can run for real in a
// headless browser with no actual camera or microphone device.
function createFakeCameraStream(options?: { includeAudio?: boolean }): MediaStream {
	const includeAudio = options?.includeAudio ?? true;
	const canvas = document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 64;
	const context = canvas.getContext('2d');
	if (context) {
		context.fillStyle = '#336699';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	const canvasWithCapture = canvas as HTMLCanvasElement & { captureStream: (frameRate?: number) => MediaStream };
	const videoStream = canvasWithCapture.captureStream(10);
	const tracks: MediaStreamTrack[] = [...videoStream.getVideoTracks()];
	if (includeAudio) {
		const audioContext = new AudioContext();
		const destination = audioContext.createMediaStreamDestination();
		const oscillator = audioContext.createOscillator();
		oscillator.connect(destination);
		oscillator.start();
		tracks.push(...destination.stream.getAudioTracks());
	}
	return new MediaStream(tracks);
}

export async function runCameraDemoPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// the real getUserMedia call on mount fails in this headless browser (no
	// camera device, no permission granted) — that's a genuine pass through
	// startCamera's catch branch, left alone. Mocking it only from here lets
	// the interactions below drive the success path too, and the mock's first
	// (rejecting) call exercises the OverconstrainedError retry branch in
	// requestMediaStream on the very first click below.
	const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	let mockedCallCount = 0;
	navigator.mediaDevices.getUserMedia = (async () => {
		mockedCallCount += 1;
		if (mockedCallCount === 1) {
			throw new DOMException('Requested device not found', 'OverconstrainedError');
		}
		return createFakeCameraStream();
	}) as typeof navigator.mediaDevices.getUserMedia;

	try {
		const startButton = canvas.getByRole('button', { name: /start stream/i });
		const toggleVideoButton = canvas.getByRole('button', { name: /toggle video/i });
		const toggleMicButton = canvas.getByRole('button', { name: /toggle mic/i });
		const snapshotButton = canvas.getByRole('button', { name: /take snapshot/i });
		const stopButton = canvas.getByRole('button', { name: /stop stream/i });

		await userEvent.click(startButton);
		// Photo flips to enabled (aria-disabled="false") only once cameraOn is
		// true, i.e. once the mocked stream has actually attached
		await waitFor(
			() => expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'false'),
			{ timeout: 5000 },
		);

		// exercise Camera's own toolbar: user info, video/mic toggle off+on
		await userEvent.click(canvas.getByRole('button', { name: 'User Info' }));
		await userEvent.click(canvas.getByRole('button', { name: /^(video|off)$/i }));
		await userEvent.click(canvas.getByRole('button', { name: /^(video|off)$/i }));
		await userEvent.click(canvas.getByRole('button', { name: /^(mic|muted)$/i }));
		await userEvent.click(canvas.getByRole('button', { name: /^(mic|muted)$/i }));

		// snapshot branches: take one, replace it via the ref API (no toggle —
		// hits the "revoke the previous snapshot" branch), toggle it off via the
		// toolbar (the "toggle an existing snapshot off" early return), take a
		// fresh one, then clear it via the dedicated clear-snapshot icon
		await userEvent.click(canvas.getByRole('button', { name: 'Photo' }));
		await userEvent.click(snapshotButton);
		await userEvent.click(canvas.getByRole('button', { name: 'Photo' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Photo' }));
		const clearSnapshot = canvas.queryByRole('button', { name: /clear snapshot/i });
		if (clearSnapshot) {
			await userEvent.click(clearSnapshot);
		}

		await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));

		// hover the preview to reveal, then leave to auto-hide, the controls bar -
		// the hover handlers live on the outer wrapper div (css.wrapper), not on
		// the <video> element nested inside it, so hover that (see
		// writing-tests.md's "hover the element that actually has the listener"
		// gotcha - fireEvent.mouseEnter/mouseLeave on a child never reaches a
		// parent's onMouseEnter/onMouseLeave)
		const wrapper = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
		if (wrapper) {
			await userEvent.hover(wrapper);
			fireEvent.mouseMove(wrapper);
			await userEvent.unhover(wrapper);
		}

		await userEvent.click(toggleVideoButton);
		await userEvent.click(toggleMicButton);
		await userEvent.click(stopButton);
	} finally {
		navigator.mediaDevices.getUserMedia = originalGetUserMedia;
	}
}

export async function runCameraKeyboardAndHoverPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	navigator.mediaDevices.getUserMedia = (async () =>
		createFakeCameraStream()) as typeof navigator.mediaDevices.getUserMedia;

	try {
		const startButton = canvas.getByRole('button', { name: /start stream/i });
		const stopButton = canvas.getByRole('button', { name: /stop stream/i });
		await userEvent.click(startButton);
		await waitFor(() =>
			expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'false'),
		);

		const wrapper = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
		const controls = canvasElement.querySelector('[class*="controls"]') as HTMLElement | null;
		await expect(wrapper).toBeInTheDocument();
		await expect(controls).toBeInTheDocument();

		// a repeated mousemove on the wrapper while it's already hovered hits
		// handleMouseMove's early return (it only sets state and (re)starts the
		// auto-hide timer on the first move into a not-yet-hovered wrapper)
		if (wrapper) {
			await userEvent.hover(wrapper);
			fireEvent.mouseMove(wrapper);
			fireEvent.mouseMove(wrapper);
			await userEvent.unhover(wrapper);
		}

		// the controls bar has its own enter/leave/focus/blur handlers that stop
		// propagation so they can keep the bar visible independently of the
		// wrapper's own hover state
		if (controls) {
			fireEvent.mouseEnter(controls);
			fireEvent.mouseLeave(controls);
			fireEvent.focus(controls);
			fireEvent.blur(controls);
		}

		// keyboard activation on an enabled toolbar button
		const userInfoButton = canvas.getByRole('button', { name: 'User Info' });
		userInfoButton.focus();
		await userEvent.keyboard('{Enter}');

		// stop the stream so Photo goes back to disabled, then confirm keyboard
		// activation on a disabled toolbar button is a no-op guard rather than a
		// crash
		await userEvent.click(stopButton);
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'true'));
		const photoButton = canvas.getByRole('button', { name: 'Photo' });
		photoButton.focus();
		await userEvent.keyboard('{Enter}');

		// keyboard activation directly on the controls bar itself (its own
		// onKeyDown, distinct from any button inside it)
		if (controls) {
			fireEvent.keyDown(controls, { key: 'Enter', code: 'Enter' });
		}

		// keyboard activation directly on the outer wrapper - only reachable when
		// the wrapper itself is the event target, since clicks/keydowns inside the
		// controls bar stop propagation before they'd otherwise bubble up to it
		if (wrapper) {
			fireEvent.click(wrapper);
			fireEvent.keyDown(wrapper, { key: 'Enter', code: 'Enter' });
		}
	} finally {
		navigator.mediaDevices.getUserMedia = originalGetUserMedia;
	}
}

export async function runCameraStreamLifecycleEdgeCasesPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	navigator.mediaDevices.getUserMedia = (async () =>
		createFakeCameraStream()) as typeof navigator.mediaDevices.getUserMedia;

	try {
		const startButton = canvas.getByRole('button', { name: /start stream/i });
		const stopButton = canvas.getByRole('button', { name: /stop stream/i });
		const toggleVideoButton = canvas.getByRole('button', { name: /toggle video/i });

		// this story mounts with startCameraOff, so there's no active stream yet -
		// toggling video first exercises toggleVideo's `!stream` fallback to
		// startCamera() rather than its disable/enable branch
		await userEvent.click(toggleVideoButton);
		await waitFor(() =>
			expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'false'),
		);

		// clicking Start Stream again while the stream is already active and its
		// video track live hits reuseExistingStream's "already active" branch
		// instead of requesting a new stream
		await userEvent.click(startButton);

		// toggle video off (disables the track but keeps the stream alive), then
		// start again - this time reuseExistingStream re-enables the existing
		// disabled track instead of requesting a new stream
		await userEvent.click(toggleVideoButton);
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'true'));
		await userEvent.click(startButton);
		await waitFor(() =>
			expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'false'),
		);

		// stopping twice in a row: the second stop finds no active stream to stop
		await userEvent.click(stopButton);
		await userEvent.click(stopButton);
	} finally {
		navigator.mediaDevices.getUserMedia = originalGetUserMedia;
	}
}

export async function runCameraImperativeRefControlsPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const log = canvasElement.querySelector('[data-testid="ref-controls-log"]') as HTMLElement | null;
	await expect(log).toBeInTheDocument();

	const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
	navigator.mediaDevices.getUserMedia = (async () =>
		createFakeCameraStream()) as typeof navigator.mediaDevices.getUserMedia;

	try {
		// before any stream exists, both ref guards return their "not found" errors
		await userEvent.click(canvas.getByRole('button', { name: 'Disable Video (ref)' }));
		await waitFor(() => expect(log?.textContent).toContain('No video track found'));
		await userEvent.click(canvas.getByRole('button', { name: 'Enable Video (ref)' }));
		await waitFor(() => expect(log?.textContent).toContain('No media stream found'));

		// start the stream, then read the imperative video/container getters
		await userEvent.click(canvas.getByRole('button', { name: 'Start Stream' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Log Ref Getters' }));
		await waitFor(() => expect(log?.textContent).toContain('video:yes container:yes'));

		// mute/unmute via the ref while a live audio track is present
		await userEvent.click(canvas.getByRole('button', { name: 'Mute Mic (ref)' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Unmute Mic (ref)' }));

		// enumerateDevices rejecting with a non-Error value falls into
		// getMediaDevices' generic default-error branch
		navigator.mediaDevices.enumerateDevices = (() =>
			Promise.reject('permission denied')) as typeof navigator.mediaDevices.enumerateDevices;
		await userEvent.click(canvas.getByRole('button', { name: 'List Devices (ref)' }));
		await waitFor(() => expect(log?.textContent).toContain('Unknown error enumerating devices'));
		navigator.mediaDevices.enumerateDevices = originalEnumerateDevices;

		// stopping the track directly (bypassing stopCamera) leaves the stream's
		// srcObject in place but its video track no longer live - enableVideo then
		// hits its "no longer live" guard instead of re-enabling it
		await userEvent.click(canvas.getByRole('button', { name: 'Stop Track Directly' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Enable Video (ref)' }));
		await waitFor(() => expect(log?.textContent).toContain('Video track is no longer live'));
	} finally {
		navigator.mediaDevices.getUserMedia = originalGetUserMedia;
		navigator.mediaDevices.enumerateDevices = originalEnumerateDevices;
	}
}

export async function runCameraNoAudioTrackPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);

	const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
	navigator.mediaDevices.getUserMedia = (async () =>
		createFakeCameraStream({ includeAudio: false })) as typeof navigator.mediaDevices.getUserMedia;

	try {
		await userEvent.click(canvas.getByRole('button', { name: /start stream/i }));
		await waitFor(() =>
			expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'false'),
		);
		await waitFor(() => expect(storyArgs.onNoAudio).toHaveBeenCalled());

		// with no audio track on the stream, the Mic toolbar button's toggleMic()
		// falls into the "no audio track found" guard instead of muting/unmuting
		await userEvent.click(canvas.getByRole('button', { name: /^(mic|muted)$/i }));
	} finally {
		navigator.mediaDevices.getUserMedia = originalGetUserMedia;
	}
}

export async function runVideoControllerShowAndHidePlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);

	await userEvent.click(canvas.getByRole('button', { name: /show video/i }));

	// the local muted fixture actually decodes and plays in this real browser -
	// wait for handleDidLoadFrame's `ready` flip (driven by the <video>'s real
	// `loadeddata` event) rather than assuming it's immediate
	const container = canvasElement.querySelector('[class*="container"]') as HTMLElement | null;
	await expect(container).toBeInTheDocument();
	await waitFor(() => expect(container?.style.getPropertyValue('--video-visibility')).toBe('visible'), {
		timeout: 5000,
	});
	if (isFn(storyArgs.onLoadedFrameData)) {
		await expect(storyArgs.onLoadedFrameData).toHaveBeenCalled();
	}

	// clicking the dark overlay behind the video calls handleHide, which clears
	// the store and fires onQuit
	const overlay = getOverlay(canvasElement);
	await expect(overlay).toBeInTheDocument();
	if (overlay) await userEvent.click(overlay);
	await waitFor(() => expect(canvasElement.querySelector('video')).not.toBeInTheDocument());
	if (isFn(storyArgs.onQuit)) {
		await expect(storyArgs.onQuit).toHaveBeenCalled();
	}
}

export async function runVideoControllerQuitOutsidePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	await userEvent.click(canvas.getByRole('button', { name: /show video/i }));
	await waitFor(() => expect(canvasElement.querySelector('video')).toBeInTheDocument());

	// the whole container (video + the outside close button) sits behind
	// `visibility: var(--video-visibility, hidden)` until handleDidLoadFrame
	// flips `ready` - while hidden, the close button exists in the DOM but is
	// correctly excluded from the accessibility tree, so getByRole can't see
	// it yet. Wait for that flip before querying for it, same as the
	// show/hide flow does.
	const container = canvasElement.querySelector('[class*="container"]') as HTMLElement | null;
	await expect(container).toBeInTheDocument();
	await waitFor(() => expect(container?.style.getPropertyValue('--video-visibility')).toBe('visible'), {
		timeout: 5000,
	});

	// quit='outside' renders a dedicated close IconButton alongside the video
	// instead of (or in addition to) the overlay-click/inline-quit-button paths
	const closeButton = canvas.getByRole('button', { name: /x icon/i });
	await userEvent.click(closeButton);
	await waitFor(() => expect(canvasElement.querySelector('video')).not.toBeInTheDocument());
}

export async function runVideoPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// light default-story pass: click through whatever controls render and
	// drive the sliders, without depending on the story's own remote demo clip
	// actually loading/playing (network-dependent, and slow/blocked in CI).
	// The real play/pause/seek/ended lifecycle is covered by the dedicated
	// PlaybackLifecycle story instead, against a small local clip.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const video = canvasElement.querySelector('video');
	await expect(video).toBeInTheDocument();

	// headless Chromium's Fullscreen API needs a real display it doesn't have,
	// so simulate the one native event Video.tsx actually listens for
	fireEvent(document, new Event('fullscreenchange'));

	// click through whatever custom control buttons are rendered (fullscreen,
	// mute, play/pause, quit); each handler already guards/catches internally.
	// hover first since custom overlay controls are commonly hidden (pointer-events:
	// none) until the player is hovered, then skip any button still non-interactive.
	await userEvent.hover(canvasElement);
	const buttons = canvas.getAllByRole('button');
	for (const button of buttons) {
		if (getComputedStyle(button).pointerEvents === 'none') {
			continue;
		}
		await userEvent.click(button);
	}

	// the volume and progress controls are ARIA sliders, not buttons — drive
	// them via arrow keys to exercise handleVolumeChange/handleSetProgress
	const sliders = canvas.queryAllByRole('slider');
	for (const slider of sliders) {
		if (getComputedStyle(slider).pointerEvents === 'none') {
			continue;
		}
		slider.focus();
		await userEvent.keyboard('{ArrowRight}');
		await userEvent.keyboard('{ArrowLeft}');
	}
}

export async function runVideoPlaybackLifecyclePlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const video = canvasElement.querySelector('video');
	await expect(video).toBeInTheDocument();
	if (!video) return;

	// this story's own args point at a small, local, muted clip — no network
	// dependency and no autoplay-policy restriction, so play/pause/seek/ended
	// all happen for real rather than via synthetic fireEvent calls
	await waitFor(() => expect(video.duration).toBeGreaterThan(0), { timeout: 5000 });

	await video.play().catch(() => undefined);
	await waitFor(() => expect(video.paused).toBe(false), { timeout: 5000 });
	await new Promise((resolve) => setTimeout(resolve, 200));
	video.pause();
	await waitFor(() => expect(video.paused).toBe(true), { timeout: 5000 });

	// resume, then seek to the very end via the progress slider (End key) —
	// since it's playing, this exercises handleSetProgress's pause-before-seek,
	// the real "seeked" event's handleSeekEnd resume, and drives the clip to a
	// genuine "ended" event (the isAtEnd branches in handlePlay/
	// handlePlayProgress, and onEnd)
	await video.play().catch(() => undefined);
	const sliders = canvas.queryAllByRole('slider');
	const progressSlider = sliders.at(-1);
	if (progressSlider && getComputedStyle(progressSlider).pointerEvents !== 'none') {
		progressSlider.focus();
		await userEvent.keyboard('{End}');
	}
	await waitFor(() => expect(video.ended).toBe(true), { timeout: 5000 });
}

export async function runVideoImperativeRefPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// exercises the useImperativeHandle wiring directly (play/stop/restart/
	// setVolume/mute/fullscreen/playbackRate/videoElement), including the
	// volume and playback-rate clamping branches — nothing else in this file
	// ever calls the ref imperatively, so none of this is reachable otherwise.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const video = canvasElement.querySelector('video');
	await expect(video).toBeInTheDocument();
	if (!video) return;

	await waitFor(() => expect(video.duration).toBeGreaterThan(0), { timeout: 5000 });

	const click = (name: string) => userEvent.click(canvas.getByRole('button', { name }));

	await click('ref-play');
	await waitFor(() => expect(video.paused).toBe(false), { timeout: 5000 });

	await click('ref-stop');
	await waitFor(() => expect(video.paused).toBe(true), { timeout: 5000 });

	await click('ref-restart');
	await waitFor(() => expect(video.paused).toBe(false), { timeout: 5000 });
	video.pause();

	await click('ref-set-volume');
	await waitFor(() => expect(video.volume).toBeCloseTo(0.6, 1));

	await click('ref-set-volume-low');
	await waitFor(() => expect(video.volume).toBe(0));

	await click('ref-set-volume-high');
	await waitFor(() => expect(video.volume).toBe(1));

	await click('ref-mute');
	await waitFor(() => expect(video.muted).toBe(true));

	await click('ref-unmute');
	await waitFor(() => expect(video.muted).toBe(false));

	await click('ref-rate-normal');
	await waitFor(() => expect(video.playbackRate).toBe(2));

	await click('ref-rate-low');
	await waitFor(() => expect(video.playbackRate).toBe(0.5));

	await click('ref-rate-high');
	await waitFor(() => expect(video.playbackRate).toBe(3));

	// headless Chromium has no real display, so requestFullscreen/exitFullscreen
	// reliably reject — handleFullScreen already catches that internally; we
	// just need the ref methods themselves invoked to cover this wiring
	await click('ref-fullscreen-on');
	await click('ref-fullscreen-off');

	await click('ref-check-element');
	await waitFor(() => expect(canvas.getByTestId('video-element-found')).toBeInTheDocument());
}

export async function runVideoCustomClassNamePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const wrapper = canvasElement.querySelector('[class*="wrapper"]');
	// exercises the wrapper's `className ? ... : ''` true branch
	await expect(wrapper).toHaveClass('story-video-class');
}

export async function runVideoUndefinedControlledPropsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// playing/muted/volume all left undefined (not passed at all, distinct
	// from an explicit `false`/`true`/number) exercises every `?? fallback`
	// used to seed the initial ref/state values, plus the mount-sync effect's
	// `if (playing === undefined) return;` true branch.
	await expect(canvasElement.querySelector('video')).toBeInTheDocument();
}

export async function runVideoNullableObjectFitPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// objectFit forced to `null` (not `undefined`, which the destructured
	// default already absorbs) exercises cssVars' `objectFit ?? 'contain'`
	// fallback.
	await expect(canvasElement.querySelector('video')).toBeInTheDocument();
}

export async function runVideoCustomControlsChildrenPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	// controls='custom' with real children exercises `controls === 'custom'
	// && children`'s fully-true path, instead of the 'simple'/'default'/'none'
	// values every other story uses
	await expect(canvas.getByTestId('video-custom-children')).toBeInTheDocument();
}

export async function runVideoLoadProgressPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const video = canvasElement.querySelector('video') as HTMLVideoElement | null;
	await expect(video).toBeInTheDocument();
	if (!video) return;

	// jsdom-less real Chromium still starts with an empty (zero-length)
	// TimeRanges for `buffered`, so handleLoadProgress's `target.buffered.
	// length > 0` guard is never true without forcing it — override both
	// `buffered` and `duration` to exercise the nested `duration > 0` true
	// branch and get a real onLoadProgress call.
	Object.defineProperty(video, 'buffered', {
		configurable: true,
		value: { length: 1, end: () => 5 },
	});
	Object.defineProperty(video, 'duration', {
		configurable: true,
		value: 10,
	});
	fireEvent.progress(video);
}

export async function runVideoLoadProgressZeroDurationPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const video = canvasElement.querySelector('video') as HTMLVideoElement | null;
	await expect(video).toBeInTheDocument();
	if (!video) return;

	// buffered has data, but duration is 0/unknown - exercises the nested
	// `duration > 0` false branch, leaving onLoadProgress uncalled
	Object.defineProperty(video, 'buffered', {
		configurable: true,
		value: { length: 1, end: () => 0 },
	});
	Object.defineProperty(video, 'duration', {
		configurable: true,
		value: 0,
	});
	fireEvent.progress(video);
}

export async function runVideoHoverControlsPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	// Default/PlaybackLifecycle hover canvasElement itself, which never
	// actually reaches the player's own wrapper div — so `hovered` never
	// flips true there and every custom-control button/slider (fullscreen,
	// mute, volume, play-toggle, progress, quit) stays pointer-events:none
	// the whole time. Hovering the actual wrapper here is what makes their
	// onClick/onChange handlers, and the mouse-over/mouse-out handlers
	// themselves, really fire.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const video = canvasElement.querySelector('video');
	await expect(video).toBeInTheDocument();
	if (!video) return;

	const wrapper = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
	await expect(wrapper).toBeInTheDocument();
	if (!wrapper) return;

	await userEvent.hover(wrapper);
	await waitFor(() => expect(getComputedStyle(wrapper).getPropertyValue('--video-controls-opacity').trim()).toBe('1'));

	const buttons = canvas.getAllByRole('button');
	for (const button of buttons) {
		if (getComputedStyle(button).pointerEvents === 'none') continue;
		await userEvent.click(button);
	}

	const sliders = canvas.queryAllByRole('slider');
	for (const slider of sliders) {
		if (getComputedStyle(slider).pointerEvents === 'none') continue;
		slider.focus();
		await userEvent.keyboard('{ArrowRight}');
		await userEvent.keyboard('{ArrowLeft}');
	}

	await userEvent.unhover(wrapper);
	await waitFor(() => expect(getComputedStyle(wrapper).getPropertyValue('--video-controls-opacity').trim()).toBe('0'));
}

export async function runDataTableSortAndCellInteractionPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const nameHeader = canvasElement.querySelector('th[data-column-id="col-1"]') as HTMLElement | null;
	await expect(nameHeader).toBeInTheDocument();
	if (!nameHeader) return;

	// toggle sort asc -> desc on the same column
	await userEvent.click(nameHeader);
	await waitFor(() => expect(nameHeader).toHaveAttribute('aria-sort', 'ascending'));
	await userEvent.click(nameHeader);
	await waitFor(() => expect(nameHeader).toHaveAttribute('aria-sort', 'descending'));

	// sorting a different column starts it fresh at ascending (handleSort's "new key" branch)
	const ageHeader = canvasElement.querySelector('th[data-column-id="col-2"]') as HTMLElement | null;
	if (ageHeader) {
		await userEvent.click(ageHeader);
		await waitFor(() => expect(ageHeader).toHaveAttribute('aria-sort', 'ascending'));
	}

	// keyboard activation (accessibleKeyDown's Enter branch) on a header
	nameHeader.focus();
	await userEvent.keyboard('{Enter}');
	await waitFor(() => expect(nameHeader).toHaveAttribute('aria-sort', 'ascending'));

	// hover/click/double-click/keyboard on a body cell
	const cell = canvasElement.querySelector('td[data-column-id="0.0"]') as HTMLElement | null;
	await expect(cell).toBeInTheDocument();
	if (!cell) return;
	await userEvent.hover(cell);
	await userEvent.click(cell);
	await userEvent.dblClick(cell);
	await userEvent.unhover(cell);
	cell.focus();
	await userEvent.keyboard('{Enter}');
}

export async function runDataTableColumnResizeAndReorderPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);

	// drag-resize: mousedown on the first column's boundary handle, drag, release.
	// Index into <colgroup>'s <col> elements by the matching header's position rather
	// than guessing pixel offsets - colStartX is the real header cell's left edge (from
	// getBoundingClientRect in the live, centered layout), so an arbitrary clientX can
	// land to the *left* of it and clamp the computed width to zero via applyWidth's
	// Math.max(0, ...) - harmless for the resize math itself, but worth avoiding so the
	// drag distance below is meaningful.
	const headerCells = Array.from(canvasElement.querySelectorAll('thead th')) as HTMLElement[];
	const cols = Array.from(canvasElement.querySelectorAll('colgroup col')) as HTMLTableColElement[];
	const resizeHandle = headerCells[0]?.querySelector('[class*="colResizeHandle"]') as HTMLElement | null;
	await expect(resizeHandle).toBeInTheDocument();
	const targetCol = cols[0];

	if (resizeHandle && targetCol) {
		const startWidth = targetCol.style.width;
		await userEvent.hover(resizeHandle);
		const handleRect = resizeHandle.getBoundingClientRect();
		fireEvent.mouseDown(resizeHandle, { clientX: handleRect.left });

		// dragResize's mousedown handler sets `resizeCol` state, and the document-level
		// mousemove/mouseup listeners only get attached from the *effect* that reacts to
		// that state change - which commits on a later tick than this mousedown call, not
		// synchronously within it. `initListeners` also sets this cursor style as part of
		// the same effect, so it's a reliable signal that the listeners now exist.
		await waitFor(() => expect(document.documentElement.style.cursor).toBe('col-resize'));

		// a real drag is several move events, not one instantaneous jump - and confirming
		// the <col>'s width actually changed (applyWidth's real, observable side effect)
		// before releasing is what proves hasMovedRef actually flipped true, rather than
		// assuming a precise synchronous ordering between this mousemove and the mouseup
		// dispatched right after it.
		fireEvent.mouseMove(document.documentElement, { clientX: handleRect.left + 60 });
		fireEvent.mouseMove(document.documentElement, { clientX: handleRect.left + 120 });
		await waitFor(() => expect(targetCol.style.width).not.toBe(startWidth));

		fireEvent.mouseUp(document.documentElement);
		await waitFor(() => expect(storyArgs.onColumnResize).toHaveBeenCalled());
		await waitFor(() => expect(document.documentElement.style.cursor).toBe('default'));
	}

	// drag-and-drop reorder: move the second header into the third header's slot
	const headers = canvas.getAllByRole('columnheader');
	await expect(headers.length).toBeGreaterThan(2);
	const dataTransfer = new DataTransfer();
	fireEvent.dragStart(headers[1], { dataTransfer });
	fireEvent.dragOver(headers[2], { dataTransfer });
	fireEvent.drop(headers[2], { dataTransfer });
	fireEvent.dragEnd(headers[1], { dataTransfer });
	await waitFor(() => expect(storyArgs.onColumnReorder).toHaveBeenCalled());
}

export async function runDataTablePlainAndCustomHeaderColumnPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	// the plain/presentational column has no key or accessor, so its cell
	// renders through DefaultCellRenderer with an undefined value
	const plainCell = canvasElement.querySelector('td[data-column-id="0.0"]') as HTMLElement | null;
	await expect(plainCell).toBeInTheDocument();
	await expect(plainCell?.textContent).toBe('');
	// the other column's custom renderHeader replaces DefaultHeaderRenderer entirely
	await expect(canvasElement.textContent).toContain('Custom Header');
}

export async function runDataTableScrollShadowsPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const wrapper = canvasElement.querySelector('[class*="tableWrapper"]') as HTMLElement | null;
	await expect(wrapper).toBeInTheDocument();
	if (!wrapper) return;

	wrapper.scrollTop = 100;
	wrapper.scrollLeft = 50;
	fireEvent.scroll(wrapper);
	await waitFor(() => expect(wrapper.scrollTop).toBeGreaterThan(0));

	wrapper.scrollTop = 0;
	wrapper.scrollLeft = 0;
	fireEvent.scroll(wrapper);
	await waitFor(() => expect(wrapper.scrollTop).toBe(0));
}

export async function runDataTableVirtualizedScrollPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const wrapper = canvasElement.querySelector('[class*="tableWrapper"]') as HTMLElement | null;
	await expect(wrapper).toBeInTheDocument();
	if (!wrapper) return;

	// scroll partway down a large virtualized list so a top spacer row and a
	// bottom spacer row both exist at the same time
	await waitFor(() => expect(wrapper.scrollHeight).toBeGreaterThan(wrapper.clientHeight));
	wrapper.scrollTop = wrapper.scrollHeight / 2;
	fireEvent.scroll(wrapper);
	await waitFor(() => expect(wrapper.scrollTop).toBeGreaterThan(0));
}

export async function runFileIconInteractionsPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const svg = canvasElement.querySelector('svg') as SVGElement | null;
	await expect(svg).toBeInTheDocument();
	if (!svg) return;

	await userEvent.click(svg);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalledTimes(1);
	}

	// Enter activates via accessibleKeyDown -> handleClick
	fireEvent.keyDown(svg, { key: 'Enter' });
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalledTimes(2);
	}

	// a non-activating key still reaches accessibleKeyDown but doesn't match,
	// so it shouldn't produce another click
	fireEvent.keyDown(svg, { key: 'a' });
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalledTimes(2);
	}
}

export async function runFileIconDisabledPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const svg = canvasElement.querySelector('svg') as SVGElement | null;
	await expect(svg).toBeInTheDocument();
	if (!svg) return;

	await userEvent.click(svg);
	// pointer=true here so !pointer is false and the disabled operand is what
	// short-circuits the onKeyDown early return
	fireEvent.keyDown(svg, { key: 'Enter' });
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}
}

export async function runFileIconNonPointerPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const svg = canvasElement.querySelector('svg') as SVGElement | null;
	await expect(svg).toBeInTheDocument();
	if (!svg) return;

	// pointer=false here so !pointer alone short-circuits the onKeyDown early
	// return before the disabled operand is even evaluated
	fireEvent.keyDown(svg, { key: 'Enter' });
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}
}

export async function runFileIconUnknownNamePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// an unregistered name resolves to no path definition, so the component
	// renders nothing at all
	await expect(canvasElement.querySelector('svg')).not.toBeInTheDocument();
}

export async function runLevelActiveBarsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// minIntensity > 0 forces some bars active from the very first render,
	// without needing real audio analysis to drive normalizedIntensity up
	const bars = canvasElement.querySelectorAll('[class*="bar"]');
	await expect(bars.length).toBeGreaterThan(0);
	const activeBar = Array.from(bars).find((bar) => (bar as HTMLElement).style.opacity === '1');
	await expect(activeBar).toBeTruthy();
}

export async function runLevelStreamLifecyclePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// starting the stream while playing=true (the default) exercises the
	// audioStream-present branch and the first effect's `if (playing) start()`
	await userEvent.click(canvas.getByRole('button', { name: /start stream/i }));

	// let a handful of real rAF frames run so the visualizer's onFrame/onUpdate
	// callback actually fires at least once - there's no ref exposed to await
	// on directly, so this just gives real Chromium's audio pipeline a chance
	// to run rather than asserting an exact intensity value (which would be
	// flaky)
	await new Promise<void>((resolve) => {
		let frames = 0;
		const tick = () => {
			frames++;
			if (frames > 5) resolve();
			else requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	});

	// pausing with a live stream exercises the second effect's ref-present
	// branch plus its `stop()` path
	await userEvent.click(canvas.getByRole('button', { name: /toggle playing/i }));
	// resuming exercises the second effect's `start()` path
	await userEvent.click(canvas.getByRole('button', { name: /toggle playing/i }));

	// stopping the stream while it's the active one runs the first effect's
	// cleanup (dispose + the ref-still-matches guard)
	await userEvent.click(canvas.getByRole('button', { name: /stop stream/i }));

	// starting a new stream while paused exercises the first effect's
	// `if (playing)` false branch (create the visualizer but don't start it)
	await userEvent.click(canvas.getByRole('button', { name: /toggle playing/i }));
	await userEvent.click(canvas.getByRole('button', { name: /start stream/i }));
	await waitFor(() => expect(canvasElement.querySelectorAll('[class*="bar"]').length).toBeGreaterThan(0));
}

export async function runLabelBackgroundVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// each of these renders exercises a different case of the semantic
	// background/border-color switches (setBgColor/setBorderColor in Label.tsx)
	for (const text of ['Green', 'Yellow', 'Grey', 'Light Grey', 'White', 'Blue']) {
		await expect(canvas.getByText(text)).toBeInTheDocument();
	}

	// an explicitly empty backgroundColor exercises the `!resolvedBackgroundColor`
	// early-return branch in both useMemos
	const emptyBg = canvas.getByText('Empty');
	await expect(emptyBg).toBeInTheDocument();
	await expect(emptyBg.style.getPropertyValue('--label-bg-color')).toBe('transparent');

	// an explicit padding prop exercises setPadding's truthy branch instead of
	// the '2px 4px' default
	const padded = canvas.getByText('Padded');
	await expect(padded).toBeInTheDocument();
	await expect(padded.style.getPropertyValue('--label-padding')).toBe('12px');
}

export async function runUploadAreaKeyboardAndFileInputPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const dropzone = canvas.getByRole('button', { name: /click to upload files/i });

	// keyboard activation goes through the same native-file-dialog call as a
	// real click, so stub HTMLInputElement.prototype.click to avoid actually
	// opening an OS file picker in the real browser this test runs in
	const clickSpy = spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
	try {
		fireEvent.keyDown(dropzone, { key: 'Enter' });
		await expect(clickSpy).toHaveBeenCalledTimes(1);

		// a non-activating key reaches accessibleKeyDown but doesn't match, so
		// it shouldn't open the picker again
		fireEvent.keyDown(dropzone, { key: 'a' });
		await expect(clickSpy).toHaveBeenCalledTimes(1);
	} finally {
		clickSpy.mockRestore();
	}

	// exercise the hidden file input's own change handler directly, bypassing
	// the native picker entirely
	const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement | null;
	await expect(input).toBeInTheDocument();
	if (!input) return;

	const file = new File(['contents'], 'via-input.txt', { type: 'text/plain' });
	fireEvent.change(input, { target: { files: [file] } });

	if (isFn(storyArgs.onUpload)) {
		await expect(storyArgs.onUpload).toHaveBeenCalled();
	}
}

export async function runUploadAreaBusyGuardsPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);

	// while busy, the area isn't a "button" at all (isInteractive is false),
	// so target the wrapper directly rather than via an accessible role
	const wrapper = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
	await expect(wrapper).toBeInTheDocument();
	if (!wrapper) return;
	await expect(wrapper.getAttribute('aria-disabled')).toBe('true');

	// a busy+showProgress area renders the inline progress indicator instead
	// of just the message
	await expect(canvasElement.querySelector('[class*="message"] [role="img"]')).toBeInTheDocument();

	const file = new File(['contents'], 'ignored.txt', { type: 'text/plain' });
	const dataTransfer = new DataTransfer();
	dataTransfer.items.add(file);

	// every drag/drop/change handler early-returns while busy, so none of
	// these should ever reach onUpload
	fireEvent.dragEnter(wrapper, { dataTransfer });
	fireEvent.dragLeave(wrapper, { dataTransfer });
	fireEvent.drop(wrapper, { dataTransfer });

	const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement | null;
	if (input) fireEvent.change(input, { target: { files: [file] } });

	if (isFn(storyArgs.onUpload)) {
		await expect(storyArgs.onUpload).not.toHaveBeenCalled();
	}
}

export async function runUploadAreaDragWithoutFilesPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const dropzone = canvas.getByRole('button', { name: /click to upload files/i });

	// no dataTransfer at all -> hasFilesInDrag's `?? []` fallback, and no
	// 'Files' type present -> the early-return branch of handleDragEnter (no
	// hover set). handleDrop has no equivalent hasFilesInDrag gate, though -
	// it always calls onUpload once busy/dataTransfer.files are resolved, so
	// a fileless drop still fires onUpload with an empty array rather than
	// being suppressed entirely.
	fireEvent.dragEnter(dropzone);
	fireEvent.drop(dropzone);

	if (isFn(storyArgs.onUpload)) {
		await expect(storyArgs.onUpload).toHaveBeenCalledWith([]);
	}

	// acceptedTypes is falsy on this story - the hidden input should have no
	// accept attribute at all rather than an empty string
	const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement | null;
	await expect(input?.hasAttribute('accept')).toBe(false);
}

export async function runUploadAreaNestedDragDepthPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const dropzone = canvas.getByRole('button', { name: /click to upload files/i });
	const file = new File(['contents'], 'nested.txt', { type: 'text/plain' });
	const dataTransfer = new DataTransfer();
	dataTransfer.items.add(file);

	// two nested enters without a leave in between push dragDepth to 2, so
	// the second enter's `dragDepth === 1` check is false (hover was already
	// set by the first)
	fireEvent.dragEnter(dropzone, { dataTransfer });
	fireEvent.dragEnter(dropzone, { dataTransfer });

	// the first leave only brings depth back to 1, so hover should stay on
	fireEvent.dragLeave(dropzone, { dataTransfer });
	const wrapper = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
	await expect(wrapper?.style.getPropertyValue('--ua-bg-color')).not.toBe('');

	// the second leave brings depth to 0 and actually clears hover
	fireEvent.dragLeave(dropzone, { dataTransfer });
}

export async function runDoneCheckAnimatesAndFiresCallbacksPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvasElement.querySelector('[class*="icon"]') as HTMLElement | null;
	await expect(icon).toBeInTheDocument();
	if (!icon) return;

	// play:true stages the scale transition across two RAFs, then the real
	// CSS transition fires transitionstart/transitionend on the scale prop
	if (isFn(storyArgs.didStart)) {
		await waitFor(() => expect(storyArgs.didStart).toHaveBeenCalled());
	}
	if (isFn(storyArgs.didEnd)) {
		await waitFor(() => expect(storyArgs.didEnd).toHaveBeenCalled());
	}
	await waitFor(() => expect(icon.style.getPropertyValue('--icon-scale')).toBe('1'));
	await expect(icon.style.getPropertyValue('--icon-transition')).not.toBe('unset');
}

export async function runDoneCheckNoPlayPlay({ canvasElement, args }: PlayContext) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvasElement.querySelector('[class*="icon"]') as HTMLElement | null;
	await expect(icon).toBeInTheDocument();
	if (!icon) return;

	// play:false skips the mount animation entirely - scale is 1 from the
	// first render and the transition custom property is left 'unset', so
	// no transitionstart/transitionend should ever fire
	await expect(icon.style.getPropertyValue('--icon-scale')).toBe('1');
	await expect(icon.style.getPropertyValue('--icon-transition')).toBe('unset');

	if (isFn(storyArgs.didStart)) {
		await expect(storyArgs.didStart).not.toHaveBeenCalled();
	}
	if (isFn(storyArgs.didEnd)) {
		await expect(storyArgs.didEnd).not.toHaveBeenCalled();
	}
}

export async function runDoneCheckWithoutCallbacksPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const icon = canvasElement.querySelector('[class*="icon"]') as HTMLElement | null;
	await expect(icon).toBeInTheDocument();
	if (!icon) return;

	// didStart/didEnd are both omitted here, exercising the `didStart?.()` /
	// `didEnd?.()` optional-chaining branches with no callback attached - the
	// animation should still run to completion without throwing
	await waitFor(() => expect(icon.style.getPropertyValue('--icon-scale')).toBe('1'));
}

export async function runDotVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);

	// corner position: absolute placement with top/right offsets
	const corner = canvasElement.querySelector('[class*="corner"]') as HTMLElement | null;
	await expect(corner).toBeInTheDocument();
	await expect(corner?.style.getPropertyValue('--dot-position')).toBe('absolute');
	await expect(corner?.style.getPropertyValue('--dot-vertical-align')).toBe('unset');

	// explicit color takes priority over a named state
	const explicitColor = canvasElement.querySelector('[class*="explicit-color"]') as HTMLElement | null;
	await expect(explicitColor?.style.getPropertyValue('--dot-bg')).toBe('#ff0000');

	// each named state resolves to its own feedback color
	const stateChecks: Array<[string, string]> = [
		['state-red', 'var(--feedback-warning)'],
		['state-yellow', 'var(--feedback-attention)'],
		['state-green', 'var(--feedback-positive)'],
		['state-grey', 'var(--core-text-secondary)'],
	];
	for (const [testId, expected] of stateChecks) {
		const node = canvasElement.querySelector(`[class*="${testId}"]`) as HTMLElement | null;
		await expect(node).toBeInTheDocument();
		await expect(node?.style.getPropertyValue('--dot-bg')).toBe(expected);
	}

	// no color and no state falls through the switch to the default color
	const noState = canvasElement.querySelector('[class*="no-state"]') as HTMLElement | null;
	await expect(noState?.style.getPropertyValue('--dot-bg')).toBe('var(--core-text-special)');

	// custom motionValues/transition just need to merge without throwing
	await expect(canvasElement.querySelector('[class*="motion-values"]')).toBeInTheDocument();
	await expect(canvasElement.querySelector('[class*="custom-transition"]')).toBeInTheDocument();

	// show=false never renders the dot at all
	await expect(canvasElement.querySelector('[class*="hidden"]')).not.toBeInTheDocument();
}

function coloredIconFill(canvasElement: HTMLElement): string | null {
	const path = canvasElement.querySelector('path[fill]:not([fill="transparent"])');
	return path?.getAttribute('fill') ?? null;
}

export async function runChipDisabledPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const chip = canvas.getByText(String(storyArgs.label));

	// tooltip hover fires regardless of disabled - only the click/keyboard
	// activation paths are gated
	await userEvent.hover(chip);
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).toHaveBeenCalled();
	}
	await userEvent.unhover(chip);

	await userEvent.click(chip);
	fireEvent.keyDown(chip, { key: 'Enter' });
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}

	// disabled forces the icon and border/bg colors to the disabled palette
	await expect(coloredIconFill(canvasElement)).toBe('var(--core-text-disabled)');
	const wrapper = canvasElement.querySelector('[class*="chip"]') as HTMLElement | null;
	await expect(wrapper?.style.getPropertyValue('--ui-chip-border-color')).toBe('var(--core-text-disabled)');
	await expect(wrapper?.style.getPropertyValue('--ui-chip-cursor')).toBe('default');
}

export async function runChipButtonVariantPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const wrapper = canvasElement.querySelector('[class*="button-chip"]') as HTMLElement | null;
	await expect(wrapper).toBeInTheDocument();
	if (!wrapper) return;

	// no tooltip prop -> the enter branch skips building a tip, but a
	// button-variant chip still tracks hover state for its icon color
	await expect(wrapper.style.getPropertyValue('--ui-chip-cursor')).toBe('pointer');
	const before = coloredIconFill(canvasElement);
	await userEvent.hover(wrapper);
	await waitFor(() => expect(coloredIconFill(canvasElement)).not.toBe(before));
	await expect(coloredIconFill(canvasElement)).toBe('var(--core-text-special)');

	await userEvent.unhover(wrapper);
	await waitFor(() => expect(coloredIconFill(canvasElement)).toBe(before));

	// keyboard activation goes through the same handleClick as a real click
	fireEvent.keyDown(wrapper, { key: 'Enter' });
	fireEvent.keyDown(wrapper, { key: ' ' });
}

export async function runChipLayoutVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// icon on the right swaps the left/right padding split
	await expect(canvas.getByText('Right Icon')).toBeInTheDocument();

	// no icon and no label/children renders neither slot, exercising the
	// `!label || !icon` padding branch with both falsy
	const bareChip = canvasElement.querySelector('[class*="no-icon-no-label"]') as HTMLElement | null;
	await expect(bareChip).toBeInTheDocument();
	await expect(bareChip?.querySelector('[class*="icon"]')).not.toBeInTheDocument();

	// children take priority over label for the rendered text
	await expect(canvas.getByText('Children Label')).toBeInTheDocument();

	// an explicit borderWidth overrides the borderSize fallback
	const customBorder = canvasElement.querySelector('[class*="custom-border"]') as HTMLElement | null;
	await expect(customBorder?.style.getPropertyValue('--ui-chip-border-size')).toBe('3px');
}

export async function runTipShowsAndHidesPlay({ canvasElement, args }: PlayContext) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const tip = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
	await expect(tip).toBeInTheDocument();
	if (!tip) return;

	// positive coords stay hidden until the show-delay timer fires
	await expect(tip.style.visibility).toBe('hidden');

	const coords = storyArgs.coords as { x: number; y: number } | undefined;
	await waitFor(() => expect(tip.style.visibility).toBe('visible'));
	await expect(tip.style.left).toBe(`${coords?.x ?? 0}px`);
	await expect(tip.style.top).toBe(`${coords?.y ?? 0}px`);
	await expect(tip.textContent).toBe('Tip text');

	// and it hides itself again once the hide-delay timer fires
	await waitFor(() => expect(tip.style.visibility).toBe('hidden'));
	await expect(tip.style.left).toBe('0px');
	await expect(tip.style.top).toBe('0px');
}

export async function runTipHiddenAtOriginPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const tip = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
	await expect(tip).toBeInTheDocument();
	if (!tip) return;

	// coords at the origin never satisfy `x > 0 && y > 0`, so the tip never
	// schedules a show timer at all
	await expect(tip.style.visibility).toBe('hidden');
	await expect(tip.textContent).toBe('');
}

export async function runTipStyleVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);

	const noBorder = canvasElement.querySelector('[class*="no-border"]') as HTMLElement | null;
	await expect(noBorder?.style.getPropertyValue('--tooltip-border')).toBe('unset');

	const customBorderColor = canvasElement.querySelector('[class*="custom-border-color"]') as HTMLElement | null;
	await expect(customBorderColor?.style.getPropertyValue('--tooltip-border')).toBe('1px solid #ff0000');

	const textColorPriority = canvasElement.querySelector('[class*="text-color-priority"]') as HTMLElement | null;
	await expect(textColorPriority?.style.getPropertyValue('--tooltip-color')).toBe('#00ff00');

	const colorFallback = canvasElement.querySelector('[class*="color-fallback"]') as HTMLElement | null;
	await expect(colorFallback?.style.getPropertyValue('--tooltip-color')).toBe('#0000ff');

	const radiusPriority = canvasElement.querySelector('[class*="border-radius-priority"]') as HTMLElement | null;
	await expect(radiusPriority?.style.getPropertyValue('--tooltip-border-radius')).toBe('12');

	const radiusFallback = canvasElement.querySelector('[class*="radius-fallback"]') as HTMLElement | null;
	await expect(radiusFallback?.style.getPropertyValue('--tooltip-border-radius')).toBe('4');

	const customPadding = canvasElement.querySelector('[class*="custom-padding"]') as HTMLElement | null;
	await expect(customPadding?.style.getPropertyValue('--tooltip-padding')).toBe('10px 20px');

	const customBg = canvasElement.querySelector('[class*="custom-bg"]') as HTMLElement | null;
	await expect(customBg?.style.getPropertyValue('--tooltip-background')).toBe('#123456');
}

export async function runRadioButtonListDeselectPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const option1 = canvas.getByText('Option 1');

	await userEvent.click(option1);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenLastCalledWith([expect.objectContaining({ value: 'option1' })], [0]);
	}

	// clicking the already-selected option again exercises the
	// `deselect`/state=false branch of doSingleSelection - note the second
	// arg is `[]`, not `null`: doSingleSelection's `state ? [selection] : []`
	// only ever produces `null` via setSelected, not via the onChange call
	await userEvent.click(option1);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenLastCalledWith([], []);
	}
	const radio = canvas.getByRole('radio', { name: /option 1/i });
	await expect(radio).toHaveAttribute('aria-checked', 'false');
}

export async function runRadioButtonListMultiSelectTogglePlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const option1 = canvas.getByText('Option 1');
	const option2 = canvas.getByText('Option 2');

	await userEvent.click(option1);
	await userEvent.click(option2);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenLastCalledWith(
			[expect.objectContaining({ value: 'option1' }), expect.objectContaining({ value: 'option2' })],
			[0, 1],
		);
	}

	// unchecking option 1 exercises the removal (`!state && selected`) branch
	// of doMultiSelection
	await userEvent.click(option1);
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenLastCalledWith([expect.objectContaining({ value: 'option2' })], [1]);
	}
	const checkbox1 = canvas.getByRole('checkbox', { name: /option 1/i });
	await expect(checkbox1).toHaveAttribute('aria-checked', 'false');
}

export async function runRadioButtonListSelectedOptionsEffectPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// selectedOptions matches by fieldName - both stub options share the
	// same fieldName, so the matching effect selects both indexes
	const radios = canvas.getAllByRole('radio');
	for (const radio of radios) {
		await expect(radio).toHaveAttribute('aria-checked', 'true');
	}
	await expect(canvas.getByText('Pick one')).toBeInTheDocument();
}

export async function runRadioButtonListLayoutVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const wrapper = canvasElement.querySelector('[class*="wrapper"]') as HTMLElement | null;
	await expect(wrapper?.style.getPropertyValue('--rb-list-flex-wrap')).toBe('wrap');
	await expect(wrapper?.style.getPropertyValue('--rb-list-margin-bottom')).toBe('24px');
	await expect(wrapper?.style.getPropertyValue('--rb-list-width')).toBe('200px');

	// tabIndexSeed offsets every option's tabIndex by its position
	const options = canvas.getAllByRole('checkbox');
	await expect(options[0]).toHaveAttribute('tabIndex', '5');
	await expect(options[1]).toHaveAttribute('tabIndex', '6');
}

export async function runButtonDisabledInteractionsPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');

	await expect(button).toHaveAttribute('aria-disabled', 'true');
	await expect(button).toBeDisabled();

	// a natively `disabled` form control (this button has both `disabled`
	// and `aria-disabled`) never receives mouse events at all in a real
	// browser - not `mouseenter`, not `mouseover`, nothing - regardless of
	// whether the event is user-driven or dispatched directly via
	// `fireEvent`. jsdom doesn't enforce this restriction, which is why an
	// earlier version of this test assumed the tooltip handler still fired
	// while disabled; in real Chromium it provably never does.
	fireEvent.mouseOver(button);
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).not.toHaveBeenCalled();
	}

	await userEvent.click(button);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}
}

export async function runButtonOutlineDestructiveHoverPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');

	// check the raw inline style, not the browser-resolved computed style -
	// `toHaveStyle` would compare against the resolved color, not the
	// literal `var(...)` string the component actually sets
	await expect(button.style.borderColor).toBe('var(--feedback-warning)');

	await userEvent.hover(button);
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).toHaveBeenCalled();
	}
	await userEvent.unhover(button);
	if (isFn(storyArgs.onToolTip)) {
		await expect(storyArgs.onToolTip).toHaveBeenLastCalledWith(null);
	}
}

export async function runButtonTextVariantChildrenPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	// children take priority over the `label` prop, and the text variant
	// forces zero top/bottom padding
	await expect(canvas.getByText('Children Label')).toBeInTheDocument();
	const button = canvas.getByRole('button');
	await expect(button).toHaveStyle({ paddingTop: '0px', paddingBottom: '0px' });
}

export async function runButtonRoundIconOnlyPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const button = canvas.getByRole('button');

	// round buttons collapse left/right padding to zero regardless of icons
	await expect(button).toHaveStyle({ paddingLeft: '0px', paddingRight: '0px' });
	// no label/children content means the label slot never renders at all
	await expect(canvasElement.querySelector('[class*="label"]')).not.toBeInTheDocument();
}

export async function runButtonShowDotAndCountPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);

	await expect(canvas.getByRole('status', { name: /dot/i })).toBeInTheDocument();
	await expect(canvas.getByText('5')).toBeInTheDocument();
}

export async function runButtonFillAndCustomWidthPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);

	// `fill` forces the surface-primary background regardless of variant,
	// and width='fill' switches the button to `flex: 1`
	const fillButton = canvasElement.querySelector('[class*="fill-button"]') as HTMLElement | null;
	await expect(fillButton?.style.background).toBe('var(--core-surface-primary)');
	await expect(fillButton?.style.flex).not.toBe('unset');

	// a fixed numeric width goes through setWidth's `setStyle` branch and
	// leaves flex alone
	const customWidthButton = canvasElement.querySelector('[class*="custom-width-button"]') as HTMLElement | null;
	await expect(customWidthButton?.style.width).toBe('200px');
	await expect(customWidthButton?.style.flex).toBe('unset');
}

export async function runButtonLinkOpensWindowPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');

	const openSpy = spyOn(globalThis.window, 'open').mockImplementation(() => null);
	try {
		await userEvent.click(button);
		await expect(openSpy).toHaveBeenCalledWith(storyArgs.link, storyArgs.target);
		if (isFn(storyArgs.onClick)) {
			await expect(storyArgs.onClick).toHaveBeenCalled();
		}
	} finally {
		openSpy.mockRestore();
	}
}

export async function runButtonProgressFlowPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const button = canvas.getByRole('button');

	await userEvent.click(button);
	// the progress branch defers onClick until the indicator finishes -
	// it must not fire immediately
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).not.toHaveBeenCalled();
	}
	await expect(canvasElement.querySelector('[class*="container"]')).toBeInTheDocument();

	// once the ProgressIndicator's own duration elapses it calls didStop,
	// which resolves the deferred click with `undefined`
	if (isFn(storyArgs.onClick)) {
		await waitFor(() => expect(storyArgs.onClick).toHaveBeenCalledWith(undefined));
	}
}

export async function runOverlayOpacityVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);

	// `initial={false}` on the AnimatePresence means these mount straight
	// into their animate opacity rather than transitioning from 0
	const clearOverlay = canvasElement.querySelector('[class*="clear-overlay"]') as HTMLElement | null;
	await expect(clearOverlay).toBeInTheDocument();
	if (clearOverlay) {
		// type='clear' always forces 0, regardless of the opacity prop
		await waitFor(() => expect(Number.parseFloat(clearOverlay.style.opacity || '0')).toBeCloseTo(0, 2));
	}

	const darkDefault = canvasElement.querySelector('[class*="dark-default-overlay"]') as HTMLElement | null;
	await expect(darkDefault).toBeInTheDocument();
	if (darkDefault) {
		// no opacity prop on a 'dark' overlay falls back to 0.8
		await waitFor(() => expect(Number.parseFloat(darkDefault.style.opacity || '0')).toBeCloseTo(0.8, 2));
	}

	const darkExplicit = canvasElement.querySelector('[class*="dark-explicit-overlay"]') as HTMLElement | null;
	await expect(darkExplicit).toBeInTheDocument();
	if (darkExplicit) {
		// an explicit opacity (even a low one) always wins over the type default
		await waitFor(() => expect(Number.parseFloat(darkExplicit.style.opacity || '0')).toBeCloseTo(0.3, 2));

		// right-click is blocked on every overlay regardless of type/opacity
		const dispatched = fireEvent.contextMenu(darkExplicit);
		await expect(dispatched).toBe(false);
	}
}

export async function runTextFieldDisabledGuardsPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const input = canvasElement.querySelector('input') as HTMLInputElement | null;
	await expect(input).toBeInTheDocument();
	if (!input) return;
	await expect(input).toBeDisabled();

	// every handler's own `if (disabled) return` guard should suppress its
	// callback even when the event is dispatched directly
	fireEvent.focus(input);
	if (isFn(storyArgs.onFocus)) await expect(storyArgs.onFocus).not.toHaveBeenCalled();

	fireEvent.keyDown(input, { key: 'Enter' });
	if (isFn(storyArgs.onSubmit)) await expect(storyArgs.onSubmit).not.toHaveBeenCalled();

	fireEvent.change(input, { target: { value: 'zzz' } });
	if (isFn(storyArgs.onChange)) await expect(storyArgs.onChange).not.toHaveBeenCalled();

	fireEvent.blur(input);
	if (isFn(storyArgs.onBlur)) await expect(storyArgs.onBlur).not.toHaveBeenCalled();

	const clearBtn = canvasElement.querySelector('button[aria-label="Clear text"]') as HTMLElement | null;
	if (clearBtn) fireEvent.click(clearBtn);
	if (isFn(storyArgs.onClear)) await expect(storyArgs.onClear).not.toHaveBeenCalled();
}

export async function runTextFieldClearButtonRefocusPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);

	const keepFocusWrapper = canvasElement.querySelector('[class*="refocus-keep"]') as HTMLElement | null;
	await expect(keepFocusWrapper).toBeInTheDocument();
	if (keepFocusWrapper) {
		const input = keepFocusWrapper.querySelector('input') as HTMLInputElement | null;
		const clearBtn = keepFocusWrapper.querySelector('button[aria-label="Clear text"]') as HTMLElement | null;
		if (input && clearBtn) {
			await userEvent.click(clearBtn);
			await expect(input.value).toBe('');
			// clearBlurs=false re-focuses the input after clearing
			await waitFor(() => expect(document.activeElement).toBe(input));
		}
	}

	const blursWrapper = canvasElement.querySelector('[class*="refocus-blurs"]') as HTMLElement | null;
	await expect(blursWrapper).toBeInTheDocument();
	if (blursWrapper) {
		const input = blursWrapper.querySelector('input') as HTMLInputElement | null;
		const clearBtn = blursWrapper.querySelector('button[aria-label="Clear text"]') as HTMLElement | null;
		if (input && clearBtn) {
			await userEvent.click(clearBtn);
			await expect(input.value).toBe('');
			// clearBlurs=true skips the refocus - the button keeps focus instead
			await expect(document.activeElement).not.toBe(input);
		}
	}
}

export async function runTextFieldPasswordTogglePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const input = canvasElement.querySelector('input') as HTMLInputElement | null;
	await expect(input).toBeInTheDocument();
	if (!input) return;
	await expect(input).toHaveAttribute('type', 'password');

	const toggle = canvasElement.querySelector('[class*="showPassword"] button') as HTMLElement | null;
	await expect(toggle).toBeInTheDocument();
	if (!toggle) return;

	await userEvent.click(toggle);
	await expect(input).toHaveAttribute('type', 'text');

	await userEvent.click(toggle);
	await expect(input).toHaveAttribute('type', 'password');
}

export async function runTextFieldStyleVariantsPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);

	const underline = canvasElement.querySelector('[class*="underline-border"]') as HTMLElement | null;
	await expect(underline?.style.getPropertyValue('--tf-box-shadow')).toBe('0 1px 0 0 var(--core-outline-primary)');

	const noBorder = canvasElement.querySelector('[class*="none-border"]') as HTMLElement | null;
	await expect(noBorder?.style.getPropertyValue('--tf-box-shadow')).toBe('unset');

	const errorState = canvasElement.querySelector('[class*="error-state"]') as HTMLElement | null;
	await expect(errorState?.style.getPropertyValue('--tf-color')).toBe('var(--feedback-warning)');
	await expect(errorState?.style.getPropertyValue('--tf-box-shadow')).toBe('0 0 0 1px var(--feedback-warning)');

	const iconLeft = canvasElement.querySelector('[class*="icon-left"]') as HTMLElement | null;
	await expect(iconLeft?.querySelector('svg, path')).toBeInTheDocument();

	const emptyLabel = canvasElement.querySelector('[class*="empty-label"]') as HTMLElement | null;
	await expect(emptyLabel?.style.getPropertyValue('--tf-padding-label-left')).toBe('unset');

	const noLabel = canvasElement.querySelector('[class*="no-label"]') as HTMLElement | null;
	await expect(noLabel?.style.getPropertyValue('--tf-padding-label-left')).toBe('0');

	const autoWidth = canvasElement.querySelector('[class*="auto-width"]') as HTMLElement | null;
	await expect(autoWidth?.style.getPropertyValue('--tf-field-size')).toBe('content');

	const unsetWidth = canvasElement.querySelector('[class*="unset-width"]') as HTMLElement | null;
	await expect(unsetWidth?.style.getPropertyValue('--tf-input-width')).not.toBe('100%');

	const paddingChecks: Array<[string, string]> = [
		['padding-multi', '16px'],
		['padding-single', '6px'],
		['padding-invalid', '8px'],
		['padding-number', '26px'],
	];
	for (const [testClass, expected] of paddingChecks) {
		const node = canvasElement.querySelector(`[class*="${testClass}"]`) as HTMLElement | null;
		await expect(node?.style.getPropertyValue('--tf-padding-right')).toBe(expected);
	}
}

function findResizeHandle(canvasElement: HTMLElement): HTMLElement | undefined {
	return Array.from(canvasElement.querySelectorAll('div')).find((node) => {
		return (node as HTMLElement).style.cursor === 'col-resize';
	}) as HTMLElement | undefined;
}

export async function runDraggablePanelLeftDirectionPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;

	// drags='left' offsets the handle from the left edge instead of the right
	await expect(handle.style.left).not.toBe('');
	await expect(handle.style.right).toBe('');

	const panel = handle.parentElement as HTMLElement;
	// the `closed` flag driving border/display comes from a ResizeObserver
	// callback, not the initial render - wait for the handle to report the
	// panel as open (display:flex) rather than checking the border directly,
	// since an unset '' border is also (trivially, wrongly) `not.toBe('none')`
	await waitFor(() => expect(handle.style.display).toBe('flex'));
	await expect(panel.style.borderLeft).not.toBe('none');
	// setting `style.borderRight = 'none'` doesn't reliably round-trip back
	// through the inline shorthand in real Chromium (only the -style longhand
	// is truly recorded, so CSSOM shorthand serialization can read back '');
	// check the actual rendered/computed style instead, which reflects what
	// really shows on screen regardless of that serialization quirk
	await expect(getComputedStyle(panel).borderRightStyle).toBe('none');

	// for a left-anchored panel, dragging toward smaller clientX grows the
	// panel (the reversed half of getNewWidth's ternary)
	const widthBefore = panel.offsetWidth;
	fireEvent.mouseDown(handle, { clientX: 500 });
	fireEvent.mouseMove(document.documentElement, { clientX: 400 });
	await expect(panel.offsetWidth).toBeGreaterThan(widthBefore);
	fireEvent.mouseUp(document.documentElement, { clientX: 400 });

	if (isFn(storyArgs.onResizeStart)) await expect(storyArgs.onResizeStart).toHaveBeenCalled();
	if (isFn(storyArgs.onResize)) await expect(storyArgs.onResize).toHaveBeenCalled();
	if (isFn(storyArgs.onResizeEnd)) await expect(storyArgs.onResizeEnd).toHaveBeenCalled();
}

function makeTouch(target: EventTarget, clientX: number): Touch {
	// real Chromium's TouchEvent constructor rejects plain `{ clientX }`
	// objects in the `touches` list - it needs actual Touch instances
	return new Touch({ identifier: Date.now(), target, clientX, clientY: 0 });
}

export async function runDraggablePanelTouchPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;

	// touch devices use a wider hit target and a bigger offset from the edge
	await expect(handle.style.width).toBe('44px');
	await expect(handle.style.right).toBe('-22px');

	fireEvent.touchStart(handle, { touches: [makeTouch(handle, 300)] });
	fireEvent.touchMove(document.documentElement, { touches: [makeTouch(document.documentElement, 360)] });
	fireEvent.touchEnd(document.documentElement, { touches: [makeTouch(document.documentElement, 360)] });

	if (isFn(storyArgs.onResizeStart)) await expect(storyArgs.onResizeStart).toHaveBeenCalled();
	if (isFn(storyArgs.onResize)) await expect(storyArgs.onResize).toHaveBeenCalled();
	if (isFn(storyArgs.onResizeEnd)) await expect(storyArgs.onResizeEnd).toHaveBeenCalled();
}

// each constraint scenario gets its own fresh mount/drag session rather
// than chaining multiple mousedown/mouseup cycles in one play function -
// that chaining turned out to leave the panel's width stuck from an earlier
// drag in this same story, so scenarios are now fully independent
async function waitForConstraintPanelReady(handle: HTMLElement, panel: HTMLElement) {
	// the `closed` flag (and the width it can force to 0) comes from a
	// ResizeObserver callback, not the initial render - wait for both the
	// handle to report the panel open and the initial constrained width to
	// have actually applied before starting a drag
	await waitFor(() => expect(handle.style.display).toBe('flex'));
	await waitFor(() => expect(panel.style.width).toBe('250px'));
	// root cause of the whole "AllowsWithinBounds" saga, found via live
	// console instrumentation: the panel starts every mount at width 0
	// (gated behind an internal `mounted` flag) and then CSS-transitions to
	// its real target width over `--motion-water-duration` (250ms, since
	// the transition is only disabled while `isDragging`). The inline
	// `style.width` checked above updates to the *target* instantly, but
	// the actual rendered/computed width takes the full 250ms to catch up.
	// `startWidth.current` (what the drag math is based on) is read via
	// `getComputedStyle`, not the inline style, so a drag started before
	// that transition settles computes from an arbitrary mid-animation
	// value - which is exactly why this kept reading a different, wrong
	// number every single run (2.8px, 196px, 3px...). Wait for the
	// computed width to actually catch up to the specified one.
	await waitFor(
		() => {
			const computed = Number.parseInt(getComputedStyle(panel).width, 10);
			const specified = Number.parseInt(panel.style.width, 10);
			expect(computed).toBe(specified);
		},
		{ timeout: 1000 },
	);
}

export async function runDraggablePanelBlocksExcessiveGrowthPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;
	await waitForConstraintPanelReady(handle, panel);

	// an extreme rightward drag pushes well past the fixed 400px max - the
	// clamp should block the update entirely rather than resizing
	fireEvent.mouseDown(handle, { clientX: 500 });
	fireEvent.mouseMove(document.documentElement, { clientX: 100500 });
	await expect(panel.style.width).toBe('250px');
	fireEvent.mouseUp(document.documentElement, { clientX: 100500 });
}

export async function runDraggablePanelAllowsWithinBoundsPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;
	await waitForConstraintPanelReady(handle, panel);

	// found via live console instrumentation: `canDrag`/`doDrag` were never
	// actually broken - a modest in-bounds drag genuinely resizes the panel.
	// The only bug was in this test's assumption that the panel's real
	// *rendered* width matches its 250px *specified* width one-for-one at
	// drag start. It doesn't: `startWidth.current` is read via
	// `getComputedStyle`, not the inline style, and in this real-browser
	// layout that reads a different (and non-integer) value than the
	// specified 250px. The component's own drag math is
	// `startWidth.current + (clientX - startX)`, so read the same real
	// starting width the component will use and assert the exact same
	// formula, instead of assuming what that starting value is.
	const startWidth = Number.parseInt(getComputedStyle(panel).width, 10);
	const resizeCallsBefore = mockCallCount(storyArgs.onResize);
	fireEvent.mouseDown(handle, { clientX: 500 });
	fireEvent.mouseMove(document.documentElement, { clientX: 550 });
	if (isFn(storyArgs.onResize)) {
		await expect(mockCallCount(storyArgs.onResize)).toBeGreaterThan(resizeCallsBefore + 1);
	}
	await expect(panel.style.width).toBe(`${startWidth + 50}px`);
	fireEvent.mouseUp(document.documentElement, { clientX: 550 });
}

export async function runDraggablePanelBlocksExcessiveShrinkPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;
	await waitForConstraintPanelReady(handle, panel);

	// an extreme leftward drag pushes well past the fixed 150px min
	fireEvent.mouseDown(handle, { clientX: 500 });
	fireEvent.mouseMove(document.documentElement, { clientX: -99500 });
	await expect(panel.style.width).toBe('250px');
	fireEvent.mouseUp(document.documentElement, { clientX: -99500 });
}

// each visual-variant scenario now gets its own fresh, full-viewport
// single-panel mount (the same wrapper `Default`/`NoDrag` already use
// reliably) instead of three panels crammed into one custom multi-column
// layout - that custom layout never reported the panel as open at all in
// the real coverage run, most likely because a 300px-wide column inside an
// un-heighted flex row doesn't give the ResizeObserver a stable box to
// settle on the way the proven full-viewport wrapper does.

export async function runDraggablePanelNoHandleAffordancePlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	await waitFor(() => expect(handle.style.display).toBe('flex'));
	const panel = handle.parentElement as HTMLElement;
	// dragHandle=false skips the little visual affordance inside the handle
	await expect(panel.querySelector('[class*="handle"]')).not.toBeInTheDocument();
}

export async function runDraggablePanelContextMenuBlockedPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;
	const dispatched = fireEvent.contextMenu(panel);
	await expect(dispatched).toBe(false);
}

export async function runDraggablePanelContextMenuAllowedPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;
	const dispatched = fireEvent.contextMenu(panel);
	await expect(dispatched).toBe(true);
}

export async function runDraggablePanelCustomBackgroundColorPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;
	// the CSS custom property doesn't depend on the `closed` ResizeObserver
	// state at all, so no settling wait is needed here
	await expect(panel.style.getPropertyValue('--panel-bg')).toBe('rgb(10, 20, 30)');
}

export async function runDraggablePanelInstantInitialOpenPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const handle = findResizeHandle(canvasElement);
	await expect(handle).toBeInTheDocument();
	if (!handle) return;
	const panel = handle.parentElement as HTMLElement;

	// with `transitionDurationOnInit: 0`, the panel's very first open has no
	// animation window at all - unlike every other DraggablePanel story,
	// which needs `waitForConstraintPanelReady`'s extra settle-wait for
	// exactly this reason (see the fourteenth-pass writeup: the default
	// 250ms `--motion-water-duration` entrance transition means the
	// *rendered*/computed width can lag well behind the *specified* inline
	// width for up to 250ms after mount). Deliberately do NOT add that
	// extra wait here - the whole point of this story is that the rendered
	// width already matches the specified one as soon as the inline style
	// itself settles, with no separate catch-up period to wait out.
	await waitFor(() => expect(panel.style.width).toBe('250px'));
	const computed = Number.parseInt(getComputedStyle(panel).width, 10);
	const specified = Number.parseInt(panel.style.width, 10);
	await expect(computed).toBe(specified);
}

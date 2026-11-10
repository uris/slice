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
	const wrapper = within(canvasElement).getByTestId('avatar-group');
	await expect(wrapper).toHaveClass('story-avatargroup-class');
}

export async function runAvatarGroupNullableSpacingPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	// gap/margin forced to `null` (not `undefined`, which the destructured
	// defaults already absorb) exercises cssVars' `?? 0` fallbacks; overlap<=0
	// exercises the `overlap > 0 ? -overlap : 0` false branch
	const wrapper = within(canvasElement).getByTestId('avatar-group');
	await expect(wrapper.style.getPropertyValue('--ag-gap')).toBe('0px');
	await expect(wrapper.style.getPropertyValue('--ag-margin')).toBe('0px');
	await expect(wrapper.style.getPropertyValue('--ag-overlap')).toBe('0px');
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

export async function runFlexBoxPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	await expect(canvasElement.querySelector('div')).toBeInTheDocument();
}

export async function runIconPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvas.getByRole('button');
	await userEvent.click(icon);
	if (isFn(storyArgs.onClick)) {
		await expect(storyArgs.onClick).toHaveBeenCalled();
	}
}

export async function runLogosPlay<TArgs>({ canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	await expect(canvas.getByRole('img')).toBeInTheDocument();
}

export async function runPagerPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const bullets = canvasElement.querySelectorAll('button');
	await expect(bullets.length).toBeGreaterThan(0);
	const target = bullets.length > 1 ? bullets[1] : bullets[0];
	await userEvent.click(target as HTMLElement);
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
		fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
		fireEvent.input(slider, { target: { value: '60' } });
		fireEvent.pointerUp(slider, { pointerId: 1 });
	}
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChangeEnd)) {
		await expect(storyArgs.onChangeEnd).toHaveBeenCalled();
	}
}

export async function runSliderWithoutHandlersPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// Interaction remains safe when both numeric callbacks are omitted.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const slider = canvas.getByRole('slider');
	fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
	fireEvent.input(slider, { target: { value: '60' } });
	fireEvent.pointerUp(slider, { pointerId: 1 });
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
	fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
	fireEvent.input(slider, { target: { value: '60' } });
	fireEvent.pointerUp(slider, { pointerId: 1 });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).not.toHaveBeenCalled();
	}
	if (isFn(storyArgs.onChangeEnd)) {
		await expect(storyArgs.onChangeEnd).not.toHaveBeenCalled();
	}
}

export async function runSliderEdgeDragPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// Verify endpoint input requests; physical beyond-track dragging is checked in the browser.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');

	fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
	fireEvent.input(slider, { target: { value: '100' } });
	fireEvent.pointerUp(slider, { pointerId: 1 });

	fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
	fireEvent.input(slider, { target: { value: '0' } });
	fireEvent.pointerUp(slider, { pointerId: 1 });

	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).toHaveBeenCalled();
	}
}

export async function runSliderCollapsedRangePlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// An equal-bound range stays fixed and emits no changes.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const storyArgs = asArgs(args);
	const slider = canvas.getByRole('slider');
	slider.focus();
	fireEvent.keyDown(slider, { key: 'ArrowRight' });
	fireEvent.pointerDown(slider, { pointerId: 1, button: 0, isPrimary: true });
	fireEvent.input(slider, { target: { value: '60' } });
	fireEvent.pointerUp(slider, { pointerId: 1 });
	if (isFn(storyArgs.onChange)) {
		await expect(storyArgs.onChange).not.toHaveBeenCalled();
	}
}

export async function runSpacerPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const spacer = canvasElement.querySelector('[style*="min-height"]') as HTMLElement | null;
	await expect(spacer).toBeInTheDocument();
	if (spacer) {
		const token = `--spacing-${storyArgs.size ?? 's'}`;
		const computed = getComputedStyle(spacer);
		const expected = computed.getPropertyValue(token).trim();
		await expect(expected).not.toBe('');
		await expect(computed.width).toBe(expected);
		await expect(computed.height).toBe(expected);
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
		if (storyArgs.toggle === false) await expect(storyArgs.onChange).not.toHaveBeenCalled();
		else await expect(storyArgs.onChange).toHaveBeenCalled();
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
	// Optional handlers may be omitted while interaction still updates local state.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const buttons = canvas.getAllByRole('button');
	await userEvent.hover(buttons[0] as HTMLElement);
	await userEvent.click(buttons[0] as HTMLElement);
}

export async function runButtonBarCustomClassPlay<TArgs>({ args, canvasElement }: PlayContext<TArgs>) {
	// exercises `className ? ... : ''`'s true branch
	await runButtonBarPlay({ args, canvasElement });
	const wrapper = within(canvasElement).getAllByRole('button')[0].parentElement;
	await expect(wrapper).toHaveClass('bb-custom-class');
}

export async function runButtonBarSizeEdgeCasesPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	// Invalid runtime size values fall back to the medium frame.
	await expectCanvas(canvasElement);
	const canvas = within(canvasElement);
	const buttons = canvas.getAllByRole('button');
	await expect(buttons.length).toBeGreaterThan(0);
	for (const button of buttons) {
		await expect(button).toHaveStyle({ width: '28px', height: '28px' });
	}
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
	const content = storyArgs.label ?? storyArgs.children;
	const chipLabel = typeof content === 'string' || typeof content === 'number' ? String(content) : null;
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
	const icon = canvas.getByRole('button');
	await userEvent.click(icon);
	if (isFn(storyArgs.onClick)) {
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
	// DialogBox's title bar (the onPointerDown/drag-start target) is the title
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

	// The story starts with the camera off so no native permission request
	// can race this mock. The first click exercises the OverconstrainedError
	// retry before attaching a real synthetic stream.
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

	await waitFor(() => expect(canvas.getByRole('dialog', { name: 'Video player' })).toBeVisible());
	await waitFor(() => expect(canvasElement.querySelector('video')?.readyState).toBeGreaterThanOrEqual(2));

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

	await waitFor(() => expect(canvas.getByRole('dialog', { name: 'Video player' })).toBeVisible());

	// quit='outside' renders a dedicated close IconButton alongside the video
	// instead of (or in addition to) the overlay-click/inline-quit-button paths
	const closeButton = await canvas.findByRole('button', { name: 'Close video' });
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
	await expect(getComputedStyle(wrapper).getPropertyValue('--video-controls-opacity').trim()).toBe('1');
	if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
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

export async function runAudioLevelStreamLifecyclePlay({ canvasElement }: { canvasElement: HTMLElement }) {
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

export async function runDoneCheckAnimatesAndFiresCallbacksPlay<TArgs>({ canvasElement, args }: PlayContext<TArgs>) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvasElement.querySelector('[role="status"]') as HTMLElement | null;
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
	await waitFor(() => expect(getComputedStyle(icon).getPropertyValue('--icon-scale')).toBe('1'));
	await expect(getComputedStyle(icon).getPropertyValue('--icon-transition')).not.toBe('none');
}

export async function runDoneCheckNoPlayPlay({ canvasElement, args }: PlayContext) {
	await expectCanvas(canvasElement);
	const storyArgs = asArgs(args);
	const icon = canvasElement.querySelector('[role="status"]') as HTMLElement | null;
	await expect(icon).toBeInTheDocument();
	if (!icon) return;

	// play:false skips the mount animation entirely - scale is 1 from the
	// first render and the transition custom property is set to 'none', so
	// no transitionstart/transitionend should ever fire
	await expect(getComputedStyle(icon).getPropertyValue('--icon-scale')).toBe('1');
	await expect(getComputedStyle(icon).getPropertyValue('--icon-transition')).toBe('none');

	if (isFn(storyArgs.didStart)) {
		await expect(storyArgs.didStart).not.toHaveBeenCalled();
	}
	if (isFn(storyArgs.didEnd)) {
		await expect(storyArgs.didEnd).not.toHaveBeenCalled();
	}
}

export async function runDoneCheckWithoutCallbacksPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const icon = canvasElement.querySelector('[role="status"]') as HTMLElement | null;
	await expect(icon).toBeInTheDocument();
	if (!icon) return;

	// didStart/didEnd are both omitted here, exercising the `didStart?.()` /
	// `didEnd?.()` optional-chaining branches with no callback attached - the
	// animation should still run to completion without throwing
	await waitFor(() => expect(getComputedStyle(icon).getPropertyValue('--icon-scale')).toBe('1'));
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
	await expect(noState?.style.getPropertyValue('--dot-bg')).toBe('var(--core-gp-logo-primary)');

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
	const disabledChip = canvasElement.querySelector('[class*="chip"]') as HTMLElement;
	await expect(disabledChip.style.getPropertyValue('--ui-chip-icon-color')).toBe('var(--core-text-disabled)');
	const wrapper = canvasElement.querySelector('[class*="chip"]') as HTMLElement | null;
	await expect(wrapper?.style.getPropertyValue('--ui-chip-border-color')).toBe(
		String(storyArgs.borderColorDisabled ?? 'var(--core-fill-primary)'),
	);
	await expect(wrapper?.style.getPropertyValue('--ui-chip-cursor')).toBe('default');
}

export async function runChipButtonVariantPlay({ canvasElement }: { canvasElement: HTMLElement }) {
	await expectCanvas(canvasElement);
	const wrapper = within(canvasElement).getByRole('button');
	const icon = wrapper.querySelector('svg')?.parentElement;
	if (!icon) throw new Error('Chip icon wrapper is missing');
	icon.style.transition = 'none';
	wrapper.blur();
	await userEvent.unhover(wrapper);
	const before = getComputedStyle(icon).color;
	// DOM-simulated hover does not activate CSS :hover; focus-visible uses the same palette.
	wrapper.focus();
	await waitFor(() => expect(getComputedStyle(icon).color).not.toBe(before));
	await expect(wrapper.parentElement?.style.getPropertyValue('--ui-chip-icon-color-hover')).toBe(
		'var(--core-text-special)',
	);
	wrapper.blur();
	await userEvent.unhover(wrapper);
	await waitFor(() => expect(getComputedStyle(icon).color).toBe(before));
	wrapper.focus();
	await userEvent.keyboard('{Enter}');
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

	// children render when label is absent
	await expect(canvas.getByText('Children Label')).toBeInTheDocument();

	// borderWidth controls the rendered border
	const customBorder = canvasElement.querySelector('[class*="custom-border"]') as HTMLElement | null;
	await expect(customBorder?.style.getPropertyValue('--ui-chip-border-width')).toBe('3px');
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

	// Children take priority over label and retain the shared vertical padding.
	await expect(canvas.getByText('Children Label')).toBeInTheDocument();
	const button = canvas.getByRole('button');
	await expect(button).toHaveStyle({ paddingTop: '6px', paddingBottom: '6px' });
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
	await expect(fillButton?.style.backgroundColor).toBe('var(--core-surface-primary)');
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

	// The Button owns its action timer and invokes the deferred click with `undefined`.
	if (isFn(storyArgs.onClick)) {
		await waitFor(() => expect(storyArgs.onClick).toHaveBeenCalledWith(undefined));
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

/** Story-only fixture for exercising live JS motion preferences; restored after each story. */
export function installReducedMotionPreference(initial = true) {
	const original = window.matchMedia;
	const query = '(prefers-reduced-motion: reduce)';
	const events = new EventTarget();
	let reduced = initial;
	const media = {
		media: query,
		get matches() {
			return reduced;
		},
		onchange: null,
		addEventListener: events.addEventListener.bind(events),
		removeEventListener: events.removeEventListener.bind(events),
		dispatchEvent: events.dispatchEvent.bind(events),
		addListener: (listener: EventListener) => events.addEventListener('change', listener),
		removeListener: (listener: EventListener) => events.removeEventListener('change', listener),
	} as unknown as MediaQueryList;
	window.matchMedia = (value) => (value === query ? media : original.call(window, value));
	return {
		set(value: boolean) {
			reduced = value;
			events.dispatchEvent(new MediaQueryListEvent('change', { matches: reduced, media: query }));
		},
		restore() {
			window.matchMedia = original;
		},
	};
}

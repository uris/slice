import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { ElevationLevel } from '../../src/theme/elevations/_types';

/** Verify the public default and live prop updates on the actual rendered surface. */
export async function runElevationPlay(
	{ canvasElement }: { canvasElement: HTMLElement },
	defaultLevel: ElevationLevel = 0,
) {
	const canvas = within(canvasElement);
	const fixture = canvas.getByTestId('elevation-surface');
	const surface = () => {
		const element = Array.from(fixture.querySelectorAll<HTMLElement>('[style]')).find(
			(candidate) => candidate.style.boxShadow,
		);
		if (!element) throw new Error('Expected a surface with an elevation shadow');
		return element;
	};
	const check = async (level: ElevationLevel) => {
		await waitFor(() => expect(surface().style.boxShadow).toBe(`var(--elevation-${level})`));
		await expect(fixture.querySelector('[elevation]')).toBeNull();
		if (level === 0) await waitFor(() => expect(getComputedStyle(surface()).boxShadow).toBe('none'));
		else await waitFor(() => expect(getComputedStyle(surface()).boxShadow).toContain('rgba('));
	};
	await check(defaultLevel);
	await userEvent.click(canvas.getByRole('button', { name: 'Raise surface' }));
	await check(3);
	await userEvent.click(canvas.getByRole('button', { name: 'Flatten surface' }));
	await check(0);
}

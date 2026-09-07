import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ToolTip } from '../../components/sharedTypes';
import { ToolTipType } from '../../components/sharedTypes';
import { useToolTip } from './useToolTip';

function rect(overrides: Partial<DOMRect> = {}): DOMRect {
	return {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		toJSON() {
			return {};
		},
		...overrides,
	} as DOMRect;
}

function makeToolTip(targetRect: DOMRect): ToolTip {
	const target = document.createElement('div');
	vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(targetRect);
	return { type: ToolTipType.general, ref: { current: target } };
}

function stubTip(widthPx: number, heightPx: number, initialWidth: number) {
	const tip = document.createElement('div');
	vi.spyOn(tip, 'getBoundingClientRect').mockReturnValue(
		rect({ width: initialWidth }),
	);
	vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
		width: `${widthPx}px`,
		height: `${heightPx}px`,
	} as CSSStyleDeclaration);
	return { current: tip };
}

beforeEach(() => {
	vi.stubGlobal('innerWidth', 1000);
	vi.stubGlobal('innerHeight', 800);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('useToolTip', () => {
	it('returns hidden coords when there is no tooltip', () => {
		const tipElement = { current: document.createElement('div') };
		const { result } = renderHook(() => useToolTip(null, tipElement));
		expect(result.current).toEqual({ x: 0, y: 0 });
	});

	it('returns hidden coords when the target ref has no current element', () => {
		const tipElement = { current: document.createElement('div') };
		const toolTip: ToolTip = { ref: { current: null } };
		const { result } = renderHook(() => useToolTip(toolTip, tipElement));
		expect(result.current).toEqual({ x: 0, y: 0 });
	});

	it('positions the tooltip centered beneath the target', () => {
		const tipElement = stubTip(100, 40, 100);
		const toolTip = makeToolTip(
			rect({ x: 200, y: 100, width: 80, height: 30 }),
		);

		const { result } = renderHook(() => useToolTip(toolTip, tipElement));

		// x = 200 + 80/2 - 100/2 = 190, y = 100 + 30 + 10 = 140
		expect(result.current).toEqual({ x: 190, y: 140 });
	});

	it('clamps x to the left edge of the viewport', () => {
		const tipElement = stubTip(50, 20, 50);
		const toolTip = makeToolTip(rect({ x: 0, y: 100, width: 10, height: 10 }));

		const { result } = renderHook(() => useToolTip(toolTip, tipElement));

		expect(result.current?.x).toBe(10);
	});

	it('shifts the tooltip left when it would overflow the right edge', () => {
		const tipElement = stubTip(200, 20, 200);
		const toolTip = makeToolTip(
			rect({ x: 950, y: 100, width: 20, height: 10 }),
		);

		const { result } = renderHook(() => useToolTip(toolTip, tipElement));

		// x = 950 + 10 - 100 = 860, endX = 1060 > maxWidth(990) -> shift left by 70
		expect(result.current?.x).toBe(790);
	});

	it('flips the tooltip above the target when it would overflow the bottom edge', () => {
		const tipElement = stubTip(40, 600, 40);
		const toolTip = makeToolTip(
			rect({ x: 100, y: 500, width: 20, height: 10 }),
		);

		const { result } = renderHook(() => useToolTip(toolTip, tipElement));

		// y = 500 + 10 + 10 = 520, endY = 1120 > maxHeight(790) -> parentY - tipHeight - 10
		expect(result.current?.y).toBe(-110);
	});
});

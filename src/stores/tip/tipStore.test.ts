import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ToolTipType } from '../../components/sharedTypes';
import { useTip, useTipActions, useTipStore } from './tipStore';

beforeEach(() => {
	useTipStore.setState({ tip: null });
});

describe('tipStore', () => {
	it('push() sets the active tip', () => {
		useTipStore.getState().actions.push({ type: ToolTipType.general });
		expect(useTipStore.getState().tip).toEqual({ type: ToolTipType.general });
	});

	it('push(null) clears the tip', () => {
		useTipStore.getState().actions.push({ type: ToolTipType.general });
		useTipStore.getState().actions.push(null);
		expect(useTipStore.getState().tip).toBeNull();
	});

	it('clear() resets the tip to null', () => {
		useTipStore.getState().actions.push({ type: ToolTipType.menu });
		useTipStore.getState().actions.clear();
		expect(useTipStore.getState().tip).toBeNull();
	});

	it('exposes atomic selector hooks', () => {
		useTipStore.getState().actions.push({ type: ToolTipType.button });
		const { result: tipResult } = renderHook(() => useTip());
		const { result: actionsResult } = renderHook(() => useTipActions());

		expect(tipResult.current?.type).toBe(ToolTipType.button);
		expect(typeof actionsResult.current.push).toBe('function');
	});
});

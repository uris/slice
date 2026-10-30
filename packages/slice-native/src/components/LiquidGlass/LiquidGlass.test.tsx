// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useImperativeHandle } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGlassContent } from './GlassContentContext';
import { LiquidGlass } from './LiquidGlass';
import { LiquidGlass as IOSLiquidGlassView } from './LiquidGlass.ios';

const state = vi.hoisted(() => ({ fallback: {} as any, native: {} as any, supported: true, preference: 'system' }));
vi.mock('../../hooks', () => ({ useDeviceCapabilities: () => ({ supportsLiquidGlass: state.supported }) }));
vi.mock('../../providers/SliceThemeProvider', () => ({ useSliceThemePreference: () => state.preference }));

vi.mock('react-native', () => ({
	View: ({ ref, children, ...props }: any) => {
		state.fallback = props;
		useImperativeHandle(ref, () => ({ measure: 'fallback' }));
		return <div onClick={props.onTouchEnd}>{children}</div>;
	},
}));

vi.mock('../../specs/LiquidGlassNativeComponent', () => ({
	default: ({ ref, children, ...props }: any) => {
		state.native = props;
		useImperativeHandle(ref, () => ({ measure: 'native' }));
		return <div onClick={props.onTouchEnd}>{children}</div>;
	},
}));

afterEach(() => { cleanup(); state.supported = true; state.preference = 'system'; });
function ContentProbe() { return <span>{String(useGlassContent())}</span>; }

describe('LiquidGlass', () => {
    it('provides capability-gated glass context and forwards native appearance', () => {
        state.preference = 'dark';
        const view = render(<IOSLiquidGlassView><div><ContentProbe /></div></IOSLiquidGlassView>);
        expect(screen.getByText('true')).toBeTruthy();
        expect(state.native.themePreference).toBe('dark');
        state.supported = false;
        view.rerender(<IOSLiquidGlassView><div><ContentProbe /></div></IOSLiquidGlassView>);
        expect(screen.getByText('false')).toBeTruthy();
        view.rerender(<LiquidGlass><div><ContentProbe /></div></LiquidGlass>);
        expect(screen.getByText('false')).toBeTruthy();
    });
	it('keeps fallback children, touch handlers, accessibility, styles and refs usable', () => {
		const onTouchEnd = vi.fn();
		const ref = createRef<any>();
		const style = { padding: 20 };
		render(
			<LiquidGlass ref={ref} style={style} accessibilityLabel="Glass panel" onTouchEnd={onTouchEnd}
				glassStyle="clear" glassTintColor="red" interactive cornerRadius={12} fallbackColor="blue">
				<span>Content</span>
			</LiquidGlass>,
		);
		fireEvent.click(screen.getByText('Content'));
		expect(onTouchEnd).toHaveBeenCalledOnce();
		expect(ref.current.measure).toBe('fallback');
		expect(state.fallback.accessibilityLabel).toBe('Glass panel');
		expect(state.fallback.style).toEqual([{ backgroundColor: 'blue' }, style, { borderRadius: 12, overflow: 'hidden' }]);
		for (const name of ['glassStyle', 'glassTintColor', 'interactive', 'cornerRadius', 'fallbackColor']) {
			expect(state.fallback).not.toHaveProperty(name);
		}
	});

	it('forwards iOS native props and updates without remounting its children', () => {
		const ref = createRef<any>();
		const { rerender } = render(<IOSLiquidGlassView ref={ref}><input defaultValue="Keep me" /></IOSLiquidGlassView>);
		const input = screen.getByRole('textbox');
		expect(state.native).toMatchObject({ glassStyle: 'regular', interactive: false, cornerRadius: 24 });
		expect(ref.current.measure).toBe('native');
		rerender(
			<IOSLiquidGlassView ref={ref} glassStyle="clear" glassTintColor="red" interactive cornerRadius={8} fallbackColor="blue">
				<input defaultValue="Keep me" />
			</IOSLiquidGlassView>,
		);
		expect(state.native).toMatchObject({ glassStyle: 'clear', glassTintColor: 'red', interactive: true, cornerRadius: 8 });
		expect(state.native).not.toHaveProperty('fallbackColor');
		expect(screen.getByRole('textbox')).toBe(input);
	});
});

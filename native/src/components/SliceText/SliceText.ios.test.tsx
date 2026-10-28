// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlassContentContext } from '../SliceLiquidGlassView/GlassContentContext';
import { StyledText } from './SliceText.ios';
import type { StyledTextProps } from './_types';

const state = vi.hoisted(() => ({ native: {} as any, regular: {} as any }));
vi.mock('react-native', async () => ({
    processColor: (await import('../../../tests/helpers/processColor')).processColor, StyleSheet: { flatten: (style: any) => {
        if (!style) return undefined;
        return Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
    } } }));
vi.mock('../../providers/SliceThemeProvider', () => ({
	useSliceTheme: () => ({ type: { body: { fontSize: 20, fontWeight: '600', lineHeight: 28 } } }),
}));
vi.mock('./SliceTextRegular', () => ({ StyledTextRegular: (props: any) => {
	state.regular = props;
	return <span data-testid="regular">{props.children}</span>;
} }));
vi.mock('../../specs/GlassTextNativeComponent', () => ({ default: (props: any) => {
	state.native = props;
	return <span data-testid="native">{props.text}</span>;
} }));
afterEach(cleanup);

function text(props: StyledTextProps = {}, active = true) {
	return <GlassContentContext.Provider value={active}><div><StyledText {...props}>{props.children ?? 'Hello'}</StyledText></div></GlassContentContext.Provider>;
}

describe('glass StyledText', () => {
	it('uses native text through an intermediate view only inside supported glass', () => {
		const view = render(text());
		expect(screen.getByTestId('native').textContent).toBe('Hello');
		expect(state.native).toMatchObject({ colorToken: 'core-text-primary', accessible: true, accessibilityLabel: 'Hello' });
		view.rerender(text({}, false));
		expect(screen.getByTestId('regular')).toBeTruthy();
	});
	it.each([
		{ children: <span>Rich text</span> }, { selectable: true }, { onPress: () => {} },
		{ onTextLayout: () => {} }, { adjustsFontSizeToFit: true },
		{ style: { fontStyle: 'italic' as const } }, { style: { padding: 8 } },
		{ style: { textDecorationLine: 'underline' as const } },
        { style: { textAlign: 'justify' as const } },
	])('retains the existing renderer for unsupported text options %j', (props) => {
		render(text(props));
		expect(screen.getByTestId('regular')).toBeTruthy();
		expect(state.regular).toMatchObject(props);
	});
	it('carries typography, explicit colors, single line, sizing, accessibility and layout through', () => {
		const onLayout = vi.fn();
		render(text({ children: 42, textStyle: 'body' as any, textColor: 'core-text-secondary', singleLine: 1.1,
			style: { fontSize: 24, color: 'red', width: 120, textAlign: 'center' }, allowFontScaling: false,
			maxFontSizeMultiplier: 2, accessibilityLabel: 'Answer', onLayout }));
		expect(state.native).toMatchObject({ text: '42', colorToken: 'core-text-primary',
			fontSize: 24, fontWeight: '600', lineHeight: 26.400000000000002, maximumLines: 1,
			alignment: 'center', allowFontScaling: false, maxFontSizeMultiplier: 2, accessibilityLabel: 'Answer', onLayout });
		expect(state.native.style[1]).toEqual({ width: 120 });
	});
	it('accepts intrinsic measurement updates and ignores invalid native sizes', () => {
        render(text());
        act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: 160, height: 48 } }));
        expect(state.native.style[0]).toMatchObject({ width: 160, height: 48 });
        act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: Number.NaN, height: -1 } }));
        expect(state.native.style[0]).toMatchObject({ width: 160, height: 48 });
    });
	it('updates native color tokens without resolving them to JavaScript colors', () => {
		const view = render(text({ textColor: 'core-text-secondary' }));
		expect(state.native.colorToken).toBe('core-text-secondary');
		view.rerender(text({ textColor: 'feedback-positive', numberOfLines: 2, ellipsizeMode: 'head' }));
		expect(state.native).toMatchObject({ colorToken: 'feedback-positive', maximumLines: 2, ellipsize: 'head' });
		expect(state.native.foregroundColor).toBeUndefined();
	});
});

describe('native text defaults and updates', () => {
    it('accepts plain undecorated text and undefined optional interactions', () => {
        render(text({ singleLine: true, onPress: undefined, accessible: false, style: { textDecorationLine: 'none' } }));
        expect(state.native).toMatchObject({ fontSize: 16, lineHeight: 19.2, maximumLines: 1, accessible: false });
    });
    it('ignores duplicate and invalid size reports while preserving the current layout', () => {
        render(text());
        act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: 80, height: 24 } }));
        const rendered = state.native;
        act(() => state.native.onIntrinsicSizeChange({ nativeEvent: { width: 80, height: 24 } }));
        // React may render once to bail out a duplicate state update.
        expect(state.native.style[0]).toEqual(rendered.style[0]);
        for (const size of [{ width: -1, height: 24 }, { width: 80, height: -1 }, { width: Infinity, height: 24 }, { width: 80, height: NaN }]) {
            act(() => state.native.onIntrinsicSizeChange({ nativeEvent: size }));
            expect(state.native.style[0]).toMatchObject({ width: 80, height: 24 });
        }
    });
});

it('resolves named and palette foregrounds for glass text, including style overrides', () => {
    const view = render(text({ textColor: '#405261' }));
    expect(state.native.colorToken).toBe('core-text-secondary');
    view.rerender(text({ textColor: 'core-text-tertiary' }));
    expect(state.native.colorToken).toBe('core-text-tertiary');
    view.rerender(text({ textColor: 'core-text-tertiary', style: { color: 'red' } }));
    expect(state.native.colorToken).toBe('core-text-primary');
});

// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { lightTheme } from '../../theme';
import { GlassContentContext, useGlassContent } from '../LiquidGlass/GlassContentContext';
import { Text } from './Text';

const state = vi.hoisted(() => ({ text: {} as any }));
vi.mock('react-native', () => ({
	useColorScheme: () => 'light',
	Text: ({ children, ...props }: any) => { state.text = props; return <span>{children}</span>; },
}));
afterEach(cleanup);

describe('regular Text', () => {
	it('uses the default font size for single-line height without a typography token', () => {
		render(<SliceThemeProvider><Text singleLine numberOfLines={4}>Hello</Text></SliceThemeProvider>);
		expect(state.text.numberOfLines).toBe(1);
		expect(state.text.style[0]).toMatchObject({ lineHeight: 19.2 });
		expect(state.text.style[0]).toMatchObject({ color: lightTheme.colors['core-text-primary'] });
	});
	it('keeps nested text content out of the native glass path', () => {
		function Descendant() { return <span>{String(useGlassContent())}</span>; }
		render(<SliceThemeProvider><GlassContentContext.Provider value={true}>
			<Text><Descendant /></Text>
		</GlassContentContext.Provider></SliceThemeProvider>);
		expect(screen.getByText('false')).toBeTruthy();
	});
});

it('accepts literal colors and resolves token props on the ordinary text path', () => {
    const view = render(<SliceThemeProvider><Text textColor="red">Literal</Text></SliceThemeProvider>);
    expect(state.text.style[0]).toMatchObject({ color: 'red' });
    view.rerender(<SliceThemeProvider><Text textColor="core-text-secondary">Token</Text></SliceThemeProvider>);
    expect(state.text.style[0]).toMatchObject({ color: lightTheme.colors['core-text-secondary'] });
});

it('resolves typography overrides and keeps native style overrides last', () => {
 const override = { fontSize: 30, lineHeight: 42, color: 'blue' };
 const view = render(<SliceThemeProvider><Text fontFamily="Custom" fontSize={20} fontWeight="semi" lineHeight={1.5} letterSpacing={2} style={override}>Hello</Text></SliceThemeProvider>);
 expect(state.text.style[0]).toMatchObject({ fontFamily: 'Custom', fontSize: 20, fontWeight: 600, lineHeight: 30, letterSpacing: 2 });
 expect(state.text.style[1]).toBe(override);
 for (const name of ['fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing']) expect(state.text[name]).toBeUndefined();
 view.rerender(<SliceThemeProvider><Text>Hello</Text></SliceThemeProvider>);
 expect(state.text.style[0]).toMatchObject(lightTheme.type['body-l-regular']);
 view.rerender(<SliceThemeProvider><Text fontSize={32}>Hello</Text></SliceThemeProvider>);
 expect(state.text.style[0].lineHeight).toBe(lightTheme.type['body-l-regular'].lineHeight! * 2);
 view.rerender(<SliceThemeProvider><Text fontSize={20} lineHeight={0} letterSpacing={0} fontWeight={450}>Hello</Text></SliceThemeProvider>);
 expect(state.text.style[0]).toMatchObject({ lineHeight: 0, letterSpacing: 0, fontWeight: 450 });
});

it.each(['body-xxl-regular', 'body-xxl-medium', 'body-xxl-bold'] as const)('renders the shared %s preset', (textStyle) => {
 render(<SliceThemeProvider><Text textStyle={textStyle}>Hello</Text></SliceThemeProvider>);
 expect(state.text.style[0]).toMatchObject(lightTheme.type[textStyle]);
 expect(state.text.style[0].fontSize).toBe(18);
});

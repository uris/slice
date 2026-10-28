// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { lightTheme } from '../../theme';
import { GlassContentContext, useGlassContent } from '../SliceLiquidGlassView/GlassContentContext';
import { StyledText } from './SliceText';

const state = vi.hoisted(() => ({ text: {} as any }));
vi.mock('react-native', () => ({
	useColorScheme: () => 'light',
	Text: ({ children, ...props }: any) => { state.text = props; return <span>{children}</span>; },
}));
afterEach(cleanup);

describe('regular StyledText', () => {
	it('uses the default font size for single-line height without a typography token', () => {
		render(<SliceThemeProvider><StyledText singleLine numberOfLines={4}>Hello</StyledText></SliceThemeProvider>);
		expect(state.text.numberOfLines).toBe(1);
		expect(state.text.style).toContainEqual({ lineHeight: 19.2 });
		expect(state.text.style).toContainEqual({ color: lightTheme.colors['core-text-primary'] });
	});
	it('keeps nested text content out of the native glass path', () => {
		function Descendant() { return <span>{String(useGlassContent())}</span>; }
		render(<SliceThemeProvider><GlassContentContext.Provider value={true}>
			<StyledText><Descendant /></StyledText>
		</GlassContentContext.Provider></SliceThemeProvider>);
		expect(screen.getByText('false')).toBeTruthy();
	});
});

it('accepts literal colors and resolves token props on the ordinary text path', () => {
    const view = render(<SliceThemeProvider><StyledText textColor="red">Literal</StyledText></SliceThemeProvider>);
    expect(state.text.style).toContainEqual({ color: 'red' });
    view.rerender(<SliceThemeProvider><StyledText textColor="core-text-secondary">Token</StyledText></SliceThemeProvider>);
    expect(state.text.style).toContainEqual({ color: lightTheme.colors['core-text-secondary'] });
});

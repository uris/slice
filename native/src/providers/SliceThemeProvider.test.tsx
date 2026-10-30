// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Text } from '../components/Text/Text';
import { darkTheme, lightTheme } from '../theme';
import { SliceThemeProvider, type ThemePreference, useSliceContext, useSliceTheme, useSliceThemePreference, useOptionalSliceTheme, type ThemeContextValue } from './SliceThemeProvider';

const state = vi.hoisted(() => ({ scheme: 'light' as string | null, textProps: {} as Record<string, unknown> }));
vi.mock('react-native', () => ({
 useColorScheme: () => state.scheme,
 Text: (props: Record<string, unknown>) => { state.textProps = props; return props.children; },
}));
afterEach(cleanup);
beforeEach(() => { state.scheme = 'light'; state.textProps = {}; });

function Probe() {
 const context = useSliceContext();
 const theme = useSliceTheme();
 return <button onClick={() => context.setPreference?.('dark')}>
 {`${context.mode}:${context.preference}:${theme === darkTheme ? 'dark' : 'light'}`}
 </button>;
}

describe('SliceThemeProvider', () => {
 it('follows system changes and falls back to light for an unknown scheme', () => {
  const tree = <SliceThemeProvider><Probe /></SliceThemeProvider>;
  const view = render(tree);
  expect(screen.getByRole('button').textContent).toBe('light:system:light');
  state.scheme = 'dark';
  view.rerender(<SliceThemeProvider><Probe /></SliceThemeProvider>);
  expect(screen.getByRole('button').textContent).toBe('dark:system:dark');
  state.scheme = null;
  view.rerender(<SliceThemeProvider><Probe /></SliceThemeProvider>);
  expect(screen.getByRole('button').textContent).toBe('light:system:light');
 });
 it.each(['light', 'dark'] as const)('honors an explicit %s preference', (preference) => {
  state.scheme = preference === 'light' ? 'dark' : 'light';
  render(<SliceThemeProvider preference={preference}><Probe /></SliceThemeProvider>);
  expect(screen.getByRole('button').textContent).toBe(`${preference}:${preference}:${preference}`);
 });
 it('lets the app control preference changes', () => {
  function App() {
   const [preference, setPreference] = useState<ThemePreference>('light');
   return <SliceThemeProvider preference={preference} onPreferenceChange={setPreference}><Probe /></SliceThemeProvider>;
  }
  render(<App />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button').textContent).toBe('dark:dark:dark');
 });
 it('keeps a controlled preference until the app updates it', () => {
  const change = vi.fn();
  render(<SliceThemeProvider preference="light" onPreferenceChange={change}><Probe /></SliceThemeProvider>);
  fireEvent.click(screen.getByRole('button'));
  expect(change).toHaveBeenCalledWith('dark');
  expect(screen.getByRole('button').textContent).toBe('light:light:light');
 });
 it.each([useSliceTheme, useSliceContext])('rejects a hook without a provider', (hook) => {
  function Missing() { hook(); return null; }
  expect(() => render(<Missing />)).toThrow(/must be used within SliceThemeProvider/);
 });
 it('supports read-only preferences without a change callback', () => {
  render(<SliceThemeProvider><Probe /></SliceThemeProvider>);
  expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
 });
});

describe('Text with the shared provider', () => {
 it('uses the default text color and forwards native props and children', () => {
  render(<SliceThemeProvider><Text accessibilityLabel="Greeting" numberOfLines={3}>Hello</Text></SliceThemeProvider>);
  expect(screen.getByText('Hello')).toBeTruthy();
  expect(state.textProps).toMatchObject({ accessibilityLabel: 'Greeting', numberOfLines: 3 });
  expect(state.textProps.style[0]).toMatchObject({ color: lightTheme.colors['core-text-primary'] });
 });
 it('resolves typography and colors again when the theme changes, with style overrides last', () => {
  const override = { fontSize: 40 };
  const tree = (preference: 'light' | 'dark') => <SliceThemeProvider preference={preference}>
   <Text textStyle="body-m-regular" textColor="core-text-primary" style={override}>Hello</Text>
  </SliceThemeProvider>;
  const view = render(tree('light'));
  expect(state.textProps.style).toEqual([{ ...lightTheme.type['body-m-regular'], color: lightTheme.colors['core-text-primary'] }, override]);
  view.rerender(tree('dark'));
  expect(state.textProps.style[0]).toMatchObject({ color: darkTheme.colors['core-text-primary'] });
 });
 it.each([[true, 18], [1.5, 22.5]] as const)('supports singleLine=%s and its line height', (singleLine, lineHeight) => {
  render(<SliceThemeProvider><Text textStyle="body-m-regular" singleLine={singleLine}>Hello</Text></SliceThemeProvider>);
  expect(state.textProps.numberOfLines).toBe(1);
  expect(state.textProps.style[0]).toMatchObject({ lineHeight });
 });
});

describe('native appearance preference and provider updates', () => {
    function PreferenceProbe() {
        return <span>{useSliceThemePreference()}</span>;
    }
    it('inherits system appearance without a provider', () => {
        render(<PreferenceProbe />);
        expect(screen.getByText('system')).toBeTruthy();
    });
    it('reports explicit preference independently of the system color scheme', () => {
        const view = render(<SliceThemeProvider preference="dark"><PreferenceProbe /></SliceThemeProvider>);
        expect(screen.getByText('dark')).toBeTruthy();
        view.rerender(<SliceThemeProvider preference="light"><PreferenceProbe /></SliceThemeProvider>);
        expect(screen.getByText('light')).toBeTruthy();
        state.scheme = 'dark';
        view.rerender(<SliceThemeProvider preference="system"><PreferenceProbe /></SliceThemeProvider>);
        expect(screen.getByText('system')).toBeTruthy();
    });
    it('keeps context identity stable and replaces a changed callback without a theme change', () => {
        const contexts: ThemeContextValue[] = [];
        function ContextProbe() { contexts.push(useSliceContext()); return null; }
        const first = vi.fn(), second = vi.fn();
        const tree = (callback: (preference: ThemePreference) => void) =>
            <SliceThemeProvider preference="light" onPreferenceChange={callback}><ContextProbe /></SliceThemeProvider>;
        const view = render(tree(first));
        const original = contexts.at(-1);
        view.rerender(tree(first));
        expect(contexts.at(-1)).toBe(original);
        view.rerender(tree(second));
        expect(contexts.at(-1)).not.toBe(original);
        contexts.at(-1)?.setPreference?.('dark');
        expect(second).toHaveBeenCalledWith('dark');
        expect(first).not.toHaveBeenCalled();
        expect(contexts.at(-1)?.theme).toBe(lightTheme);
    });
    it('isolates nested provider preferences from their parent', () => {
        render(<SliceThemeProvider preference="dark">
            <div data-testid="outer"><PreferenceProbe /></div>
            <SliceThemeProvider preference="light"><div data-testid="inner"><PreferenceProbe /></div></SliceThemeProvider>
        </SliceThemeProvider>);
        expect(screen.getByTestId('outer').textContent).toBe('dark');
        expect(screen.getByTestId('inner').textContent).toBe('light');
    });
});

it('lets standalone consumers read an optional theme without requiring a provider', () => {
    function OptionalProbe() {
        const theme = useOptionalSliceTheme();
        return <span>{theme?.name ?? 'No provider'}</span>;
    }
    const view = render(<OptionalProbe />);
    expect(screen.getByText('No provider')).toBeTruthy();
    view.rerender(<SliceThemeProvider preference="dark"><OptionalProbe /></SliceThemeProvider>);
    expect(screen.getByText('darkMode')).toBeTruthy();
    view.rerender(<SliceThemeProvider preference="light"><OptionalProbe /></SliceThemeProvider>);
    expect(screen.getByText('lightMode')).toBeTruthy();
});

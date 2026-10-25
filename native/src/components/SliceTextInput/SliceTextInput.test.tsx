// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useImperativeHandle } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { SliceTextInput } from './SliceTextInput';

const state = vi.hoisted(() => ({ props: {} as any, wrapper: {} as any, focused: false, clear: vi.fn(), focus: vi.fn(), blur: vi.fn() }));
vi.mock('react-native', () => ({
 useColorScheme: () => 'light',
 StyleSheet: { create: (s: unknown) => s },
 View: ({ children }: any) => children,
 TextInput: ({ ref, ...props }: any) => {
  state.props = props;
  useImperativeHandle(ref, () => ({ clear: state.clear, focus: state.focus, blur: state.blur, isFocused: () => state.focused }));
  return <input aria-label={props.accessibilityLabel} placeholder={props.placeholder} value={props.value} defaultValue={props.defaultValue} onChange={(e) => props.onChangeText?.(e.target.value)} onFocus={props.onFocus} onBlur={props.onBlur} />;
 },
}));
vi.mock('react-native-reanimated', () => ({ default: { View: (props: any) => { state.wrapper = props; return props.children; } } }));
vi.mock('../SliceIcon', () => ({ SliceIcon: (props: any) => <span data-testid="icon" data-color={props.strokeColor} data-size={props.size} data-accessible={String(props.accessible)} /> }));
afterEach(cleanup);
beforeEach(() => { state.focused = false; vi.clearAllMocks(); });
const tree = (props = {}, preference: 'light' | 'dark' = 'light') => <SliceThemeProvider preference={preference}><SliceTextInput accessibilityLabel="Search" {...props} /></SliceThemeProvider>;

describe('SliceTextInput', () => {
 it('preserves initial text without clearing or forcing focus', () => {
  render(tree({ defaultValue: 'Initial' }));
  expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Initial');
  expect(state.clear).not.toHaveBeenCalled();
  expect(state.focus).not.toHaveBeenCalled();
  expect(state.blur).not.toHaveBeenCalled();
 });
 it('forwards accessibility and native input props, style overrides, and text changes', () => {
  const onChangeText = vi.fn();
  const style = { fontSize: 24 };
  render(tree({ onChangeText, style, accessibilityHint: 'Search your tasks', accessibilityState: { busy: true }, keyboardType: 'email-address', secureTextEntry: true }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'Hello' } });
  expect(onChangeText).toHaveBeenCalledWith('Hello');
  expect(state.props).toMatchObject({ accessibilityHint: 'Search your tasks', accessibilityState: { busy: true }, keyboardType: 'email-address', secureTextEntry: true });
  expect(state.props.style.at(-1)).toBe(style);
 });
 it('composes focus callbacks and shows the icon again after blur without clearing by default', () => {
  const onFocus = vi.fn(), onBlur = vi.fn(), didFocus = vi.fn();
  render(tree({ icon: 'home', onFocus, onBlur, didFocus }));
  expect(screen.getByTestId('icon').dataset.accessible).toBe('false');
  fireEvent.focus(screen.getByRole('textbox'));
  expect(screen.queryByTestId('icon')).toBeNull();
  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(didFocus).toHaveBeenLastCalledWith(true);
  fireEvent.blur(screen.getByRole('textbox'));
  expect(screen.getByTestId('icon')).toBeTruthy();
  expect(onBlur).toHaveBeenCalledTimes(1);
  expect(didFocus).toHaveBeenLastCalledWith(false);
  expect(state.clear).not.toHaveBeenCalled();
 });
 it('clears only on blur when requested and notifies controlled consumers', () => {
  const onChangeText = vi.fn();
  render(tree({ blurClears: true, value: 'Saved', onChangeText }));
  expect(state.clear).not.toHaveBeenCalled();
  fireEvent.blur(screen.getByRole('textbox'));
  expect(state.clear).toHaveBeenCalledTimes(1);
  expect(onChangeText).toHaveBeenCalledWith('');
 });
 it('drives native focus only when requested and avoids redundant focus calls', () => {
  const view = render(tree({ focused: true }));
  expect(state.focus).toHaveBeenCalledTimes(1);
  state.focused = true;
  view.rerender(tree({ focused: false }));
  expect(state.blur).toHaveBeenCalledTimes(1);
  view.rerender(tree({ focused: true }));
  expect(state.focus).toHaveBeenCalledTimes(1);
 });
 it('keeps icons visible on focus when requested and supports explicit colors and sizes', () => {
  render(tree({ icon: 'home', hideIconOnFocus: false, iconColor: 'red', iconSize: 20 }));
  fireEvent.focus(screen.getByRole('textbox'));
  expect(screen.getByTestId('icon').dataset).toMatchObject({ color: 'red', size: '20' });
 });
 it('uses placeholder color while idle and theme color while focused', () => {
  const view = render(tree({ icon: 'home', hideIconOnFocus: false }));
  expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-secondary']);
  fireEvent.focus(screen.getByRole('textbox'));
  expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-primary']);
  view.rerender(tree({ icon: 'home', hideIconOnFocus: false }, 'dark'));
  expect(screen.getByTestId('icon').dataset.color).toBe(darkTheme.colors['core-link-primary']);
  expect(state.props.placeholderTextColor).toBe(darkTheme.colors['core-text-secondary']);
 });
 it('forwards layout and placeholder overrides and exposes non-editable state', () => {
  const layout = () => undefined;
  render(tree({ layout, placeholderTextColor: 'pink', editable: false }));
  expect(state.wrapper.layout).toBe(layout);
  expect(state.props.placeholderTextColor).toBe('pink');
  expect(state.props.accessibilityState.disabled).toBe(true);
 });
});

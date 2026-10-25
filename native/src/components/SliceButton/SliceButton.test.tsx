// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SliceThemeProvider } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { SliceButton } from './SliceButton';

const state = vi.hoisted(() => ({ pressable: {} as any, views: [] as any[] }));
vi.mock('react-native', () => ({
 useColorScheme: () => 'light',
 StyleSheet: { create: (styles: unknown) => styles, compose: (a: unknown, b: unknown) => [a, b] },
 Pressable: (props: any) => {
  state.pressable = props;
  return <button disabled={props.disabled} aria-label={props.accessibilityLabel} onClick={props.onPress}>{props.children}</button>;
 },
}));
vi.mock('react-native-reanimated', () => ({ default: { View: (props: any) => { state.views.push(props); return props.children; } } }));
vi.mock('../SliceIcon', () => ({ SliceIcon: (props: any) => <span data-testid="icon" data-name={props.name} data-size={props.size} data-color={props.strokeColor} data-accessible={String(props.accessible)} /> }));
vi.mock('../SliceText/SliceText', () => ({ StyledText: (props: any) => <span data-testid="label" data-color={props.style.color}>{props.children}</span> }));

afterEach(cleanup);
beforeEach(() => { state.views = []; state.pressable = {}; });
function button(children: ReactNode, props = {}, preference: 'light' | 'dark' = 'light') {
 return <SliceThemeProvider preference={preference}><SliceButton {...props}>{children}</SliceButton></SliceThemeProvider>;
}
function wrapperStyle() { return Object.assign({}, ...state.views.at(-1).style.flat(Infinity)); }
function pressableStyle() { return Object.assign({}, ...[state.pressable.style].flat(Infinity)); }

describe('SliceButton', () => {
 it('uses primary styling, native button semantics, and forwards presses', () => {
  const onPress = vi.fn();
  render(button('Save', { onPress, testID: 'save', accessibilityHint: 'Saves changes' }));
  fireEvent.click(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(state.pressable).toMatchObject({ accessibilityRole: 'button', accessibilityState: { disabled: false }, testID: 'save', accessibilityHint: 'Saves changes' });
  expect(wrapperStyle()).toMatchObject({ backgroundColor: lightTheme.colors['core-button-primary'], borderWidth: 0, height: 48 });
 });
 it.each(['primary', 'secondary'])('disables %s presses and uses disabled theme colors', (variant) => {
  const onPress = vi.fn();
  render(button('Save', { variant, disabled: true, onPress, accessibilityState: { busy: true } }));
  fireEvent.click(screen.getByRole('button'));
  expect(onPress).not.toHaveBeenCalled();
  expect(state.pressable).toMatchObject({ disabled: true, onPress: undefined, accessibilityState: { busy: true, disabled: true } });
  expect(wrapperStyle().backgroundColor).toBe(lightTheme.colors['core-surface-secondary']);
  expect(screen.getByTestId('label').dataset.color).toBe(lightTheme.colors['core-text-disabled']);
 });
 it('uses secondary styling and updates colors when the theme changes', () => {
  const view = render(button('Save', { variant: 'secondary', icon: 'home' }));
  expect(wrapperStyle()).toMatchObject({ backgroundColor: lightTheme.colors['core-surface-primary'], borderWidth: 1, borderColor: lightTheme.colors['core-outline-secondary'] });
  expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-icon-primary']);
  view.rerender(button('Save', { variant: 'secondary', icon: 'home' }, 'dark'));
  expect(wrapperStyle().backgroundColor).toBe(darkTheme.colors['core-surface-primary']);
  expect(screen.getByTestId('label').dataset.color).toBe(darkTheme.colors['core-text-primary']);
  expect(screen.getByTestId('icon').dataset.color).toBe(darkTheme.colors['core-link-primary']);
 });
 it.each(['left', 'right'] as const)('places the icon on the %s with matching padding', (iconPosition) => {
  render(button('Save', { icon: 'home', iconPosition, iconSize: 20 }));
  const children = screen.getByRole('button').children;
  expect(children[iconPosition === 'left' ? 0 : 1]).toBe(screen.getByTestId('icon'));
  expect(screen.getByTestId('icon').dataset).toMatchObject({ name: 'home', size: '20', accessible: 'false' });
  expect(pressableStyle()).toMatchObject({ paddingLeft: iconPosition === 'left' ? 16 : 22, paddingRight: iconPosition === 'right' ? 16 : 22 });
 });
 it('supports an accessible icon-only button and disabled icon colors', () => {
  render(button(undefined, { icon: 'home', disabled: true, accessibilityLabel: 'Go home' }));
  expect(screen.getByRole('button', { name: 'Go home' })).toBeTruthy();
  expect(screen.queryByTestId('label')).toBeNull();
  expect(wrapperStyle()).toMatchObject({ width: 48, height: 48, borderRadius: 24 });
  expect(pressableStyle()).toMatchObject({ paddingLeft: 0, paddingRight: 0 });
  expect(screen.getByTestId('icon').dataset.color).toBe(lightTheme.colors['core-text-disabled']);
 });
 it('renders a zero label with the regular button layout', () => {
  render(button(0));
  expect(screen.getByTestId('label').textContent).toBe('0');
  expect(wrapperStyle().width).toBe('auto');
  expect(pressableStyle().paddingHorizontal).toBe(16);
 });
 it('forwards transitions, animated styles, and native ripple overrides', () => {
  const layout = () => undefined;
  const entering = () => undefined;
  const exiting = () => undefined;
  const animatedStyle = { opacity: 0.4 };
  render(button('Save', { layout, presence: { entering, exiting }, animatedStyle, android_ripple: { color: 'red' } }));
  expect(state.views[0].layout).toBe(layout);
  expect(state.views[1]).toMatchObject({ entering, exiting });
  expect(state.views[2].style.at(-1)).toBe(animatedStyle);
  expect(state.pressable.android_ripple).toEqual({ color: 'red' });
 });
});

// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { FabButton, type FabButtonProps } from './index';

const state = vi.hoisted(() => ({ wrapper: {} as any, button: {} as any }));
vi.mock('react-native', () => ({
 StyleSheet: {
  create: (style: unknown) => style,
  flatten: (style: any) => {
   if (!style) return undefined;
   return Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
  },
 },
 View: (props: any) => { state.wrapper = props; return <div>{props.children}</div>; },
}));
vi.mock('../Button', () => ({ Button: (props: any) => {
 state.button = props;
 return <button aria-label={props.accessibilityLabel} onClick={props.onPress}>{props.label ?? props.children ?? props.icon}</button>;
} }));
afterEach(cleanup);
const wrapperStyle = () => Object.assign({}, ...[state.wrapper.style].flat(Infinity).filter(Boolean));

describe('FabButton', () => {
 it('defaults to a regular 56-point plus button with a shrink-wrapping, unclipped shadow', () => {
  render(<FabButton accessibilityLabel="Add task" />);
  expect(state.button).toMatchObject({ icon: 'plus', size: 56, liquidGlassBackground: false, accessibilityLabel: 'Add task' });
  expect(wrapperStyle()).toMatchObject({ alignSelf: 'flex-start', alignItems: 'flex-start', overflow: 'visible', borderRadius: 1000, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65 });
  expect(wrapperStyle()).not.toHaveProperty('width');
  expect(wrapperStyle()).not.toHaveProperty('height');
 });
 it.each([true, false, { glassStyle: 'clear', glassTintColor: 'blue' }])('prevents Liquid Glass at runtime for untyped callers passing %j', (liquidGlassBackground) => {
  const untypedProps = { liquidGlassBackground } as unknown as FabButtonProps;
  render(<FabButton {...untypedProps} label="Create" />);
  expect(state.button.liquidGlassBackground).toBe(false);
  expectTypeOf<FabButtonProps['liquidGlassBackground']>().toEqualTypeOf<undefined>();
 });
 it('forwards caller button overrides, styles, events, animations, and children', () => {
  const style = { backgroundColor: 'purple', fontSize: 18 };
  const animatedStyle = { opacity: 0.8 };
  const presence = { entering: () => undefined };
  const layout = () => undefined;
  const onPress = vi.fn();
  render(<FabButton icon="home" size={72} style={style} animatedStyle={animatedStyle} presence={presence} layout={layout} onPress={onPress}>Home</FabButton>);
  expect(state.button).toMatchObject({ icon: 'home', size: 72, children: 'Home' });
  for (const [key, value] of Object.entries({ style, animatedStyle, presence, layout, onPress })) expect(state.button[key]).toBe(value);
  fireEvent.click(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledOnce();
  expect(wrapperStyle()).not.toHaveProperty('width');
  expect(wrapperStyle()).not.toHaveProperty('minHeight');
 });
 it('keeps outer shadow styles separate, supports arrays, and preserves the shadow clip boundary', () => {
  const viewStyle = Object.freeze({ elevation: 10, shadowOpacity: 0.4, marginBottom: 16, borderRadius: 1, overflow: 'hidden' as const });
  render(<FabButton style={{ borderRadius: 12 }} viewStyle={[{ shadowRadius: 8 }, false, viewStyle]} />);
  expect(wrapperStyle()).toMatchObject({ elevation: 10, shadowOpacity: 0.4, shadowRadius: 8, marginBottom: 16, borderRadius: 12, overflow: 'visible' });
  expect(state.button).not.toHaveProperty('viewStyle');
  expect(state.button.style).toEqual({ borderRadius: 12 });
 });
 it.each([
  ['pill', 1000], ['rectangular', 4], [12, 12], [0, 0], [-4, 0], [Number.NaN, 0],
 ] as const)('matches explicit radius %s and removes conflicting style corners', (borderRadius, expected) => {
  render(<FabButton borderRadius={borderRadius} style={{ borderRadius: 24, borderTopLeftRadius: 8 }} />);
  expect(wrapperStyle().borderRadius).toBe(expected);
  expect(wrapperStyle()).not.toHaveProperty('borderTopLeftRadius');
  expect(state.button.borderRadius).toBe(borderRadius);
 });
 it('matches asymmetric and percentage corners from flattened regular styles', () => {
  render(<FabButton style={[{ borderRadius: 4 }, null, { borderRadius: '50%', borderTopLeftRadius: 24 }]} />);
  expect(wrapperStyle()).toMatchObject({ borderRadius: '50%', borderTopLeftRadius: 24 });
 });
 it('updates radius and size without fixing the wrapper dimensions or remounting the button', () => {
  const view = render(<FabButton label="Create" size={40} borderRadius={8} />);
  const element = screen.getByRole('button');
  view.rerender(<FabButton label="Create a longer task" size={72} borderRadius={0} />);
  expect(state.button).toMatchObject({ label: 'Create a longer task', size: 72, borderRadius: 0 });
  expect(wrapperStyle().borderRadius).toBe(0);
  expect(screen.getByRole('button')).toBe(element);
  expect(wrapperStyle()).not.toHaveProperty('width');
  expect(wrapperStyle()).not.toHaveProperty('height');
 });
});

it('keeps the default radius when a stylesheet explicitly leaves it undefined', () => {
 render(<FabButton style={{ borderRadius: undefined, borderBottomRightRadius: 8 }} />);
 expect(wrapperStyle()).toMatchObject({ borderRadius: 1000, borderBottomRightRadius: 8 });
});

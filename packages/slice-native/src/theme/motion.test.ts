import { describe, expect, it } from 'vitest';
import { easing } from './motion';

describe('native easing conversion', () => {
 it('rejects unsupported CSS easing syntax', () => {
  expect(() => easing('ease-in-out')).toThrow('Unsupported Slice easing: ease-in-out');
 });
 it('clamps cubic curves before and after the animation', () => {
  const curve = easing('cubic-bezier(0, 0, 1, 1)');
  expect(curve(-0.5)).toBe(0);
  expect(curve(1.5)).toBe(1);
  for (const progress of [0.1, 0.25, 0.75, 0.9]) expect(curve(progress)).toBeCloseTo(progress, 6);
 });
 it('interpolates evenly spaced linear stops and clamps to their endpoint values', () => {
  const curve = easing('linear(0.2, 1.4, 0.6)');
  expect(curve(-1)).toBe(0.2);
  expect(curve(0)).toBe(0.2);
  expect(curve(0.25)).toBeCloseTo(0.8);
  expect(curve(0.5)).toBeCloseTo(1.4);
  expect(curve(0.75)).toBeCloseTo(1);
  expect(curve(1)).toBeCloseTo(0.6);
  expect(curve(2)).toBe(0.6);
 });
 it('uses explicit stop percentages for each interpolation interval', () => {
  const curve = easing('linear(0 0%, 1.2 20%, 1 100%)');
  expect(curve(0.1)).toBeCloseTo(0.6);
  expect(curve(0.2)).toBeCloseTo(1.2);
  expect(curve(0.6)).toBeCloseTo(1.1);
  expect(curve(1.1)).toBe(1);
 });
});

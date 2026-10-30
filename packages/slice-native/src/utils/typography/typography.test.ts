import { describe, expect, it } from 'vitest';
import type { FontWeight } from '../../types/sharedTypes';
import { lineHeightTextStyle, numberFromFontWeight } from './typography';

describe('lineHeightTextStyle', () => {
 it('uses default font size and factor for an empty style', () => {
  expect(lineHeightTextStyle({})).toEqual({ lineHeight: 19.2 });
 });
 it('derives line height without mutating the original style', () => {
  const style = Object.freeze({ fontSize: 20, lineHeight: 10, color: 'red' });
  expect(lineHeightTextStyle(style, 1.5)).toEqual({ fontSize: 20, lineHeight: 30, color: 'red' });
  expect(style.lineHeight).toBe(10);
 });
 it('uses the default factor with a supplied font size', () => {
  expect(lineHeightTextStyle({ fontSize: 10 }).lineHeight).toBe(12);
 });
 it.each([0, 2])('accepts the boundary factor %s', (factor) => {
  expect(lineHeightTextStyle({}, factor).lineHeight).toBe(16 * factor);
 });
 it('preserves an explicit zero font size', () => {
  expect(lineHeightTextStyle({ fontSize: 0 }).lineHeight).toBe(0);
 });
 it.each([-0.1, 2.1, NaN, Infinity, -Infinity])('rejects invalid factor %s', (factor) => {
  expect(() => lineHeightTextStyle({}, factor)).toThrow('lineHeightFactor must be a number between 0 and 2');
 });
});

describe('numberFromFontWeight', () => {
 it.each([['thin', 100], ['extra light', 200], ['light', 300], ['normal', 400], ['medium', 500], ['semi', 600], ['bold', 700], ['extra', 800], ['heavy', 900]] as const)('maps %s to %s', (name, value) => {
  expect(numberFromFontWeight(name)).toBe(value);
 });
 it('defaults to normal and preserves numeric weights', () => {
  expect(numberFromFontWeight()).toBe(400);
  expect(numberFromFontWeight(450)).toBe(450);
 });
 it('falls back to normal for an unrecognized runtime weight', () => {
  // JavaScript consumers can supply values outside the TypeScript union.
  expect(numberFromFontWeight('unknown' as FontWeight)).toBe(400);
 });
});

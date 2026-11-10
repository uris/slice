import { describe, expect, it } from 'vitest';
import { reduceMotionTarget, reduceMotionVariants } from './reduceMotionTargets';

describe('reduced motion targets', () => {
 it('retains labels and disabled animation', () => {
  expect(reduceMotionTarget(undefined)).toBeUndefined(); expect(reduceMotionTarget(false)).toBe(false);
  expect(reduceMotionTarget('open')).toBe('open'); expect(reduceMotionTarget(['open'])).toEqual(['open']);
  expect(reduceMotionVariants(undefined)).toBeUndefined();
 });
 it('preserves target values while removing property timing and repeats', () => {
  const target = { opacity: [0, 1], transition: { opacity: { repeat: Infinity, duration: 10 }, delayChildren: 2 } };
  const reduced = reduceMotionTarget(target);
  expect(reduced.opacity).toEqual([0, 1]); expect(reduced.transition).toEqual({ type: 'tween', duration: 0, delay: 0, repeat: 0 });
  expect(target.transition.delayChildren).toBe(2);
 });
 it('normalizes static and dynamic variants', () => {
  const variants = reduceMotionVariants({ open: { opacity: 1, transition: { duration: 5 } }, custom: value => ({ x: value, transition: { repeat: Infinity } }) })!;
  expect(variants.open).toMatchObject({ opacity: 1, transition: { duration: 0 } });
  const custom = variants.custom; if (typeof custom !== 'function') throw new Error('Expected resolver');
  expect(custom(20, {}, {})).toMatchObject({ x: 20, transition: { repeat: 0, duration: 0 } });
 });
});

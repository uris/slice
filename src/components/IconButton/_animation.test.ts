import { describe, expect, it } from 'vitest';
import { AnimationPreset, AnimationType } from './_types';
import { animationVariants, resolveVariants } from './_animation';

describe('_animation', () => {
	describe('animationVariants', () => {
		it('returns undefined when no animation is provided', () => {
			expect(animationVariants(undefined)).toBeUndefined();
		});

		it('wraps a single (non-array) animation entry into a list', () => {
			const variants = animationVariants({
				animation: { type: AnimationType.Fade, value: { off: 0, on: 1 } },
				transition: { on: { duration: 0.2 } },
			});
			expect(variants?.initial).toEqual({ [AnimationType.Fade]: 0 });
			expect(variants?.animate).toEqual({ [AnimationType.Fade]: 1, transition: { on: { duration: 0.2 } }.on });
		});

		it('falls back exit transition to the on-transition when off is unset', () => {
			const variants = animationVariants({
				animation: [{ type: AnimationType.Rotate, value: { off: 0, on: 180 } }],
				transition: { on: { duration: 0.25 } },
			});
			expect((variants?.exit as { transition?: unknown })?.transition).toEqual({ duration: 0.25 });
		});
	});

	describe('resolveVariants', () => {
		it('returns empty variants when neither presets nor custom animations are provided', () => {
			// resolveVariants always builds an `animations` array (possibly empty)
			// and passes it through, so animationVariants' own `!animations` guard
			// never actually triggers via this path - only a direct call with
			// `undefined` (covered above) can.
			expect(resolveVariants(undefined, undefined)).toEqual({ initial: {}, animate: {}, exit: {} });
		});

		it('resolves a preset animation using its own transition', () => {
			const variants = resolveVariants(AnimationPreset.Rotate, undefined);
			expect(variants?.initial).toEqual({ [AnimationType.Rotate]: 180 });
		});

		it('resolves a custom animation with a single (non-array) entry and no transition', () => {
			const variants = resolveVariants(undefined, {
				animation: { type: AnimationType.Scale, value: { off: 0, on: 1 } },
			});
			expect(variants?.initial).toEqual({ [AnimationType.Scale]: 0 });
			// transition stays undefined since neither preset nor custom set one
			expect((variants?.animate as { transition?: unknown })?.transition).toBeUndefined();
		});

		it('merges a preset with a custom animation, letting the custom transition win', () => {
			const variants = resolveVariants(AnimationPreset.Fade, {
				animation: [{ type: AnimationType.Scale, value: { off: 0, on: 1 } }],
				transition: { on: { duration: 0.5 } },
			});
			expect(variants?.initial).toEqual({
				[AnimationType.Fade]: 0,
				[AnimationType.Scale]: 0,
			});
			expect((variants?.animate as { transition?: unknown })?.transition).toEqual({ duration: 0.5 });
		});
	});
});

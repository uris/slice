import type { Variants } from 'motion/react';
import {
	AnimationPreset,
	AnimationType,
	type AnimationValue,
	type ButtonAnimation,
	type TransitionValue,
} from './_types';

/**
 * Resolves presets to a button animation
 */
export const presetAnimation = {
	[AnimationPreset.Rotate]: {
		animation: { type: AnimationType.Rotate, value: { on: 0, off: 180 } },
		transition: { on: { duration: 0.25, ease: 'linear' } },
	} as ButtonAnimation,
	[AnimationPreset.Fade]: {
		animation: { type: AnimationType.Fade, value: { off: 0, on: 1 } },
		transition: { on: { duration: 0.25, ease: 'easeInOut' } },
	} as ButtonAnimation,
	[AnimationPreset.Scale]: {
		animation: { type: AnimationType.Scale, value: { off: 0, on: 1 } },
		transition: { on: { duration: 0.25, ease: 'linear' } },
	} as ButtonAnimation,
};

/**
 * Resolves button animation to motion variants
 */
export const animationVariants = (animations: ButtonAnimation | undefined) => {
	if (!animations) return undefined;
	const variants: Variants = {
		initial: {},
		animate: {},
		exit: {},
	};
	const { animation, transition } = animations;
	const animationEntries = Array.isArray(animation) ? animation : [animation];
	const { on, off } = transition ?? {};
	for (const entry of animationEntries) {
		const { type, value } = entry;
		variants.initial = { ...variants.initial, [type]: value.off };
		variants.animate = {
			...variants.animate,
			[type]: value.on,
			transition: on,
		};
		variants.exit = {
			...variants.exit,
			[type]: value.off,
			transition: off ?? on,
		};
	}
	return variants as Variants | undefined;
};

/**
 * Resolves presets and custom animations to motion variants
 */
export const resolveVariants = (presets: AnimationPreset | undefined, custom: ButtonAnimation | undefined) => {
	const animations: AnimationValue[] = [];
	let transition: TransitionValue | undefined = undefined;
	if (presets) {
		const presetAnimations = presetAnimation[presets].animation;
		const presetTransition = presetAnimation[presets].transition;
		const animationEntries = Array.isArray(presetAnimations) ? presetAnimations : [presetAnimations];
		animations.push(...animationEntries);
		if (presetTransition) transition = presetTransition;
	}
	if (custom) {
		const customAnimations = custom.animation;
		const customTransition = custom.transition;
		const customAnimationEntries = Array.isArray(customAnimations) ? customAnimations : [customAnimations];
		animations.push(...customAnimationEntries);
		if (customTransition) transition = customTransition;
	}
	return animationVariants({ animation: animations, transition });
};

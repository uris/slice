import type { TargetAndTransition, Variants } from 'motion/react';

/** Override per-target timing too: it takes precedence over the element transition. */
export function reduceMotionTarget<T extends boolean | string | string[] | TargetAndTransition | undefined>(
	target: T,
): T {
	if (!target || typeof target !== 'object' || Array.isArray(target)) return target;
	return { ...target, transition: { type: 'tween', duration: 0, delay: 0, repeat: 0 } };
}

export function reduceMotionVariants(variants: Variants | undefined): Variants | undefined {
	if (!variants) return variants;
	return Object.fromEntries(
		Object.entries(variants).map(([name, target]) => {
			if (typeof target === 'function')
				return [name, (...args: Parameters<typeof target>) => reduceMotionTarget(target(...args))];
			return [name, reduceMotionTarget(target)];
		}),
	);
}

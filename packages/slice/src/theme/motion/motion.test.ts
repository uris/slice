import type { Transition } from 'motion/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import type { ButtonProps } from '../../components/Button';
import type { FlexBoxProps } from '../../components/FlexBox';
import { motion, motionValues } from './motion';

describe('Motion-ready theme defaults', () => {
	it.each(['water', 'magnet'] as const)('provides the %s CSS curve as a seconds-based tween', (name) => {
		const curve = motion[`motion-${name}`].match(/cubic-bezier\(([^)]+)\)/)?.[1].split(',').map(Number);
		const duration = Number.parseFloat(motion[`motion-${name}-duration`]);
		expect(motionValues[`transition-${name}`]).toEqual({ type: 'tween', ease: curve, duration });
		expect(motionValues[`motion-${name}-duration`]).toBe(duration);
	});

	it('provides a physics spring without an ineffective duration', () => {
		expect(motionValues['transition-spring']).toEqual(motionValues['motion-spring']);
		expect(motionValues['transition-spring']).toEqual({ type: 'spring', mass: 1, stiffness: 870, damping: 17.4 });
		expect(motionValues['transition-spring']).not.toHaveProperty('duration');
	});

	it('keeps the physics response close to the CSS Spring curve', () => {
		const stops = motion['motion-spring'].slice(7, -1).split(',').map((stop, index, list) => {
			const [value, position] = stop.trim().split(/\s+/);
			return { value: Number(value), time: position ? Number.parseFloat(position) / 100 : index / (list.length - 1) };
		});
		const { mass, stiffness, damping } = motionValues['transition-spring'];
		const frequency = Math.sqrt(stiffness / mass);
		const ratio = damping / (2 * Math.sqrt(stiffness * mass));
		const dampedFrequency = frequency * Math.sqrt(1 - ratio * ratio);
		for (const { value, time } of stops) {
			const seconds = time * motionValues['motion-spring-duration'];
			const response = 1 - Math.exp(-ratio * frequency * seconds) * (
				Math.cos(dampedFrequency * seconds) + ratio / Math.sqrt(1 - ratio * ratio) * Math.sin(dampedFrequency * seconds)
			);
			expect(Math.abs(response - value)).toBeLessThan(0.01);
		}
	});

	it('composes directly with Motion and Slice transition props without casts', () => {
		for (const preset of ['transition-water', 'transition-magnet', 'transition-spring'] as const) {
			expectTypeOf(motionValues[preset]).toMatchTypeOf<Transition>();
			expectTypeOf(motionValues[preset]).toMatchTypeOf<ButtonProps['transition']>();
			expectTypeOf(motionValues[preset]).toMatchTypeOf<FlexBoxProps['transition']>();
		}
	});
});

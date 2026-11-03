import { expect, it } from 'vitest';
import { motion } from '../../theme/motion/motion';
import { getWaterTransition } from './getWaterTransition';

it('merges partial overrides with theme Water defaults', () => {
	expect(getWaterTransition(motion, { delay: 0.1 })).toEqual({ type: 'tween', ease: [0.36, 0, 0.64, 1], duration: 0.25, delay: 0.1 });
	expect(getWaterTransition({ ...motion, 'motion-water': 'cubic-bezier(0.1, 0.2, 0.3, 0.4)', 'motion-water-duration': '150ms' }, { duration: 0.7 })).toEqual({ type: 'tween', ease: [0.1, 0.2, 0.3, 0.4], duration: 0.7 });
	expect(getWaterTransition({ ...motion, 'motion-water-duration': '150ms' }).duration).toBe(0.15);
});
it('falls back safely for malformed timing tokens', () => {
	expect(getWaterTransition({ ...motion, 'motion-water': 'invalid', 'motion-water-duration': 'invalid' })).toEqual(getWaterTransition(motion));
});

import type React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { FlexDiv, Label, Slider } from 'src';
import { accessibleKeyDown, setStyle } from '../../../src/utils/functions/misc';
import css from './MotionSimulation.module.css';
interface MotionSimulationProps {
	duration?: number;
	easing?: 'magnet' | 'water' | 'spring';
	objectSize?: number;
	padding?: number;
	width?: number | string;
	placeholder?: string;
}

export function MotionSimulation(props: Readonly<MotionSimulationProps>) {
	const { duration = 0.25, easing = 'magnet', objectSize = 50, padding = 8, width = '100%', placeholder } = props;

	const [animate, setAnimate] = useState<boolean>(false);
	const [time, setTime] = useState<number>(duration);
	useEffect(() => {
		setTime(duration);
	}, [duration]);

	const transition = useMemo(() => {
		if (easing === 'magnet') return 'var(--motion-magnet)';
		if (easing === 'water') return 'var(--motion-water)';
		if (easing === 'spring') return 'var(--motion-spring)';
		return 'var(--motion-water)';
	}, [easing]);

	const cssVars = useMemo(() => {
		return {
			'--object-size': setStyle(objectSize),
			'--wrapper-size': setStyle(objectSize),
			'--transition': transition,
			'--duration': `${time}s`,
			'--wrapper-width': setStyle(width),
			'--wrapper-padding': setStyle(padding),
			'--left': animate ? `calc(100% - ${padding}px - ${objectSize}px)` : setStyle(padding),
			'--translateX': animate ? 'translateX(-100%)' : 'translateX(0)',
		} as React.CSSProperties;
	}, [objectSize, transition, padding, animate, time, width]);

	return (
		<FlexDiv width={'fill'} height={'fit'} align={'start'} justify={'start'}>
			<div
				className={css.wrapper}
				style={cssVars}
				role="button"
				aria-label="Motion Object Button"
				onClick={() => setAnimate(!animate)}
				tabIndex={0}
				onKeyDown={(e) => accessibleKeyDown(e, () => setAnimate(!animate))}
			>
				<div className={css.object} />
				<span className={css.instructions}>{placeholder ?? 'click to run animation'}</span>
			</div>
			<div className={css.controls}>
				<Label borderSize={0}>Drag to adjust duration:</Label>
				<Slider
					scaleMin={0}
					scaleMax={5}
					value={time}
					onChange={(value, _) => setTime(value)}
					width={'100%'}
					trackHeadSize={16}
				/>
				<Label>{time.toFixed(2)}s</Label>
			</div>
		</FlexDiv>
	);
}

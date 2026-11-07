'use client';
import { Slider } from '@apple-pie/slice';

export function SliderHoverExample() {
	return <Slider width={300} aria-label="Volume" trackHeadOnHover trackHeadSize={16} />;
}

export function SliderDisabledExample() {
	return <Slider width={300} aria-label="Volume" disabled defaultValue={50} />;
}

export function SliderUsageExample() {
	return <Slider width={300} aria-label="Volume" />;
}

export function SliderStepExample() {
	return <Slider width={300} aria-label="Zoom" min={0} max={200} step={10} />;
}

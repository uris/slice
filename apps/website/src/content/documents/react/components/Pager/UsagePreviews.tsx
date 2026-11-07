'use client';
import { Pager } from '@apple-pie/slice';

export function PagerScalingExample() {
	return <Pager pages={7} defaultSelectedIndex={3} size={12} scale={1.5} scaleFactor={0.7} minScale={0.4} />;
}

export function PagerWindowExample() {
	return <Pager pages={20} maxVisiblePages={5} showMoreOn={4} />;
}

export function PagerOpacityExample() {
	return <Pager pages={7} defaultSelectedIndex={3} opacityScales />;
}

export function PagerUsageExample() {
	return <Pager pages={5} />;
}

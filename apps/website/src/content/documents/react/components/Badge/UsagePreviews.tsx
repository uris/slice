'use client';
import { Badge } from '@apple-pie/slice';

export function BadgeZeroExample() {
	return <Badge count={0} hideZero={false} />;
}

export function BadgeColorsExample() {
	return <Badge count={12} backgroundColor="array-sky-label" textColor="#111111" />;
}

export function BadgeLabelExample() {
	return <Badge count="New" variant="light" />;
}

export function BadgeUsageExample() {
	return <Badge count={12} />;
}

export function BadgeOverflowExample() {
	return <Badge count={240} aria-label="240 unread messages" />;
}

export const usageCode = `
import { Badge } from '@apple-pie/slice';

export function BadgeUsageExample() {
	return <Badge count={12} />;
}
`;

export const zeroCode = `
import { Badge } from '@apple-pie/slice';

export function BadgeZeroExample() {
	return <Badge count={0} hideZero={false} />;
}
`;

export const labelCode = `
import { Badge } from '@apple-pie/slice';

export function BadgeLabelExample() {
	return <Badge count="New" variant="light" />;
}
`;

export const accessibilityCode = `
<Badge
    count={unreadCount}
    hideZero={false}
    aria-label={unreadCount + ' unread messages'}
/>
`;

export const colorsCode = `
import { Badge } from '@apple-pie/slice';

export function BadgeColorsExample() {
	return <Badge count={12} backgroundColor="array-cyan-accent" textColor="#111111" />;
}
`;

export const overflowCode = `
<Badge count={240} aria-label="240 unread messages" />
`;

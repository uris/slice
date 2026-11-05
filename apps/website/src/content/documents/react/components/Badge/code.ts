export const usageCode = `
import { Badge } from '@apple-pie/slice';

<Badge count={12} />
`;

export const zeroCode = `
<Badge count={0} hideZero={false} />
`;

export const labelCode = `
<Badge count="New" variant="light" />
`;

export const accessibilityCode = `
<Badge
    count={unreadCount}
    hideZero={false}
    aria-label={unreadCount + ' unread messages'}
/>
`;

export const colorsCode = `
<Badge count={12} backgroundColor="array-sky-label" textColor="#111111" />
`;

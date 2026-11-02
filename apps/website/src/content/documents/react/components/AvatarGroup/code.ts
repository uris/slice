export const usageCode = `
import { AvatarGroup } from '@apple-pie/slice';

const participants = [
    { id: 'john', first: 'John', last: 'Wick', image: '/images/jw-profile.png' },
    { id: 'jane', first: 'Jane', last: 'Smith' },
    { id: 'morgan', email: 'morgan@example.com' },
];

<AvatarGroup avatars={participants} />
`;

export const spacingCode = `
<AvatarGroup avatars={participants} size={40} overlap={0} gap={8} />
`;

export const colorsCode = `
<AvatarGroup
    avatars={[
        { id: 'jane', first: 'Jane', last: 'Smith', backgroundColor: 'array-sky-label' },
        { id: 'morgan', first: 'Morgan', last: 'Chen', textColor: '#ffffff', backgroundColor: '#2563eb' },
    ]}
    borderWidth={1}
    borderColor="transparent"
    outerBorderColor="core-surface-primary"
/>
`;

export const tooltipCode = `
<AvatarGroup avatars={participants} onToolTip={handleTooltip} />
`;

export const accessibilityCode = `
<AvatarGroup
    avatars={participants}
    role="group"
    aria-label="Project collaborators"
/>
`;

export const recordCode = `
import type { ColorValue } from '@apple-pie/slice';

type AvatarInfo = {
    backgroundColor?: ColorValue;
    email?: string;
    first?: string;
    id?: string | number;
    image?: string;
    last?: string;
    textColor?: ColorValue;
};
`;

export const lazyLoadCode = `
<AvatarGroup avatars={participants} lazyLoad />
`;

export const typographyCode = `
<AvatarGroup avatars={participants} size={48} textSize="l" />
`;

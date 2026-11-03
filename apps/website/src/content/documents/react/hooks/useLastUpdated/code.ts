export const usageCode = `
'use client';

import { useLastUpdated } from '@apple-pie/slice';

function UpdatedAt({ timestamp }: { timestamp?: string }) {
    const { lastUpdated } = useLastUpdated(timestamp);

    return <span>{lastUpdated || 'No updates yet'}</span>;
}
`;

export const optionsCode = `
function UpdatedAt({ timestamp }: { timestamp?: string }) {
    const { lastUpdated } = useLastUpdated(timestamp, 'Updated ', 2);

    return <span>{lastUpdated || 'No updates yet'}</span>;
}
`;

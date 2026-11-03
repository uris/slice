export const usageCode = `
'use client';

import { useActiveTab } from '@apple-pie/slice';

function TabStatus() {
    const { isActiveTab } = useActiveTab();

    return <span>{isActiveTab ? 'Page visible' : 'Page hidden'}</span>;
}
`;

export const focusCode = `
function FocusStatus() {
    const { isActiveTab, isTabFocused } = useActiveTab();
    const isReady = isActiveTab && isTabFocused;

    return <span>{isReady ? 'Visible and focused' : 'Away'}</span>;
}
`;

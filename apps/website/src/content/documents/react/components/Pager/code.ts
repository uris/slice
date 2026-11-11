export const usageCode = `
import { Pager } from '@apple-pie/slice';

export function PagerUsageExample() {
	return <Pager pages={5} />;
}
`;

export const controlledCode = `
import { useState } from 'react';

const [page, setPage] = useState(0);

<Pager pages={8} selectedIndex={page} onChange={setPage} />
`;

export const scalingCode = `
import { Pager } from '@apple-pie/slice';

export function PagerScalingExample() {
	return <Pager pages={7} defaultSelectedIndex={3} size={12} scale={1.5} scaleFactor={0.7} minScale={0.4} />;
}
`;

export const windowCode = `
import { Pager } from '@apple-pie/slice';

export function PagerWindowExample() {
	return <Pager pages={20} maxVisiblePages={5} showMoreOn={4} />;
}
`;

export const transitionCode = `
<Pager pages={20} maxVisiblePages={5} transition={{ duration: 0.4 }} />
`;

export const opacityCode = `
import { Pager } from '@apple-pie/slice';

export function PagerOpacityExample() {
	return <Pager pages={7} defaultSelectedIndex={3} opacityScales />;
}
`;

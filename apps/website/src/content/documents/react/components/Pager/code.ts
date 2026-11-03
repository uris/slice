export const usageCode = `
import { Pager } from '@apple-pie/slice';

<Pager pages={5} />
`;

export const controlledCode = `
import { useState } from 'react';

const [page, setPage] = useState(0);

<Pager pages={8} selectedIndex={page} onChange={setPage} />
`;

export const scalingCode = `
<Pager
    pages={7}
    defaultSelectedIndex={3}
    size={12}
    scale={1.5}
    scaleFactor={0.7}
    minScale={0.4}
/>
`;

export const windowCode = `
<Pager pages={20} maxVisiblePages={5} showMoreOn={4} />
`;

export const transitionCode = `
<Pager pages={20} maxVisiblePages={5} transition={{ duration: 0.4 }} />
`;

export const opacityCode = `
<Pager pages={7} defaultSelectedIndex={3} opacityScales />
`;

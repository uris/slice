export const usageCode = `
import { IconButton } from '@apple-pie/slice';

<IconButton icon="more" actionName="More options" onClick={myHandler} />
`;
export const exampleCode = `
<IconButton icon="sun" actionName="Highlight" toggle selected={selected} onChange={setSelected} />
`;
export const motionCode = `
<IconButton
  icon="sun"
  actionName="Highlight"
  toggle
  motionValues={{ unselected: { rotate: 0 }, selected: { rotate: 135 } }}
  transition={{ duration: 0.2 }}
/>
`;

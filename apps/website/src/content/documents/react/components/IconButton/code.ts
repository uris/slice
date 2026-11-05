export const usageCode = `
import { IconButton } from '@apple-pie/slice';

<IconButton icon="basic.more-horiz" actionName="More options" onClick={myHandler} />
`;
export const exampleCode = `
<IconButton icon="weather.sun" actionName="Highlight" toggle selected={selected} onChange={setSelected} />
`;
export const motionCode = `
<IconButton
  icon="weather.sun"
  actionName="Highlight"
  toggle
  motionValues={{ unselected: { rotate: 0 }, selected: { rotate: 135 } }}
  transition={{ duration: 0.2 }}
/>
`;

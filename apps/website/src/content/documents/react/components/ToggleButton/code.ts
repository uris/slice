export const usageCode = `
import { ToggleButton } from '@apple-pie/slice';

<ToggleButton icon="weather.sun" label="Highlight" />
`;
export const exampleCode = `
<ToggleButton icon="weather.sun" label="Highlight" selected={selected} onChange={setSelected} />
`;
export const motionCode = `
<ToggleButton
  icon="weather.sun"
  label="Highlight"
  motionValues={{ unselected: { rotate: 0 }, selected: { rotate: 135 } }}
  transition={{ duration: 0.2 }}
/>
`;

export const outsideCode = `
<ToggleButton icon="weather.sun" label="Highlight" labelOutside />
`;

export const usageCode = `
import { Chip } from '@apple-pie/slice';

<Chip label="Design" icon="home" />
`;

export const actionCode = `
<Chip label="Open tag" onClick={myHandler} />
`;

export const selectionCode = `
<Chip
    label={selected ? 'Following updates' : 'Follow'}
    selected={selected}
    onClick={() => setSelected((value) => !value)}
/>
`;

export const removeCode = `
<Chip label="Design" onRemove={myRemoveHandler} />
`;

export const stylingCode = `
<Chip
    label="New"
    textSize="s"
    textColor="core-text-primary"
    backgroundColor="core-surface-secondary"
    borderWidth={1}
    borderRadius={16}
    padding={8}
    paddingRight={12}
/>
`;

export const tooltipCode = `
<Chip label="Open tag" tooltip="View items with this tag" onToolTip={handleTooltip} />
`;

export const usageCode = `
import { ButtonBar } from '@apple-pie/slice';

<ButtonBar
    buttons={[
        { icon: 'arrow left', action: 'previous', tip: 'Previous' },
        { icon: 'arrow right', action: 'next', tip: 'Next' },
    ]}
    onClick={runAction}
/>
`;

export const example2Code = `
<ButtonBar buttons={buttons} buttonSize={40} borderWidth={1} borderRadius={12} />
`;

export const controlledCode = `
<ButtonBar
    buttons={buttons}
    toggle
    selectedIndex={selectedIndex}
    onChange={(button) => setSelectedIndex(buttons.indexOf(button))}
/>
`;

export const overlapCode = `
<ButtonBar buttons={buttons} selectionRadius={12} buttonGap={-4} padding={8} />
`;

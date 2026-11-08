export const usageCode = `
import { Button, FlexDiv, PopMenu, PopMenuGroup, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export default function GroupedActions() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const close = () => setCaller(undefined);
    const menu = caller && (
        <PopMenu caller={caller} name="Grouped actions" minWidth={200} dismissAll={close} onDismiss={close}>
            <PopMenuGroup title="Project">
                <PopMenuItem label="Edit" />
                <PopMenuItem label="Duplicate" />
            </PopMenuGroup>
            <PopMenuGroup>
                <PopMenuItem label="Share ..." />
                <PopMenuItem label="Archive ..." />
            </PopMenuGroup>
        </PopMenu>
    );
    return (
        <FlexDiv justify="center" align="center" height={180}>
            <Button label="Open grouped menu" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexDiv>
    );
}
`;

export const optionsCode = `
<PopMenuGroup title="Project" items={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;

// Or describe the groups directly on the menu:
<PopMenu caller={caller} name="Project actions" dismissAll={close} onDismiss={close}
    options={[
        { title: 'Project', items: [{ label: 'Edit' }, { label: 'Duplicate' }] },
        { items: [{ label: 'Share ...' }, { label: 'Archive ...' }] },
    ]}
/>;
`;

export const styleCode = `
<PopMenuGroup title="Project" textSize="m" textColor="core-text-primary"
    borderWidth={0} gap={4} padding="var(--spacing-s)"
    items={[{ label: 'Edit' }, { label: 'Duplicate' }]} />
`;

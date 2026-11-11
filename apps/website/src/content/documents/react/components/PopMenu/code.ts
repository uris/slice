export const usageCode = `
import { Button, FlexBox, PopMenu, PopMenuGroup, PopMenuItem, type PopMenuSubMenuProps } from '@apple-pie/slice';
import { useState } from 'react';

const colorOptions = [
    { id: 'red', label: 'Red', color: 'var(--core-red-500)' },
    { id: 'blue', label: 'Blue', color: 'var(--core-blue-500)' },
    { id: 'green', label: 'Green', color: 'var(--core-green-500)' },
];

function ColorsMenu(props: PopMenuSubMenuProps) {
    return (
        <PopMenu {...props} name="Colors">
            {colorOptions.map((option) => (
                <PopMenuItem key={option.id} id={option.id} label={option.label}>
                    <FlexBox direction="row" align="center" gap={8}
                        style={{ whiteSpace: 'nowrap' }}>
                        <span aria-hidden="true" style={{
                            display: 'inline-block', width: 12, height: 12, borderRadius: '50%',
                            backgroundColor: option.color, flexShrink: 0,
                        }} />
                        {option.label}
                    </FlexBox>
                </PopMenuItem>
            ))}
        </PopMenu>
    );
}

export default function ProjectActions() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const [autoSave, setAutoSave] = useState(false);
    const close = () => setCaller(undefined);

    return (
        <FlexBox>
            <Button label="Open menu" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {caller && (
                <PopMenu caller={caller} minWidth={200} name="Project actions"
                    dismissAll={close} onDismiss={close}
                    onClickItem={(_event, item) => {
                        if (item.id === 'autoSave') setAutoSave(item.toggled ?? false);
                    }}>
                    <PopMenuGroup title="Project">
                        <PopMenuItem label="Edit" icon="editor.edit" shortcut={{ name: 'Edit', key: 'e', metaPressed: true }} />
                        <PopMenuItem label="Colors" icon="basic.swatchbook" subMenu={(props) => <ColorsMenu {...props} />} />
                    </PopMenuGroup>
                    <PopMenuGroup title="Preferences">
                        <PopMenuItem id="autoSave" label="Auto Save" toggle toggled={autoSave} />
                    </PopMenuGroup>
                    <PopMenuGroup>
                        <PopMenuItem label="Share ..." />
                        <PopMenuItem label="Archive ..." />
                    </PopMenuGroup>
                </PopMenu>
            )}
        </FlexBox>
    );
}
`;

export const optionsCode = `
<PopMenu caller={caller} dismissAll={close} onDismiss={close}
    options={[
        { title: 'Project', items: [{ label: 'Edit' }, { label: 'Duplicate' }] },
        { label: 'Archive' },
    ]}
/>
`;

export const portalCode = `
// menuHost is an application-owned HTMLElement in the desired overlay layer.
<PopMenu caller={caller} portalContainer={menuHost}
    options={options} dismissAll={close} onDismiss={close} />;

// Opt out of portaling for this menu and its submenus.
<PopMenu caller={caller} portalContainer={false}
    options={options} dismissAll={close} onDismiss={close} />;
`;

export const motionCode = `
<PopMenu
    caller={caller}
    name="Actions"
    dismissAll={close}
    onDismiss={close}
    transition={{ duration: 0.2 }}
    motionValues={{
        initial: { y: 8, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 8, opacity: 0 },
    }}
>
    <PopMenuItem label="Edit" />
</PopMenu>
`;

export const actionsCode = `
import { PopMenu, type PropMenuEntry } from '@apple-pie/slice';

type DocumentAction = { documentId: string };
const options: PropMenuEntry<DocumentAction>[] = [
  {
    id: 'open', label: 'Open document', data: { documentId: 'doc-42' },
    onClick: (_event, item) => {
      if (item.data) window.location.assign('/documents/' + item.data.documentId);
    },
  },
];

export function DocumentMenu({ caller, close }: { caller: HTMLElement; close: () => void }) {
  return <PopMenu caller={caller} options={options} onDismiss={close}
    onClickItem={(_event, item) => console.log('Selected', item.id, item.data)} />;
}
`;

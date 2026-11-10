export const usageCode = `
import { Button, FlexBox, PopMenu, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export default function MenuItems() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const close = () => setCaller(undefined);
    const menu = caller && (
        <PopMenu caller={caller} name="Item actions" minWidth={200} dismissAll={close} onDismiss={close}>
            <PopMenuItem label="Edit" />
            <PopMenuItem label="Auto Save" />
            <PopMenuItem label="Colors" />
        </PopMenu>
    );
    return (
        <FlexBox justify="center" align="center" height={180}>
            <Button label="Open labels" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexBox>
    );
}
`;

export const iconsCode = `
import { Button, FlexBox, PopMenu, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export default function MenuItems() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const close = () => setCaller(undefined);
    const menu = caller && (
        <PopMenu caller={caller} name="Item actions" minWidth={200} dismissAll={close} onDismiss={close}>
            <PopMenuItem label="Edit" icon="editor.edit" />
            <PopMenuItem label="Auto Save" icon="electronics.diskette" />
            <PopMenuItem label="Colors" icon="basic.swatchbook" />
        </PopMenu>
    );
    return (
        <FlexBox justify="center" align="center" height={180}>
            <Button label="Open icons" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexBox>
    );
}
`;

export const toggleCode = `
import { Button, FlexBox, PopMenu, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export default function MenuItems() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const [autoSave, setAutoSave] = useState(false);
    const close = () => setCaller(undefined);
    const menu = caller && (
        <PopMenu caller={caller} name="Item actions" minWidth={200} dismissAll={close} onDismiss={close}>
            <PopMenuItem label="Edit" icon="editor.edit" />
            <PopMenuItem label="Auto Save" icon="electronics.diskette" toggle toggled={autoSave}
                onClick={(_event, item) => setAutoSave(item.toggled ?? false)} />
            <PopMenuItem label="Colors" icon="basic.swatchbook" />
        </PopMenu>
    );
    return (
        <FlexBox justify="center" align="center" height={180}>
            <Button label="Open toggles" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexBox>
    );
}
`;

export const submenuCode = `
import { Button, FlexBox, PopMenu, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export default function MenuItems() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const [autoSave, setAutoSave] = useState(false);
    const close = () => setCaller(undefined);
    const menu = caller && (
        <PopMenu caller={caller} name="Item actions" minWidth={200} dismissAll={close} onDismiss={close}>
            <PopMenuItem label="Edit" icon="editor.edit" />
            <PopMenuItem label="Auto Save" icon="electronics.diskette" toggle toggled={autoSave}
                onClick={(_event, item) => setAutoSave(item.toggled ?? false)} />
            <PopMenuItem label="Colors" icon="basic.swatchbook"
                subMenu={(props) => (
                    <PopMenu {...props} name="Colors">
                        <PopMenuItem label="Red" />
                        <PopMenuItem label="Blue" />
                        <PopMenuItem
                            label="Green"
                            subMenu={(props) => (
                                <PopMenu {...props} name="Green Colors">
                                    <PopMenuItem label="Light Green"/>
                                    <PopMenuItem label="Dark Green"/>
                                </PopMenu>
                            )}
                        />
                    </PopMenu>
                )}
            />
        </PopMenu>
    );
    return (
        <FlexBox justify="center" align="center" height={180}>
            <Button label="Open submenus" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexBox>
    );
}
`;

export const customCode = `
import { Button, FlexBox, PopMenu, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

const colorOptions = [
	{ id: 'red', label: 'Red', color: 'var(--core-red-500)' },
	{ id: 'blue', label: 'Blue', color: 'var(--core-blue-500)' },
	{ id: 'green', label: 'Green', color: 'var(--core-green-500)' },
];

export default function ColorItems() {
    const [caller, setCaller] = useState<HTMLButtonElement>();
    const close = () => setCaller(undefined);
    const menu = caller && (
        <PopMenu caller={caller} name="Colors" minWidth={200} dismissAll={close} onDismiss={close}>
			{colorOptions.map((option) => (
				<PopMenuItem key={option.id} id={option.id} label={option.label}>
					<FlexBox direction="row" align="center" gap={8} style={{ whiteSpace: 'nowrap' }}>
						<span
							aria-hidden="true"
							style={{
								display: 'inline-block',
								width: 12,
								height: 12,
								borderRadius: '50%',
								backgroundColor: option.color,
								flexShrink: 0,
							}}
						/>
						{option.label}
					</FlexBox>
				</PopMenuItem>
			))}
        </PopMenu>
    );
    return (
        <FlexBox justify="center" align="center" height={180}>
            <Button label="Open colors" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexBox>
    );
}
`;

export const disabledCode = `
<PopMenuItem label="Archive" icon="basic.archive" disabled
    textColorDisabled="var(--core-text-tertiary)"
    iconColorDisabled="var(--core-text-tertiary)" />
`;

export const shortcutCode = `
import { PopMenuItem, type KeyboardShortcut } from '@apple-pie/slice';

const quickOpen: KeyboardShortcut = {
    name: 'Quick open', key: 'k', metaPressed: true, shiftPressed: true,
};

// Render this item inside PopMenu, directly or through a group.
export function QuickOpenItem() {
    return <PopMenuItem label={quickOpen.name} shortcut={quickOpen} />;
}
`;

export const actionCode = `
import { PopMenu, PopMenuGroup, PopMenuItem } from '@apple-pie/slice';

type DocumentAction = { documentId: string };

export function DocumentMenu({ caller, close }: { caller: HTMLElement; close: () => void }) {
return <PopMenu<DocumentAction> caller={caller} onDismiss={close}
  onClickItem={(_event, item) => console.log('Menu', item.data?.documentId)}>
  <PopMenuGroup<DocumentAction> title="Documents"
    onClickItem={(_event, item) => console.log('Group', item.data?.documentId)}>
    <PopMenuItem data={{ documentId: 'doc-42' }} label="Open document"
      onClick={(_event, item) => {
        if (item.data) window.location.assign('/documents/' + item.data.documentId);
      }} />
  </PopMenuGroup>
</PopMenu>;
}
`;

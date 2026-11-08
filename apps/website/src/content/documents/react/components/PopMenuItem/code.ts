export const usageCode = `
import { Button, FlexDiv, PopMenu, PopMenuItem } from '@apple-pie/slice';
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
        <FlexDiv justify="center" align="center" height={180}>
            <Button label="Open labels" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexDiv>
    );
}
`;

export const iconsCode = `
import { Button, FlexDiv, PopMenu, PopMenuItem } from '@apple-pie/slice';
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
        <FlexDiv justify="center" align="center" height={180}>
            <Button label="Open icons" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexDiv>
    );
}
`;

export const toggleCode = `
import { Button, FlexDiv, PopMenu, PopMenuItem } from '@apple-pie/slice';
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
        <FlexDiv justify="center" align="center" height={180}>
            <Button label="Open toggles" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexDiv>
    );
}
`;

export const submenuCode = `
import { Button, FlexDiv, PopMenu, PopMenuItem } from '@apple-pie/slice';
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
        <FlexDiv justify="center" align="center" height={180}>
            <Button label="Open submenus" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexDiv>
    );
}
`;

export const customCode = `
import { Button, FlexDiv, PopMenu, PopMenuItem } from '@apple-pie/slice';
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
					<FlexDiv direction="row" align="center" gap={8} style={{ whiteSpace: 'nowrap' }}>
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
					</FlexDiv>
				</PopMenuItem>
			))}
        </PopMenu>
    );
    return (
        <FlexDiv justify="center" align="center" height={180}>
            <Button label="Open colors" onClick={(event) => {
                if (event) setCaller(event.currentTarget);
            }} />
            {menu}
        </FlexDiv>
    );
}
`;

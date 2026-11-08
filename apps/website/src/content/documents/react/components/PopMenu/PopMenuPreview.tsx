'use client';

import { Button, FlexDiv, PopMenu, PopMenuGroup, PopMenuItem, type PopMenuSubMenuProps } from '@apple-pie/slice';
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
}

export function PopMenuPreview() {
	const [caller, setCaller] = useState<HTMLButtonElement>();
	const [autoSave, setAutoSave] = useState(false);
	const close = () => setCaller(undefined);

	return (
		<FlexDiv justify="center" align="center" height={180}>
			<Button
				label="Open menu"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{caller && (
				<PopMenu
					caller={caller}
					minWidth={200}
					name="Project actions"
					dismissAll={close}
					onDismiss={close}
					onClickItem={(_event, item) => {
						if (item.id === 'autoSave') setAutoSave(item.toggled ?? false);
					}}
				>
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
		</FlexDiv>
	);
}

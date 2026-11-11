'use client';

import { Button, FlexBox, PopMenu, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export function LabelsPreview() {
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
			<Button
				label="Label items"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{menu}
		</FlexBox>
	);
}

export function IconsPreview() {
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
			<Button
				label="Icon items"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{menu}
		</FlexBox>
	);
}

export function TogglesPreview() {
	const [caller, setCaller] = useState<HTMLButtonElement>();
	const [autoSave, setAutoSave] = useState(false);
	const close = () => setCaller(undefined);
	const menu = caller && (
		<PopMenu caller={caller} name="Item actions" minWidth={200} dismissAll={close} onDismiss={close}>
			<PopMenuItem label="Edit" icon="editor.edit" />
			<PopMenuItem
				label="Auto Save"
				icon="electronics.diskette"
				toggle
				toggled={autoSave}
				onClick={(_event, item) => setAutoSave(item.toggled ?? false)}
			/>
			<PopMenuItem label="Colors" icon="basic.swatchbook" />
		</PopMenu>
	);
	return (
		<FlexBox justify="center" align="center" height={180}>
			<Button
				label="Toggle auto save"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{menu}
		</FlexBox>
	);
}

export function SubmenusPreview() {
	const [caller, setCaller] = useState<HTMLButtonElement>();
	const [autoSave, setAutoSave] = useState(false);
	const close = () => setCaller(undefined);
	const menu = caller && (
		<PopMenu caller={caller} name="Item actions" minWidth={200} dismissAll={close} onDismiss={close}>
			<PopMenuItem label="Edit" icon="editor.edit" />
			<PopMenuItem
				label="Auto Save"
				icon="electronics.diskette"
				toggle
				toggled={autoSave}
				onClick={(_event, item) => setAutoSave(item.toggled ?? false)}
			/>
			<PopMenuItem
				label="Colors"
				icon="basic.swatchbook"
				subMenu={(props) => (
					<PopMenu {...props} name="Colors">
						<PopMenuItem label="Red" />
						<PopMenuItem label="Blue" />
						<PopMenuItem
							label="Green"
							subMenu={(props) => (
								<PopMenu {...props} name="Green Colors">
									<PopMenuItem label="Light Green" />
									<PopMenuItem label="Dark Green" />
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
			<Button
				label="Nesting sub menus"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{menu}
		</FlexBox>
	);
}

const colorOptions = [
	{ id: 'red', label: 'Red', color: 'var(--core-red-500)' },
	{ id: 'blue', label: 'Blue', color: 'var(--core-blue-500)' },
	{ id: 'green', label: 'Green', color: 'var(--core-green-500)' },
];

export function CustomContentPreview() {
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
			<Button
				label="Custom colors items"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{menu}
		</FlexBox>
	);
}

export function DisabledPreview() {
	const [caller, setCaller] = useState<HTMLButtonElement>();
	const close = () => setCaller(undefined);
	return (
		<FlexBox justify="center" align="center" height={180}>
			<Button
				label="Disabled action"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{caller && (
				<PopMenu caller={caller} name="Archive actions" minWidth={200} dismissAll={close} onDismiss={close}>
					<PopMenuItem label="Edit" icon="editor.edit" />
					<PopMenuItem
						label="Archive"
						icon="basic.archive"
						disabled
						textColorDisabled="var(--core-text-tertiary)"
						iconColorDisabled="var(--core-text-tertiary)"
					/>
				</PopMenu>
			)}
		</FlexBox>
	);
}

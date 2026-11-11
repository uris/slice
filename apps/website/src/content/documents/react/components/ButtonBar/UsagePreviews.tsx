'use client';
import { Button, ButtonBar, FileIcon, FlexBox, PopMenu, PopMenuItem, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function ButtonBarUsageExample() {
	return (
		<FlexBox preset={Preset.FillCenterMiddle} gap={16}>
			<ButtonBar aria-label="Document actions">
				<Button label="Edit" iconLeft="editor.edit" />
				<Button label="Options" iconRight="arrows.chevron-down" />
				<Button iconLeft="basic.more-horiz-fill" aria-label="More actions" />
			</ButtonBar>
		</FlexBox>
	);
}

export function GroupedButtonBarUsageExample() {
	return (
		<FlexBox preset={Preset.FillCenterMiddle} gap={16}>
			<FlexBox preset={Preset.ButtonBar}>
				<ButtonBar aria-label="Document actions">
					<Button label="Edit" iconLeft="editor.edit" />
					<Button label="Options" iconRight="arrows.chevron-down" />
					<Button iconLeft="basic.more-horiz-fill" aria-label="More actions" />
				</ButtonBar>
				<ButtonBar aria-label="Document actions">
					<Button iconRight="basic.plus" aria-label="Increase" />
					<Button iconLeft="basic.minus" aria-label="Decrease" />
				</ButtonBar>
				<ButtonBar aria-label="Document actions">
					<Button label={'search'} iconLeft="basic.search" />
				</ButtonBar>
			</FlexBox>
		</FlexBox>
	);
}

export function InputFieldExample() {
	const [quantity, setQuantity] = useState('100');
	const [recentDocument, setRecentDocument] = useState('');
	const [menuCaller, setMenuCaller] = useState<HTMLElement>();
	const adjust = (amount: number) => setQuantity(String((Number(quantity) || 0) + amount));
	return (
		<FlexBox preset={Preset.ButtonBar}>
			<ButtonBar aria-label="Adjust zoom" onChange={setQuantity}>
				<Button iconLeft="basic.plus" aria-label="Increase" onClick={() => adjust(1)} />
				<TextField inputName="Zoom" width={'7ch'} value={quantity} textAlign="center" />
				<Button iconLeft="basic.minus" aria-label="Decrease" onClick={() => adjust(-1)} />
			</ButtonBar>
			<ButtonBar
				aria-label="Recent documents"
				onClick={(event) => {
					if (!event) return;
					const group = event.currentTarget.closest<HTMLElement>('[role="group"]');
					if (group) setMenuCaller(menuCaller ? undefined : group);
				}}
			>
				<TextField
					inputName="Recent"
					width="fill"
					placeholder="Recent ..."
					value={recentDocument}
					onChange={setRecentDocument}
				/>
				<Button
					iconLeft="basic.more-horiz-fill"
					aria-label="Show recent documents"
					aria-haspopup="menu"
					aria-expanded={Boolean(menuCaller)}
				/>
			</ButtonBar>
			{menuCaller && (
				<PopMenu
					caller={menuCaller}
					offset="bottom"
					gap={8}
					minWidth={240}
					style={{ width: 280 }}
					onClickItem={(_, item) => setRecentDocument(item.label ?? '')}
					onDismiss={() => setMenuCaller(undefined)}
				>
					{[
						{ id: 'design-brief', label: 'Website redesign brief.pdf' },
						{ id: 'product-roadmap', label: 'Product roadmap.xlsx' },
						{ id: 'meeting-notes', label: 'Monday meeting notes.docx' },
						{ id: 'research', label: 'Customer research summary.pdf' },
						{ id: 'launch', label: 'Launch presentation.pptx' },
					].map((document) => (
						<PopMenuItem key={document.id} id={document.id} label={document.label}>
							<span
								style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-s)', minWidth: 0, width: '100%' }}
							>
								<FileIcon filename={document.label} size={20} decorative style={{ flexShrink: 0 }} />
								<span
									style={{ minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
									title={document.label}
								>
									{document.label}
								</span>
							</span>
						</PopMenuItem>
					))}
				</PopMenu>
			)}
		</FlexBox>
	);
}

export function ButtonBarVerticalExample() {
	return (
		<FlexBox preset={Preset.FillCenterMiddle} direction={'row'} gap={16}>
			<ButtonBar
				aria-label="Document zoom"
				orientation="vertical"
				buttonSize={'s'}
				buttons={[
					{ iconRight: 'basic.plus', 'aria-label': 'Increase' },
					{ iconRight: 'basic.minus', 'aria-label': 'Decrease' },
				]}
			/>
			<ButtonBar
				aria-label="Document zoom"
				orientation="vertical"
				buttonSize={'s'}
				buttons={[
					{ iconRight: 'arrows.chevron-up', 'aria-label': 'Increase' },
					{ iconRight: 'arrows.chevron-down', 'aria-label': 'Decrease' },
				]}
			/>
		</FlexBox>
	);
}

export function ButtonBarSizesExample() {
	return (
		<FlexBox direction="column" gap={16}>
			{(['s', 'm', 'l', 'xl'] as const).map((size) => (
				<ButtonBar
					key={size}
					buttonSize={size}
					aria-label={`${size} actions`}
					buttons={[
						{ label: size.toUpperCase() },
						{ iconLeft: 'basic.plus', 'aria-label': 'Increase' },
						{ iconLeft: 'basic.minus', 'aria-label': 'Decrease' },
					]}
				/>
			))}
		</FlexBox>
	);
}

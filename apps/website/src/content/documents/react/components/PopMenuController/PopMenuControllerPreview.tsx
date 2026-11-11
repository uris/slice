'use client';

import { Button, FlexBox, PopMenu, PopMenuController, type PopMenuProps } from '@apple-pie/slice';
import { type PushedPopMenu, getPopMenu, popMenuActions } from '@apple-pie/slice/stores/popMenu';
import { useEffect, useRef } from 'react';

function ProjectMenu(props: PopMenuProps) {
	return <PopMenu {...props} name="Project actions" options={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;
}

export function PopMenuControllerPreview() {
	const ownedMenu = useRef<PushedPopMenu | null>(null);
	useEffect(
		() => () => {
			if (getPopMenu() === ownedMenu.current) popMenuActions.clear();
		},
		[],
	);

	return (
		<FlexBox justify="center" align="center" gap={16} height={180}>
			<Button
				label="Push props"
				onClick={(event) => {
					if (!event) return;
					const caller = event.currentTarget;
					const menu: PopMenuProps = {
						caller,
						name: 'Quick actions',
						options: [{ label: 'Edit' }, { label: 'Archive' }],
					};
					ownedMenu.current = menu;
					popMenuActions.push(menu);
				}}
			/>
			<Button
				label="Push composed menu"
				variant="outline"
				onClick={(event) => {
					if (!event) return;
					const caller = event.currentTarget;
					const menu = <ProjectMenu caller={caller} />;
					ownedMenu.current = menu;
					popMenuActions.push(menu);
				}}
			/>
			<PopMenuController />
		</FlexBox>
	);
}

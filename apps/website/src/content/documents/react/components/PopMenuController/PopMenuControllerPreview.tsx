'use client';

import { Button, FlexDiv, PopMenu, PopMenuController, type PopMenuProps } from '@apple-pie/slice';
import { type PushedPopMenu, getPopMenu, popMenuActions } from '@apple-pie/slice/stores/popMenu';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function ProjectMenu(props: PopMenuProps) {
	return <PopMenu {...props} name="Project actions" options={[{ label: 'Edit' }, { label: 'Duplicate' }]} />;
}

export function PopMenuControllerPreview() {
	const [host, setHost] = useState<Element>();
	const ownedMenu = useRef<PushedPopMenu | null>(null);
	useEffect(
		() => () => {
			if (getPopMenu() === ownedMenu.current) popMenuActions.clear();
		},
		[],
	);

	return (
		<FlexDiv justify="center" align="center" gap={16} height={180}>
			<Button
				label="Push props"
				onClick={(event) => {
					if (!event) return;
					const caller = event.currentTarget;
					setHost(caller.closest('[data-slice-theme-scope]') ?? document.body);
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
					setHost(caller.closest('[data-slice-theme-scope]') ?? document.body);
					const menu = <ProjectMenu caller={caller} />;
					ownedMenu.current = menu;
					popMenuActions.push(menu);
				}}
			/>
			{host && createPortal(<PopMenuController />, host)}
		</FlexDiv>
	);
}

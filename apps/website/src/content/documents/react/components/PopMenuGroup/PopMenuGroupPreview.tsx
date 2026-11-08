'use client';

import { Button, FlexDiv, PopMenu, PopMenuGroup, PopMenuItem } from '@apple-pie/slice';
import { useState } from 'react';

export function PopMenuGroupPreview() {
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
			<Button
				label="Open grouped menu"
				onClick={(event) => {
					if (event) setCaller(event.currentTarget);
				}}
			/>
			{menu}
		</FlexDiv>
	);
}

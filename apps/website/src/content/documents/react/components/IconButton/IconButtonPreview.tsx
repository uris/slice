'use client';
import { IconButton } from '@apple-pie/slice';

export function IconButtonPreview({ toggle = false, count = 0 }: Readonly<{ toggle?: boolean; count?: number }>) {
	return (
		<IconButton
			icon={toggle ? 'sun' : count ? 'more' : 'arrow up'}
			actionName={toggle ? 'Highlight' : count ? `${count} updates` : 'More options'}
			count={count}
			toggle={toggle}
			motionValues={toggle ? { unselected: { rotate: 0 }, selected: { rotate: 135 } } : undefined}
		/>
	);
}

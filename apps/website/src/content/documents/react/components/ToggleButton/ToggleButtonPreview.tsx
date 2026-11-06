'use client';
import { Avatar, ToggleButton } from '@apple-pie/slice';

export function ToggleButtonPreview({
	variant = 'default',
}: Readonly<{
	variant?: 'default' | 'animated' | 'text' | 'disabled' | 'outside' | 'children';
}>) {
	if (variant === 'children') {
		return (
			<ToggleButton actionName="John Wick's Profile" buttonSize={'auto'} padding={'10px 12px'}>
				<Avatar name={'John Wick'} image={'/images/jw-profile.png'} />
				<span>John Wick's Profile</span>
			</ToggleButton>
		);
	}
	return (
		<ToggleButton
			icon={variant === 'text' ? undefined : 'weather.sun'}
			label={'Highlight'}
			disabled={variant === 'disabled'}
			labelOutside={variant === 'outside' || variant === 'animated'}
			motionValues={variant === 'animated' ? { unselected: { rotate: 0 }, selected: { rotate: 135 } } : undefined}
			borderRadius={variant === 'outside' || variant === 'animated' ? '100%' : undefined}
			gap={variant === 'outside' || variant === 'animated' ? 8 : undefined}
		/>
	);
}

'use client';
import { ToggleButton } from '@apple-pie/slice';

export function ToggleButtonPreview({
	variant = 'default',
}: Readonly<{ variant?: 'default' | 'animated' | 'text' | 'disabled' | 'outside' }>) {
	return (
		<ToggleButton
			icon={variant === 'text' ? undefined : 'sun'}
			label={variant === 'text' ? 'Follow' : 'Highlight'}
			disabled={variant === 'disabled'}
			labelOutside={variant === 'outside'}
			motionValues={variant === 'animated' ? { unselected: { rotate: 0 }, selected: { rotate: 135 } } : undefined}
			borderRadius={variant === 'outside' ? '100%' : undefined}
			gap={variant === 'outside' ? 8 : undefined}
		/>
	);
}

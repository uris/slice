'use client';
import { FlexBox, Icon, IconButton, type SliceIcon, ToastType } from '@apple-pie/slice';
import { useClipboard } from '@apple-pie/slice/hooks';
import { useToastActions } from '@apple-pie/slice/stores';
import { tipActions } from '@apple-pie/slice/stores/tip';
import { coreColors } from '@apple-pie/slice/theme/colors';

export function IconGroupPreview({ icons }: { icons: SliceIcon[] }) {
	const { copy } = useClipboard({ watchPermissions: false });
	const { push } = useToastActions();
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, 40px)',
				gridAutoRows: '40px',
				justifyContent: 'center',
				justifyItems: 'center',
				alignItems: 'center',
				gap: 8,
				width: '100%',
				padding: '24px 64px',
			}}
		>
			{icons.map((name) => (
				<IconButton
					key={name}
					icon={name}
					iconSize={24}
					buttonSize={40}
					actionName={`Copy ${name}`}
					tooltip={name}
					onToolTip={tipActions.push}
					backgroundColor={'transparent'}
					backgroundColorHover={'core-fill-primary'}
					onClick={() => {
						void copy(name);
						push({ message: `Copied ${name}`, type: ToastType.Success, duration: 1500 });
					}}
				/>
			))}
		</div>
	);
}

const primeColors = Object.keys(coreColors).filter((token) => /^core-[a-z]+-500$/.test(token));

export function IconColorsPreview() {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(5, 40px)',
				gridAutoRows: '40px',
				justifyContent: 'center',
				justifyItems: 'center',
				alignItems: 'center',
				gap: 24,
				width: '100%',
				maxWidth: 360,
				padding: '24px 64px',
			}}
		>
			{primeColors.map((token) => (
				<Icon key={token} name="basic.heart" size={32} strokeColor={`var(--${token})`} iconName={`Heart in ${token}`} />
			))}
		</div>
	);
}

export function IconSizesPreview() {
	const sizes = [16, 24, 32];
	const strokes = [1, 1.5, 2];
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 40px)',
				gridAutoRows: '40px',
				justifyContent: 'center',
				justifyItems: 'center',
				alignItems: 'center',
				gap: 24,
				width: '100%',
				maxWidth: 360,
				padding: '24px 64px',
			}}
		>
			{strokes.flatMap((stroke) =>
				sizes.map((size) => (
					<FlexBox key={`${stroke}-${size}`} width="fill" height={40} align="center" justify="center">
						<Icon name="basic.heart" size={size} stroke={stroke} iconName={`Heart, ${size}px, stroke ${stroke}`} />
					</FlexBox>
				)),
			)}
		</div>
	);
}

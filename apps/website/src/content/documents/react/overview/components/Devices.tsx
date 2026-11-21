import {
	type ColorValue,
	Dot,
	FlexBox,
	Icon,
	InfoBox,
	InfoBoxAction,
	InfoBoxContent,
	InfoBoxImage,
	InfoBoxTitle,
	Preset,
	type SliceIcon,
	useTheme,
} from '@apple-pie/slice';
import { tintFromColor } from '@apple-pie/slice/utils';
import { useCallback, useState } from 'react';
import { Block, useNotice } from '../Shared';

const devices = [
	{
		id: 'laptop',
		name: 'MacBook Pro',
		detail: 'San Francisco · This device',
		icon: 'electronics.laptop' as SliceIcon,
	},
	{ id: 'phone', name: 'iPhone', detail: 'Last active 12 minutes ago', icon: 'electronics.smartphone' as SliceIcon },
];

export function Devices() {
	const [connected, setConnected] = useState<Set<string>>(new Set(['laptop']));
	const notice = useNotice();
	const { isDark } = useTheme();
	const bgColor: ColorValue = tintFromColor('core-surface-primary', isDark ? 10 : -0.01);
	const handleUpdateConnection = useCallback(
		(device: string) => {
			setConnected((prev) => {
				const updated = new Set(prev);
				updated.has(device) ? updated.delete(device) : updated.add(device);
				return updated;
			});
			notice('Device connection updated in this preview.');
		},
		[notice],
	);

	return (
		<Block title="Your connected devices" caption="ACCOUNT SECURITY">
			{devices.map((device) => {
				const online = connected.has(device.id);
				return (
					<InfoBox key={device.id} minWidth={'100%'} maxWidth={'100%'} backgroundColor={bgColor}>
						<InfoBoxImage>
							<Icon
								strokeColor={online ? 'core-icon-primary' : 'core-text-tertiary'}
								size={36}
								stroke={0.7}
								name={device.icon}
							/>
						</InfoBoxImage>
						<InfoBoxTitle>
							<FlexBox preset={Preset.Row} gap={8}>
								{device.name}
								<Dot position={'inline'} show={online} color={'core-green'} />
							</FlexBox>
						</InfoBoxTitle>
						<InfoBoxContent text={online ? device.detail : 'Disconnected'} />
						<InfoBoxAction
							contentGap={16}
							button={{
								label: online ? 'Sign out' : 'Connect',
								variant: 'outline',
								onClick: () => handleUpdateConnection(device.id),
							}}
						/>
					</InfoBox>
				);
			})}
		</Block>
	);
}

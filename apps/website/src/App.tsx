'use client';

import { Badge, Card, CardContent, CardFooter, FlexBox, Icon, Preset, Spacer, useTheme } from '@apple-pie/slice';
import { Button } from '@apple-pie/slice/components/Button';
import { SliceLogo } from './SliceLogo';

export function App() {
	const theme = useTheme();
	return (
		<FlexBox preset={Preset.Window}>
			<FlexBox preset={Preset.FillCenterMiddle}>
				<SliceLogo size={64} />
				<Spacer size={'xl'} />
				<Card maxWidth={350}>
					<CardContent>
						The same free ui-kit you love for building with react, now available for both React Web and React Native.
					</CardContent>
					<CardFooter style={{ gap: 12 }}>
						<Button width={'fill'} variant={'primary'} link={'/docs/react/colors'} target={'_top'}>
							<FlexBox direction={'row'} align={'center'} justify={'center'} gap={8}>
								<Icon name={'basic.planet'} strokeColor={'var(--core-text-dark)'} />
								<span style={{ color: 'var(--core-text-dark)' }}>Web Apps</span>
							</FlexBox>
						</Button>
						<Button
							width={'fill'}
							variant={'secondary'}
							link={'https://react-native.slice-uikit.com'}
							target={'_blank'}
						>
							<FlexBox direction={'row'} align={'center'} justify={'center'} gap={8}>
								<Icon name={'brands.apple'} />
								<Icon name={'brands.android'} />
								<span>Native Apps</span>
								<Badge variant={'light'} title={'Alpha'} count={'Alpha'} />
							</FlexBox>
						</Button>
					</CardFooter>
				</Card>
			</FlexBox>
		</FlexBox>
	);
}

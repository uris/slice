'use client';

import { Badge, Card, CardContent, CardFooter, FlexBox, Icon, Preset, Spacer, useTheme } from '@apple-pie/slice';
import { Button } from '@apple-pie/slice/components/Button';
import { SliceLogo } from './SliceLogo';

export function App() {
	const { isDark } = useTheme();
	const textColor = isDark ? 'var(--core-text-dark)' : 'var(--core-text-light)';
	return (
		<FlexBox preset={Preset.Window}>
			<FlexBox preset={Preset.FillCenterMiddle}>
				<SliceLogo size={64} />
				<Spacer size={'xl'} />
				<Card maxWidth={300}>
					<CardContent>
						The same free ui-kit you love for building with react, now available for both React Web and React Native.
					</CardContent>
					<CardFooter style={{ gap: 12 }}>
						<Button width={'fill'} variant={'primary'} link={'/docs/react/colors'} target={'_top'}>
							<FlexBox direction={'row'} align={'center'} justify={'center'} gap={8}>
								<Icon name={'basic.atom'} strokeColor={textColor} />
								<span style={{ color: textColor }}>Web apps</span>
							</FlexBox>
						</Button>
						<Button
							width={'fill'}
							variant={'secondary'}
							link={'https://react-native.slice-uikit.com'}
							target={'_blank'}
							backgroundColor={'core-button-secondary'}
						>
							<FlexBox direction={'row'} align={'center'} justify={'center'} gap={8}>
								<Icon name={'electronics.smartphone'} />
								<span>Native apps</span>
								<Badge variant={'light'} title={'Alpha'} count={'Alpha'} />
							</FlexBox>
						</Button>
					</CardFooter>
				</Card>
			</FlexBox>
		</FlexBox>
	);
}

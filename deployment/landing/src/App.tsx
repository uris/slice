import { FlexDiv, Icon, Preset, Spacer, useTheme } from '@apple-pie/slice';
import { Button } from '@apple-pie/slice/components/Button';
import { SliceLogo } from './SliceLogo';

export function App() {
	const theme = useTheme();
	return (
		<FlexDiv preset={Preset.Window}>
			<FlexDiv preset={Preset.FillCenter}>
				<SliceLogo size={64} />
				<Spacer size={'l'} />
				<p style={{ maxWidth: 300, color: theme.colors['core-text-disabled'] }}>
					The same free ui-kit you love for building with react, now available for both React Web and React Native.
				</p>
				<FlexDiv direction={'row'} width={'auto'} gap={24}>
					<Button variant={'solid'} link={'https://react.slice-uikit.com'} target={'_blank'} paddingLeft={16}>
						<FlexDiv direction={'row'} align={'center'} justify={'center'} gap={4}>
							<span style={{ marginLeft: 4 }}>Web Apps</span>
						</FlexDiv>
					</Button>
					<Button variant={'solid'} link={'https://react-native.slice-uikit.com'} target={'_blank'} paddingLeft={16}>
						<FlexDiv direction={'row'} align={'center'} justify={'center'} gap={4}>
							<Icon name={'apple'} />
							<Icon name={'android'} />
							<span style={{ marginLeft: 4 }}>Native Apps</span>
						</FlexDiv>
					</Button>
				</FlexDiv>
			</FlexDiv>
		</FlexDiv>
	);
}

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import {
	useDpr,
	useFormFactor,
	useGetLocation,
	useGettingLocation,
	useInitializeWindow,
	useIsAppleDevice,
	useIsElectron,
	useIsTouchDevice,
	useLocation,
	useLocationError,
	useViewportHeight,
	useViewportWidth,
	useWindowStore,
} from './windowStore';

function WindowStoreDemo() {
	const geolocationSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;
	const initialize = useInitializeWindow();
	const formFactor = useFormFactor();
	const viewportWidth = useViewportWidth();
	const viewportHeight = useViewportHeight();
	const isTouchDevice = useIsTouchDevice();
	const isElectron = useIsElectron();
	const isAppleDevice = useIsAppleDevice();
	const dpr = useDpr();
	const getLocation = useGetLocation();
	const location = useLocation();
	const locationError = useLocationError();
	const gettingLocation = useGettingLocation();
	const height = useWindowStore((state) => state.height);

	useEffect(() => initialize(), [initialize]);

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexDiv
				width={420}
				height={'auto'}
				direction={'column'}
				gap={10}
				padding={16}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
			>
				<span>
					Viewport: {viewportWidth ?? '-'} x {viewportHeight ?? '-'}
				</span>
				<span>Form Factor: {formFactor}</span>
				<span>Touch Device: {isTouchDevice ? 'true' : 'false'}</span>
				<span>Electron: {isElectron ? 'true' : 'false'}</span>
				<span>IsAppleDevice: {isAppleDevice ? 'true' : 'false'}</span>
				<span>Display Pixel Density: {dpr}</span>
				<span>"True" height token: {height}</span>
				<span>(Geo)Location Supported: {geolocationSupported ? 'true' : 'false'}</span>
				{location && (
					<span>
						Geolocation: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : '-'}
					</span>
				)}
				{locationError && <span>Geolocation Error: {locationError?.message ?? '-'}</span>}
				<Button
					label={'Request location'}
					onClick={() => void getLocation().catch(() => {})}
					state={!geolocationSupported || gettingLocation ? 'disabled' : 'normal'}
					working={gettingLocation}
					progress={true}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof WindowStoreDemo> = {
	title: 'Stores/Window Store',
	component: WindowStoreDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof WindowStoreDemo> = {};

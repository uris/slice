'use client';

import { AudioBubble, Chip, DropDown, FlexBox, type MicOption } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';
import { type ReactNode, createContext, useContext } from 'react';

const MicrophoneContext = createContext<ReturnType<typeof useMicrophone> | null>(null);

/** Share one microphone stream across the page's live examples. */
export function AudioBubblePreviewProvider({ children }: { children: ReactNode }) {
	const microphone = useMicrophone(false);
	return <MicrophoneContext.Provider value={microphone}>{children}</MicrophoneContext.Provider>;
}

export function AudioBubblePreview({
	variant = 'live',
}: { variant?: 'live' | 'paused' | 'response' | 'glow' | 'status' }) {
	const microphone = useContext(MicrophoneContext);
	if (!microphone) throw new Error('AudioBubble previews require their microphone provider.');
	const { micStream, isActive, isRequesting, error, micOptions, setMicrophone, currentDeviceId } = microphone;
	const selectedId = currentDeviceId ?? '';
	const playing = variant !== 'paused' && isActive;
	console.log({ micOptions, currentDeviceId });
	const getStatus = () => {
		if (error) return error.message;
		if (isRequesting) return 'Waiting for microphone access…';
		return isActive ? 'Listening' : 'Not listening';
	};
	return (
		<FlexBox justify={'start'} align={'center'} direction={'column'} overflow={'visible'} gap={16}>
			<AudioBubble
				audioStream={isRequesting ? null : micStream.current}
				playing={playing}
				{...(variant === 'response'
					? {
							size: 48,
							minScale: 1,
							maxScale: 2,
							intensity: 2.2,
							peakIntensity: 0.3,
						}
					: {})}
				{...(variant === 'glow'
					? {
							backgroundColor: 'core-link-primary',
							glowColor: 'core-link-primary',
							glowSize: 32,
							glowOffset: 0,
						}
					: {})}
			/>

			{variant === 'live' && !error && (
				<DropDown<MicOption>
					valueKey={'id'}
					value={{ id: selectedId }}
					options={micOptions}
					onChangeOption={setMicrophone}
					label={'Mic'}
					backgroundColor={'core-surface-primary'}
					style={{ maxWidth: 'min-content', alignSelf: 'center' }}
				/>
			)}
			{(variant === 'status' || (variant === 'live' && error)) && <Chip padding={8} label={getStatus()} />}
		</FlexBox>
	);
}

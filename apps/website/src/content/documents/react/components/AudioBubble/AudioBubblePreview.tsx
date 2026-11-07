'use client';

import { AudioBubble, DropDown, FlexDiv, Label, type MicOption } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';
import { useReducedMotion } from 'motion/react';
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
	const reducedMotion = useReducedMotion();
	if (!microphone) throw new Error('AudioBubble previews require their microphone provider.');
	const { micStream, isActive, isRequesting, error, micOptions, setMicrophone, currentDeviceId } = microphone;
	const selectedId = currentDeviceId ?? '';
	const playing = variant !== 'paused' && isActive && !reducedMotion;
	console.log({ micOptions, currentDeviceId });
	const getStatus = () => {
		if (error) return error.message;
		if (isRequesting) return 'Waiting for microphone access…';
		return isActive ? 'Listening' : 'Not listening';
	};
	return (
		<FlexDiv justify={'start'} align={'center'} direction={'column'} gap={16}>
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

			{variant === 'live' && (
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
			{variant === 'status' && <Label padding={8} label={getStatus()} />}
		</FlexDiv>
	);
}

'use client';

import { AudioBubble } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';

/** Request an unmuted microphone and visualize its live stream. */
export function AudioBubblePreview() {
	const { micStream, isActive, isRequesting } = useMicrophone(false);

	return <AudioBubble audioStream={isRequesting ? null : micStream.current} playing={isActive} aria-hidden="true" />;
}

import { useMemo } from 'react';
import { Platform } from 'react-native';
import type { DeviceCapabilities } from './_types';

/** Unsupported-platform fallback. Metro selects the native hook on iOS/Android. */
export function useDeviceCapabilities(): DeviceCapabilities {
	return useMemo(
		() => ({
			platform: Platform.OS,
			iosVersion: null,
			androidSdkVersion: null,
			deviceName: null,
			deviceModel: null,
			supportsLiquidGlass: false,
			supportsNativeBlur: false,
		}),
		[],
	);
}

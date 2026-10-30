import { useMemo } from 'react';
import { Platform } from 'react-native';
import NativeDeviceCapabilities from '../../specs/NativeDeviceCapabilities';

import type { DeviceCapabilities } from './_types';

/**
 * Reports native API availability. Both values are false on unsupported platforms
 * or when the package's native module is absent. Accessibility preferences and
 * per-view hardware acceleration can still cause components to use their fallback.
 */
export function useDeviceCapabilities(): DeviceCapabilities {
	return useMemo(() => {
		const platform = Platform.OS;
		const native = platform === 'ios' || platform === 'android' ? NativeDeviceCapabilities?.getConstants() : null;
		return {
			platform,
			isAndroid: Platform.OS === 'android',
			isIOS: Platform.OS === 'ios',
			isMacOS: Platform.OS === 'macos',
			isWindows: Platform.OS === 'windows',
			isWeb: Platform.OS === 'web',
			iosVersion: platform === 'ios' ? String(Platform.Version) : null,
			androidSdkVersion: platform === 'android' ? Platform.Version : null,
			deviceName: native?.deviceName ?? null,
			deviceModel: native?.deviceModel ?? null,
			supportsLiquidGlass: native?.supportsLiquidGlass ?? false,
			supportsNativeBlur: native?.supportsNativeBlur ?? false,
		};
	}, []);
}

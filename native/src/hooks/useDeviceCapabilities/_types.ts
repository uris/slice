import type { Platform } from 'react-native';

export interface DeviceCapabilities {
	/** Current React Native platform, including ios, android, and web. */
	readonly platform: typeof Platform.OS;
	/** Full iOS system version (e.g. '26.1.0'), or null on other platforms. */
	readonly iosVersion: string | null;
	/** Android API level (e.g. 37), or null on other platforms. */
	readonly androidSdkVersion: number | null;
	/** System-provided iOS name or Android model; null when unavailable. */
	readonly deviceName: string | null;
	/** iOS hardware identifier (e.g. 'iPhone17,1') or Android model; null when unavailable. */
	readonly deviceModel: string | null;
	/** Native Liquid Glass API availability (iOS 26+). */
	readonly supportsLiquidGlass: boolean;
	/** Native backdrop blur API availability, rather than content/window blur. */
	readonly supportsNativeBlur: boolean;
	/** qol for android check */
	readonly isAndroid: boolean;
	/** qol for ios check */
	readonly isIOS: boolean;
	/** qol for mac os check */
	readonly isMacOS: boolean;
	/** qol for windows check */
	readonly isWindows: boolean;
	/** qol for web check */
	readonly isWeb: boolean;
}

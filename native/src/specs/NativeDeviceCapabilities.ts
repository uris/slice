import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
	readonly getConstants: () => {
		supportsLiquidGlass: boolean;
		supportsNativeBlur: boolean;
		deviceName: string;
		deviceModel: string;
	};
}

export default TurboModuleRegistry.get<Spec>('SliceDeviceCapabilities');

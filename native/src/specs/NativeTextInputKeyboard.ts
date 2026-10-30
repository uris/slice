import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Android keyboard refresh for an existing React Native editor.
 */
export interface Spec extends TurboModule {
	restartInput(viewTag: number, returnKeyType: string, returnKeyLabel: string | null): void;
}

export default TurboModuleRegistry.get<Spec>('SliceTextInputKeyboard');

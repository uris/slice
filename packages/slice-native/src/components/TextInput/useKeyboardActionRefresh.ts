import type { RefObject } from 'react';
import type { TextInputInstance, TextInputProps } from 'react-native';

/**
 * Android refreshes the active keyboard; other platforms retain native behavior.
 */
export function useKeyboardActionRefresh(
	_inputRef: RefObject<TextInputInstance | null>,
	_props: Pick<TextInputProps, 'returnKeyType' | 'returnKeyLabel' | 'enterKeyHint'>,
): void {}

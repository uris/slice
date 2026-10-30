import { type RefObject, useEffect, useRef } from 'react';
import { type TextInputInstance, type TextInputProps, findNodeHandle } from 'react-native';
import NativeTextInputKeyboard from '../../specs/NativeTextInputKeyboard';

/**
 * Refresh a focused Android editor after its effective keyboard action changes.
 * Never blur or remount: either would disrupt selection and blurClears behavior.
 */
export function useKeyboardActionRefresh(
	inputRef: RefObject<TextInputInstance | null>,
	props: Pick<TextInputProps, 'returnKeyType' | 'returnKeyLabel' | 'enterKeyHint'>,
): void {
	let action = props.enterKeyHint ?? props.returnKeyType ?? 'done';
	if (action === 'enter') action = 'default';
	const label = props.returnKeyLabel ?? null;
	const previous = useRef({ action, label });
	useEffect(() => {
		const changed = previous.current.action !== action || previous.current.label !== label;
		previous.current = { action, label };
		if (!changed || !NativeTextInputKeyboard || !inputRef.current?.isFocused()) return;
		// Coalesce rapid prop changes and run after React's current commit.
		const frame = requestAnimationFrame(() => {
			const input = inputRef.current;
			if (!input?.isFocused()) return;
			const tag = findNodeHandle(input);
			if (typeof tag === 'number') NativeTextInputKeyboard?.restartInput(tag, action, label);
		});
		return () => cancelAnimationFrame(frame);
	}, [action, label, inputRef]);
}

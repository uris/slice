'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { copyToClipboard } from '../../utils';

export type ClipboardPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type ClipboardPasteResult = {
	text: string;
	files: File[];
	items: DataTransferItem[];
	nativeEvent: ClipboardEvent;
};

export type UseClipboardTarget = RefObject<HTMLElement | null> | Document | HTMLElement;

export type UseClipboardOptions = {
	/** Element (or ref to one) to listen for native `paste` events on. Defaults to `document`. */
	target?: UseClipboardTarget;
	/** Called whenever a native paste event fires on the target, with the pasted text, files, and raw items. */
	onPaste?: (result: ClipboardPasteResult) => void;
	/** How long `isCopied` stays `true` after a successful `copy()`, in ms. Pass `0` to disable the auto-reset. */
	copiedResetDelay?: number;
	/** Query and subscribe to clipboard-read/clipboard-write permission state on mount. Defaults to `true`. */
	watchPermissions?: boolean;
};

export type UseClipboardReturn = {
	/** Most recently read or pasted clipboard text. `null` until a `read()` or observed paste populates it. */
	text: string | null;
	/** Whether the async Clipboard API (`navigator.clipboard`) is available in this environment. */
	isSupported: boolean;
	/** Briefly `true` after a successful `copy()` call. Handy for "Copied!" affordances. */
	isCopied: boolean;
	/** Whether a `copy()` or `read()` call is currently in flight. */
	isRequesting: boolean;
	/** Last error raised by `copy()` or `read()`. */
	error: Error | null;
	/** Current `clipboard-read` permission state, or `unsupported` when the Permissions API can't report it. */
	readPermission: ClipboardPermissionState;
	/** Current `clipboard-write` permission state, or `unsupported` when the Permissions API can't report it. */
	writePermission: ClipboardPermissionState;
	/** Write text to the clipboard. Falls back to a hidden-textarea `execCommand` copy when the Clipboard API is unavailable or denied. */
	copy: (value: string) => Promise<boolean>;
	/** Read text from the clipboard via the async Clipboard API. Resolves to `null` on unsupported browsers or denied permission. */
	read: () => Promise<string | null>;
};

const DEFAULT_COPIED_RESET_DELAY = 2000;

// feature-detect the async Clipboard API rather than assuming support
function hasClipboardApi() {
	return typeof navigator !== 'undefined' && Boolean(navigator.clipboard);
}

function hasPermissionsApi() {
	return typeof navigator !== 'undefined' && Boolean(navigator.permissions?.query);
}

function resolveTarget(target: UseClipboardTarget | undefined): EventTarget | null {
	if (!target) return typeof document === 'undefined' ? null : document;
	if ('current' in target) return target.current;
	return target;
}

// clipboard-read/clipboard-write aren't part of the standard PermissionName union in TS's DOM lib,
// though every browser that implements the Permissions API for clipboard accepts them at runtime.
async function queryClipboardPermission(name: 'clipboard-read' | 'clipboard-write'): Promise<PermissionStatus | null> {
	if (!hasPermissionsApi()) return null;
	try {
		return await navigator.permissions.query({ name } as unknown as PermissionDescriptor);
	} catch {
		return null;
	}
}

function permissionErrorMessage(action: 'read' | 'write', error: unknown) {
	if (error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'SecurityError')) {
		return `Permission to ${action} the clipboard was denied`;
	}
	return `Failed to ${action} the clipboard`;
}

// shared fallback path for copy(): the legacy hidden-textarea + execCommand approach
async function writeWithFallback(value: string, primaryError: unknown = null) {
	const didCopy = await copyToClipboard(value);
	if (didCopy) return { ok: true as const };
	const message = primaryError
		? permissionErrorMessage('write', primaryError)
		: `Copying to the clipboard isn't supported`;
	return { ok: false as const, message };
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
	const { target, onPaste, copiedResetDelay = DEFAULT_COPIED_RESET_DELAY, watchPermissions = true } = options;

	const [text, setText] = useState<string | null>(null);
	const [isCopied, setIsCopied] = useState(false);
	const [isRequesting, setIsRequesting] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [readPermission, setReadPermission] = useState<ClipboardPermissionState>('unsupported');
	const [writePermission, setWritePermission] = useState<ClipboardPermissionState>('unsupported');
	const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const onPasteRef = useRef(onPaste);
	onPasteRef.current = onPaste;

	const isSupported = hasClipboardApi();

	// write text to the clipboard, falling back to the legacy execCommand approach when needed
	const copy = useCallback(async (value: string) => {
		setIsRequesting(true);
		try {
			if (hasClipboardApi()) {
				try {
					await navigator.clipboard.writeText(value);
					setError(null);
					setIsCopied(true);
					return true;
				} catch (err) {
					const result = await writeWithFallback(value, err);
					setError(result.ok ? null : new Error(result.message));
					setIsCopied(result.ok);
					return result.ok;
				}
			}
			const result = await writeWithFallback(value);
			setError(result.ok ? null : new Error(result.message));
			setIsCopied(result.ok);
			return result.ok;
		} finally {
			setIsRequesting(false);
		}
	}, []);

	// read text from the clipboard; requires the async Clipboard API and, usually, a user gesture or granted permission
	const read = useCallback(async () => {
		if (!hasClipboardApi()) {
			setError(new Error(`Clipboard reading isn't supported`));
			return null;
		}
		setIsRequesting(true);
		try {
			const value = await navigator.clipboard.readText();
			setText(value);
			setError(null);
			return value;
		} catch (err) {
			setError(new Error(permissionErrorMessage('read', err)));
			return null;
		} finally {
			setIsRequesting(false);
		}
	}, []);

	// auto-reset isCopied after copiedResetDelay
	useEffect(() => {
		if (!isCopied) return;
		if (resetTimer.current) clearTimeout(resetTimer.current);
		if (copiedResetDelay <= 0) return;
		resetTimer.current = setTimeout(() => setIsCopied(false), copiedResetDelay);
		return () => {
			if (resetTimer.current) clearTimeout(resetTimer.current);
		};
	}, [isCopied, copiedResetDelay]);

	// query and subscribe to clipboard-read/clipboard-write permission state
	useEffect(() => {
		if (!watchPermissions) {
			setReadPermission('unsupported');
			setWritePermission('unsupported');
			return;
		}

		let cancelled = false;
		const cleanups: (() => void)[] = [];

		function bind(status: PermissionStatus | null, setState: (state: ClipboardPermissionState) => void) {
			if (!status || cancelled) {
				setState('unsupported');
				return;
			}
			setState(status.state as ClipboardPermissionState);
			const handleChange = () => setState(status.state as ClipboardPermissionState);
			status.addEventListener('change', handleChange);
			cleanups.push(() => status.removeEventListener('change', handleChange));
		}

		void queryClipboardPermission('clipboard-read').then((status) => bind(status, setReadPermission));
		void queryClipboardPermission('clipboard-write').then((status) => bind(status, setWritePermission));

		return () => {
			cancelled = true;
			for (const cleanup of cleanups) cleanup();
		};
	}, [watchPermissions]);

	// listen for native paste events on the target (defaults to `document`) and surface text, files, and raw items
	useEffect(() => {
		const element = resolveTarget(target);
		if (!element) return;

		const handlePaste = (event: Event) => {
			const clipboardData = (event as ClipboardEvent).clipboardData;
			if (!clipboardData) return;

			const pastedText = clipboardData.getData('text/plain');
			const items = Array.from(clipboardData.items ?? []);
			const files = items.map((item) => item.getAsFile()).filter((file): file is File => file !== null);

			if (pastedText) setText(pastedText);
			onPasteRef.current?.({ text: pastedText, files, items, nativeEvent: event as ClipboardEvent });
		};

		element.addEventListener('paste', handlePaste);
		return () => element.removeEventListener('paste', handlePaste);
	}, [target]);

	return {
		text,
		isSupported,
		isCopied,
		isRequesting,
		error,
		readPermission,
		writePermission,
		copy,
		read,
	};
}

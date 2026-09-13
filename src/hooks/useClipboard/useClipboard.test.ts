import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClipboard } from './useClipboard';

class MockPermissionStatus extends EventTarget {
	state: PermissionState;

	constructor(state: PermissionState) {
		super();
		this.state = state;
	}

	set(state: PermissionState) {
		this.state = state;
		this.dispatchEvent(new Event('change'));
	}
}

let writeText: ReturnType<typeof vi.fn>;
let readText: ReturnType<typeof vi.fn>;
let readStatus: MockPermissionStatus;
let writeStatus: MockPermissionStatus;
let query: ReturnType<typeof vi.fn>;

function setClipboard(value: unknown) {
	Object.defineProperty(navigator, 'clipboard', {
		configurable: true,
		value,
	});
}

function setPermissions(value: unknown) {
	Object.defineProperty(navigator, 'permissions', {
		configurable: true,
		value,
	});
}

beforeEach(() => {
	writeText = vi.fn().mockResolvedValue(undefined);
	readText = vi.fn().mockResolvedValue('clipboard value');
	setClipboard({ writeText, readText });

	readStatus = new MockPermissionStatus('prompt');
	writeStatus = new MockPermissionStatus('prompt');
	query = vi.fn(({ name }: { name: string }) => {
		if (name === 'clipboard-read') return Promise.resolve(readStatus);
		if (name === 'clipboard-write') return Promise.resolve(writeStatus);
		return Promise.reject(new Error('unsupported permission name'));
	});
	setPermissions({ query });
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('useClipboard', () => {
	it('reports support based on navigator.clipboard', () => {
		const { result } = renderHook(() => useClipboard());
		expect(result.current.isSupported).toBe(true);
	});

	it('reports unsupported when navigator.clipboard is missing', () => {
		setClipboard(undefined);
		const { result } = renderHook(() => useClipboard());
		expect(result.current.isSupported).toBe(false);
	});

	it('copy() writes through the Clipboard API and flips isCopied', async () => {
		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const ok = await result.current.copy('hello');
			expect(ok).toBe(true);
		});

		expect(writeText).toHaveBeenCalledWith('hello');
		expect(result.current.isCopied).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it('isCopied auto-resets after copiedResetDelay', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useClipboard({ copiedResetDelay: 500 }));

		await act(async () => {
			await result.current.copy('hello');
		});
		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(result.current.isCopied).toBe(false);
		vi.useRealTimers();
	});

	it('copy() falls back to execCommand when the Clipboard API rejects', async () => {
		writeText.mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
		document.execCommand = vi.fn().mockReturnValue(true);

		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const ok = await result.current.copy('hello');
			expect(ok).toBe(true);
		});

		expect(document.execCommand).toHaveBeenCalledWith('copy');
		expect(result.current.isCopied).toBe(true);
	});

	it('copy() reports an error when both the Clipboard API and the fallback fail', async () => {
		writeText.mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
		document.execCommand = vi.fn().mockImplementation(() => {
			throw new Error('execCommand unavailable');
		});

		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const ok = await result.current.copy('hello');
			expect(ok).toBe(false);
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.error?.message).toBe('Permission to write the clipboard was denied');
	});

	it('read() populates text on success', async () => {
		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const value = await result.current.read();
			expect(value).toBe('clipboard value');
		});

		expect(result.current.text).toBe('clipboard value');
		expect(result.current.error).toBeNull();
	});

	it('read() surfaces a permission error and returns null', async () => {
		readText.mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const value = await result.current.read();
			expect(value).toBeNull();
		});

		expect(result.current.error?.message).toBe('Permission to read the clipboard was denied');
	});

	it('read() reports unsupported when navigator.clipboard is missing', async () => {
		setClipboard(undefined);
		const { result } = renderHook(() => useClipboard());

		await act(async () => {
			const value = await result.current.read();
			expect(value).toBeNull();
		});

		expect(result.current.error?.message).toBe(`Clipboard reading isn't supported`);
	});

	it('queries and tracks clipboard-read/clipboard-write permission state, including live changes', async () => {
		const { result } = renderHook(() => useClipboard());

		await waitFor(() => expect(result.current.readPermission).toBe('prompt'));
		expect(result.current.writePermission).toBe('prompt');
		expect(query).toHaveBeenCalledWith({ name: 'clipboard-read' });
		expect(query).toHaveBeenCalledWith({ name: 'clipboard-write' });

		act(() => {
			readStatus.set('granted');
		});
		await waitFor(() => expect(result.current.readPermission).toBe('granted'));
	});

	it('reports unsupported permission state when the Permissions API is unavailable', async () => {
		setPermissions(undefined);
		const { result } = renderHook(() => useClipboard());

		await waitFor(() => expect(result.current.readPermission).toBe('unsupported'));
		expect(result.current.writePermission).toBe('unsupported');
	});

	it('skips permission queries entirely when watchPermissions is false', async () => {
		renderHook(() => useClipboard({ watchPermissions: false }));
		await Promise.resolve();
		expect(query).not.toHaveBeenCalled();
	});

	it('observes native paste events on document by default and updates text', async () => {
		const onPaste = vi.fn();
		renderHook(() => useClipboard({ onPaste }));
		await act(async () => {});

		const clipboardData = {
			getData: vi.fn().mockReturnValue('pasted text'),
			items: [] as unknown as DataTransferItemList,
		};
		const event = new Event('paste') as ClipboardEvent;
		Object.defineProperty(event, 'clipboardData', { value: clipboardData });

		act(() => {
			document.dispatchEvent(event);
		});

		expect(onPaste).toHaveBeenCalledWith(
			expect.objectContaining({ text: 'pasted text', files: [], nativeEvent: event }),
		);
	});

	it('observes paste events on a custom target element instead of document', async () => {
		const onPaste = vi.fn();
		const container = document.createElement('div');
		document.body.appendChild(container);

		renderHook(() => useClipboard({ target: container, onPaste }));
		await act(async () => {});

		const clipboardData = {
			getData: vi.fn().mockReturnValue('inside target'),
			items: [] as unknown as DataTransferItemList,
		};
		const event = new Event('paste') as ClipboardEvent;
		Object.defineProperty(event, 'clipboardData', { value: clipboardData });

		act(() => {
			container.dispatchEvent(event);
		});

		expect(onPaste).toHaveBeenCalledWith(expect.objectContaining({ text: 'inside target' }));

		document.body.removeChild(container);
	});

	it('extracts files from pasted clipboard items', async () => {
		const onPaste = vi.fn();
		const file = new File(['content'], 'note.txt', { type: 'text/plain' });
		renderHook(() => useClipboard({ onPaste }));
		await act(async () => {});

		const clipboardData = {
			getData: vi.fn().mockReturnValue(''),
			items: [{ getAsFile: () => file }] as unknown as DataTransferItemList,
		};
		const event = new Event('paste') as ClipboardEvent;
		Object.defineProperty(event, 'clipboardData', { value: clipboardData });

		act(() => {
			document.dispatchEvent(event);
		});

		expect(onPaste).toHaveBeenCalledWith(expect.objectContaining({ files: [file] }));
	});
});

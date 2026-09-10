'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MdBuffer } from '../../utils';
import type { MarkdownStreamBufferOptions, MarkdownStreamBufferSnapshot } from '../../utils';

export type UseMDStreamBufferOptions = MarkdownStreamBufferOptions & {
	paceDelayMs?: number;
	paceChunkSize?: number;
};

export function useMDStreamBuffer(options?: UseMDStreamBufferOptions) {
	const bufferRef = useRef<MdBuffer | null>(null);
	const queuedValueRef = useRef('');
	const paceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [healthy, setHealthy] = useState<string>('');
	const [raw, setRaw] = useState<string>('');
	const [isComplete, setIsComplete] = useState<boolean>(false);
	const [pendingCharacters, setPendingCharacters] = useState<number>(0);
	const paceDelayMs = Math.max(0, options?.paceDelayMs ?? 0);
	const paceChunkSize = Math.max(1, options?.paceChunkSize ?? Number.POSITIVE_INFINITY);
	const usesPacing = options?.paceDelayMs !== undefined || options?.paceChunkSize !== undefined;

	const getTotalPendingCharacters = useCallback(() => {
		return queuedValueRef.current.length + (bufferRef.current?.pendingCharacters ?? 0);
	}, []);

	const clearPaceTimer = useCallback(() => {
		if (paceTimerRef.current === null) return;
		clearTimeout(paceTimerRef.current);
		paceTimerRef.current = null;
	}, []);

	const releaseQueuedChunk = useCallback(() => {
		if (!bufferRef.current || queuedValueRef.current.length === 0) {
			clearPaceTimer();
			setPendingCharacters(getTotalPendingCharacters());
			return;
		}

		const nextChunk = Number.isFinite(paceChunkSize)
			? queuedValueRef.current.slice(0, paceChunkSize)
			: queuedValueRef.current;
		queuedValueRef.current = queuedValueRef.current.slice(nextChunk.length);
		bufferRef.current.append(nextChunk);
		setPendingCharacters(getTotalPendingCharacters());

		if (queuedValueRef.current.length === 0) {
			clearPaceTimer();
			return;
		}

		paceTimerRef.current = setTimeout(releaseQueuedChunk, paceDelayMs);
	}, [clearPaceTimer, getTotalPendingCharacters, paceChunkSize, paceDelayMs]);

	const ensurePaceTimer = useCallback(() => {
		if (!usesPacing) return;
		if (paceTimerRef.current !== null) return;
		paceTimerRef.current = setTimeout(releaseQueuedChunk, paceDelayMs);
	}, [paceDelayMs, releaseQueuedChunk, usesPacing]);

	const drainQueuedValue = useCallback(() => {
		if (!bufferRef.current || queuedValueRef.current.length === 0) return;
		clearPaceTimer();
		bufferRef.current.append(queuedValueRef.current);
		queuedValueRef.current = '';
		setPendingCharacters(getTotalPendingCharacters());
	}, [clearPaceTimer, getTotalPendingCharacters]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: sets up on mount only
	useEffect(() => {
		const { paceDelayMs: _paceDelayMs, paceChunkSize: _paceChunkSize, ...bufferOptions } = options ?? {};
		bufferRef.current = new MdBuffer({
			...bufferOptions,
			onFlush: (snapshot: MarkdownStreamBufferSnapshot) => {
				const { healthy, raw, isComplete } = snapshot;
				setHealthy(healthy);
				setRaw(raw);
				setIsComplete(isComplete);
				setPendingCharacters(queuedValueRef.current.length + snapshot.pendingCharacters);
			},
		});

		return () => {
			clearPaceTimer();
			queuedValueRef.current = '';
			bufferRef.current?.dispose();
			bufferRef.current = null;
		};
	}, []);

	const append = useCallback(
		(value: string) => {
			if (!value) return;
			if (!usesPacing) {
				bufferRef.current?.append(value);
				setPendingCharacters(getTotalPendingCharacters());
				return;
			}

			queuedValueRef.current += value;
			setPendingCharacters(getTotalPendingCharacters());
			ensurePaceTimer();
		},
		[ensurePaceTimer, getTotalPendingCharacters, usesPacing],
	);

	const flush = useCallback(() => {
		drainQueuedValue();
		return bufferRef.current?.flush();
	}, [drainQueuedValue]);

	const complete = useCallback(() => {
		drainQueuedValue();
		return bufferRef.current?.complete();
	}, [drainQueuedValue]);

	const reset = useCallback(() => {
		clearPaceTimer();
		queuedValueRef.current = '';
		bufferRef.current?.reset();
		setHealthy('');
		setRaw('');
		setIsComplete(false);
		setPendingCharacters(0);
	}, [clearPaceTimer]);

	return {
		raw,
		healthy,
		isComplete,
		pendingCharacters,
		append,
		flush,
		complete,
		reset,
	};
}

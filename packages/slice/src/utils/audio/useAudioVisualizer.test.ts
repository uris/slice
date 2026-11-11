import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioVisualizerOptions } from '../objects/audioVisualizer/audioVisualizer';
import { useAudioVisualizer } from './useAudioVisualizer';

const instances = vi.hoisted(() => [] as { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn>; options: AudioVisualizerOptions }[]);
vi.mock('../objects/audioVisualizer/audioVisualizer', () => ({
 AudioVisualizer: class {
  start = vi.fn(); stop = vi.fn(); dispose = vi.fn();
  constructor(_source: unknown, public options: AudioVisualizerOptions) { instances.push(this); }
 },
}));
class Track extends EventTarget {
 kind = 'audio'; readyState = 'live'; stop = vi.fn();
}
class Stream { constructor(public tracks = [new Track()]) {} getAudioTracks() { return this.tracks; } }
const options = { intensityMultiplier: 2 };
beforeEach(() => { instances.length = 0; vi.stubGlobal('MediaStream', Stream); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('useAudioVisualizer', () => {
 it('reuses the analyser across pause/resume and never stops owned tracks', () => {
  const source = new Stream(); const reset = vi.fn();
  const { rerender, unmount } = renderHook(({ playing }) => useAudioVisualizer(source as unknown as MediaStream, playing, options, vi.fn(), reset), { initialProps: { playing: true } });
  expect(instances).toHaveLength(1); expect(instances[0].start).toHaveBeenCalledTimes(1);
  rerender({ playing: false }); expect(instances[0].stop).toHaveBeenCalledTimes(1);
  rerender({ playing: true }); expect(instances).toHaveLength(1); expect(instances[0].start).toHaveBeenCalledTimes(2);
  unmount(); expect(instances[0].dispose).toHaveBeenCalledTimes(1); expect(source.tracks[0].stop).not.toHaveBeenCalled();
 });
 it('replaces and cleans up the analyser when the source or settings change', () => {
  const source = new Stream();
  const { rerender } = renderHook(({ stream, settings }) => useAudioVisualizer(stream, true, settings, vi.fn(), vi.fn()), { initialProps: { stream: source as unknown as MediaStream, settings: options } });
  rerender({ stream: new Stream() as unknown as MediaStream, settings: options });
  expect(instances[0].dispose).toHaveBeenCalledTimes(1); expect(instances[1].start).toHaveBeenCalledTimes(1);
  rerender({ stream: source as unknown as MediaStream, settings: { intensityMultiplier: 4 } });
  expect(instances[1].dispose).toHaveBeenCalledTimes(1); expect(instances).toHaveLength(3);
 });
 it('uses the latest update callback without rebuilding the analyser', () => {
  const source = new Stream() as unknown as MediaStream; const first = vi.fn(); const next = vi.fn();
  const { rerender } = renderHook(({ update }) => useAudioVisualizer(source, true, options, update, vi.fn()), { initialProps: { update: first } });
  rerender({ update: next });
  act(() => instances[0].options.onUpdate?.({ intensity: 0.5, scale: 2 }));
  expect(first).not.toHaveBeenCalled(); expect(next).toHaveBeenCalledWith({ intensity: 0.5, scale: 2 }); expect(instances).toHaveLength(1);
 });
 it('resets and stops analysis when the track ends, and removes its listener', () => {
  const source = new Stream(); const reset = vi.fn(); const { unmount } = renderHook(() => useAudioVisualizer(source.tracks[0] as unknown as MediaStreamTrack, true, options, vi.fn(), reset));
  act(() => { source.tracks[0].readyState = 'ended'; source.tracks[0].dispatchEvent(new Event('ended')); });
  expect(instances[0].stop).toHaveBeenCalledTimes(1); expect(reset).toHaveBeenCalledTimes(2);
  unmount(); source.tracks[0].dispatchEvent(new Event('ended')); expect(instances[0].stop).toHaveBeenCalledTimes(1);
 });
 it.each([null, new Stream([]), new Stream([Object.assign(new Track(), { readyState: 'ended' })])])('does not start a missing or ended source', source => {
  renderHook(() => useAudioVisualizer(source as unknown as MediaStream | null, true, options, vi.fn(), vi.fn()));
  for (const instance of instances) expect(instance.start).not.toHaveBeenCalled();
 });
 it('handles startup failure and resets asynchronous failures', () => {
  const source = new Stream() as unknown as MediaStream; const reset = vi.fn();
  const { rerender } = renderHook(({ playing }) => useAudioVisualizer(source, playing, options, vi.fn(), reset), { initialProps: { playing: false } });
  instances[0].start.mockImplementation(() => { throw new Error('Unavailable'); });
  expect(() => rerender({ playing: true })).not.toThrow(); expect(instances[0].dispose).toHaveBeenCalled();
  act(() => instances[0].options.onError?.(new Error('Resume rejected'))); expect(reset).toHaveBeenCalled();
 });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { CameraSession, type CameraSessionOptions } from './cameraSession';

class Track extends EventTarget {
 enabled = true;
 readyState = 'live';
 stop = vi.fn(() => { this.readyState = 'ended'; });
 constructor(public kind: 'video' | 'audio') { super(); }
 end() { this.readyState = 'ended'; this.dispatchEvent(new Event('ended')); }
}
class Stream {
 tracks: Track[];
 constructor(video = true, audio = true) { this.tracks = [...(video ? [new Track('video')] : []), ...(audio ? [new Track('audio')] : [])]; }
 getTracks() { return this.tracks; }
 getVideoTracks() { return this.tracks.filter(track => track.kind === 'video'); }
 getAudioTracks() { return this.tracks.filter(track => track.kind === 'audio'); }
}
const asStream = (stream: Stream) => stream as unknown as MediaStream;
function deferred<T>() {
 let resolve!: (value: T) => void; let reject!: (reason: unknown) => void;
 const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
 return { promise, resolve, reject };
}
const sessions: CameraSession[] = [];
function fixture(overrides: Partial<CameraSessionOptions> = {}) {
 const options: CameraSessionOptions = { audio: true, startAudioMuted: false, playLocalAudio: false, onVideoStream: vi.fn(), onNoAudio: vi.fn(), onNoVideo: vi.fn(), ...overrides };
 const stream = new Stream(); const request = vi.fn().mockResolvedValue(asStream(stream)); const enumerate = vi.fn().mockResolvedValue([]);
 vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: request, enumerateDevices: enumerate } });
 const video = { srcObject: null as unknown, muted: false, play: vi.fn().mockResolvedValue(undefined) };
 const publish = vi.fn(); let element: typeof video | null = video;
 const session = new CameraSession(() => element as unknown as HTMLVideoElement | null, () => options, publish);
 session.activate(); sessions.push(session);
 return { session, stream, options, video, publish, request, enumerate, removeElement: () => { element = null; } };
}
afterEach(() => { for (const session of sessions.splice(0)) session.dispose(); vi.unstubAllGlobals(); });

describe('CameraSession ownership', () => {
 it('deduplicates pending starts and returns a ready stream once', async () => {
  const f = fixture(); const pending = deferred<MediaStream>(); f.request.mockReturnValue(pending.promise);
  const first = f.session.start(), second = f.session.start(); expect(first).toBe(second); expect(f.request).toHaveBeenCalledTimes(1);
  pending.resolve(asStream(f.stream)); expect(await first).toBe(f.stream);
  expect(f.options.onVideoStream).toHaveBeenCalledTimes(1); expect(f.video.srcObject).toBe(f.stream); expect(f.video.muted).toBe(true);
 });
 it.each(['stop', 'dispose'] as const)('releases a late stream after %s without publishing it', async action => {
  const f = fixture(); const pending = deferred<MediaStream>(); f.request.mockReturnValue(pending.promise);
  const result = f.session.start(); await f.session[action](); const publications = f.publish.mock.calls.length;
  pending.resolve(asStream(f.stream)); expect(await result).toEqual(new Error('Camera request was cancelled'));
  for (const track of f.stream.tracks) expect(track.stop).toHaveBeenCalledTimes(1);
  expect(f.options.onVideoStream).not.toHaveBeenCalled(); expect(f.publish).toHaveBeenCalledTimes(publications); expect(f.video.srcObject).toBeNull();
 });
 it('keeps a newer device request when the older request finishes later', async () => {
  const f = fixture(); const old = deferred<MediaStream>(); const next = new Stream(); f.request.mockReturnValueOnce(old.promise).mockResolvedValueOnce(asStream(next));
  const first = f.session.start(); f.options.sessionSettings = { videoDeviceId: 'next' }; const second = f.session.start();
  await second; old.resolve(asStream(f.stream)); await first;
  expect(f.session.stream).toBe(next); expect(f.video.srcObject).toBe(next); expect(f.stream.tracks.every(track => track.stop.mock.calls.length === 1)).toBe(true);
  expect(f.options.onVideoStream).toHaveBeenCalledTimes(1);
 });
 it('releases capture when the preview disappears before acquisition completes', async () => {
  const f = fixture(); f.removeElement(); expect(await f.session.start()).toEqual(new Error('Video element not found'));
  expect(f.stream.tracks.every(track => track.stop.mock.calls.length === 1)).toBe(true);
 });
 it('releases capture when play rejects and allows retry', async () => {
  const f = fixture(); const failure = new Error('Playback blocked'); f.video.play.mockRejectedValueOnce(failure);
  expect(await f.session.start()).toBe(failure); expect(f.video.srcObject).toBeNull(); expect(f.session.stream).toBeUndefined();
  expect(f.stream.tracks.every(track => track.stop.mock.calls.length === 1)).toBe(true);
  const next = new Stream(); f.request.mockResolvedValue(asStream(next)); expect(await f.session.start()).toBe(next);
 });
 it('stops capture while awaiting play', async () => {
  const f = fixture(); const wait = deferred<never>();
  f.video.play.mockReturnValue(wait.promise);
  const pending = f.session.start(); await vi.waitFor(() => expect(f.video.play).toHaveBeenCalled());

  await f.session.stop(); wait.resolve(undefined as never); expect(await pending).toBeInstanceOf(Error);
  expect(f.video.srcObject).toBeNull(); expect(f.options.onVideoStream).not.toHaveBeenCalled(); expect(f.stream.tracks.every(track => track.readyState === 'ended')).toBe(true);
 });
 it('ignores a rejected stale request without retrying or reporting errors', async () => {
  const f = fixture(); const pending = deferred<MediaStream>(); f.request.mockReturnValue(pending.promise);
  const result = f.session.start(); f.session.dispose(); pending.reject(new DOMException('Missing', 'NotFoundError')); await result;
  expect(f.request).toHaveBeenCalledTimes(1); expect(f.options.onNoVideo).not.toHaveBeenCalled();
 });
 it('detaches and stops owned tracks on disposal', async () => {
  const f = fixture(); await f.session.start(); f.session.dispose(); const count = f.publish.mock.calls.length;
  f.stream.tracks[0].end(); expect(f.publish).toHaveBeenCalledTimes(count); expect(f.video.srcObject).toBeNull(); expect(await f.session.start()).toBeInstanceOf(Error);
 });
});

describe('CameraSession media configuration', () => {
 it('requests only video when audio is disabled', async () => {
  const f = fixture({ audio: false, sessionSettings: { videoDeviceId: 'camera', micDeviceId: 'ignored' } }); f.request.mockResolvedValue(asStream(new Stream(true, false)));
  await f.session.start(); expect(f.request).toHaveBeenCalledWith({ video: { deviceId: { exact: 'camera' } }, audio: false }); expect(f.options.onNoAudio).not.toHaveBeenCalled();
 });
 it('uses preferred microphone IDs and initial mute state', async () => {
  const f = fixture({ startAudioMuted: true, playLocalAudio: true, sessionSettings: { micDeviceId: 'mic' } }); await f.session.start();
  expect(f.request).toHaveBeenCalledWith({ video: true, audio: { deviceId: { exact: 'mic' } } }); expect(f.stream.getAudioTracks()[0].enabled).toBe(false); expect(f.video.muted).toBe(false);
 });
 it('retries missing device constraints with default devices', async () => {
  const f = fixture(); f.request.mockRejectedValueOnce(new DOMException('Missing', 'OverconstrainedError'));
  expect(await f.session.start()).toBe(f.stream); expect(f.request).toHaveBeenNthCalledWith(2, { video: true, audio: true });
 });
 it('can fall back to video only when microphone permission is denied', async () => {
  const f = fixture(); const failure = new DOMException('Microphone denied', 'NotAllowedError'); const stream = new Stream(true, false);
  f.request.mockRejectedValueOnce(failure).mockResolvedValueOnce(asStream(stream)); expect(await f.session.start()).toBe(stream);
  expect(f.options.onNoAudio).toHaveBeenCalledWith(failure); expect(f.options.onNoVideo).not.toHaveBeenCalled();
 });
 it('falls back to the default camera for a missing preferred device during video-only recovery', async () => {
  const f = fixture({ sessionSettings: { videoDeviceId: 'missing' } });
  f.request.mockRejectedValueOnce(new Error('Mic unavailable')).mockRejectedValueOnce(new DOMException('Missing', 'NotFoundError')).mockResolvedValueOnce(asStream(new Stream(true, false)));
  expect(await f.session.start()).not.toBeInstanceOf(Error); expect(f.request).toHaveBeenNthCalledWith(3, { video: true, audio: false });
 });
 it('reports failure when both combined capture and video-only recovery fail', async () => {
  const f = fixture(); f.request.mockRejectedValue('permission denied'); expect(await f.session.start()).toEqual(new Error('Could not access the camera. Ensure permissions are correct'));
  expect(f.options.onNoVideo).toHaveBeenCalledTimes(1); expect(f.options.onNoAudio).toHaveBeenCalledTimes(1);
 });
 it('does not retry camera permission errors when audio is already disabled', async () => {
  const f = fixture({ audio: false }); const failure = new DOMException('Denied', 'NotAllowedError'); f.request.mockRejectedValue(failure);
  expect(await f.session.start()).toBe(failure); expect(f.request).toHaveBeenCalledTimes(1); expect(f.options.onNoAudio).not.toHaveBeenCalled();
 });
 it('releases audio-only results and reports a missing video track', async () => {
  const f = fixture(); const stream = new Stream(false, true); f.request.mockResolvedValue(asStream(stream));
  expect(await f.session.start()).toEqual(new Error('No video track available')); expect(stream.tracks[0].stop).toHaveBeenCalled();
 });
 it('reports missing audio but keeps a usable video stream', async () => {
  const f = fixture(); f.request.mockResolvedValue(asStream(new Stream(true, false))); await f.session.start();
  expect(f.options.onNoAudio).toHaveBeenCalledWith(new Error('No audio track available'));
 });
 it('replaces devices and preserves manually disabled video and muted audio', async () => {
  const f = fixture(); const next = new Stream(); await f.session.start(); f.session.disableVideo(); f.session.muteMic();
  f.options.sessionSettings = { videoDeviceId: 'next', micDeviceId: 'next-mic' }; f.request.mockResolvedValue(asStream(next)); f.session.reconfigure();
  await vi.waitFor(() => expect(f.session.stream).toBe(next)); await vi.waitFor(() => expect(next.getVideoTracks()[0].enabled).toBe(false));
  expect(next.getAudioTracks()[0].enabled).toBe(false); expect(f.stream.tracks.every(track => track.readyState === 'ended')).toBe(true);
 });
 it('does not acquire media for settings changes while stopped or re-enable video for callbacks', async () => {
  const f = fixture(); f.session.reconfigure(); expect(f.request).not.toHaveBeenCalled(); await f.session.start(); f.session.disableVideo();
  f.options.onVideoStream = vi.fn(); f.session.reconfigure(); expect(f.request).toHaveBeenCalledTimes(1); expect(f.session.videoTrack?.enabled).toBe(false);
  expect(await f.session.start()).toBe(f.stream); expect(f.session.videoTrack?.enabled).toBe(true); expect(f.request).toHaveBeenCalledTimes(1);
 });
 it('updates state on ended tracks and permits a new acquisition', async () => {
  const f = fixture(); await f.session.start(); f.stream.getVideoTracks()[0].end(); expect(f.publish).toHaveBeenLastCalledWith(expect.objectContaining({ cameraOn: false }));
  expect(f.session.enableVideo()).toEqual(new Error('Video track is no longer live')); const next = new Stream(); f.request.mockResolvedValue(asStream(next));
  await f.session.toggleVideo(); expect(f.session.stream).toBe(next); expect(f.stream.getAudioTracks()[0].stop).toHaveBeenCalled();
 });
 it('toggles live tracks and returns guarded errors before and after capture', async () => {
  const f = fixture(); expect(f.session.disableVideo()).toEqual(new Error('No video track found')); expect(f.session.enableVideo()).toEqual(new Error('No media stream found'));
  expect(f.session.toggleMic()).toEqual(new Error('No audio track found')); expect(await f.session.stop()).toBeInstanceOf(Error);
  await f.session.toggleVideo(); await f.session.toggleVideo(); expect(f.session.videoTrack?.enabled).toBe(false); await f.session.toggleVideo(); expect(f.session.videoTrack?.enabled).toBe(true);
  f.session.toggleMic(); expect(f.session.audioTrack?.enabled).toBe(false); f.session.toggleMic(); expect(f.session.audioTrack?.enabled).toBe(true);
  f.stream.getAudioTracks()[0].end(); expect(f.session.muteMic()).toBeInstanceOf(Error);
 });
 it('reports enumeration failure without losing the camera', async () => {
  const f = fixture(); f.enumerate.mockRejectedValue('denied'); await f.session.start(); expect(f.publish).toHaveBeenLastCalledWith(expect.objectContaining({ cameraOn: true, devices: new Error('Unknown error enumerating devices. Please try again.') }));
  const error = new Error('No devices'); f.enumerate.mockRejectedValue(error); expect(await f.session.devicesList()).toBe(error);
 });
 it('handles missing media APIs and does not publish after disposal', async () => {
  const f = fixture(); vi.stubGlobal('navigator', {}); expect(await f.session.start()).toEqual(new Error('Camera not supported'));
  expect(f.publish).toHaveBeenLastCalledWith(expect.objectContaining({ supported: false })); expect(await f.session.devicesList()).toEqual(new Error('Media devices not supported'));
  f.session.dispose(); const count = f.publish.mock.calls.length; await f.session.stop(); expect(f.publish).toHaveBeenCalledTimes(count);
 });
});

it('does not retry defaults when a constrained request is cancelled during the retry', async () => {
 const f = fixture(); const retry = deferred<MediaStream>();
 f.request.mockRejectedValueOnce(new DOMException('Missing', 'NotFoundError')).mockReturnValueOnce(retry.promise);
 const pending = f.session.start(); await vi.waitFor(() => expect(f.request).toHaveBeenCalledTimes(2));
 await f.session.stop(); retry.reject(new Error('Delayed retry failed')); await pending;
 expect(f.request).toHaveBeenCalledTimes(2); expect(f.options.onNoVideo).not.toHaveBeenCalled();
});
it('does not retry again after cancelled video-only recovery', async () => {
 const f = fixture(); const retry = deferred<MediaStream>();
 f.request.mockRejectedValueOnce(new Error('Mic denied')).mockReturnValueOnce(retry.promise);
 const pending = f.session.start(); await vi.waitFor(() => expect(f.request).toHaveBeenCalledTimes(2));
 f.session.dispose(); retry.reject(new DOMException('Missing', 'NotFoundError')); await pending;
 expect(f.request).toHaveBeenCalledTimes(2);
});
it('replaces a pending device request on reconfigure and does not resurrect a cancelled replacement', async () => {
 const f = fixture(); const first = deferred<MediaStream>(), second = deferred<MediaStream>();
 f.request.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
 const pending = f.session.start(); f.options.sessionSettings = { videoDeviceId: 'new' }; f.session.reconfigure();
 expect(f.request).toHaveBeenCalledTimes(2); await f.session.stop();
 first.resolve(asStream(f.stream)); const next = new Stream(); second.resolve(asStream(next)); await pending; await Promise.resolve();
 expect(f.session.stream).toBeUndefined(); expect(next.tracks.every(track => track.readyState === 'ended')).toBe(true);
});
it('uses fresh callbacks when a request completes without restarting capture', async () => {
 const f = fixture(); const pending = deferred<MediaStream>(); f.request.mockReturnValue(pending.promise);
 const original = f.options.onVideoStream; const result = f.session.start(); const latest = vi.fn(); f.options.onVideoStream = latest;
 pending.resolve(asStream(f.stream)); await result; expect(original).not.toHaveBeenCalled(); expect(latest).toHaveBeenCalledWith(f.stream); expect(f.request).toHaveBeenCalledTimes(1);
});
it('keeps video disabled through rapid device replacements without publishing an enabled frame', async () => {
 const f = fixture(); await f.session.start(); f.session.disableVideo(); f.session.muteMic();
 const pending = deferred<MediaStream>(); const stale = new Stream(), latest = new Stream();
 f.request.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(asStream(latest));
 f.options.sessionSettings = { videoDeviceId: 'first' }; f.session.reconfigure();
 f.options.sessionSettings = { videoDeviceId: 'second' }; f.session.reconfigure();
 await vi.waitFor(() => expect(f.session.stream).toBe(latest)); pending.resolve(asStream(stale)); await Promise.resolve(); await Promise.resolve();
 expect(latest.getVideoTracks()[0].enabled).toBe(false); expect(latest.getAudioTracks()[0].enabled).toBe(false);
 expect(stale.tracks.every(track => track.readyState === 'ended')).toBe(true);
});
it('does not publish stale device metadata over a newer stream', async () => {
 const f = fixture(); const metadata = deferred<MediaDeviceInfo[]>(); const newDevices = [{ deviceId: 'new' }] as MediaDeviceInfo[];
 f.enumerate.mockReturnValueOnce(metadata.promise).mockResolvedValueOnce(newDevices);
 const pending = f.session.start(); await vi.waitFor(() => expect(f.enumerate).toHaveBeenCalledTimes(1));
 f.options.sessionSettings = { videoDeviceId: 'new' }; f.request.mockResolvedValue(asStream(new Stream())); await f.session.start();
 metadata.resolve([{ deviceId: 'old' }] as MediaDeviceInfo[]); await pending; f.session.disableVideo();
 expect(f.publish).toHaveBeenLastCalledWith(expect.objectContaining({ devices: newDevices }));
});
it('keeps the microphone muted when restarting an ended video track', async () => {
 const f = fixture(); await f.session.start(); f.session.muteMic(); f.stream.getVideoTracks()[0].end();
 const next = new Stream(); f.request.mockResolvedValue(asStream(next)); await f.session.toggleVideo();
 expect(next.getAudioTracks()[0].enabled).toBe(false);
});

it('publishes readiness before slow device enumeration and ignores metadata after stop', async () => {
 const f = fixture(); const metadata = deferred<MediaDeviceInfo[]>(); f.enumerate.mockReturnValue(metadata.promise);
 expect(await f.session.start()).toBe(f.stream);
 expect(f.options.onVideoStream).toHaveBeenCalledWith(f.stream);
 expect(f.publish).toHaveBeenLastCalledWith(expect.objectContaining({ cameraOn: true }));
 await f.session.stop(); const publications = f.publish.mock.calls.length;
 metadata.resolve([{ deviceId: 'stale' }] as MediaDeviceInfo[]); await Promise.resolve(); await Promise.resolve();
 expect(f.publish).toHaveBeenCalledTimes(publications);
});
it('publishes device metadata later without delaying or repeating stream readiness', async () => {
 const f = fixture(); const metadata = deferred<MediaDeviceInfo[]>(); f.enumerate.mockReturnValue(metadata.promise);
 await f.session.start(); const devices = [{ deviceId: 'camera' }] as MediaDeviceInfo[];
 metadata.resolve(devices); await vi.waitFor(() => expect(f.publish).toHaveBeenLastCalledWith(expect.objectContaining({ devices })));
 expect(f.options.onVideoStream).toHaveBeenCalledTimes(1);
});
it('does not publish a stream or start device enumeration when onNoAudio stops capture', async () => {
 const f = fixture(); f.request.mockResolvedValue(asStream(new Stream(true, false)));
 f.options.onNoAudio = () => { void f.session.stop(); };
 expect(await f.session.start()).toEqual(new Error('Camera request was cancelled'));
 expect(f.options.onVideoStream).not.toHaveBeenCalled(); expect(f.enumerate).not.toHaveBeenCalled(); expect(f.video.srcObject).toBeNull();
});
it('does not report stale audio failure when onNoVideo disposes the camera', async () => {
 const f = fixture(); f.request.mockRejectedValue(new Error('Capture denied'));
 f.options.onNoVideo = () => f.session.dispose(); await f.session.start(); expect(f.options.onNoAudio).not.toHaveBeenCalled();
});
it('does not publish unchanged media state for repeated operations', async () => {
 const f = fixture(); await f.session.start(); await Promise.resolve(); const ready = f.publish.mock.calls.length;
 await f.session.start(); f.session.enableVideo(); f.session.unmuteMic(); expect(f.publish).toHaveBeenCalledTimes(ready);
 f.session.muteMic(); const muted = f.publish.mock.calls.length;
 f.session.muteMic(); expect(f.publish).toHaveBeenCalledTimes(muted);
 f.session.disableVideo(); const disabled = f.publish.mock.calls.length;
 f.session.disableVideo(); expect(f.publish).toHaveBeenCalledTimes(disabled);
 await f.session.stop(); const stopped = f.publish.mock.calls.length;
 await f.session.stop(); expect(f.publish).toHaveBeenCalledTimes(stopped);
});

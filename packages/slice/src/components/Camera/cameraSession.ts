import type { Settings } from './_types';

export interface CameraSessionOptions {
	audio: boolean;
	startAudioMuted: boolean;
	playLocalAudio: boolean;
	sessionSettings?: Settings;
	onVideoStream?: (stream: MediaStream) => void;
	onNoVideo?: (reason: Error) => void;
	onNoAudio?: (reason: Error) => void;
}
export interface CameraMediaState {
	cameraOn: boolean;
	micMuted: boolean;
	audioAvailable: boolean;
	supported: boolean;
	error?: string;
	devices: MediaDeviceInfo[] | Error;
}
const stopTracks = (stream: MediaStream) => {
	for (const track of stream.getTracks()) track.stop();
};
const isError = (reason: unknown): reason is Error =>
	reason instanceof Error || (typeof DOMException !== 'undefined' && reason instanceof DOMException);
const asError = (reason: unknown): Error =>
	isError(reason) ? reason : new Error('Could not access the camera. Ensure permissions are correct');
const constraintFailure = (reason: unknown) =>
	isError(reason) && ['NotFoundError', 'OverconstrainedError'].includes(reason.name);
const cancelled = () => new Error('Camera request was cancelled');

/** Owns only streams acquired by this Camera. Generation checks release stale results. */
export class CameraSession {
	private active = false;
	private generation = 0;
	private ownedStream?: MediaStream;
	private streamKey?: string;
	private videoEnabled = true;
	private muted?: boolean;
	private pending?: { key: string; promise: Promise<MediaStream | Error> };
	private unlisten?: () => void;
	constructor(
		private readonly video: () => HTMLVideoElement | null,
		private readonly options: () => CameraSessionOptions,
		private readonly publish: (state: CameraMediaState) => void,
	) {}
	get stream() {
		return this.ownedStream;
	}
	get videoTrack() {
		return this.stream?.getVideoTracks()[0];
	}
	get audioTrack() {
		return this.stream?.getAudioTracks()[0];
	}
	private readonly emptyDevices: MediaDeviceInfo[] = [];
	private devices: MediaDeviceInfo[] | Error = this.emptyDevices;
	private lastState?: CameraMediaState;
	private key(options: Pick<CameraSessionOptions, 'audio' | 'sessionSettings'> = this.options()) {
		const { audio, sessionSettings } = options;
		return JSON.stringify([audio, sessionSettings?.videoDeviceId, audio ? sessionSettings?.micDeviceId : undefined]);
	}
	activate() {
		this.active = true;
	}
	private emit(error?: string, supported = true) {
		if (!this.active) return;
		const video = this.videoTrack;
		const audio = this.audioTrack;
		const next: CameraMediaState = {
			cameraOn: Boolean(video?.readyState === 'live' && video.enabled),
			micMuted: audio ? !audio.enabled : this.options().startAudioMuted,
			audioAvailable: audio?.readyState === 'live',
			error,
			supported,
			devices: this.devices,
		};
		const previous = this.lastState;
		if (
			previous &&
			previous.cameraOn === next.cameraOn &&
			previous.micMuted === next.micMuted &&
			previous.audioAvailable === next.audioAvailable &&
			previous.supported === next.supported &&
			previous.error === next.error &&
			previous.devices === next.devices
		)
			return;
		this.lastState = next;
		this.publish(next);
	}
	private release() {
		this.unlisten?.();
		this.unlisten = undefined;
		const stream = this.ownedStream;
		this.ownedStream = undefined;
		this.streamKey = undefined;
		this.devices = this.emptyDevices;
		if (stream) {
			const video = this.video();
			if (video?.srcObject === stream) video.srcObject = null;
			stopTracks(stream);
		}
	}
	dispose() {
		this.active = false;
		this.generation++;
		this.pending = undefined;
		this.release();
	}
	async stop(): Promise<boolean | Error> {
		const hadMedia = Boolean(this.ownedStream || this.pending);
		this.generation++;
		this.pending = undefined;
		this.release();
		this.muted = undefined;
		this.videoEnabled = true;
		this.emit();
		return hadMedia ? true : new Error('No media stream to stop');
	}
	private async refreshDevices(valid: () => boolean) {
		const devices = await this.devicesList();
		if (!valid()) return;
		this.devices = Array.isArray(devices) && devices.length === 0 ? this.emptyDevices : devices;
		this.emit();
	}
	async devicesList(): Promise<MediaDeviceInfo[] | Error> {
		if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices)
			return new Error('Media devices not supported');
		try {
			return await navigator.mediaDevices.enumerateDevices();
		} catch (reason) {
			return reason instanceof Error ? reason : new Error('Unknown error enumerating devices. Please try again.');
		}
	}
	private async request(
		options: CameraSessionOptions,
		valid: () => boolean,
	): Promise<{ stream: MediaStream; audioError?: Error }> {
		const videoId = options.sessionSettings?.videoDeviceId;
		const micId = options.sessionSettings?.micDeviceId;
		const video = videoId ? { deviceId: { exact: videoId } } : true;
		const audio = options.audio && (micId ? { deviceId: { exact: micId } } : true);
		let failure: unknown;
		try {
			return { stream: await navigator.mediaDevices.getUserMedia({ video, audio }) };
		} catch (error) {
			failure = error;
		}
		if (!valid()) throw cancelled();
		if (constraintFailure(failure)) {
			try {
				return { stream: await navigator.mediaDevices.getUserMedia({ video: true, audio: options.audio }) };
			} catch (error) {
				failure = error;
			}
		}
		if (!valid()) throw cancelled();
		if (!options.audio) throw failure;
		// Camera access can still work when the microphone is unavailable or denied.
		try {
			return {
				stream: await navigator.mediaDevices.getUserMedia({ video, audio: false }),
				audioError: asError(failure),
			};
		} catch (error) {
			if (!valid()) throw cancelled();
			if (!constraintFailure(error)) throw error;
			return {
				stream: await navigator.mediaDevices.getUserMedia({ video: true, audio: false }),
				audioError: asError(failure),
			};
		}
	}
	start(preserveTrackState = false): Promise<MediaStream | Error> {
		if (!this.active) return Promise.resolve(cancelled());
		const key = this.key();
		if (this.pending?.key === key) return this.pending.promise;
		if (this.ownedStream && this.streamKey === key && this.videoTrack?.readyState === 'live') {
			this.enableVideo();
			return Promise.resolve(this.ownedStream);
		}
		const options = this.options();
		if (!preserveTrackState) {
			this.videoEnabled = true;
		}
		this.muted ??= options.startAudioMuted;
		const captureOptions = { ...options, startAudioMuted: this.muted };
		const generation = ++this.generation;
		this.release();
		this.emit();
		const valid = () => this.active && this.generation === generation;
		const promise = this.acquire(captureOptions, key, valid).finally(() => {
			if (this.pending?.promise === promise) this.pending = undefined;
		});
		this.pending = { key, promise };
		return promise;
	}
	/** Device changes replace active/pending capture, without undoing manual video-off state. */
	reconfigure(options: Pick<CameraSessionOptions, 'audio' | 'sessionSettings'> = this.options()) {
		if (!this.ownedStream && !this.pending) return;
		if ((this.pending?.key ?? this.streamKey) === this.key(options)) return;
		void this.start(true);
	}
	private async acquire(
		options: CameraSessionOptions,
		key: string,
		valid: () => boolean,
	): Promise<MediaStream | Error> {
		let candidate: MediaStream | undefined;
		try {
			if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
				const error = new Error('Camera not supported');
				this.emit(error.message, false);
				this.options().onNoVideo?.(error);
				if (valid() && options.audio) this.options().onNoAudio?.(error);
				return error;
			}
			const result = await this.request(options, valid);
			candidate = result.stream;
			if (!valid()) {
				stopTracks(candidate);
				return cancelled();
			}
			const videoTrack = candidate.getVideoTracks()[0];
			if (!videoTrack || videoTrack.readyState !== 'live') throw new Error('No video track available');
			const video = this.video();
			if (!video) throw new Error('Video element not found');
			const audio = candidate.getAudioTracks()[0];
			if (audio) audio.enabled = !options.startAudioMuted;
			videoTrack.enabled = this.videoEnabled;
			this.ownedStream = candidate;
			this.streamKey = key;
			video.muted = !this.options().playLocalAudio;
			video.srcObject = candidate;
			await video.play();
			if (!valid()) return cancelled();
			const changed = () => this.emit();
			for (const track of candidate.getTracks()) track.addEventListener('ended', changed);
			const attached = candidate;
			this.unlisten = () => {
				for (const track of attached.getTracks()) track.removeEventListener('ended', changed);
			};
			this.emit();
			if (!valid()) return cancelled();
			if (options.audio && (!audio || result.audioError))
				this.options().onNoAudio?.(result.audioError ?? new Error('No audio track available'));
			if (!valid()) return cancelled();
			this.options().onVideoStream?.(candidate);
			if (!valid()) return cancelled();
			void this.refreshDevices(valid);
			return candidate;
		} catch (reason) {
			if (!valid()) {
				if (candidate && candidate !== this.ownedStream) stopTracks(candidate);
				return cancelled();
			}
			if (candidate === this.ownedStream) this.release();
			else if (candidate) stopTracks(candidate);
			const error = asError(reason);
			this.emit(error.message);
			this.options().onNoVideo?.(error);
			if (valid() && options.audio) this.options().onNoAudio?.(error);
			return error;
		}
	}
	disableVideo(): boolean | Error {
		const track = this.videoTrack;
		if (!track) return new Error('No video track found');
		this.videoEnabled = false;
		track.enabled = false;
		this.emit();
		return true;
	}
	enableVideo(): MediaStream | Error {
		if (!this.stream) return new Error('No media stream found');
		const track = this.videoTrack;
		if (!track) return new Error('No video track found');
		if (track.readyState !== 'live') {
			this.emit();
			return new Error('Video track is no longer live');
		}
		this.videoEnabled = true;
		track.enabled = true;
		this.emit();
		return this.stream;
	}
	muteMic(): boolean | Error {
		return this.setMuted(true);
	}
	unmuteMic(): boolean | Error {
		return this.setMuted(false);
	}
	private setMuted(muted: boolean): boolean | Error {
		const track = this.audioTrack;
		if (!track || track.readyState !== 'live') return new Error('No audio track found');
		this.muted = muted;
		track.enabled = !muted;
		this.emit();
		return true;
	}
	toggleMic(): boolean | Error {
		return this.audioTrack?.enabled ? this.muteMic() : this.unmuteMic();
	}
	async toggleVideo(): Promise<MediaStream | boolean | Error> {
		if (!this.stream || this.videoTrack?.readyState !== 'live') return this.start();
		return this.videoTrack.enabled ? this.disableVideo() : this.enableVideo();
	}
}

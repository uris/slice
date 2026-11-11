type AudioVisualizerSource = MediaStream | MediaStreamTrack;

type AudioVisualizerOptions = {
	fftSize?: number;
	onError?: (error: unknown) => void;
	intensityMultiplier?: number;
	maxScale?: number;
	minScale?: number;
	onUpdate?: (state: { intensity: number; scale: number }) => void;
	peakIntensity?: number;
	releasePerSecond?: number;
	risePerSecond?: number;
};

const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const moveTowards = (current: number, target: number, maxDelta: number) => {
	if (target > current) {
		return Math.min(current + maxDelta, target);
	}
	return Math.max(current - maxDelta, target);
};

const toMediaStream = (source: AudioVisualizerSource): MediaStream => {
	if (source instanceof MediaStream) return source;
	return new MediaStream([source]);
};

const positive = (value: number | undefined, fallback: number) => {
	return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
};

export class AudioVisualizer {
	private readonly fftSize: number;
	private readonly onError?: (error: unknown) => void;
	private readonly intensityMultiplier: number;
	private readonly maxScale: number;
	private readonly minScale: number;
	private readonly onUpdate?: (state: {
		intensity: number;
		scale: number;
	}) => void;
	private readonly peakIntensity: number;
	private readonly releasePerSecond: number;
	private readonly risePerSecond: number;
	private readonly source: AudioVisualizerSource;

	private analyser: AnalyserNode | null = null;
	private animationFrameId: number | null = null;
	private audioContext: AudioContext | null = null;
	private currentIntensity = 0;
	private runId = 0;
	private lastFrameTime = 0;
	private sourceNode: MediaStreamAudioSourceNode | null = null;
	private timeDomainData: Uint8Array<ArrayBuffer> | null = null;

	constructor(source: AudioVisualizerSource, options: AudioVisualizerOptions = {}) {
		this.source = source;
		this.onError = options.onError;
		this.fftSize = 2 ** Math.round(Math.log2(clamp(positive(options.fftSize, 512), 32, 32768)));
		this.intensityMultiplier = positive(options.intensityMultiplier, 2.2);
		this.maxScale = Math.max(positive(options.minScale, 1), positive(options.maxScale, 2));
		this.minScale = positive(options.minScale, 1);
		this.onUpdate = options.onUpdate;
		this.peakIntensity = positive(options.peakIntensity, 0.2);
		this.releasePerSecond = positive(options.releasePerSecond, 1.5);
		this.risePerSecond = positive(options.risePerSecond, 4);
	}

	public start() {
		if (typeof window === 'undefined' || typeof AudioContext === 'undefined') {
			throw new Error('AudioVisualizer requires a browser AudioContext');
		}

		if (this.animationFrameId !== null) return;

		try {
			if (!this.audioContext) {
				this.audioContext = new AudioContext();
				this.analyser = this.audioContext.createAnalyser();
				this.analyser.fftSize = this.fftSize;
				this.sourceNode = this.audioContext.createMediaStreamSource(toMediaStream(this.source));
				this.sourceNode.connect(this.analyser);
				this.timeDomainData = new Uint8Array(new ArrayBuffer(this.analyser.fftSize));
			}
		} catch (error) {
			this.dispose();
			throw error;
		}

		const context = this.audioContext;
		const runId = ++this.runId;
		void context.resume().catch((error: unknown) => {
			if (this.audioContext !== context || this.runId !== runId || this.animationFrameId === null) return;
			this.stop();
			this.onUpdate?.({ intensity: 0, scale: this.minScale });
			this.onError?.(error);
		});
		this.lastFrameTime = performance.now();
		this.animationFrameId = requestAnimationFrame(this.onFrame);
	}

	public stop() {
		this.runId++;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.currentIntensity = 0;
		void this.audioContext?.suspend().catch(() => undefined);
	}

	public dispose() {
		this.stop();
		this.sourceNode?.disconnect();
		this.analyser?.disconnect();
		void this.audioContext?.close().catch(() => undefined);
		this.sourceNode = null;
		this.analyser = null;
		this.audioContext = null;
		this.timeDomainData = null;
		this.currentIntensity = 0;
		this.lastFrameTime = 0;
	}

	public getIntensity() {
		return this.currentIntensity;
	}

	public getScale() {
		return this.minScale + this.currentIntensity * (this.maxScale - this.minScale);
	}

	private readonly onFrame = (now: number) => {
		if (!this.analyser || !this.timeDomainData) return;

		this.analyser.getByteTimeDomainData(this.timeDomainData);

		let sum = 0;
		for (const sample of this.timeDomainData) {
			const normalized = (sample - 128) / 128;
			sum += normalized * normalized;
		}

		const rms = Math.sqrt(sum / this.timeDomainData.length);
		const targetIntensity = clamp((rms * this.intensityMultiplier) / this.peakIntensity, 0, 1);
		const deltaSeconds = Math.max((now - this.lastFrameTime) / 1000, 0);
		const stepPerSecond = targetIntensity > this.currentIntensity ? this.risePerSecond : this.releasePerSecond;

		this.currentIntensity = moveTowards(this.currentIntensity, targetIntensity, stepPerSecond * deltaSeconds);
		this.lastFrameTime = now;

		this.onUpdate?.({
			intensity: this.currentIntensity,
			scale: this.getScale(),
		});

		if (this.animationFrameId !== null) this.animationFrameId = requestAnimationFrame(this.onFrame);
	};
}

export type { AudioVisualizerOptions, AudioVisualizerSource };

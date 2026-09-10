import type { WebRTCConnectionOptions } from './_types';

export class WebRTCConnection {
	private readonly peerConnection!: RTCPeerConnection;
	private RTCSenderAudioTrack: MediaStreamTrack | null = null;
	private readonly RTCSenderVideoTrack?: MediaStreamTrack | null = null;
	private RTCSenderAudioSender: RTCRtpSender | null = null;
	private readonly RTCSenderAudioStream: MediaStream = new MediaStream();
	private RTCScreenShareTrack: MediaStreamTrack | null = null;
	private RTCScreenShareSender: RTCRtpSender | null = null;
	private readonly RTCReceiverAudioStream: MediaStream = new MediaStream();
	private readonly RTCReceiverVideoTracks: Map<string, MediaStream> = new Map();
	private readonly RTCReceiverAudioTracks: Map<string, MediaStreamTrack> = new Map();
	private readonly RTCDataChannels: RTCDataChannel[] = [];
	private readonly connectionUrl: string = '';
	private connectionOffer: RTCSessionDescriptionInit | null = null;
	private readonly audioElement!: HTMLAudioElement;
	private readonly autoPlayAudio: boolean = true;
	private readonly onRemoteAudioStream?: (streams: Map<string, MediaStream>) => void;
	private readonly onRemoteVideoStream?: (streams: Map<string, MediaStream>) => void;
	private readonly onDataChannelEvent?: (
		channel: string,
		eventType: 'message' | 'open' | 'close' | 'error',
		event: MessageEvent | Event | RTCErrorEvent,
	) => void;
	private iceTimer?: NodeJS.Timeout | null = null;
	private offerOptions?: RTCOfferOptions;
	private bearerToken?: string;

	/**
	 * Report whether the peer connection is currently connected
	 */
	public get connected() {
		return this.peerConnection.connectionState === 'connected';
	}

	/**
	 * Report whether the connection currently has an audio path attached
	 */
	public get audioConnected() {
		const hasLocalAudioTrack = this.RTCSenderAudioSender?.track?.readyState === 'live';
		const hasRemoteAudioTrack = this.RTCReceiverAudioTracks.size > 0;
		return Boolean(hasLocalAudioTrack || hasRemoteAudioTrack);
	}

	/**
	 * Report whether the connection currently has a video path attached
	 */
	public get videoConnected() {
		const hasLocalVideoTrack =
			this.RTCSenderVideoTrack?.readyState === 'live' || this.RTCScreenShareTrack?.readyState === 'live';
		const hasRemoteVideoTrack = this.RTCReceiverVideoTracks.size > 0;
		return Boolean(hasLocalVideoTrack || hasRemoteVideoTrack);
	}

	/**
	 * Report whether any data channel is currently open
	 */
	public get dataConnected() {
		return this.RTCDataChannels.some((channel) => channel.readyState === 'open');
	}

	/**
	 * Create the base instance
	 */
	constructor(rtcConnectionInfo: WebRTCConnectionOptions) {
		// guard for browser use only
		if (!globalThis.document) {
			throw new Error('RTC needs a valid browser environment');
		}

		this.connectionUrl = rtcConnectionInfo.connectionUrl ?? '';
		this.peerConnection = new RTCPeerConnection();
		this.RTCSenderAudioTrack = rtcConnectionInfo.micStream?.getAudioTracks()[0] ?? rtcConnectionInfo.micTrack ?? null;
		if (!this.RTCSenderAudioTrack) {
			throw new Error('WebRTCConnection requires a microphone stream or track');
		}
		this.RTCSenderVideoTrack = rtcConnectionInfo.videoTrack;
		this.audioElement = rtcConnectionInfo.audioElement ?? document.createElement('audio');
		this.autoPlayAudio = rtcConnectionInfo.autoPlayAudio ?? true;
		const channels = rtcConnectionInfo.dataChannels ?? [];
		this.onRemoteVideoStream = rtcConnectionInfo.onRemoteVideoStream;
		this.onRemoteAudioStream = rtcConnectionInfo.onRemoteAudioStream;
		this.onDataChannelEvent = rtcConnectionInfo.onDataChannelEvent;

		// set up to play audio from the incoming stream
		this.setupIncomingAudioStream();
		if (typeof rtcConnectionInfo.volume === 'number') {
			this.setVolume(rtcConnectionInfo.volume);
		}

		// set up an outgoing stream with mic and video tracks
		this.setupOutgoingMediaStream();

		// setup any data channels
		this.setupDataChannels(channels);

		// set up listeners for data channel events
		this.setupDataChannelEventListeners();

		// listen to track event and handle audio/video streams
		this.peerConnection.ontrack = this.onTrack.bind(this);
	}

	/**
	 * Initialize the RTC connection
	 */
	public async initialize(offerOptions?: RTCOfferOptions, bearerToken?: string): Promise<void> {
		this.offerOptions = offerOptions;
		this.bearerToken = bearerToken;
		await this.negotiate();
	}

	/**
	 * Start an optional screen share stream and renegotiate if already connected
	 */
	public async startScreenShare(): Promise<void> {
		if (!globalThis.navigator?.mediaDevices?.getDisplayMedia) {
			throw new Error('Screen share is not supported in this browser');
		}

		if (this.RTCScreenShareSender) {
			return;
		}

		const displayStream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: false,
		});
		const screenTrack = displayStream.getVideoTracks()[0];

		if (!screenTrack) {
			throw new Error('No screen share video track was provided');
		}

		const screenShareStream = new MediaStream([screenTrack]);
		this.RTCScreenShareTrack = screenTrack;
		this.RTCScreenShareSender = this.peerConnection.addTrack(screenTrack, screenShareStream);

		screenTrack.addEventListener('ended', () => {
			void this.stopScreenShare(false);
		});

		if (this.peerConnection.remoteDescription) {
			await this.negotiate();
		}
	}

	/**
	 * Stop the optional screen share stream and renegotiate if already connected
	 */
	public async stopScreenShare(stopTrack = true): Promise<void> {
		if (this.RTCScreenShareSender) {
			this.peerConnection.removeTrack(this.RTCScreenShareSender);
			this.RTCScreenShareSender = null;
		}

		if (stopTrack && this.RTCScreenShareTrack) {
			this.RTCScreenShareTrack.stop();
		}

		this.RTCScreenShareTrack = null;

		if (this.peerConnection.remoteDescription) {
			await this.negotiate();
		}
	}

	/**
	 * Create an offer, wait for ICE gathering, POST SDP, and apply the answer
	 */
	private async negotiate(): Promise<void> {
		// guard for valid connection and url to send sdp
		if (!this.peerConnection) {
			throw new Error('Peer connection not initialized');
		}
		if (!this.connectionUrl) {
			throw new Error('Peer connection url not provided');
		}

		// get the connection offer
		this.connectionOffer = await this.peerConnection.createOffer(this.offerOptions);
		await this.peerConnection.setLocalDescription(this.connectionOffer);

		// await ofr ICE gathering to be complete
		await this.waitForIceGathering();

		// create the headers with an optional authorization bearer token
		const headers: RequestInit['headers'] = {
			'Content-Type': 'application/sdp',
		};
		if (this.bearerToken && this.bearerToken !== '') {
			headers.Authorization = `Bearer ${this.bearerToken}`;
		}

		// send the connection offer to the other client/server and get a response
		const sdpResponse = await fetch(this.connectionUrl, {
			method: 'POST',
			body: this.connectionOffer?.sdp,
			headers,
		});

		// guard for valid response
		if (!sdpResponse.ok)
			throw new Error(
				`Failed to send connection offer to ${this.connectionUrl}. Status: ${sdpResponse.status} ${sdpResponse.statusText}`,
			);

		// set the reply to the sdp response
		const sdpReply: RTCSessionDescriptionInit = {
			type: 'answer',
			sdp: await sdpResponse.text(),
		};

		// set the remote description
		await this.peerConnection.setRemoteDescription(sdpReply);
	}

	/**
	 * Send a JSON-serializable payload over a named data channel
	 */
	public sendMessage(channelName: string, data: string | number | boolean | object | null): void {
		const channel = this.RTCDataChannels.find((dataChannel) => dataChannel.label === channelName);

		if (!channel) {
			throw new Error(`Data channel "${channelName}" not found`);
		}

		if (channel.readyState !== 'open') {
			throw new Error(`Data channel "${channelName}" is not open. Current state: ${channel.readyState}`);
		}

		channel.send(JSON.stringify(data));
	}

	/**
	 * Mute or unmute all incoming audio playback
	 */
	public muteAllAudio(muted: boolean): void {
		this.audioElement.muted = muted;
	}

	/**
	 * Mute or unmute a specific incoming audio track
	 */
	public muteAudioTrack(trackId: string, muted: boolean): void {
		const track = this.RTCReceiverAudioTracks.get(trackId);

		if (!track) {
			throw new Error(`Audio track "${trackId}" not found`);
		}

		track.enabled = !muted;
	}

	/**
	 * Set the playback volume for the incoming audio element
	 */
	public setVolume(volume: number): void {
		this.audioElement.volume = Math.max(0, Math.min(1, volume));
	}

	/**
	 * Replace the outgoing audio source with the first track from a stream
	 */
	public async setOutgoingAudioStream(stream: MediaStream | null): Promise<void> {
		await this.replaceAudioTrack(stream?.getAudioTracks()[0] ?? null);
	}

	/**
	 * Replace the outgoing audio track without rebuilding the peer connection
	 */
	public async replaceAudioTrack(track: MediaStreamTrack | null): Promise<void> {
		this.RTCSenderAudioTrack = track;
		this.syncSenderAudioStream(track);

		if (this.RTCSenderAudioSender) {
			await this.RTCSenderAudioSender.replaceTrack(track);
			return;
		}

		if (!track) {
			return;
		}

		this.RTCSenderAudioSender = this.peerConnection.addTrack(track, this.RTCSenderAudioStream);

		if (this.peerConnection.remoteDescription) {
			await this.negotiate();
		}
	}

	/**
	 * Close the peer connection and release local media bindings
	 */
	public close(): void {
		if (this.iceTimer) {
			clearTimeout(this.iceTimer);
			this.iceTimer = null;
		}

		if (this.RTCScreenShareSender) {
			this.peerConnection.removeTrack(this.RTCScreenShareSender);
			this.RTCScreenShareSender = null;
		}

		if (this.RTCSenderAudioSender) {
			this.peerConnection.removeTrack(this.RTCSenderAudioSender);
			this.RTCSenderAudioSender = null;
		}

		this.RTCScreenShareTrack = null;
		this.RTCSenderAudioTrack = null;
		this.audioElement.srcObject = null;
		this.peerConnection.close();
	}

	/**
	 * Create an audio source node from the unified incoming audio stream
	 */
	public createIncomingAudioSource(audioContext: AudioContext): MediaStreamAudioSourceNode {
		return audioContext.createMediaStreamSource(this.RTCReceiverAudioStream);
	}

	/**
	 * Handle track events adding them to the unified audio and video streams
	 */
	private onTrack(event: RTCTrackEvent) {
		// guard for stream
		if (!event.streams[0]) return;

		// add video streams to the receiver video stream map
		if (event.track.kind === 'video') {
			const stream = event.streams[0];
			const id = stream.id;
			const existing = this.RTCReceiverVideoTracks.has(id);
			if (!existing) {
				this.RTCReceiverVideoTracks.set(id, stream);
				this.onRemoteVideoStream?.(this.RTCReceiverVideoTracks);
			}
		}

		// add audio tracks to the unified audio stream
		if (event.track.kind === 'audio') {
			const id = event.track.id;
			const existing = this.RTCReceiverAudioTracks.has(id);
			if (!existing) {
				this.RTCReceiverAudioStream.addTrack(event.track);
				this.RTCReceiverAudioTracks.set(id, event.track);
				this.onRemoteAudioStream?.(new Map([[this.RTCReceiverAudioStream.id, this.RTCReceiverAudioStream]]));
			}
		}
	}

	/**
	 * Create a local audio element and set its source to the rtc incoming media stream
	 */
	private setupIncomingAudioStream(): void {
		this.audioElement.autoplay = this.autoPlayAudio;
		this.audioElement.srcObject = this.RTCReceiverAudioStream;
	}

	/**
	 * Set up a local stream with mic and video tracks and add to peer connection
	 */
	private setupOutgoingMediaStream(): void {
		if (this.RTCSenderAudioTrack) {
			this.syncSenderAudioStream(this.RTCSenderAudioTrack);
			this.RTCSenderAudioSender = this.peerConnection.addTrack(this.RTCSenderAudioTrack, this.RTCSenderAudioStream);
		}
		if (this.RTCSenderVideoTrack) {
			const senderStream = new MediaStream([this.RTCSenderVideoTrack]);
			this.peerConnection.addTrack(this.RTCSenderVideoTrack, senderStream);
		}
	}

	/**
	 * Keep the sender stream aligned to the current local audio track
	 */
	private syncSenderAudioStream(track: MediaStreamTrack | null): void {
		for (const currentTrack of this.RTCSenderAudioStream.getAudioTracks()) {
			this.RTCSenderAudioStream.removeTrack(currentTrack);
		}

		if (track) {
			this.RTCSenderAudioStream.addTrack(track);
		}
	}

	/**
	 * Setup data channels
	 */
	private setupDataChannels(channels: string | string[]): void {
		const channelsArray = Array.isArray(channels) ? channels : [channels];
		if (channelsArray.length > 0) {
			for (const channel of channelsArray) {
				const dataChannel = this.peerConnection.createDataChannel(channel);
				this.RTCDataChannels.push(dataChannel);
			}
		}
	}

	/**
	 * Add listeners for data events and push through callback
	 */
	private setupDataChannelEventListeners() {
		for (const channel of this.RTCDataChannels) {
			const channelName = channel.label;
			channel.addEventListener('message', (event: MessageEvent) => {
				this.onDataChannelEvent?.(channelName, 'message', event);
			});
			channel.addEventListener('open', (event) => {
				this.onDataChannelEvent?.(channelName, 'open', event);
			});
			channel.addEventListener('close', (event) => {
				this.onDataChannelEvent?.(channelName, 'close', event);
			});
			channel.addEventListener('error', (event) => {
				this.onDataChannelEvent?.(channelName, 'error', event);
			});
		}
	}

	/**
	 * Wait for the ICE gathering to be complete
	 */
	private async waitForIceGathering(): Promise<void> {
		if (this.peerConnection.iceGatheringState === 'complete') {
			return;
		}

		return new Promise((resolve, reject) => {
			const handleStateChange = () => {
				if (this.peerConnection.iceGatheringState === 'complete') {
					if (this.iceTimer) clearTimeout(this.iceTimer);
					this.iceTimer = null;
					this.peerConnection.removeEventListener('icegatheringstatechange', handleStateChange);
					resolve();
				}
			};

			this.peerConnection.addEventListener('icegatheringstatechange', handleStateChange);

			this.iceTimer = setTimeout(() => {
				this.peerConnection.removeEventListener('icegatheringstatechange', handleStateChange);
				this.iceTimer = null;
				reject(new Error('ICE gathering timed out'));
			}, 5000);
		});
	}
}

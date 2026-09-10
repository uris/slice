'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { addOpacity } from '../../utils';
import { accessibleKeyDown } from '../../utils/functions/misc';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import css from './Camera.module.css';
import type {
	CameraElement,
	CameraProps,
	CameraSnapshotOptions,
	DefaultNoVideoPosterProps,
	ToolbarButtonProps,
} from './_types';

export const Camera = React.memo(
	React.forwardRef<CameraElement, CameraProps>((props, ref) => {
		const videoElement = useRef<HTMLVideoElement>(null);
		const containerElement = useRef<HTMLDivElement>(null);
		const controlsTimer = useRef<NodeJS.Timeout | null>(null);
		const {
			noVideoPoster,
			width,
			height,
			showControlBar = true,
			autoHideControlBar = true,
			startCameraOff = false,
			startAudioMuted = false,
			playLocalAudio = false,
			pipSnapshot = true,
			userProfile,
			sessionSettings,
			onChangeProfile,
			onChangeSettings,
			onSnapshot,
			onVideoStream,
			onNoVideo,
			onNoAudio,
		} = props;
		const theme = useTheme();
		const [cameraSupport, setCameraSupport] = useState<boolean | undefined>(undefined);
		const [cameraError, setCameraError] = useState<string | undefined>(undefined);
		const [hovered, setHovered] = useState<boolean>(false);
		const [cameraOn, setCameraOn] = useState<boolean>(false);
		const [micMuted, setMicMuted] = useState<boolean>(startAudioMuted);
		const [snapshot, setSnapshot] = useState<string | undefined>(undefined);
		const [settings, setSettings] = useState<boolean>(false);
		const [profile, setProfile] = useState<boolean>(false);
		const [deviceList, setDeviceList] = useState<MediaDeviceInfo[] | Error>([]);

		// resolve camera and microphone constraints from the current session settings
		const constraints = useMemo<MediaStreamConstraints>(() => {
			const videoDeviceId = sessionSettings?.videoDeviceId;
			const micDeviceId = sessionSettings?.micDeviceId;
			return {
				video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
				audio: micDeviceId ? { deviceId: { exact: micDeviceId } } : true,
			};
		}, [sessionSettings?.micDeviceId, sessionSettings?.videoDeviceId]);

		// read the current media stream from the video element when available
		const getStream = useCallback(() => {
			const srcObject = videoElement.current?.srcObject;
			if (!srcObject) return undefined;
			if (typeof MediaStream !== 'undefined' && srcObject instanceof MediaStream) {
				return srcObject;
			}
			const possibleStream = srcObject as Partial<MediaStream>;
			if (
				typeof possibleStream.getTracks === 'function' &&
				typeof possibleStream.getVideoTracks === 'function' &&
				typeof possibleStream.getAudioTracks === 'function'
			) {
				return possibleStream as MediaStream;
			}
			return undefined;
		}, []);

		// read the active video or audio track from the current stream
		const getTrack = useCallback(
			(type: 'video' | 'audio') => {
				const stream = getStream();
				if (!stream) return undefined;
				if (type === 'video') return stream.getVideoTracks()[0] ?? undefined;
				return stream.getAudioTracks()[0] ?? undefined;
			},
			[getStream],
		);

		// enumerate available media devices with a safe error fallback
		const getMediaDevices = useCallback(async () => {
			if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices)
				return new Error('Media devices not supported');
			return await navigator.mediaDevices.enumerateDevices().catch((error) => {
				const defaultError = new Error('Unknown error enumerating devices. Please try again.');
				return error instanceof Error ? error : defaultError;
			});
		}, []);

		// determine whether the browser can access camera APIs at all
		const hasMediaSupport = useMemo(() => {
			if (typeof navigator === 'undefined') return false;
			return Boolean(navigator.mediaDevices?.getUserMedia);
		}, []);

		// sync camera and microphone UI state from the active stream tracks
		const syncMediaState = useCallback(() => {
			const stream = getStream();
			const videoTrack = stream?.getVideoTracks()[0];
			const audioTrack = stream?.getAudioTracks()[0];
			setCameraOn(Boolean(videoTrack?.readyState === 'live' && videoTrack.enabled));
			setMicMuted(audioTrack ? !audioTrack.enabled : startAudioMuted);
		}, [getStream, startAudioMuted]);

		// capture the current video frame into a PNG blob
		const takeSnapshot = useCallback((options?: CameraSnapshotOptions) => {
			if (!videoElement.current) return undefined;
			const width = options?.width ?? videoElement.current.videoWidth;
			const height = options?.height ?? videoElement.current.videoHeight;
			if (!width || !height) return undefined;
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext('2d');
			if (!context) return undefined;
			context.drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);
			const url = canvas.toDataURL('image/png');
			const [header, data] = url.split(',');
			if (!header || !data) return undefined;
			const mimeType = new RegExp(/data:(.*?);base64/).exec(header)?.[1] ?? 'image/png';
			const binary = atob(data);
			const bytes = new Uint8Array(binary.length);
			for (let index = 0; index < binary.length; index += 1) {
				bytes[index] = binary.codePointAt(index) as number;
			}
			return new Blob([bytes], { type: mimeType });
		}, []);

		// capture a snapshot, update local preview state, and notify consumers
		const handleSnapshot = useCallback(
			(options?: CameraSnapshotOptions) => {
				if (options?.toggle && !!snapshot) {
					setSnapshot(undefined);
					return undefined;
				}
				const photo = takeSnapshot(options);
				onSnapshot?.(photo);
				setSnapshot((previousSnapshot) => {
					if (previousSnapshot) URL.revokeObjectURL(previousSnapshot);
					return photo ? URL.createObjectURL(photo) : undefined;
				});
				return photo;
			},
			[onSnapshot, takeSnapshot, snapshot],
		);

		// disable the live microphone track
		const muteMic = useCallback(() => {
			const audioTrack = getTrack('audio');
			if (!audioTrack) return new Error('No audio track found');
			audioTrack.enabled = false;
			setMicMuted(true);
			return true;
		}, [getTrack]);

		// enable the live microphone track
		const unmuteMic = useCallback(() => {
			const audioTrack = getTrack('audio');
			if (!audioTrack) return new Error('No audio track found');
			audioTrack.enabled = true;
			setMicMuted(false);
			return true;
		}, [getTrack]);

		// toggle the microphone between muted and unmuted states
		const toggleMic = useCallback(() => {
			const audioTrack = getTrack('audio');
			if (!audioTrack) return new Error('No audio track found');
			return audioTrack.enabled ? muteMic() : unmuteMic();
		}, [getTrack, muteMic, unmuteMic]);

		// disable video while keeping the existing stream alive
		const disableVideo = useCallback(() => {
			const videoTrack = getTrack('video');
			if (!videoTrack) return new Error('No video track found');
			videoTrack.enabled = false;
			setCameraOn(false);
			return true;
		}, [getTrack]);

		// re-enable the current video track without requesting a new stream
		const enableVideo = useCallback(() => {
			const stream = getStream();
			if (!stream) return new Error('No media stream found');
			const videoTrack = getTrack('video');
			if (!videoTrack) return new Error('No video track found');
			if (videoTrack.readyState !== 'live') return new Error('Video track is no longer live');
			videoTrack.enabled = true;
			setCameraOn(true);
			return stream;
		}, [getStream, getTrack]);

		// mark the camera as ready after a usable stream is attached
		const markCameraReady = useCallback(() => {
			setCameraSupport(true);
			setCameraError(undefined);
			syncMediaState();
		}, [syncMediaState]);

		// reuse an existing live stream instead of requesting a new one
		const reuseExistingStream = useCallback(() => {
			const existingStream = getStream();
			const existingVideoTrack = existingStream?.getVideoTracks()[0];
			if (existingVideoTrack?.readyState === 'live' && !existingVideoTrack.enabled) {
				const enabledStream = enableVideo();
				if (enabledStream instanceof Error) return enabledStream;
				onVideoStream?.(enabledStream);
				markCameraReady();
				return enabledStream;
			}
			if (existingStream?.active && existingVideoTrack?.readyState === 'live') {
				markCameraReady();
				return existingStream;
			}
			return undefined;
		}, [enableVideo, getStream, markCameraReady, onVideoStream]);

		// request a media stream and fall back to generic constraints if needed
		const requestMediaStream = useCallback(async () => {
			try {
				return await navigator.mediaDevices.getUserMedia(constraints);
			} catch (error) {
				const shouldRetry =
					(error instanceof DOMException && error.name === 'OverconstrainedError') ||
					(error instanceof DOMException && error.name === 'NotFoundError');
				if (!shouldRetry) throw error;
				return await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
			}
		}, [constraints]);

		// attach a stream to the video element and sync device metadata
		const attachStreamToVideo = useCallback(
			async (stream: MediaStream) => {
				const audioTrack = stream.getAudioTracks()[0];
				const videoTrack = stream.getVideoTracks()[0];
				const devices = await getMediaDevices();
				if (!videoTrack) {
					onNoVideo?.('No video track available');
					for (const track of stream.getTracks()) {
						track.stop();
					}
					return new Error('No video track available');
				}
				if (!audioTrack) onNoAudio?.('No audio track available');
				if (audioTrack) audioTrack.enabled = !startAudioMuted;
				if (!videoElement.current) return new Error('Video element not found');
				videoElement.current.muted = !playLocalAudio;
				videoElement.current.srcObject = stream;
				await videoElement.current.play();
				onVideoStream?.(stream);
				setDeviceList(devices);
				markCameraReady();
				return stream;
			},
			[getMediaDevices, markCameraReady, onNoAudio, onNoVideo, onVideoStream, playLocalAudio, startAudioMuted],
		);

		// start camera access, reusing an existing stream when possible
		const startCamera = useCallback(async () => {
			if (!videoElement.current) return new Error('Video element not found');
			if (!hasMediaSupport) {
				setCameraSupport(false);
				setCameraError('Camera not supported');
				return new Error('Camera not supported');
			}
			const existingStream = reuseExistingStream();
			if (existingStream) return existingStream;
			try {
				const stream = await requestMediaStream();
				return await attachStreamToVideo(stream);
			} catch (error) {
				const defaultError = new Error('Could not access the camera. Ensure permissions are correct');
				const resolvedError = error instanceof Error ? error : defaultError;
				onNoVideo?.(resolvedError);
				onNoAudio?.(resolvedError);
				setCameraSupport(true);
				setCameraError(resolvedError.message);
				setCameraOn(false);
				return resolvedError;
			}
		}, [attachStreamToVideo, hasMediaSupport, onNoAudio, onNoVideo, requestMediaStream, reuseExistingStream]);

		// toggle video between enabled and disabled states
		const toggleVideo = useCallback(async () => {
			const stream = getStream();
			if (!stream) return await startCamera();
			const videoTrack = stream.getVideoTracks()[0];
			if (!videoTrack) return new Error('No video track found');
			return videoTrack.enabled ? disableVideo() : enableVideo();
		}, [disableVideo, enableVideo, getStream, startCamera]);

		// stop the active camera stream and clear local media state
		const stopCamera = useCallback(async () => {
			if (!videoElement.current) return new Error('Video element not found');
			try {
				const stream = getStream();
				if (!stream) return new Error('No media stream to stop');
				for (const track of stream.getTracks()) {
					track.stop();
				}
				videoElement.current.srcObject = null;
				setCameraOn(false);
				setMicMuted(startAudioMuted);
				setCameraError(undefined);
				setDeviceList([]);
				return true;
			} catch (error) {
				const defaultError = new Error('Unknown error stopping the camera. Please try again.');
				return error instanceof Error ? error : defaultError;
			}
		}, [getStream, startAudioMuted]);

		// expose the live media elements and controls through the forwarded ref
		React.useImperativeHandle(
			ref,
			() => ({
				get video() {
					return videoElement.current ?? undefined;
				},
				get container() {
					return containerElement.current ?? undefined;
				},
				get stream() {
					return getStream();
				},
				get videoTrack() {
					return getTrack('video');
				},
				get audioTrack() {
					return getTrack('audio');
				},
				snapshot: (options?: CameraSnapshotOptions) => handleSnapshot(options),
				startCamera: () => startCamera(),
				stopCamera: () => stopCamera(),
				enableVideo: () => enableVideo(),
				disableVideo: () => disableVideo(),
				muteMic: () => muteMic(),
				unmuteMic: () => unmuteMic(),
				toggleMic: () => toggleMic(),
				devices: () => getMediaDevices(),
				toggleVideo: () => toggleVideo(),
			}),
			[
				disableVideo,
				enableVideo,
				getMediaDevices,
				getStream,
				getTrack,
				handleSnapshot,
				muteMic,
				startCamera,
				stopCamera,
				toggleMic,
				toggleVideo,
				unmuteMic,
			],
		);

		// determine whether the poster should be shown instead of live video
		const showPoster = useMemo(() => {
			if (cameraError) return false;
			if (cameraSupport === false) return true;
			return !cameraOn;
		}, [cameraError, cameraSupport, cameraOn]);

		// determine whether the camera error message should be shown
		const showError = useMemo(() => {
			return Boolean(cameraError);
		}, [cameraError]);

		// resolve the translucent controls background from the active theme
		const controlsBg = useMemo(() => {
			const bgColor = theme.current.colors['core-surface-primary'];
			return addOpacity(bgColor, 0.75);
		}, [theme.current]);

		// resolve the control bar transform from hover and auto-hide state
		const setControlBarVisible = useMemo(() => {
			if (!autoHideControlBar) return 'translateY(0%)';
			if (!showControlBar) return 'translateY(100%)';
			if (hovered) return 'translateY(0%)';
			return 'translateY(100%)';
		}, [autoHideControlBar, hovered, showControlBar]);

		// compose CSS custom properties for frame sizing and control visibility
		const cssVars = useMemo(
			() =>
				({
					'--camera-width': width,
					'--camera-height': height,
					'--camera-controls-bg': controlsBg,
					'--camera-controls-transform': setControlBarVisible,
				}) as React.CSSProperties,
			[controlsBg, height, setControlBarVisible, width],
		);

		// surface the controls bar when the user moves within the preview
		const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
			if (hovered) return;
			setHovered(true);
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			controlsTimer.current = setTimeout(() => setHovered(false), 3000);
		};

		// show the controls while the pointer is inside the camera frame
		const handleMouseEnter = () => {
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			setHovered(true);
			controlsTimer.current = setTimeout(() => setHovered(false), 3000);
		};

		// hide the controls when the pointer leaves the camera frame
		const handleMouseLeave = () => {
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			setHovered(false);
		};

		// handle click to remove controls bar from view
		const handleMouseClick = useCallback(() => {
			setHovered(false);
		}, []);

		// keep the controls visible while the controls surface is active
		const handleControlsMouseEnter = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
			e.stopPropagation();
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			setHovered(true);
		};

		// restart the controls hide timer after leaving the controls surface
		const handleControlsMouseLeave = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
			e.stopPropagation();
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			controlsTimer.current = setTimeout(() => setHovered(false), 3000);
		};

		// handle click on controls wrapper to prevent event bubbling to parent
		const handleControlsClick = useCallback(
			(e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
				e.stopPropagation();
			},
			[],
		);

		// start or stop the camera automatically from the startCameraOff prop
		useEffect(() => {
			if (startCameraOff) {
				stopCamera().then(() => null);
				return;
			}
			startCamera().then(() => null);
		}, [startCamera, startCameraOff, stopCamera]);

		// keep local preview audio output aligned with the current prop
		useEffect(() => {
			if (!videoElement.current) return;
			videoElement.current.muted = !playLocalAudio;
		}, [playLocalAudio]);

		// clean up timers and active media tracks on unmount
		useEffect(() => {
			return () => {
				if (controlsTimer.current) clearTimeout(controlsTimer.current);
				const stream = getStream();
				if (stream) {
					for (const track of stream.getTracks()) {
						track.stop();
					}
				}
			};
		}, [getStream]);

		// release the snapshot object URL when the preview changes or unmounts
		useEffect(() => {
			return () => {
				if (snapshot) URL.revokeObjectURL(snapshot);
			};
		}, [snapshot]);

		return (
			<div
				ref={containerElement}
				className={css.wrapper}
				style={cssVars}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onMouseMove={handleMouseMove}
				onClick={handleMouseClick}
				onKeyDown={(e) => accessibleKeyDown(e, handleMouseClick)}
			>
				{pipSnapshot && snapshot && (
					<div className={css.snapshotFrame}>
						<div className={css.clear}>
							<Icon
								name={'x'}
								pointer={true}
								role={'button'}
								aria-label={'Clear snapshot'}
								onClick={() =>
									setSnapshot((previousSnapshot) => {
										if (previousSnapshot) URL.revokeObjectURL(previousSnapshot);
										return undefined;
									})
								}
							/>
						</div>
						<img className={css.snapshot} src={snapshot} alt={'Snapshot'} />
					</div>
				)}
				{cameraSupport !== false && (
					<video ref={videoElement} className={css.video} autoPlay playsInline muted={!playLocalAudio}>
						<track kind={'captions'} src={undefined} />
					</video>
				)}
				{showPoster && <div className={css.poster}>{noVideoPoster ?? <DefaultNoVideoPoster user={userProfile} />}</div>}
				{showError && <div className={css.error}>{cameraError}</div>}
				<div
					className={css.controls}
					onMouseEnter={handleControlsMouseEnter}
					onMouseLeave={handleControlsMouseLeave}
					onClick={handleControlsClick}
					onKeyDown={(e) => accessibleKeyDown(e, () => handleControlsClick)}
				>
					<div className={css.controlsLeft}>
						<ToolbarButton
							icon={'person'}
							iconActive={'person'}
							active={profile}
							label={'User Info'}
							disabled={false}
							onClick={() => {
								setProfile(!profile);
								onChangeProfile?.(userProfile);
							}}
						/>
					</div>
					<div className={css.controlsCenter}>
						<ToolbarButton
							icon={'video'}
							iconActive={'video off'}
							active={!cameraOn}
							label={cameraOn ? 'Video' : 'Off'}
							onClick={() => void toggleVideo()}
						/>
						<ToolbarButton
							icon={'mic'}
							iconActive={'mic muted'}
							active={micMuted}
							label={micMuted ? 'Muted' : 'Mic'}
							onClick={() => toggleMic()}
						/>
						<ToolbarButton
							icon={'camera'}
							iconActive={'camera'}
							active={!!snapshot}
							label={'Photo'}
							disabled={!cameraOn}
							onClick={() => cameraOn && handleSnapshot({ toggle: true })}
						/>
					</div>
					<div className={css.controlsRight}>
						<ToolbarButton
							icon={'more'}
							iconActive={'more'}
							active={settings}
							label={'Settings'}
							disabled={false}
							onClick={() => {
								setSettings(!settings);
								onChangeSettings?.(sessionSettings, deviceList);
							}}
						/>
					</div>
				</div>
			</div>
		);
	}),
);

/**
 * Custom toolbar button with labels for controlling video / audio / etc.
 */
export function ToolbarButton(props: Readonly<ToolbarButtonProps>) {
	const { icon, iconActive, active, label, disabled, onClick, onMouseOver } = props;

	const iconColor = useMemo(() => {
		if (active) return 'var(--core-surface-primary)';
		return 'var(--core-text-special)';
	}, [active]);

	const labelColor = useMemo(() => {
		if (active) return 'var(--core-text-primary)';
		return disabled ? 'var(--core-text-disabled)' : 'var(--core-text-special)';
	}, [active, disabled]);

	const cssVars = useMemo(() => {
		return {
			'--toolbar-button-size': '56px',
			'--toolbar-button-border': 'none',
			'--toolbar-button-bg-color': active ? 'var(--core-text-primary)' : 'var(--core-surface-primary)',
			'--toolbar-button-label-color': labelColor,
			'--toolbar-button-opacity': disabled ? '0.25' : '1',
		} as React.CSSProperties;
	}, [active, labelColor, disabled]);
	return (
		<div
			className={css.toolbarButton}
			style={cssVars}
			role="button"
			aria-label={label}
			aria-disabled={disabled}
			onFocus={onMouseOver}
			onMouseOver={onMouseOver}
			onKeyDown={(e) => {
				if (disabled) return;
				accessibleKeyDown(e, () => onClick());
			}}
			onClick={disabled ? undefined : onClick}
			tabIndex={disabled ? -1 : 0}
		>
			<div className={css.buttonIcon}>
				<Icon size={26} name={active ? iconActive : icon} strokeColor={iconColor} />
			</div>
			<div className={css.buttonLabel}>{label}</div>
		</div>
	);
}

/**
 * the default poster image when no video is available
 */
export function DefaultNoVideoPoster(props: Readonly<DefaultNoVideoPosterProps>) {
	const { size = 0.75, user, message = 'Video is off' } = props;
	if (user)
		return (
			<Avatar image={user?.avatar} name={`${user?.name}`} email={`${user?.email}`} size={'50%'} fontSize={'25%'} />
		);
	return message;
}

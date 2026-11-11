'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { addOpacity } from '../../utils';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { ToggleButton } from '../ToggleButton';
import css from './Camera.module.css';
import type {
	CameraElement,
	CameraProps,
	CameraSnapshotOptions,
	DefaultNoVideoPosterProps,
	ToolbarButtonProps,
} from './_types';
import { type CameraMediaState, CameraSession, type CameraSessionOptions } from './cameraSession';

export const Camera = React.memo(
	React.forwardRef<CameraElement, CameraProps>((rawProps, ref) => {
		const props = resolveColorProps(rawProps);
		const videoElement = useRef<HTMLVideoElement>(null);
		const containerElement = useRef<HTMLDivElement>(null);
		const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
		const controlsElement = useRef<HTMLDivElement>(null);
		const {
			noVideoPoster,
			backgroundColor = 'var(--core-surface-secondary)',
			borderColor = 'var(--core-fill-primary)',
			borderWidth = 1,
			borderRadius = 'var(--corner-xxl)',
			audio = true,
			width,
			height,
			showControlBar = true,
			showProfileButton = false,
			showSettingsButton = false,
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
			className,
			style,
			onMouseEnter,
			onMouseLeave,
			onMouseMove,
			onClick,
			onFocusCapture,
			onBlurCapture,
			...divAttributes
		} = props;
		const theme = useTheme();
		const [hovered, setHovered] = useState(false);
		const [focused, setFocused] = useState(false);
		const [snapshot, setSnapshot] = useState<string>();
		const snapshotURL = useRef<string | undefined>(undefined);
		const updateSnapshot = useCallback((url?: string) => {
			if (snapshotURL.current) URL.revokeObjectURL(snapshotURL.current);
			snapshotURL.current = url;
			setSnapshot(url);
		}, []);
		const [settings, setSettings] = useState(false);
		const [profile, setProfile] = useState(false);
		const [media, setMedia] = useState<CameraMediaState>({
			cameraOn: false,
			micMuted: startAudioMuted,
			audioAvailable: false,
			supported: true,
			devices: [],
		});
		const callbacks = useRef<CameraSessionOptions>({
			audio,
			startAudioMuted,
			playLocalAudio,
			sessionSettings,
			onVideoStream,
			onNoAudio,
			onNoVideo,
		});
		useEffect(() => {
			callbacks.current = {
				audio,
				startAudioMuted,
				playLocalAudio,
				sessionSettings,
				onVideoStream,
				onNoAudio,
				onNoVideo,
			};
		});
		const [session] = useState(
			() =>
				new CameraSession(
					() => videoElement.current,
					() => callbacks.current,
					setMedia,
				),
		);
		const { cameraOn, micMuted, devices: deviceList, error: cameraError, supported: cameraSupport } = media;
		useEffect(() => {
			session.activate();
			return () => session.dispose();
		}, [session]);
		useEffect(() => {
			if (startCameraOff) void session.stop();
			else void session.start();
		}, [session, startCameraOff]);
		useEffect(() => {
			session.reconfigure({
				audio,
				sessionSettings: {
					videoDeviceId: sessionSettings?.videoDeviceId,
					micDeviceId: sessionSettings?.micDeviceId,
				},
			});
		}, [session, audio, sessionSettings?.videoDeviceId, sessionSettings?.micDeviceId]);

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
				if (options?.toggle && snapshotURL.current) {
					updateSnapshot();
					return undefined;
				}
				const photo = takeSnapshot(options);
				onSnapshot?.(photo);
				updateSnapshot(photo ? URL.createObjectURL(photo) : undefined);
				return photo;
			},
			[onSnapshot, takeSnapshot, updateSnapshot],
		);

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
					return session.stream;
				},
				get videoTrack() {
					return session.videoTrack;
				},
				get audioTrack() {
					return session.audioTrack;
				},
				snapshot: (options?: CameraSnapshotOptions) => handleSnapshot(options),
				startCamera: () => session.start(),
				stopCamera: () => session.stop(),
				enableVideo: () => session.enableVideo(),
				disableVideo: () => session.disableVideo(),
				muteMic: () => session.muteMic(),
				unmuteMic: () => session.unmuteMic(),
				toggleMic: () => session.toggleMic(),
				devices: () => session.devicesList(),
				toggleVideo: () => session.toggleVideo(),
			}),
			[session, handleSnapshot],
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
			if (!media.cameraOn) return backgroundColor;
			const bgColor = theme.current.colors['core-surface-secondary'];
			return addOpacity(bgColor, 0.5);
		}, [media.cameraOn, backgroundColor, theme.current]);

		// resolve the control bar transform from hover and auto-hide state
		const setControlBarVisible = useMemo(() => {
			if (!showControlBar) return 'translateY(100%)';
			if (!autoHideControlBar || focused) return 'translateY(0%)';
			if (hovered) return 'translateY(0%)';
			return 'translateY(100%)';
		}, [autoHideControlBar, hovered, showControlBar, focused]);

		// compose CSS custom properties for frame sizing and control visibility
		const cssVars = useMemo(
			() =>
				({
					'--camera-width': setStyle(width),
					'--camera-background-color': backgroundColor,
					'--camera-border-color': borderColor,
					'--camera-border-width': setStyle(borderWidth),
					'--camera-border-radius': setStyle(borderRadius),
					'--camera-height': setStyle(height),
					'--camera-controls-bg': controlsBg,
					'--camera-controls-transform': setControlBarVisible,
				}) as React.CSSProperties,
			[controlsBg, height, setControlBarVisible, width, backgroundColor, borderColor, borderWidth, borderRadius],
		);

		const canAutoHide = showControlBar && autoHideControlBar;
		const revealControls = () => {
			if (!canAutoHide) return;
			setHovered(true);
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			controlsTimer.current = setTimeout(() => {
				if (controlsElement.current?.contains(document.activeElement) || controlsElement.current?.matches(':hover'))
					return;
				setHovered(false);
			}, 3000);
		};
		const leaveControls = () => {
			if (!canAutoHide) return;
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			setHovered(false);
		};

		useEffect(() => {
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
			if (!canAutoHide) {
				setHovered(false);
				setFocused(false);
			} else setFocused(Boolean(containerElement.current?.contains(document.activeElement)));
		}, [canAutoHide]);

		// keep local preview audio output aligned with the current prop
		useEffect(() => {
			if (!videoElement.current) return;
			videoElement.current.muted = !playLocalAudio;
		}, [playLocalAudio]);

		useEffect(
			() => () => {
				if (controlsTimer.current) clearTimeout(controlsTimer.current);
			},
			[],
		);

		// release the remaining snapshot object URL on unmount
		useEffect(() => {
			return () => {
				if (snapshotURL.current) URL.revokeObjectURL(snapshotURL.current);
				snapshotURL.current = undefined;
			};
		}, []);

		return (
			<div
				{...divAttributes}
				ref={containerElement}
				className={[css.wrapper, className].filter(Boolean).join(' ')}
				style={{ ...cssVars, ...style }}
				onMouseEnter={(event) => {
					onMouseEnter?.(event);
					revealControls();
				}}
				onMouseMove={(event) => {
					onMouseMove?.(event);
					revealControls();
				}}
				onMouseLeave={(event) => {
					onMouseLeave?.(event);
					leaveControls();
				}}
				onClick={onClick}
				onFocusCapture={(event) => {
					onFocusCapture?.(event);
					if (!canAutoHide) return;
					setFocused(true);
					revealControls();
				}}
				onBlurCapture={(event) => {
					onBlurCapture?.(event);
					if (!canAutoHide) return;
					if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
						setFocused(false);
						leaveControls();
					}
				}}
			>
				{pipSnapshot && snapshot && (
					<div className={css.snapshotFrame}>
						<div className={css.clear}>
							<Icon
								name={'basic.cross'}
								pointer={true}
								actionName={'Clear snapshot'}
								onClick={() => updateSnapshot()}
							/>
						</div>
						<img className={css.snapshot} src={snapshot} alt={'Snapshot'} />
					</div>
				)}
				{cameraSupport !== false && (
					<video
						ref={videoElement}
						className={css.video}
						style={{ visibility: cameraOn ? 'visible' : 'hidden' }}
						autoPlay
						playsInline
						muted={!playLocalAudio}
					>
						<track kind={'captions'} src={undefined} />
					</video>
				)}
				{showPoster && <div className={css.poster}>{noVideoPoster ?? <DefaultNoVideoPoster user={userProfile} />}</div>}
				{showError && <div className={css.error}>{cameraError}</div>}
				{showControlBar && (
					<div
						ref={controlsElement}
						className={css.controls}
						onMouseEnter={() => {
							if (!canAutoHide) return;
							if (controlsTimer.current) clearTimeout(controlsTimer.current);
							setHovered(true);
						}}
						onMouseLeave={revealControls}
					>
						<div className={css.controlsLeft}>
							{showProfileButton && (
								<ToolbarButton
									borderWidth={media.cameraOn ? 0 : 1}
									icon={'users.user'}
									iconActive={'users.user'}
									active={profile}
									label={'User Info'}
									disabled={false}
									onClick={() => {
										setProfile(!profile);
										onChangeProfile?.(userProfile);
									}}
								/>
							)}
						</div>
						<div className={css.controlsCenter}>
							<ToolbarButton
								borderWidth={media.cameraOn ? 0 : 1}
								icon={'media.video-camera'}
								iconActive={'media.video-camera-slash'}
								active={!cameraOn}
								label={cameraOn ? 'Video' : 'Off'}
								onClick={() => void session.toggleVideo()}
							/>
							{audio && (
								<ToolbarButton
									borderWidth={media.cameraOn ? 0 : 1}
									icon={'media.mic'}
									iconActive={'media.mic-slash'}
									active={micMuted}
									label={micMuted ? 'Muted' : 'Mic'}
									disabled={!media.audioAvailable}
									onClick={() => session.toggleMic()}
								/>
							)}
							<ToolbarButton
								borderWidth={media.cameraOn ? 0 : 1}
								icon={'images.camera'}
								iconActive={'images.camera'}
								active={!!snapshot}
								label={'Photo'}
								disabled={!cameraOn}
								onClick={() => cameraOn && handleSnapshot({ toggle: true })}
							/>
						</div>
						<div className={css.controlsRight}>
							{showSettingsButton && (
								<ToolbarButton
									borderWidth={media.cameraOn ? 0 : 1}
									icon={'basic.more-horiz-fill'}
									iconActive={'basic.more-horiz-fill'}
									active={settings}
									label={'Settings'}
									disabled={false}
									onClick={() => {
										setSettings(!settings);
										onChangeSettings?.(sessionSettings, deviceList);
									}}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		);
	}),
);

/** Shared Slice control with the Camera action's controlled state. */
export function ToolbarButton(props: Readonly<ToolbarButtonProps>) {
	const { borderWidth = 1, icon, iconActive, active, label, disabled, onClick, onMouseOver } = props;
	return (
		<ToggleButton
			icon={icon}
			iconSize={20}
			iconStrokeWidth={1.5}
			iconSelected={iconActive}
			selected={active}
			label={label}
			labelOutside
			labelPosition="bottom"
			disabled={disabled}
			onFocus={onMouseOver}
			onMouseOver={onMouseOver}
			onClick={onClick}
			borderRadius={100}
			textSize={'xs'}
			borderWidth={active ? 0 : borderWidth}
		/>
	);
}

/**
 * the default poster image when no video is available
 */
export function DefaultNoVideoPoster(props: Readonly<DefaultNoVideoPosterProps>) {
	const { user, message = 'Video is off' } = props;
	if (user)
		return <Avatar image={user?.avatar} name={user.name} email={`${user?.email}`} size={'50%'} textSize={'xl'} />;
	return (
		<span className={css.offMessage}>
			<Icon name="media.video-camera-slash" size={20} strokeColor="currentColor" decorative />
			{message}
		</span>
	);
}

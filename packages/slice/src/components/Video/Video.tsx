'use client';

import React, { type SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import type { SliceIcon } from '../Icon';
import { IconButton, type IconButtonProps } from '../IconButton';
import { ProgressIndicator } from '../Progress';
import { Slider } from '../Slider';
import { ToggleButton } from '../ToggleButton';
import css from './Video.module.css';
import { PlayState, type VideoControlsContext, type VideoElement, type VideoProps } from './_types';
import { getVideoControls } from './getVideoControls';

const BaseVideo = React.forwardRef<VideoElement, VideoProps>((rawProps, ref) => {
	const props = resolveColorProps(rawProps);
	const {
		children,
		src,
		playing,
		loop = false,
		muted = true,
		playsInline = true,
		controls = 'simple',
		volume = 1,
		poster,
		captionsSrc,
		captionsLanguage = 'en',
		captionsLabel = 'Captions',
		captionsDefault = false,
		videoName = 'Video',
		videoAttributes,
		onError,
		playRate = 1,
		width = '100%',
		height = 'auto',
		borderRadius = 'var(--corner-s)',
		borderWidth,
		borderColor,
		backgroundColor,
		objectFit = 'contain',
		customControls: controlOverrides,
		showProgressIndicator = true,
		onPlay,
		onPause,
		onEnd,
		onProgress,
		onLoadProgress,
		onPlaybackRateChange,
		onCanPlayThrough,
		onCanPlay,
		onPlayStateChange,
		onLoadMetaData,
		onFullScreenChange,
		onVolumeChange,
		onLoadedFrameData,
		onQuit,
		...divAttributes
	} = props;
	const {
		id: divId,
		className,
		style,
		onMouseEnter,
		onMouseLeave,
		onMouseMove,
		onFocus,
		onBlur,
		...rest
	} = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const customControls = getVideoControls(controlOverrides);
	const controlMode = controlOverrides === undefined ? controls : 'simple';
	const reducedMotion = usePrefersReducedMotion();
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const progress = useRef<number | null>(null);
	const wasPlaying = useRef<boolean | null>(null);
	const playState = useRef<PlayState | null>(PlayState.Stopped); // normalize play state events
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(muted ?? false);
	const [currentVolume, setCurrentVolume] = useState<number>(
		Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 1,
	);
	const [currentProgress, setCurrentProgress] = useState<number>(0);
	const [hovered, setHovered] = useState<boolean>(false);
	const [canPlay, setCanPlay] = useState<boolean>(false);
	const [focused, setFocused] = useState(false);
	const [duration, setDuration] = useState(0);
	const [failed, setFailed] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const [captionsOn, setCaptionsOn] = useState(captionsDefault);
	const seekFinished = useRef(false);
	const timer = useRef<NodeJS.Timeout | null>(null);

	// get the percent loaded from the video element via buffer
	const handleLoadProgress = useCallback(
		(event: SyntheticEvent<HTMLElement, Event>) => {
			const target = event.target as HTMLVideoElement;

			if (target.buffered.length > 0) {
				// Get the end time of the last buffered range
				const bufferedEnd = target.buffered.end(target.buffered.length - 1);
				const duration = target.duration;

				if (Number.isFinite(duration) && duration > 0) {
					const percentLoaded = Math.min(1, Math.max(0, bufferedEnd / duration));
					onLoadProgress?.(percentLoaded);
				}
			}
		},
		[onLoadProgress],
	);

	// handle play progress updates
	const handlePlayProgress = useCallback(
		(event: SyntheticEvent<HTMLElement, Event>) => {
			const target = event.target as HTMLVideoElement;
			const percentPlayed =
				Number.isFinite(target.duration) && target.duration > 0 && Number.isFinite(target.currentTime)
					? Math.min(1, Math.max(0, target.currentTime / target.duration))
					: 0;
			setCurrentProgress(percentPlayed);
			if (progress.current !== percentPlayed) {
				onProgress?.(percentPlayed);
				progress.current = percentPlayed;
				const isAtZero = videoRef.current?.currentTime === 0;
				const isAtEnd = videoRef.current?.currentTime === videoRef.current?.duration;
				if (isAtZero && target.paused) {
					if (playState.current !== PlayState.Stopped) onPlayStateChange?.(PlayState.Stopped);
					playState.current = PlayState.Stopped;
				} else if (isAtEnd) {
					if (playState.current !== PlayState.Ended) onPlayStateChange?.(PlayState.Ended);
					playState.current = PlayState.Ended;
				} else {
					if (target.paused && playState.current !== PlayState.Paused) {
						onPlayStateChange?.(PlayState.Paused);
						playState.current = PlayState.Paused;
					} else if (!target.paused && playState.current !== PlayState.Playing) {
						onPlayStateChange?.(PlayState.Playing);
						playState.current = PlayState.Playing;
					}
				}
			}
		},
		[onProgress, onPlayStateChange],
	);

	// set can play through to true
	const handleCanPlayThrough = useCallback(() => {
		onCanPlayThrough?.();
	}, [onCanPlayThrough]);

	// mark the video ready and notify the consumer
	const handleCanPlay = useCallback(() => {
		setCanPlay(true);
		setFailed(false);
		onCanPlay?.();
	}, [onCanPlay]);

	// Read the native state: queued media events may arrive after another request.
	const syncPlayingState = useCallback(() => {
		setIsPlaying(!videoRef.current?.paused);
		if (videoRef.current?.paused) return;
		const isAtEnd = videoRef.current?.currentTime === videoRef.current?.duration;
		if (isAtEnd) {
			if (playState.current !== PlayState.Ended) onPlayStateChange?.(PlayState.Ended);
			playState.current = PlayState.Ended;
		} else if (playState.current !== PlayState.Playing) {
			onPlayStateChange?.(PlayState.Playing);
			playState.current = PlayState.Playing;
		}
	}, [onPlayStateChange]);
	const handlePlay = useCallback(() => {
		onPlay?.();
		syncPlayingState();
	}, [onPlay, syncPlayingState]);
	const handlePlaying = useCallback(() => {
		setCanPlay(true);
		syncPlayingState();
	}, [syncPlayingState]);

	// handle pause event
	const handlePause = useCallback(() => {
		onPause?.();
		setIsPlaying(false);
		const isAtZero = videoRef.current?.currentTime === 0;
		const isAtEnd = videoRef.current?.currentTime === videoRef.current?.duration;
		if (isAtZero && !isAtEnd) {
			if (playState.current !== PlayState.Stopped) onPlayStateChange?.(PlayState.Stopped);
			playState.current = PlayState.Stopped;
		} else if (!isAtEnd) {
			if (playState.current !== PlayState.Paused) {
				onPlayStateChange?.(PlayState.Paused);
				playState.current = PlayState.Paused;
			}
		}
	}, [onPause, onPlayStateChange]);

	// handle end event
	const handleEnd = useCallback(() => {
		setIsPlaying(false);
		if (playState.current !== PlayState.Ended) onPlayStateChange?.(PlayState.Ended);
		playState.current = PlayState.Ended;
		onEnd?.();
	}, [onEnd, onPlayStateChange]);

	// handle load metadata
	const handleLoadMetadata = useCallback(
		(event: SyntheticEvent<HTMLElement, Event>) => {
			const target = event.target as HTMLVideoElement;
			setDuration(Number.isFinite(target.duration) ? target.duration : 0);
			onLoadMetaData?.(target.duration);
		},
		[onLoadMetaData],
	);

	// handle playback rate change
	const handlePlaybackRate = useCallback(
		(event: SyntheticEvent<HTMLElement, Event>) => {
			const target = event.target as HTMLVideoElement;
			const playbackRate = target.playbackRate;
			onPlaybackRateChange?.(playbackRate);
		},
		[onPlaybackRateChange],
	);

	const requestPlayback = useCallback(async (play?: boolean) => {
		const video = videoRef.current;
		if (!video) return;
		const nextPlaying = play ?? video.paused;
		if (nextPlaying) await video.play();
		else {
			wasPlaying.current = null;
			seekFinished.current = false;
			video.pause();
		}
	}, []);
	// UI and prop-driven requests handle browser rejection; imperative requests return it.
	const handlePlayClick = useCallback(
		(play?: boolean) => {
			void requestPlayback(play).catch(() => undefined);
		},
		[requestPlayback],
	);

	// mouse events
	const handleMouseOver = useCallback(() => {
		setHovered(true);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setHovered(false);
		}, 2000);
	}, []);

	// mouse events
	const handleMouseOut = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		setHovered(false);
	}, []);

	const handleFullScreen = useCallback(async (state = true) => {
		const container = containerRef.current;
		if (!container) return;
		if (state) await container.requestFullscreen();
		else if (document.fullscreenElement === container) await document.exitFullscreen();
	}, []);

	// handle mute / unmute
	const handleMute = useCallback((state?: boolean) => {
		if (!videoRef.current) return;
		let nextMuted = !videoRef.current.muted;
		if (state !== undefined) nextMuted = state;
		videoRef.current.muted = nextMuted;
		setIsMuted(nextMuted);
	}, []);

	// update the rate change
	const handleRateChange = useCallback((rate = 1) => {
		if (!videoRef.current) return;
		let nextRate = Number.isFinite(rate) ? rate : 1;
		if (rate < 0.5) nextRate = 0.5;
		if (rate > 3) nextRate = 3;
		videoRef.current.playbackRate = nextRate;
	}, []);

	// restart video
	const handleRestart = useCallback(async () => {
		if (!videoRef.current) return;
		videoRef.current.pause();
		videoRef.current.currentTime = 0;
		await requestPlayback(true);
	}, [requestPlayback]);

	const handleVolumeChange = useCallback((volume = 1) => {
		if (!videoRef.current) return;
		videoRef.current.volume = Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 1;
	}, []);
	const handleNativeVolumeChange = () => {
		const video = videoRef.current;
		if (!video) return;
		setCurrentVolume(video.volume);
		setIsMuted(video.muted);
		onVolumeChange?.(video.volume);
	};

	const handleSetProgress = useCallback((position: number) => {
		const video = videoRef.current;
		if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || !Number.isFinite(position)) return;
		if (wasPlaying.current === null) wasPlaying.current = !video.paused;
		seekFinished.current = false;
		video.pause();
		video.currentTime = Math.min(1, Math.max(0, position)) * video.duration;
		setCurrentProgress(Math.min(1, Math.max(0, position)));
	}, []);
	const handleSeekEnd = useCallback(() => {
		const video = videoRef.current;
		if (!seekFinished.current || video?.seeking) return;
		const resume = wasPlaying.current;
		wasPlaying.current = null;
		seekFinished.current = false;
		if (resume && video && video.currentTime < video.duration) handlePlayClick(true);
	}, [handlePlayClick]);
	const handleScrubEnd = () => {
		seekFinished.current = true;
		handleSeekEnd();
	};

	// emit fullscreen changes from the browser event as the single source of truth
	const handleFullScreenChange = useCallback(() => {
		const isFullscreen = document.fullscreenElement === containerRef.current;
		setFullscreen(isFullscreen);
		onFullScreenChange?.(isFullscreen);
	}, [onFullScreenChange]);

	// did load the current frame
	const handleLoadedFrame = useCallback(() => {
		onLoadedFrameData?.();
	}, [onLoadedFrameData]);

	React.useImperativeHandle(
		ref,
		() => ({
			play: () => requestPlayback(true),
			stop: () => requestPlayback(false),
			restart: handleRestart,
			setVolume: (volume: number) => {
				handleVolumeChange(volume);
			},
			mute: (mute: boolean) => {
				handleMute(mute);
			},
			fullscreen: handleFullScreen,
			playbackRate: (rate: number) => {
				handleRateChange(rate);
			},
			get videoElement() {
				return videoRef.current ?? undefined;
			},
		}),
		[requestPlayback, handleRestart, handleMute, handleFullScreen, handleRateChange, handleVolumeChange],
	);

	const controlsContext: VideoControlsContext = {
		playing: isPlaying,
		muted: isMuted,
		progress: currentProgress,
		volume: currentVolume,
		duration,
		fullscreen,
		canSeek: duration > 0,
		play: () => requestPlayback(true),
		pause: () => handlePlayClick(false),
		togglePlay: () => requestPlayback(),
		toggleMute: () => handleMute(),
		setVolume: handleVolumeChange,
		setProgress: (position) => {
			const video = videoRef.current;
			if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || !Number.isFinite(position)) return;
			const value = Math.min(1, Math.max(0, position));
			video.currentTime = value * video.duration;
			setCurrentProgress(value);
		},
		toggleFullscreen: () => handleFullScreen(!fullscreen),
	};

	const showCustomControls = controlMode === 'simple' || controlMode === 'custom';
	const controlsVisible = hovered || focused;

	// memo dynamic CSS
	const cssVars = useMemo(() => {
		return {
			'--video-width': setStyle(width, 'unset'),
			'--video-height': setStyle(height, 'unset'),
			'--video-border-radius': setStyle(borderRadius, corners['corner-none']),
			'--video-border-size': setStyle(borderWidth, 0),
			'--video-border-color': setStyle(borderColor, 'transparent'),
			'--video-bg-color': setStyle(backgroundColor, 'transparent'),
			'--video-controls-transition': reducedMotion ? 'none' : undefined,
			'--video-object-fit': objectFit ?? 'contain',
			'--video-controls-pointer-events': controlsVisible ? 'auto' : 'none',
			'--video-controls-opacity': controlsVisible ? 1 : 0,
			'--video-progress-padding-left': customControls.quit ? 'var(--spacing-s)' : 'var(--spacing-m)',
		} as React.CSSProperties;
	}, [
		width,
		height,
		borderRadius,
		borderWidth,
		borderColor,
		backgroundColor,
		objectFit,
		controlsVisible,
		reducedMotion,
		customControls.quit,
	]);

	const speakerIcon: SliceIcon = isMuted || currentVolume === 0 ? 'media.volume-slash' : 'media.volume-low';

	// update playback rate based on props
	useEffect(() => handleRateChange(playRate), [playRate, handleRateChange]);

	// handle playback start/stop prop change
	useEffect(() => {
		if (playing === undefined) return;
		handlePlayClick(playing);
	}, [playing, handlePlayClick]);

	// handle mute changes
	useEffect(() => handleMute(muted), [muted, handleMute]);

	// handle volume prop changes
	useEffect(() => handleVolumeChange(volume), [volume, handleVolumeChange]);

	useEffect(() => {
		document.addEventListener('fullscreenchange', handleFullScreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
	}, [handleFullScreenChange]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);
	const resetMedia = () => {
		setCanPlay(false);
		setFailed(false);
		setIsPlaying(false);
		setCurrentProgress(0);
		setDuration(0);
		progress.current = null;
		wasPlaying.current = null;
		seekFinished.current = false;
		if (playState.current !== PlayState.Stopped) onPlayStateChange?.(PlayState.Stopped);
		playState.current = PlayState.Stopped;
	};
	const syncCaptions = useCallback(() => {
		const track = videoRef.current?.textTracks[0];
		if (track) track.mode = captionsOn ? 'showing' : 'hidden';
	}, [captionsOn]);
	useEffect(() => {
		syncCaptions();
	}, [syncCaptions]);
	useEffect(() => {
		if (!captionsSrc) return;
		const tracks = videoRef.current?.textTracks;
		const update = () => setCaptionsOn(tracks?.[0]?.mode === 'showing');
		tracks?.addEventListener('change', update);
		return () => tracks?.removeEventListener('change', update);
	}, [captionsSrc]);

	const buttonProps: Partial<IconButtonProps> = {
		backgroundColor: 'transparent',
		backgroundColorHover: 'transparent',
		backgroundColorSelected: 'transparent',
		iconColor: 'var(--core-text-light)',
		iconColorHover: 'var(--core-text-light)',
		iconColorSelected: 'var(--core-text-light)',
		iconSize: 16,
		buttonSize: 'm',
		borderRadius: '100%',
		iconStrokeWidth: 1.5,
	};

	return (
		<div
			id={divId}
			ref={containerRef}
			className={`${css.wrapper}${divClass}`}
			style={{ ...cssVars, ...divStyle }}
			onMouseEnter={(event) => {
				handleMouseOver();
				onMouseEnter?.(event);
			}}
			onMouseLeave={(event) => {
				handleMouseOut();
				onMouseLeave?.(event);
			}}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
				onBlur?.(event);
			}}
			onFocus={(event) => {
				setFocused(true);
				onFocus?.(event);
			}}
			onMouseMove={(event) => {
				handleMouseOver();
				onMouseMove?.(event);
			}}
			{...rest}
		>
			{showCustomControls && (
				<div className={css.controls}>
					{(controlOverrides !== undefined || !children) && controlMode === 'simple' && (
						<>
							<div className={css.controlsHeader}>
								{customControls.fullscreen && (
									<div className={css.left}>
										<IconButton
											actionName={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
											icon={'arrows.maximize'}
											{...buttonProps}
											onClick={() => {
												void handleFullScreen(!fullscreen).catch(() => undefined);
											}}
										/>
									</div>
								)}
								{captionsSrc && customControls.captions && (
									<button
										type="button"
										aria-label="Captions"
										aria-pressed={captionsOn}
										onClick={() => setCaptionsOn((value) => !value)}
									>
										CC
									</button>
								)}
								{customControls.volume && (
									<div className={css.right}>
										<IconButton
											actionName={isMuted ? 'Unmute' : 'Mute'}
											icon={speakerIcon}
											iconFill={true}
											{...buttonProps}
											onClick={() => handleMute()}
										/>
										<Slider
											aria-label="Volume"
											trackColor={'rgba(0,0,0,0.5)'}
											progressColor={'var(--core-text-light)'}
											trackHeadSize={0}
											trackHeadBorderWidth={0}
											max={1}
											min={0}
											value={currentVolume}
											onChange={(value) => handleVolumeChange(value)}
										/>
									</div>
								)}
							</div>
							<div className={css.controlsBody}>
								{customControls.play && (
									<ToggleButton
										{...buttonProps}
										actionName={isPlaying ? 'Pause' : 'Play'}
										selected={isPlaying}
										icon={'media.play-filled'}
										iconSelected={'media.pause-filled'}
										iconSize={32}
										backgroundColor="rgba(0, 0, 0, 0.25)"
										backgroundColorHover="rgba(0, 0, 0, 0.5)"
										backgroundColorSelected="rgba(0, 0, 0, 0.25)"
										buttonSize={'xl'}
										iconStrokeWidth={0}
										onChange={() => handlePlayClick()}
									/>
								)}
							</div>
							<div className={css.controlsFooter}>
								{customControls.progress && (
									<div className={css.progress}>
										<ToggleButton
											{...buttonProps}
											actionName={isPlaying ? 'Pause' : 'Play'}
											selected={isPlaying}
											icon={'media.play-filled'}
											iconSelected={'media.pause-filled'}
											iconStrokeWidth={0}
											onChange={() => handlePlayClick()}
										/>
										<Slider
											aria-label="Playback position"
											trackColor={'rgba(0,0,0,0.5)'}
											progressColor={'var(--core-text-light)'}
											trackHeadSize={0}
											trackHeadBorderWidth={0}
											max={1}
											min={0}
											value={currentProgress}
											onChange={handleSetProgress}
											onChangeEnd={handleScrubEnd}
											onPointerCancel={handleScrubEnd}
											onLostPointerCapture={handleScrubEnd}
											onBlur={handleScrubEnd}
											disabled={duration <= 0}
											width={'100%'}
										/>
										{customControls.quit && (
											<IconButton
												actionName="Close video"
												toggle={false}
												icon={'basic.cross'}
												{...buttonProps}
												onClick={() => onQuit?.()}
											/>
										)}
									</div>
								)}
							</div>
						</>
					)}
					{controlMode === 'custom' && (typeof children === 'function' ? children(controlsContext) : children)}
				</div>
			)}
			<video
				{...videoAttributes}
				aria-label={videoName.trim() || 'Video'}
				ref={videoRef}
				src={src}
				autoPlay={false}
				playsInline={playsInline}
				loop={loop}
				muted={isMuted}
				controls={controlMode === 'default'}
				poster={poster}
				onLoadStart={resetMedia}
				onEmptied={resetMedia}
				onWaiting={() => setCanPlay(false)}
				onPlaying={handlePlaying}
				onError={() => {
					setFailed(true);
					setCanPlay(false);
					setIsPlaying(false);
					if (playState.current !== PlayState.Stopped) onPlayStateChange?.(PlayState.Stopped);
					playState.current = PlayState.Stopped;
					onError?.(videoRef.current?.error ?? null);
				}}
				onVolumeChange={handleNativeVolumeChange}
				onDurationChange={() => {
					const value = videoRef.current?.duration;
					setDuration(value && Number.isFinite(value) ? value : 0);
				}}
				onCanPlayThrough={handleCanPlayThrough}
				onCanPlay={handleCanPlay}
				onPlay={handlePlay}
				onPause={handlePause}
				onEnded={handleEnd}
				onProgress={handleLoadProgress}
				onTimeUpdate={handlePlayProgress}
				onRateChange={handlePlaybackRate}
				onLoadedMetadata={handleLoadMetadata}
				onLoadedData={handleLoadedFrame}
				onSeeked={handleSeekEnd}
				className={[css.video, videoAttributes?.className].filter(Boolean).join(' ')}
			>
				{captionsSrc && (
					<track
						kind="captions"
						src={captionsSrc}
						srcLang={captionsLanguage}
						label={captionsLabel}
						default={captionsDefault}
						onLoad={syncCaptions}
					/>
				)}
			</video>
			{failed && <span role="alert">Unable to load video.</span>}
			{!failed && !canPlay && showProgressIndicator && <ProgressIndicator show label="Loading video" />}
		</div>
	);
});

BaseVideo.displayName = 'Video';

// A new source owns a fresh media lifecycle, including refs, loading state, and scrubbing.
export const Video: React.ForwardRefExoticComponent<VideoProps & React.RefAttributes<VideoElement>> = React.memo(
	React.forwardRef<VideoElement, VideoProps>((props, ref) => <BaseVideo key={props.src ?? ''} {...props} ref={ref} />),
);
Video.displayName = 'Video';

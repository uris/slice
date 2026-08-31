'use client';

import React, {
	type SyntheticEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { setStyle } from '../../utils/functions/misc';
import { IconButton } from '../IconButton';
import { Slider } from '../Slider';
import { ToggleButton } from '../ToggleButton';
import css from './Video.module.css';
import { PlayState, type VideoElement, type VideoProps } from './_types';

const BaseVideo = React.forwardRef<VideoElement, VideoProps>((props, ref) => {
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
		playRate = 1,
		width = '100%',
		height = 'auto',
		borderRadius,
		borderSize,
		borderColor,
		backgroundColor,
		objectFit = 'contain',
		customControls = {
			play: false,
			progress: true,
			volume: true,
			fullscreen: true,
		},
		onPlay,
		onPause,
		onEnd,
		onProgress,
		onLoadProgress,
		onPlaybackRateChange,
		onCanPlayThrough,
		onPlayStateChange,
		onLoadMetaData,
		onFullScreenChange,
		onVolumeChange,
		onLoadedFrameData,
		onQuit,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const progress = useRef<number | null>(null);
	const wasPlaying = useRef<boolean>(playing ?? false);
	const playState = useRef<PlayState | null>(PlayState.Stopped); // normalize play state events
	const [isPlaying, setIsPlaying] = useState<boolean>(playing ?? false);
	const [isMuted, setIsMuted] = useState<boolean>(muted ?? false);
	const [currentVolume, setCurrentVolume] = useState<number>(volume ?? 1);
	const [currentProgress, setCurrentProgress] = useState<number>(0);
	const [hovered, setHovered] = useState<boolean>(false);
	const timer = useRef<NodeJS.Timeout | null>(null);

	// get the percent loaded from the video element via buffer
	const handleLoadProgress = useCallback(
		(event: SyntheticEvent<HTMLElement, Event>) => {
			const target = event.target as HTMLVideoElement;

			if (target.buffered.length > 0) {
				// Get the end time of the last buffered range
				const bufferedEnd = target.buffered.end(target.buffered.length - 1);
				const duration = target.duration;

				if (duration > 0) {
					const percentLoaded = bufferedEnd / duration;
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
			const percentPlayed = target.currentTime / target.duration;
			setCurrentProgress(percentPlayed);
			if (progress.current !== percentPlayed) {
				onProgress?.(percentPlayed);
				progress.current = percentPlayed;
				const isAtZero = videoRef.current?.currentTime === 0;
				const isAtEnd =
					videoRef.current?.currentTime === videoRef.current?.duration;
				if (isAtZero && target.paused) {
					if (playState.current !== PlayState.Stopped)
						onPlayStateChange?.(PlayState.Stopped);
					playState.current = PlayState.Stopped;
				} else if (isAtEnd) {
					if (playState.current !== PlayState.Ended)
						onPlayStateChange?.(PlayState.Ended);
					playState.current = PlayState.Ended;
				} else {
					if (target.paused && playState.current !== PlayState.Paused) {
						onPlayStateChange?.(PlayState.Paused);
						playState.current = PlayState.Paused;
					} else if (
						!target.paused &&
						playState.current !== PlayState.Playing
					) {
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

	// handle playing event
	const handlePlay = useCallback(() => {
		if (videoRef.current?.paused) videoRef.current.play().then(() => null);
		onPlay?.();
		setIsPlaying(true);
		const isAtEnd =
			videoRef.current?.currentTime === videoRef.current?.duration;
		if (isAtEnd) {
			if (playState.current !== PlayState.Ended)
				onPlayStateChange?.(PlayState.Ended);
			playState.current = PlayState.Ended;
		} else if (playState.current !== PlayState.Playing) {
			onPlayStateChange?.(PlayState.Playing);
			playState.current = PlayState.Playing;
		}
	}, [onPlay, onPlayStateChange]);

	// handle pause event
	const handlePause = useCallback(() => {
		onPause?.();
		setIsPlaying(false);
		const isAtZero = videoRef.current?.currentTime === 0;
		const isAtEnd =
			videoRef.current?.currentTime === videoRef.current?.duration;
		if (!isAtEnd && !isAtZero) {
			if (playState.current !== PlayState.Paused) {
				onPlayStateChange?.(PlayState.Paused);
				playState.current = PlayState.Paused;
			}
		}
	}, [onPause, onPlayStateChange]);

	// handle end event
	const handleEnd = useCallback(() => {
		onEnd?.();
	}, [onEnd]);

	// handle load metadata
	const handleLoadMetadata = useCallback(
		(event: SyntheticEvent<HTMLElement, Event>) => {
			const target = event.target as HTMLVideoElement;
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

	// handle play button click
	const handlePlayClick = useCallback((play?: boolean) => {
		const video = videoRef.current;
		if (!video) return;
		let setPlaying = video.paused;
		if (play !== undefined) setPlaying = play;
		if (setPlaying) {
			video
				.play()
				.then(() => null)
				.catch(() => null);
		} else {
			video.pause();
		}
	}, []);

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

	// handle full screen
	const handleFullScreen = useCallback((state = true) => {
		const video = videoRef.current;
		if (!video) return;
		if (state) video.requestFullscreen().catch(() => null);
		else if (document.fullscreenElement === video)
			document.exitFullscreen().catch(() => null);
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
		let nextRate = rate;
		if (rate < 0.5) nextRate = 0.5;
		if (rate > 3) nextRate = 3;
		videoRef.current.playbackRate = nextRate;
	}, []);

	// restart video
	const handleRestart = useCallback(() => {
		if (!videoRef.current) return;
		videoRef.current.pause();
		videoRef.current.currentTime = 0;
		videoRef.current.play().then(() => null);
	}, []);

	// set volume
	const handleVolumeChange = useCallback(
		(volume = 1) => {
			if (!videoRef.current) return;
			let nextVolume = volume;
			if (volume < 0) nextVolume = 0;
			if (volume > 1) nextVolume = 1;
			videoRef.current.volume = nextVolume;
			setCurrentVolume(nextVolume);
			onVolumeChange?.(nextVolume);
		},
		[onVolumeChange],
	);

	// handle set progress
	const handleSetProgress = useCallback((progress: number) => {
		if (videoRef.current) {
			if (!wasPlaying.current) wasPlaying.current = !videoRef.current.paused;
			videoRef.current.pause();
			videoRef.current.currentTime = progress * videoRef.current.duration;
		}
	}, []);

	// handle seeking
	const handleSeekEnd = useCallback(() => {
		if (wasPlaying.current) {
			handlePlayClick(true);
			wasPlaying.current = false;
		}
	}, [handlePlayClick]);

	// emit fullscreen changes from the browser event as the single source of truth
	const handleFullScreenChange = useCallback(() => {
		const isFullscreen = document.fullscreenElement === videoRef.current;
		onFullScreenChange?.(isFullscreen);
	}, [onFullScreenChange]);

	// did load the current frame
	const handleLoadedFrame = useCallback(() => {
		onLoadedFrameData?.();
	}, [onLoadedFrameData]);

	React.useImperativeHandle(
		ref,
		() => ({
			play: async () => {
				handlePlayClick(true);
			},
			stop: async () => {
				handlePlayClick(false);
			},
			restart: async () => {
				handleRestart();
			},
			setVolume: (volume: number) => {
				handleVolumeChange(volume);
			},
			mute: (mute: boolean) => {
				handleMute(mute);
			},
			fullscreen: (state: boolean) => {
				handleFullScreen(state);
			},
			playbackRate: (rate: number) => {
				handleRateChange(rate);
			},
			get videoElement() {
				return videoRef.current ?? undefined;
			},
		}),
		[
			handlePlayClick,
			handleRestart,
			handleMute,
			handleFullScreen,
			handleRateChange,
			handleVolumeChange,
		],
	);

	const showCustomControls = useMemo(() => {
		return controls !== 'default' && controls !== 'none';
	}, [controls]);

	// memo dynamic CSS
	const cssVars = useMemo(() => {
		return {
			'--video-width': setStyle(width, 'unset'),
			'--video-height': setStyle(height, 'unset'),
			'--video-border-radius': setStyle(borderRadius, 0),
			'--video-border-size': setStyle(borderSize, 0),
			'--video-border-color': setStyle(borderColor, 'transparent'),
			'--video-bg-color': setStyle(backgroundColor, 'transparent'),
			'--video-object-fit': objectFit ?? 'contain',
			'--video-controls-pointer-events': hovered ? 'auto' : 'none',
			'--video-controls-opacity': hovered ? 1 : 0,
			'--video-progress-padding-left': customControls.quit ? '8px' : '16px',
		} as React.CSSProperties;
	}, [
		width,
		height,
		borderRadius,
		borderSize,
		borderColor,
		backgroundColor,
		objectFit,
		hovered,
		customControls.quit,
	]);

	// memo speaker icon
	const speakerIcon = useMemo(() => {
		if (isMuted || currentVolume === 0) return 'speaker muted';
		if (currentVolume > 0 || !isMuted) return 'speaker';
		return 'speaker';
	}, [isMuted, currentVolume]);

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

	// attach seek end event listener -> used to restart video when scrubbing with custom controls to avoid
	// playback issues trying to play when seeking is active (on safari sometimes stops audio)
	useEffect(() => {
		videoRef.current?.addEventListener('seeked', handleSeekEnd);
		videoRef.current?.addEventListener('loadeddata', handleLoadedFrame);
		document.addEventListener('fullscreenchange', handleFullScreenChange);
		return () => {
			videoRef.current?.removeEventListener('seeked', handleSeekEnd);
			videoRef.current?.removeEventListener('loadeddata', handleLoadedFrame);
			document.removeEventListener('fullscreenchange', handleFullScreenChange);
		};
	}, [handleSeekEnd, handleFullScreenChange, handleLoadedFrame]);

	return (
		<div
			id={divId}
			ref={containerRef}
			className={`${css.wrapper}${divClass}`}
			style={{ ...cssVars, ...divStyle }}
			onMouseEnter={handleMouseOver}
			onMouseLeave={handleMouseOut}
			onBlur={handleMouseOut}
			onFocus={handleMouseOver}
			onMouseMove={handleMouseOver}
			{...rest}
		>
			{showCustomControls && (
				<div className={css.controls}>
					{!children && controls === 'simple' && (
						<div className={css.controls}>
							<div className={css.controlsHeader}>
								{customControls.fullscreen && (
									<div className={css.left}>
										<IconButton
											icon={'fullscreen'}
											iconFill={true}
											buttonSize={'m'}
											iconSize={18}
											bgColor={'rgba(255,255,255,0.05)'}
											bgColorHover={'rgba(0,0,0,0.7)'}
											iconColor={'var(--core-text-light)'}
											iconColorHover={'var(--core-text-light)'}
											onClick={() => handleFullScreen(true)}
										/>
									</div>
								)}
								{customControls.volume && (
									<div className={css.right}>
										<IconButton
											icon={speakerIcon}
											iconFill={true}
											buttonSize={'m'}
											iconSize={20}
											bgColor={'rgba(255,255,255,0.05)'}
											bgColorHover={'rgba(0,0,0,0.7)'}
											bgColorOn={'rgba(0,0,0,0.5)'}
											iconColor={'var(--core-text-light)'}
											iconColorHover={'var(--core-text-light)'}
											onClick={() => handleMute()}
										/>
										<Slider
											trackColor={'rgba(0,0,0,0.5)'}
											progressColor={'var(--core-text-light)'}
											trackHeadSize={16}
											trackHeadBorderSize={0}
											scaleMax={1}
											scaleMin={0}
											value={currentVolume}
											onChange={(value) => handleVolumeChange(value)}
										/>
									</div>
								)}
							</div>
							<div className={css.controlsBody}>
								{customControls.play && (
									<ToggleButton
										selected={isPlaying}
										icon={'play'}
										iconOn={'pause'}
										iconSize={48}
										buttonSize={'xl'}
										bgColor={'rgba(0,0,0,0.5)'}
										bgColorHover={'rgba(0,0,0,0.7)'}
										bgColorOn={'rgba(0,0,0,0.5)'}
										iconColor={'var(--core-text-light)'}
										iconColorOn={'var(--core-text-light)'}
										iconColorHover={'var(--core-text-light)'}
										onChange={() => handlePlayClick()}
									/>
								)}
							</div>
							<div className={css.controlsFooter}>
								{customControls.progress && (
									<div className={css.progress}>
										<ToggleButton
											selected={isPlaying}
											icon={'play'}
											iconOn={'pause'}
											buttonSize={'m'}
											iconSize={28}
											bgColor={'rgba(255,255,255,0.05)'}
											bgColorHover={'rgba(0,0,0,0.7)'}
											bgColorOn={'rgba(255,255,255,0.05)'}
											iconColor={'var(--core-text-light)'}
											iconColorHover={'var(--core-text-light)'}
											iconColorOn={'var(--core-text-light)'}
											onChange={() => handlePlayClick()}
										/>
										<Slider
											trackColor={'rgba(0,0,0,0.5)'}
											progressColor={'var(--core-text-light)'}
											trackHeadSize={16}
											trackHeadBorderSize={0}
											scaleMax={1}
											scaleMin={0}
											value={currentProgress}
											onChange={handleSetProgress}
											width={'100%'}
										/>
										{customControls.quit && (
											<IconButton
												toggle={false}
												icon={'x'}
												buttonSize={'m'}
												bgColor={'rgba(255,255,255,0.05)'}
												bgColorHover={'rgba(0,0,0,0.7)'}
												bgColorOn={'rgba(255,255,255,0.05)'}
												iconColor={'var(--core-text-light)'}
												iconColorHover={'var(--core-text-light)'}
												iconColorOn={'var(--core-text-light)'}
												onClick={() => onQuit?.()}
											/>
										)}
									</div>
								)}
							</div>
						</div>
					)}
					{controls === 'custom' && children}
				</div>
			)}
			<video
				ref={videoRef}
				src={src}
				autoPlay={false}
				playsInline={playsInline}
				loop={loop}
				muted={isMuted}
				controls={controls === 'default'}
				poster={poster}
				onCanPlayThrough={handleCanPlayThrough}
				onPlay={handlePlay}
				onPause={handlePause}
				onEnded={handleEnd}
				onProgress={handleLoadProgress}
				onTimeUpdate={handlePlayProgress}
				onRateChange={handlePlaybackRate}
				onLoadedMetadata={handleLoadMetadata}
				className={css.video}
			>
				<track kind="captions" src={captionsSrc} />
			</video>
		</div>
	);
});

BaseVideo.displayName = 'Video';

export const Video = React.memo(BaseVideo);

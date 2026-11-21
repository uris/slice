import {
	AudioBubble,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	DropDown,
	type MicOption,
	ToggleButton,
} from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';
import { useTipActions } from '@apple-pie/slice/stores';
import { WebRTCConnection } from '@apple-pie/slice/utils';
import { useEffect, useRef, useState } from 'react';
import css from '../Overview.module.css';
import { Row } from '../Shared';

export function VoiceNote() {
	const pushTip = useTipActions().push;
	const [deviceId, setDeviceId] = useState<string>();
	const microphone = useMicrophone(false, undefined, false);
	const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
	const [switchingMic, setSwitchingMic] = useState(false);
	const [soundOn, setSoundOn] = useState(true);
	const [remoteAudio, setRemoteAudio] = useState<MediaStream | null>(null);
	const [error, setError] = useState('');
	const connection = useRef<WebRTCConnection | null>(null);
	const attempt = useRef<AbortController | null>(null);
	const monitor = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
	const audio = useRef<HTMLAudioElement>(null);
	const stopMicrophone = microphone.stopMicrophone;

	const release = () => {
		attempt.current?.abort();
		attempt.current = null;
		clearInterval(monitor.current);
		connection.current?.close();
		connection.current = null;
		stopMicrophone();
	};
	const disconnect = () => {
		release();
		setStatus('idle');
		setRemoteAudio(null);
	};
	useEffect(
		() => () => {
			attempt.current?.abort();
			clearInterval(monitor.current);
			connection.current?.close();
			stopMicrophone();
		},
		[stopMicrophone],
	);

	const connect = async () => {
		if (attempt.current) return;
		const controller = new AbortController();
		attempt.current = controller;
		const isCurrent = () => attempt.current === controller && !controller.signal.aborted;
		setStatus('connecting');
		setError('');
		try {
			if (deviceId) await microphone.setMicrophone(deviceId);
			else await microphone.requestMicrophone();
			const stream = microphone.micStream.current;
			if (!isCurrent()) {
				stopMicrophone();
				return;
			}
			if (!stream) throw new Error('Microphone access is required to talk.');
			const response = await fetch('/server/openai/realtime/session/request', {
				method: 'POST',
				signal: controller.signal,
			});
			const session = await response.json();
			if (!response.ok) throw new Error(session.message ?? 'Unable to start the voice session.');
			if (typeof session.value !== 'string' || !session.value) throw new Error('No voice session token was returned.');
			if (!isCurrent()) return;
			let greeted = false;
			const rtc = new WebRTCConnection({
				connectionUrl: 'https://api.openai.com/v1/realtime/calls',
				micStream: microphone.processedMicStream.current ?? stream,
				audioElement: audio.current ?? undefined,
				dataChannels: ['oai-events'],
				onDataChannelEvent: (channel, event) => {
					if (event !== 'open' || greeted || !isCurrent()) return;
					greeted = true;
					rtc.sendMessage(channel, {
						type: 'response.create',
						response: { instructions: 'Say exactly: "Hi there. How can I help you today?"' },
					});
				},
				onRemoteAudioStream: (streams) => {
					if (isCurrent()) setRemoteAudio(streams.values().next().value ?? null);
				},
			});
			connection.current = rtc;
			let wasConnected = false;
			const deadline = Date.now() + 30000;
			monitor.current = setInterval(() => {
				if (!isCurrent()) return;
				if (rtc.connected) {
					if (!wasConnected) {
						wasConnected = true;
						setStatus('connected');
					}
				} else if (wasConnected || Date.now() > deadline) {
					disconnect();
					setError(wasConnected ? 'The voice session ended.' : 'The voice connection timed out. Please try again.');
				}
			}, 250);
			await rtc.initialize(undefined, session.value);
		} catch (cause) {
			if (!isCurrent()) return;
			disconnect();
			setError(cause instanceof Error ? cause.message : 'Unable to connect. Please try again.');
		}
	};
	const changeMicrophone = async (option: { value: MicOption }) => {
		const nextId = option.value.id;
		const rtc = connection.current;
		if (!rtc) {
			setDeviceId(nextId);
			return;
		}
		setSwitchingMic(true);
		setError('');
		try {
			await microphone.setMicrophone(nextId);
			if (connection.current !== rtc) {
				stopMicrophone();
				return;
			}
			const stream = microphone.processedMicStream.current;
			if (!stream) throw new Error('Unable to switch microphone.');
			await rtc.setOutgoingAudioStream(stream);
			setDeviceId(nextId);
		} catch (cause) {
			if (connection.current !== rtc) return;
			disconnect();
			setError(cause instanceof Error ? cause.message : 'Unable to switch microphone.');
		} finally {
			setSwitchingMic(false);
		}
	};
	const busy = status === 'connecting';
	const connected = status === 'connected';
	const micDisabled = !connected || switchingMic;
	const noMicrophones = microphone.micOptions.length === 0;
	return (
		<Card role="group" aria-label="AI Assistant" padding={20} className={css.card} style={{ width: '100%' }}>
			<CardTitle>
				<Row>
					<div>
						<div className={css.small}>AI Assistant</div>
						<div className="body-xxl-regular">Let’s talk</div>
					</div>
					<div style={{ display: 'flex', gap: 16 }}>
						<ToggleButton
							className={css.assistantAction}
							icon={microphone.muted ? 'media.mic-slash' : 'media.mic'}
							actionName={microphone.muted ? 'Unmute assistant microphone' : 'Mute assistant microphone'}
							tooltip={microphone.muted ? 'Unmute microphone' : 'Mute microphone'}
							onToolTip={pushTip}
							selected={connected && !microphone.muted}
							disabled={micDisabled}
							onClick={microphone.toggleMute}
							borderRadius={100}
							padding={0}
							style={{ width: 32, height: 32 }}
							backgroundColor={micDisabled ? 'core-surface-secondary' : 'core-text-special'}
							backgroundColorHover="core-text-special"
							backgroundColorSelected={micDisabled ? 'core-surface-secondary' : 'core-text-special'}
							iconColor={micDisabled ? 'core-text-primary' : 'core-surface-primary'}
							iconColorHover="core-surface-primary"
							iconColorSelected={micDisabled ? 'core-text-primary' : 'core-surface-primary'}
						/>
						<ToggleButton
							className={css.assistantAction}
							icon={soundOn ? 'media.volume-high' : 'media.volume-slash'}
							actionName={soundOn ? 'Mute assistant sound' : 'Unmute assistant sound'}
							tooltip={soundOn ? 'Mute sound' : 'Unmute sound'}
							onToolTip={pushTip}
							selected={soundOn}
							onChange={setSoundOn}
							borderRadius={100}
							padding={0}
							style={{ width: 32, height: 32 }}
							backgroundColor="core-text-special"
							backgroundColorHover="core-text-special"
							backgroundColorSelected="core-text-special"
							iconColor="core-surface-primary"
							iconColorHover="core-surface-primary"
							iconColorSelected="core-surface-primary"
						/>
					</div>
				</Row>
			</CardTitle>
			<CardContent>
				<div className={css.stack}>
					<div className={css.audio} style={{ flexDirection: 'column', minHeight: 140, gap: 16 }}>
						<AudioBubble
							audioStream={remoteAudio}
							playing={connected}
							size={64}
							minScale={1}
							maxScale={1.7}
							intensity={2.5}
							backgroundColor={!connected ? 'core-text-disabled' : 'core-text-special'}
						/>
					</div>
					{error && (
						<p role="alert" className={css.muted}>
							{error}
						</p>
					)}
				</div>
				<audio ref={audio} autoPlay muted={!soundOn} />
			</CardContent>
			<CardFooter>
				<div className={css.stack}>
					<DropDown<MicOption>
						label="Mic"
						valueKey="id"
						value={{ id: connected && !noMicrophones ? (deviceId ?? microphone.currentDeviceId ?? '') : '' }}
						placeholder={!connected || noMicrophones}
						options={
							connected && !noMicrophones
								? microphone.micOptions
								: [{ label: 'Not connected', value: { id: '' }, disabled: true }]
						}
						onChangeOption={(option) => void changeMicrophone(option)}
						disabled={!connected || switchingMic || noMicrophones}
					/>
					<Button
						variant="primary"
						width="fill"
						label={connected ? 'Disconnect' : 'Talk to Assistant'}
						working={busy}
						disabled={switchingMic}
						onClick={() => {
							if (connected) disconnect();
							else void connect();
						}}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}

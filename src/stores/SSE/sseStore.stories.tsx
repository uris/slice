import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Spacer } from '../../components/Spacer';
import { TextField } from '../../components/Textfield';
import { useIsConnected, useMessage, useSSE, useSSEStore } from './sseStore';

type SSELogEntry = {
	id: string;
	timestamp: string;
	type: string;
	value: string;
};

const CONNECTION_NAME = 'sse-test';
const DEFAULT_SSE_TEST_URL = '';
const DEFAULT_CUSTOM_EVENT = '';

function formatTimestamp(value: string | number | Date) {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatValue(value: unknown) {
	if (value == null) return 'waiting...';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	if (value instanceof Date) {
		return formatTimestamp(value);
	}
	if (typeof value === 'object') {
		const record = value as Record<string, unknown>;
		const timestamp = record.timestamp ?? record.timeStamp ?? record.time ?? record.date;
		if (typeof timestamp === 'string' || typeof timestamp === 'number' || timestamp instanceof Date) {
			return JSON.stringify({
				...record,
				[timestamp instanceof Date
					? 'timestamp'
					: (Object.keys(record).find((key) => record[key] === timestamp) ?? 'timestamp')]: formatTimestamp(timestamp),
			});
		}
	}
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

function formatEventType(type: string) {
	if (type === 'open' || type === 'error' || type === 'close' || type === 'message') return type;
	if (type === 'disconnect') return 'disconnect';
	return `${type} [Custom Event]`;
}

function SSEStoreDemo() {
	const { addConnection, removeConnection } = useSSE();
	const connections = useSSEStore((state) => state.connections);
	const isConnected = useIsConnected(CONNECTION_NAME);
	const lastMessage = useMessage();
	const [url, setUrl] = useState(DEFAULT_SSE_TEST_URL);
	const [customEventName, setCustomEventName] = useState(DEFAULT_CUSTOM_EVENT);
	const [eventLog, setEventLog] = useState<SSELogEntry[]>([]);

	const connect = () => {
		addConnection(CONNECTION_NAME, {
			url,
			customEvents: customEventName ? [{ name: customEventName }] : undefined,
		});
	};

	useEffect(() => {
		return () => removeConnection(CONNECTION_NAME);
	}, [removeConnection]);

	useEffect(() => {
		if (!lastMessage) return;

		const now = formatTimestamp(new Date());

		const value =
			lastMessage.type === 'open' || lastMessage.type === 'error' ? '[Event]' : formatValue((lastMessage as any).data);

		setEventLog((current) => [
			{
				id: `${Date.now()}-${current.length}`,
				timestamp: now,
				type: lastMessage.type,
				value,
			},
			...current,
		]);
	}, [lastMessage]);

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'start'} padding={24}>
			<FlexDiv
				width={640}
				height={'auto'}
				direction={'column'}
				gap={12}
				padding={20}
				border={'1px solid var(--core-outline-primary)'}
			>
				<h1>{`SEE Connection ${connections.length > 0 ? ': Active' : ''}`}</h1>
				Slice does not provide a test SSE end point. You'll need to enter own custom SSE enabled URL. If your endpoint
				supports it, you can also provide 1 (one) optional custom event to listen for (event names are case sensitive).
				<Spacer size={12} />
				<TextField
					label={'URL:'}
					name={'sse-url'}
					value={url}
					placeholder={'https://www.example.com/api/sse/see-test'}
					onChange={(value) => setUrl(value)}
				/>
				<TextField
					label={'Custom event (optional):'}
					name={'custom-event'}
					value={customEventName}
					placeholder={'Enter a custom event name'}
					onChange={(value) => setCustomEventName(value)}
				/>
				<FlexDiv gap={12} direction={'row'} background={'transparent'}>
					<Button
						variant={'solid'}
						label={isConnected ? 'Reconnect' : 'Connect'}
						onClick={() => {
							setEventLog([]);
							removeConnection(CONNECTION_NAME);
							connect();
						}}
						state={isConnected || !url ? 'disabled' : 'normal'}
					/>
					<Button
						destructive={true}
						label={'Disconnect'}
						onClick={() => {
							removeConnection(CONNECTION_NAME);
							setEventLog((current) => [
								{
									id: `${Date.now()}-disconnect`,
									timestamp: formatTimestamp(new Date()),
									type: 'disconnect',
									value: '[Disconnected]',
								},
								...current,
							]);
						}}
						state={isConnected ? 'normal' : 'disabled'}
					/>
					<Button
						label={'Clear log'}
						onClick={() => setEventLog([])}
						state={eventLog.length === 0 ? 'disabled' : 'normal'}
					/>
				</FlexDiv>
				<FlexDiv direction={'column'} gap={8} padding={8}>
					<strong>Event log</strong>
					{eventLog.length === 0 ? (
						<div>waiting for an active connection...</div>
					) : (
						eventLog.map((entry) => (
							<div key={entry.id}>
								{entry.timestamp} - {formatEventType(entry.type)}: {entry.value}
							</div>
						))
					)}
				</FlexDiv>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof SSEStoreDemo> = {
	title: 'Stores/SSE Store',
	component: SSEStoreDemo,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

export const Demo: StoryObj<typeof SSEStoreDemo> = {};

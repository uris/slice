import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Spacer } from '../../components/Spacer';
import { TextField } from '../../components/Textfield';
import { useIsConnected, useMessage, useWS, useWSStore } from './wsStore';

type WSLogEntry = {
	id: string;
	timestamp: string;
	type: string;
	value: string;
};

const CONNECTION_NAME = 'ws-test';
const DEFAULT_WS_TEST_URL = '';

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
	if (value instanceof Blob) {
		return `[Blob ${value.type || 'application/octet-stream'} ${value.size}b]`;
	}
	if (value instanceof ArrayBuffer) {
		return `[ArrayBuffer ${value.byteLength}b]`;
	}
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

function WSStoreDemo() {
	const { addConnection, removeConnection } = useWS();
	const connections = useWSStore((state) => state.connections);
	const connection = useWSStore((state) => state.connections.find((entry) => entry.name === CONNECTION_NAME));
	const isConnected = useIsConnected(CONNECTION_NAME);
	const lastMessage = useMessage();
	const [url, setUrl] = useState(DEFAULT_WS_TEST_URL);
	const [messageToSend, setMessageToSend] = useState('');
	const [eventLog, setEventLog] = useState<WSLogEntry[]>([]);

	const addLogEntry = (type: string, value: string) => {
		setEventLog((current) => [
			{
				id: `${Date.now()}-${current.length}`,
				timestamp: formatTimestamp(new Date()),
				type,
				value,
			},
			...current,
		]);
	};

	const connect = () => {
		addConnection(CONNECTION_NAME, {
			url,
			autoReconnect: true,
			reconnectInterval: 1000,
			reconnectAttempts: 5,
			reconnectFalloff: true,
		});
	};

	useEffect(() => {
		return () => removeConnection(CONNECTION_NAME);
	}, [removeConnection]);

	useEffect(() => {
		if (!lastMessage) return;

		const now = formatTimestamp(new Date());
		const value =
			lastMessage.type === 'open' || lastMessage.type === 'error' || lastMessage.type === 'close'
				? '[Event]'
				: formatValue(lastMessage.data);

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
				<h1>{`WS Connection ${connections.length > 0 ? ': Active' : ''}`}</h1>
				Slice does not provide a test websocket end point. You'll need to enter your own websocket URL.
				<Spacer size={12} />
				<TextField
					label={'URL:'}
					name={'ws-url'}
					value={url}
					placeholder={'wss://www.example.com/api/ws/ws-test'}
					onChange={(value) => setUrl(value)}
				/>
				<FlexDiv direction={'row'} gap={12}>
					<TextField
						label={'Test message:'}
						name={'ws-test-message'}
						value={messageToSend}
						placeholder={'Enter text message to send'}
						onChange={(value) => setMessageToSend(value)}
						onSubmit={(value) => {
							connection?.connection.send(value);
							addLogEntry('send [Outbound Event]', value);
							setMessageToSend('');
						}}
						disabled={!isConnected}
					/>
					<Button
						round
						onClick={() => {
							connection?.connection.send(messageToSend);
							addLogEntry('send [Outbound Event]', messageToSend);
							setMessageToSend('');
						}}
						iconLeft={'arrow right'}
						state={isConnected && messageToSend.trim() ? 'normal' : 'disabled'}
					/>
				</FlexDiv>
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
								{entry.timestamp} - {entry.type}: {entry.value}
							</div>
						))
					)}
				</FlexDiv>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof WSStoreDemo> = {
	title: 'Stores/WS Store',
	component: WSStoreDemo,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

export const Demo: StoryObj<typeof WSStoreDemo> = {};

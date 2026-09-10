import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { TextArea } from '../../components/TextArea';
import { TextField } from '../../components/Textfield';
import { useMDStreamBuffer } from './useMdStreamBuffer';

const DEFAULT_MARKDOWN = `This is an inline select: $$Option 1$$Option 2$$Option 3$$ and this text should appear only after the closing marker is followed by a space.

##### Streaming markdown

This is a **very long piece of bold text**.
This is a [link](https://example.com).
This is an image: ![image](https://example.com/image.png)

This select should reveal only completed options while streaming.`;

type MDStreamBufferHookDemoProps = {
	raw: string;
	chunkSize: number;
	intervalMs: number;
	healthyEndMarker: string;
	includeLinksAndImages: boolean;
	htmlHandling: 'ignore' | 'strip';
	simulateStream?: boolean;
};

type MDStreamBufferHookRunnerProps = {
	raw: string;
	chunkSize: string;
	intervalMs: string;
	healthyEndMarker: string;
	includeLinksAndImages: boolean;
	htmlHandling: 'ignore' | 'strip';
	simulateStream: boolean;
};

function MDStreamBufferHookRunner(props: Readonly<MDStreamBufferHookRunnerProps>) {
	const { raw, chunkSize, intervalMs, healthyEndMarker, includeLinksAndImages, htmlHandling, simulateStream } = props;
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const cursorRef = useRef(0);
	const [playing, setPlaying] = useState(false);
	const {
		raw: streamRaw,
		healthy,
		append,
		flush,
		complete,
		reset,
	} = useMDStreamBuffer({
		healthyEndMarker,
		includeLinksAndImages,
		htmlHandling,
	});

	useEffect(() => {
		if (simulateStream) return;
		reset();
		append(raw);
		flush();
	}, [append, flush, raw, reset, simulateStream]);

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, []);

	const stopStream = () => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setPlaying(false);
	};

	const resetStream = () => {
		stopStream();
		cursorRef.current = 0;
		reset();
	};

	const streamNextChunk = () => {
		const parsedChunkSize = Math.max(Number.parseInt(chunkSize, 10) || 1, 1);
		const parsedInterval = Math.max(Number.parseInt(intervalMs, 10) || 16, 0);
		const nextChunk = raw.slice(cursorRef.current, cursorRef.current + parsedChunkSize);

		if (!nextChunk) {
			complete();
			stopStream();
			return;
		}

		cursorRef.current += nextChunk.length;
		append(nextChunk);

		timerRef.current = setTimeout(() => {
			streamNextChunk();
		}, parsedInterval);
	};

	const startStream = () => {
		resetStream();
		setPlaying(true);
		streamNextChunk();
	};

	return (
		<FlexDiv width={'fill'} height={'fit'} gap={16}>
			{simulateStream && (
				<FlexDiv
					width={'fill'}
					height={'fit'}
					direction={'row'}
					gap={12}
					background={'transparent'}
					wrap={true}
					align={'end'}
				>
					<Button
						label={playing ? 'Streaming...' : 'Play'}
						onClick={startStream}
						state={playing ? 'disabled' : 'normal'}
					/>
					<Button label={'Stop'} onClick={stopStream} state={playing ? 'normal' : 'disabled'} />
					<Button label={'Reset'} onClick={resetStream} />
				</FlexDiv>
			)}
			<FlexDiv width={'fill'} height={'fit'} direction={'row'} gap={12}>
				{simulateStream && (
					<FlexDiv
						width={'fill'}
						height={'fit'}
						padding={16}
						gap={12}
						border={'1px solid var(--core-outline-primary)'}
						borderRadius={12}
						background={'black'}
					>
						<strong>Raw Markdown Stream</strong>
						<pre
							style={{
								margin: 0,
								padding: 0,
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
								fontFamily: 'monospace',
								fontSize: '12px',
							}}
						>
							{streamRaw}
						</pre>
					</FlexDiv>
				)}
				<FlexDiv
					width={'fill'}
					height={'fill'}
					padding={16}
					gap={12}
					border={'1px solid var(--core-outline-primary)'}
					borderRadius={12}
					background={'black'}
				>
					<strong>Healthy Markdown Stream</strong>
					<pre
						style={{
							margin: 0,
							padding: 0,
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							borderRadius: 8,
							fontFamily: 'monospace',
							fontSize: '12px',
							width: '100%',
						}}
					>
						{healthy}
					</pre>
				</FlexDiv>
			</FlexDiv>
		</FlexDiv>
	);
}

function MDStreamBufferHookDemo(props: Readonly<MDStreamBufferHookDemoProps>) {
	const {
		raw: sourceMarkdown,
		chunkSize: initialChunkSize,
		intervalMs: initialIntervalMs,
		healthyEndMarker,
		includeLinksAndImages,
		htmlHandling,
		simulateStream = true,
	} = props;
	const [raw, setRaw] = useState(sourceMarkdown);
	const [chunkSize, setChunkSize] = useState(String(initialChunkSize));
	const [intervalMs, setIntervalMs] = useState(String(initialIntervalMs));
	const [endMarker, setEndMarker] = useState(healthyEndMarker);

	useEffect(() => {
		setRaw(sourceMarkdown);
	}, [sourceMarkdown]);

	useEffect(() => {
		setChunkSize(String(initialChunkSize));
	}, [initialChunkSize]);

	useEffect(() => {
		setIntervalMs(String(initialIntervalMs));
	}, [initialIntervalMs]);

	useEffect(() => {
		setEndMarker(healthyEndMarker);
	}, [healthyEndMarker]);

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} padding={64} gap={16}>
			This hook wraps `MdBuffer` for React apps and exposes raw plus healthy stream state without manually instantiating
			the underlying class. Inline selects using `$$Option 1$$Option 2$$Option 3$$ ` close only when the last `$$` is
			followed by whitespace. `healthyEndMarker` is appended only to healthy output and is inserted before optimistic
			newline closures.
			<FlexDiv
				width={'fill'}
				height={'fit'}
				padding={16}
				gap={12}
				border={'1px solid var(--core-outline-primary)'}
				borderRadius={12}
				background={'var(--core-surface-secondary)'}
			>
				<strong>{simulateStream ? 'Source markdown' : 'Raw markdown'}</strong>
				<TextArea
					name={'hook-markdown-stream-buffer-input'}
					placeholder={'Enter raw markdown here...'}
					value={raw}
					onChange={setRaw}
					rows={3}
					border={true}
					resizable={true}
					backgroundColor={'var(--core-surface-primary)'}
				/>
			</FlexDiv>
			{simulateStream && (
				<FlexDiv
					width={'fill'}
					height={'fit'}
					direction={'row'}
					gap={12}
					background={'transparent'}
					wrap={true}
					align={'end'}
				>
					<TextField
						name={'chunk-size'}
						label={'Chunk size:'}
						value={chunkSize}
						onChange={setChunkSize}
						size={{ width: 'auto' }}
						clearButton={null}
					/>
					<TextField
						name={'interval-ms'}
						label={'Interval ms:'}
						value={intervalMs}
						onChange={setIntervalMs}
						size={{ width: 'auto' }}
						clearButton={null}
					/>
					<TextField
						name={'healthy-end-marker'}
						label={'Healthy end marker:'}
						value={endMarker}
						onChange={setEndMarker}
						size={{ width: 'auto' }}
						clearButton={null}
					/>
				</FlexDiv>
			)}
			<MDStreamBufferHookRunner
				key={`${includeLinksAndImages}-${htmlHandling}-${endMarker}`}
				raw={raw}
				chunkSize={chunkSize}
				intervalMs={intervalMs}
				healthyEndMarker={endMarker}
				includeLinksAndImages={includeLinksAndImages}
				htmlHandling={htmlHandling}
				simulateStream={simulateStream}
			/>
		</FlexDiv>
	);
}

const meta: Meta<typeof MDStreamBufferHookDemo> = {
	title: 'Hooks/useMdStreamBuffer',
	component: MDStreamBufferHookDemo,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		raw: DEFAULT_MARKDOWN,
		chunkSize: 1,
		intervalMs: 150,
		healthyEndMarker: '█',
		includeLinksAndImages: true,
		htmlHandling: 'ignore',
		simulateStream: true,
	},
};

export default meta;

export const Demo: StoryObj<typeof MDStreamBufferHookDemo> = {};

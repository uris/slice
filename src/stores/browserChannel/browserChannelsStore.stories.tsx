import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { FlexDiv } from '../../components/FlexDiv';
import { MessageType } from '../../utils';
import { useBrowserChannelActions, useMessage } from './browserChannelsStore';

const CHANNEL_NAME = 'broadcast-channel-demo';

type DemoMessage = {
	from: string;
	text: string;
};

// Self-contained document for each iframe: plain HTML/JS, since a srcDoc
// document is a separate browsing context that cannot render our React tree
// or import our modules directly. It talks over the same native
// `BroadcastChannel` API that `BrowserChannel` wraps, and posts the same
// `{ content, type, origin }` envelope `BrowserChannel.post()` uses, so this
// page's own `useMessage(CHANNEL_NAME)` can read what either frame sends.
function frameDocument(label: string) {
	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<style>
			:root { color-scheme: light dark; }
			body {
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
				margin: 0;
				padding: 16px;
				box-sizing: border-box;
			}
			h4 { margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.6; }
			.origin { margin: 0 0 12px; font-size: 11px; opacity: 0.5; word-break: break-all; }
			.row { display: flex; gap: 8px; margin-bottom: 12px; }
			input {
				flex: 1;
				padding: 8px 10px;
				border-radius: 6px;
				border: 1px solid rgba(128, 128, 128, 0.4);
				font-size: 14px;
			}
			button {
				padding: 8px 14px;
				border-radius: 6px;
				border: none;
				background: #6366f1;
				color: white;
				cursor: pointer;
				font-size: 14px;
			}
			ul { list-style: none; margin: 0; padding: 0; font-size: 13px; max-height: 140px; overflow-y: auto; }
			li { padding: 6px 0; border-bottom: 1px solid rgba(128, 128, 128, 0.2); }
			li b { opacity: 0.7; }
			li span { display: block; font-size: 11px; opacity: 0.5; }
		</style>
	</head>
	<body>
		<h4>${label}</h4>
		<div class="origin" id="origin"></div>
		<div class="row">
			<input id="text" placeholder="Type a message..." />
			<button id="send" type="button">Send</button>
		</div>
		<ul id="log"></ul>
		<script>
			(function () {
				// mirrors BrowserChannel's own origin format: an optional label
				// joined with a generated UUID, always separated by '.' - even with
				// no label - so origin.split('.') is reliably [label, uuid]
				var origin = ${JSON.stringify(label)} + '.' + crypto.randomUUID();
				document.getElementById('origin').textContent = 'origin: ' + origin;

				var channel = new BroadcastChannel(${JSON.stringify(CHANNEL_NAME)});
				var log = document.getElementById('log');
				var input = document.getElementById('text');
				var send = document.getElementById('send');

				function appendEntry(prefix, text, fromOrigin) {
					var item = document.createElement('li');
					item.innerHTML = '<b>' + prefix + '</b> ' + text + (fromOrigin ? '<span>from ' + fromOrigin + '</span>' : '');
					log.prepend(item);
				}

				send.addEventListener('click', function () {
					var text = input.value.trim();
					if (!text) return;
					// same envelope shape BrowserChannel.post() sends: { content, type, origin }
					channel.postMessage({
						content: { from: ${JSON.stringify(label)}, text: text },
						type: 'data',
						origin: origin,
					});
					appendEntry('sent:', text, null);
					input.value = '';
				});

				input.addEventListener('keydown', function (event) {
					if (event.key === 'Enter') send.click();
				});

				channel.addEventListener('message', function (event) {
					appendEntry('received from ' + event.data.content.from + ':', event.data.content.text, event.data.origin);
				});
			})();
		</script>
	</body>
</html>`;
}

function DemoFrame({ label }: { label: string }) {
	return (
		<FlexDiv width={'fill'} height={280} border={'1px solid var(--core-outline-primary)'} borderRadius={8}>
			<iframe
				title={label}
				srcDoc={frameDocument(label)}
				style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
			/>
		</FlexDiv>
	);
}

function BroadcastChannelDemo() {
	const { addChannel, removeChannel } = useBrowserChannelActions();
	const message = useMessage<DemoMessage>(CHANNEL_NAME);

	useEffect(() => {
		addChannel({ name: CHANNEL_NAME });
		return () => {
			removeChannel(CHANNEL_NAME);
		};
	}, [addChannel, removeChannel]);

	const isError = message?.type === MessageType.Error;

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'start'} padding={24}>
			<FlexDiv width={760} height={'auto'} direction={'column'} gap={16}>
				<div>
					Each frame below is its own <code>{'<iframe>'}</code> - a separate browsing context with its own JavaScript
					realm, both same-origin as this page. Each one opens a <code>BroadcastChannel</code> named{' '}
					<code>{`'${CHANNEL_NAME}'`}</code> and posts the same <code>{'{ content, type, origin }'}</code> envelope{' '}
					<code>BrowserChannel</code> uses, with a random per-frame <code>origin</code> label. Sending a message in one
					frame delivers it to the other - and to this page too, via <code>useMessage</code> from{' '}
					<code>useBrowserChannelsStore</code>, which lets you tell messages apart by who sent them.
				</div>
				<FlexDiv direction={'row'} gap={16}>
					<DemoFrame label={'Frame A'} />
					<DemoFrame label={'Frame B'} />
				</FlexDiv>
				<FlexDiv
					direction={'column'}
					gap={4}
					padding={12}
					border={'1px solid var(--core-outline-primary)'}
					borderRadius={8}
				>
					<strong>{`This page (useMessage('${CHANNEL_NAME}'))`}</strong>
					<div>
						{message
							? isError
								? String(message.content)
								: `${(message.content as DemoMessage).from}: ${(message.content as DemoMessage).text}`
							: 'waiting for a message from either frame...'}
					</div>
					{message ? <div>{`origin: ${message.origin}`}</div> : null}
					{isError ? <div>Received a message that could not be deserialized.</div> : null}
				</FlexDiv>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof BroadcastChannelDemo> = {
	title: 'Stores/Browser Channel Store',
	component: BroadcastChannelDemo,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

export const CrossFrameDemo: StoryObj<typeof BroadcastChannelDemo> = {};

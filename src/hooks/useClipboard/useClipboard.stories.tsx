import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { TextField } from '../../components/Textfield';
import { useClipboard } from './useClipboard';

function UseClipboardDemo() {
	const [draft, setDraft] = useState('Copy me to the clipboard');
	const pasteTargetRef = useRef<HTMLDivElement | null>(null);
	const [lastPaste, setLastPaste] = useState<string | null>(null);

	const { text, isSupported, isCopied, isRequesting, error, readPermission, writePermission, copy, read } =
		useClipboard({
			target: pasteTargetRef,
			onPaste: (result) => setLastPaste(result.text),
		});

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexDiv
				width={480}
				height={'auto'}
				direction={'column'}
				gap={16}
				padding={16}
				border={'1px solid var(--core-outline-primary)'}
				background={'none'}
			>
				<strong>useClipboard</strong>
				<span>Supported: {String(isSupported)}</span>
				<span>Read permission: {readPermission}</span>
				<span>Write permission: {writePermission}</span>

				<FlexDiv width={'fill'} height={'auto'} direction={'row'} gap={8} background={'none'} align={'center'}>
					<TextField label={'Text to copy'} name={'draft'} value={draft} onChange={(value) => setDraft(value)} />
					<Button label={isCopied ? 'Copied!' : 'Copy'} variant={'outline'} onClick={() => copy(draft)} />
				</FlexDiv>

				<FlexDiv width={'fill'} height={'auto'} direction={'row'} gap={8} background={'none'} align={'center'}>
					<Button label={'Read clipboard'} variant={'outline'} disabled={isRequesting} onClick={() => read()} />
					<span>Last read: {text ?? '—'}</span>
				</FlexDiv>

				<FlexDiv
					ref={pasteTargetRef}
					contentEditable
					suppressContentEditableWarning
					width={'fill'}
					height={80}
					direction={'column'}
					align={'center'}
					justify={'center'}
					border={'1px dashed var(--core-outline-primary)'}
					background={'none'}
					style={{ outline: 'none', cursor: 'text' }}
				>
					Click here and paste (⌘V / Ctrl+V)
				</FlexDiv>
				<span>Last paste: {lastPaste ?? '—'}</span>
				{error ? <span style={{ color: 'var(--core-error)' }}>{error.message}</span> : null}
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseClipboardDemo> = {
	title: 'Hooks/useClipboard',
	component: UseClipboardDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseClipboardDemo> = {};

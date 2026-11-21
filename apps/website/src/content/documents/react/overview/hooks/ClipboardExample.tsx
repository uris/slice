import { Button, TextField } from '@apple-pie/slice';
import { useClipboard } from '@apple-pie/slice/hooks';
import { useState } from 'react';
import css from '../Overview.module.css';
import { Block } from '../Shared';

export function ClipboardExample() {
	const [text, setText] = useState('Good ideas are worth sharing.');
	const clipboard = useClipboard();
	return (
		<Block title="A little something to share" caption="USE CLIPBOARD">
			<TextField inputName="Text to copy" value={text} onChange={setText} />
			<Button
				label={clipboard.isCopied ? 'Copied!' : 'Copy text'}
				working={clipboard.isRequesting}
				onClick={() => void clipboard.copy(text)}
			/>
			{clipboard.error && (
				<p role="alert" className={css.muted}>
					{clipboard.error.message}
				</p>
			)}
		</Block>
	);
}

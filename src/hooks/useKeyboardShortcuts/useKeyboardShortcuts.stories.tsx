import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FlexDiv } from '../../components/FlexDiv';
import { useWindow } from '../useWindow/useWindow';
import { type KeyboardShortcut, type KeyboardShortcuts, useKeyboardShortcuts } from './useKeyboardShortcuts';

function UseKeyboardShortcutsDemo() {
	const { isAppleDevice } = useWindow();
	const [lastShortcut, setLastShortcut] = useState<string>('none');

	const shortcuts: KeyboardShortcuts = [
		{ key: 'b', name: 'Bold', metaPressed: true },
		{ key: 's', name: 'Save', metaPressed: true },
		{ key: 'k', name: 'Quick Open', metaPressed: true, shiftPressed: true },
		{ key: 'd', name: 'Duplicate', altPressed: true },
		{ key: 'a', name: 'A Pressed' },
	];

	const handleShortcut = (shortcut: KeyboardShortcut) => {
		setLastShortcut(`${shortcut.name} (${shortcut.key})`);
	};

	useKeyboardShortcuts(shortcuts, handleShortcut, isAppleDevice);

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexDiv
				width={520}
				height={'auto'}
				direction={'column'}
				gap={10}
				padding={16}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
			>
				<strong>Keyboard Shortcuts Demo</strong>
				<span>
					Try{' '}
					{isAppleDevice
						? 'Command+B / Command+S / Command+Shift+K / Option+D / A'
						: 'Control+B / Control+S / Control+Shift+K / Alt+D / A'}
				</span>
				<span>Last shortcut: {lastShortcut}</span>
				<input
					placeholder={'Typing here should not trigger shortcuts'}
					style={{
						padding: 8,
						border: '1px solid var(--core-outline-primary)',
						borderRadius: 6,
					}}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseKeyboardShortcutsDemo> = {
	title: 'Hooks/useKeyboardShortcuts',
	component: UseKeyboardShortcutsDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseKeyboardShortcutsDemo> = {};

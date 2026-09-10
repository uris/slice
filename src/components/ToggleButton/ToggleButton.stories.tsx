import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FlexDiv } from 'src/components/FlexDiv';
import { SliceIcons } from 'src/components/Icon/_types';
import { fn } from 'storybook/test';
import { AnimationPreset } from '../IconButton/_types';
import { ToggleButton } from './ToggleButton';

const categories = Object.values(SliceIcons);
const icons = categories.flatMap((category) => Object.values(category));

const meta: Meta<typeof ToggleButton> = {
	title: 'Components/ToggleButton',
	component: ToggleButton,
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: icons,
		},
	},
	args: {
		label: 'Light Mode',
		textSize: 'm',
		buttonSize: 'm',
		icon: 'sun',
		iconOn: 'x',
		fill: true,
		selected: false,
		iconColor: 'var(--core-text-primary)',
		iconColorOn: 'var(--core-surface-primary)',
		bgColor: 'var(--core-surface-secondary)',
		bgColorOn: 'var(--core-link-primary)',
		iconSize: 20,
		tooltip: undefined,
		gap: 4,
		unselect: true,
		disabled: false,
		presetAnimations: AnimationPreset.Rotate,
		onChange: fn(),
		onSelect: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof ToggleButton> = {
	render: (args) => {
		const [selected, setSelected] = useState(Boolean(args.selected));

		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<ToggleButton
					{...args}
					selected={selected}
					onChange={(next) => {
						setSelected(next);
						args.onChange?.(next);
					}}
					onSelect={() => {
						args.onSelect?.();
					}}
				/>
			</FlexDiv>
		);
	},
};

export const Grouped: StoryObj<typeof ToggleButton> = {
	render: () => {
		const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

		return (
			<FlexDiv absolute justify={'center'} align={'center'} width={'viewport'} height={'viewport'} padding={64}>
				<FlexDiv justify={'center'} align={'start'} padding={64} gap={12} width={'fit'}>
					<ToggleButton
						label="System"
						icon="laptop"
						fill
						selected={theme === 'system'}
						unselect={false}
						onSelect={() => setTheme('system')}
					/>
					<ToggleButton
						label="Light"
						icon="sun"
						fill
						selected={theme === 'light'}
						unselect={false}
						onSelect={() => setTheme('light')}
					/>
					<ToggleButton
						label="Dark"
						icon="moon full"
						fill
						selected={theme === 'dark'}
						unselect={false}
						onSelect={() => setTheme('dark')}
					/>
				</FlexDiv>
			</FlexDiv>
		);
	},
};

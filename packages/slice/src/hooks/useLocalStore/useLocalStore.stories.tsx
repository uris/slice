import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { FlexBox } from '../../components/FlexBox';
import { TextField } from '../../components/Textfield';
import { useLocalStore } from './useLocalStore';

type UseLocalStoreDemoProps = {
	storageKey: string;
};

function UseLocalStoreDemo(props: Readonly<UseLocalStoreDemoProps>) {
	const { storageKey } = props;
	const [name, setName] = useLocalStore<string>(storageKey, 'Jane Doe');
	const [draft, setDraft] = useState(name);

	return (
		<FlexBox absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexBox
				width={420}
				height={'auto'}
				direction={'column'}
				gap={12}
				padding={16}
				border={'1px solid var(--core-outline-primary)'}
				background={'none'}
				align={'center'}
			>
				<strong>Key: {storageKey}</strong>
				<span>Persisted value: {name}</span>
				<TextField label={'Display Name:'} name={'displayName'} value={draft} onChange={(v) => setDraft(v)} />
				<FlexBox width={'auto'} height={'auto'} gap={8} background={'none'} direction={'row'}>
					<Button label={'Save'} variant={'outline'} onClick={() => setName(draft)} />
					<Button label={'Reset'} variant={'outline'} onClick={() => setName('Jane Doe')} />
				</FlexBox>
			</FlexBox>
		</FlexBox>
	);
}

const meta: Meta<typeof UseLocalStoreDemo> = {
	title: 'Hooks/useLocalStore',
	component: UseLocalStoreDemo,
	parameters: {
		a11y: { test: 'todo' },
		layout: 'padded',
	},
	args: {
		storageKey: 'slice-demo-profile-name',
	},
	argTypes: {
		storageKey: { control: 'text' },
	},
};

export default meta;

export const Demo: StoryObj<typeof UseLocalStoreDemo> = {};

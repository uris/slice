import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { FlexBox } from '../../components/FlexBox';
import { useLastUpdated } from './useLastUpdated';

type UseLastUpdatedDemoProps = {
	prefix: string;
	interval: number;
};

function UseLastUpdatedDemo(props: Readonly<UseLastUpdatedDemoProps>) {
	const { prefix, interval } = props;
	const [timestamp, setTimestamp] = useState<string>(new Date(Date.now() - 5 * 60 * 1000).toISOString());
	const { lastUpdated } = useLastUpdated(timestamp, prefix, interval);

	return (
		<FlexBox absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexBox
				width={420}
				height={'auto'}
				direction={'column'}
				gap={12}
				padding={16}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
				align={'center'}
			>
				<span>Time: {timestamp}</span>
				<FlexBox width={'auto'} height={'auto'} gap={8} background={'none'} align={'center'}>
					<Button label={'Set Time Now'} variant={'outline'} onClick={() => setTimestamp(new Date().toISOString())} />
					<Button
						label={'Set Time 10 mins ago'}
						variant={'outline'}
						onClick={() => setTimestamp(new Date(Date.now() - 10 * 60 * 1000).toISOString())}
					/>
					<Button
						label={'Set Time 2 days ago'}
						variant={'outline'}
						onClick={() => setTimestamp(new Date(Date.now() - 60 * 1000 * 60 * 24 * 2).toISOString())}
					/>
					<strong>{lastUpdated}</strong>
				</FlexBox>
			</FlexBox>
		</FlexBox>
	);
}

const meta: Meta<typeof UseLastUpdatedDemo> = {
	title: 'Hooks/useLastUpdated',
	component: UseLastUpdatedDemo,
	parameters: {
		a11y: { test: 'todo' },
		layout: 'padded',
	},
	args: {
		prefix: 'Updated ',
		interval: 1,
	},
	argTypes: {
		prefix: { control: 'text' },
		interval: {
			control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
		},
	},
};

export default meta;

export const Demo: StoryObj<typeof UseLastUpdatedDemo> = {};

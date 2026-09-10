import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Spacer } from '../../components/Spacer';
import { useDoubleClick } from './useDoubleClick';

type UseDoubleClickDemoProps = {
	delay: number;
};

function UseDoubleClickDemo(props: Readonly<UseDoubleClickDemoProps>) {
	const { delay } = props;
	const [singleCount, setSingleCount] = useState(0);
	const [doubleCount, setDoubleCount] = useState(0);

	const [click, doubleClick] = useDoubleClick(handleClick, handleDoubleClick, delay);

	function handleClick() {
		setSingleCount((v) => v + 1);
	}

	function handleDoubleClick() {
		setDoubleCount((v) => v + 1);
	}

	return (
		<FlexDiv absolute justify={'center'} align={'center'} direction={'column'}>
			<Button
				label={'Click Or Double Click Me'}
				variant={'solid'}
				size={'large'}
				onClick={click}
				onDoubleClick={doubleClick}
			/>
			<Spacer size={16} />
			<div style={{ display: 'flex', gap: 16 }}>
				<span>Single: {singleCount}</span>
				<span>Double: {doubleCount}</span>
			</div>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseDoubleClickDemo> = {
	title: 'Hooks/useDoubleClick',
	component: UseDoubleClickDemo,
	parameters: {
		layout: 'padded',
	},
	args: {
		delay: 200,
	},
	argTypes: {
		delay: {
			control: { type: 'number', min: 50, max: 600, step: 10 },
		},
	},
};

export default meta;

export const Demo: StoryObj<typeof UseDoubleClickDemo> = {};

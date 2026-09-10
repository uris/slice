import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexDiv } from '../../components/FlexDiv';
import { Slider } from '../../components/Slider';
import { useObserveResize } from './useObserveResize';

type ResizeDemoProps = {
	ignore?: 'width' | 'height';
	startWidth: number;
	startHeight: number;
};

function UseObserveResizeDemo(props: Readonly<ResizeDemoProps>) {
	const { ignore, startWidth, startHeight } = props;
	const [width, setWidth] = useState(startWidth);
	const [height, setHeight] = useState(startHeight);
	const boxRef = useRef<HTMLDivElement>(null);
	const size = useObserveResize(boxRef, { ignore });

	return (
		<FlexDiv align={'center'} justify={'center'} padding={24} absolute direction={'column'} gap={12}>
			<FlexDiv direction={'column'} align={'center'} height={'auto'} gap={12}>
				Change Width
				<Slider
					width={width}
					scaleMin={300}
					scaleMax={400}
					value={width}
					trackHeadSize={0}
					onChange={(v, _) => setWidth(v)}
				/>
				Change Height
				<Slider
					width={width}
					scaleMin={150}
					scaleMax={300}
					value={height}
					trackHeadSize={0}
					onChange={(v, _) => setHeight(v)}
				/>
			</FlexDiv>
			<FlexDiv
				ref={boxRef}
				width={width}
				height={height}
				align={'center'}
				justify={'center'}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
			>
				Observed size: {size.width} x {size.height}
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseObserveResizeDemo> = {
	title: 'Hooks/useObserveResize',
	component: UseObserveResizeDemo,
	parameters: {
		layout: 'padded',
	},
	args: {
		ignore: undefined,
		startWidth: 350,
		startHeight: 225,
	},
	argTypes: {
		ignore: {
			control: { type: 'radio' },
			options: [undefined, 'width', 'height'],
		},
	},
};

export default meta;

export const Demo: StoryObj<typeof UseObserveResizeDemo> = {};

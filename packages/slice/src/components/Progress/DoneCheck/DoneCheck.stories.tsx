import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FlexDiv } from 'src/components/FlexDiv';
import { DoneCheck } from 'src/components/Progress';
import { fn } from 'storybook/test';
import {
	runDoneCheckAnimatesAndFiresCallbacksPlay,
	runDoneCheckNoPlayPlay,
	runDoneCheckWithoutCallbacksPlay,
} from '../../playHelpers';

const meta: Meta<typeof DoneCheck> = {
	title: 'Components/DoneCheck',
	component: DoneCheck,
	args: {
		size: 128,
		stroke: 0.5,
		duration: 1,
		delay: 0,
		play: true,
		didStart: fn(),
		didEnd: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof DoneCheck> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<DoneCheck {...args} />
			</FlexDiv>
		);
	},
};

export const AnimatesAndFiresCallbacks: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		duration: 0.05,
		delay: 0,
	},
	render: Default.render,
	play: runDoneCheckAnimatesAndFiresCallbacksPlay,
};

export const NoPlay: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		play: false,
	},
	render: Default.render,
	play: runDoneCheckNoPlayPlay,
};

export const WithoutCallbacks: StoryObj<typeof DoneCheck> = {
	tags: ['tests'],
	args: {
		duration: 0.05,
		delay: 0,
	},
	// bypass Storybook's args-merge (an explicit `undefined` override in
	// `args` doesn't clear a defined meta default) by dropping the
	// callbacks directly in JSX instead
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<DoneCheck {...args} didStart={undefined} didEnd={undefined} />
		</FlexDiv>
	),
	play: runDoneCheckWithoutCallbacksPlay,
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef } from 'react';
import { expect, within } from 'storybook/test';
import { FlexBox } from '../FlexBox';
import { FlexDiv } from './FlexDiv';
import { Preset } from './_types';

const ref = createRef<HTMLDivElement>();
const meta: Meta<typeof FlexDiv> = {
	title: 'Components/FlexDiv',
	component: FlexDiv,
	parameters: { docs: { description: { component: 'Deprecated. Use FlexBox; FlexDiv is the same component.' } } },
};
export default meta;
export const Default: StoryObj<typeof FlexDiv> = {
	render: () => (
		<FlexDiv ref={ref} preset={Preset.Row} padding={0} gap={12} data-testid="legacy-flex">
			Existing FlexDiv usage
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		const element = within(canvasElement).getByTestId('legacy-flex');
		expect(FlexDiv).toBe(FlexBox);
		expect(ref.current).toBe(element);
		expect(element.tagName).toBe('DIV');
		expect(getComputedStyle(element).display).toBe('flex');
		expect(getComputedStyle(element).gap).toBe('12px');
	},
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'src/components/Button/Button';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { runFlexBoxPlay } from 'src/components/playHelpers';
import { expect, spyOn, waitFor, within } from 'storybook/test';
import { DraggablePanel } from '../DraggablePanel';
import { Preset } from './_types';

const loremIpsum =
	'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';
const meta: Meta<typeof FlexBox> = {
	title: 'Components/FlexBox',
	component: FlexBox,
	argTypes: {
		justify: {
			control: { type: 'radio' },
			options: ['start', 'center', 'end', 'between', 'top', 'bottom'],
		},
		children: {
			options: ['Buttons', 'ShortText', 'LongText'],
			mapping: {
				Buttons: (
					<>
						<Button label="Button 1" variant={'solid'} />
						<Button label="Button 2" variant={'solid'} />
					</>
				),
				ShortText: 'This is some text',
				LongText: loremIpsum,
			},
		},
	},
	args: {
		children: undefined,
		preset: Preset.FillScroll,
		scrollY: undefined,
		scrollX: undefined,
		background: 'transparent',
		direction: undefined,
		align: undefined,
		justify: undefined,
		height: undefined,
		width: undefined,
		wrap: false,
		reverse: false,
		padding: 0,
		margin: 0,
		absolute: false,
		flex: undefined,
		className: undefined,
		gap: 16,
		variants: undefined,
		transition: undefined,
		animate: undefined,
		initial: undefined,
		exit: undefined,
	},
};

export default meta;

export const Default: StoryObj<typeof FlexBox> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<FlexBox {...args}>
					Here's the latest • War with Iran: There could be more US casualties as part of the military operations
					against Iran, President Donald Trump acknowledged Sunday. Three American troops have been killed so far,
					according to the US military. Trump released a video touting the scale of the campaign and provided new
					details on his rationale for the attacks. • Uncertain future: Iranians are grappling with a profound shift in
					the nation’s history after Supreme Leader Ali Khamenei was killed in Saturday’s joint US-Israel attacks.
					Tehran formed a transitional council and has indicated a new supreme leader could be chosen soon. • Global
					impacts: The wave of violence has hindered the flow of oil and disrupted air travel. Oil futures surged Sunday
					in the first trades since the conflict began, while stock futures fell sharply. • Mapping the strikes: Israel
					struck “in the heart of Tehran” and Iran has attacked US bases, Israel and targets across the Middle East.
					Here’s where the strikes are taking place.
				</FlexBox>
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runFlexBoxPlay({ canvasElement, args });
	},
};

export const ExplicitOverflowClipsPanel: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox
			data-testid="clip-container"
			width={300}
			height={160}
			direction="row"
			borderRadius={24}
			style={{ overflow: 'hidden' }}
		>
			<DraggablePanel isClosed={false} backgroundColor="#ff0000" sizeConstraints={{ initial: 400, min: 400, max: 500 }}>
				<span>Clipped panel</span>
			</DraggablePanel>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const container = within(canvasElement).getByTestId('clip-container');
		await expect(getComputedStyle(container).overflowX).toBe('hidden');
		await expect(getComputedStyle(container).overflowY).toBe('hidden');
		await expect(getComputedStyle(container).borderRadius).toBe('24px');
	},
};
export const ExplicitOverflowAxes: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox data-testid="clip-container" width={200} height={100} style={{ overflow: 'hidden', overflowY: 'auto' }}>
			Content
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const container = within(canvasElement).getByTestId('clip-container');
		await expect(getComputedStyle(container).overflowX).toBe('hidden');
		await expect(getComputedStyle(container).overflowY).toBe('auto');
	},
};

export const ExplicitZeroLayout: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollBox padding={0} gap={0} maxWidth={0} data-testid="zero-layout" />,
	play: async ({ canvasElement }) => {
		const box = within(canvasElement).getByTestId('zero-layout');
		const style = getComputedStyle(box);
		expect(style.paddingRight).toBe('0px');
		expect(style.gap).toBe('0px');
		expect(style.maxWidth).toBe('0px');
	},
};
export const ScrollBoxDefaultInset: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => <FlexBox scrollBox data-testid="scroll-layout" />,
	play: async ({ canvasElement }) => {
		expect(getComputedStyle(within(canvasElement).getByTestId('scroll-layout')).paddingRight).toBe('4px');
	},
};
export const RowPresetAndOverrides: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	render: () => (
		<FlexBox preset={Preset.RowBetween} direction="column" reverse wrap gap={12} data-testid="layout">
			<span>One</span>
			<span>Two</span>
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const style = getComputedStyle(within(canvasElement).getByTestId('layout'));
		expect(style.flexDirection).toBe('column-reverse');
		expect(style.flexWrap).toBe('wrap');
		expect(style.justifyContent).toBe('space-between');
		expect(style.alignItems).toBe('center');
	},
};
export const ImmediateReducedMotion: StoryObj<typeof FlexBox> = {
	tags: ['tests'],
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const media = spyOn(window, 'matchMedia').mockImplementation((query) =>
			query === '(prefers-reduced-motion: reduce)'
				? {
						matches: true,
						media: query,
						onchange: null,
						addEventListener() {},
						removeEventListener() {},
						addListener() {},
						removeListener() {},
						dispatchEvent: () => true,
					}
				: original(query),
		);
		return () => media.mockRestore();
	},
	render: () => (
		<FlexBox
			data-testid="motion-box"
			initial={{ opacity: 0 }}
			animate="visible"
			variants={{ visible: { opacity: 1, transition: { delay: 10, duration: 10, repeat: Number.POSITIVE_INFINITY } } }}
		/>
	),
	play: async ({ canvasElement }) => {
		await waitFor(() => expect(within(canvasElement).getByTestId('motion-box')).toHaveStyle({ opacity: '1' }));
	},
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'src/components/Button/Button';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { runFlexDivPlay } from 'src/components/playHelpers';
import { lightTheme } from 'src/theme/themes';
import { Preset } from './_types';

const loremIpsum =
	'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';
const meta: Meta<typeof FlexDiv> = {
	title: 'Components/FlexDiv',
	component: FlexDiv,
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
		background: lightTheme.colors['core-surface-secondary'],
		direction: undefined,
		align: undefined,
		justify: undefined,
		height: undefined,
		width: undefined,
		wrap: false,
		reverse: false,
		padding: 44,
		margin: 0,
		absolute: false,
		flex: undefined,
		className: undefined,
		gap: 16,
		variants: undefined,
		transition: undefined,
		animate: undefined,
		enter: undefined,
		exit: undefined,
	},
};

export default meta;

export const Default: StoryObj<typeof FlexDiv> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<FlexDiv {...args} background={'var(--core-surface-secondary)'}>
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
				</FlexDiv>
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runFlexDivPlay({ canvasElement, args });
	},
};

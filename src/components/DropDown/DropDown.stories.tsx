import type { Meta, StoryObj } from '@storybook/react-vite';
// biome-ignore lint/style/useImportType: <explanation>
import { DropDown, DropDownOption } from 'src/components/DropDown';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { fn } from 'storybook/test';

type DropdownValueType = {
	id: number;
};

const optionsWPlace: DropDownOption<DropdownValueType>[] = [
	{ label: '-- select a user', value: { id: 0 } },
	{ label: 'Jane Doe', value: { id: 1 } },
	{ label: 'John Doe', value: { id: 2 } },
	{
		label: 'A very long name from some one that is probably european',
		value: { id: 3 },
	},
];

const meta: Meta<typeof DropDown> = {
	title: 'Components/DropDown',
	component: DropDown,
	args: {
		width: '100%',
		height: 'auto',
		label: undefined,
		selectedIndex: undefined,
		placeholder: true,
		validate: true,
		borderRadius: undefined,
		valueKey: 'id',
		selectedValue: { id: 0 },
		options: optionsWPlace,
		iconColor: undefined,
		borderStyle: 'box',
		iconSize: 20,
		disabled: false,
		error: false,
		textSize: 'm',
		onChange: fn(),
		onOption: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof DropDown> = {
	args: {
		error: false,
	},
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<DropDown<DropdownValueType>
					{...args}
					selectedValue={args.selectedValue as DropdownValueType}
					options={optionsWPlace}
				/>
			</FlexDiv>
		);
	},
};

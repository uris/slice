import type { Meta, StoryObj } from '@storybook/react-vite';
// biome-ignore lint/style/useImportType: <explanation>
import { DropDown, DropDownOption } from 'src/components/DropDown';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import {
	runDropDownDisabledMouseDownPlay,
	runDropDownDisplayTextPlay,
	runDropDownPlay,
	runDropDownRendersPlay,
} from 'src/components/playHelpers';
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

const optionsWithAlt: DropDownOption<string>[] = [
	{ label: '-- select a role', value: 'none' },
	{ label: 'Administrator', value: 'admin-user', alt: 'admin' },
	{ label: 'Member', value: 'member-user', alt: 'member' },
];

function renderDropDown(args: Record<string, unknown>) {
	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<DropDown<DropdownValueType>
				{...(args as any)}
				selectedValue={args.selectedValue as DropdownValueType}
				options={optionsWPlace}
			/>
		</FlexDiv>
	);
}

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
	play: async ({ canvasElement, args }) => {
		await runDropDownPlay({ canvasElement, args });
	},
};

export const IndexControlled: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { selectedValue: undefined, selectedIndex: 2 },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownDisplayTextPlay({ canvasElement }, optionsWPlace[2].label as string);
	},
};

export const IndexOutOfRange: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { selectedValue: undefined, selectedIndex: 99 },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		// an out-of-range selectedIndex has no matching option, so the sync effect
		// bails out and the initial placeholder text is left in place
		await runDropDownDisplayTextPlay({ canvasElement }, 'Select an option');
	},
};

export const SelectedValueByReference: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	// no valueKey - resolveValueKey's `!valueKey` guard short-circuits it to
	// undefined, so the match falls through to the direct `option.value ===
	// selectedValue` identity check, which succeeds because this is the exact
	// same object reference as one of the options' values
	args: { valueKey: undefined, selectedValue: optionsWPlace[2].value },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownDisplayTextPlay({ canvasElement }, optionsWPlace[2].label as string);
	},
};

export const SelectedValueByLabelMatch: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	// a plain string selectedValue isn't an object, so resolveValueKey's
	// `typeof value !== 'object'` guard returns undefined for both sides and the
	// match falls through to the case-insensitive label comparison
	args: { selectedValue: 'jane doe' },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownDisplayTextPlay({ canvasElement }, 'Jane Doe');
	},
};

export const SelectedValueByAltMatch: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { selectedValue: 'admin', valueKey: undefined, options: optionsWithAlt },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<DropDown {...(args as any)} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runDropDownDisplayTextPlay({ canvasElement }, 'Administrator');
	},
};

export const NoMatchingSelectedValue: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	// an empty string is non-null (passes the effect's own guard) but falsy, so
	// resolveValueKey's `!value` guard returns undefined, and no option matches
	// it on label/alt either - the sync effect's found-index block never runs
	args: { selectedValue: '' },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownDisplayTextPlay({ canvasElement }, 'Select an option');
	},
};

export const EmptyOptions: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { options: undefined, selectedValue: undefined },
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<DropDown {...(args as any)} />
		</FlexDiv>
	),
	play: async ({ canvasElement }) => {
		await runDropDownRendersPlay({ canvasElement });
	},
};

export const DisabledState: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { disabled: true },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownDisabledMouseDownPlay({ canvasElement });
	},
};

export const ErrorState: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { error: true },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownRendersPlay({ canvasElement });
	},
};

export const BorderStyleNone: StoryObj<typeof DropDown> = {
	tags: ['tests'],
	args: { borderStyle: 'none' },
	render: renderDropDown,
	play: async ({ canvasElement }) => {
		await runDropDownRendersPlay({ canvasElement });
	},
};

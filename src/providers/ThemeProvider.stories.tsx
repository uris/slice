import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { FlexDiv } from '../components/FlexDiv';
import { Spacer } from '../components/Spacer';
import { useTheme } from '../hooks/useTheme/useTheme';
import { ThemeProvider } from './ThemeProvider';

type ThemeProviderDemoProps = {
	theme?: string;
	system?: boolean;
	global?: boolean;
};

function ThemeProviderChildDemo() {
	const theme = useTheme();

	return (
		<FlexDiv
			width={'fill'}
			height={'auto'}
			align={'center'}
			justify={'center'}
			direction={'column'}
			absolute
			gap={10}
			padding={24}
		>
			<h3>{theme.current.name.includes('light') ? 'Light theme' : 'Dark theme'} selected</h3>
			<span>Current: {theme.current.name}</span>
			<span>isDark: {theme.isDark ? 'true' : 'false'}</span>
			<Spacer size={8} />
			<FlexDiv direction={'row'} gap={8} width={'auto'} height={'auto'}>
				<Button label={'Set Light'} onClick={() => theme.set('lightMode')} />
				<Button label={'Set Dark'} onClick={() => theme.set('darkMode')} />
				<Button label={'Toggle'} onClick={() => theme.toggle()} />
			</FlexDiv>
		</FlexDiv>
	);
}

function ThemeProviderDemo(props: Readonly<ThemeProviderDemoProps>) {
	const { theme, system, global } = props;

	return (
		<ThemeProvider theme={theme} system={system} global={global}>
			<ThemeProviderChildDemo />
		</ThemeProvider>
	);
}

const meta: Meta<typeof ThemeProviderDemo> = {
	title: 'Providers/ThemeProvider',
	component: ThemeProviderDemo,
	parameters: {
		layout: 'padded',
	},
	args: {
		theme: 'lightMode',
		system: false,
		global: false,
	},
	argTypes: {
		theme: {
			control: { type: 'radio' },
			options: [undefined, 'lightMode', 'darkMode'],
		},
		system: {
			control: { type: 'boolean' },
		},
		global: {
			control: { type: 'boolean' },
		},
	},
};

export default meta;

export const Demo: StoryObj<typeof ThemeProviderDemo> = {};

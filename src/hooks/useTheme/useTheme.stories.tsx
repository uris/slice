import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Spacer } from '../../components/Spacer';
import { useTheme } from './useTheme';

function UseThemeDemo() {
	const theme = useTheme();

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} direction={'column'}>
			<h3>{theme.current.name.includes('light') ? 'Light theme' : 'Dark Theme'} Selected</h3>
			<span>IsDark? {theme.isDark ? 'True' : 'False'}</span>
			<Spacer size={24} />
			<FlexDiv width={'fill'} height={'auto'} direction={'column'} align={'center'} justify={'center'} gap={12}>
				<Button label={'Set Light'} onClick={() => theme.set(theme.lightTheme)} />
				<Button label={'Set Dark'} onClick={() => theme.set(theme.darkTheme)} />
				<Button label={'Set System'} onClick={() => theme.set('system')} />
				<Button label={'Toggle'} onClick={() => theme.toggle()} />
			</FlexDiv>
			<Spacer size={24} />
			<strong style={{ color: theme.colors['core-link-primary'] }}>
				{`Var: '${theme.colors['core-link-primary']}'`}
			</strong>
			<strong style={{ color: theme.colors['core-link-primary'] }}>
				{`Class: '${theme.colorsClass['core-link-primary']}'`}
			</strong>{' '}
			<strong style={{ color: theme.colors['core-link-primary'] }}>
				{`Value: '${theme.current.colors['core-link-primary']}'`}
			</strong>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseThemeDemo> = {
	title: 'Hooks/useTheme',
	component: UseThemeDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Default: StoryObj<typeof UseThemeDemo> = {};

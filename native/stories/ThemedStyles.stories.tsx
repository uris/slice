import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { StyleSheet, View } from 'react-native';
import { Text } from '../src/components';
import { useCreateThemedStyles } from '../src/hooks';
import type { SliceNativeTheme } from '../src/theme';
import { lineHeightTextStyle } from '../src/utils';

const createStyles = (theme: SliceNativeTheme) =>
	StyleSheet.create({
		card: {
			padding: theme.spacing.m,
			borderRadius: theme.corners['corner-m'],
			backgroundColor: theme.colors['core-surface-secondary'],
		},
		label: lineHeightTextStyle({ fontSize: 18, color: theme.colors['core-text-primary'] }, 1.5),
	});
function ThemedStylesExample() {
	const styles = useCreateThemedStyles(createStyles);
	return (
		<View style={styles.card}>
			<Text style={styles.label}>Switch the theme toolbar to update these styles.</Text>
		</View>
	);
}
const meta = {
	title: 'Hooks/Themed styles',
	component: ThemedStylesExample,
	parameters: {
		docs: {
			description: {
				component:
					'Define a stable factory outside your component. useCreateThemedStyles preserves style inference and recalculates when the theme changes. lineHeightTextStyle derives absolute line height from a font size and multiplier.',
			},
		},
	},
} satisfies Meta<typeof ThemedStylesExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = {};

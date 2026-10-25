import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { type SliceNativeTheme, darkTheme, lightTheme } from '../theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export type ThemeContextValue = {
	theme: SliceNativeTheme;
	mode: 'light' | 'dark';
	preference: ThemePreference;
	setPreference?: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function SliceThemeProvider({
	preference = 'system',
	onPreferenceChange = undefined,
	children,
}: {
	preference?: ThemePreference;
	onPreferenceChange?: (preference: ThemePreference) => void;
	children: ReactNode;
}) {
	const deviceMode = useColorScheme();
	const mode = preference === 'system' ? (deviceMode === 'dark' ? 'dark' : 'light') : preference;

	const value = useMemo(
		() => ({
			theme: mode === 'dark' ? darkTheme : lightTheme,
			mode,
			preference,
			setPreference: onPreferenceChange,
		}),
		[mode, preference, onPreferenceChange],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSliceContext(): ThemeContextValue {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useSliceContext must be used within SliceThemeProvider');
	}

	return context;
}

export function useSliceTheme(): SliceNativeTheme {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useSliceTheme must be used within SliceThemeProvider');
	}

	return context.theme;
}

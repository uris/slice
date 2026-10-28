import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SliceTextInput, SliceThemeProvider, useSliceTheme } from '@apple-pie/slice-native';

/**
 * Runs the actual package component with editable inputs over changing backdrops.
 */
export default function InputGlassSmoke() {
	const [preference, setPreference] = useState<'light' | 'dark'>('light');
	return (
		<SafeAreaProvider>
			<SliceThemeProvider preference={preference}>
				<Screen preference={preference} setPreference={setPreference} />
			</SliceThemeProvider>
		</SafeAreaProvider>
	);
}

function Screen({
	preference,
	setPreference,
}: { preference: 'light' | 'dark'; setPreference: (value: 'light' | 'dark') => void }) {
	const insets = useSafeAreaInsets();
	const { colors } = useSliceTheme();
	const [clear, setClear] = useState(false);
	const [first, setFirst] = useState('');
	const [second, setSecond] = useState('17pt — font scaling off');
	const [regular, setRegular] = useState('');
	const [focused, setFocused] = useState('None');
	let glassStyle: 'regular' | 'clear' = 'regular';
	if (clear) glassStyle = 'clear';
	const buttonStyle = {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 10,
		backgroundColor: colors['core-surface-secondary'],
	};
	return (
		<View style={{ flex: 1, backgroundColor: colors['core-surface-primary'] }}>
			<ScrollView
				style={{ flex: 1 }}
				contentInsetAdjustmentBehavior="never"
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
			>
				{Array.from({ length: 12 }, (_, index) => {
					let backgroundColor = '#808080';
					let name = 'GRAY';
					let color = '#000000';
					if (index % 4 === 0) {
						backgroundColor = '#ffffff';
						name = 'WHITE';
					}
					if (index % 4 === 2) {
						backgroundColor = '#000000';
						name = 'BLACK';
						color = '#ffffff';
					}
					return (
						<View key={index} style={{ height: 650, backgroundColor, paddingTop: insets.top + 150, paddingLeft: 20 }}>
							<Text style={{ color, fontWeight: '600' }}>{name} BACKDROP — scroll</Text>
						</View>
					);
				})}
			</ScrollView>
			<View
				style={{
					position: 'absolute',
					top: insets.top,
					left: 0,
					right: 0,
					padding: 16,
					gap: 8,
					backgroundColor: colors['core-surface-primary'],
				}}
			>
				<Text style={{ color: colors['core-text-primary'], fontSize: 18, fontWeight: '600' }}>
					React Native input nesting
				</Text>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Pressable style={buttonStyle} onPress={() => setPreference('light')}>
						<Text style={{ color: colors['core-text-primary'] }}>Light</Text>
					</Pressable>
					<Pressable style={buttonStyle} onPress={() => setPreference('dark')}>
						<Text style={{ color: colors['core-text-primary'] }}>Dark</Text>
					</Pressable>
					<Pressable style={buttonStyle} onPress={() => setClear(!clear)}>
						<Text style={{ color: colors['core-text-primary'] }}>{glassStyle} glass</Text>
					</Pressable>
					<Pressable style={buttonStyle} onPress={Keyboard.dismiss}>
						<Text style={{ color: colors['core-text-primary'] }}>Done</Text>
					</Pressable>
				</View>
				<Text style={{ color: colors['core-text-secondary'], fontSize: 12 }}>
					{preference} · Focus: {focused} · Drag outside fields to scroll
				</Text>
			</View>
			<View
				pointerEvents="box-none"
				style={{ position: 'absolute', top: insets.top + 210, left: 20, right: 20, gap: 20 }}
			>
				<View style={{ height: 52, flexDirection: 'row' }}>
					<SliceTextInput
						accessibilityLabel="Glass placeholder input"
						placeholder="Search tasks — tokens"
						iconColor="core-icon-secondary"
						textColor="core-text-primary"
						placeholderTextColor="core-text-secondary"
						icon="search"
						hideIconOnFocus={false}
						value={first}
						onChangeText={setFirst}
						liquidGlassBackground={true}
						onFocus={() => setFocused('Glass search')}
						onBlur={() => setFocused('None')}
					/>
				</View>
				<View style={{ height: 52, flexDirection: 'row' }}>
					<SliceTextInput
						accessibilityLabel="Glass entered text input"
						allowFontScaling={false}
						placeholder="Entered text"
						iconColor={colors['core-icon-primary']}
						textColor={colors['core-text-primary']}
						placeholderTextColor={colors['core-text-secondary']}
						icon="edit"
						hideIconOnFocus={false}
						value={second}
						onChangeText={setSecond}
						liquidGlassBackground={{ glassStyle }}
						onFocus={() => setFocused('Glass text')}
						onBlur={() => setFocused('None')}
					/>
				</View>
				<View style={{ height: 52, flexDirection: 'row' }}>
					<SliceTextInput
						accessibilityLabel="Regular input baseline"
						placeholder="Search tasks — regular"
						icon="search"
						hideIconOnFocus={false}
						value={regular}
						onChangeText={setRegular}
						onFocus={() => setFocused('Regular')}
						onBlur={() => setFocused('None')}
					/>
				</View>
			</View>
		</View>
	);
}

import { useEffect, useState } from 'react';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, SliceThemeProvider, useSliceTheme } from '@apple-pie/slice-native';

/**
 * Actual RN/Fabric buttons: independent foregrounds, updates, and press events.
 */
export default function ButtonColorsSmoke() {
  const [preference, setPreference] = useState<'light' | 'dark'>('light');
  return <SafeAreaProvider><SliceThemeProvider preference={preference}>
    <Screen preference={preference} setPreference={setPreference} />
  </SliceThemeProvider></SafeAreaProvider>;
}

function Screen({ preference, setPreference }: { preference: 'light' | 'dark'; setPreference: (value: 'light' | 'dark') => void }) {
  const insets = useSafeAreaInsets();
  const { colors } = useSliceTheme();
  const [cycleStep, setCycleStep] = useState(0);
  useEffect(() => {
    if (cycleStep === 0) return;
    const timer = setTimeout(() => setCycleStep(value => value - 1), 900);
    return () => clearTimeout(timer);
  }, [cycleStep]);
  const [clear, setClear] = useState(false);
  const [presses, setPresses] = useState(0);
  const [alternate, setAlternate] = useState(false);
  let glassStyle: 'regular' | 'clear' = 'regular';
  if (clear) glassStyle = 'clear';
  let iconColor = 'core-link-primary';
  let textColor = 'core-text-primary';
  if (alternate) { iconColor = 'feedback-positive'; textColor = 'core-text-secondary'; }
  const press = () => setPresses(value => value + 1);
  const control = { padding: 10, backgroundColor: colors['core-surface-secondary'], borderRadius: 8 };
  return <View style={{ flex: 1, backgroundColor: colors['core-surface-primary'] }}>
    <ScrollView contentInsetAdjustmentBehavior="never">
      {Array.from({ length: 8 }, (_, index) => {
        let backgroundColor = '#808080';
        if (index % 4 === 0) backgroundColor = '#fff';
        if (index % 4 === 2) backgroundColor = '#000';
        return <View key={index} style={{ height: 700, backgroundColor }} />;
      })}
    </ScrollView>
    <View style={{ position: 'absolute', top: insets.top, left: 0, right: 0, padding: 16, gap: 8, backgroundColor: colors['core-surface-primary'] }}>
      <Text style={{ fontSize: 18, color: colors['core-text-primary'], fontWeight: '600' }}>React Native button colors</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable style={control} onPress={() => setPreference('light')}><Text style={{ color: colors['core-text-primary'] }}>Light</Text></Pressable>
        <Pressable style={control} onPress={() => setPreference('dark')}><Text style={{ color: colors['core-text-primary'] }}>Dark</Text></Pressable>
        <Pressable style={control} onPress={() => setClear(!clear)}><Text style={{ color: colors['core-text-primary'] }}>{glassStyle}</Text></Pressable>
        <Pressable style={control} onPress={() => setAlternate(!alternate)}><Text style={{ color: colors['core-text-primary'] }}>Swap colors</Text></Pressable>
      </View>
      <Pressable style={control} onPress={() => setCycleStep(6)}><Text style={{ color: colors['core-text-primary'] }}>Cycle presence ×3</Text></Pressable>
      <Text style={{ color: colors['core-text-secondary'] }}>{preference} · Presses: {presses} · Scroll outside buttons</Text>
    </View>
    <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + 195, left: 24, right: 24, gap: 16 }}>
      {cycleStep % 2 === 0 && <Button presence={{ entering: FadeIn.duration(350), exiting: FadeOut.duration(350) }} label="Link colors glass" icon="home" iconColor="core-link-primary" textColor="core-link-primary" liquidGlassBackground={{ glassStyle }} onPress={press} />}
      <Button label="Separate colors" icon="home" iconColor={iconColor} textColor={textColor} liquidGlassBackground={{ glassStyle }} onPress={press} />
      <Button icon="@" iconColor="core-link-primary" textColor="core-text-primary" liquidGlassBackground={{ glassStyle }} onPress={press} accessibilityLabel="Icon only with separate colors" />
      <Button label="Palette literals" icon="home" iconColor={colors['core-link-primary']} textColor={colors['core-text-primary']} liquidGlassBackground={{ glassStyle }} onPress={press} />
      <Button label="Disabled split" icon="home" iconColor="feedback-positive" textColor="core-text-primary" liquidGlassBackground={{ glassStyle }} disabled />
      <Button label="Regular split" icon="home" iconColor="core-link-primary" textColor="core-text-primary" onPress={press} />
    </View>
  </View>;
}

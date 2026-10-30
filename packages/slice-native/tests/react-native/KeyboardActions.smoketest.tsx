import { useState } from 'react';
import { ScrollView, Text as NativeText, View } from 'react-native';
import { Button, SliceThemeProvider, TextInput } from '@apple-pie/slice-native';

/**
 * Android integration fixture: update the active IME without remounting the editor.
 */
export default function KeyboardActionsSmoke() {
 const [text, setText] = useState('Keep this text');
 const [action, setAction] = useState<'search' | 'done'>('search');
 const [label, setLabel] = useState<string | undefined>();
 const [focuses, setFocuses] = useState(0);
 const [blurs, setBlurs] = useState(0);
 const [selection, setSelection] = useState({ start: 0, end: 0 });
 return <SliceThemeProvider><ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: 24, gap: 16 }}>
  <NativeText>Tap the editor, select part of its text, then change the action or label while the keyboard remains open.</NativeText>
  <TextInput
   accessibilityLabel="Keyboard action test"
   value={text}
   onChangeText={setText}
   returnKeyType={action}
   returnKeyLabel={label}
   blurClears
   onFocus={() => setFocuses((count) => count + 1)}
   onBlur={() => setBlurs((count) => count + 1)}
   onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
  />
  <NativeText>Action: {action}; label: {label ?? '(default)'}</NativeText>
  <NativeText>Focuses: {focuses}; blurs: {blurs}; selection: {selection.start}–{selection.end}</NativeText>
  <Button label="Toggle Search / Done" onPress={() => setAction((value) => {
   if (value === 'search') return 'done';
   return 'search';
  })} />
  <Button label="Cycle custom label" onPress={() => setLabel((value) => {
   if (value === undefined) return 'Add';
   if (value === 'Add') return 'Save';
   return undefined;
  })} />
  <View style={{ gap: 16 }}>
   <NativeText>Press and hold each button near its corners to inspect ripple clipping.</NativeText>
   <Button label="Rounded ripple" borderRadius={12} onPress={() => {}} />
   <Button label="Asymmetric ripple" style={{ borderRadius: 12, borderTopLeftRadius: 28 }} onPress={() => {}} />
  </View>
 </ScrollView></SliceThemeProvider>;
}

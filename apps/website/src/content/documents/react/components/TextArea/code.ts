export const usageCode = `
import { TextArea } from '@apple-pie/slice';

export function TextAreaUsageExample() {
	return (
		<TextArea name="notes" label="Notes" rows={3} placeholder="Add a note" onChange={(value) => console.log(value)} />
	);
}
`;
export const submitCode = `
import { TextArea } from '@apple-pie/slice';

export function TextAreaSubmitExample() {
	return (
		<TextArea
			name="message"
			inputName="Message"
			rows={3}
			showSendButton
			returnSubmits
			onSubmit={(value) => console.log(value)}
		/>
	);
}
`;
export const sizingCode = `
import { TextArea } from '@apple-pie/slice';

export function TextAreaSizingExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '80%' }}>
			<TextArea label="Notes" rows={3} maxHeight={240} />
			<TextArea label="Description" height={180} />
			<TextArea label="Comment" rows={3} autoGrow={false} resizable />
		</div>
	);
}
`;
export const controlledCode = `
import { useState } from 'react';

function NotesField() {
  const [notes, setNotes] = useState('');
  return <TextArea name="notes" label="Notes" value={notes} onChange={setNotes} />;
}
`;
export const guidanceCode = `
import { TextArea } from '@apple-pie/slice';

export function TextAreaGuidanceExample() {
	const hasError = true;

	return (
		<TextArea
			name="description"
			label="Description"
			tip="Include the context your team needs."
			error={hasError}
			errorMessage="Add more detail before continuing."
			onChange={(value) => console.log(value)}
		/>
	);
}
`;

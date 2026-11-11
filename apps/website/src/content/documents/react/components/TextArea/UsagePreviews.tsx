'use client';
import { TextArea } from '@apple-pie/slice';

export function TextAreaSizingExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TextArea label="Notes" rows={3} maxHeight={240} />
			<TextArea label="Description" height={100} />
			<TextArea label="Comment" rows={3} autoGrow={false} resizable />
		</div>
	);
}

export function TextAreaGuidanceExample() {
	const hasError = true;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TextArea
				name="description"
				label="Description"
				tip="Include the context your team needs."
				error={hasError}
				errorMessage="Add more detail before continuing."
				onChange={(value) => console.log(value)}
			/>
		</div>
	);
}

export function TextAreaUsageExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TextArea name="notes" label="Notes" rows={3} placeholder="Add a note" onChange={(value) => console.log(value)} />
		</div>
	);
}

export function TextAreaSubmitExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TextArea
				name="message"
				inputName="Message"
				rows={3}
				showSendButton
				returnSubmits
				onSubmit={(value) => console.log(value)}
			/>
		</div>
	);
}

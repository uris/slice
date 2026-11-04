'use client';
import { TextArea } from '@apple-pie/slice';

export function TextAreaPreview({
	variant = 'default',
}: { variant?: 'default' | 'resizable' | 'message' | 'fixed' | 'error' | 'readonly' | 'disabled' | 'labeled' }) {
	if (variant === 'message')
		return (
			<TextArea
				name="message"
				inputName="Message"
				rows={3}
				maxHeight={220}
				width="80%"
				placeholder="Write a message"
				showSendButton
				returnSubmits
				onSubmit={() => {}}
			/>
		);
	if (variant === 'resizable')
		return (
			<TextArea
				name="notes"
				inputName="Notes"
				width="80%"
				rows={2}
				autoGrow={false}
				resizable
				placeholder="Add a note"
				tip="Drag the bottom-right corner to resize the notes box."
			/>
		);
	if (variant === 'fixed')
		return (
			<TextArea
				name="notes"
				inputName="Notes"
				width="80%"
				height={160}
				defaultValue={
					'Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. Mr. Dursley made drills. He was a big, beefy man with hardly any neck, although he did have a very large moustache. Mrs. Dursley was thin and blonde and had twice the usual amount of neck, which came in very useful as she spent so much of her time spying on the neighbours. The Dursleys had a small son called Dudley and in their opinion there was no finer boy anywhere.'
				}
			/>
		);
	const getPlaceholder = () => {
		if (variant === 'labeled') return 'Enter your notes';
		if (variant === 'default') return 'Add a long note to see this box grow automatically';
		return 'Add a note';
	};
	const getInitialText = () => {
		if (variant === 'error') return 'Needs more detail';
		if (variant === 'readonly' || variant === 'disabled') return 'Keep the context your team needs in one place.';
		return undefined;
	};
	return (
		<TextArea
			name="notes"
			label={variant === 'labeled' ? 'Notes' : undefined}
			inputName="Notes"
			width="80%"
			rows={2}
			maxHeight={220}
			placeholder={getPlaceholder()}
			defaultValue={getInitialText()}
			error={variant === 'error'}
			errorMessage="Add enough detail for someone else to follow."
			readOnly={variant === 'readonly'}
			disabled={variant === 'disabled'}
		/>
	);
}

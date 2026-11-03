'use client';
import { TextArea } from '@apple-pie/slice';
export function TextAreaPreview({ variant = 'default' }: { variant?: 'default' | 'content' | 'disabled' }) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: TextArea renders the native textarea nested inside this implicit label.
		<label style={{ display: 'block', width: 340 }}>
			<span
				style={{
					position: 'absolute',
					width: 1,
					height: 1,
					padding: 0,
					overflow: 'hidden',
					clipPath: 'inset(50%)',
					whiteSpace: 'nowrap',
				}}
			>
				Notes
			</span>
			<TextArea
				name="notes"
				rows={3}
				placeholder="Add a note"
				value={
					variant === 'content'
						? 'Share the context your team needs.\nAdd a second line when the details need more room.'
						: ''
				}
				disabled={variant === 'disabled'}
			/>
		</label>
	);
}

'use client';

import { ProgressIndicator } from '@apple-pie/slice';
import { useState } from 'react';

export function LoadingPreview() {
	const [loading] = useState(true);
	return <ProgressIndicator show={loading} inline decorative />;
}

export function OverlayPreview() {
	return (
		<div
			style={{
				position: 'relative',
				width: 260,
				height: 260,
				border: '1px solid var(--core-fill-primary)',
				borderRadius: 12,
				padding: 16,
			}}
		>
			<ProgressIndicator show decorative label="busy" />
		</div>
	);
}

export function AppearancePreview() {
	return (
		<span aria-hidden="true">
			<ProgressIndicator
				decorative
				show
				inline
				size={32}
				stroke={1}
				color="core-text-special"
				secondsPerSpin={0.5}
				inset={false}
			/>
		</span>
	);
}

export function LabelPreview() {
	return <ProgressIndicator show inline displayLabel label="Loading files…" labelPosition={'right'} />;
}

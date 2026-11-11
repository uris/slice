'use client';

import { FileIcon, FileIconTypes } from '@apple-pie/slice';

export function FilePreview() {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
			<FileIcon filename="Quarterly report.pdf" size={32} decorative />
			<span>Quarterly report.pdf</span>
		</div>
	);
}

export function CategoriesPreview() {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 24, width: '100%' }}>
			{Object.values(FileIconTypes).map((name) => (
				<figure key={name} style={{ margin: 0, textAlign: 'center' }}>
					<FileIcon type={name} size={32} decorative />
					<figcaption style={{ fontSize: 12, color: 'var(--core-text-secondary)', marginTop: 8 }}>{name}</figcaption>
				</figure>
			))}
		</div>
	);
}

export function SizesPreview() {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
			{[16, 24, 40].map((size) => (
				<figure key={size} style={{ margin: 0, textAlign: 'center' }}>
					<FileIcon type="image" size={size} decorative />
					<figcaption style={{ fontSize: 12, color: 'var(--core-text-secondary)', marginTop: 8 }}>{size}px</figcaption>
				</figure>
			))}
		</div>
	);
}

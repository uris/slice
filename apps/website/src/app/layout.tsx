import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@apple-pie/slice/styles.css';
import '../styles.css';

export const metadata: Metadata = {
	title: 'Slice UIKit',
	description: 'Slice UI components, themes, and utilities for React and React Native.',
};

export const viewport: Viewport = { themeColor: '#21272b' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" data-slice-theme="darkMode">
			<body>{children}</body>
		</html>
	);
}

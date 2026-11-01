import type { Metadata, Viewport } from 'next';
import { Funnel_Sans, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import '@apple-pie/slice/styles.css';
import './styles.css';

export const viewport: Viewport = { themeColor: '#21272b' };

// setup for funnel sans google font
const funnelSans = Funnel_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-funnel-sans',
});

// setup for jetbrains mono google font
const jetBrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-jetbrains-mono',
});

// setup for geist mono google font
const geistMono = Geist_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-geist-mono',
});

// meta for location
export const metadata: Metadata = {
	title: 'Slice UIKit',
	description: 'Slice UI components, themes, and utilities for React and React Native.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html
			lang="en"
			data-slice-theme="darkMode"
			className={`${funnelSans.variable}  ${jetBrainsMono.variable} ${geistMono.variable}`}
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

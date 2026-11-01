'use client';

import { ThemeProvider } from '@apple-pie/slice/providers';
import type { ReactNode } from 'react';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<ThemeProvider theme="darkMode" system={false} global>
			{children}
		</ThemeProvider>
	);
}

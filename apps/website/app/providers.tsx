'use client';

import { ThemeProvider } from '@apple-pie/slice/providers';
import type { ReactNode } from 'react';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<ThemeProvider initialTheme="darkMode" initialSystem={false} global>
			{children}
		</ThemeProvider>
	);
}

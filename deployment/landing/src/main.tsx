import { ThemeProvider } from '@apple-pie/slice/providers';
import '@apple-pie/slice/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Landing page root element is missing.');

createRoot(container).render(
	<StrictMode>
		<ThemeProvider theme="darkMode" system={false} global>
			<App />
		</ThemeProvider>
	</StrictMode>,
);

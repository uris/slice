'use client';
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarPreview({
	variant = 'default',
}: Readonly<{
	variant?: 'default' | 'extras' | 'fill' | 'disabled';
}>) {
	const extras = variant === 'extras';
	return (
		<TabBar
			tabBarName="Project views"
			width={360}
			defaultValue="overview"
			disabled={variant === 'disabled'}
			tabWidth={variant === 'fill' ? 'fill' : undefined}
		>
			<Tab value="overview" label="All messages" icon={extras ? 'inbox' : undefined} />
			<Tab value="activity" label="Unread" count={extras ? 12 : undefined} />
			<Tab value="settings" label="Deleted" />
		</TabBar>
	);
}

'use client';
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarExtrasExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview" width={'100%'}>
				<Tab value="overview" label="Overview" icon="basic.inbox" />
				<Tab value="activity" label="Activity" count={12} />
			</TabBar>
		</div>
	);
}

export function TabBarDisabledExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview" disabled width={'100%'}>
				<Tab value="overview" label="Overview" />
				<Tab value="activity" label="Activity" />
			</TabBar>
		</div>
	);
}

export function TabBarFillExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview" tabWidth="fill" width={'100%'}>
				<Tab value="overview" label="Overview" />
				<Tab value="activity" label="Activity" />
			</TabBar>
		</div>
	);
}

export function TabBarUsageExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview">
				<Tab value="overview" label="Overview" />
				<Tab value="activity" label="Activity" />
				<Tab value="settings" label="Settings" />
			</TabBar>
		</div>
	);
}

export function TabBarColorExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Colored project views" accentColor="#22c55e" textColor="core-text-secondary" width={'100%'}>
				<Tab value="overview" label="Overview" icon="basic.home" />
				<Tab value="activity" label="Activity" icon="basic.inbox" />
			</TabBar>
		</div>
	);
}

'use client';
import { Tab, TabBar } from '@apple-pie/slice';

export function TabCustomExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview">
				<Tab value="overview" label="Overview" />
				<Tab value="activity">
					<span>
						Activity <em>Live</em>
					</span>
				</Tab>
			</TabBar>
		</div>
	);
}

export function TabUsageExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview">
				<Tab value="overview" label="Overview" />
				<Tab value="details" label="Details" />
			</TabBar>
		</div>
	);
}

export function TabExtrasExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Project views" defaultValue="overview">
				<Tab value="overview" label="Overview" />
				<Tab value="activity" label="Activity" icon="basic.home" count={12} />
			</TabBar>
		</div>
	);
}

export function TabColorExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24, width: '80%' }}>
			<TabBar tabBarName="Custom tab colors" accentColor="#22c55e" width={360}>
				<Tab value="overview" label="Overview" icon="basic.home" />
				<Tab
					value="activity"
					label="Activity"
					icon="basic.inbox"
					textColorSelected="#fbbf24"
					iconColorSelected="#f472b6"
					underlineSelectedColor="#a78bfa"
				/>
			</TabBar>
		</div>
	);
}

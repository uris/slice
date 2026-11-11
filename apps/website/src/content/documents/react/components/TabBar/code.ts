export const usageCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarUsageExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview">
			<Tab value="overview" label="Overview" />
			<Tab value="activity" label="Activity" />
			<Tab value="settings" label="Settings" />
		</TabBar>
	);
}
`;
export const optionsCode = `
<TabBar tabBarName="Project views" defaultValue="overview" options={[
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity', count: 12 },
  { value: 'settings', label: 'Settings', disabled: true },
]} />
`;
export const controlledCode = `
<TabBar tabBarName="Project views" value={activeView} onChange={setActiveView}>
  <Tab value="overview" label="Overview" />
  <Tab value="activity" label="Activity" />
</TabBar>
`;
export const motionCode = `
<TabBar tabBarName="Project views" options={options} transition={{ duration: 0 }} />
`;

export const extrasCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarExtrasExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview" width={360}>
			<Tab value="overview" label="Overview" icon="basic.inbox" />
			<Tab value="activity" label="Activity" count={12} />
		</TabBar>
	);
}
`;

export const fillCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarFillExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview" width={360} tabWidth="fill">
			<Tab value="overview" label="Overview" />
			<Tab value="activity" label="Activity" />
		</TabBar>
	);
}
`;

export const disabledCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarDisabledExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview" disabled width={360}>
			<Tab value="overview" label="Overview" />
			<Tab value="activity" label="Activity" />
		</TabBar>
	);
}
`;

export const colorsCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabBarColorExample() {
    return <TabBar tabBarName="Colored project views" accentColor="#22c55e" textColor="core-text-secondary" width={360}>
        <Tab value="overview" label="Overview" icon="basic.home" />
        <Tab value="activity" label="Activity" icon="basic.inbox" />
    </TabBar>;
}
`;

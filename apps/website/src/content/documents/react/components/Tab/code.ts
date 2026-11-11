export const usageCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabUsageExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview">
			<Tab value="overview" label="Overview" />
			<Tab value="details" label="Details" />
		</TabBar>
	);
}
`;
export const extrasCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabExtrasExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview">
			<Tab value="overview" label="Overview" />
			<Tab value="activity" label="Activity" icon="basic.home" count={12} />
		</TabBar>
	);
}
`;
export const customCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabCustomExample() {
	return (
		<TabBar tabBarName="Project views" defaultValue="overview">
			<Tab value="overview" label="Overview" />
			<Tab value="activity">
				<span>
					Activity <em>Live</em>
				</span>
			</Tab>
		</TabBar>
	);
}
`;
export const panelsCode = `
<>
  <TabBar tabBarName="Project views" value={activeView} onChange={setActiveView}>
    <Tab value="overview" id="overview-tab" panelId="overview-panel" label="Overview" />
    <Tab value="activity" id="activity-tab" panelId="activity-panel" label="Activity" />
  </TabBar>
  <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab" hidden={activeView !== 'overview'}>
    Overview content
  </div>
  <div id="activity-panel" role="tabpanel" aria-labelledby="activity-tab" hidden={activeView !== 'activity'}>
    Activity content
  </div>
</>
`;

export const colorsCode = `
import { Tab, TabBar } from '@apple-pie/slice';

export function TabColorExample() {
    return <TabBar tabBarName="Custom tab colors" accentColor="#22c55e" width={360}>
        <Tab value="overview" label="Overview" icon="basic.home" />
        <Tab value="activity" label="Activity" icon="basic.inbox" textColorSelected="#fbbf24" iconColorSelected="#f472b6" underlineSelectedColor="#a78bfa" />
    </TabBar>;
}
`;

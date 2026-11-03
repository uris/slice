export const usageCode = `
import { Tab, TabBar } from '@apple-pie/slice';

<TabBar tabBarName="Project views" defaultValue="overview">
  <Tab value="overview" label="Overview" />
  <Tab value="activity" label="Activity" />
  <Tab value="settings" label="Settings" />
</TabBar>
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

export const usageCode = `
import { Tab, TabBar } from '@apple-pie/slice';

<TabBar tabBarName="Project views" defaultValue="overview">
  <Tab value="overview" label="Overview" />
  <Tab value="details" label="Details" />
</TabBar>
`;
export const extrasCode = `
<TabBar tabBarName="Project views" defaultValue="overview">
  <Tab value="overview" label="Overview" />
  <Tab value="activity" label="Activity" icon="home" count={12} />
</TabBar>
`;
export const customCode = `
<TabBar tabBarName="Project views" defaultValue="overview">
  <Tab value="overview" label="Overview" />
  <Tab value="activity">
    <span>Activity <em>Live</em></span>
  </Tab>
</TabBar>
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

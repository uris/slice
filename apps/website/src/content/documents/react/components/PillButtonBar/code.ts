export const usageCode = `
import { PillButtonBar, Tab } from '@apple-pie/slice';
import { useId, useState } from 'react';

const ranges = [
  { value: 'day', label: 'Day', summary: '8 new visits today' },
  { value: 'week', label: 'Week', summary: '54 new visits this week' },
  { value: 'month', label: 'Month', summary: '212 new visits this month' },
];

export function ActivityRange() {
  const id = useId();
  const [range, setRange] = useState('week');

  return (
    <>
      <PillButtonBar tabBarName="Activity range" value={range} onChange={setRange}>
        {ranges.map(({ value, label }) => (
          <Tab key={value} value={value} label={label} id={\`\${id}-\${value}\`} panelId={\`\${id}-\${value}-panel\`} />
        ))}
      </PillButtonBar>
      {ranges.map(({ value, summary }) => (
        <div
          key={value}
          role="tabpanel"
          id={\`\${id}-\${value}-panel\`}
          aria-labelledby={\`\${id}-\${value}\`}
          hidden={range !== value}
        >
          {summary}
        </div>
      ))}
    </>
  );
}
`;

export const iconsCode = `
<PillButtonBar tabBarName="Activity range" defaultValue="week">
  <Tab value="day" label="Day" icon="weather.sun" />
  <Tab value="week" label="Week" icon="time.calendar-dates" />
  <Tab value="month" label="Month" icon="time.calendar" />
</PillButtonBar>
`;

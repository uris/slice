export const usageCode = `
import { DropDown } from '@apple-pie/slice';

<DropDown name="Status" selectedIndex={0} options={[
  { label: '-- Choose a status', value: 'none' },
  { label: 'In progress', value: 'active' },
  { label: 'Complete', value: 'complete' },
]} onChange={myHandler} />
`;

export const typedCode = `
<DropDown<{ id: number }>
  name="Owner"
  valueKey="id"
  selectedValue={{ id: 2 }}
  placeholder={false}
  options={[
    { label: 'Alex', value: { id: 1 } },
    { label: 'Sam', value: { id: 2 } },
  ]}
  onOption={myHandler}
/>
`;

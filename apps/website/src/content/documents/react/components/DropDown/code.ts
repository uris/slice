export const usageCode = `
import { DropDown } from '@apple-pie/slice';

<DropDown name="status" inputName="Status" onChange={myHandler}>
  <option value="">-- Choose a status</option>
  <option value="active">In progress</option>
  <option value="complete">Complete</option>
</DropDown>;
`;
export const optionsCode = `
<DropDown name="status" inputName="Status" options={[
  { label: '-- Choose a status', value: '' },
  { label: 'In progress', value: 'active' },
  { label: 'Complete', value: 'complete' },
]} onChange={myHandler} />;
`;

export const controlledCode = `
import { useState } from 'react';

function StatusField() {
  const [status, setStatus] = useState('active');
  return <DropDown name="status" label="Status" value={status} onChange={setStatus} options={[
    { label: 'In progress', value: 'active' },
    { label: 'Complete', value: 'complete' },
  ]} placeholder={false} />;
}
`;
export const typedCode = `
<DropDown<{ id: number }>
  name="owner"
  inputName="Owner"
  valueKey="id"
  defaultValue={{ id: 2 }}
  placeholder={false}
  options={[
    { label: 'Alex', value: { id: 1 } },
    { label: 'Sam', value: { id: 2 } },
  ]}
  onChange={myHandler}
/>;
`;

export const labelsCode = `
<>
  <DropDown label="Status" variant="simple" options={statusOptions} />
  <DropDown label="Status" variant="stacked" options={statusOptions} />
  <DropDown label="Status" variant="stacked" behavior="appear" options={statusOptions} />
  <DropDown label="Status" variant="outlined" options={statusOptions} />
</>;
`;
export const guidanceCode = `
<DropDown
  name="status"
  label="Status"
  variant="stacked"
  options={statusOptions}
  tip="Choose the current status."
  error={hasError}
  errorMessage="Choose a status before continuing."
  onChange={myHandler}
/>;
`;

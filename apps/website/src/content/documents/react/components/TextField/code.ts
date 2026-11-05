export const usageCode = `
import { TextField } from '@apple-pie/slice';

<TextField name="Search" label="Search" placeholder="Search projects" onChange={myHandler} />
`;

export const passwordCode = `
<TextField name="password" label="Password" inputType="password" clearButton={null} onChange={myHandler} />
`;

export const controlledCode = `
import { useState } from 'react';

function SearchField() {
  const [query, setQuery] = useState('');
  return <TextField name="query" label="Search" value={query} onChange={setQuery} />;
}
`;

export const actionCode = `
<TextField label="Search" actionButton actionLabel="Search" onChange={setQuery} onAction={myHandler} />
`;

export const labelsCode = `
<>
  <TextField label="Email" variant="stacked" placeholder="Enter your email" />
  <TextField label="Email" variant="stacked" behavior="appear" />
  <TextField label="Email" variant="outlined" placeholder="Enter your email" />
</>
`;

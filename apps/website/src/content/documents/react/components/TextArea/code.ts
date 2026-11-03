export const usageCode = `
import { TextArea } from '@apple-pie/slice';

<label>
  Notes
  <TextArea name="notes" rows={3} placeholder="Add a note" onChange={myHandler} />
</label>
`;

export const submitCode = `
<label>
  Message
  <TextArea name="message" rows={3} returnSubmits submitClears={false} onSubmit={myHandler} />
</label>
`;

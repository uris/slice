export const usageCode = `
import { TextArea } from '@apple-pie/slice';

<TextArea name="notes" label="Notes" rows={3} placeholder="Add a note" onChange={myHandler} />;
`;
export const submitCode = `
<TextArea
  name="message"
  inputName="Message"
  rows={3}
  showSendButton
  returnSubmits
  onSubmit={myHandler}
/>;
`;
export const sizingCode = `
<>
  <TextArea label="Notes" rows={3} maxHeight={240} />
  <TextArea label="Description" height={180} />
  <TextArea label="Comment" rows={3} autoGrow={false} resizable />
</>;
`;
export const controlledCode = `
import { useState } from 'react';

function NotesField() {
  const [notes, setNotes] = useState('');
  return <TextArea name="notes" label="Notes" value={notes} onChange={setNotes} />;
}
`;
export const guidanceCode = `
<TextArea
  name="description"
  label="Description"
  tip="Include the context your team needs."
  error={hasError}
  errorMessage="Add more detail before continuing."
  onChange={myHandler}
/>;
`;

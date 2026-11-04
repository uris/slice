export const usageCode = `
import { useState } from 'react';
import { ContentEditable } from '@apple-pie/slice';

function EditableContent() {
  const [title, setTitle] = useState('Quarterly planning');
  const [editing, setEditing] = useState(false);

  return (
    <ContentEditable
      name="Project title"
      value={title}
      isEditable={editing}
      onClick={click}
      onEditStart={() => setEditing(true)} // keyboard activation
      onCommit={setTitle}
      onEditEnd={() => setEditing(false)}
    />
  );
}
`;
export const activationCode = `
<>
    <ContentEditable
      name="Project title"
      value={title}
      isEditable={editing}
      onCommit={setTitle}
      onEditEnd={() => setEditing(false)}
    />
    <Button onClick={() => setEditing(true)}>Edit</button>
</>
`;
export const persistenceCode = `
async function saveTitle(next: string, previous: string) {
    setTitle(next);
    try {
        await updateProject({ title: next });
    } catch {
        setTitle(previous);
        setError('Could not save the title. Try again.');
    }
}

<ContentEditable
    name="Project title"
    value={title}
    isEditable={editing}
    onCommit={saveTitle}
    onEditEnd={() => setEditing(false)}
/>
`;

export const textCode = `
import { Attachment } from '@apple-pie/slice';

export function TextAttachment() {
  return <Attachment content="Notes from today's planning session. Review the project milestones, confirm the next release, and share the updated timeline with the team." canRemove={false} />;
}
`;
export const imageCode = `
import { Attachment } from '@apple-pie/slice';

export function ImageAttachment({ file }: { file: File }) {
  return <Attachment content={{ file }} canRemove={false} />;
}
`;
export const pdfCode = `
import { Attachment } from '@apple-pie/slice';

export function PdfAttachment({ file }: { file: File }) {
  return <Attachment content={{ file }} canRemove={false} />;
}
`;
export const uploadCode = `
<Attachment
  content={{ file, uploading: true, progress: 45 }}
  canRemove={false}
/>
`;
export const indeterminateCode = `
<Attachment content={{ file, uploading: true }} canRemove={false} />
`;
export const removalCode = `
import { Attachment, type FileItem } from '@apple-pie/slice';
import { useState } from 'react';

export function RemovableAttachment() {
  const [content, setContent] = useState<FileItem | undefined>({
    file: 'Quarterly-report.pdf',
  });
  return content ? (
    <Attachment content={content} onRemove={() => setContent(undefined)} />
  ) : null;
}
`;
export const actionsCode = `
<Attachment
  content={fileItem}
  onOpen={() => openFile(fileItem)}
  onRemove={() => removeFile(fileItem)}
/>
`;

export const errorCode = `
<Attachment
  content={{ file, error: 'Upload failed. Check your connection and try again.' }}
  canRemove={false}
/>
`;

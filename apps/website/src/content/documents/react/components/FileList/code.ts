export const usageCode = `
import { FileList, type FileItem } from '@apple-pie/slice';
import { useState } from 'react';

export function Attachments() {
  const [files, setFiles] = useState<FileItem[]>([
    {id: 'report', file: 'Quarterly report.pdf'},
    {id: 'notes', file: 'Project notes.md'},
  ]);
  return <FileList files={files} onChange={setFiles} />;
}
`;
export const statesCode = `
<FileList direction="column" canRemove={false} files={[
  {file: 'Presentation.pptx', uploading: true, progress: 40},
  {file: 'Budget.xlsx'},
  {file: 'Recording.mp4', error: 'Upload failed. Try again.'},
]} />
`;

export const cardsCode = `
import { FileList, type FileItem } from '@apple-pie/slice';
import { useState } from 'react';

export function AttachmentCards({ image, report }: { image: File; report: File }) {
  const [files, setFiles] = useState<FileItem[]>(() => [
    {id: 'image', file: image},
    {id: 'text', file: new File([
      "Notes from today's planning session. Confirm the project milestones, review the release checklist, and share the next steps with the team.",
    ], 'Planning-notes.txt', {type: 'text/plain'})},
    {id: 'report', file: report},
    {id: 'upload', file: 'Project-notes.md', uploading: true, progress: 45},
    {id: 'error', file: 'Archive.zip', error: 'Upload failed. Try again.'},
  ]);
  return <FileList variant="attachments" attachmentSize="s" files={files} onChange={setFiles} />;
}
`;

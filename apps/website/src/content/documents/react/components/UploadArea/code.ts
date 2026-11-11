export const usageCode = `
import { UploadArea, type FileItem } from '@apple-pie/slice';
import { useState } from 'react';

export function Attachments() {
  const [files, setFiles] = useState<FileItem[]>([]);
  return <UploadArea
    acceptedTypes={['pdf', 'png', 'jpg']}
    files={files}
    onFilesChange={setFiles}

  />;
}
`;
export const busyCode = `
<UploadArea busy files={[
  {id: 'report', file: 'Quarterly report.pdf', uploading: true, progress: 45},
]} />
`;

export const attachmentsCode = `
import { UploadArea, type FileItem } from '@apple-pie/slice';
import { useState } from 'react';

export function UploadAttachments() {
  const [files, setFiles] = useState<FileItem[]>([
    {id: 'brief', file: 'Project-brief.txt'},
    {id: 'report', file: 'Quarterly-report.pdf'},
    {id: 'upload', file: 'Presentation.pptx', uploading: true, progress: 45},
  ]);
  return <UploadArea
    files={files}
    onFilesChange={setFiles}
    fileListProps={{variant: 'attachments', attachmentSize: 's', style: {justifyContent: 'center'},}}
  />;
}
`;

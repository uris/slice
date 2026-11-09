export const usageCode = `
import { FileIcon } from '@apple-pie/slice';

export function ReportFile() {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <FileIcon filename="Quarterly report.pdf" size={32} decorative />
    <span>Quarterly report.pdf</span>
  </div>;
}
`;
export const categoriesCode = `
import { FileIcon, FileIconTypes } from '@apple-pie/slice';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 24, width: '100%' }}>
  {Object.values(FileIconTypes).map(type =>
    <figure key={type} style={{ margin: 0, textAlign: 'center' }}>
      <FileIcon type={type} size={32} decorative />
      <figcaption style={{ fontSize: 12, color: 'var(--core-text-secondary)', marginTop: 8 }}>{type}</figcaption>
    </figure>
  )}
</div>
`;
export const sizesCode = `
<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
  {[16, 24, 40].map(size =>
    <figure key={size} style={{ margin: 0, textAlign: 'center' }}>
      <FileIcon type="image" size={size} decorative />
      <figcaption style={{ fontSize: 12, color: 'var(--core-text-secondary)', marginTop: 8 }}>{size}px</figcaption>
    </figure>
  )}
</div>
`;
export const actionCode = `
import { Button, FileIcon } from '@apple-pie/slice';
import { useState } from 'react';

export function FileAction() {
  const [message, setMessage] = useState('');
  return <div style={{ display: 'grid', gap: 12 }}>
    <Button variant="outline" onClick={() => setMessage('Selected Quarterly report.pdf')}>
      <FileIcon filename="Quarterly report.pdf" size={32} decorative />
      <span>Open Quarterly report.pdf</span>
    </Button>
    <output>{message}</output>
  </div>;
}
`;

export const usageCode = `
import { ErrorSummary } from '@apple-pie/slice';

<ErrorSummary entries={[
  { title: 'Email address required', message: 'Add an email address to continue.' },
]} />
`;

export const dynamicCode = `
<ErrorSummary entries={errors} />
`;

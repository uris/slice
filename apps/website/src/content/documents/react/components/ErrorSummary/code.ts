export const usageCode = `
import { ErrorSummary } from '@apple-pie/slice';

<ErrorSummary entries={[
  { id: 'email', title: 'Email address required', message: 'Add an email address to continue.' },
  { id: 'project', title: 'Choose a project' },
]} />
`;
export const fieldsCode = `
import { useState } from 'react';
import { ErrorSummary, type ErrorMessage, TextField } from '@apple-pie/slice';

function ContactForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  return <form onSubmit={(event) => {
    event.preventDefault();
    setErrors(email.trim() ? [] : [{
      id: 'email-required',
      title: 'Email address required',
      message: 'Add an email address to continue.',
      fieldName: 'email',
    }]);
  }}>
    <ErrorSummary entries={errors} />
    <TextField name="email" inputName="Email address" value={email}
      onChange={(next) => setEmail(next ?? '')} />
    <button type="submit">Continue</button>
  </form>;
}
`;
export const announcementCode = `
<ErrorSummary
  entries={errors}
  summaryName="Check your details"
  announcement="assertive"
/>
`;
export const focusCode = `
import { useRef } from 'react';

const summaryRef = useRef<HTMLDivElement>(null);

<>
  <ErrorSummary ref={summaryRef} entries={errors} />
  <button type="button" onClick={() => summaryRef.current?.focus()}>
    Review errors
  </button>
</>
`;
export const entryCode = `
type ErrorMessage = {
  id?: string;
  title: string;
  message?: string | string[];
  fieldName?: string;
};
`;

export const liveCode = `
function LiveValidation() {
  const [value, setValue] = useState('');
  const errors: ErrorMessage[] = value.length > 0 ? [{
    id: 'example-value',
    title: 'Value not accepted',
    message: 'Choose a different value.',
    fieldName: 'example-value',
  }] : [];

  return <form onSubmit={(event) => event.preventDefault()}>
    <ErrorSummary entries={errors} />
    <TextField name="example-value" inputName="Example value"
      placeholder="Enter a value" value={value}
      onChange={(next) => setValue(next ?? '')} error={errors.length > 0} />
  </form>;
}
`;

export const motionCode = `
<ErrorSummary
  entries={errors}
  transition={{ duration: 0.35 }}
  motionValues={{
    initial: { y: -8 },
    animate: { y: 0 },
    exit: { y: -8 },
  }}
/>
`;

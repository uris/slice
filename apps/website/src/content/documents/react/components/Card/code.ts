export const loginCode = `
"use client";

import { Card, CardTitle, CardContent, CardFooter, FlexBox, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function LoginCard({ onLogin }: { onLogin?: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Card maxWidth={375} style={{ width: '100%' }} role="group" aria-label="Account login">
      <CardTitle title="Log in to your account" text="Enter your email and password to continue." />
      <CardContent>
        <FlexBox preset={Preset.Column} width="fill" gap={12}>
          <TextField label="Email" name="email" placeholder="you@example.com" value={email} onChange={setEmail} backgroundColorBlurred="transparent" inputAttributes={{ autoComplete: 'username' }} />
          <TextField label="Password" name="password" inputType="password" placeholder="Enter your password" value={password} onChange={setPassword} backgroundColorBlurred="transparent" inputAttributes={{ autoComplete: 'current-password' }} />
        </FlexBox>
      </CardContent>
      <CardFooter actionButtons={[
        { value: 'login', label: 'Log in', variant: 'primary', disabled: !email.trim() || !password },
        { value: 'signup', label: 'Sign up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
      ]} onAction={button => {
        if (button.value === 'login') onLogin?.(email, password);
      }} />
    </Card>
  );
}
`;

export const spacingCode = `
"use client";

import { Card, CardTitle, CardContent, CardFooter, FlexBox, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function LoginCard({ onLogin }: { onLogin?: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Card padding="var(--spacing-xl)" maxWidth={375} style={{ width: '100%' }} role="group" aria-label="Account login">
      <CardTitle title="Log in to your account" text="Enter your email and password to continue." />
      <CardContent>
        <FlexBox preset={Preset.Column} width="fill" gap={12}>
          <TextField label="Email" name="email" placeholder="you@example.com" value={email} onChange={setEmail} backgroundColorBlurred="transparent" inputAttributes={{ autoComplete: 'username' }} />
          <TextField label="Password" name="password" inputType="password" placeholder="Enter your password" value={password} onChange={setPassword} backgroundColorBlurred="transparent" inputAttributes={{ autoComplete: 'current-password' }} />
        </FlexBox>
      </CardContent>
      <CardFooter actionButtons={[
        { value: 'login', label: 'Log in', variant: 'primary', disabled: !email.trim() || !password },
        { value: 'signup', label: 'Sign up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
      ]} onAction={button => {
        if (button.value === 'login') onLogin?.(email, password);
      }} />
    </Card>
  );
}
`;

export const titleCode = `
import { Card, CardTitle, CardContent } from '@apple-pie/slice';

export function TitledCard() {
  return (
    <Card maxWidth={375} style={{ width: '100%' }}>
      <CardTitle caption="Account" title="Security settings" text="Manage the details that protect your account." action={[{ label: 'Help', iconRight: 'alerts.question' }]} />
      <CardContent>Review your password and sign-in preferences.</CardContent>
    </Card>
  );
}
`;

export const titleStatusCode = `
import { Badge, Card, CardContent, CardTitle } from '@apple-pie/slice';

export function ProjectStatusCard() {
  return (
    <Card>
      <CardTitle title="Project status" action={<Badge count="Ready" />} />
      <CardContent text="All checks have passed." />
    </Card>
  );
}
`;

export const contentCode = `
import { Card, CardTitle, CardContent } from '@apple-pie/slice';

export function ContentCard() {
  return (
    <Card maxWidth={375} style={{ width: '100%' }} padding={24}>
      <CardTitle title="Account details" />
      <CardContent text="This content inherits the Card’s padding and removes the extra top space after its title." />
      <CardContent padding="8px 24px 24px">
        <strong>Custom content</strong>
        <span>Use children for rich text, fields, or other controls.</span>
      </CardContent>
    </Card>
  );
}
`;

export const imageCode = `
import { Card, CardTitle, CardContent, CardImage } from '@apple-pie/slice';

export function ImageCard() {
  return (
    <Card maxWidth={375} style={{ width: '100%' }}>
      <CardTitle title="A brighter workspace" />
      <CardImage src="/images/flowers-sunflower.png" alt="Yellow sunflowers" height={200} />
      <CardContent text="Images fill their section and crop to cover the available area." />
    </Card>
  );
}
`;

export const imageOnlyCode = `
import { Card, CardImage } from '@apple-pie/slice';

export function ImageOnlyCard() {
  return (
    <Card maxWidth={375} style={{ width: '100%' }}>
      <CardImage src="/images/flowers-sunflower.png" alt="Yellow sunflowers" height={200} />
    </Card>
  );
}
`;

export const footerCode = `
"use client";

import { Card, CardTitle, CardContent, CardFooter } from '@apple-pie/slice';
import { useState } from 'react';

export function CardActions() {
  const [saved, setSaved] = useState(false);
  return (
    <Card maxWidth={375} style={{ width: '100%' }}>
      <CardTitle title="Save your preferences" />
      <CardContent text="Choose how you would like to continue." />
      <CardFooter stack="vertical" layout="fill" actionButtons={[
        { value: 'save', label: saved ? 'Saved' : 'Save changes', variant: 'primary', onClick: () => setSaved(true) },
        { value: 'cancel', label: 'Cancel', variant: 'secondary', onClick: () => setSaved(false) },
      ]} />
    </Card>
  );
}
`;

export const horizontalFooterCode = `
"use client";

import { Card, CardTitle, CardContent, CardFooter } from '@apple-pie/slice';
import { useState } from 'react';

export function CardActions() {
  const [saved, setSaved] = useState(false);
  return (
    <Card maxWidth={375} style={{ width: '100%' }}>
      <CardTitle title="Save your preferences" />
      <CardContent text="Choose how you would like to continue." />
      <CardFooter stack="horizontal" layout="fill" actionButtons={[
        { value: 'save', label: saved ? 'Saved' : 'Save changes', variant: 'primary', onClick: () => setSaved(true) },
        { value: 'cancel', label: 'Cancel', variant: 'secondary', onClick: () => setSaved(false) },
      ]} />
    </Card>
  );
}
`;

export const imageLoginCode = `
"use client";

import { Card, CardTitle, CardContent, CardFooter, CardImage, FlexBox, Preset, TextField } from '@apple-pie/slice';
import { useState } from 'react';

export function LoginCard({ onLogin }: { onLogin?: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Card maxWidth={375} style={{ width: '100%' }} role="group" aria-label="Account login">
      <CardTitle title="Log in to your account" text="Enter your email and password to continue." />
      <CardImage src="/images/flowers-sunflower.png" alt="Yellow sunflowers" height={150} />
      <CardContent>
        <FlexBox preset={Preset.Column} width="fill" gap={12}>
          <TextField label="Email" name="email" placeholder="you@example.com" value={email} onChange={setEmail} backgroundColorBlurred="transparent" inputAttributes={{ autoComplete: 'username' }} />
          <TextField label="Password" name="password" inputType="password" placeholder="Enter your password" value={password} onChange={setPassword} backgroundColorBlurred="transparent" inputAttributes={{ autoComplete: 'current-password' }} />
        </FlexBox>
      </CardContent>
      <CardFooter actionButtons={[
        { value: 'login', label: 'Log in', variant: 'primary', disabled: !email.trim() || !password },
        { value: 'signup', label: 'Sign up', variant: 'secondary', backgroundColor: 'core-button-secondary' },
      ]} onAction={button => {
        if (button.value === 'login') onLogin?.(email, password);
      }} />
    </Card>
  );
}
`;

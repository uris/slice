'use client';

import { Avatar, Button, type ButtonHandle, type ButtonProps, FlexDiv } from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { useEffect, useRef, useState } from 'react';

export function ButtonPreview(props: Readonly<ButtonProps>) {
	return <Button {...props} />;
}

export function ButtonChildrenPreview() {
	return (
		<Button buttonSize="auto" aria-label="John Wick's Profile">
			<Avatar name="John Wick" image="/images/jw-profile.png" />
			<span>John Wick's Profile</span>
		</Button>
	);
}

export function ButtonActionPreview() {
	const [continued, setContinued] = useState(false);
	return <Button label={continued ? 'Continued' : 'Continue'} onClick={() => setContinued(!continued)} />;
}

export function ButtonWorkingPreview() {
	const [isSaving, setIsSaving] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	return (
		<Button
			label="Save changes"
			working={isSaving}
			onClick={() => {
				setIsSaving(true);
				timer.current = setTimeout(() => setIsSaving(false), 1200);
			}}
		/>
	);
}

export function ButtonProgressPreview() {
	const [completed, setCompleted] = useState(false);
	return (
		<Button
			label={completed ? 'Run again' : 'Run action'}
			progress
			duration={1}
			onClick={() => setCompleted(!completed)}
		/>
	);
}

export function ButtonFormPreview() {
	const [submitted, setSubmitted] = useState(false);
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				setSubmitted(true);
			}}
		>
			<Button label={submitted ? 'Submitted' : 'Submit'} type="submit" />
		</form>
	);
}

export function ButtonTooltipPreview() {
	const { push } = useTipActions();
	return <Button label="Save" tooltip="Save your changes" onToolTip={push} />;
}

export function ButtonMotionPreview() {
	const [expanded, setExpanded] = useState(false);
	return (
		<Button
			iconLeft={'arrows.scale'}
			label="Click to scale"
			initial="compact"
			animate={expanded ? 'expanded' : 'compact'}
			variants={{ compact: { scale: 1 }, expanded: { scale: 1.5 } }}
			transition={{ duration: 0.2 }}
			onClick={() => setExpanded(!expanded)}
		/>
	);
}

export function ButtonRefPreview() {
	const buttonRef = useRef<ButtonHandle>(null);
	const [count, setCount] = useState(0);
	return (
		<FlexDiv gap={12}>
			<Button ref={buttonRef} label={`Button action (${count})`} onClick={() => setCount((value) => value + 1)} />
			<Button label="Trigger through a ref" onClick={() => buttonRef.current?.triggerClick()} />
		</FlexDiv>
	);
}

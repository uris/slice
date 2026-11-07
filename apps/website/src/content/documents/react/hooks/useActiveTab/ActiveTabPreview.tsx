'use client';

import { Code } from '@/components/Type/Type';
import { Switch, useActiveTab } from '@apple-pie/slice';
import { useEffect, useState } from 'react';

const transition = { type: 'tween', duration: 0.35, ease: 'easeInOut' } as const;

function useDelayedOn(value: boolean) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!value) {
			setReady(false);
			return;
		}
		const timer = setTimeout(() => setReady(true), 500);
		return () => clearTimeout(timer);
	}, [value]);

	return value && ready;
}

export function ActiveTabPreview() {
	const { isActiveTab, isTabFocused, visibilityState } = useActiveTab();
	const showActive = useDelayedOn(isActiveTab);
	const showFocused = useDelayedOn(isTabFocused);
	const showVisible = useDelayedOn(visibilityState === 'visible');

	return (
		<dl
			style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'center', gap: '20px 24px', margin: 0 }}
		>
			<dt>
				<Code>isActiveTab</Code>
			</dt>
			<dd style={{ margin: 0 }}>
				<Switch checked={showActive} transition={transition} disabled name="isActiveTab" />
			</dd>
			<dt>
				<Code>isTabFocused</Code>
			</dt>
			<dd style={{ margin: 0 }}>
				<Switch checked={showFocused} transition={transition} disabled name="isTabFocused" />
			</dd>
			<dt>
				<Code>visibilityState</Code>
			</dt>
			<dd style={{ margin: 0 }}>
				<Switch checked={showVisible} transition={transition} disabled name="Document visible" />
			</dd>
		</dl>
	);
}

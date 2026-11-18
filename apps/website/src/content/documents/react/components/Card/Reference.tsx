import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Code, DefaultVal, Definition, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

export type CardDocProp = { name: string; type: string; defaultValue: string; description: ReactNode };

export function CardPropsReference({ entries }: { entries: CardDocProp[] }) {
	return (
		<>
			<H2 id="props">Props</H2>
			{entries.map((entry) => (
				<Fragment key={entry.name}>
					<Definition id={`prop-${entry.name}`}>
						<Prop>{entry.name}</Prop>
						<TypeDef>{entry.type}</TypeDef>
						<DefaultVal>{entry.defaultValue}</DefaultVal>
					</Definition>
					<P>{entry.description}</P>
				</Fragment>
			))}
			<Definition id="prop-divAttributes">
				<Prop>...divAttributes</Prop>
				<TypeDef>HTML div attributes</TypeDef>
				<DefaultVal>—</DefaultVal>
			</Definition>
			<P>
				Native attributes apply to the wrapper. <Code>className</Code> is appended and <Code>style</Code> overrides the
				default styles.
			</P>
		</>
	);
}

export function CardEventsReference({ action = false }: { action?: boolean }) {
	return (
		<>
			<H2 id="events">Events</H2>
			{action && (
				<>
					<Definition id="onAction">
						<Method>onAction</Method>
						<TypeDef>{'(button: ButtonProps) => void'}</TypeDef>
					</Definition>
					<P>
						Receives the selected button’s props after its own <Code>onClick</Code> callback. Disabled buttons do not
						invoke these callbacks.
					</P>
				</>
			)}
			<Definition id="divEvents">
				<Method>...divEvents</Method>
				<TypeDef>HTML div events</TypeDef>
			</Definition>
			<P>Native events apply to the wrapper and follow normal DOM bubbling.</P>
		</>
	);
}

export function cardTrackedItems(name: string, entries: CardDocProp[], action = false): TrackedItem[] {
	return [
		{ id: 'title', title: `${name} component` },
		{ id: 'usage', title: 'Usage' },
		{ id: 'behavior', title: 'Behavior' },
		{ id: 'accessibility', title: 'Accessibility' },
		{
			id: 'props',
			title: 'Props',
			items: [
				...entries.map(({ name }) => ({ id: `prop-${name}`, title: name, code: true })),
				{ id: 'prop-divAttributes', title: '...divAttributes', code: true },
			],
		},
		{
			id: 'events',
			title: 'Events',
			items: [
				...(action ? [{ id: 'onAction', title: 'onAction', code: true }] : []),
				{ id: 'divEvents', title: '...divEvents', code: true },
			],
		},
	];
}

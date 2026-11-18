import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Code, DefaultVal, Definition, H2, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

export type InfoBoxDocProp = { name: string; type: string; defaultValue: string; description: ReactNode };

export function InfoBoxPropsReference({ entries }: { entries: InfoBoxDocProp[] }) {
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

export type InfoBoxDocEvent = { name: string; type: string; description: ReactNode };
export function InfoBoxEventsReference({ entries = [] }: { entries?: InfoBoxDocEvent[] }) {
	return (
		<>
			<H2 id="events">Events</H2>
			{entries.map((entry) => (
				<Fragment key={entry.name}>
					<Definition id={`event-${entry.name}`}>
						<Method>{entry.name}</Method>
						<TypeDef>{entry.type}</TypeDef>
					</Definition>
					<P>{entry.description}</P>
				</Fragment>
			))}
			<Definition id="divEvents">
				<Method>...divEvents</Method>
				<TypeDef>HTML div events</TypeDef>
			</Definition>
			<P>
				Native events apply to the wrapper and follow normal DOM bubbling. Action controls retain their own callbacks.
			</P>
		</>
	);
}
export function infoBoxTrackedItems(
	name: string,
	entries: InfoBoxDocProp[],
	events: InfoBoxDocEvent[] = [],
): TrackedItem[] {
	return [
		{ id: 'title', title: `${name} component` },
		...['usage', 'behavior', 'accessibility'].map((id) => ({ id, title: id[0].toUpperCase() + id.slice(1) })),
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
				...events.map(({ name }) => ({ id: `event-${name}`, title: name, code: true })),
				{ id: 'divEvents', title: '...divEvents', code: true },
			],
		},
	];
}

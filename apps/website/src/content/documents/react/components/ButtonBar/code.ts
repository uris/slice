export const usageCode = `
import { ButtonBar } from '@apple-pie/slice';

export function ButtonBarUsageExample() {
	const runAction = (button: unknown) => console.log(button);

	return (
		<ButtonBar
			buttons={[
				{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
				{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
			]}
			onClick={runAction}
		/>
	);
}
`;

export const example2Code = `
import { ButtonBar } from '@apple-pie/slice';

export function ButtonBarAppearanceExample() {
	const buttons: NonNullable<React.ComponentProps<typeof ButtonBar>['buttons']> = [
		{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
		{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
	];

	return <ButtonBar buttons={buttons} buttonSize={40} borderWidth={1} borderRadius={12} />;
}
`;

export const controlledCode = `
import { ButtonBar } from '@apple-pie/slice';
import { useState } from 'react';

export function ButtonBarControlledExample() {
	const buttons: NonNullable<React.ComponentProps<typeof ButtonBar>['buttons']> = [
		{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
		{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
	];
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<ButtonBar
			buttons={buttons}
			toggle
			selectedIndex={selectedIndex}
			onChange={(button) => setSelectedIndex(buttons.indexOf(button))}
		/>
	);
}
`;

export const overlapCode = `
import { ButtonBar } from '@apple-pie/slice';

export function ButtonBarOverlapExample() {
	const buttons: NonNullable<React.ComponentProps<typeof ButtonBar>['buttons']> = [
		{ icon: 'arrows.arrow-left', action: 'previous', tip: 'Previous' },
		{ icon: 'arrows.arrow-right', action: 'next', tip: 'Next' },
	];

	return <ButtonBar buttons={buttons} selectionRadius={12} buttonGap={-4} padding={8} />;
}
`;

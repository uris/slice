import { typeStyles } from '@apple-pie/slice/theme/type';
import type { CSSProperties } from 'react';

// join style
const join = ' | ';

// get current body and header styles defined in slice
const headingTokens = Object.keys(typeStyles).filter((token) => !token.includes('body'));
const bodyTokens = Object.keys(typeStyles).filter((token) => token.includes('body'));

// create utility array for heading styles info
export const headingStyles = headingTokens.map((token) => {
	const styles: string[] = [];
	for (const [key, value] of Object.entries(typeStyles[token as keyof typeof typeStyles])) {
		if (key.toLowerCase().includes('family')) continue;
		const name = key.replace('font', '').replace('line', '').replace('letter', '');
		let valueString = value;
		if (key.includes('fontSize')) valueString += ` (${Number(value.replace('rem', '')) * 16}px)`;
		styles.push(`${name}: ${valueString}`);
	}
	return { token, styleString: styles.join(join), styles: typeStyles[token as keyof typeof typeStyles] };
});

// group body style tokens by base size
const groupedBodyTokens = Object.groupBy(bodyTokens, (str) => {
	return str.split('-').slice(0, 2).join('-');
});

// create object of body styles for each base body style
let bodyStyles: Record<string, Record<string, CSSProperties>> = {};
for (const [key, value] of Object.entries(groupedBodyTokens)) {
	let styles: Record<string, CSSProperties> = {};
	value?.map((token) => {
		const keyString = token as keyof typeof typeStyles;
		styles = { ...styles, [keyString]: typeStyles[keyString] };
	});
	const entry = { [key.replace('body-', '')]: styles };
	bodyStyles = { ...bodyStyles, ...entry };
	console.log({ bodyStyles });
}

export const bodyStylesObject = bodyStyles;

export function getBaseBodyStyle(value: Record<string, CSSProperties>) {
	const cssStyles = Object.entries(value)[0][1];
	const styleString = [];
	for (const [key, value] of Object.entries(cssStyles)) {
		if (key.includes('Family') || key.includes('Decoration') || key.includes('Weight')) continue;
		const label = key.replace('font', '').replace('line', '').replace('letter', '');
		let valueString = value;
		if (key.includes('fontSize')) valueString += ` (${Number(value.replace('rem', '')) * 16}px)`;
		styleString.push(`${label}: ${valueString}`);
	}
	return styleString.join(join);
}

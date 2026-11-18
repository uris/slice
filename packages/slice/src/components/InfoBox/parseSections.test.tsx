import { describe, expect, it } from 'vitest';
import { InfoBoxAction } from './InfoBoxAction';
import { InfoBoxContent } from './InfoBoxContent';
import { InfoBoxImage } from './InfoBoxImage';
import { InfoBoxTitle } from './InfoBoxTitle';
import { parseSections } from './parseSections';

describe('InfoBox section parsing', () => {
	it('accepts sections in any order, including nested fragments and conditional sections', () => {
		const sections = parseSections(<><InfoBoxAction /><>{false}<InfoBoxContent text="Details" /><><InfoBoxImage /><InfoBoxTitle title="Profile" /></></></>);
		expect([...sections.keys()]).toEqual(['action', 'content', 'image', 'title']);
	});
	it.each([['title', InfoBoxTitle], ['content', InfoBoxContent], ['image', InfoBoxImage], ['action', InfoBoxAction]] as const)('reports duplicate %s sections', (name, Section) => {
		expect(() => parseSections(<><Section /><Section /></>)).toThrow(`InfoBox accepts only one ${name} section.`);
	});
	it('reports content that was not placed inside a section', () => {
		expect(() => parseSections(<div>Unwrapped content</div>)).toThrow('Place custom content inside a section.');
	});
	it('accepts empty and conditional content', () => {
		expect(parseSections([null, false, ' ']).size).toBe(0);
	});
});

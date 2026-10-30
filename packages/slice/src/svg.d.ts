declare module '*.svg' {
	import type * as React from 'react';
	const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	export { ReactComponent };
	const src: string; // For cases where SVG is used as a string
	export default src;
}

import type React from 'react';

/**
 * Convert a numeric or string size into a CSS-ready size value.
 */
export function setSizeStyle(size: string | number | undefined): string {
	if (!size) return 'auto';
	if (typeof size === 'string') return size;
	return `${size}px`;
}

/**
 * Remove scripts, invisible characters, and optional HTML tags from a string.
 */
export function cleanString(input: string, removeInvisible = true, removeHtml = true) {
	let clean: string = input;
	const scriptsRegEx = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
	clean = clean.replaceAll(scriptsRegEx, '');
	if (removeInvisible) {
		const invisibleRegEx = /[\r\n\t]/gi;
		clean = clean.replaceAll(invisibleRegEx, '');
	}
	if (removeHtml) {
		const htmlRegEx = /<\/?[a-z][^>]*>/gi;
		clean = clean.replaceAll(htmlRegEx, '');
	}
	return clean;
}

/**
 * Check whether the active document theme is currently dark.
 */
export function isDarkMode(): boolean {
	const theme = document.documentElement.dataset.sliceTheme;
	return theme?.includes('dark') ?? false;
}

/**
 * Log mount, unmount, and prop-change reasons for debug render tracking.
 */
export function debug(previous: any, updated: any, name = 'component') {
	if (process.env.NODE_ENV === 'test') return; // exit if running tests
	const props = previous.current.props;
	const mount = previous.current.mount;
	const unmount = previous.current.unmount;

	if (!mount && !unmount) createPropChangeArray(props, updated);
	return { props: updated, mount: false, unmount: false };
}

/**
 * Build a readable list of prop changes between two prop snapshots.
 */
export function createPropChangeArray(props: any, updated: any) {
	const reasons = [];
	for (const key of Object.keys(updated)) {
		if (updated[key] !== props[key]) {
			try {
				const propName = `${key}:`;
				const prev = JSON.stringify(props[key]);
				const next = JSON.stringify(updated[key]);
				const valueChanged = `${prev} > ${next}`;
				reasons.push(`${propName} ${valueChanged}`);
			} catch (error) {
				let message = 'Unknown error';
				if (error instanceof Error) message = error.message;
				if (typeof error === 'string') message = error;
				reasons.push(`${key} ${message}`);
			}
		}
	}
	return reasons;
}

/**
 * Capture props and lifecycle flags for the render debug helpers.
 */
export function setProps(props: any, mount = false, unmount = false) {
	if (process.env.NODE_ENV === 'test') return; // exit if running tests
	return { props, mount, unmount };
}

/**
 * Convert a hex color into an RGB string literal.
 */
export const hexToRgb = (hex: string | undefined, opacity?: number) => {
	if (!hex) return undefined;
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	const a = opacity ?? 1;
	return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * Trigger a click-like callback when one of the configured keys is pressed.
 */
export function accessibleKeyDown(e: React.KeyboardEvent<any>, clickFunction: () => void, keys?: string[]) {
	const activateWith = keys ?? ['Enter', ' '];
	const match = activateWith.includes(e.key);
	if (match) {
		e.preventDefault();
		clickFunction();
	}
}

/**
 * Read the horizontal pointer position from a mouse or touch event.
 */
export function pointerPosition(e: MouseEvent | TouchEvent): number {
	if (e.type.startsWith('touch')) {
		const touchEvent = e as TouchEvent;
		return touchEvent.touches[0].clientX;
	}
	const mouseEvent = e as MouseEvent;
	return mouseEvent.clientX;
}

/**
 * Remove empty class names and join the remainder into one class string.
 */
export function filterClasses(classNames: string[]): string {
	return classNames
		.filter((item) => item !== '')
		.join(' ')
		.trim();
}

/**
 * Normalize a style value or fallback into a CSS-ready string.
 */
export function setStyle(value: string | number | undefined, defaultVal: number | string | undefined = undefined) {
	const useValue = value ?? defaultVal;
	if (!useValue) return 'unset';
	if (typeof useValue === 'string') return useValue;
	return `${useValue}px`;
}

/**
 * Copy text to the clipboard using a temporary hidden textarea.
 */
export const copyToClipboard = async (rawContent: string): Promise<boolean> => {
	try {
		const textArea = document.createElement('textarea');
		textArea.value = rawContent;
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		document.execCommand('copy');
		textArea.remove();
		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Convert numeric or string percentage input into a normalized number.
 */
export function normalizedPercent(value: number | string): number {
	if (typeof value === 'number') return value;
	if (value.endsWith('%')) return Number.parseFloat(value);
	return Number.parseFloat(value) / 100;
}

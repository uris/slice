import React from 'react';
import type { DropDownOption } from './_types';

type OptionElement = React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>, 'option'>;
const emptyOptions: never[] = [];
const invalidChild =
	'DropDown children must be native <option> elements. Fragments and conditional options are allowed.';

function optionText(children: React.ReactNode): string {
	let text = '';
	React.Children.forEach(children, (child) => {
		if (child == null || typeof child === 'boolean') return;
		if (typeof child === 'string' || typeof child === 'number' || typeof child === 'bigint') {
			text += String(child);
			return;
		}
		if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
			text += optionText(child.props.children);
			return;
		}
		throw new Error('DropDown option content must be plain text.');
	});
	return text;
}
function collectOptions(children: React.ReactNode, elements: OptionElement[]) {
	React.Children.forEach(children, (child) => {
		if (child == null || typeof child === 'boolean') return;
		if (typeof child === 'string' && child.trim() === '') return;
		if (!React.isValidElement<{ children?: React.ReactNode }>(child)) throw new Error(invalidChild);
		if (child.type === React.Fragment) {
			collectOptions(child.props.children, elements);
			return;
		}
		if (child.type !== 'option') throw new Error(invalidChild);
		elements.push(child as OptionElement);
	});
}
export function resolveOptions<T>(items: DropDownOption<T>[] | undefined, children: React.ReactNode) {
	if (items !== undefined && children != null) {
		throw new Error('DropDown accepts either options or <option> children, not both.');
	}
	if (children == null) return { options: items ?? emptyOptions, elements: undefined };
	const elements: OptionElement[] = [];
	collectOptions(children, elements);
	const options = elements.map((element): DropDownOption<T> => {
		const props = element.props;
		if (props.selected !== undefined) {
			throw new Error('Use DropDown value or defaultValue instead of selected on <option>.');
		}
		if (props.value !== undefined && typeof props.value !== 'string' && typeof props.value !== 'number') {
			throw new Error('DropDown <option> values must be strings or numbers.');
		}
		const text = optionText(props.children)
			.replace(/[\t\n\f\r ]+/g, ' ')
			.trim();
		const value = props.value === undefined ? text : String(props.value);
		return {
			// The public children API is restricted to string-valued DropDowns.
			value: value as T,
			label: props.label ?? text,
			disabled: props.disabled,
		};
	});
	return { options, elements };
}

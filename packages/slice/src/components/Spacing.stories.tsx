import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { expect } from 'storybook/test';
import { Button } from './Button';
import { Chip } from './Chip';
import { DropDown } from './DropDown';
import { FileList } from './FileList';
import { RadioButton } from './RadioButton';
import { Switch } from './Switch';
import { TextArea } from './TextArea';
import { TextField } from './Textfield';

const meta = { title: 'Theme/Spacing normalization' } satisfies Meta;
export default meta;

export const DefaultsAndOverrides: StoryObj = {
	render: () => (
		<div style={{ display: 'grid', gap: 16, padding: 32 }}>
			<TextField className="plain" name="plain" clearButton={null} />
			<TextField className="icons" name="icons" iconLeft={{ name: 'basic.search', size: 20 }} />
			<TextField
				className="labeled"
				name="labeled"
				label="Label"
				iconLeft={{ name: 'basic.search', size: 20 }}
				actionButton
			/>
			<TextField className="password" name="password" inputType="password" actionButton />
			<TextField className="zero" name="zero" padding={0} />
			<TextField className="custom" name="custom" padding="2px calc(var(--spacing-m) + 4px) 8px 4px" />
			<DropDown className="dropdown" />
			<RadioButton className="radio" label="Radio" borderWidth={1} padding="8px 16px" />
			<RadioButton className="hidden-radio" label="No icon" borderWidth={1} padding="8px 16px" iconSize={0} />
			<Button className="text-button" label="Action" variant="text" size="small" />
			<Chip className="chip" label="Chip" icon="basic.search" paddingLeft={0} paddingRight={0} />
			<Switch className="switch" aria-label="Switch" />
			<div style={{ '--spacing-xxs': '4px' } as CSSProperties}>
				<Switch className="themed-switch" aria-label="Themed switch" />
			</div>
			<FileList className="files" files={[{ file: 'ready.txt' }, { file: 'uploading.txt', uploading: true }]} />
			<FileList className="zero-files" files={[{ file: 'zero.txt' }]} padding={0} />
			<TextArea className="textarea" name="textarea" />
		</div>
	),
	play: async ({ canvasElement }) => {
		const node = (selector: string) => canvasElement.querySelector(selector) as HTMLElement;
		const padding = async (selector: string, left: string, right: string) => {
			const css = getComputedStyle(node(selector));
			await expect(css.paddingLeft).toBe(left);
			await expect(css.paddingRight).toBe(right);
		};
		await padding('.plain', '16px', '16px');
		await padding('.icons', '12px', '12px');
		await padding('.labeled', '12px', '16px');
		await padding('.password', '16px', '12px');
		await padding('.zero', '0px', '0px');
		await padding('.custom', '4px', '20px');
		await padding('.dropdown', '16px', '12px');
		await padding('.radio > span', '16px', '16px');
		await padding('.hidden-radio > span', '16px', '16px');
		await padding('.text-button', '4px', '4px');
		await padding('.chip', '0px', '0px');
		await padding('.switch', '2px', '2px');
		await expect(getComputedStyle(node('.switch > div')).width).toBe('26px');
		await padding('.themed-switch', '4px', '4px');
		await expect(getComputedStyle(node('.themed-switch > div')).width).toBe('26px');
		await expect(getComputedStyle(node('.themed-switch > div')).height).toBe('14px');
		await padding('.files > div:first-child', '2px', '2px');
		await padding('.files > div:last-child', '2px', '4px');
		await padding('.zero-files > div', '0px', '0px');
		await padding('.textarea', '16px', '8px');
		await expect(getComputedStyle(node('.textarea')).paddingTop).toBe('16px');
		await expect(getComputedStyle(node('.textarea')).paddingBottom).toBe('16px');
		await padding('.textarea textarea', '0px', '0px');
	},
};

import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { H3, TrackedFlexBox } from '@/components/Type/Type';
import {
	type ColorValue,
	FlexBox,
	Icon,
	IconButton,
	Preset,
	SliceIcons,
	ToastType,
	useClipboard,
} from '@apple-pie/slice';
import { tipActions, useToastActions } from '@apple-pie/slice/stores';

export function PreviewSizes() {
	const sizes = [16, 20, 24, 32, 64];
	const strokes = [1, 1.25, 1.5, 2, 2.4];
	const colors: ColorValue[] = ['core-cyan', 'core-blue', 'core-indigo', 'core-purple', 'core-pink'];
	return (
		<FlexBox preset={Preset.RowBetween} margin={'0-64'}>
			{strokes.flatMap((stroke, index) => (
				<Icon
					key={`icon.${stroke}.${sizes[index]}`}
					name="basic.heart"
					size={sizes[index]}
					strokeColor={colors[index]}
					iconName={`Heart, ${sizes[index]}px, stroke ${stroke}`}
				/>
			))}
		</FlexBox>
	);
}

export const trackedIconGGroupItems = (): TrackedItem[] => {
	return Object.entries(SliceIcons).map(([group, icons]) => {
		return { id: `icon-group-${group}`, title: group, code: true };
	});
};

export function AllIcons() {
	const { copy } = useClipboard({ watchPermissions: false });
	const { push } = useToastActions();
	const renderIcons = () =>
		Object.entries(SliceIcons).map(([group, icons]) => {
			return (
				<TrackedFlexBox
					id={`icon-group-${group}`}
					key={`group.${group}`}
					preset={Preset.Column}
					width={'fill'}
					padding={'0-24'}
				>
					<FlexBox padding={'8-0'} style={{ borderBottom: '1px solid var(--core-fill-primary)' }}>
						<H3 style={{ paddingLeft: 0, textTransform: 'capitalize' }}>{group}</H3>
					</FlexBox>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, 56px)',
							gridAutoRows: '56px',
							justifyContent: 'start',
							justifyItems: 'start',
							alignItems: 'start',
							gap: 8,
							width: '100%',
							padding: '24px 0px',
						}}
					>
						{Object.entries(icons).map(([_key, name]) => {
							return (
								<IconButton
									key={name}
									icon={name}
									iconSize={24}
									iconStrokeWidth={1.5}
									buttonSize={40}
									actionName={`Copy ${name}`}
									tooltip={name}
									onToolTip={tipActions.push}
									backgroundColor={'transparent'}
									backgroundColorHover={'core-fill-primary'}
									onClick={() => {
										void copy(name);
										push({ message: `Copied ${name}`, type: ToastType.Success, duration: 1500 });
									}}
								/>
							);
						})}
					</div>
				</TrackedFlexBox>
			);
		});

	return renderIcons();
}

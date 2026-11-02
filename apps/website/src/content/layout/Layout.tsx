import { OnThisPage, type TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { useScrollboxSize } from '@/docs/stores/store';
import { AvatarDoc } from '@/src/content/documents/Avatar/Avatar';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { AnimatePresence } from 'motion/react';

const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'Avatar Component' },
	{ id: 'usage', title: 'Usage' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onToolTip', title: 'onToolTip', code: true },
		],
	},
];

export function ContentLayout() {
	const { height, width } = useScrollboxSize() ?? {};
	const showOnThisPage = (width ?? 0) > 840;
	const paddingBottom = height ? height / 2 : 48;

	return (
		<FlexDiv preset={Preset.Column} direction={'row'} gap={64} padding={`8px 48px ${paddingBottom}px 48px`}>
			<AvatarDoc />
			<AnimatePresence initial={true}>
				{showOnThisPage && <OnThisPage key="on-this-page" items={trackedItems} />}
			</AnimatePresence>
		</FlexDiv>
	);
}

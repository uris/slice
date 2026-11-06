'use client';

import { sidePanelConstraints } from '@/src/consts/consts';
import { Content } from '@/src/layout/Content';
import { Sidebar } from '@/src/layout/Sidebar';
import { DraggablePanel, FlexDiv, Preset, Tip, useToolTip, useWindow } from '@apple-pie/slice';
import { useTip } from '@apple-pie/slice/stores';
import { useRef } from 'react';

export function Layout() {
	const viewRef = useRef<HTMLDivElement | null>(null);
	const { height } = useWindow();
	const tipRef = useRef<HTMLDivElement>(null);
	const tip = useTip();
	const coords = useToolTip(tip, tipRef);

	return (
		<FlexDiv
			preset={Preset.Window}
			height={height}
			justify={'start'}
			align={'center'}
			ref={viewRef}
			background={'core-surface-primary'}
		>
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'right'}
					isClosed={false}
					dragHandle={false}
					sizeConstraints={sidePanelConstraints}
					borderRight={false}
				>
					<Sidebar />
				</DraggablePanel>
			</FlexDiv>
			<Content />
			<Tip tip={tip} coords={coords} ref={tipRef} />
		</FlexDiv>
	);
}

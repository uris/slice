'use client';

import { sidePanelConstraints } from '@/src/consts/consts';
import { Content } from '@/src/layout/Content';
import { Sidebar } from '@/src/layout/Sidebar';
import { DraggablePanel, FlexDiv, Preset, useWindow } from '@apple-pie/slice';
import { useRef } from 'react';

export function Layout() {
	const viewRef = useRef<HTMLDivElement | null>(null);
	const { height } = useWindow();

	return (
		<FlexDiv preset={Preset.Window} height={height} justify={'start'} align={'center'} ref={viewRef}>
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
		</FlexDiv>
	);
}

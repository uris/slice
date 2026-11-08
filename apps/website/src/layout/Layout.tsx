'use client';

import { detailsPanelConstraints, sidePanelConstraints } from '@/src/consts/consts';
import { Content } from '@/src/layout/Content';
import { Details } from '@/src/layout/Details';
import { Sidebar } from '@/src/layout/Sidebar';
import { DraggablePanel, FlexDiv, ModalController, Preset, Tip, useToolTip, useWindow } from '@apple-pie/slice';
import { useTip } from '@apple-pie/slice/stores';
import { classNames } from '@apple-pie/slice/utils';
import { useRef } from 'react';
import styles from './Layout.module.css';

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
					className={styles.sidebar}
				>
					<Sidebar />
				</DraggablePanel>
			</FlexDiv>
			<Content />
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'left'}
					isClosed={false}
					dragHandle={false}
					sizeConstraints={detailsPanelConstraints}
					className={classNames(styles.sidebar, styles.sidebarRight)}
				>
					<Details />
				</DraggablePanel>
			</FlexDiv>
			<Tip tip={tip} coords={coords} ref={tipRef} />
			<ModalController dragConstraintsRef={viewRef} draggable={true} />
		</FlexDiv>
	);
}

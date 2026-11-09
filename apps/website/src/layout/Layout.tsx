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
					resizeHandleLabel="Resize navigation sidebar"
					isClosed={false}
					dragHandle={false}
					sizeConstraints={sidePanelConstraints}
					className={styles.sidebar}
					borderRight={'1px solid var(--core-surface-secondary)'}
				>
					<Sidebar />
				</DraggablePanel>
			</FlexDiv>
			<Content />
			<FlexDiv preset={Preset.Draggable}>
				<DraggablePanel
					drags={'left'}
					resizeHandleLabel="Resize page outline sidebar"
					isClosed={false}
					dragHandle={false}
					sizeConstraints={detailsPanelConstraints}
					className={classNames(styles.sidebar, styles.sidebarRight)}
					borderLeft={'1px solid var(--core-surface-secondary)'}
				>
					<Details />
				</DraggablePanel>
			</FlexDiv>
			<Tip tip={tip} coords={coords} ref={tipRef} />
			<ModalController dragConstraintsRef={viewRef} draggable={true} />
		</FlexDiv>
	);
}

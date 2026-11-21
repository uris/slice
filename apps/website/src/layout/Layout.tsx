'use client';

import { useRightPanelClosed } from '@/docs/stores/store';
import { detailsPanelConstraints, sidePanelConstraints } from '@/src/consts/consts';
import { Content } from '@/src/layout/Content';
import { Details } from '@/src/layout/Details';
import { Sidebar } from '@/src/layout/Sidebar';
import {
	DraggablePanel,
	FlexBox,
	ModalController,
	Preset,
	Tip,
	Toast,
	VideoController,
	useToolTip,
	useWindow,
} from '@apple-pie/slice';
import { useTip, useToast, useToastActions } from '@apple-pie/slice/stores';
import { classNames } from '@apple-pie/slice/utils';
import { useRef } from 'react';
import styles from './Layout.module.css';

export function Layout() {
	const viewRef = useRef<HTMLDivElement | null>(null);
	const { height } = useWindow();
	const tipRef = useRef<HTMLDivElement>(null);
	const tip = useTip();
	const toast = useToast();
	const { clear } = useToastActions();
	const rightPanelClosed = useRightPanelClosed();
	const coords = useToolTip(tip, tipRef);

	return (
		<FlexBox
			preset={Preset.Window}
			height={height}
			justify={'start'}
			align={'center'}
			ref={viewRef}
			background={'core-surface-primary'}
		>
			<FlexBox preset={Preset.Column} height={'fill'}>
				<DraggablePanel
					drags={'right'}
					resizeHandleLabel="Resize navigation sidebar"
					isClosed={false}
					dragHandle={false}
					sizeConstraints={sidePanelConstraints}
					className={styles.sidebar}
					borderRight={'1px solid var(--core-outline-secondary)'}
				>
					<Sidebar />
				</DraggablePanel>
			</FlexBox>
			<Content />
			<FlexBox preset={Preset.Column} height={'fill'}>
				<DraggablePanel
					drags={'left'}
					resizeHandleLabel="Resize page outline sidebar"
					isClosed={rightPanelClosed}
					dragHandle={false}
					sizeConstraints={detailsPanelConstraints}
					className={classNames(styles.sidebar)}
					borderLeft={'1px dashed var(--core-fill-primary)'}
				>
					<Details />
				</DraggablePanel>
			</FlexBox>
			<Tip tip={tip} coords={coords} ref={tipRef} />
			<Toast {...toast} onHide={clear} />
			<ModalController dragConstraintsRef={viewRef} draggable={true} overlayOpacity={0.2} blur={4} />
			<VideoController quit={'outside'} draggable={false} dragConstraintsRef={viewRef} />
		</FlexBox>
	);
}

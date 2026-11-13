'use client';

import {detailsPanelConstraints, sidePanelConstraints} from '@/src/consts/consts';
import {Content} from '@/src/layout/Content';
import {Details} from '@/src/layout/Details';
import {Sidebar} from '@/src/layout/Sidebar';
import {
    DraggablePanel,
    FlexBox,
    ModalController,
    Preset,
    Tip,
    Toast,
    useToolTip,
    useWindow,
    VideoController,
} from '@apple-pie/slice';
import {useTip, useToast, useToastActions} from '@apple-pie/slice/stores';
import {classNames} from '@apple-pie/slice/utils';
import {useRef} from 'react';
import styles from './Layout.module.css';

export function Layout() {
    const viewRef = useRef<HTMLDivElement | null>(null);
    const {height} = useWindow();
    const tipRef = useRef<HTMLDivElement>(null);
    const tip = useTip();
    const toast = useToast();
    const {clear} = useToastActions();
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
                    borderRight={'1px solid var(--core-surface-secondary)'}
                >
                    <Sidebar/>
                </DraggablePanel>
            </FlexBox>
            <Content/>
            <FlexBox preset={Preset.Column} height={'fill'}>
                <DraggablePanel
                    drags={'left'}
                    resizeHandleLabel="Resize page outline sidebar"
                    isClosed={false}
                    dragHandle={false}
                    sizeConstraints={detailsPanelConstraints}
                    className={classNames(styles.sidebar, styles.sidebarRight)}
                    borderLeft={'1px solid var(--core-surface-secondary)'}
                >
                    <Details/>
                </DraggablePanel>
            </FlexBox>
            <Tip tip={tip} coords={coords} ref={tipRef}/>
            <Toast {...toast} onHide={clear}/>
            <ModalController dragConstraintsRef={viewRef} draggable={true}/>
            <VideoController quit={'outside'} draggable={false} dragConstraintsRef={viewRef}/>
        </FlexBox>
    );
}

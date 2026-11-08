'use client';

import { OnThisPage } from '@/components/OnThisPage/OnThisPage';
import { useTrackedItems } from '@/docs/stores/store';
import { detailsPanelConstraints, surfaceYellow } from '@/src/consts/consts';
import { FlexDiv, Preset, Tab, TabBar } from '@apple-pie/slice';
import { AnimatePresence } from 'motion/react';
import styles from './Layout.module.css';

export function Details() {
	const trackedItems = useTrackedItems();
	const showTrackedItems = trackedItems && trackedItems.length > 0;
	return (
		<FlexDiv
			preset={Preset.FillStart}
			background={'core-surface-primary'}
			style={{ minWidth: detailsPanelConstraints.min }}
		>
			<div className={styles.details}>
				<TabBar tabWidth="fill" accentColor={surfaceYellow}>
					<Tab value={'on-this-page'}>On this page</Tab>
				</TabBar>
				<AnimatePresence>{showTrackedItems && <OnThisPage key={'on-this-page'} />}</AnimatePresence>
			</div>
		</FlexDiv>
	);
}

/*
backgroundImage: `url("${sidebarPattern.src}")`,
backgroundRepeat: 'repeat',
backgroundSize: `${sidebarPattern.width * 0.2}px ${sidebarPattern.height * 0.2}px`,
 */

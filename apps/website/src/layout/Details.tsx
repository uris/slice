'use client';

import { OnThisPage } from '@/components/OnThisPage/OnThisPage';
import { ScrollIndicator } from '@/components/ScrollIndicator/ScrollIndicator';
import { useTrackedItems } from '@/docs/stores/store';
import { detailsPanelConstraints } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { AnimatePresence } from 'motion/react';
import styles from './Layout.module.css';

export function Details() {
	const trackedItems = useTrackedItems();
	const showTrackedItems = trackedItems && trackedItems.length > 0;
	return (
		<FlexBox preset={Preset.FillStart} style={{ minWidth: detailsPanelConstraints.min }}>
			<div className={styles.details}>
				<AnimatePresence>{showTrackedItems && <OnThisPage key={'on-this-page'} />}</AnimatePresence>
				<ScrollIndicator />
			</div>
		</FlexBox>
	);
}

/*
backgroundImage: `url("${sidebarPattern.src}")`,
backgroundRepeat: 'repeat',
backgroundSize: `${sidebarPattern.width * 0.2}px ${sidebarPattern.height * 0.2}px`,
 */

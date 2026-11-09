'use client';

import { OnThisPage } from '@/components/OnThisPage/OnThisPage';
import { useTrackedItems } from '@/docs/stores/store';
import { detailsPanelConstraints } from '@/src/consts/consts';
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
				<TabBar
					tabWidth="fill"
					underlineSelectedColor={'core-fill-primary'}
					underlineColor={'core-fill-primary'}
					textColorSelected={'core-text-primary'}
				>
					<Tab icon={'editor.wrap-text'} iconSize={16} value={'on-this-page'}>
						On this page
					</Tab>
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

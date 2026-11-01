'use client';

import { SidebarDocList } from '@/components/SidebarDocList/SidebarDocList';
import { SidebarDocuments } from '@/components/SidebarDocuments/SidebarDocuments';
import { SidebarHeader } from '@/components/SidebarHeader/SidebarHeader';
import { SquareTabs, type Tab } from '@/components/SqaureTabs/SqaureTabs';
import { getSidebarDocSections } from '@/docs/registry/sidebar';
import { usePackageType } from '@/docs/stores/store';
import { Package, sidePanelConstraints, surfaceDarker } from '@/src/consts/consts';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { useCallback } from 'react';

const packageTabs: readonly Tab<Package>[] = [
	{ name: 'React', id: Package.React, value: '/docs/react/get-started/' },
	{ name: 'React Native', id: Package.ReactNative, value: '/docs/react-native/get-started/' },
];

export function Sidebar() {
	const packageType = usePackageType();

	const handleChangeTab = useCallback(
		(tab: Tab<Package>) => {
			if (tab.id === packageType) return;
			window.open(tab.value, '_top');
		},
		[packageType],
	);

	return (
		<FlexDiv
			preset={Preset.FillStart}
			background={surfaceDarker}
			style={{
				minWidth: sidePanelConstraints.min,
			}}
		>
			<SidebarHeader />
			<SidebarDocuments>
				<SquareTabs<Package> tabs={packageTabs} selected={packageType} onChange={handleChangeTab} />
				<FlexDiv preset={Preset.FillScroll}>
					<SidebarDocList items={getSidebarDocSections(packageType)} />
				</FlexDiv>
			</SidebarDocuments>
		</FlexDiv>
	);
}

/*
backgroundImage: `url("${sidebarPattern.src}")`,
backgroundRepeat: 'repeat',
backgroundSize: `${sidebarPattern.width * 0.2}px ${sidebarPattern.height * 0.2}px`,
 */

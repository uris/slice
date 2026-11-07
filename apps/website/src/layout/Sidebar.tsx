'use client';

import {SidebarDocList} from '@/components/SidebarDocList/SidebarDocList';
import {SidebarDocuments} from '@/components/SidebarDocuments/SidebarDocuments';
import {getSidebarDocSections} from '@/docs/registry/sidebar';
import {usePackageType, useSlug} from '@/docs/stores/store';
import {Package, sidePanelConstraints, surfaceYellow} from '@/src/consts/consts';
import {FlexDiv, Preset, Tab, TabBar} from '@apple-pie/slice';
import {useCallback, useEffect} from 'react';

export function Sidebar() {
    const packageType = usePackageType();
    const slug = useSlug();

    const handleChangeTab = useCallback(
        (tab: Package) => {
            console.log(`/${tab}`);
            if (tab === packageType) return;
            window.open(`/docs/${tab}/overview`, '_top');
        },
        [packageType],
    );

    useEffect(() => {
        if (!slug) return;
        const element = document.getElementById(`sidebar.${slug}`);
        if (element) element.scrollIntoView({behavior: 'instant', block: 'center'});
    }, [slug]);

    return (
        <FlexDiv
            preset={Preset.FillStart}
            background={'core-surface-primary'}
            style={{
                minWidth: sidePanelConstraints.min,
            }}
        >
            <SidebarDocuments>
                <TabBar<Package> tabWidth="fill" accentColor={surfaceYellow} value={packageType}
                                 onChange={handleChangeTab}>
                    <Tab value={Package.React}>React</Tab>
                    <Tab value={Package.ReactNative}>React Native</Tab>
                </TabBar>
                <FlexDiv preset={Preset.FillScroll}>
                    <SidebarDocList items={getSidebarDocSections(packageType)}/>
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

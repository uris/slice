'use client';

import { HeaderCoverUp } from '@/components/HeaderCoverUp/HeaderCoverUp';
import { MainMenu } from '@/components/MainMenu/MainMenu';
import { useDocsActions, useScrollBox } from '@/docs/stores/store';
import { minScreenSize } from '@/src/consts/consts';
import { ContentLayout } from '@/src/content/layout/Layout';
import { FlexDiv, Preset, useObserveResize } from '@apple-pie/slice';
import { useCallback, useEffect } from 'react';

export function Content() {
	const { setScrollBoxSize, setScrollAmount } = useDocsActions();
	const containerRef = useScrollBox();
	const size = useObserveResize(containerRef);

	const handleScroll = useCallback(() => {
		const container = containerRef.current;
		if (container) setScrollAmount(container.scrollTop);
	}, [containerRef.current, setScrollAmount]);

	useEffect(() => setScrollBoxSize(size), [size, setScrollBoxSize]);

	return (
		<FlexDiv
			preset={Preset.FillStart}
			padding={'8px 8px 8px 0'}
			background={'core-surface-primary'}
			style={{ minWidth: minScreenSize }}
		>
			<FlexDiv preset={Preset.FillScroll} ref={containerRef} onScroll={handleScroll}>
				<MainMenu />
				<ContentLayout />
			</FlexDiv>
			<HeaderCoverUp />
		</FlexDiv>
	);
}

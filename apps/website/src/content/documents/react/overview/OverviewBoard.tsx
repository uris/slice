'use client';

import { surfaceYellow } from '@/src/consts/consts';
import { FlexBox, PillButtonBar, PopMenuController, Preset, Tab, resolveColor, useTheme } from '@apple-pie/slice';
import { tintFromColor } from '@apple-pie/slice/utils';
import { useId, useState } from 'react';
import { ComponentsOverview } from './components/ComponentsOverview';
import { HooksOverview } from './hooks/HooksOverview';
import libraryInventory from './libraryInventory.json';
import { StoresOverview } from './stores/StoresOverview';
import { UtilitiesOverview } from './utilities/UtilitiesOverview';

type OverviewPage = 'components' | 'hooks' | 'stores' | 'utilities';
const pages: OverviewPage[] = ['components', 'hooks', 'stores', 'utilities'];
// Placeholder taglines; replace this copy as each section develops.
const pageTaglines: Record<OverviewPage, string> = {
	components: `${libraryInventory.components.length} components for every app situation.`,
	hooks: `${libraryInventory.hooks.length} hooks for everyday browser capabilities.`,
	stores: `${libraryInventory.stores.length} stores for shared application state.`,
	utilities: `${libraryInventory.utilities.length} utilities for the details that make an app work.`,
};

function OverviewPageContent({ page }: { page: OverviewPage }) {
	if (page === 'hooks') return <HooksOverview />;
	if (page === 'stores') return <StoresOverview />;
	if (page === 'utilities') return <UtilitiesOverview />;
	return <ComponentsOverview />;
}

export function OverviewBoard() {
	const { isDark } = useTheme();
	const [page, setPage] = useState<OverviewPage>('components');
	const bgColor = isDark ? 'transparent' : tintFromColor(resolveColor('core-surface-primary'), -2);
	const id = useId();
	return (
		<FlexBox
			preset={Preset.FillStart}
			background={bgColor}
			borderRadius={32}
			padding={32}
			gap={32}
			border={'1px dashed var(--core-fill-primary)'}
		>
			<FlexBox preset={Preset.Row} width={'fill'} justify={'center'}>
				<PillButtonBar<OverviewPage>
					tabBarName="Overview sections"
					accentColor={surfaceYellow}
					value={page}
					onChange={setPage}
				>
					<Tab value="components" label="Components" id={`${id}-components-tab`} panelId={`${id}-components-panel`} />
					<Tab value="hooks" label="Hooks" id={`${id}-hooks-tab`} panelId={`${id}-hooks-panel`} />
					<Tab value="stores" label="Stores" id={`${id}-stores-tab`} panelId={`${id}-stores-panel`} />
					<Tab value="utilities" label="Utilities" id={`${id}-utilities-tab`} panelId={`${id}-utilities-panel`} />
				</PillButtonBar>
			</FlexBox>
			{pages.map((value) => (
				<div
					key={value}
					role="tabpanel"
					id={`${id}-${value}-panel`}
					aria-labelledby={`${id}-${value}-tab`}
					hidden={page !== value}
				>
					{page === value && <OverviewPageContent page={value} />}
				</div>
			))}
			<PopMenuController />
		</FlexBox>
	);
}

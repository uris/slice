'use client';

import { Path } from '@/components/Path/Path';
import { H1, P } from '@/components/Type/Type';
import { type DocumentLoader, type DocumentModule, getDocumentLoader } from '@/docs/registry/documents';
import {
	useDocsActions,
	useInitialized,
	useLoadState,
	usePackageType,
	useScrollboxSize,
	useSlug,
} from '@/docs/stores/store';
import { LoadState } from '@/docs/stores/types';
import { FlexBox, Preset, ProgressIndicator } from '@apple-pie/slice';
import { useEffect, useState } from 'react';

function LoadedDocument({ loader }: Readonly<{ loader?: DocumentLoader }>) {
	const [document, setDocument] = useState<DocumentModule>();
	const { setTrackedItems, setLoadState } = useDocsActions();
	const initialized = useInitialized();
	const loadState = useLoadState();

	useEffect(() => {
		let active = false;
		if (!initialized) {
			setLoadState(LoadState.Loading);
		} else if (initialized && !loader) {
			setLoadState(LoadState.NotFound);
		} else if (loader) {
			setLoadState(LoadState.Loading);
			active = true;
			loader()
				.then(
					(module) => {
						if (active) {
							setDocument(module);
							setTrackedItems(module.trackedItems ?? null);
						}
					},
					(error) => {
						if (!active) return;
						console.error('Unable to load document:', error);
						setTrackedItems(null);
					},
				)
				.finally(() => {
					setLoadState(LoadState.Loaded);
				});
		}
		return () => {
			active = false;
			setTrackedItems(null);
		};
	}, [loader, initialized, setTrackedItems, setLoadState]);

	switch (loadState) {
		case LoadState.Error: {
			return <DocumentLoadError />;
		}
		case LoadState.NotFound: {
			return <DocumentNotFound />;
		}
		case LoadState.Loaded: {
			if (!document) {
				setLoadState(LoadState.Error);
				return <DocumentLoadError />;
			}
			const { default: Document } = document ?? {};
			return <Document />;
		}
		default:
			return <Loading />;
	}
}

export function ContentLayout() {
	const { height } = useScrollboxSize() ?? {};
	const packageType = usePackageType();
	const slug = useSlug();
	const loader = getDocumentLoader(packageType, slug);
	const paddingBottom = height ? height / 2 : 48;
	const loadState = useLoadState();
	const flex = loadState === LoadState.Loaded ? undefined : 1;

	return (
		<FlexBox
			preset={Preset.Column}
			width={'fill'}
			justify={'center'}
			direction={'row'}
			gap={64}
			flex={flex}
			padding={`32px 48px ${paddingBottom}px 48px`}
			shrinkChildren={true}
		>
			<LoadedDocument key={`${packageType}/${slug}`} loader={loader} />
		</FlexBox>
	);
}

function DocumentNotFound() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Document not found</H1>
			<P>This document isn't available yet. Choose another document from the sidebar.</P>
		</FlexBox>
	);
}

function Loading() {
	return <ProgressIndicator show color={'core-text-primary'} size={24} />;
}

function DocumentLoadError() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Unable to load document</H1>
			<P>Please reload the page to try again, or choose another document from the sidebar.</P>
		</FlexBox>
	);
}

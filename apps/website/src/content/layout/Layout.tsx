'use client';

import { Path } from '@/components/Path/Path';
import { H1, P } from '@/components/Type/Type';
import { type DocumentLoader, type DocumentModule, getDocumentLoader } from '@/docs/registry/documents';
import { useDocsActions, usePackageType, useScrollboxSize, useSlug } from '@/docs/stores/store';
import { FlexBox, Preset } from '@apple-pie/slice';
import { useEffect, useState } from 'react';

function DocumentNotFound() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Document not found</H1>
			<P>This document isn't available yet. Choose another document from the sidebar.</P>
		</FlexBox>
	);
}

function LoadedDocument({ loader }: Readonly<{ loader: DocumentLoader }>) {
	const [document, setDocument] = useState<DocumentModule>();
	const [failed, setFailed] = useState(false);
	const { setTrackedItems } = useDocsActions();

	useEffect(() => {
		let active = true;
		loader().then(
			(module) => {
				if (active) setDocument(module);
			},
			(error) => {
				if (!active) return;
				console.error('Unable to load document:', error);
				setFailed(true);
			},
		);
		return () => {
			active = false;
		};
	}, [loader]);

	useEffect(() => {
		setTrackedItems(document?.trackedItems ?? null);
		return () => setTrackedItems(null);
	}, [document, setTrackedItems]);

	// show unable to load page if unable to load module
	if (failed) {
		return (
			<FlexBox preset={Preset.Column} maxWidth={680}>
				<Path />
				<H1 id="title">Unable to load document</H1>
				<P>Please reload the page to try again, or choose another document from the sidebar.</P>
			</FlexBox>
		);
	}

	// while no document is loaded and there's no error, show loading
	if (!document) return <div role="status">Loading document…</div>;

	// extract loaded module exports
	const { default: Document } = document;

	// return the loaded document
	return <Document />;
}

export function ContentLayout() {
	const { height } = useScrollboxSize() ?? {};
	const packageType = usePackageType();
	const slug = useSlug();
	const loader = getDocumentLoader(packageType, slug);
	const paddingBottom = height ? height / 2 : 48;

	return (
		<FlexBox
			preset={Preset.Column}
			width={'fill'}
			justify={'center'}
			direction={'row'}
			gap={64}
			padding={`32px 48px ${paddingBottom}px 48px`}
			shrinkChildren={true}
		>
			{loader ? <LoadedDocument key={`${packageType}/${slug}`} loader={loader} /> : <DocumentNotFound />}
		</FlexBox>
	);
}

/*
<AnimatePresence initial={true}>
	{showOnThisPage && <OnThisPage key="on-this-page" items={trackedItems}/>}
</AnimatePresence>
 */

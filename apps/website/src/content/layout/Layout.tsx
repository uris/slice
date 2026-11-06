'use client';

import { OnThisPage } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { H1, P } from '@/components/Type/Type';
import { type DocumentLoader, type DocumentModule, getDocumentLoader } from '@/docs/registry/documents';
import { usePackageType, useScrollboxSize, useSlug } from '@/docs/stores/store';
import { showOnThisPageMinWidth } from '@/src/consts/consts';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

function DocumentNotFound() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={680} style={{ minWidth: 420 }}>
			<Path />
			<H1 id="title">Document not found</H1>
			<P>This document isn't available yet. Choose another document from the sidebar.</P>
		</FlexDiv>
	);
}

function LoadedDocument({ loader, showOnThisPage }: Readonly<{ loader: DocumentLoader; showOnThisPage: boolean }>) {
	const [document, setDocument] = useState<DocumentModule>();
	const [failed, setFailed] = useState(false);

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

	if (failed) {
		return (
			<FlexDiv preset={Preset.Column} maxWidth={680}>
				<Path />
				<H1 id="title">Unable to load document</H1>
				<P>Please reload the page to try again, or choose another document from the sidebar.</P>
			</FlexDiv>
		);
	}

	if (!document) return <div role="status">Loading document…</div>;

	const { default: Document, trackedItems = [] } = document;
	return (
		<>
			<Document />
			<AnimatePresence initial={true}>
				{showOnThisPage && <OnThisPage key="on-this-page" items={trackedItems} />}
			</AnimatePresence>
		</>
	);
}

export function ContentLayout() {
	const { height, width } = useScrollboxSize() ?? {};
	const packageType = usePackageType();
	const slug = useSlug();
	const loader = getDocumentLoader(packageType, slug);
	const showOnThisPage = (width ?? 0) > showOnThisPageMinWidth;
	const paddingBottom = height ? height / 2 : 48;

	return (
		<FlexDiv
			preset={Preset.Column}
			justify={'center'}
			direction={'row'}
			gap={64}
			padding={`8px 48px ${paddingBottom}px 48px`}
		>
			{loader ? (
				<LoadedDocument key={`${packageType}/${slug}`} loader={loader} showOnThisPage={showOnThisPage} />
			) : (
				<DocumentNotFound />
			)}
		</FlexDiv>
	);
}

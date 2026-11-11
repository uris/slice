// Keep development CSS independent of App Router's stylesheet link lifecycle.
let timer;
let revision = 0;
const stylesheets = new Map();
const latest = new Map();
const active = new Map();
let observer;

function collectStyles() {
	for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
		const url = new URL(link.href, location.href);
		if (url.origin === location.origin && url.pathname.endsWith('.css')) stylesheets.set(url.pathname, link);
	}
}

async function replaceStyle(path, original) {
	const url = new URL(original.href, location.href);
	url.searchParams.set('hmr', `${Date.now()}-${++revision}`);
	const replacement = document.createElement('style');
	replacement.dataset.sliceHmr = path;
	if (original.nonce) replacement.nonce = original.nonce;
	latest.set(path, replacement);
	// Reserve the original stylesheet order while requests complete independently.
	document.head.appendChild(replacement);
	try {
		const response = await fetch(url.href, { cache: 'no-store' });
		if (!response.ok) throw new Error(`CSS refresh failed: ${response.status}`);
		const css = await response.text();
		if (latest.get(path) !== replacement) {
			replacement.remove();
			return;
		}
		// Webpack's CSS loader has already resolved font/image URLs to asset URLs.
		replacement.textContent = css;
		for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
			const candidate = new URL(link.href, location.href);
			if (candidate.origin === url.origin && candidate.pathname === path) link.remove();
		}
		active.get(path)?.remove();
		active.set(path, replacement);
	} catch {
		// Keep the last working stylesheet if a compile/request fails mid-update.
		replacement.remove();
	}
}

function reloadStyles() {
	collectStyles();
	for (const [path, original] of stylesheets) void replaceStyle(path, original);
}

function scheduleReload() {
	collectStyles();
	clearTimeout(timer);
	timer = setTimeout(reloadStyles, 50);
}

module.exports = function cssHotReload() {
	if (!observer) {
		observer = new MutationObserver((records) => {
			const addedStyles = records.some((record) =>
				Array.from(record.addedNodes).some((node) => node.nodeType === 1 && node.matches('link[rel="stylesheet"]')),
			);
			if (addedStyles) scheduleReload();
		});
		observer.observe(document.head, { childList: true });
	}
	// Dynamic document CSS has an unversioned URL even after a normal refresh.
	scheduleReload();
	return scheduleReload;
};

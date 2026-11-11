const { afterEach, beforeEach, it } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');

let dom;
let reload;
let requests;
const originalFetch = global.fetch;
const flush = () => new Promise(setImmediate);
beforeEach((context) => {
	context.mock.timers.enable({ apis: ['setTimeout'] });
	dom = new JSDOM('<link rel="preload" as="style" href="/theme.css"><link rel="stylesheet" href="/theme.css">', {
		url: 'http://localhost:6008',
	});
	global.document = dom.window.document;
	global.location = dom.window.location;
	global.MutationObserver = dom.window.MutationObserver;
	requests = [];
	global.fetch = (url, options) => new Promise((resolve, reject) => requests.push({ url, options, resolve, reject }));
	delete require.cache[require.resolve('./css-hot-reload.js')];
	reload = require('./css-hot-reload.js');
});
afterEach(() => {
	dom.window.close();
	global.document = undefined;
	global.location = undefined;
	global.MutationObserver = undefined;
	global.fetch = originalFetch;
});
const respond = (index, css) => requests[index].resolve({ ok: true, text: async () => css });

it('coalesces updates and fetches a fresh URL without the browser stylesheet cache', async (context) => {
	reload()();
	reload()();
	context.mock.timers.tick(50);
	assert.equal(requests.length, 1);
	assert.ok(new URL(requests[0].url).searchParams.has('hmr'));
	assert.equal(requests[0].options.cache, 'no-store');
	assert.ok(document.querySelector('[rel="stylesheet"]'));
	respond(0, 'body { color: red; }');
	await flush();
	assert.equal(document.querySelector('[data-slice-hmr]').textContent, 'body { color: red; }');
	assert.equal(document.querySelectorAll('[rel="stylesheet"]').length, 0);
	assert.equal(document.querySelectorAll('[rel="preload"]').length, 1);
});

it('remembers detached dynamic styles and removes duplicate versions after success', async (context) => {
	const dispose = reload();
	document.querySelector('[rel="stylesheet"]').remove();
	document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/theme.css?v=2">');
	dispose();
	context.mock.timers.tick(50);
	respond(0, 'body { color: blue; }');
	await flush();
	assert.equal(document.querySelectorAll('[rel="stylesheet"]').length, 0);
	assert.equal(document.querySelector('[data-slice-hmr]').textContent, 'body { color: blue; }');
});

it('keeps working styles on failure and permits a later retry', async (context) => {
	const original = document.querySelector('[rel="stylesheet"]');
	const dispose = reload();
	context.mock.timers.tick(50);
	requests[0].reject(new Error('compile in progress'));
	await flush();
	assert.ok(original.isConnected);
	dispose();
	context.mock.timers.tick(50);
	respond(1, 'body { color: green; }');
	await flush();
	assert.equal(document.querySelector('[data-slice-hmr]').textContent, 'body { color: green; }');
});

it('discards an older response that arrives after the newest stylesheet', async (context) => {
	const dispose = reload();
	context.mock.timers.tick(50);
	dispose();
	context.mock.timers.tick(50);
	respond(1, 'body { color: green; }');
	await flush();
	respond(0, 'body { color: red; }');
	await flush();
	assert.equal(document.querySelectorAll('[data-slice-hmr]').length, 1);
	assert.equal(document.querySelector('[data-slice-hmr]').textContent, 'body { color: green; }');
});

it('refreshes unversioned styles when a CSS module first loads', async (context) => {
	reload();
	context.mock.timers.tick(50);
	respond(0, 'body { color: purple; }');
	await flush();
	assert.equal(document.querySelector('[data-slice-hmr]').textContent, 'body { color: purple; }');
});

it('refreshes global styles inserted by a route refresh without module disposal', async (context) => {
	reload();
	context.mock.timers.tick(50);
	respond(0, 'body { color: red; }');
	await flush();
	document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/theme.css?v=2">');
	await flush();
	context.mock.timers.tick(50);
	respond(1, 'body { color: blue; }');
	await flush();
	assert.equal(document.querySelectorAll('[data-slice-hmr]').length, 1);
	assert.equal(document.querySelector('[data-slice-hmr]').textContent, 'body { color: blue; }');
});

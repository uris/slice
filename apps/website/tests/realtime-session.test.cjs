const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { transpileModule, ModuleKind } = require('typescript');

const source = readFileSync(`${__dirname}/../app/server/openai/realtime/session/request/route.ts`, 'utf8');
const compiled = transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText;
const route = {};
new Function('exports', compiled)(route);
const request = (origin = 'http://localhost:6008') =>
	new Request('http://localhost:6008/server/openai/realtime/session/request', { method: 'POST', headers: { origin } });

function configure(t) {
	const previous = process.env.PRIVATE_API_BASE_URL;
	process.env.PRIVATE_API_BASE_URL = 'https://api.example.test/';
	t.after(() => {
		if (previous === undefined) Reflect.deleteProperty(process.env, 'PRIVATE_API_BASE_URL');
		else process.env.PRIVATE_API_BASE_URL = previous;
	});
}

test('returns only the ephemeral token and requests an audio-only session', async (t) => {
	configure(t);
	t.mock.method(globalThis, 'fetch', async (url, options) => {
		assert.equal(url, 'https://api.example.test/openai/realtime/session');
		const session = JSON.parse(options.body);
		assert.deepEqual(session.output_modalities, ['audio']);
		assert.equal(session.audio.input.transcription, undefined);
		assert.equal(session.tools, undefined);
		assert.equal(options.cache, 'no-store');
		return Response.json({ value: 'test-ephemeral-token', session: { instructions: 'not forwarded' } });
	});
	const response = await route.POST(request());
	assert.equal(response.status, 200);
	assert.equal(response.headers.get('cache-control'), 'no-store');
	assert.deepEqual(await response.json(), { value: 'test-ephemeral-token' });
});

test('rejects cross-origin token requests without calling the backend', async (t) => {
	configure(t);
	const fetch = t.mock.method(globalThis, 'fetch', () => {
		throw new Error('Unexpected request');
	});
	assert.equal((await route.POST(request('https://other.example'))).status, 403);
	assert.equal(fetch.mock.callCount(), 0);
});

test('keeps upstream failures private and preserves rate-limit status', async (t) => {
	configure(t);
	t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'private upstream detail' }, { status: 429 }));
	const response = await route.POST(request());
	assert.equal(response.status, 429);
	assert(!JSON.stringify(await response.json()).includes('private upstream detail'));
});

test('handles missing configuration and invalid backend responses', async (t) => {
	configure(t);
	Reflect.deleteProperty(process.env, 'PRIVATE_API_BASE_URL');
	assert.equal((await route.POST(request())).status, 503);
	process.env.PRIVATE_API_BASE_URL = 'https://api.example.test';
	t.mock.method(globalThis, 'fetch', async () => Response.json({ value: null }));
	assert.equal((await route.POST(request())).status, 502);
});

import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IndexedDB } from './IndexedDB';

// fake-indexeddb/auto installs a shared global `indexedDB`. Reset it to a
// fresh factory between tests so databases created by one test never leak
// into the next.
beforeEach(() => {
	vi.stubGlobal('indexedDB', new IDBFactory());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('IndexedDB', () => {
	it('throws when indexedDB is not available in this environment', async () => {
		vi.stubGlobal('indexedDB', undefined);
		const db = new IndexedDB<{ id: string }>('missing-env');

		await expect(db.initialize()).rejects.toThrow('IndexedDB is not supported in this environment.');
	});

	it('creates the object store on first initialize', async () => {
		const db = new IndexedDB<{ id: string; name: string }>('widgets', { key: 'id' });

		await expect(db.initialize()).resolves.toBeUndefined();
		await expect(db.getAll()).resolves.toEqual([]);
	});

	it('initialize() is idempotent once a connection is open', async () => {
		const db = new IndexedDB<{ id: string }>('widgets', { key: 'id' });

		await db.initialize();
		await expect(db.initialize()).resolves.toBeUndefined();
	});

	it('rejects when initialize(false) is called against a database that does not exist yet', async () => {
		const db = new IndexedDB<{ id: string }>('widgets', { key: 'id' });

		await expect(db.initialize(false)).rejects.toThrow('IndexedDB does not exist.');
	});

	it('add()/get() round-trip a value by key', async () => {
		const db = new IndexedDB<{ value: string }>('store');

		const key = await db.add({ value: 'hello' }, 'a');

		expect(key).toBe('a');
		await expect(db.get('a')).resolves.toEqual({ value: 'hello' });
	});

	it('add() auto-generates a key when none is supplied and autoIncrement is enabled', async () => {
		const db = new IndexedDB<{ value: string }>('store', { autoIncrement: true });

		const key = await db.add({ value: 'first' });

		expect(key).toBe(1);
	});

	it('add() rejects when the key already exists', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.add({ value: 'first' }, 'a');

		await expect(db.add({ value: 'second' }, 'a')).rejects.toBeTruthy();
	});

	it('set() creates a new record and overwrites an existing one at the same key', async () => {
		const db = new IndexedDB<{ value: string }>('store');

		await db.set('a', { value: 'first' });
		await expect(db.get('a')).resolves.toEqual({ value: 'first' });

		await db.set('a', { value: 'second' });
		await expect(db.get('a')).resolves.toEqual({ value: 'second' });
	});

	it('update() is an alias for set()', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.set('a', { value: 'first' });

		await db.update('a', { value: 'updated' });

		await expect(db.get('a')).resolves.toEqual({ value: 'updated' });
	});

	it('get() resolves null for a missing key (native IDBObjectStore.get() resolves undefined; the wrapper normalizes it to null to match its declared T | null return type)', async () => {
		const db = new IndexedDB<{ value: string }>('store');

		await expect(db.get('missing')).resolves.toBeNull();
	});

	it('getAll() and getAllKeys() reflect every stored record', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.set('a', { value: 'first' });
		await db.set('b', { value: 'second' });

		await expect(db.getAllKeys()).resolves.toEqual(['a', 'b']);
		await expect(db.getAll()).resolves.toEqual([{ value: 'first' }, { value: 'second' }]);
	});

	it('remove() deletes a record by key', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.set('a', { value: 'first' });

		await db.remove('a');

		await expect(db.get('a')).resolves.toBeNull();
	});

	it('remove() on a key that does not exist resolves without throwing', async () => {
		const db = new IndexedDB<{ value: string }>('store');

		await expect(db.remove('missing')).resolves.toBeUndefined();
	});

	it('clear() empties the store', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.set('a', { value: 'first' });
		await db.set('b', { value: 'second' });

		await db.clear();

		await expect(db.getAll()).resolves.toEqual([]);
	});

	it('close() releases the connection so a later call re-initializes it', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.set('a', { value: 'first' });

		await db.close();

		// a subsequent operation transparently reopens the connection
		await expect(db.get('a')).resolves.toEqual({ value: 'first' });
	});

	it('destroy() closes the connection and deletes the underlying database', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.set('a', { value: 'first' });

		await db.destroy();

		const reopened = new IndexedDB<{ value: string }>('store');
		await expect(reopened.initialize(false)).rejects.toThrow('IndexedDB does not exist.');
	});

	it('destroy() throws when indexedDB is unavailable', async () => {
		const db = new IndexedDB<{ value: string }>('store');
		await db.initialize();
		vi.stubGlobal('indexedDB', undefined);

		await expect(db.destroy()).rejects.toThrow('IndexedDB is not supported in this environment.');
	});

	it('rejects a request when the underlying transaction fails', async () => {
		const db = new IndexedDB<{ value: string }>('store', { key: 'id' });
		await db.initialize();

		// adding a value without the required keyPath field fails the put
		// request at the transaction level
		await expect(db.add({ value: 'missing key path' })).rejects.toBeTruthy();
	});

	it('uses a separate database name when provided', async () => {
		const db = new IndexedDB<{ value: string }>('store', { databaseName: 'custom-db' });

		await db.initialize();

		const opened: string[] = [];
		if (typeof indexedDB.databases === 'function') {
			const databases = await indexedDB.databases();
			for (const entry of databases) {
				if (entry.name) opened.push(entry.name);
			}
			expect(opened).toContain('custom-db');
		}
	});
});

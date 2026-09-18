import { renderHook } from '@testing-library/react';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	localDBActions,
	useLocalDB,
	useLocalDBError,
	useLocalDBStore,
	useLocalDBValues,
	useManageLocalDB,
} from './localDBStore';

beforeEach(() => {
	vi.stubGlobal('indexedDB', new IDBFactory());
	useLocalDBStore.setState({ stores: [] });
});

afterEach(() => {
	vi.unstubAllGlobals();
});

type Widget = { id: string; name: string };

describe('localDBStore', () => {
	describe('addStore', () => {
		it('registers a new store and reads its (empty) initial records', async () => {
			const result = await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			expect(result.ok).toBe(true);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry).toBeDefined();
			expect(entry?.initialized).toBe(true);
			expect(entry?.records).toEqual([]);
			expect(entry?.error).toBeNull();
		});

		it('closes and replaces an existing connection with the same name', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			const firstConnection = useLocalDBStore.getState().stores[0]?.connection;
			const closeSpy = firstConnection ? vi.spyOn(firstConnection, 'close') : undefined;

			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			expect(closeSpy).toHaveBeenCalled();
			expect(useLocalDBStore.getState().stores).toHaveLength(1);
		});

		it('records a failure result and stores an error state when initialize rejects', async () => {
			vi.stubGlobal('indexedDB', undefined);

			const result = await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			expect(result.ok).toBe(false);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.initialized).toBe(false);
			expect(entry?.error).toBeTruthy();
		});
	});

	describe('removeStore', () => {
		it('closes the connection and removes it from state', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			const connection = useLocalDBStore.getState().stores[0]?.connection;
			const closeSpy = connection ? vi.spyOn(connection, 'close') : undefined;

			const result = await useLocalDBStore.getState().actions.removeStore('widgets');

			expect(result.ok).toBe(true);
			expect(closeSpy).toHaveBeenCalled();
			expect(useLocalDBStore.getState().stores).toHaveLength(0);
		});

		it('is a no-op success for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.removeStore('missing');

			expect(result.ok).toBe(true);
		});
	});

	describe('refreshStore', () => {
		it('re-reads records from the underlying connection', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			const connection = useLocalDBStore.getState().stores[0]?.connection;
			await connection?.set('a', { id: 'a', name: 'first' });

			const result = await useLocalDBStore.getState().actions.refreshStore('widgets');

			expect(result.ok).toBe(true);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.records).toEqual([{ key: 'a', value: { id: 'a', name: 'first' } }]);
		});

		it('fails for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.refreshStore('missing');

			expect(result.ok).toBe(false);
			if (!result.ok) {
				expect(result.error.message).toContain('is not registered');
			}
		});
	});

	describe('setValue', () => {
		it('derives the key from the configured key field and stores a single value', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const result = await useLocalDBStore.getState().actions.setValue('widgets', { id: 'a', name: 'first' });

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toBe('a');
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.records).toEqual([{ key: 'a', value: { id: 'a', name: 'first' } }]);
		});

		it('accepts an array of values and returns an array of resolved keys', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const result = await useLocalDBStore.getState().actions.setValue('widgets', [
				{ id: 'a', name: 'first' },
				{ id: 'b', name: 'second' },
			]);

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(['a', 'b']);
		});

		it('fails when the store has no configured key field', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets');

			const result = await useLocalDBStore.getState().actions.setValue('widgets', { id: 'a' });

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toContain('requires a configured key field');
		});

		it('fails when the value does not have the key field', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const result = await useLocalDBStore.getState().actions.setValue('widgets', { name: 'no id' });

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toContain('expected field "id"');
		});

		it('fails when the value is not an object', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const result = await useLocalDBStore.getState().actions.setValue('widgets', 'not-an-object');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toContain('expects object values');
		});

		it('fails when the key field value is not a valid IDB key', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const result = await useLocalDBStore.getState().actions.setValue('widgets', { id: { nested: true } });

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error.message).toContain('does not contain a valid IndexedDB key');
		});

		it('fails for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.setValue('missing', { id: 'a' });

			expect(result.ok).toBe(false);
		});

		it('records a store-level error and preserves it on the entry when the underlying write throws', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			const connection = useLocalDBStore.getState().stores[0]?.connection;
			if (!connection) throw new Error('expected a connection');
			vi.spyOn(connection, 'set').mockRejectedValue(new Error('write failed'));

			const result = await useLocalDBStore.getState().actions.setValue('widgets', { id: 'a', name: 'first' });

			expect(result.ok).toBe(false);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.error).toBe('write failed');
		});
	});

	describe('addValue', () => {
		it('adds a value without requiring a key field when the store auto-increments', async () => {
			await useLocalDBStore.getState().actions.addStore('logs', { autoIncrement: true });

			const result = await useLocalDBStore.getState().actions.addValue('logs', { message: 'hello' });

			expect(result.ok).toBe(true);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'logs');
			expect(entry?.records).toHaveLength(1);
		});

		it('fails when the store has neither a key path, autoIncrement, nor an explicit key (native IndexedDB requires one of the three)', async () => {
			await useLocalDBStore.getState().actions.addStore('logs');

			const result = await useLocalDBStore.getState().actions.addValue('logs', { message: 'hello' });

			expect(result.ok).toBe(false);
		});

		it('accepts an array of values', async () => {
			await useLocalDBStore.getState().actions.addStore('logs', { autoIncrement: true });

			const result = await useLocalDBStore.getState().actions.addValue('logs', [{ message: 'a' }, { message: 'b' }]);

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual([1, 2]);
		});

		it('fails for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.addValue('missing', { message: 'a' });

			expect(result.ok).toBe(false);
		});
	});

	describe('removeValue', () => {
		it('removes a value by its derived key', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			await useLocalDBStore.getState().actions.setValue('widgets', { id: 'a', name: 'first' });

			const result = await useLocalDBStore.getState().actions.removeValue('widgets', { id: 'a' });

			expect(result.ok).toBe(true);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.records).toEqual([]);
		});

		it('accepts an array of values to remove', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			await useLocalDBStore.getState().actions.setValue('widgets', [
				{ id: 'a', name: 'first' },
				{ id: 'b', name: 'second' },
			]);

			const result = await useLocalDBStore.getState().actions.removeValue('widgets', [{ id: 'a' }, { id: 'b' }]);

			expect(result.ok).toBe(true);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.records).toEqual([]);
		});

		it('fails for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.removeValue('missing', { id: 'a' });

			expect(result.ok).toBe(false);
		});
	});

	describe('clearStore', () => {
		it('empties the store records', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			await useLocalDBStore.getState().actions.setValue('widgets', { id: 'a', name: 'first' });

			const result = await useLocalDBStore.getState().actions.clearStore('widgets');

			expect(result.ok).toBe(true);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.records).toEqual([]);
		});

		it('fails for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.clearStore('missing');

			expect(result.ok).toBe(false);
		});
	});

	describe('destroyStore', () => {
		it('destroys the connection and removes it from state', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const result = await useLocalDBStore.getState().actions.destroyStore('widgets');

			expect(result.ok).toBe(true);
			expect(useLocalDBStore.getState().stores).toHaveLength(0);
		});

		it('is a no-op success for an unregistered store name', async () => {
			const result = await useLocalDBStore.getState().actions.destroyStore('missing');

			expect(result.ok).toBe(true);
		});

		it('records an error when the underlying destroy throws', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			const connection = useLocalDBStore.getState().stores[0]?.connection;
			if (!connection) throw new Error('expected a connection');
			vi.spyOn(connection, 'destroy').mockRejectedValue(new Error('destroy failed'));

			const result = await useLocalDBStore.getState().actions.destroyStore('widgets');

			expect(result.ok).toBe(false);
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.error).toBe('destroy failed');
		});
	});

	describe('useLocalDB / useManageLocalDB', () => {
		it('binds name-scoped actions that delegate to the store actions', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			const { result } = renderHook(() => useLocalDB('widgets'));

			await result.current.add({ id: 'a', name: 'first' });
			const entry = useLocalDBStore.getState().stores.find((s) => s.name === 'widgets');
			expect(entry?.records).toHaveLength(1);

			await result.current.set({ id: 'a', name: 'updated' });
			await result.current.refresh();
			await result.current.remove({ id: 'a' });
			expect(useLocalDBStore.getState().stores.find((s) => s.name === 'widgets')?.records).toEqual([]);

			await result.current.clear();
			await result.current.destroy();
			expect(useLocalDBStore.getState().stores).toHaveLength(0);
		});

		it('useManageLocalDB() exposes the raw actions object', () => {
			expect(useManageLocalDB()).toBe(useLocalDBStore.getState().actions);
		});

		it('the deprecated localDBActions alias points at the store actions', () => {
			expect(localDBActions).toBe(useLocalDBStore.getState().actions);
		});
	});

	describe('useLocalDBValues', () => {
		beforeEach(async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });
			await useLocalDBStore.getState().actions.setValue('widgets', [
				{ id: 'a', name: 'first' },
				{ id: 'b', name: 'second' },
			] satisfies Widget[]);
		});

		it('returns all values when called with only a name', () => {
			const { result } = renderHook(() => useLocalDBValues<Widget>('widgets'));

			expect(result.current).toEqual([
				{ id: 'a', name: 'first' },
				{ id: 'b', name: 'second' },
			]);
		});

		it('returns an empty array for an unregistered store', () => {
			const { result } = renderHook(() => useLocalDBValues<Widget>('missing'));

			expect(result.current).toEqual([]);
		});

		it('returns a single value when called with a direct key', () => {
			const { result } = renderHook(() => useLocalDBValues<Widget>('widgets', 'a'));

			expect(result.current).toEqual({ id: 'a', name: 'first' });
		});

		it('returns null when called with a key that has no matching record', () => {
			const { result } = renderHook(() => useLocalDBValues<Widget>('widgets', 'missing-key'));

			expect(result.current).toBeNull();
		});

		it('filters values by field/value pair when both are provided', () => {
			const { result } = renderHook(() => useLocalDBValues<Widget>('widgets', 'name', 'second'));

			expect(result.current).toEqual([{ id: 'b', name: 'second' }]);
		});
	});

	describe('useLocalDBError', () => {
		it('reflects the current error for a store', async () => {
			vi.stubGlobal('indexedDB', undefined);
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const { result } = renderHook(() => useLocalDBError('widgets'));

			expect(result.current).toBeTruthy();
		});

		it('is null for a store with no error', async () => {
			await useLocalDBStore.getState().actions.addStore('widgets', { key: 'id' });

			const { result } = renderHook(() => useLocalDBError('widgets'));

			expect(result.current).toBeNull();
		});

		it('is null for an unregistered store', () => {
			const { result } = renderHook(() => useLocalDBError('missing'));

			expect(result.current).toBeNull();
		});
	});
});

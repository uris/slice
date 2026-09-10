import { useMemo } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { IndexedDB } from '../../utils';
import type {
	LocalDBActionResult,
	LocalDBActionValueResult,
	LocalDBActions,
	LocalDBConnection,
	LocalDBRecord,
	LocalDBStoreOptions,
	LocalDBStoreState,
} from './_types';

// determine if a value is a valid IDB key
function isValidIDBKey(key: unknown): key is IDBValidKey {
	if (typeof key === 'string' || typeof key === 'number' || key instanceof Date || key instanceof ArrayBuffer) {
		return true;
	}

	if (Array.isArray(key)) {
		return key.every((entry) => isValidIDBKey(entry));
	}
	return ArrayBuffer.isView(key);
}

/**
 * Determine if two keys are equal based on their value type
 */
function areKeysEqual(left: IDBValidKey, right: IDBValidKey): boolean {
	if (left instanceof Date && right instanceof Date) {
		return left.getTime() === right.getTime();
	}

	if (Array.isArray(left) && Array.isArray(right)) {
		if (left.length !== right.length) return false;
		return left.every((value, index) => areKeysEqual(value, right[index]));
	}

	return left === right;
}

/**
 * Normalize a value to an array of values
 */
function normalizeValues<TValue>(value: TValue | TValue[]): TValue[] {
	return Array.isArray(value) ? value : [value];
}

/**
 * Read and return all records from an IndexedDB connection
 */
async function readStoreRecords(connection: IndexedDB<unknown>): Promise<LocalDBRecord<unknown>[]> {
	const [keys, values] = await Promise.all([connection.getAllKeys(), connection.getAll()]);

	return keys.map((key, index) => ({
		key,
		value: values[index] ?? null,
	}));
}

/**
 * Get the db connection for a given store name
 */
function getConnection(stores: LocalDBConnection[], name: string): LocalDBConnection<unknown> {
	const connection = stores.find((entry) => entry.name === name);
	if (!connection) {
		throw new Error(`IndexedDB store "${name}" is not registered.`);
	}

	return connection;
}

/**
 * Apply a partial state patch to a connection
 */
function applyConnectionState(name: string, patch: Partial<LocalDBConnection<unknown>>) {
	useLocalDBStore.setState((state) => ({
		stores: state.stores.map((entry) => (entry.name === name ? { ...entry, ...patch } : entry)),
	}));
}

/**
 * Apply error to to the connection state
 */
function applyStoreError(name: string, error: unknown) {
	applyConnectionState(name, {
		error: error instanceof Error ? error.message : String(error),
	});
}

/**
 * Helper to convert an error to an Error instance
 */
function toError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error));
}

/**
 * Helper to create a success result value
 */
function successResult(): LocalDBActionResult {
	return { ok: true };
}

/**
 * Helper to create a failure result value
 */
function failureResult(error: unknown): LocalDBActionResult {
	return { ok: false, error: toError(error) };
}

/**
 * Helper to derive the success value from an op
 */
function successValueResult<TValue>(value: TValue): LocalDBActionValueResult<TValue> {
	return { ok: true, value };
}

/**
 * Helper to derive the success value from an op
 */
function failureValueResult<TValue>(error: unknown): LocalDBActionValueResult<TValue> {
	return { ok: false, error: toError(error) };
}

/**
 * Helper to indicate a key field is required for actions
 */
function requireStoreKey(store: LocalDBConnection<unknown>): string {
	if (!store.key) {
		throw new Error(`IndexedDB store "${store.name}" requires a configured key field for value-driven actions.`);
	}
	return store.key;
}

/**
 * Helper to get the a store key field from a value
 */
function deriveRecordKey(store: LocalDBConnection<unknown>, value: unknown): IDBValidKey {
	const keyField = requireStoreKey(store);
	if (!value || typeof value !== 'object') {
		throw new Error(`IndexedDB store "${store.name}" expects object values for value-driven actions.`);
	}

	const candidate = (value as Record<string, unknown>)[keyField];
	if (candidate === undefined) {
		throw new Error(`IndexedDB store "${store.name}" expected field "${keyField}" on the provided value.`);
	}

	if (!isValidIDBKey(candidate)) {
		throw new Error(`IndexedDB store "${store.name}" field "${keyField}" does not contain a valid IndexedDB key.`);
	}

	return candidate;
}

function replaceConnection(connection: LocalDBConnection<unknown>) {
	useLocalDBStore.setState((state) => ({
		stores: [...state.stores.filter((entry) => entry.name !== connection.name), connection],
	}));
}

/**
 * Update connection with an error state
 */
function replaceConnectionWithError(name: string, connection: IndexedDB<unknown>, key: string | null, error: unknown) {
	replaceConnection({
		name,
		connection,
		key,
		records: [],
		initialized: false,
		error: toError(error).message,
	});
}

export const useLocalDBStore = create<LocalDBStoreState>((set, get) => ({
	stores: [],
	actions: {
		addStore: async (name: string, options: LocalDBStoreOptions = {}) => {
			const existing = get().stores.find((entry) => entry.name === name);
			const { create = true, ...connectionOptions } = options;
			const connection = new IndexedDB<unknown>(name, connectionOptions);

			try {
				await existing?.connection.close();

				await connection.initialize(create);
				const records = await readStoreRecords(connection);
				const nextConnection: LocalDBConnection<unknown> = {
					name,
					connection,
					key: options.key ?? null,
					records,
					initialized: true,
					error: null,
				};

				replaceConnection(nextConnection);
				return successResult();
			} catch (error) {
				replaceConnectionWithError(name, connection, options.key ?? null, error);
				return failureResult(error);
			}
		},
		removeStore: async (name: string) => {
			try {
				const existing = get().stores.find((entry) => entry.name === name);
				if (!existing) return successResult();

				await existing.connection.close();
				set((state) => ({
					stores: state.stores.filter((entry) => entry.name !== name),
				}));
				return successResult();
			} catch (error) {
				applyStoreError(name, error);
				return failureResult(error);
			}
		},
		refreshStore: async (name: string) => {
			try {
				const existing = getConnection(get().stores, name);
				const records = await readStoreRecords(existing.connection);
				applyConnectionState(name, { records, initialized: true, error: null });
				return successResult();
			} catch (error) {
				applyStoreError(name, error);
				return failureResult(error);
			}
		},
		setValue: async (name: string, value: unknown) => {
			try {
				const existing = getConnection(get().stores, name);
				const values = normalizeValues(value);
				const resolvedKeys: IDBValidKey[] = [];
				for (const item of values) {
					const key = deriveRecordKey(existing, item);
					const resolvedKey = await existing.connection.set(key, item);
					resolvedKeys.push(resolvedKey);
				}
				const records = await readStoreRecords(existing.connection);
				applyConnectionState(name, { records, error: null });
				return successValueResult(Array.isArray(value) ? resolvedKeys : resolvedKeys[0]);
			} catch (error) {
				applyStoreError(name, error);
				return failureValueResult(error);
			}
		},
		addValue: async (name: string, value: unknown) => {
			try {
				const existing = getConnection(get().stores, name);
				const values = normalizeValues(value);
				const resolvedKeys: IDBValidKey[] = [];
				for (const item of values) {
					const resolvedKey = await existing.connection.add(item);
					resolvedKeys.push(resolvedKey);
				}
				const records = await readStoreRecords(existing.connection);
				applyConnectionState(name, { records, error: null });
				return successValueResult(Array.isArray(value) ? resolvedKeys : resolvedKeys[0]);
			} catch (error) {
				applyStoreError(name, error);
				return failureValueResult(error);
			}
		},
		removeValue: async (name: string, value: unknown) => {
			try {
				const existing = getConnection(get().stores, name);
				const values = normalizeValues(value);
				for (const item of values) {
					const key = deriveRecordKey(existing, item);
					await existing.connection.remove(key);
				}
				const records = await readStoreRecords(existing.connection);
				applyConnectionState(name, { records, error: null });
				return successResult();
			} catch (error) {
				applyStoreError(name, error);
				return failureResult(error);
			}
		},
		clearStore: async (name: string) => {
			try {
				const existing = getConnection(get().stores, name);
				await existing.connection.clear();
				applyConnectionState(name, { records: [], error: null });
				return successResult();
			} catch (error) {
				applyStoreError(name, error);
				return failureResult(error);
			}
		},
		destroyStore: async (name: string) => {
			try {
				const existing = get().stores.find((entry) => entry.name === name);
				if (!existing) return successResult();

				await existing.connection.destroy();
				set((state) => ({
					stores: state.stores.filter((entry) => entry.name !== name),
				}));
				return successResult();
			} catch (error) {
				applyStoreError(name, error);
				return failureResult(error);
			}
		},
	} satisfies LocalDBActions,
}));

type BoundLocalDBActions = {
	refresh: () => ReturnType<LocalDBActions['refreshStore']>;
	set: (value: unknown) => ReturnType<LocalDBActions['setValue']>;
	add: (value: unknown) => ReturnType<LocalDBActions['addValue']>;
	remove: (value: unknown) => ReturnType<LocalDBActions['removeValue']>;
	clear: () => ReturnType<LocalDBActions['clearStore']>;
	destroy: () => ReturnType<LocalDBActions['destroyStore']>;
};

// reactive hooks for React components
export const useLocalDB = (name: string): BoundLocalDBActions => {
	const actions = useManageLocalDB();

	return useMemo(
		() => ({
			refresh: () => actions.refreshStore(name),
			set: (value: unknown) => actions.setValue(name, value),
			add: (value: unknown) => actions.addValue(name, value),
			remove: (value: unknown) => actions.removeValue(name, value),
			clear: () => actions.clearStore(name),
			destroy: () => actions.destroyStore(name),
		}),
		[actions, name],
	);
};

export function useLocalDBValues<TValue = Record<string, unknown>>(name: string): TValue[];
export function useLocalDBValues<TValue = Record<string, unknown>>(name: string, key: IDBValidKey): TValue | null;
export function useLocalDBValues<TValue = Record<string, unknown>>(
	name: string,
	field: keyof TValue,
	value: TValue[keyof TValue],
): TValue[];
export function useLocalDBValues<TValue = Record<string, unknown>>(
	name: string,
	fieldOrKey?: keyof TValue | IDBValidKey,
	value?: TValue[keyof TValue],
) {
	const records = useLocalDBStore(
		useShallow(
			(state) =>
				(state.stores.find((entry) => entry.name === name)?.records as LocalDBRecord<TValue>[] | undefined) ?? [],
		),
	);

	return useMemo(() => {
		const values = records.map((record) => record.value);
		if (fieldOrKey === undefined) return values;
		if (value === undefined) {
			return records.find((record) => areKeysEqual(record.key, fieldOrKey as IDBValidKey))?.value ?? null;
		}
		return values.filter((entry) => entry?.[fieldOrKey as keyof TValue] === value);
	}, [fieldOrKey, records, value]);
}

export const useLocalDBError = (name: string) =>
	useLocalDBStore((state) => state.stores.find((entry) => entry.name === name)?.error ?? null);

export const useManageLocalDB = (): LocalDBActions => useLocalDBStore.getState().actions;

// deprecated alias maintained for compatibility
export const localDBActions = useLocalDBStore.getState().actions;

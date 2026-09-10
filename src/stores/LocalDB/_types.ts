import type { IndexedDB, IndexedDBOptions } from '../../utils';

export interface LocalDBRecord<TValue = unknown> {
	key: IDBValidKey;
	value: TValue;
}

export interface LocalDBConnection<TValue = unknown> {
	name: string;
	connection: IndexedDB<TValue>;
	key: string | null;
	records: LocalDBRecord<TValue>[];
	initialized: boolean;
	error: string | null;
}

export interface LocalDBStoreOptions extends Omit<IndexedDBOptions, 'databaseName'> {
	create?: boolean;
}

export type LocalDBActionResult =
	| {
			ok: true;
	  }
	| {
			ok: false;
			error: Error;
	  };

export type LocalDBActionValueResult<TValue> =
	| {
			ok: true;
			value: TValue;
	  }
	| {
			ok: false;
			error: Error;
	  };

export interface LocalDBActions {
	addStore: (name: string, options?: LocalDBStoreOptions) => Promise<LocalDBActionResult>;
	removeStore: (name: string) => Promise<LocalDBActionResult>;
	refreshStore: (name: string) => Promise<LocalDBActionResult>;
	setValue: (
		name: string,
		value: unknown | unknown[],
	) => Promise<LocalDBActionValueResult<IDBValidKey | IDBValidKey[]>>;
	addValue: (
		name: string,
		value: unknown | unknown[],
	) => Promise<LocalDBActionValueResult<IDBValidKey | IDBValidKey[]>>;
	removeValue: (name: string, value: unknown | unknown[]) => Promise<LocalDBActionResult>;
	clearStore: (name: string) => Promise<LocalDBActionResult>;
	destroyStore: (name: string) => Promise<LocalDBActionResult>;
}

export interface LocalDBStoreState {
	stores: LocalDBConnection[];
	actions: LocalDBActions;
}

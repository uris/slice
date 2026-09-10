export interface IndexedDBOptions {
	databaseName?: string;
	version?: number;
	key?: string;
	autoIncrement?: boolean;
}

export class IndexedDB<T> {
	private readonly databaseName: string;
	private readonly storeName: string;
	private readonly version: number;
	private readonly key?: string;
	private readonly autoIncrement: boolean;
	private db: IDBDatabase | null = null;

	constructor(storeName: string, options: IndexedDBOptions = {}) {
		this.storeName = storeName;
		this.databaseName = options.databaseName ?? storeName;
		this.version = options.version ?? 1;
		this.key = options.key;
		this.autoIncrement = options.autoIncrement ?? false;
	}

	/**
	 * Initialize the IndexedDB connection.
	 */
	public async initialize(create = true): Promise<void> {
		if (this.db) return;

		if (typeof indexedDB === 'undefined') {
			throw new TypeError('IndexedDB is not supported in this environment.');
		}

		this.db = await new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(this.databaseName, this.version);
			let settled = false;

			const rejectOnce = (error: Error) => {
				if (settled) return;
				settled = true;
				reject(error);
			};

			const resolveOnce = (database: IDBDatabase) => {
				if (settled) {
					database.close();
					return;
				}
				settled = true;
				resolve(database);
			};

			// reject promise if there's an error
			request.onerror = () => {
				rejectOnce(request.error ?? new Error('Failed to open IndexedDB.'));
			};

			// if it does not exist, create and setup. If higher version, upgrade.
			request.onupgradeneeded = () => {
				const database = request.result;
				if (!database.objectStoreNames.contains(this.storeName)) {
					if (create) {
						database.createObjectStore(this.storeName, {
							keyPath: this.key,
							autoIncrement: this.autoIncrement,
						});
					} else {
						request.transaction?.abort();
						rejectOnce(new Error('IndexedDB does not exist.'));
					}
				}
			};

			// return the db
			request.onsuccess = () => {
				resolveOnce(request.result);
			};
		});
	}

	/**
	 * Get a single DB value by key.
	 */
	public async get(key: IDBValidKey): Promise<T | null> {
		return this.runRequest<T | null>('readonly', (store) => store.get(key));
	}

	/**
	 * Get all the values in the store.
	 */
	public async getAll(): Promise<T[]> {
		return this.runRequest<T[]>('readonly', (store) => store.getAll());
	}

	/**
	 * Get all keys in the store.
	 */
	public async getAllKeys(): Promise<IDBValidKey[]> {
		return this.runRequest<IDBValidKey[]>('readonly', (store) => store.getAllKeys());
	}

	// Puts the key/value in the store. If the key already exists, its value will be overwritten.
	public async set(key: IDBValidKey, value: T): Promise<IDBValidKey> {
		return this.runRequest<IDBValidKey>('readwrite', (store) => store.put(value, key));
	}

	/**
	 * Adds a new value to the store with or without a key.
	 * If a key already exists it will error.
	 */
	public async add(value: T, key?: IDBValidKey): Promise<IDBValidKey> {
		return this.runRequest<IDBValidKey>('readwrite', (store) =>
			key === undefined ? store.add(value) : store.add(value, key),
		);
	}

	/**
	 * Updates a value by key. This uses IndexedDB put semantics.
	 */
	public async update(key: IDBValidKey, value: T): Promise<IDBValidKey> {
		return this.set(key, value);
	}

	/**
	 * Removes a value from the store by key.
	 */
	public async remove(key: IDBValidKey): Promise<void> {
		await this.runRequest<undefined>('readwrite', (store) => store.delete(key));
	}

	/**
	 * Clear all the store values
	 */
	public async clear(): Promise<void> {
		await this.runRequest<undefined>('readwrite', (store) => store.clear());
	}

	/**
	 * Cleanly close the IndexedDB connection.
	 */
	public async close(): Promise<void> {
		this.db?.close();
		this.db = null;
	}

	/**
	 * Deletes an indexedDB database.
	 */
	public async destroy(): Promise<void> {
		await this.close();

		if (typeof indexedDB === 'undefined') {
			throw new TypeError('IndexedDB is not supported in this environment.');
		}

		await new Promise<void>((resolve, reject) => {
			const request = indexedDB.deleteDatabase(this.databaseName);
			request.onerror = () => {
				reject(request.error ?? new Error('Failed to delete IndexedDB.'));
			};
			request.onsuccess = () => resolve();
			request.onblocked = () => {
				reject(new Error('Failed to delete IndexedDB because it is blocked.'));
			};
		});
	}

	/**
	 * Private executor of request of the indexedDB
	 * Returns the result of the indexedDB request including the error if there is one
	 */
	private async runRequest<TResult>(
		mode: IDBTransactionMode,
		callback: (store: IDBObjectStore) => IDBRequest<TResult>,
	): Promise<TResult> {
		await this.initialize();
		if (!this.db) {
			throw new Error('IndexedDB connection is not initialized.');
		}

		const transaction = this.db.transaction(this.storeName, mode);
		const store = transaction.objectStore(this.storeName);
		let result: TResult;

		return await new Promise<TResult>((resolve, reject) => {
			const request = callback(store);

			request.onerror = () => {
				reject(request.error ?? new Error('IndexedDB request failed.'));
			};

			request.onsuccess = () => {
				result = request.result;
			};

			transaction.onerror = () => {
				reject(transaction.error ?? request.error ?? new Error('IndexedDB transaction failed.'));
			};

			transaction.onabort = () => {
				reject(transaction.error ?? request.error ?? new Error('IndexedDB transaction was aborted.'));
			};

			transaction.oncomplete = () => {
				resolve(result);
			};
		});
	}
}

import { hashCode, equals } from "./hash";

export { HashMap, HashSet };

class Entry<K, V> {
    readonly key: K;
    readonly value: V;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

class HashMap<K, V> {
    buckets: Entry<K, V>[][];
    size: number;
    capacity: number;
    threshold: number;

    static readonly _defaultCapacity: number = 16;
    static readonly _loadFactor: number = 0.75;

    constructor(capacity: number = HashMap._defaultCapacity) {
        this.capacity = capacity;
        this.buckets = new Array<Entry<K, V>[]>(capacity);
        this.size = 0;
        this.threshold = Math.trunc(capacity * HashMap._loadFactor);
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    _indexOfKey(key: K): [number, number] {
        const index = hashCode(key) % this.capacity;
        const bucket: Entry<K, V>[] | undefined = this.buckets[index];
        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
                if (equals(bucket[i]!.key, key)) {
                    return [index, i];
                }
            }
        }
        return [-1, -1];
    }

    get(key: K): V {
        const [bucket, entry] = this._indexOfKey(key);
        if (bucket >= 0 && entry >= 0) {
            return this.buckets[bucket]![entry]!.value;
        } else {
            throw new Error(`Key not found: ${key}`);
        }
    }

    put(key: K, value: V): void {
        const bucket = hashCode(key) % this.capacity;
        if (!this.buckets[bucket]) {
            this.buckets[bucket] = [];
        }
        for (let i = 0; i < this.buckets[bucket]!.length; i++) {
            if (equals(this.buckets[bucket]![i]!.key, key)) {
                this.buckets[bucket]![i] = new Entry(key, value);
                return;
            }
        }
        this.buckets[bucket]!.push(new Entry(key, value));
        this.size++;
        if (this.size > this.threshold) {
            this._rehash();
        }
    }

    getOrUndefined(key: K): V | undefined {
        const [bucket, entry] = this._indexOfKey(key);
        if (bucket >= 0 && entry >= 0) {
            return this.buckets[bucket]![entry]!.value;
        } else {
            return undefined;
        }
    }

    containsKey(key: K): boolean {
        const [bucket, entry] = this._indexOfKey(key);
        return bucket >= 0 && entry >= 0;
    }

    _rehash(): void {
        const oldBuckets: Entry<K, V>[][] = this.buckets;
        this.capacity = this.capacity * 2 + 1;
        this.buckets = new Array<Entry<K, V>[]>(this.capacity);
        this.size = 0;
        this.threshold = Math.trunc(this.capacity * HashMap._loadFactor);
        for (const bucket of oldBuckets) {
            if (bucket) {
                for (const entry of bucket) {
                    this.put(entry.key, entry.value);
                }
            }
        }
    }
}

class HashSet<T> {
    buckets: T[][];
    size: number;
    capacity: number;
    threshold: number;

    static readonly _defaultCapacity: number = 11;
    static readonly _loadFactor: number = 0.75;
    
    constructor(capacity: number = HashSet._defaultCapacity) {
        this.capacity = capacity;
        this.buckets = new Array<T[]>(capacity);
        this.size = 0;
        this.threshold = Math.trunc(capacity * HashSet._loadFactor);
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    _indexOf(element: T): [number, number] {
        const index = hashCode(element) % this.capacity;
        const bucket: T[] | undefined = this.buckets[index];
        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
                if (equals(bucket[i], element)) {
                    return [index, i];
                }
            }
        }
        return [-1, -1];
    }

    add(element: T): void {
        const bucket = hashCode(element) % this.capacity;
        if (!this.buckets[bucket]) {
            this.buckets[bucket] = [];
        }
        for (let i = 0; i < this.buckets[bucket]!.length; i++) {
            if (equals(this.buckets[bucket][i], element)) {
                return;
            }
        }
        this.buckets[bucket]!.push(element);
        this.size++;
        if (this.size > this.threshold) {
            this._rehash();
        }
    }

    remove(element: T): void {
        const [bucket, entry] = this._indexOf(element);
        if (bucket >= 0 && entry >= 0) {
            this.buckets[bucket]!.splice(entry, 1);
            this.size--;
        }
    }

    contains(element: T): boolean {
        const [bucket, entry] = this._indexOf(element);
        return bucket >= 0 && entry >= 0;
    }

    _rehash(): void {
        const oldBuckets: T[][] = this.buckets;
        this.capacity = this.capacity * 2 + 1;
        this.buckets = new Array<T[]>(this.capacity);
        this.size = 0;
        this.threshold = Math.trunc(this.capacity * HashSet._loadFactor);
        for (const bucket of oldBuckets) {
            if (bucket) {
                for (const element of bucket) {
                    this.add(element);
                }
            }
        }
    }
}
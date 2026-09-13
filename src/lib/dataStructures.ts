/**
 * Small, honest data-structure implementations.
 *
 * These are the same Stack / Queue / Hash Table behaviors from the
 * algorithms unit, applied here for real product jobs instead of practice
 * exercises. See README.md for exactly where each one is used and why.
 */

/**
 * Stack — Last In, First Out.
 * Backed by a plain array using push()/pop(), the standard array-based
 * stack technique. Used for the opportunity "detail history" so the most
 * recently left opportunity is always the first one you go back to.
 */
export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}

/**
 * Queue — First In, First Out.
 * Backed by a plain array using push() to enqueue at the back and shift()
 * to dequeue from the front. Used for the user-facing notification queue
 * so notifications are always shown in the order they happened, one at a
 * time.
 */
export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}

/**
 * Hash Table — key-based lookup.
 * Backed by a plain JS object used purely as a string-keyed map (the same
 * hash-map-by-object technique from the algorithms unit). Used to turn an
 * opportunity id back into its full object in O(1) instead of scanning the
 * opportunities array with .find() every time.
 */
export class HashTable<V> {
  private table: Record<string, V> = {};

  set(key: string | number, value: V): void {
    this.table[String(key)] = value;
  }

  get(key: string | number): V | undefined {
    return this.table[String(key)];
  }

  has(key: string | number): boolean {
    return Object.prototype.hasOwnProperty.call(this.table, String(key));
  }
}

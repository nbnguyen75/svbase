let counter = 0;

/**
 * Generates a unique id with the given prefix.
 * Mirrors Base UI's `generateId` — a monotonic counter plus a short random
 * suffix so ids are unique across SSR and client hydration.
 */
export function generateId(prefix = 'svbase'): string {
	counter += 1;
	return `${prefix}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Svelte equivalent of Base UI's `useId(idOverride, prefix)`.
 * Returns the consumer-provided id, or a generated one otherwise.
 * Call it once per component instance (e.g. `const id = createId('dialog', idOverride)`).
 */
export function createId(prefix = 'svbase', idOverride?: string): string {
	return idOverride ?? generateId(prefix);
}

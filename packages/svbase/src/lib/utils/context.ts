import { createContext } from 'svelte';

/**
 * Creates a typed context pair for a primitive (e.g. Dialog root state).
 *
 * Thin wrapper around Svelte's `createContext` that throws a named error
 * when a part component is used outside its Root provider.
 */
export function createPrimitiveContext<T>(name: string): readonly [() => T, (value: T) => T] {
	const [get, set] = createContext<T>();

	function getOrThrow(): T {
		try {
			return get();
		} catch {
			throw new Error(`${name} must be used inside its Root component.`);
		}
	}

	return [getOrThrow, set] as const;
}

/**
 * Reads an optional ancestor context (e.g. Form or Fieldset from a nested
 * Field). Returns `null` instead of throwing when no provider is mounted.
 */
export function optionalContext<T>(get: () => T): T | null {
	try {
		return get();
	} catch {
		return null;
	}
}

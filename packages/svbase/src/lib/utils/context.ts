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

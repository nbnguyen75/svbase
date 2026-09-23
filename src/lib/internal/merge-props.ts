import { composeHandlers } from './compose-handlers.js';

type SvelteEventHandler = (event: Event) => void;

/**
 * An `on*` function prop (Svelte `onclick` or React-style `onClick`) is
 * treated as a DOM event handler and chained. Any other function-valued prop
 * (e.g. `render`) is overwritten like a plain value.
 */
function isEventHandler(key: string, value: unknown): value is SvelteEventHandler {
	if (typeof value !== 'function' || !key.startsWith('on') || key.length < 3) return false;
	const third = key.charCodeAt(2);
	return (third >= 65 && third <= 90) || (third >= 97 && third <= 122);
}

function isStyleObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Later sources first, mirroring Base UI's class merge order. Non-strings fall back to overwrite. */
function mergeClass(previous: unknown, next: unknown): unknown {
	if (typeof previous !== 'string' || typeof next !== 'string') return next;
	const merged = `${next} ${previous}`.trim().replace(/\s+/g, ' ');
	return merged === '' ? undefined : merged;
}

function mergeStyle(previous: unknown, next: unknown): unknown {
	if (isStyleObject(previous) && isStyleObject(next)) return { ...previous, ...next };
	if (typeof previous === 'string' && typeof next === 'string') {
		const merged = `${previous.trim().replace(/;?$/, ';')} ${next.trim()}`.trim();
		return merged === '' || merged === ';' ? undefined : merged;
	}
	return next;
}

function mergeKey(merged: Record<string, unknown>, key: string, value: unknown): void {
	if (value === undefined) return;
	if (key === 'class') {
		const result = mergeClass(merged[key], value);
		if (result === undefined) delete merged[key];
		else merged[key] = result;
		return;
	}
	if (key === 'style') {
		const result = mergeStyle(merged[key], value);
		if (result === undefined) delete merged[key];
		else merged[key] = result;
		return;
	}
	const previous = merged[key];
	if (isEventHandler(key, value)) {
		// Newest (rightmost) handler runs first so it can cancel earlier ones
		// via `event.preventDefault()`.
		merged[key] = isEventHandler(key, previous)
			? composeHandlers(value, previous)
			: composeHandlers(value);
		return;
	}
	merged[key] = value;
}

/**
 * Minimal Svelte-native port of Base UI's `mergeProps`.
 *
 * Later sources win: plain values overwrite, `class` strings concatenate
 * (later first), `style` objects shallow-merge / strings concatenate,
 * `on*` handlers chain with the newest running first. `undefined` values
 * never overwrite, so conditional spreads are safe.
 *
 * Deliberately NOT ported from React: `preventBaseUIHandler` (use
 * `preventDefault`), props-getter overloads, and `ref` handling.
 */
export function mergeProps<T extends object>(...sources: Array<T | undefined | null | false>): T {
	const merged: Record<string, unknown> = {};
	for (const source of sources) {
		if (!source) continue;
		// Explicit tuple type keeps values `unknown` instead of the `any`
		// that `Object.entries` yields for generic objects.
		const entries: Array<[string, unknown]> = Object.entries(source);
		for (const [key, value] of entries) mergeKey(merged, key, value);
	}
	return merged as T;
}

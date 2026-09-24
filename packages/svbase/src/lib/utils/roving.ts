export interface RovingEntry {
	value: string;
	disabled: boolean;
	element: HTMLElement | undefined;
}

/**
 * Shared roving-target resolution for composite widgets (radio arrows move
 * focus and select; accordion arrows move focus only). Pure and DOM-free —
 * the caller owns the `.focus()` call and any selection commit.
 *
 * - `ArrowDown`/`ArrowRight` = next, `ArrowUp`/`ArrowLeft` = previous
 *   (`Left`/`Right` swap in RTL); `Home`/`End` jump to the ends.
 * - Wraps around and skips disabled entries.
 * - Returns `undefined` for unknown keys, empty lists, and single-entry
 *   no-ops. An unknown `fromValue` starts outside the list: arrows move to
 *   the nearest end in their direction.
 */
export function nextRovingTarget<T extends RovingEntry>(
	entries: Array<T>,
	fromValue: string,
	key: string,
	rtl: boolean
): T | undefined {
	const enabled = entries.filter((item) => !item.disabled);
	if (enabled.length === 0) return undefined;
	let delta: number | 'first' | 'last' | undefined;
	switch (key) {
		case 'ArrowDown':
			delta = 1;
			break;
		case 'ArrowUp':
			delta = -1;
			break;
		case 'ArrowRight':
			delta = rtl ? -1 : 1;
			break;
		case 'ArrowLeft':
			delta = rtl ? 1 : -1;
			break;
		case 'Home':
			delta = 'first';
			break;
		case 'End':
			delta = 'last';
			break;
		default:
			return undefined;
	}
	const current = enabled.findIndex((item) => item.value === fromValue);
	let next: T | undefined;
	if (delta === 'first') next = enabled[0];
	else if (delta === 'last') next = enabled[enabled.length - 1];
	else if (current === -1) next = delta === 1 ? enabled[0] : enabled[enabled.length - 1];
	else {
		next = enabled[(current + delta + enabled.length) % enabled.length];
	}
	if (!next || next.value === fromValue) return undefined;
	return next;
}

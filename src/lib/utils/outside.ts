/**
 * Document-level outside-press tracking for roots that own several elements
 * (e.g. popover trigger + content). Unlike the `clickOutside` attachment
 * (single node, declarative), this covers a set of nodes imperatively —
 * crucially, presses starting on the trigger are ignored so a trigger click
 * toggles instead of instantly re-opening after dismissal.
 *
 * Call inside an `$effect` scoped to the open state; the returned cleanup
 * removes the listener. Importing is DOM-free (safe in Node/SSR).
 */
export function trackOutsidePress(
	getElements: () => Array<HTMLElement | undefined>,
	onOutside: (event: PointerEvent) => void
): () => void {
	function handler(event: PointerEvent): void {
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (getElements().some((element) => element?.contains(target) === true)) return;
		onOutside(event);
	}

	document.addEventListener('pointerdown', handler);
	return () => document.removeEventListener('pointerdown', handler);
}

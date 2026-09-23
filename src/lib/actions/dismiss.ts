import type { Attachment } from 'svelte/attachments';

/**
 * Attachment factory that calls `onOutside` when a pointerdown lands outside
 * the attached element. Covers Base UI's outside-press dismissal for
 * dialogs, popovers and menus.
 *
 * Usage: `<div {@attach clickOutside(() => close())}>`
 */
export function clickOutside(onOutside: (event: PointerEvent) => void): Attachment<HTMLElement> {
	return (node) => {
		function handler(event: PointerEvent): void {
			if (!node.isConnected) return;
			if (event.target instanceof Node && !node.contains(event.target)) onOutside(event);
		}

		document.addEventListener('pointerdown', handler, { capture: true });
		return () => {
			document.removeEventListener('pointerdown', handler, { capture: true });
		};
	};
}

/**
 * Attachment factory that calls `onEscape` when Escape is pressed anywhere in
 * the document. Covers Base UI's escape-key dismissal for overlays.
 *
 * Usage: `<div {@attach escapeKey(() => close())}>`
 */
export function escapeKey(onEscape: (event: KeyboardEvent) => void): Attachment<HTMLElement> {
	return (node) => {
		function handler(event: KeyboardEvent): void {
			if (!node.isConnected) return;
			if (event.key === 'Escape') onEscape(event);
		}

		document.addEventListener('keydown', handler);
		return () => {
			document.removeEventListener('keydown', handler);
		};
	};
}

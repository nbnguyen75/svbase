<script lang="ts" module>
	import type { Placement } from '../../utils/position.svelte.js';
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next state whenever the menu opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Preferred placement; flips on collision. @default 'bottom-start' */
		placement?: Placement;
		/** Gap between trigger and content, in pixels. @default 0 */
		sideOffset?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Whether the menu is open (controlled). */
		open?: boolean;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';
	import { trackOutsidePress } from '../../utils/outside.js';
	import { FloatingPosition } from '../../utils/position.svelte.js';

	import { setMenuRootState } from './context.js';

	let {
		defaultOpen = false,
		open = $bindable(defaultOpen),
		disabled = false,
		placement = 'bottom-start',
		sideOffset = 0,
		onOpenChange = undefined,
		children
	}: RootProps = $props();

	// Plain fields: written on mount, read from event handlers —
	// never tracked, so no update loops.
	let triggerEl: HTMLElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;

	const position = new FloatingPosition();

	const defaultContentId = createId('menu-content');

	let contentId = $state<string | undefined>(undefined);

	$effect(() => {
		position.update({ placement, offset: sideOffset });
	});

	$effect(() => {
		if (!open) return;
		return trackOutsidePress(
			() => [triggerEl, popupEl],
			() => commit(false),
			{ ignoreSelector: '[role="menu"]' }
		);
	});

	function commit(next: boolean): void {
		onOpenChange?.(next);
		open = next;
	}

	function openMenu(): void {
		if (!disabled) commit(true);
	}

	function closeMenu(): void {
		commit(false);
		const target = triggerEl?.isConnected === true ? triggerEl : null;
		target?.focus();
	}

	function dismiss(): void {
		commit(false);
	}

	function toggleMenu(): void {
		if (!disabled) commit(!open);
	}

	function focusTrigger(): void {
		triggerEl?.focus();
	}

	setMenuRootState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		get nested() {
			return false;
		},
		defaultContentId,
		get contentId() {
			return contentId;
		},
		position,
		openMenu,
		closeMenu,
		dismiss,
		toggleMenu,
		focusTrigger,
		get triggerElement() {
			return triggerEl;
		},
		get contentElement() {
			return popupEl;
		},
		registerTrigger(element: HTMLElement | undefined) {
			triggerEl = element;
		},
		registerContent(element: HTMLElement | undefined) {
			popupEl = element;
		},
		registerContentId(id: string | undefined) {
			contentId = id;
		}
	});
</script>

<!-- Root renders no element of its own — children only. -->
{@render children?.()}

<script lang="ts" module>
	import type { Placement } from '../../utils/position.svelte.js';
	import type { Snippet } from 'svelte';

	export interface SubRootProps {
		/** Fired with the next state whenever the submenu opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Preferred placement relative to the trigger; flips on collision. @default 'right-start' */
		placement?: Placement;
		/** Gap between trigger and content, in pixels. @default 0 */
		sideOffset?: number;
		children?: Snippet;
		/** Whether the submenu is open (controlled). */
		open?: boolean;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';
	import { trackOutsidePress } from '../../utils/outside.js';
	import { FloatingPosition } from '../../utils/position.svelte.js';

	import { getMenuRootState, setMenuRootState } from './context.js';

	const parent = getMenuRootState();

	let {
		defaultOpen = false,
		open = $bindable(defaultOpen),
		placement = 'right-start',
		sideOffset = 0,
		onOpenChange = undefined,
		children
	}: SubRootProps = $props();

	const disabled = $derived(parent.disabled);

	// Plain fields: written on mount, read from event handlers —
	// never tracked, so no update loops.
	let triggerEl: HTMLElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;

	const position = new FloatingPosition();

	const defaultContentId = createId('menu-content');

	let contentId = $state<string | undefined>(undefined);
	let initialFocusPending = false;

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

	function requestInitialFocus(): void {
		initialFocusPending = true;
	}

	function consumeInitialFocus(): boolean {
		if (!initialFocusPending) return false;
		initialFocusPending = false;
		return true;
	}

	setMenuRootState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		get nested() {
			return true;
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
		requestInitialFocus,
		consumeInitialFocus,
		registerTrigger(element: HTMLElement | undefined) {
			triggerEl = element;
		},
		registerContent(element: HTMLElement | undefined) {
			popupEl = element;
		},
		registerContentId(id: string | undefined) {
			contentId = id;
		},
		setAnchor() {
			// Submenus anchor to their trigger by definition — cursor
			// anchoring is a root-menu capability only.
		}
	});
</script>

<!-- SubRoot renders no element of its own — children only. -->
{@render children?.()}

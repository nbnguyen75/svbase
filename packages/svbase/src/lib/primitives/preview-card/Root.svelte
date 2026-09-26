<script lang="ts" module>
	import type { Placement } from '../../utils/position.svelte.js';
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next state whenever the card opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Preferred placement; flips on collision. @default 'bottom' */
		placement?: Placement;
		/** Gap between trigger and content, in pixels. @default 0 */
		sideOffset?: number;
		/** Hover intent before opening, in ms. @default 300 */
		delay?: number;
		/** Hover intent before closing, in ms. @default 100 */
		closeDelay?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Whether the card is open (controlled). */
		open?: boolean;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { createId } from '../../utils/id.js';
	import { trackOutsidePress } from '../../utils/outside.js';
	import { FloatingPosition } from '../../utils/position.svelte.js';

	import { setPreviewCardState } from './context.js';

	let {
		defaultOpen = false,
		open = $bindable(defaultOpen),
		disabled = false,
		placement = 'bottom',
		sideOffset = 0,
		delay = 300,
		closeDelay = 100,
		onOpenChange = undefined,
		children
	}: RootProps = $props();

	// Plain fields: written on mount, read from event handlers —
	// never tracked, so no update loops.
	let triggerEl: HTMLElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;
	let openTimer: number | undefined = undefined;
	let closeTimer: number | undefined = undefined;

	const position = new FloatingPosition();

	const defaultContentId = createId('preview-content');

	let contentId = $state<string | undefined>(undefined);

	onDestroy(() => {
		// SSR runs destroy callbacks: nothing was ever scheduled server-side.
		if (typeof window === 'undefined') return;
		window.clearTimeout(openTimer);
		window.clearTimeout(closeTimer);
	});

	$effect(() => {
		position.update({ placement, offset: sideOffset });
	});

	$effect(() => {
		if (!open) return;
		return trackOutsidePress(
			() => [triggerEl, popupEl],
			() => commit(false)
		);
	});

	function commit(next: boolean): void {
		onOpenChange?.(next);
		open = next;
	}

	function cancelPending(): void {
		window.clearTimeout(openTimer);
		window.clearTimeout(closeTimer);
		openTimer = undefined;
		closeTimer = undefined;
	}

	setPreviewCardState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		defaultContentId,
		get contentId() {
			return contentId;
		},
		position,
		openCard() {
			if (!disabled) commit(true);
		},
		closeCard() {
			commit(false);
		},
		toggleCard() {
			if (!disabled) commit(!open);
		},
		scheduleOpen() {
			cancelPending();
			if (disabled) return;
			openTimer = window.setTimeout(() => commit(true), delay);
		},
		scheduleClose() {
			cancelPending();
			closeTimer = window.setTimeout(() => commit(false), closeDelay);
		},
		cancelPending,
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

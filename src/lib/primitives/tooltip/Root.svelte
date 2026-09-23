<script lang="ts" module>
	import type { Placement } from '../../utils/position.svelte.js';
	import type { Snippet } from 'svelte';

	export interface RootProps {
		/** Fired with the next state whenever the tooltip opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Initially open for uncontrolled usage. @default false */
		defaultOpen?: boolean;
		/** Preferred placement; flips on collision. @default 'top' */
		placement?: Placement;
		/** Gap between trigger and content, in pixels. @default 0 */
		sideOffset?: number;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Whether the tooltip is open (controlled). */
		open?: boolean;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';
	import { trackOutsidePress } from '../../utils/outside.js';
	import { FloatingPosition } from '../../utils/position.svelte.js';

	import { setTooltipState } from './context.js';

	let {
		defaultOpen = false,
		open = $bindable(defaultOpen),
		disabled = false,
		placement = 'top',
		sideOffset = 0,
		onOpenChange = undefined,
		children
	}: RootProps = $props();

	// Plain fields: written on mount, read from event handlers —
	// never tracked, so no update loops.
	let triggerEl: HTMLElement | undefined = undefined;
	let popupEl: HTMLElement | undefined = undefined;

	const position = new FloatingPosition();

	const defaultContentId = createId('tooltip-content');

	let contentId = $state<string | undefined>(undefined);

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

	function openTooltip(): void {
		if (!disabled) commit(true);
	}

	function closeTooltip(): void {
		commit(false);
	}

	setTooltipState({
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
		openTooltip,
		closeTooltip,
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

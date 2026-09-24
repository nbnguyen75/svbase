<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired with the next state whenever this item opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Delegated access to the item element. */
		ref?: HTMLDivElement | undefined;
		/** Whether user interaction is ignored (OR-ed with root). @default false */
		disabled?: boolean;
		children?: Snippet;
		/**
		 * Unique identifying value. Falls back to a generated id when
		 * omitted — pass an explicit value to control the item
		 * programmatically or preset open state.
		 */
		value?: string;
	}
</script>

<script lang="ts">
	import { createId } from '../../utils/id.js';

	import { getAccordionRootState, setAccordionItemState } from './context.js';

	const root = getAccordionRootState();

	let {
		value = createId('accordion-item'),
		disabled: disabledProp = false,
		onOpenChange = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const open = $derived(root.value.includes(value));
	const disabled = $derived(disabledProp || root.disabled);
	const fallbackTriggerId = createId('accordion-trigger');
	const fallbackPanelId = createId('accordion-panel');

	let triggerIdOverride = $state<string | undefined>(undefined);
	let panelIdOverride = $state<string | undefined>(undefined);

	function toggle(): void {
		const next = !open;
		onOpenChange?.(next);
		root.toggleValue(value, next);
	}

	setAccordionItemState({
		get open() {
			return open;
		},
		get disabled() {
			return disabled;
		},
		get value() {
			return value;
		},
		get triggerId() {
			return triggerIdOverride ?? fallbackTriggerId;
		},
		get panelId() {
			return panelIdOverride ?? fallbackPanelId;
		},
		toggle,
		registerTriggerId(id: string | undefined) {
			triggerIdOverride = id;
		},
		registerPanelId(id: string | undefined) {
			panelIdOverride = id;
		}
	});
</script>

<div
	{...rest}
	bind:this={ref}
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? '' : undefined}
>
	{@render children?.()}
</div>

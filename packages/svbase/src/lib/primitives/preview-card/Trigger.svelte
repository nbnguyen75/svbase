<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored (OR-ed with root). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getPreviewCardState } from './context.js';

	let {
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const state = getPreviewCardState();

	const disabled = $derived(disabledProp || state.disabled);

	type TriggerFocusEvent = FocusEvent & { currentTarget: EventTarget & HTMLElement };

	function handleEnter(): void {
		if (disabled) return;
		state.scheduleOpen();
	}

	function handleLeave(): void {
		if (disabled) return;
		state.scheduleClose();
	}

	function handleFocus(): void {
		if (disabled) return;
		state.cancelPending();
		state.openCard();
	}

	function handleBlur(event: TriggerFocusEvent): void {
		const next = event.relatedTarget;
		if (next instanceof Element && ref?.contains(next) === true) return;
		state.cancelPending();
		state.closeCard();
	}
</script>

<span
	{...rest}
	bind:this={ref}
	tabindex={disabled ? undefined : 0}
	data-state={state.open ? 'open' : 'closed'}
	data-disabled={disabled ? '' : undefined}
	onpointerenter={composeHandlers(rest.onpointerenter, handleEnter)}
	onpointerleave={composeHandlers(rest.onpointerleave, handleLeave)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
	onblur={composeHandlers<TriggerFocusEvent>(rest.onblur, handleBlur)}
	onclick={composeHandlers(rest.onclick, () => {
		if (!disabled) state.toggleCard();
	})}
>
	{@render children?.()}
</span>

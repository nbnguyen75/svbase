<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ItemProps extends HTMLAttributes<HTMLElement> {
		/** Fired when the item is selected (before the menu closes). */
		onSelect?: (() => void) | undefined;
		/** Delegated access to the item element. */
		ref?: HTMLElement | undefined;
		/** Whether the item is skipped by interaction and navigation. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Unique identifying value submitted to forms. */
		value: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getSelectRootState } from './context.js';

	const state = getSelectRootState();

	let {
		value,
		disabled: disabledProp = false,
		onSelect = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const disabled = $derived(disabledProp || state.disabled);
	const selected = $derived(state.value === value);
	const highlighted = $derived(state.highlightedValue === value);

	const tabStop = $derived.by(() => {
		if (disabled) return -1;
		if (state.highlightedValue !== undefined) return state.highlightedValue === value ? 0 : -1;
		if (selected) return 0;
		const order = state.entries.filter((item) => !item.disabled);
		return order[0]?.value === value ? 0 : -1;
	});

	onMount(() => {
		state.register({
			value,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			},
			get label() {
				return ref?.textContent ?? '';
			}
		});
		return () => state.unregister(value);
	});

	function selectItem(): void {
		if (disabled) return;
		onSelect?.();
		state.select(value);
		state.closeMenu();
		state.focusTrigger();
	}

	function handleHover(): void {
		if (disabled || state.highlightedValue === value) return;
		state.setHighlighted(value);
		ref?.focus({ preventScroll: true });
	}

	function handleFocus(): void {
		if (!disabled) state.setHighlighted(value);
	}
</script>

<Button
	{...rest}
	element="span"
	role="option"
	{disabled}
	bind:ref
	tabindex={tabStop}
	aria-selected={selected}
	data-highlighted={highlighted ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	onclick={composeHandlers(rest.onclick, selectItem)}
	onmouseenter={composeHandlers(rest.onmouseenter, handleHover)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
>
	{@render children?.()}
</Button>

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
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { createId } from '../../utils/id.js';
	import { Button } from '../button/index.js';

	import { getMenuContentState, getMenuRootState } from './context.js';

	const root = getMenuRootState();
	const content = getMenuContentState();

	let {
		disabled: disabledProp = false,
		onSelect = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const id = createId('menu-item');
	const disabled = $derived(disabledProp || root.disabled);
	const highlighted = $derived(content.highlightedId === id);

	const tabStop = $derived.by(() => {
		const order = content.entries.filter((item) => !item.disabled);
		if (order.length === 0) return -1;
		const stop = order.find((item) => item.value === content.highlightedId) ?? order[0];
		return stop?.value === id ? 0 : -1;
	});

	onMount(() => {
		content.register({
			value: id,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			},
			get label() {
				return ref?.textContent ?? '';
			},
			select: () => selectItem()
		});
		return () => content.unregister(id);
	});

	function selectItem(): void {
		if (disabled) return;
		onSelect?.();
		root.closeMenu();
	}

	function handleHover(): void {
		if (disabled || content.highlightedId === id) return;
		content.setHighlighted(id);
		ref?.focus({ preventScroll: true });
	}

	function handleFocus(): void {
		if (!disabled) content.setHighlighted(id);
	}
</script>

<Button
	{...rest}
	element="span"
	role="menuitem"
	{disabled}
	bind:ref
	tabindex={tabStop}
	data-highlighted={highlighted ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	onclick={composeHandlers(rest.onclick, selectItem)}
	onmouseenter={composeHandlers(rest.onmouseenter, handleHover)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
>
	{@render children?.()}
</Button>

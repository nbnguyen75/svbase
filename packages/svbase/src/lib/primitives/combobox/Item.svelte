<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ItemProps extends HTMLAttributes<HTMLElement> {
		/** Fired when the item is selected (before the menu closes). */
		onSelect?: (() => void) | undefined;
		/** Delegated access to the item element. */
		ref?: HTMLElement | undefined;
		/**
		 * Display text used for filtering and committed to the input on select.
		 * Falls back to the rendered text content when omitted.
		 */
		label?: string | undefined;
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
	import { createId } from '../../utils/id.js';
	import { Button } from '../button/index.js';

	import { getComboboxRootState } from './context.js';

	const combo = getComboboxRootState();

	let {
		value,
		label = undefined,
		disabled: disabledProp = false,
		onSelect = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const optionId = createId('combobox-option');

	const disabled = $derived(disabledProp || combo.disabled);
	const selected = $derived(combo.value === value);
	const highlighted = $derived(combo.highlightedValue === value);

	// Text-content fallback for filtering when no explicit label is given.
	const textLabel = $derived(ref?.textContent ?? undefined);
	const visible = $derived(combo.matchesFilter(label ?? textLabel ?? ''));

	onMount(() => {
		combo.register({
			value,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			},
			get label() {
				return label ?? ref?.textContent ?? '';
			},
			id: optionId
		});
		return () => combo.unregister(value);
	});

	function selectItem(): void {
		if (disabled) return;
		onSelect?.();
		combo.select(value);
		combo.closeMenu();
	}

	function handleHover(): void {
		if (disabled || combo.highlightedValue === value) return;
		combo.setHighlighted(value);
	}
</script>

<Button
	{...rest}
	element="span"
	role="option"
	id={optionId}
	aria-selected={selected}
	{disabled}
	bind:ref
	hidden={!visible}
	data-highlighted={highlighted ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	data-value={value}
	onclick={composeHandlers(rest.onclick, selectItem)}
	onmouseenter={composeHandlers(rest.onmouseenter, handleHover)}
>
	{@render children?.()}
</Button>

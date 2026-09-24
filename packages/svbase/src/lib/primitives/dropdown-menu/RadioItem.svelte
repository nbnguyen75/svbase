<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RadioItemProps extends HTMLAttributes<HTMLElement> {
		/** Delegated access to the item element. */
		ref?: HTMLElement | undefined;
		/** Whether the item is skipped by interaction and navigation. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Unique identifying value within the radio group. */
		value: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { createId } from '../../utils/id.js';
	import { getCheckableDataAttributes } from '../../utils/state-attrs.js';
	import { Button } from '../button/index.js';

	import { getMenuContentState, getMenuRootState, setMenuItemState } from './context.js';
	import { getMenuRadioGroupState } from './radio-context.js';

	const root = getMenuRootState();
	const content = getMenuContentState();
	const group = getMenuRadioGroupState();

	let {
		value,
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RadioItemProps = $props();

	const id = createId('menu-item');
	const disabled = $derived(disabledProp || root.disabled);
	const checked = $derived(group.value === value);
	const highlighted = $derived(content.highlightedId === id);

	const tabStop = $derived.by(() => {
		const order = content.entries.filter((item) => !item.disabled);
		if (order.length === 0) return -1;
		const stop = order.find((item) => item.value === content.highlightedId) ?? order[0];
		return stop?.value === id ? 0 : -1;
	});

	const dataAttrs = $derived(getCheckableDataAttributes({ checked, disabled }));

	setMenuItemState({
		get checked() {
			return checked;
		},
		get disabled() {
			return disabled;
		}
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
		group.select(value);
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
	role="menuitemradio"
	{disabled}
	bind:ref
	tabindex={tabStop}
	aria-checked={checked}
	{...dataAttrs}
	data-highlighted={highlighted ? '' : undefined}
	onclick={composeHandlers(rest.onclick, selectItem)}
	onmouseenter={composeHandlers(rest.onmouseenter, handleHover)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
>
	{@render children?.()}
</Button>

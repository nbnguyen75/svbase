<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface CheckboxItemProps extends HTMLAttributes<HTMLElement> {
		/** Fired with the next state whenever the item is toggled. */
		onCheckedChange?: ((checked: boolean) => void) | undefined;
		/** Delegated access to the item element. */
		ref?: HTMLElement | undefined;
		/** Initially ticked for uncontrolled usage. @default false */
		defaultChecked?: boolean;
		/** Whether the item is skipped by interaction and navigation. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Whether the item is ticked (controlled). */
		checked?: boolean;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { createId } from '../../utils/id.js';
	import { getCheckableDataAttributes } from '../../utils/state-attrs.js';
	import { Button } from '../button/index.js';

	import { getMenuContentState, getMenuRootState, setMenuItemState } from './context.js';

	const root = getMenuRootState();
	const content = getMenuContentState();

	let {
		defaultChecked = false,
		checked = $bindable(defaultChecked),
		disabled: disabledProp = false,
		onCheckedChange = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: CheckboxItemProps = $props();

	const id = createId('menu-item');
	const disabled = $derived(disabledProp || root.disabled);
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
			select: () => toggleItem()
		});
		return () => content.unregister(id);
	});

	function toggleItem(): void {
		if (disabled) return;
		const next = !checked;
		onCheckedChange?.(next);
		checked = next;
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
	role="menuitemcheckbox"
	{disabled}
	bind:ref
	tabindex={tabStop}
	aria-checked={checked}
	{...dataAttrs}
	data-highlighted={highlighted ? '' : undefined}
	onclick={composeHandlers(rest.onclick, toggleItem)}
	onmouseenter={composeHandlers(rest.onmouseenter, handleHover)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
>
	{@render children?.()}
</Button>

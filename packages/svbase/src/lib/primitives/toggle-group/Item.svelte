<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface ItemProps extends Omit<HTMLButtonAttributes, 'children'> {
		/** Fired with the next state, then synced into the group. */
		onPressedChange?: ((pressed: boolean) => void) | undefined;
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (OR-ed with group). @default false */
		disabled?: boolean;
		/** Unique identifying value. */
		value: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Toggle } from '../toggle/index.js';

	import { getToggleGroupState } from './context.js';

	let {
		value,
		disabled: disabledProp = false,
		onPressedChange = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const group = getToggleGroupState();

	const disabled = $derived(disabledProp || group.disabled);
	const pressed = $derived(group.isPressed(value));

	type ItemKeyboardEvent = Parameters<NonNullable<ItemProps['onkeydown']>>[0];

	onMount(() => {
		group.register({
			value,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			}
		});
		return () => group.unregister(value);
	});

	function tabStop(): number | undefined {
		if (disabled) return -1;
		if (pressed) return 0;
		const first = group.entries.find((item) => !item.disabled);
		return first?.value === value ? 0 : -1;
	}

	function handleKeys(event: ItemKeyboardEvent): void {
		if (disabled) return;
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Home':
			case 'End':
				event.preventDefault();
				group.moveFocus(value, event.key, event.currentTarget as HTMLElement);
				return;
		}
	}

	function handlePressedChange(next: boolean): void {
		onPressedChange?.(next);
		group.toggle(value, next);
	}
</script>

<Toggle
	{...rest}
	{pressed}
	{disabled}
	bind:ref
	tabindex={tabStop()}
	onPressedChange={handlePressedChange}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
>
	{@render children?.()}
</Toggle>

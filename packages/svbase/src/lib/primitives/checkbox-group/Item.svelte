<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ItemProps extends HTMLAttributes<HTMLElement> {
		/** Fired with the next state, then synced into the group. */
		onCheckedChange?: ((checked: boolean) => void) | undefined;
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (OR-ed with group). @default false */
		disabled?: boolean;
		/** Unique identifying value submitted to forms. */
		value: string;
	}
</script>

<script lang="ts">
	import { Indicator as CheckboxIndicator, Root as CheckboxRoot } from '../checkbox/index.js';

	import { getCheckboxGroupState } from './context.js';

	let {
		value,
		disabled: disabledProp = false,
		onCheckedChange = undefined,
		id = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ItemProps = $props();

	const group = getCheckboxGroupState();

	const disabled = $derived(disabledProp || group.disabled);
	const checked = $derived(group.isChecked(value));

	function handleCheckedChange(next: boolean): void {
		onCheckedChange?.(next);
		group.toggle(value, next);
	}
</script>

<CheckboxRoot
	{...rest}
	{checked}
	{disabled}
	id={id ?? undefined}
	bind:ref
	onCheckedChange={handleCheckedChange}
>
	<CheckboxIndicator>✓</CheckboxIndicator>
	{@render children?.()}
</CheckboxRoot>

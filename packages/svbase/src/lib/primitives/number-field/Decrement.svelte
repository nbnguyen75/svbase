<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface DecrementProps extends HTMLButtonAttributes {
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (OR-ed with root). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getNumberFieldState } from './context.js';

	let {
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: DecrementProps = $props();

	const root = getNumberFieldState();

	const atMin = $derived(root.value !== null && root.min !== undefined && root.value <= root.min);
	const disabled = $derived(disabledProp || root.disabled || root.readOnly || atMin);

	function handleClick(): void {
		if (disabled) return;
		root.decrement();
		root.focusInput();
	}
</script>

<Button
	{...rest}
	{disabled}
	bind:ref
	aria-label={rest['aria-label'] ?? 'Decrement'}
	tabindex={rest.tabindex ?? -1}
	onclick={composeHandlers(rest.onclick, handleClick)}
>
	{@render children?.()}
</Button>

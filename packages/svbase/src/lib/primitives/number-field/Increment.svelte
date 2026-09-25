<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface IncrementProps extends HTMLButtonAttributes {
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
	}: IncrementProps = $props();

	const root = getNumberFieldState();

	const atMax = $derived(root.value !== null && root.max !== undefined && root.value >= root.max);
	const disabled = $derived(disabledProp || root.disabled || root.readOnly || atMax);

	function handleClick(): void {
		if (disabled) return;
		root.increment();
		root.focusInput();
	}
</script>

<Button
	{...rest}
	{disabled}
	bind:ref
	aria-label={rest['aria-label'] ?? 'Increment'}
	tabindex={rest.tabindex ?? -1}
	onclick={composeHandlers(rest.onclick, handleClick)}
>
	{@render children?.()}
</Button>

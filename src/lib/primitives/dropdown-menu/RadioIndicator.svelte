<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RadioIndicatorProps extends HTMLAttributes<HTMLElement> {
		/** Delegated access to the indicator element. */
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getCheckableDataAttributes } from '../../utils/state-attrs.js';

	import { getMenuItemState } from './context.js';

	const state = getMenuItemState();

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: RadioIndicatorProps = $props();

	const dataAttrs = $derived(
		getCheckableDataAttributes({ checked: state.checked, disabled: state.disabled })
	);
</script>

{#if state.checked}
	<span {...rest} bind:this={ref} {...dataAttrs}>
		{@render children?.()}
	</span>
{/if}

<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface IndicatorProps extends HTMLAttributes<HTMLElement> {
		/** Delegated access to the indicator element. */
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getCheckableDataAttributes } from '../../utils/state-attrs.js';

	import { getCheckboxState } from './context.js';

	const state = getCheckboxState();

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: IndicatorProps = $props();

	const dataAttrs = $derived(
		getCheckableDataAttributes({
			checked: state.checked,
			indeterminate: state.indeterminate,
			disabled: state.disabled,
			readOnly: state.readOnly,
			required: state.required
		})
	);
</script>

{#if state.checked || state.indeterminate}
	<span {...rest} bind:this={ref} {...dataAttrs}>
		{@render children?.()}
	</span>
{/if}

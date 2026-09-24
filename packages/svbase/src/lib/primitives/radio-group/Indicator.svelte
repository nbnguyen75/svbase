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

	import { getRadioItemState } from './context.js';

	const state = getRadioItemState();

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: IndicatorProps = $props();

	const dataAttrs = $derived(
		getCheckableDataAttributes({
			checked: state.checked,
			disabled: state.disabled,
			readOnly: state.readOnly,
			required: state.required
		})
	);
</script>

{#if state.checked}
	<span {...rest} bind:this={ref} {...dataAttrs}>
		{@render children?.()}
	</span>
{/if}

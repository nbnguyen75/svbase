<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ThumbProps extends HTMLAttributes<HTMLElement> {
		/** Delegated access to the thumb element. */
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { getCheckableDataAttributes } from '../internal/state-attrs.js';

	import { getSwitchState } from './context.js';

	const state = getSwitchState();

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: ThumbProps = $props();

	const dataAttrs = $derived(
		getCheckableDataAttributes({
			checked: state.checked,
			disabled: state.disabled,
			readOnly: state.readOnly,
			required: state.required
		})
	);
</script>

<span {...rest} bind:this={ref} {...dataAttrs}>
	{@render children?.()}
</span>

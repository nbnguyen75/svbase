<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface LabelProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	import { getFieldState } from './context.js';

	let {
		children,
		ref = $bindable<HTMLElement | undefined>(undefined),
		...rest
	}: LabelProps = $props();

	const field = getFieldState();
</script>

<label {...rest} bind:this={ref} for={field.controlId}>
	{@render children?.()}
</label>

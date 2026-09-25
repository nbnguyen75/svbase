<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ErrorProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { getFieldState } from './context.js';

	let {
		children,
		ref = $bindable<HTMLElement | undefined>(undefined),
		...rest
	}: ErrorProps = $props();

	const field = getFieldState();

	onMount(() => {
		field.setHasError(true);
		return () => field.setHasError(false);
	});
</script>

{#if field.valid === false}
	<p {...rest} bind:this={ref} id={field.errorId}>
		{field.error}{@render children?.()}
	</p>
{/if}

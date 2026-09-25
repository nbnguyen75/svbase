<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface DescriptionProps extends HTMLAttributes<HTMLElement> {
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
	}: DescriptionProps = $props();

	const field = getFieldState();

	onMount(() => {
		field.setHasDescription(true);
		return () => field.setHasDescription(false);
	});
</script>

<p {...rest} bind:this={ref} id={field.descriptionId}>
	{@render children?.()}
</p>

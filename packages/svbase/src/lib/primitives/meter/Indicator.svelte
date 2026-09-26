<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface IndicatorProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		ref?: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	import { getMeterState } from './context.js';

	const state = getMeterState();

	let {
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: IndicatorProps = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	style={`width: ${state.percent}%;${typeof rest.style === 'string' ? rest.style : ''}`}
>
	{@render children?.()}
</div>

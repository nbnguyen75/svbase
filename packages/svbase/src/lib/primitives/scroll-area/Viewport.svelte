<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ViewportProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the viewport element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	/* eslint-disable svelte/no-unused-svelte-ignore -- svelte-check requires the
	   a11y ignore below for the intentional viewport tabindex; eslint disagrees */
	import { getScrollAreaState } from './context.js';

	const state = getScrollAreaState();

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ViewportProps = $props();

	/**
	 * Registration + resize observation live in an effect (not `onMount`):
	 * `bind:this` into a `$bindable` prop flushes after mount, so only a
	 * reactive read observes it. Writes go to untracked fields — no loops.
	 */
	$effect(() => {
		state.registerViewport(ref);
		state.refresh();
		const node = ref;
		if (!node) return () => state.registerViewport(undefined);
		const observer = new ResizeObserver(() => state.refresh());
		observer.observe(node);
		return () => {
			observer.disconnect();
			state.registerViewport(undefined);
		};
	});

	function handleScroll(): void {
		state.refresh();
	}
</script>

<!--
	`overflow: auto` is functional (without it nothing scrolls), not styling:
	consumer `style` appends after and wins on conflict.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex: scroll viewports are
     intentionally keyboard-focusable so they scroll without a mouse. -->
<div
	{...rest}
	bind:this={ref}
	tabindex={rest.tabindex ?? 0}
	style={`overflow: auto;${typeof rest.style === 'string' ? rest.style : ''}`}
	onscroll={handleScroll}
>
	{@render children?.()}
</div>

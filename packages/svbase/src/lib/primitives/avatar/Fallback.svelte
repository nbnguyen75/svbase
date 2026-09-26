<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface FallbackProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/**
		 * Milliseconds to wait before showing the fallback while loading.
		 * Errors always show immediately; once shown it stays visible.
		 * @default 0
		 */
		delayMs?: number;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getAvatarState } from './context.js';

	let {
		delayMs = 0,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: FallbackProps = $props();

	const avatar = getAvatarState();

	let delayPassed = $derived(delayMs === 0);
	let timer: number | undefined = undefined;

	onDestroy(() => {
		// SSR runs destroy callbacks: nothing was ever scheduled server-side.
		if (typeof window === 'undefined') return;
		window.clearTimeout(timer);
	});

	$effect(() => {
		if (delayMs <= 0 || delayPassed) return;
		timer = window.setTimeout(() => {
			delayPassed = true;
		}, delayMs);
		return () => window.clearTimeout(timer);
	});

	const visible = $derived(
		avatar.status === 'error' || (delayPassed && avatar.status !== 'loaded')
	);
</script>

{#if visible}
	<span {...rest} bind:this={ref} data-status={avatar.status}>
		{@render children?.()}
	</span>
{/if}

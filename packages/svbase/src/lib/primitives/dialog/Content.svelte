<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the popup element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	/* eslint-disable svelte/no-unused-svelte-ignore -- svelte-check requires the
	   a11y ignore below for the intentional dialog tabindex; eslint disagrees */
	import { onMount } from 'svelte';

	import { getDialogState } from './context.js';

	const state = getDialogState();

	let {
		id = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ContentProps = $props();

	onMount(() => {
		const effective = id ?? state.defaultContentId;
		state.registerContentId(effective);
		return () => state.registerContentId(undefined);
	});

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerContent(ref);
		return () => state.registerContent(undefined);
	});
</script>

{#if state.open}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex: dialog containers are
	     intentionally programatically focusable (initial-focus fallback). -->
	<div
		{...rest}
		bind:this={ref}
		id={id ?? state.defaultContentId}
		role={state.role}
		aria-modal="true"
		aria-labelledby={state.titleId}
		aria-describedby={state.descriptionId}
		tabindex={-1}
		data-state="open"
		data-disabled={state.disabled ? '' : undefined}
	>
		{@render children?.()}
	</div>
{/if}

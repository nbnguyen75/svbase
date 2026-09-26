<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the content element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
		/** Overrides the generated id (trigger links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { escapeKey } from '../../actions/index.js';
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getPreviewCardState } from './context.js';

	const state = getPreviewCardState();

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

	function handleEscape(): void {
		if (!state.open) return;
		state.closeCard();
	}

	function handleEnter(): void {
		state.cancelPending();
	}

	function handleLeave(): void {
		state.scheduleClose();
	}
</script>

{#if state.open}
	<div
		{...rest}
		bind:this={ref}
		id={id ?? state.defaultContentId}
		role="dialog"
		data-state="open"
		data-disabled={state.disabled ? '' : undefined}
		data-placement={state.position.placement}
		hidden={!state.position.positioned}
		{@attach state.position.floating}
		{@attach escapeKey(handleEscape)}
		onpointerenter={composeHandlers(rest.onpointerenter, handleEnter)}
		onpointerleave={composeHandlers(rest.onpointerleave, handleLeave)}
	>
		{@render children?.()}
	</div>
{/if}

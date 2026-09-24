<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TrackProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the track element (drag geometry anchor). */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getSliderState } from './context.js';

	type TrackPointerEvent = Parameters<NonNullable<TrackProps['onpointerdown']>>[0];

	const state = getSliderState();

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: TrackProps = $props();

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerTrack(ref);
		return () => state.registerTrack(undefined);
	});

	function handlePress(event: TrackPointerEvent): void {
		state.trackPress(event);
	}

	function handleMove(event: TrackPointerEvent): void {
		state.trackMove(event);
	}

	function handleEnd(event: TrackPointerEvent): void {
		state.trackEnd(event);
	}
</script>

<div
	{...rest}
	bind:this={ref}
	data-orientation={state.orientation}
	data-disabled={state.disabled ? '' : undefined}
	onpointerdown={composeHandlers(rest.onpointerdown, handlePress)}
	onpointermove={composeHandlers(rest.onpointermove, handleMove)}
	onpointerup={composeHandlers(rest.onpointerup, handleEnd)}
	onpointercancel={composeHandlers(rest.onpointercancel, handleEnd)}
>
	{@render children?.()}
</div>

<script lang="ts" module>
	import type { AvatarImageStatus } from './context.js';
	import type { HTMLImgAttributes } from 'svelte/elements';

	export interface ImageProps extends Omit<HTMLImgAttributes, 'children'> {
		/** Fired whenever the loading status changes. */
		onLoadingStatusChange?: ((status: AvatarImageStatus) => void) | undefined;
		ref?: HTMLImageElement | undefined;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getAvatarState } from './context.js';

	let {
		ref = $bindable<HTMLImageElement | undefined>(undefined),
		onLoadingStatusChange = undefined,
		...rest
	}: ImageProps = $props();

	const state = getAvatarState();

	function commit(next: AvatarImageStatus): void {
		onLoadingStatusChange?.(next);
		state.setStatus(next);
	}

	onMount(() => {
		if (!ref) return;
		// Cached images may never fire load: read the settled state directly.
		if (ref.complete) commit(ref.naturalWidth > 0 ? 'loaded' : 'error');
		else commit('loading');
	});
</script>

<img
	{...rest}
	bind:this={ref}
	hidden={state.status !== 'loaded'}
	data-status={state.status}
	onload={composeHandlers(rest.onload, () => commit('loaded'))}
	onerror={composeHandlers(rest.onerror, () => commit('error'))}
/>

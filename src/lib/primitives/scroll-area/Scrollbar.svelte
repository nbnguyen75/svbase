<script lang="ts" module>
	import type { ScrollOrientation } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ScrollbarProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the track element (Thumb must be a direct child). */
		ref?: HTMLDivElement | undefined;
		/** Scroll axis. @default 'vertical' */
		orientation?: ScrollOrientation;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getScrollAreaState } from './context.js';

	type ScrollbarPointerEvent = Parameters<NonNullable<ScrollbarProps['onpointerdown']>>[0];

	const state = getScrollAreaState();

	let {
		orientation = 'vertical',
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ScrollbarProps = $props();

	const vertical = $derived(orientation === 'vertical');

	const canScroll = $derived(
		vertical
			? state.scroll.scrollHeight > state.scroll.clientHeight
			: state.scroll.scrollWidth > state.scroll.clientWidth
	);

	function jump(event: ScrollbarPointerEvent): void {
		// Only the track itself jumps; thumb drags stop propagation.
		if (event.target !== event.currentTarget) return;
		const track = ref;
		if (!track) return;
		const rect = track.getBoundingClientRect();
		const max = vertical
			? state.scroll.scrollHeight - state.scroll.clientHeight
			: state.scroll.scrollWidth - state.scroll.clientWidth;
		if (max <= 0) return;
		if (vertical) {
			const ratio = (event.clientY - rect.top) / rect.height;
			state.scrollTo(ratio * max, state.scroll.scrollLeft);
		} else {
			const ratio = (event.clientX - rect.left) / rect.width;
			state.scrollTo(state.scroll.scrollTop, ratio * max);
		}
	}
</script>

{#if canScroll}
	<div
		{...rest}
		bind:this={ref}
		data-orientation={orientation}
		onpointerdown={composeHandlers(rest.onpointerdown, jump)}
	>
		{@render children?.()}
	</div>
{/if}

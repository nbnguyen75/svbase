<script lang="ts" module>
	import type { ScrollOrientation } from './context.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface ThumbProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the thumb element. */
		ref?: HTMLDivElement | undefined;
		/** Must match the parent Scrollbar axis. @default 'vertical' */
		orientation?: ScrollOrientation;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getScrollAreaState } from './context.js';

	type ThumbPointerEvent = Parameters<NonNullable<ThumbProps['onpointerdown']>>[0];

	const state = getScrollAreaState();

	let {
		orientation = 'vertical',
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: ThumbProps = $props();

	const vertical = $derived(orientation === 'vertical');

	const ratio = $derived.by(() => {
		const total = vertical ? state.scroll.scrollHeight : state.scroll.scrollWidth;
		const visible = vertical ? state.scroll.clientHeight : state.scroll.clientWidth;
		if (total <= 0) return { size: 0, position: 0 };
		const max = Math.max(total - visible, 0);
		const at = vertical ? state.scroll.scrollTop : state.scroll.scrollLeft;
		return { size: (visible / total) * 100, position: max === 0 ? 0 : (at / max) * 100 };
	});

	let dragStart = 0;
	let scrollStart = 0;

	function handlePress(event: ThumbPointerEvent): void {
		event.stopPropagation();
		const thumb = event.currentTarget;
		if (!(thumb instanceof HTMLElement)) return;
		const track = thumb.parentElement;
		if (!(track instanceof HTMLElement)) return;
		dragStart = vertical ? event.clientY : event.clientX;
		scrollStart = vertical ? state.scroll.scrollTop : state.scroll.scrollLeft;
		const trackSize = vertical ? track.clientHeight : track.clientWidth;
		const max = vertical
			? state.scroll.scrollHeight - state.scroll.clientHeight
			: state.scroll.scrollWidth - state.scroll.clientWidth;
		if (trackSize <= 0 || max <= 0) return;
		const move = (moveEvent: PointerEvent): void => {
			const delta = vertical ? moveEvent.clientY - dragStart : moveEvent.clientX - dragStart;
			const next = scrollStart + (delta / trackSize) * max;
			if (vertical) state.scrollTo(next, state.scroll.scrollLeft);
			else state.scrollTo(state.scroll.scrollTop, next);
		};
		const end = (): void => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', end);
			window.removeEventListener('pointercancel', end);
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', end);
		window.addEventListener('pointercancel', end);
		try {
			thumb.setPointerCapture(event.pointerId);
		} catch {
			// Headless environments may not support capture; window listeners cover it.
		}
	}
</script>

<div
	{...rest}
	bind:this={ref}
	data-orientation={orientation}
	style={`position: absolute;${vertical ? `height: ${ratio.size}%; top: ${ratio.position}%;` : `width: ${ratio.size}%; left: ${ratio.position}%;`}${typeof rest.style === 'string' ? rest.style : ''}`}
	onpointerdown={composeHandlers(rest.onpointerdown, handlePress)}
>
	{@render children?.()}
</div>

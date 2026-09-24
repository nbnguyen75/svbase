<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Delegated access to the root element. */
		ref?: HTMLDivElement | undefined;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { type ScrollSnapshot, setScrollAreaState } from './context.js';

	let {
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	// Plain field: written on mount, read from event handlers —
	// never tracked, so no update loops.
	let viewportEl: HTMLElement | undefined = undefined;

	let scroll = $state<ScrollSnapshot>({
		scrollTop: 0,
		scrollHeight: 0,
		clientHeight: 0,
		scrollLeft: 0,
		scrollWidth: 0,
		clientWidth: 0
	});

	function refresh(): void {
		const viewport = viewportEl;
		if (!viewport) return;
		scroll = {
			scrollTop: viewport.scrollTop,
			scrollHeight: viewport.scrollHeight,
			clientHeight: viewport.clientHeight,
			scrollLeft: viewport.scrollLeft,
			scrollWidth: viewport.scrollWidth,
			clientWidth: viewport.clientWidth
		};
	}

	function scrollTo(top: number, left: number): void {
		const viewport = viewportEl;
		if (!viewport) return;
		viewport.scrollTop = top;
		viewport.scrollLeft = left;
		refresh();
	}

	setScrollAreaState({
		get scroll() {
			return scroll;
		},
		get viewportElement() {
			return viewportEl;
		},
		refresh,
		scrollTo,
		registerViewport(element: HTMLElement | undefined) {
			viewportEl = element;
		}
	});
</script>

<div {...rest} bind:this={ref}>
	{@render children?.()}
</div>

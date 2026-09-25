<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (native menu appears instead). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { getMenuRootState } from '../dropdown-menu/index.js';

	let {
		disabled = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const state = getMenuRootState();

	const disabledEff = $derived(disabled || state.disabled);

	let longPressTimer: number | undefined = undefined;
	let suppressNextMenuEvent = false;

	onDestroy(() => {
		window.clearTimeout(longPressTimer);
	});

	function openAt(x: number, y: number): void {
		state.setAnchor({ x, y });
		state.openMenu();
	}

	function handleContextMenu(event: MouseEvent): void {
		if (disabledEff) return;
		event.preventDefault();
		if (suppressNextMenuEvent) {
			suppressNextMenuEvent = false;
			return;
		}
		if (state.open) {
			// Re-anchor the open menu instead of stacking opens.
			state.setAnchor({ x: event.clientX, y: event.clientY });
			return;
		}
		openAt(event.clientX, event.clientY);
	}

	function handlePointerDown(event: PointerEvent): void {
		if (disabledEff) return;
		if (event.pointerType === 'touch') {
			window.clearTimeout(longPressTimer);
			longPressTimer = window.setTimeout(() => {
				suppressNextMenuEvent = true;
				openAt(event.clientX, event.clientY);
			}, 500);
			return;
		}
		// Left press inside the area dismisses an open menu.
		if (event.button === 0 && state.open) state.dismiss();
	}

	function cancelLongPress(): void {
		window.clearTimeout(longPressTimer);
	}
</script>

<div
	{...rest}
	bind:this={ref}
	data-disabled={disabledEff ? '' : undefined}
	oncontextmenu={composeHandlers(rest.oncontextmenu, handleContextMenu)}
	onpointerdown={composeHandlers(rest.onpointerdown, handlePointerDown)}
	onpointerup={composeHandlers(rest.onpointerup, cancelLongPress)}
	onpointermove={composeHandlers(rest.onpointermove, cancelLongPress)}
	onpointercancel={composeHandlers(rest.onpointercancel, cancelLongPress)}
>
	{@render children?.()}
</div>

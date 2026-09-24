<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface RootProps extends HTMLAttributes<HTMLDivElement> {
		/** Fired with the next state whenever the toast opens or closes. */
		onOpenChange?: ((open: boolean) => void) | undefined;
		/** Delegated access to the toast element. */
		ref?: HTMLDivElement | undefined;
		/** Shown by default for uncontrolled usage. @default true */
		defaultOpen?: boolean;
		children?: Snippet;
		/**
		 * Auto-dismiss delay in ms. Falls back to the provider timeout.
		 * Non-finite or non-positive values never auto-dismiss.
		 */
		duration?: number;
		/** Whether the toast is shown (controlled). */
		open?: boolean;
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getToastProviderState } from './context.js';
	import { setToastRootState } from './root-context.js';

	type RootPointerEvent = Parameters<NonNullable<RootProps['onpointerdown']>>[0];
	type RootFocusEvent = Parameters<NonNullable<RootProps['onfocusout']>>[0];

	const provider = getToastProviderState();

	let {
		defaultOpen = true,
		open = $bindable(defaultOpen),
		duration = undefined,
		onOpenChange = undefined,
		ref = $bindable<HTMLDivElement | undefined>(undefined),
		children,
		...rest
	}: RootProps = $props();

	const limit = $derived(duration ?? provider.timeout);

	let timer: number | undefined = undefined;
	let deadline = 0;
	let remaining = 0;
	let dragging = false;
	let dragStartX = 0;

	function clearTimer(): void {
		window.clearTimeout(timer);
		timer = undefined;
	}

	function schedule(delay: number): void {
		clearTimer();
		remaining = delay;
		if (!Number.isFinite(delay) || delay <= 0) return;
		deadline = Date.now() + delay;
		timer = window.setTimeout(() => close(), delay);
	}

	function pause(): void {
		if (timer === undefined) return;
		remaining = Math.max(deadline - Date.now(), 0);
		clearTimer();
	}

	function resume(): void {
		if (!open || timer !== undefined) return;
		schedule(remaining);
	}

	function close(): void {
		clearTimer();
		onOpenChange?.(false);
		open = false;
	}

	onMount(() => {
		if (open) schedule(limit);
	});

	onDestroy(() => {
		clearTimer();
		stopTracking();
	});

	function handlePress(event: RootPointerEvent): void {
		if (dragging) return;
		dragging = true;
		dragStartX = event.clientX;
		window.addEventListener('pointermove', handleWindowMove);
		window.addEventListener('pointerup', handleWindowEnd);
		window.addEventListener('pointercancel', handleWindowEnd);
	}

	function handleWindowMove(event: PointerEvent): void {
		if (!dragging || !ref) return;
		ref.style.transform = `translateX(${event.clientX - dragStartX}px)`;
	}

	function handleWindowEnd(event: PointerEvent): void {
		if (!dragging) return;
		stopTracking();
		const delta = event.clientX - dragStartX;
		if (ref) ref.style.transform = '';
		if (Math.abs(delta) > 40) close();
	}

	function stopTracking(): void {
		dragging = false;
		window.removeEventListener('pointermove', handleWindowMove);
		window.removeEventListener('pointerup', handleWindowEnd);
		window.removeEventListener('pointercancel', handleWindowEnd);
	}

	function handleLeave(): void {
		resume();
	}

	function handleBlur(event: RootFocusEvent): void {
		if (event.relatedTarget instanceof Element && ref?.contains(event.relatedTarget) === true)
			return;
		resume();
	}

	setToastRootState({
		closeToast: close
	});
</script>

{#if open}
	<div
		{...rest}
		bind:this={ref}
		role="status"
		data-state="open"
		style={`touch-action: pan-y;${typeof rest.style === 'string' ? rest.style : ''}`}
		onpointerdown={composeHandlers(rest.onpointerdown, handlePress)}
		onpointerenter={composeHandlers(rest.onpointerenter, pause)}
		onpointerleave={composeHandlers(rest.onpointerleave, handleLeave)}
		onfocusin={composeHandlers(rest.onfocusin, pause)}
		onfocusout={composeHandlers(rest.onfocusout, handleBlur)}
	>
		{@render children?.()}
	</div>
{/if}

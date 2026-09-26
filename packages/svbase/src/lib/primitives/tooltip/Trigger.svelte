<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLAttributes<HTMLElement> {
		/** Delegated access to the trigger element. */
		ref?: HTMLElement | undefined;
		/**
		 * Opening skips the delay when another tooltip closed within this
		 * many ms (shared across items, no provider needed).
		 * @default 400
		 */
		skipDelayDuration?: number;
		/** Close delay in ms after pointer leave. @default 0 */
		closeDelay?: number;
		children?: Snippet;
		/** Underlying element tag. @default 'span' */
		element?: string;
		/** Hover open delay in ms. @default 600 */
		delay?: number;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';

	import { getTooltipState } from './context.js';
	import { markTooltipClosed, shouldSkipDelay } from './delay.js';

	const state = getTooltipState();

	let {
		element = 'span',
		delay = 600,
		closeDelay = 0,
		skipDelayDuration = 400,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	let openTimer: number | undefined = undefined;
	let closeTimer: number | undefined = undefined;

	onDestroy(() => {
		// SSR runs destroy callbacks: nothing was ever scheduled server-side.
		if (typeof window === 'undefined') return;
		window.clearTimeout(openTimer);
		window.clearTimeout(closeTimer);
	});

	function cancelTimers(): void {
		window.clearTimeout(openTimer);
		window.clearTimeout(closeTimer);
		openTimer = undefined;
		closeTimer = undefined;
	}

	function scheduleOpen(): void {
		if (state.disabled) return;
		cancelTimers();
		if (shouldSkipDelay(Date.now(), skipDelayDuration)) {
			state.openTooltip();
			return;
		}
		if (delay <= 0) {
			state.openTooltip();
			return;
		}
		openTimer = window.setTimeout(() => state.openTooltip(), delay);
	}

	function scheduleClose(): void {
		cancelTimers();
		if (closeDelay <= 0) {
			closeNow();
			return;
		}
		closeTimer = window.setTimeout(() => closeNow(), closeDelay);
	}

	function closeNow(): void {
		markTooltipClosed();
		state.closeTooltip();
	}

	function handleEnter(): void {
		scheduleOpen();
	}

	function handleLeave(): void {
		scheduleClose();
	}

	function handleFocus(): void {
		if (state.disabled) return;
		cancelTimers();
		state.openTooltip();
	}

	function handleBlur(): void {
		cancelTimers();
		closeNow();
	}

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerTrigger(ref);
		return () => state.registerTrigger(undefined);
	});
</script>

<svelte:element
	this={element}
	{...rest}
	bind:this={ref}
	tabindex={rest.tabindex ?? 0}
	aria-describedby={state.open ? state.contentId : undefined}
	data-state={state.open ? 'open' : 'closed'}
	onmouseenter={composeHandlers(rest.onmouseenter, handleEnter)}
	onmouseleave={composeHandlers(rest.onmouseleave, handleLeave)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
	onblur={composeHandlers(rest.onblur, handleBlur)}
	{@attach state.position.reference}
>
	{@render children?.()}
</svelte:element>

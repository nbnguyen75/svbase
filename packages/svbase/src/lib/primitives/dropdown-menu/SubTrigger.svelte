<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface SubTriggerProps extends HTMLAttributes<HTMLElement> {
		/** Delegated access to the trigger element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored (OR-ed with root). @default false */
		disabled?: boolean;
		/** Hover open delay in ms (click toggles immediately). @default 150 */
		openDelay?: number;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { createId } from '../../utils/id.js';
	import { Button } from '../button/index.js';

	import { getMenuContentState, getMenuRootState } from './context.js';

	type SubTriggerMouseEvent = Parameters<NonNullable<SubTriggerProps['onmouseenter']>>[0];
	type SubTriggerKeyboardEvent = Parameters<NonNullable<SubTriggerProps['onkeydown']>>[0];

	// Nearest content is the PARENT menu (SubRoot provides root, not content);
	// nearest root is the SUBMENU itself. Both wirings are intentional.
	const parentContent = getMenuContentState();
	const sub = getMenuRootState();

	let {
		disabled: disabledProp = false,
		openDelay = 150,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: SubTriggerProps = $props();

	const id = createId('menu-item');
	const disabled = $derived(disabledProp || sub.disabled);
	const highlighted = $derived(parentContent.highlightedId === id);

	const tabStop = $derived.by(() => {
		const order = parentContent.entries.filter((item) => !item.disabled);
		if (order.length === 0) return -1;
		const stop = order.find((item) => item.value === parentContent.highlightedId) ?? order[0];
		return stop?.value === id ? 0 : -1;
	});

	let openTimer: number | undefined = undefined;

	onDestroy(() => {
		// SSR runs destroy callbacks: nothing was ever scheduled server-side.
		if (typeof window === 'undefined') return;
		window.clearTimeout(openTimer);
	});

	onMount(() => {
		parentContent.register({
			value: id,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			},
			get label() {
				return ref?.textContent ?? '';
			},
			select: () => sub.toggleMenu()
		});
		return () => parentContent.unregister(id);
	});

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		sub.registerTrigger(ref);
		return () => sub.registerTrigger(undefined);
	});

	function scheduleOpen(): void {
		if (disabled) return;
		window.clearTimeout(openTimer);
		openTimer = window.setTimeout(() => sub.openMenu(), openDelay);
	}

	function handleLeave(event: SubTriggerMouseEvent): void {
		window.clearTimeout(openTimer);
		const next = event.relatedTarget;
		// Moving into the open submenu content keeps it open.
		if (next instanceof Element && next.closest('[role="menu"]') !== null) return;
		sub.dismiss();
	}

	function activate(): void {
		window.clearTimeout(openTimer);
		sub.toggleMenu();
	}

	function handleArrows(event: SubTriggerKeyboardEvent): void {
		if (event.key === 'ArrowRight' && !disabled) {
			event.preventDefault();
			sub.requestInitialFocus?.();
			sub.openMenu();
		}
	}

	function handleHover(): void {
		if (disabled || parentContent.highlightedId === id) return;
		parentContent.setHighlighted(id);
		ref?.focus({ preventScroll: true });
	}

	function handleFocus(): void {
		if (!disabled) parentContent.setHighlighted(id);
	}
</script>

<Button
	{...rest}
	element="span"
	role="menuitem"
	{disabled}
	bind:ref
	tabindex={tabStop}
	aria-haspopup="menu"
	aria-expanded={sub.open}
	data-highlighted={highlighted ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	{@attach sub.position.reference}
	onclick={composeHandlers(rest.onclick, activate)}
	onmouseenter={composeHandlers(rest.onmouseenter, scheduleOpen)}
	onmouseleave={composeHandlers(rest.onmouseleave, handleLeave)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
	onkeydown={composeHandlers(rest.onkeydown, handleArrows)}
>
	{@render children?.()}
</Button>

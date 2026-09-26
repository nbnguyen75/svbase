<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLButtonAttributes {
		/** Delegated access to the trigger element. */
		ref?: HTMLElement | undefined;
		/** Whether user interaction is ignored (OR-ed with root). @default false */
		disabled?: boolean;
		children?: Snippet;
		/** Underlying element tag, forwarded to Button. @default 'button' */
		element?: string;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getSelectRootState } from './context.js';

	type TriggerKeyboardEvent = Parameters<NonNullable<TriggerProps['onkeydown']>>[0];

	const state = getSelectRootState();

	let {
		disabled: disabledProp = false,
		element = 'button',
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const disabled = $derived(disabledProp || state.disabled);

	let searchBuffer = '';
	let searchTimer: number | undefined = undefined;

	onDestroy(() => {
		// SSR runs destroy callbacks: nothing was ever scheduled server-side.
		if (typeof window === 'undefined') return;
		window.clearTimeout(searchTimer);
	});

	/**
	 * Element registration lives in an effect (not `onMount`): `bind:this`
	 * into a `$bindable` prop flushes after mount, so only a reactive read
	 * observes it. Writes go to an untracked field — no update loop.
	 */
	$effect(() => {
		state.registerTrigger(ref);
		return () => state.registerTrigger(undefined);
	});

	function activate(): void {
		state.toggleMenu();
	}

	function selectStep(delta: 1 | -1): void {
		const enabled = state.entries.filter((item) => !item.disabled);
		if (enabled.length === 0) return;
		const current = enabled.findIndex((item) => item.value === state.value);
		const at = current === -1 ? (delta === 1 ? -1 : 0) : current;
		const next = enabled[(at + delta + enabled.length) % enabled.length];
		if (next && next.value !== state.value) state.select(next.value);
	}

	function selectEdge(first: boolean): void {
		const enabled = state.entries.filter((item) => !item.disabled);
		const target = first ? enabled[0] : enabled[enabled.length - 1];
		if (target && target.value !== state.value) state.select(target.value);
	}

	function handleKeys(event: TriggerKeyboardEvent): void {
		if (disabled) return;
		// With the list open, arrows/Home/End move focus into it instead of
		// changing the selection behind it. Enter/Space activation flows
		// through the native click path (single toggle, consumer onclick intact).
		if (state.open) {
			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp':
				case 'ArrowLeft':
				case 'ArrowRight':
				case 'Home':
				case 'End':
					event.preventDefault();
					state.focusHighlighted();
					return;
				case 'Enter':
				case ' ':
					state.requestInitialFocus();
					return;
			}
			return;
		}
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectStep(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				selectStep(-1);
				return;
			case 'Home':
				event.preventDefault();
				selectEdge(true);
				return;
			case 'End':
				event.preventDefault();
				selectEdge(false);
				return;
			case 'Enter':
			case ' ':
				state.requestInitialFocus();
				return;
		}
		if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			searchBuffer += event.key.toLowerCase();
			window.clearTimeout(searchTimer);
			searchTimer = window.setTimeout(() => {
				searchBuffer = '';
			}, 1000);
			const match = state.findMatch(searchBuffer, state.value ?? '');
			if (match !== undefined && match !== state.value) state.select(match);
		}
	}
</script>

<Button
	{...rest}
	{element}
	{disabled}
	bind:ref
	role="combobox"
	aria-haspopup="listbox"
	aria-expanded={state.open}
	aria-controls={state.open ? state.contentId : undefined}
	data-state={state.open ? 'open' : 'closed'}
	{@attach state.position.reference}
	onclick={composeHandlers(rest.onclick, activate)}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
>
	{@render children?.()}
</Button>

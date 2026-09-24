<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLButtonAttributes {
		/** Delegated access to the trigger element. */
		ref?: HTMLElement | undefined;
		/** Whether the tab is skipped by interaction and navigation. @default false */
		disabled?: boolean;
		children?: Snippet;
		/** The tab's value — selects the panel with the same value. */
		value: string;
		/** Overrides the generated id (panel links to it). */
		id?: string;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { Button } from '../button/index.js';

	import { getTabsListState, getTabsRootState, getTabIds } from './context.js';

	type TriggerPointerEvent = Parameters<NonNullable<TriggerProps['onpointerdown']>>[0];

	const root = getTabsRootState();
	const list = getTabsListState();

	let {
		value,
		disabled: disabledProp = false,
		id = undefined,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const disabled = $derived(disabledProp || root.disabled);
	const active = $derived(root.value === value);
	const ids = $derived(getTabIds(root.rootId, value));

	const tabStop = $derived.by(() => {
		if (disabled) return -1;
		if (list.focusedValue !== undefined) return list.focusedValue === value ? 0 : -1;
		return active ? 0 : -1;
	});

	// Suppress focus-activation after a non-primary press (e.g. right-click
	// focuses without selecting). Consumed by the next focus, whichever kind.
	let suppressFocusActivation = false;

	onMount(() => {
		list.register({
			value,
			get disabled() {
				return disabled;
			},
			get element() {
				return ref;
			}
		});
		return () => list.unregister(value);
	});

	/**
	 * Element needs no registration beyond the list entry (roving reads the
	 * live getter), so unlike anchored parts no reactive ref tracking here.
	 */
	function activate(): void {
		if (!disabled && !active) root.select(value);
	}

	function handleFocus(): void {
		list.setFocusedValue(value);
		if (disabled || active) return;
		if (list.activation === 'automatic' && !suppressFocusActivation) root.select(value);
		suppressFocusActivation = false;
	}

	function handleBlur(): void {
		if (list.focusedValue === value) list.setFocusedValue(undefined);
	}

	function handlePointerDown(event: TriggerPointerEvent): void {
		if (event.button !== 0) suppressFocusActivation = true;
	}
</script>

<Button
	{...rest}
	bind:ref
	role="tab"
	id={id ?? ids.tabId}
	aria-selected={active}
	aria-controls={ids.panelId}
	tabindex={tabStop}
	{disabled}
	data-state={active ? 'active' : 'inactive'}
	onclick={composeHandlers(rest.onclick, activate)}
	onfocus={composeHandlers(rest.onfocus, handleFocus)}
	onblur={composeHandlers(rest.onblur, handleBlur)}
	onpointerdown={composeHandlers(rest.onpointerdown, handlePointerDown)}
>
	{@render children?.()}
</Button>

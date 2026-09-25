<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (OR-ed with item + menu). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { getMenuRootState } from '../dropdown-menu/index.js';
	import { Trigger as MenubarTrigger, getMenubarState } from '../menubar/index.js';
	import { getMenubarMenuValue } from '../menubar/menu-context.js';

	import { getNavigationMenuState } from './context.js';

	let {
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const nav = getNavigationMenuState();
	const menu = getMenuRootState();
	const menuValue = getMenubarMenuValue().value;

	const disabled = $derived(disabledProp || nav.disabled);

	function handleEnter(): void {
		nav.enterTrigger(menuValue);
	}

	function handleLeave(): void {
		nav.leaveTrigger(() => menu.dismiss());
	}
</script>

<MenubarTrigger
	{...rest}
	{disabled}
	bind:ref
	onpointerenter={composeHandlers(rest.onpointerenter, handleEnter)}
	onpointerleave={composeHandlers(rest.onpointerleave, handleLeave)}
	onfocus={composeHandlers(rest.onfocus, handleEnter)}
>
	{@render children?.()}
</MenubarTrigger>

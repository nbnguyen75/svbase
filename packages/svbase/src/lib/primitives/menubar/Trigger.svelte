<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLAttributes<HTMLElement> {
		ref?: HTMLElement | undefined;
		children?: Snippet;
		/** Whether user interaction is ignored (OR-ed with menu + menubar). @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { composeHandlers } from '../../utils/compose-handlers.js';
	import { getMenuRootState } from '../dropdown-menu/index.js';

	import { getMenubarState } from './context.js';
	import { getMenubarMenuValue } from './menu-context.js';

	let {
		disabled: disabledProp = false,
		ref = $bindable<HTMLElement | undefined>(undefined),
		children,
		...rest
	}: TriggerProps = $props();

	const menubar = getMenubarState();
	const menu = getMenuRootState();
	const menuValue = getMenubarMenuValue().value;

	const disabled = $derived(disabledProp || menubar.disabled || menu.disabled);

	type TriggerKeyboardEvent = Parameters<NonNullable<TriggerProps['onkeydown']>>[0];

	onMount(() => {
		menubar.registerTrigger({ menuValue, element: ref });
		menu.registerTrigger(ref);
		return () => {
			menubar.unregisterTrigger(menuValue);
			menu.registerTrigger(undefined);
		};
	});

	function handleKeys(event: TriggerKeyboardEvent): void {
		if (disabled) return;
		switch (event.key) {
			// Explicit activation with default prevented: a div has no native
			// activation, so real and synthetic events behave identically.
			case 'ArrowDown':
			case 'Enter':
			case ' ':
				event.preventDefault();
				menu.openMenu();
				return;
			default:
				menubar.moveFocus(menuValue, event.key, event.currentTarget as HTMLElement);
				return;
		}
	}

	function handleClick(): void {
		if (disabled) return;
		menu.toggleMenu();
	}

	function switchIfOpen(): void {
		if (disabled) return;
		if (menubar.openMenuValue !== undefined) menubar.requestOpen(menuValue);
	}
</script>

<div
	{...rest}
	bind:this={ref}
	role="menuitem"
	tabindex={disabled ? -1 : 0}
	aria-haspopup="menu"
	aria-expanded={menu.open}
	aria-controls={menu.open ? menu.contentId : undefined}
	aria-disabled={disabled ? 'true' : undefined}
	data-state={menu.open ? 'open' : 'closed'}
	data-disabled={disabled ? '' : undefined}
	{@attach menu.position.reference}
	onclick={composeHandlers(rest.onclick, handleClick)}
	onkeydown={composeHandlers(rest.onkeydown, handleKeys)}
	onmouseenter={composeHandlers(rest.onmouseenter, switchIfOpen)}
	onfocus={composeHandlers(rest.onfocus, switchIfOpen)}
>
	{@render children?.()}
</div>

<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface MenuProps {
		children?: Snippet;
		/** Unique menu id within the menubar. */
		value: string;
		/** Whether user interaction is ignored. @default false */
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { Root as MenuRoot } from '../dropdown-menu/index.js';

	import { getMenubarState } from './context.js';
	import { setMenubarMenuValue } from './menu-context.js';

	let { value, disabled = false, children }: MenuProps = $props();

	const menubar = getMenubarState();

	setMenubarMenuValue({
		get value() {
			return value;
		}
	});

	let menuOpen = $state(false);

	function handleOpenChange(next: boolean): void {
		if (next) menubar.requestOpen(value);
		else if (menubar.openMenuValue === value) menubar.notifyClosed(value);
	}

	function openMenu(): void {
		if (!disabled) menuOpen = true;
	}

	function closeMenu(): void {
		menuOpen = false;
	}

	function focusTrigger(): void {
		menubar.focusMenuTrigger(value);
	}

	onMount(() => {
		menubar.registerMenu({
			get value() {
				return value;
			},
			get disabled() {
				return disabled;
			},
			openMenu,
			closeMenu,
			focusTrigger
		});
		return () => menubar.unregisterMenu(value);
	});
</script>

<MenuRoot bind:open={menuOpen} {disabled} onOpenChange={handleOpenChange}>
	{@render children?.()}
</MenuRoot>
